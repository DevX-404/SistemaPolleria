const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const multer = require('multer');
const path = require('path');

// Configuración de Multer 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../frontend/public/img/'); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Rutas
router.post('/', upload.single('imagen'), productosController.crearProducto); 
router.get('/', productosController.obtenerProductos);
router.put('/:id', upload.single('imagen'), productosController.actualizarProducto);
router.delete('/:id', productosController.eliminarProducto);
router.get('/categorias', productosController.obtenerCategorias); 

module.exports = router;