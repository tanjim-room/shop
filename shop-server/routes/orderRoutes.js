const express = require('express');
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getAdminStats,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.patch('/:id/status', updateOrderStatus);
router.get('/admin/stats', getAdminStats);

module.exports = router;
