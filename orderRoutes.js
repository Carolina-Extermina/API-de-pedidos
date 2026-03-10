const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /order (Criar)
router.post('/', orderController.createOrder);

// GET /order/:id (Ler por ID)
router.get('/:id', orderController.getOrderById);

// GET /order/list (Listar todos - Opcional)
router.get('/list', orderController.listOrders);

// PUT /order/:id (Atualizar - Opcional)
router.put('/:id', orderController.updateOrder);

// DELETE /order/:id (Excluir - Opcional)
router.delete('/:id', orderController.deleteOrder);

module.exports = router;