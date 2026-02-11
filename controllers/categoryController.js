const shopService = require('../services/shopService');
const productService = require('../services/productService');

exports.getShopCategories = async (req, res) => {
  try {
    const categories = await shopService.getShopCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.createShopCategory = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const category = await shopService.createShopCategory(data);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.updateShopCategory = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const category = await shopService.updateShopCategory(req.params.id, data);
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.deleteShopCategory = async (req, res) => {
  try {
    const result = await shopService.deleteShopCategory(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.getProductCategories = async (req, res) => {
  try {
    const { shop_id } = req.query;
    const categories = await productService.getProductCategories(shop_id);
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.createProductCategory = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const category = await productService.createProductCategory(data);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.updateProductCategory = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const category = await productService.updateProductCategory(req.params.id, data);
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.deleteProductCategory = async (req, res) => {
  try {
    const result = await productService.deleteProductCategory(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};
