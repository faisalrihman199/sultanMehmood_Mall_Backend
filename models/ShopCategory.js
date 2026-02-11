const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ShopCategory = sequelize.define('ShopCategory', {
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
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'shop_categories',
  timestamps: true,
  underscored: true,
});

module.exports = ShopCategory;
