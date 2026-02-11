const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { auth, optionalAuth, adminOnly } = require('../middlewares/auth');

router.post('/', optionalAuth, orderController.createOrder);
router.get('/my', auth, orderController.getMyOrders);
router.get('/:id', auth, orderController.getOrderById);

module.exports = router;
