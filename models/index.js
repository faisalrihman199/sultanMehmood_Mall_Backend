const User = require('./User');
const ShopCategory = require('./ShopCategory');
const Shop = require('./Shop');
const ProductCategory = require('./ProductCategory');
const Product = require('./Product');
const CartItem = require('./CartItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Shop Category -> Shops
ShopCategory.hasMany(Shop, { foreignKey: 'shop_category_id', as: 'shops' });
Shop.belongsTo(ShopCategory, { foreignKey: 'shop_category_id', as: 'category' });

// Shop -> Product Categories
Shop.hasMany(ProductCategory, { foreignKey: 'shop_id', as: 'productCategories' });
ProductCategory.belongsTo(Shop, { foreignKey: 'shop_id', as: 'shop' });

// Shop -> Products
Shop.hasMany(Product, { foreignKey: 'shop_id', as: 'products' });
Product.belongsTo(Shop, { foreignKey: 'shop_id', as: 'shop' });

// Product Category -> Products
ProductCategory.hasMany(Product, { foreignKey: 'product_category_id', as: 'products' });
Product.belongsTo(ProductCategory, { foreignKey: 'product_category_id', as: 'productCategory' });

// User -> Cart Items
User.hasMany(CartItem, { foreignKey: 'user_id', as: 'cartItems' });
CartItem.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Product -> Cart Items
Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'cartItems' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// User -> Orders
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Order -> Order Items
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Product -> Order Items
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = {
  User,
  ShopCategory,
  Shop,
  ProductCategory,
  Product,
  CartItem,
  Order,
  OrderItem,
};
