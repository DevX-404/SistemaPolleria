const { pool } = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Ventas de Hoy (Suma total de pedidos entregados hoy)
        const [ventasHoy] = await pool.query(`
            SELECT SUM(total_final) as total, COUNT(*) as cantidad 
            FROM pedidos 
            WHERE DATE(fecha_hora) = CURDATE() AND estado = 'entregado_pagado'
        `);

        // 2. Pedidos Pendientes (Para alerta)
        const [pendientes] = await pool.query(`
            SELECT COUNT(*) as total FROM pedidos WHERE estado = 'pendiente'
        `);

        // 3. Top 5 Productos más vendidos del mes
        const [topProductos] = await pool.query(`
            SELECT p.nombre, SUM(dp.cantidad) as vendidos
            FROM detalle_pedido dp
            JOIN pedidos ped ON dp.id_pedido = ped.id_pedido
            JOIN productos p ON dp.id_producto = p.id_producto
            WHERE MONTH(ped.fecha_hora) = MONTH(CURRENT_DATE())
            GROUP BY p.id_producto
            ORDER BY vendidos DESC
            LIMIT 5
        `);

        res.json({
            ventas_hoy: ventasHoy[0].total || 0,
            pedidos_hoy: ventasHoy[0].cantidad || 0,
            pendientes: pendientes[0].total || 0,
            top_productos: topProductos
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
};