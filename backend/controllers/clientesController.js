const { pool } = require('../config/db');

exports.obtenerClientes = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT c.*, 
            (SELECT COUNT(*) FROM pedidos p WHERE p.id_cliente = c.id_cliente) as total_pedidos,
            (SELECT MAX(fecha_hora) FROM pedidos p WHERE p.id_cliente = c.id_cliente) as ultima_compra
            FROM clientes c 
            ORDER BY c.nombre ASC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener clientes' });
    }
};

// Editar Cliente
exports.actualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, telefono, direccion, referencia } = req.body;
        await pool.execute(
            'UPDATE clientes SET nombre = ?, telefono = ?, direccion = ?, referencia = ? WHERE id_cliente = ?',
            [nombre, telefono, direccion, referencia, id]
        );
        res.json({ message: 'Cliente actualizado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar' });
    }
};