const { pool } = require('../config/db');

// Crear Nuevo Pedido (Con Transacción)
exports.crearPedido = async (req, res) => {
    // Obtenemos una conexión específica para la transacción
    const connection = await pool.getConnection();

    try {
        const { id_cliente, tipo_venta, total_neto, costo_delivery, total_final, metodo_pago, productos, id_vendedor, datos_cliente_delivery } = req.body;

        await connection.beginTransaction(); // Inicia la transacción

        let clienteFinalId = id_cliente;

        // 1. Si es Delivery y no hay ID de cliente, creamos o buscamos al cliente rápido
        if (tipo_venta === 'delivery' && !clienteFinalId && datos_cliente_delivery) {
            const { nombre, telefono, direccion, referencia } = datos_cliente_delivery;
            
            // Verificamos si ya existe por teléfono
            const [rows] = await connection.execute('SELECT id_cliente FROM clientes WHERE telefono = ?', [telefono]);
            
            if (rows.length > 0) {
                clienteFinalId = rows[0].id_cliente;
                // Opcional: Actualizar dirección si cambió
            } else {
                const [newClient] = await connection.execute(
                    'INSERT INTO clientes (nombre, telefono, direccion, referencia) VALUES (?, ?, ?, ?)',
                    [nombre, telefono, direccion, referencia]
                );
                clienteFinalId = newClient.insertId;
            }
        }

        // 2. Insertar en tabla PEDIDOS
        const [pedidoResult] = await connection.execute(
            `INSERT INTO pedidos (fecha_hora, id_cliente, tipo_venta, total_neto, costo_delivery, total_final, metodo_pago, estado, id_vendedor) 
             VALUES (NOW(), ?, ?, ?, ?, ?, ?, 'pendiente', ?)`,
            [clienteFinalId, tipo_venta, total_neto, costo_delivery || 0, total_final, metodo_pago, id_vendedor]
        );

        const idPedido = pedidoResult.insertId;

        // 3. Insertar DETALLES (Productos)
        const detalleQueries = productos.map(prod => {
            return connection.execute(
                `INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario, subtotal) 
                 VALUES (?, ?, ?, ?, ?)`,
                [idPedido, prod.id_producto, prod.cantidad, prod.precio, prod.subtotal]
            );
        });

        await Promise.all(detalleQueries); // Ejecuta todas las inserciones de detalles

        // 4. Confirmar todo
        await connection.commit();

        res.status(201).json({ message: 'Pedido registrado con éxito', id_pedido: idPedido });

    } catch (error) {
        await connection.rollback(); // Si falla, deshace todo
        console.error('Error en transacción de pedido:', error);
        res.status(500).json({ message: 'Error al procesar el pedido' });
    } finally {
        connection.release(); // Libera la conexión
    }
};

// Listar Pedidos (Para el Dashboard o Cocina)
exports.obtenerPedidos = async (req, res) => {
    try {
        const [pedidos] = await pool.query(`
            SELECT p.*, c.nombre as nombre_cliente, c.direccion 
            FROM pedidos p 
            LEFT JOIN clientes c ON p.id_cliente = c.id_cliente 
            ORDER BY p.fecha_hora DESC LIMIT 50
        `);
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener pedidos' });
    }
};