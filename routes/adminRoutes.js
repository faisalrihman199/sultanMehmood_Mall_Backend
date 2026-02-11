const router = require('express').Router();
const adminController = require('../controllers/adminController');
const orderController = require('../controllers/orderController');
const { auth, adminOnly } = require('../middlewares/auth');

router.use(auth, adminOnly);

router.get('/dashboard', adminController.getDashboard);
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/toggle', adminController.toggleUserStatus);
router.get('/orders', orderController.getAllOrders);
router.put('/orders/:id/status', orderController.updateOrderStatus);
router.get('/orders/stats', orderController.getOrderStats);

module.exports = router;
