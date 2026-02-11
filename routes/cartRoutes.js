const router = require('express').Router();
const cartController = require('../controllers/cartController');
const { auth, optionalAuth } = require('../middlewares/auth');

router.get('/', optionalAuth, cartController.getCart);
router.post('/', optionalAuth, cartController.addToCart);
router.put('/:productId', optionalAuth, cartController.updateCartItem);
router.delete('/:productId', optionalAuth, cartController.removeFromCart);
router.delete('/', optionalAuth, cartController.clearCart);
router.post('/merge', auth, cartController.mergeCart);

module.exports = router;
