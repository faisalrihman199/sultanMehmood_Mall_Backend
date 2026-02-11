const { Product, Shop, ProductCategory } = require('../models');
const barcodeService = require('./barcodeService');
const { Op } = require('sequelize');

class ProductService {
  async getAllProducts({ shop_id, category_id, search, page = 1, limit = 20, min_price, max_price }) {
    const where = { is_active: true };
    if (shop_id) where.shop_id = shop_id;
    if (category_id) where.product_category_id = category_id;
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (min_price) where.price = { ...where.price, [Op.gte]: min_price };
    if (max_price) where.price = { ...where.price, [Op.lte]: max_price };

    const offset = (page - 1) * limit;
    const { rows, count } = await Product.findAndCountAll({
      where,
      include: [
        { model: Shop, as: 'shop', attributes: ['id', 'name'] },
        { model: ProductCategory, as: 'productCategory', attributes: ['id', 'name'] },
      ],
      offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
    });
    return { products: rows, total: count, page, totalPages: Math.ceil(count / limit) };
  }

  async getProductById(id) {
    const product = await Product.findByPk(id, {
      include: [
        { model: Shop, as: 'shop', attributes: ['id', 'name', 'phone', 'address'] },
        { model: ProductCategory, as: 'productCategory', attributes: ['id', 'name'] },
      ],
    });
    if (!product) throw { status: 404, message: 'Product not found' };
    return product;
  }

  async getProductByBarcode(barcode) {
    const product = await Product.findOne({
      where: { barcode, is_active: true },
      include: [
        { model: Shop, as: 'shop', attributes: ['id', 'name'] },
        { model: ProductCategory, as: 'productCategory', attributes: ['id', 'name'] },
      ],
    });
    if (!product) throw { status: 404, message: 'Product not found' };
    return product;
  }

  async createProduct(data) {
    if (!data.barcode) {
      data.barcode = await barcodeService.generateBarcode();
    }
    const existing = await Product.findOne({ where: { barcode: data.barcode } });
    if (existing) throw { status: 400, message: 'Barcode already exists' };
    return Product.create(data);
  }

  async updateProduct(id, data) {
    const product = await Product.findByPk(id);
    if (!product) throw { status: 404, message: 'Product not found' };
    if (data.barcode && data.barcode !== product.barcode) {
      const existing = await Product.findOne({ where: { barcode: data.barcode, id: { [Op.ne]: id } } });
      if (existing) throw { status: 400, message: 'Barcode already exists' };
    }
    return product.update(data);
  }

  async deleteProduct(id) {
    const product = await Product.findByPk(id);
    if (!product) throw { status: 404, message: 'Product not found' };
    await product.update({ is_active: false });
    return { message: 'Product deleted' };
  }

  async getProductCategories(shop_id) {
    const where = { is_active: true };
    if (shop_id) where.shop_id = shop_id;
    return ProductCategory.findAll({ where, order: [['name', 'ASC']] });
  }

  async createProductCategory(data) {
    return ProductCategory.create(data);
  }

  async updateProductCategory(id, data) {
    const cat = await ProductCategory.findByPk(id);
    if (!cat) throw { status: 404, message: 'Category not found' };
    return cat.update(data);
  }

  async deleteProductCategory(id) {
    const cat = await ProductCategory.findByPk(id);
    if (!cat) throw { status: 404, message: 'Category not found' };
    await cat.update({ is_active: false });
    return { message: 'Category deleted' };
  }
}

module.exports = new ProductService();
