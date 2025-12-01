const { pool } = require('../config/db');

// --- C: Crear Producto (Create) ---
exports.crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, categoria, imagen_path, stock } = req.body;
        
        // Validación básica
        if (!nombre || !precio || !categoria) {
            return res.status(400).json({ message: 'Nombre, precio y categoría son obligatorios.' });
        }

        const [result] = await pool.execute(
            'INSERT INTO productos (nombre, descripcion, precio, categoria, imagen_path, stock) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, categoria, imagen_path, stock]
        );

        res.status(201).json({ 
            message: 'Producto creado con éxito', 
            id_producto: result.insertId 
        });

    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear producto.' });
    }
};

// --- R: Obtener Todos los Productos (Read All) ---
exports.obtenerProductos = async (req, res) => {
    try {
        const [productos] = await pool.query('SELECT * FROM productos WHERE activo = TRUE ORDER BY categoria, nombre');
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener productos.' });
    }
};

// --- U: Actualizar Producto (Update) ---
exports.actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, categoria, imagen_path, stock } = req.body;

        const [result] = await pool.execute(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, imagen_path = ?, stock = ? WHERE id_producto = ?',
            [nombre, descripcion, precio, categoria, imagen_path, stock, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        res.status(200).json({ message: 'Producto actualizado con éxito.' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar producto.' });
    }
};

// --- D: Eliminar (Desactivar) Producto (Delete - Soft Delete) ---
exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            'UPDATE productos SET activo = FALSE WHERE id_producto = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        res.status(200).json({ message: 'Producto desactivado (eliminado lógicamente) con éxito.' });
    } catch (error) {
        console.error('Error al desactivar producto:', error);
        res.status(500).json({ message: 'Error interno del servidor al desactivar producto.' });
    }
};

exports.obtenerCategorias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT DISTINCT categoria FROM productos ORDER BY categoria');
        const categorias = rows.map(r => r.categoria);
        res.json(categorias);
    } catch (e) { res.status(500).json({message: 'Error'}); }
};

exports.crearProducto = async (req, res) => {
    try {
        // Multer pone la info del archivo en req.file y los campos de texto en req.body
        const { nombre, descripcion, precio, categoria, stock } = req.body;
        const imagen_path = req.file ? req.file.filename : 'default.jpg';

        const [result] = await pool.execute(
            'INSERT INTO productos (nombre, descripcion, precio, categoria, imagen_path, stock) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, categoria, imagen_path, stock]
        );
        res.status(201).json({ message: 'Producto creado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear' });
    }
};