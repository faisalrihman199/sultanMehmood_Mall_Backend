const router = require('express').Router();
const shopController = require('../controllers/shopController');
const { auth, adminOnly } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', shopController.getAllShops);
router.get('/:id', shopController.getShopById);
router.post('/', auth, adminOnly, upload.single('image'), shopController.createShop);
router.put('/:id', auth, adminOnly, upload.single('image'), shopController.updateShop);
router.delete('/:id', auth, adminOnly, shopController.deleteShop);

module.exports = router;
