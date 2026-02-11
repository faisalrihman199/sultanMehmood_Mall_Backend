require('dotenv').config();
const sequelize = require('../config/database');
const { User, ShopCategory, Shop, ProductCategory, Product } = require('../models');
const bcrypt = require('bcryptjs');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync({ force: true });
    console.log('Tables created');

    // Create Admin
    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@sultanmehmoodmall.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      phone: '0342-8551672',
      role: 'admin',
      is_active: true,
    });
    console.log('Admin created:', admin.email);

    // Create test customers
    await User.bulkCreate([
      {
        name: 'Ali Hassan',
        email: 'ali@test.com',
        password: 'test123',
        phone: '0300-1234567',
        address: 'Hassan Khan Road, Chanda Bherwana',
        role: 'customer',
        is_active: true,
      },
      {
        name: 'Fatima Ahmed',
        email: 'fatima@test.com',
        password: 'test123',
        phone: '0301-9876543',
        address: 'Main Bazaar, Chanda Bherwana',
        role: 'customer',
        is_active: true,
      },
    ]);
    console.log('Test customers created');

    // Shop Categories
    const shopCategories = await ShopCategory.bulkCreate([
      { name: 'Electronics & Mobiles', description: 'Latest electronics, mobiles, and accessories', is_active: true },
      { name: 'Fashion & Apparel', description: 'Trendy clothing and fashion accessories', is_active: true },
      { name: 'Grocery & Food', description: 'Daily groceries, fresh food, and packaged items', is_active: true },
    ]);
    console.log('Shop categories created');

    // Create 4 Main Shops
    const shops = await Shop.bulkCreate([
      {
        name: 'TechZone Electronics Mega Store',
        description: 'Your ultimate destination for the latest smartphones, laptops, tablets, smart watches, gaming consoles, cameras, audio equipment, and all tech accessories. Authorized dealer of Samsung, Apple, HP, Dell, Sony, and more.',
        shop_category_id: shopCategories[0].id,
        address: 'Hassan Khan Road, Adda Chanda Bherwana',
        phone: '0342-8551672',
        is_active: true,
      },
      {
        name: 'StyleHub Fashion Emporium',
        description: 'Premium fashion destination offering branded and designer clothing for men, women, and children. Featuring latest collections in western wear, eastern wear, shoes, bags, jewelry, watches, and fashion accessories.',
        shop_category_id: shopCategories[1].id,
        address: 'Main Bazaar, Chanda Bherwana',
        phone: '0348-0700886',
        is_active: true,
      },
      {
        name: 'FreshMart Grocery Superstore',
        description: 'Complete supermarket for all your grocery needs. Fresh vegetables, fruits, dairy products, meat, bakery items, beverages, snacks, household essentials, and packaged foods from top brands.',
        shop_category_id: shopCategories[2].id,
        address: 'GT Road, Chanda Bherwana',
        phone: '0300-5551234',
        is_active: true,
      },
      {
        name: 'BeautyGlow Cosmetics & Beauty Store',
        description: 'Premium cosmetics, skincare, and beauty products from international and local brands. Featuring skincare, haircare, makeup, perfumes, and personal care items.',
        shop_category_id: shopCategories[0].id,
        address: 'City Center, Chanda Bherwana',
        phone: '0321-1234567',
        is_active: true,
      },
    ]);
    console.log('4 Main Shops created');

    // Product Categories for Sweet Shop
    const sweetCategories = await ProductCategory.bulkCreate([
      { name: 'Barfi', description: 'Traditional barfi varieties', shop_id: shops[0].id, is_active: true },
      { name: 'Laddu', description: 'Delicious laddu varieties', shop_id: shops[0].id, is_active: true },
      { name: 'Gulab Jamun', description: 'Soft and syrupy gulab jamun', shop_id: shops[0].id, is_active: true },
      { name: 'Jalebi & Sweets', description: 'Jalebi and other sweets', shop_id: shops[0].id, is_active: true },
      { name: 'Dry Fruits Box', description: 'Premium dry fruit gift boxes', shop_id: shops[0].id, is_active: true },
    ]);

    // Product Categories for General Store
    const generalCategories = await ProductCategory.bulkCreate([
      { name: 'Rice & Flour', description: 'Basmati rice, wheat flour', shop_id: shops[1].id, is_active: true },
      { name: 'Cooking Oil', description: 'Various cooking oils', shop_id: shops[1].id, is_active: true },
      { name: 'Spices', description: 'Masala and spices', shop_id: shops[1].id, is_active: true },
      { name: 'Beverages', description: 'Tea, juices, and drinks', shop_id: shops[1].id, is_active: true },
      { name: 'Snacks', description: 'Chips, biscuits, and namkeen', shop_id: shops[1].id, is_active: true },
    ]);

    // Product Categories for Department Store
    const deptCategories = await ProductCategory.bulkCreate([
      { name: 'Kitchen Items', description: 'Kitchen utensils and tools', shop_id: shops[2].id, is_active: true },
      { name: 'Cleaning', description: 'Cleaning products', shop_id: shops[2].id, is_active: true },
      { name: 'Stationery', description: 'Office and school supplies', shop_id: shops[2].id, is_active: true },
    ]);

    // Product Categories for Cosmetics
    const cosmeticCategories = await ProductCategory.bulkCreate([
      { name: 'Skincare', description: 'Face and body skincare', shop_id: shops[3].id, is_active: true },
      { name: 'Hair Care', description: 'Shampoo, oil, and treatments', shop_id: shops[3].id, is_active: true },
      { name: 'Perfumes', description: 'Fragrances and deodorants', shop_id: shops[3].id, is_active: true },
    ]);
    console.log('Product categories created');

    // Products for Sweet Shop
    await Product.bulkCreate([
      { name: 'Kaju Barfi', description: 'Premium cashew barfi made with pure ghee and finest cashews', price: 1200, sale_price: 1100, stock: 50, unit: 'kg', shop_id: shops[0].id, product_category_id: sweetCategories[0].id, barcode: 'SMM00000001', is_active: true },
      { name: 'Pista Barfi', description: 'Rich pistachio barfi with authentic taste', price: 1400, stock: 40, unit: 'kg', shop_id: shops[0].id, product_category_id: sweetCategories[0].id, barcode: 'SMM00000002', is_active: true },
      { name: 'Moti Choor Laddu', description: 'Soft and delicious moti choor laddu', price: 800, sale_price: 750, stock: 60, unit: 'kg', shop_id: shops[0].id, product_category_id: sweetCategories[1].id, barcode: 'SMM00000003', is_active: true },
      { name: 'Besan Laddu', description: 'Traditional besan laddu with pure desi ghee', price: 700, stock: 50, unit: 'kg', shop_id: shops[0].id, product_category_id: sweetCategories[1].id, barcode: 'SMM00000004', is_active: true },
      { name: 'Gulab Jamun', description: 'Soft, spongy gulab jamun soaked in sugar syrup', price: 600, sale_price: 550, stock: 80, unit: 'kg', shop_id: shops[0].id, product_category_id: sweetCategories[2].id, barcode: 'SMM00000005', is_active: true },
      { name: 'Jalebi Fresh', description: 'Hot and crispy fresh jalebi', price: 500, stock: 100, unit: 'kg', shop_id: shops[0].id, product_category_id: sweetCategories[3].id, barcode: 'SMM00000006', is_active: true },
      { name: 'Rasgulla', description: 'Soft Bengali-style rasgulla', price: 650, stock: 40, unit: 'kg', shop_id: shops[0].id, product_category_id: sweetCategories[3].id, barcode: 'SMM00000007', is_active: true },
      { name: 'Dry Fruit Gift Box (1kg)', description: 'Premium assorted dry fruits in elegant box', price: 2500, sale_price: 2200, stock: 20, unit: 'box', shop_id: shops[0].id, product_category_id: sweetCategories[4].id, barcode: 'SMM00000008', is_active: true },
    ]);

    // Products for General Store
    await Product.bulkCreate([
      { name: 'Super Kernel Basmati Rice 5kg', description: 'Premium quality basmati rice', price: 1800, sale_price: 1700, stock: 100, unit: 'bag', shop_id: shops[1].id, product_category_id: generalCategories[0].id, barcode: 'SMM00000009', is_active: true },
      { name: 'Sunflower Atta 10kg', description: 'Fine wheat flour for roti and bread', price: 950, stock: 200, unit: 'bag', shop_id: shops[1].id, product_category_id: generalCategories[0].id, barcode: 'SMM00000010', is_active: true },
      { name: 'Dalda Cooking Oil 5L', description: 'Premium vegetable cooking oil', price: 2200, sale_price: 2100, stock: 80, unit: 'bottle', shop_id: shops[1].id, product_category_id: generalCategories[1].id, barcode: 'SMM00000011', is_active: true },
      { name: 'Shan Biryani Masala', description: 'Ready-mix biryani masala packet', price: 120, stock: 300, unit: 'packet', shop_id: shops[1].id, product_category_id: generalCategories[2].id, barcode: 'SMM00000012', is_active: true },
      { name: 'National Red Chilli Powder 200g', description: 'Pure ground red chilli powder', price: 180, stock: 150, unit: 'packet', shop_id: shops[1].id, product_category_id: generalCategories[2].id, barcode: 'SMM00000013', is_active: true },
      { name: 'Tapal Danedar Tea 950g', description: 'Premium black tea', price: 1100, sale_price: 1050, stock: 120, unit: 'pack', shop_id: shops[1].id, product_category_id: generalCategories[3].id, barcode: 'SMM00000014', is_active: true },
      { name: 'Nestle Fruita Vitals 1L', description: 'Mango nectar juice', price: 220, stock: 200, unit: 'pack', shop_id: shops[1].id, product_category_id: generalCategories[3].id, barcode: 'SMM00000015', is_active: true },
      { name: 'Lays Classic Salted Large', description: 'Classic salted potato chips', price: 150, stock: 250, unit: 'pack', shop_id: shops[1].id, product_category_id: generalCategories[4].id, barcode: 'SMM00000016', is_active: true },
    ]);

    // Products for Department Store
    await Product.bulkCreate([
      { name: 'Non-Stick Frying Pan', description: 'High quality non-stick frying pan 26cm', price: 1500, sale_price: 1350, stock: 30, unit: 'piece', shop_id: shops[2].id, product_category_id: deptCategories[0].id, barcode: 'SMM00000017', is_active: true },
      { name: 'Stainless Steel Pot Set', description: '3-piece cooking pot set', price: 3500, stock: 20, unit: 'set', shop_id: shops[2].id, product_category_id: deptCategories[0].id, barcode: 'SMM00000018', is_active: true },
      { name: 'Surf Excel 1kg', description: 'Powerful detergent powder', price: 450, sale_price: 420, stock: 150, unit: 'pack', shop_id: shops[2].id, product_category_id: deptCategories[1].id, barcode: 'SMM00000019', is_active: true },
      { name: 'Harpic Toilet Cleaner 500ml', description: 'Toilet cleaning liquid', price: 280, stock: 100, unit: 'bottle', shop_id: shops[2].id, product_category_id: deptCategories[1].id, barcode: 'SMM00000020', is_active: true },
      { name: 'Dollar Copy Register', description: 'Notebook 200 pages ruled', price: 120, stock: 200, unit: 'piece', shop_id: shops[2].id, product_category_id: deptCategories[2].id, barcode: 'SMM00000021', is_active: true },
    ]);

    // Products for Cosmetics
    await Product.bulkCreate([
      { name: 'Fair & Lovely Cream 50g', description: 'Skin brightening cream', price: 350, sale_price: 320, stock: 80, unit: 'tube', shop_id: shops[3].id, product_category_id: cosmeticCategories[0].id, barcode: 'SMM00000022', is_active: true },
      { name: 'Nivea Body Lotion 200ml', description: 'Moisturizing body lotion', price: 650, stock: 60, unit: 'bottle', shop_id: shops[3].id, product_category_id: cosmeticCategories[0].id, barcode: 'SMM00000023', is_active: true },
      { name: 'Sunsilk Shampoo 400ml', description: 'Smooth and manageable hair shampoo', price: 520, sale_price: 480, stock: 90, unit: 'bottle', shop_id: shops[3].id, product_category_id: cosmeticCategories[1].id, barcode: 'SMM00000024', is_active: true },
      { name: 'Parachute Coconut Oil 200ml', description: 'Pure coconut hair oil', price: 250, stock: 120, unit: 'bottle', shop_id: shops[3].id, product_category_id: cosmeticCategories[1].id, barcode: 'SMM00000025', is_active: true },
      { name: 'J. Perfume Pour Homme', description: 'Long-lasting fragrance for men', price: 2500, sale_price: 2200, stock: 30, unit: 'bottle', shop_id: shops[3].id, product_category_id: cosmeticCategories[2].id, barcode: 'SMM00000026', is_active: true },
      { name: 'Body Spray Brut 200ml', description: 'Classic body spray', price: 850, stock: 50, unit: 'bottle', shop_id: shops[3].id, product_category_id: cosmeticCategories[2].id, barcode: 'SMM00000027', is_active: true },
    ]);

    console.log('Products created');
    console.log('\n=== Seed completed successfully ===');
    console.log('Admin Login: admin@sultanmehmoodmall.com / admin123');
    console.log('Test User: ali@test.com / test123');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
