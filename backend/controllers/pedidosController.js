const { pool } = require('../config/db');

// Crear Nuevo Pedido (Con Transacción)
exports.crearPedido = async (req, res) => {

    // --- BLOQUE DE DEPURACIÓN (MUESTRA QUÉ LLEGA) ---
    console.log("---- DATOS RECIBIDOS EN BACKEND ----");
    console.log("Body:", req.body);
    console.log("Datos Delivery:", req.body.datos_cliente_delivery);
    // --------------------------------------------------
    const connection = await pool.getConnection();

    try {
        console.log("📦 Procesando pedido..."); // Log para saber que entró

        // 1. Desestructuración con valores por defecto (Nivel 1 de seguridad)
        const { 
            id_cliente = null, 
            tipo_venta = 'local', 
            total_neto = 0, 
            costo_delivery = 0, 
            total_final = 0, 
            metodo_pago = 'efectivo', 
            productos = [], 
            id_vendedor = 1, 
            datos_cliente_delivery = null 
        } = req.body;

        await connection.beginTransaction();

        let clienteFinalId = id_cliente;

        // 2. Lógica Delivery
        if (tipo_venta === 'delivery' && datos_cliente_delivery) {
            // Aseguramos que NINGÚN campo sea undefined (Nivel 2 de seguridad)
            const nombre = datos_cliente_delivery.nombre || 'Cliente Sin Nombre';
            const telefono = datos_cliente_delivery.telefono || '';
            const direccion = datos_cliente_delivery.direccion || '';
            const referencia = datos_cliente_delivery.referencia || ''; // ¡Aquí solía fallar!

            // Buscar cliente
            const [rows] = await connection.execute('SELECT id_cliente FROM clientes WHERE telefono = ?', [telefono]);
            
            if (rows.length > 0) {
                clienteFinalId = rows[0].id_cliente;
                await connection.execute(
                    'UPDATE clientes SET direccion = ?, nombre = ? WHERE id_cliente = ?', 
                    [direccion, nombre, clienteFinalId]
                );
            } else {
                const [newClient] = await connection.execute(
                    'INSERT INTO clientes (nombre, telefono, direccion, referencia) VALUES (?, ?, ?, ?)',
                    [nombre, telefono, direccion, referencia] 
                );
                clienteFinalId = newClient.insertId;
            }
        }

        // 3. Insertar Pedido
        const val_id_cliente = clienteFinalId || null;
        const val_tipo_venta = tipo_venta || 'local';
        const val_total_neto = total_neto || 0;
        const val_costo_delivery = costo_delivery || 0;
        const val_total_final = total_final || 0;
        const val_metodo_pago = metodo_pago || 'efectivo';
        const val_id_vendedor = id_vendedor || 1;
        
        // NUEVO: Recibir referencia (puede ser el vuelto o el código de yape)
        const val_referencia = req.body.referencia_pago || ''; 

        const [pedidoResult] = await connection.execute(
            `INSERT INTO pedidos (fecha_hora, id_cliente, tipo_venta, total_neto, costo_delivery, total_final, metodo_pago, referencia_pago, estado, id_vendedor) 
             VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, 'pendiente', ?)`, // <--- Agregamos un ? más
            [
                val_id_cliente, 
                val_tipo_venta, 
                val_total_neto, 
                val_costo_delivery, 
                val_total_final, 
                val_metodo_pago, 
                val_referencia, // <--- Enviamos la referencia
                val_id_vendedor
            ]
        );

        const idPedido = pedidoResult.insertId;

        // 4. Detalles
        if (!productos || productos.length === 0) throw new Error('Carrito vacío');

        const detalleQueries = productos.map(prod => {
            // Aseguramos valores de producto
            const p_id = prod.id_producto;
            const p_cant = prod.cantidad || 1;
            const p_precio = prod.precio || 0;
            const p_subtotal = prod.subtotal || (p_precio * p_cant);

            return connection.execute(
                `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal) 
                 VALUES (?, ?, ?, ?, ?)`,
                [idPedido, p_id, p_cant, p_precio, p_subtotal]
            );
        });

        await Promise.all(detalleQueries);

        await connection.commit();
        console.log(`✅ Pedido #${idPedido} creado con éxito.`);
        
        // CORRECCIÓN: Asegurar que la respuesta sea simple y directa
        // A veces devolver JSONs complejos causa problemas si hay referencias circulares (no es el caso aquí, pero prevenimos)
        return res.status(201).json({ 
            message: 'Exito', 
            id_pedido: idPedido 
        });

    } catch (error) {
        if (connection) await connection.rollback(); // Verificar connection existe
        console.error('❌ Error CRÍTICO en crearPedido:', error);
        
        // Evitar enviar respuesta si ya se envió (headers sent)
        if (!res.headersSent) {
            return res.status(500).json({ message: error.message || 'Error interno' });
        }
    } finally {
        if (connection) connection.release();
    }
};

// LISTAR PEDIDOS (Con datos del cliente)
exports.obtenerPedidos = async (req, res) => {
    try {
        const [pedidos] = await pool.query(`
            SELECT p.*, c.nombre as nombre_cliente, c.direccion, c.telefono, u.nombre as nombre_vendedor 
            FROM pedidos p 
            LEFT JOIN clientes c ON p.id_cliente = c.id_cliente 
            LEFT JOIN usuarios u ON p.id_vendedor = u.id_usuario
            WHERE p.estado != 'entregado_pagado' AND p.estado != 'cancelado' -- Opcional: traer solo activos
            ORDER BY p.fecha_hora ASC  -- <--- CAMBIO AQUÍ
            LIMIT 50
        `);
        res.json(pedidos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener pedidos' });
    }
};

// ACTUALIZAR ESTADO (Flujo de vida del pedido)
exports.actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body; // Ej: 'en_camino', 'entregado'
        
        await pool.execute('UPDATE pedidos SET estado = ? WHERE id_pedido = ?', [estado, id]);
        
        res.json({ message: 'Estado actualizado correctamente', id_pedido: id, nuevo_estado: estado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar estado' });
    }
};

// Obtener ventas para reportes (SIN LÍMITE y solo pagadas)
exports.reporteVentas = async (req, res) => {
    try {
        // Traemos todas las ventas finalizadas, ordenadas por fecha (más recientes primero)
        const [ventas] = await pool.query(`
            SELECT p.*, c.nombre as nombre_cliente 
            FROM pedidos p 
            LEFT JOIN clientes c ON p.id_cliente = c.id_cliente 
            WHERE p.estado = 'entregado_pagado'
            ORDER BY p.fecha_hora DESC
        `);
        res.json(ventas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en reporte' });
    }
};