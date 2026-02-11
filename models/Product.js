const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  sale_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  shop_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'shops', key: 'id' },
  },
  product_category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'product_categories', key: 'id' },
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'piece',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
});

module.exports = Product;
