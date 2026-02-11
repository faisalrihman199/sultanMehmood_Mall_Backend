const { CartItem, Product, Shop } = require('../models');

class CartService {
  async getCart({ user_id, session_id }) {
    const where = {};
    if (user_id) where.user_id = user_id;
    else if (session_id) where.session_id = session_id;
    else return { items: [], total: 0 };

    const items = await CartItem.findAll({
      where,
      include: [{
        model: Product,
        as: 'product',
        include: [{ model: Shop, as: 'shop', attributes: ['id', 'name'] }],
      }],
      order: [['created_at', 'DESC']],
    });

    const total = items.reduce((sum, item) => {
      const price = item.product.sale_price || item.product.price;
      return sum + (parseFloat(price) * item.quantity);
    }, 0);

    return { items, total: Math.round(total * 100) / 100, count: items.length };
  }

  async addToCart({ user_id, session_id, product_id, quantity = 1 }) {
    const product = await Product.findByPk(product_id);
    if (!product || !product.is_active) throw { status: 404, message: 'Product not found' };
    if (product.stock < quantity) throw { status: 400, message: 'Insufficient stock' };

    const where = { product_id };
    if (user_id) where.user_id = user_id;
    else if (session_id) where.session_id = session_id;

    let cartItem = await CartItem.findOne({ where });
    if (cartItem) {
      cartItem.quantity += quantity;
      if (cartItem.quantity > product.stock) throw { status: 400, message: 'Insufficient stock' };
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ user_id, session_id, product_id, quantity });
    }

    return this.getCart({ user_id, session_id });
  }

  async updateCartItem({ user_id, session_id, product_id, quantity }) {
    const where = { product_id };
    if (user_id) where.user_id = user_id;
    else if (session_id) where.session_id = session_id;

    const cartItem = await CartItem.findOne({ where });
    if (!cartItem) throw { status: 404, message: 'Item not in cart' };

    if (quantity <= 0) {
      await cartItem.destroy();
    } else {
      const product = await Product.findByPk(product_id);
      if (quantity > product.stock) throw { status: 400, message: 'Insufficient stock' };
      cartItem.quantity = quantity;
      await cartItem.save();
    }

    return this.getCart({ user_id, session_id });
  }

  async removeFromCart({ user_id, session_id, product_id }) {
    const where = { product_id };
    if (user_id) where.user_id = user_id;
    else if (session_id) where.session_id = session_id;

    await CartItem.destroy({ where });
    return this.getCart({ user_id, session_id });
  }

  async clearCart({ user_id, session_id }) {
    const where = {};
    if (user_id) where.user_id = user_id;
    else if (session_id) where.session_id = session_id;
    await CartItem.destroy({ where });
    return { items: [], total: 0, count: 0 };
  }

  async mergeGuestCart(session_id, user_id) {
    const guestItems = await CartItem.findAll({ where: { session_id } });
    for (const item of guestItems) {
      const existing = await CartItem.findOne({ where: { user_id, product_id: item.product_id } });
      if (existing) {
        existing.quantity += item.quantity;
        await existing.save();
        await item.destroy();
      } else {
        item.user_id = user_id;
        item.session_id = null;
        await item.save();
      }
    }
    return this.getCart({ user_id });
  }
}

module.exports = new CartService();
