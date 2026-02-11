const orderService = require('../services/orderService');

exports.createOrder = async (req, res) => {
  try {
    const user_id = req.user ? req.user.id : null;
    const session_id = req.headers['x-session-id'] || null;
    const { customer_name, customer_phone, customer_email, delivery_address, latitude, longitude, payment_method, notes } = req.body;
    if (!customer_name || !customer_phone || !delivery_address) {
      return res.status(400).json({ success: false, message: 'Name, phone and delivery address are required' });
    }
    const order = await orderService.createOrder({
      user_id, session_id, customer_name, customer_phone, customer_email,
      delivery_address, latitude, longitude, payment_method, notes,
    });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await orderService.getUserOrders(req.user.id, { page, limit });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!req.user || (req.user.role !== 'admin' && order.user_id !== req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    const result = await orderService.getAllOrders({ status, page, limit });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: 'Status is required' });
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.getOrderStats = async (req, res) => {
  try {
    const stats = await orderService.getOrderStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};
