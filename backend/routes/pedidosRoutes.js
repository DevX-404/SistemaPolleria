const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');

router.post('/', pedidosController.crearPedido);
router.get('/', pedidosController.obtenerPedidos);
router.put('/:id', pedidosController.actualizarEstado);

module.exports = router;