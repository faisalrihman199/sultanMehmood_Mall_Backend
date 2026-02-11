const shopService = require('../services/shopService');

exports.getAllShops = async (req, res) => {
  try {
    const { category_id, search, page, limit } = req.query;
    const result = await shopService.getAllShops({ category_id, search, page, limit });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.getShopById = async (req, res) => {
  try {
    const shop = await shopService.getShopById(req.params.id);
    res.json({ success: true, data: shop });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.createShop = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const shop = await shopService.createShop(data);
    res.status(201).json({ success: true, data: shop });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.updateShop = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const shop = await shopService.updateShop(req.params.id, data);
    res.json({ success: true, data: shop });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.deleteShop = async (req, res) => {
  try {
    const result = await shopService.deleteShop(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};
