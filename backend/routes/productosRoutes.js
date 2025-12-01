const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const multer = require('multer');
const path = require('path');

// Configuración de Multer (Dónde guardar)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Asegúrate que esta ruta exista o apunte a frontend/public/img si están en la misma PC local dev
        // Para producción real se sirve estático desde backend, pero para este setup rápido:
        cb(null, '../frontend/public/img/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // ej: 123123-pollo.jpg
    }
});

const upload = multer({ storage: storage });

// Rutas
router.post('/', upload.single('imagen'), productosController.crearProducto); // <--- Middleware upload
router.get('/', productosController.obtenerProductos);
router.put('/:id', upload.single('imagen'), productosController.actualizarProducto);
router.delete('/:id', productosController.eliminarProducto);

// Ruta rápida para categorías (opcional si quieres guardarlas en una tabla aparte, 
// pero para hacerlo simple las guardaremos como string en la tabla productos y las listaremos con un DISTINCT)
router.get('/categorias', productosController.obtenerCategorias); 

module.exports = router;