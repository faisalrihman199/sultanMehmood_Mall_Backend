const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const { auth, adminOnly } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Shop categories
router.get('/shops', categoryController.getShopCategories);
router.post('/shops', auth, adminOnly, upload.single('image'), categoryController.createShopCategory);
router.put('/shops/:id', auth, adminOnly, upload.single('image'), categoryController.updateShopCategory);
router.delete('/shops/:id', auth, adminOnly, categoryController.deleteShopCategory);

// Product categories
router.get('/products', categoryController.getProductCategories);
router.post('/products', auth, adminOnly, upload.single('image'), categoryController.createProductCategory);
router.put('/products/:id', auth, adminOnly, upload.single('image'), categoryController.updateProductCategory);
router.delete('/products/:id', auth, adminOnly, categoryController.deleteProductCategory);

module.exports = router;
