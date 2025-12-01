const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// Rutas para el CRUD de Productos
router.post('/', productosController.crearProducto);        // POST /api/productos
router.get('/', productosController.obtenerProductos);       // GET /api/productos
router.put('/:id', productosController.actualizarProducto);  // PUT /api/productos/:id
router.delete('/:id', productosController.eliminarProducto); // DELETE /api/productos/:id

module.exports = router;