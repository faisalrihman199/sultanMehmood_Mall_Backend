const { User, Shop, Product, Order, ShopCategory, ProductCategory } = require('../models');
const orderService = require('../services/orderService');

exports.getDashboard = async (req, res) => {
  try {
    const stats = await orderService.getOrderStats();
    const totalProducts = await Product.count({ where: { is_active: true } });
    const totalShops = await Shop.count({ where: { is_active: true } });
    const totalUsers = await User.count({ where: { role: 'customer' } });
    res.json({
      success: true,
      data: { ...stats, totalProducts, totalShops, totalUsers },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ order: [['created_at', 'DESC']] });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.is_active = !user.is_active;
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
