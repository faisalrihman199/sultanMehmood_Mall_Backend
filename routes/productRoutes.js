const router = require('express').Router();
const productController = require('../controllers/productController');
const { auth, adminOnly } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', productController.getAllProducts);
router.get('/barcode/:barcode', productController.getProductByBarcode);
router.get('/:id', productController.getProductById);
router.post('/', auth, adminOnly, upload.single('image'), productController.createProduct);
router.put('/:id', auth, adminOnly, upload.single('image'), productController.updateProduct);
router.delete('/:id', auth, adminOnly, productController.deleteProduct);

module.exports = router;
