const express = require('express');
const {
  createOrder,
  getPublicOrderById,
  getOrders,
  updateOrderStatus,
  getAdminStats,
} = require('../controllers/orderController');
const requireAdminAuth = require('../middleware/requireAdminAuth');

const router = express.Router();

router.post('/', createOrder);
router.get('/public/:id', getPublicOrderById);
router.get('/', requireAdminAuth, getOrders);
router.patch('/:id/status', requireAdminAuth, updateOrderStatus);
router.get('/admin/stats', requireAdminAuth, getAdminStats);

module.exports = router;
