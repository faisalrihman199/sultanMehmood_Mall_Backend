const cartService = require('../services/cartService');

exports.getCart = async (req, res) => {
  try {
    const user_id = req.user ? req.user.id : null;
    const session_id = req.headers['x-session-id'] || null;
    const result = await cartService.getCart({ user_id, session_id });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const user_id = req.user ? req.user.id : null;
    const session_id = req.headers['x-session-id'] || null;
    const { product_id, quantity } = req.body;
    if (!product_id) return res.status(400).json({ success: false, message: 'Product ID is required' });
    const result = await cartService.addToCart({ user_id, session_id, product_id, quantity });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const user_id = req.user ? req.user.id : null;
    const session_id = req.headers['x-session-id'] || null;
    const { quantity } = req.body;
    const product_id = parseInt(req.params.productId);
    const result = await cartService.updateCartItem({ user_id, session_id, product_id, quantity });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const user_id = req.user ? req.user.id : null;
    const session_id = req.headers['x-session-id'] || null;
    const product_id = parseInt(req.params.productId);
    const result = await cartService.removeFromCart({ user_id, session_id, product_id });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const user_id = req.user ? req.user.id : null;
    const session_id = req.headers['x-session-id'] || null;
    const result = await cartService.clearCart({ user_id, session_id });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

exports.mergeCart = async (req, res) => {
  try {
    const { session_id } = req.body;
    if (!session_id) return res.status(400).json({ success: false, message: 'Session ID required' });
    const result = await cartService.mergeGuestCart(session_id, req.user.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};
