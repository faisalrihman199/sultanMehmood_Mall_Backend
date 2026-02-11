const { Shop, ShopCategory, ProductCategory, Product } = require('../models');

class ShopService {
  async getAllShops({ category_id, search, page = 1, limit = 20 }) {
    const where = { is_active: true };
    if (category_id) where.shop_category_id = category_id;
    if (search) {
      const { Op } = require('sequelize');
      where.name = { [Op.iLike]: `%${search}%` };
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await Shop.findAndCountAll({
      where,
      include: [{ model: ShopCategory, as: 'category', attributes: ['id', 'name'] }],
      offset,
      limit,
      order: [['created_at', 'DESC']],
    });
    return { shops: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async getShopById(id) {
    const shop = await Shop.findByPk(id, {
      include: [
        { model: ShopCategory, as: 'category', attributes: ['id', 'name'] },
        { model: ProductCategory, as: 'productCategories', where: { is_active: true }, required: false },
      ],
    });
    if (!shop) throw { status: 404, message: 'Shop not found' };
    return shop;
  }

  async createShop(data) {
    return Shop.create(data);
  }

  async updateShop(id, data) {
    const shop = await Shop.findByPk(id);
    if (!shop) throw { status: 404, message: 'Shop not found' };
    return shop.update(data);
  }

  async deleteShop(id) {
    const shop = await Shop.findByPk(id);
    if (!shop) throw { status: 404, message: 'Shop not found' };
    await shop.update({ is_active: false });
    return { message: 'Shop deleted' };
  }

  async getShopCategories() {
    return ShopCategory.findAll({ where: { is_active: true }, order: [['name', 'ASC']] });
  }

  async createShopCategory(data) {
    return ShopCategory.create(data);
  }

  async updateShopCategory(id, data) {
    const cat = await ShopCategory.findByPk(id);
    if (!cat) throw { status: 404, message: 'Category not found' };
    return cat.update(data);
  }

  async deleteShopCategory(id) {
    const cat = await ShopCategory.findByPk(id);
    if (!cat) throw { status: 404, message: 'Category not found' };
    await cat.update({ is_active: false });
    return { message: 'Category deleted' };
  }
}

module.exports = new ShopService();
