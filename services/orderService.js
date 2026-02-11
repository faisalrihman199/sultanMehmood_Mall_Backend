const { Order, OrderItem, CartItem, Product, User } = require('../models');
const sequelize = require('../config/database');

class OrderService {
  async createOrder({ user_id, session_id, customer_name, customer_phone, customer_email, delivery_address, latitude, longitude, payment_method, notes }) {
    const transaction = await sequelize.transaction();
    try {
      // Get cart items
      const cartWhere = {};
      if (user_id) cartWhere.user_id = user_id;
      else if (session_id) cartWhere.session_id = session_id;

      const cartItems = await CartItem.findAll({
        where: cartWhere,
        include: [{ model: Product, as: 'product' }],
        transaction,
      });

      if (cartItems.length === 0) throw { status: 400, message: 'Cart is empty' };

      // Calculate totals
      let subtotal = 0;
      const orderItems = [];

      for (const item of cartItems) {
        if (!item.product.is_active) throw { status: 400, message: `${item.product.name} is no longer available` };
        if (item.product.stock < item.quantity) throw { status: 400, message: `Insufficient stock for ${item.product.name}` };

        const price = parseFloat(item.product.sale_price || item.product.price);
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product_id: item.product_id,
          product_name: item.product.name,
          product_price: price,
          quantity: item.quantity,
          total: itemTotal,
        });
      }

      const service_fees = parseFloat(process.env.SERVICE_FEES || '50');
      const free_delivery_above = parseFloat(process.env.FREE_DELIVERY_ABOVE || '2000');
      const delivery_charges = subtotal >= free_delivery_above ? 0 : parseFloat(process.env.DELIVERY_CHARGES || '100');
      const total = subtotal + delivery_charges + service_fees;

      const min_order = parseFloat(process.env.MIN_ORDER_AMOUNT || '200');
      if (subtotal < min_order) throw { status: 400, message: `Minimum order amount is Rs. ${min_order}` };

      // Create order
      const order = await Order.create({
        user_id,
        customer_name,
        customer_phone,
        customer_email,
        delivery_address,
        latitude,
        longitude,
        subtotal,
        delivery_charges,
        service_fees,
        total,
        payment_method: payment_method || 'cod',
        notes,
      }, { transaction });

      // Create order items & update stock
      for (const item of orderItems) {
        await OrderItem.create({ ...item, order_id: order.id }, { transaction });
        await Product.decrement('stock', { by: item.quantity, where: { id: item.product_id }, transaction });
      }

      // Clear cart
      await CartItem.destroy({ where: cartWhere, transaction });

      await transaction.commit();

      return this.getOrderById(order.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getOrderById(id) {
    const order = await Order.findByPk(id, {
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'image'] }] },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });
    if (!order) throw { status: 404, message: 'Order not found' };
    return order;
  }

  async getUserOrders(user_id, { page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    const { rows, count } = await Order.findAndCountAll({
      where: { user_id },
      include: [{ model: OrderItem, as: 'items' }],
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });
    return { orders: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async getAllOrders({ status, page = 1, limit = 20 }) {
    const where = {};
    if (status) where.status = status;
    const offset = (page - 1) * limit;
    const { rows, count } = await Order.findAndCountAll({
      where,
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });
    return { orders: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async updateOrderStatus(id, status) {
    const order = await Order.findByPk(id);
    if (!order) throw { status: 404, message: 'Order not found' };
    
    if (status === 'cancelled' && order.status !== 'cancelled') {
      // Restore stock
      const items = await OrderItem.findAll({ where: { order_id: id } });
      for (const item of items) {
        await Product.increment('stock', { by: item.quantity, where: { id: item.product_id } });
      }
    }
    
    order.status = status;
    await order.save();
    return this.getOrderById(id);
  }

  async getOrderStats() {
    const { Op } = require('sequelize');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalOrders = await Order.count();
    const todayOrders = await Order.count({ where: { created_at: { [Op.gte]: today } } });
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const totalRevenue = await Order.sum('total', { where: { status: { [Op.notIn]: ['cancelled'] } } }) || 0;
    const todayRevenue = await Order.sum('total', { where: { created_at: { [Op.gte]: today }, status: { [Op.notIn]: ['cancelled'] } } }) || 0;

    return { totalOrders, todayOrders, pendingOrders, totalRevenue, todayRevenue };
  }
}

module.exports = new OrderService();
