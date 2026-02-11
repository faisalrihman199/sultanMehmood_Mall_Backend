const productService = require('../services/productService');

exports.getAllProducts = async (req, res) => {
  try {
    const { shop_id, category_id, search, page, limit, min_price, max_price } = req.query;
    const result = await productService.getAllProducts({ shop_id, category_id, search, page, limit, min_price, max_price });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.getProductByBarcode = async (req, res) => {
  try {
    const product = await productService.getProductByBarcode(req.params.barcode);
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    if (data.price) data.price = parseFloat(data.price);
    if (data.sale_price) data.sale_price = parseFloat(data.sale_price);
    if (data.stock) data.stock = parseInt(data.stock);
    const product = await productService.createProduct(data);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    if (data.price) data.price = parseFloat(data.price);
    if (data.sale_price) data.sale_price = parseFloat(data.sale_price);
    if (data.stock) data.stock = parseInt(data.stock);
    const product = await productService.updateProduct(req.params.id, data);
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};
