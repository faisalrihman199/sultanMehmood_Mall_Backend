require('dotenv').config();
const sequelize = require('../config/database');
const { User, ShopCategory, Shop, ProductCategory, Product } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');
    await sequelize.sync({ force: true });
    console.log('✓ Tables created');

    // Create Admin
    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@sultanmehmoodmall.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      phone: '0342-8551672',
      role: 'admin',
      is_active: true,
    });
    console.log(`✓ Admin created: ${admin.email}`);

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
    console.log('✓ Test customers created');

    // Shop Categories
    const shopCategories = await ShopCategory.bulkCreate([
      { name: 'Electronics & Mobiles', description: 'Latest electronics, mobiles, and accessories', is_active: true },
      { name: 'Fashion & Apparel', description: 'Trendy clothing and fashion accessories', is_active: true },
      { name: 'Grocery & Food', description: 'Daily groceries, fresh food, and packaged items', is_active: true },
    ]);
    console.log('✓ Shop categories created');

    // Create 3 Main Shops
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
    ]);
    console.log('✓ 3 Main Shops created\n');

    let barcodeCounter = 1;
    let totalProducts = 0;

    // ==================== SHOP 1: TECHZONE ELECTRONICS ====================
    console.log('🔧 Creating TechZone Electronics categories and products...');
    
    const techCategories = await ProductCategory.bulkCreate([
      { name: 'Smartphones', description: 'Latest Android and iOS smartphones', shop_id: shops[0].id, is_active: true },
      { name: 'Laptops & Computers', description: 'Gaming and business laptops, desktops', shop_id: shops[0].id, is_active: true },
      { name: 'Tablets & iPads', description: 'Tablets for work and entertainment', shop_id: shops[0].id, is_active: true },
      { name: 'Smart Watches', description: 'Fitness bands and smart watches', shop_id: shops[0].id, is_active: true },
      { name: 'Headphones & Earbuds', description: 'Wireless and wired audio devices', shop_id: shops[0].id, is_active: true },
      { name: 'Gaming Consoles', description: 'PlayStation, Xbox, Nintendo', shop_id: shops[0].id, is_active: true },
      { name: 'Cameras', description: 'DSLR, mirrorless, action cameras', shop_id: shops[0].id, is_active: true },
      { name: 'TVs & Home Theater', description: 'Smart TVs and sound systems', shop_id: shops[0].id, is_active: true },
      { name: 'Power Banks', description: 'Portable chargers', shop_id: shops[0].id, is_active: true },
      { name: 'Phone Accessories', description: 'Cases, chargers, screen protectors', shop_id: shops[0].id, is_active: true },
      { name: 'Computer Accessories', description: 'Keyboards, mice, monitors', shop_id: shops[0].id, is_active: true },
      { name: 'Storage Devices', description: 'HDDs, SSDs, USB drives', shop_id: shops[0].id, is_active: true },
      { name: 'Networking', description: 'Routers, modems, WiFi', shop_id: shops[0].id, is_active: true },
      { name: 'Speakers', description: 'Bluetooth and wired speakers', shop_id: shops[0].id, is_active: true },
      { name: 'Smart Home', description: 'IoT devices and automation', shop_id: shops[0].id, is_active: true },
    ]);

    // Tech category products data
    const techProductsData = [
      // Smartphones
      ['iPhone 15 Pro Max', 'Samsung Galaxy S24 Ultra', 'iPhone 14 Plus', 'Pixel 8 Pro', 'OnePlus 12', 'Xiaomi 14 Pro', 'Oppo Find X7', 'Vivo X100 Pro', 'Nothing Phone 2', 'Realme GT 5 Pro', 'Motorola Edge 50', 'Samsung S23 FE', 'iPhone 13', 'Redmi Note 13 Pro+', 'Poco X6 Pro', 'Infinix Note 40', 'Tecno Camon 30', 'Samsung A55', 'Oppo Reno 11', 'Vivo V30'],
      // Laptops
      ['MacBook Pro 16" M3', 'MacBook Air 15"', 'Dell XPS 15', 'HP Spectre x360', 'Lenovo ThinkPad X1', 'Asus ROG Zephyrus', 'MSI Stealth 15', 'Razer Blade 15', 'Acer Predator Helios', 'HP Pavilion Gaming', 'Lenovo IdeaPad Gaming', 'Dell Inspiron 15', 'Acer Aspire 5', 'Asus VivoBook Pro', 'HP 15s', 'Lenovo V15', 'Microsoft Surface', 'Samsung Galaxy Book', 'LG Gram 17', 'Huawei MateBook'],
      // Tablets
      ['iPad Pro 12.9"', 'iPad Air', 'Samsung Tab S9 Ultra', 'Samsung Tab S9', 'iPad 10th Gen', 'Samsung Tab A9+', 'Lenovo Tab P12', 'Surface Pro 9', 'Xiaomi Pad 6', 'OnePlus Pad', 'Realme Pad 2', 'Oppo Pad Air', 'Huawei MatePad', 'Amazon Fire HD', 'Nokia T20', 'Lenovo Tab M10', 'TCL Tab 10s', 'Infinix XPad', 'Samsung Tab Active', 'iPad mini'],
      // Smart Watches
      ['Apple Watch Series 9', 'Apple Watch Ultra 2', 'Samsung Watch 6', 'Google Pixel Watch 2', 'Garmin Fenix 7', 'Fitbit Sense 2', 'Amazfit GTR 4', 'Xiaomi Watch S2', 'Huawei Watch GT 4', 'OnePlus Watch 2', 'Realme Watch S Pro', 'Oppo Watch 3', 'Noise ColorFit Pro', 'Fire-Boltt Phoenix', 'boAt Xtend Pro', 'Fastrack Reflex', 'Titan Smart Pro', 'CrossBeats Ignite', 'Mi Band 8', 'Honor Watch 4'],
      // Headphones
      ['AirPods Pro 2', 'AirPods Max', 'Sony WH-1000XM5', 'Bose QC45', 'Samsung Buds2 Pro', 'Nothing Ear 2', 'OnePlus Buds Pro', 'Realme Buds Air 3S', 'Oppo Enco X2', 'Xiaomi Buds 4 Pro', 'JBL Tune 770NC', 'Sennheiser Momentum', 'Audio-Technica M50x', 'Beats Studio Pro', 'boAt Rockerz 551', 'Noise Buds VS104', 'Boat Airdopes 141', 'pTron Bassbuds', 'Mivi DuoPods', 'Zebronics Thunder'],
      // Gaming Consoles
      ['PlayStation 5', 'Xbox Series X', 'Nintendo Switch OLED', 'Steam Deck', 'PS5 Digital', 'Xbox Series S', 'Switch Lite', 'Meta Quest 3', 'PlayStation VR2', 'Valve Index VR', 'PS4 Pro', 'Xbox One X', 'Atari VCS', 'Sega Genesis Mini', 'Super NES Classic', 'PS Classic', 'Xbox Elite Controller', 'PS5 DualSense', 'Switch Pro Controller', 'Razer Kishi V2'],
      // Cameras
      ['Canon EOS R5', 'Sony A7 IV', 'Nikon Z9', 'Fujifilm X-T5', 'Canon R6 Mark II', 'Sony A7R V', 'Nikon Z8', 'Olympus OM-1', 'Panasonic S5 II', 'GoPro Hero 12', 'DJI Action 4', 'Insta360 X3', 'Canon G7 X Mark III', 'Sony ZV-E10', 'Canon EOS 90D', 'Nikon D850', 'Fujifilm X-S20', 'Leica Q3', 'Hasselblad X2D', 'Phase One XF'],
      // TVs
      ['Samsung Neo QLED 85"', 'LG OLED C3 77"', 'Sony Bravia XR 75"', 'TCL Mini LED 65"', 'Hisense ULED 55"', 'Samsung QLED 50"', 'LG NanoCell 43"', 'Mi TV 5X 55"', 'OnePlus Y1S Pro', 'Realme Smart TV 43"', 'VU Premium 50"', 'Toshiba 32" LED', 'Panasonic 42"', 'Philips 55"', 'Sony Bravia 32"', 'Samsung Frame TV', 'LG Gallery Series', 'TCL P735', 'Haier LED 40"', 'Videocon 32"'],
      // Power Banks
      ['Anker PowerCore 20K', 'Mi Power Bank 3i', 'Realme 30000mAh', 'Samsung 10000mAh', 'OnePlus 10000mAh', 'Ambrane 27000mAh', 'Syska Power Pro', 'boAt Energybar', 'Portronics Slice', 'Redmi Power Bank', 'Oppo 10K', 'Vivo Portable', 'Belkin Boost', 'RAVPower 26K', 'Aukey 20K', 'Romoss Sense 8+', 'Xiaomi Redmi 20K', 'Baseus Power', 'Ugreen 25K', 'Anker 737'],
      // Phone Accessories
      ['Spigen Tough Armor', 'OtterBox Defender', 'UAG Pathfinder', 'Ringke Fusion-X', 'Caseology Parallax', 'Speck Presidio', 'Tech21 Evo', 'Mous Limitless', 'Nomad Rugged', 'Apple Silicone', 'Samsung Clear View', 'dbrand Grip', 'Pitaka MagEZ', 'Latercase Thin', 'Bellroy Leather', 'Rhinoshield Crash', 'Catalyst Waterproof', 'LifeProof FRE', 'X-Doria Defense', 'Supcase Unicorn'],
      // Computer Accessories
      ['Logitech MX Master', 'Razer DeathAdder V3', 'Keychron K8 Pro', 'Corsair K100 RGB', 'Dell UltraSharp 27"', 'LG 34" Ultrawide', 'BenQ PD3220U', 'Logitech C920', 'Blue Yeti Mic', 'Elgato Stream Deck', 'HyperX Cloud Alpha', 'Corsair RGB Pad', 'Razer Huntsman', 'SteelSeries Apex', 'ASUS ROG Mat', 'Cable Kit', 'Monitor Arm', 'RGB LED Strip', 'Cooling Pad', 'USB Hub 10-Port'],
      // Storage
      ['Samsung T7 Shield 2TB', 'WD Passport 4TB', 'SanDisk Extreme SSD', 'Crucial X9 Pro', 'Seagate Backup Plus', 'Kingston XS2000', 'Transcend ESD310', 'ADATA HD710 Pro', 'LaCie Rugged Mini', 'G-Tech ArmorATD', 'Samsung 870 EVO', 'WD Black SN850X', 'Kingston A2000', 'Crucial P5 Plus', 'SanDisk Ultra 128GB', 'Samsung USB 256GB', 'Transcend JetFlash', 'HP x796w 64GB', 'Sony USM64X', 'Lexar JumpDrive'],
      // Networking
      ['TP-Link Archer AX73', 'Asus RT-AX86U', 'Netgear Nighthawk', 'Linksys Velop', 'D-Link DIR-X5460', 'Tenda AC10U', 'Mercusys AC12G', 'Xiaomi AX3000', 'TP-Link Deco X60', 'Google Nest WiFi', 'Eero Pro 6E', 'Asus ZenWiFi', 'Netgear Orbi', 'TP-Link C6', 'D-Link AC1200', 'Tplink WR841N', 'Tenda N301', 'Wavlink AC1200', 'Mercusys MW305R', 'TP-Link MR3020'],
      // Speakers
      ['JBL Flip 6', 'Sony SRS-XB43', 'Bose SoundLink', 'Marshall Emberton', 'UE Wonderboom 3', 'Anker Soundcore 3', 'Tribit StormBox', 'Boat Stone 1508', 'Mi Outdoor Speaker', 'Zebronics County', 'Philips SPA8000B', 'Creative Pebble V3', 'Logitech Z623', 'Edifier R1280T', 'Sony XB13', 'JBL Charge 5', 'Harman Onyx', 'B&O Beosound', 'Sonos Roam', 'UE Boom'],
      // Smart Home
      ['Philips Hue Kit', 'TP-Link Smart Plug', 'Echo Dot 5', 'Nest Hub', 'Ring Doorbell', 'Arlo Pro 4', 'Wyze Cam v3', 'Eufy Security', 'TP-Link Tapo C200', 'Mi 360 Camera', 'Realme TechLife Cam', 'Syska Smart Bulb', 'Wipro Smart LED', 'Xiaomi Smart Bulb', 'Philips Wiz LED', 'TP-Link Switch', 'Sonoff Basic', 'Broadlink RM4', 'August Lock', 'Yale Assure'],
    ];

    const techProducts = [];
    techProductsData.forEach((categoryProducts, catIndex) => {
      categoryProducts.forEach((productName, index) => {
        const basePrice = [60000, 150000, 130000, 25000, 15000, 60000, 100000, 50000, 8000, 2500, 5000, 15000, 8000, 12000, 4000][catIndex];
        const price = basePrice + Math.floor(Math.random() * basePrice * 0.8);
        const hasSale = Math.random() > 0.5;
        techProducts.push({
          name: productName,
          description: `${productName} - Premium quality with latest features and technology. Perfect choice for tech enthusiasts.`,
          price: price,
          sale_price: hasSale ? Math.floor(price * (0.85 + Math.random() * 0.1)) : null,
          stock: Math.floor(Math.random() * 80) + 20,
          unit: 'piece',
          shop_id: shops[0].id,
          product_category_id: techCategories[catIndex].id,
          barcode: `TECH${String(barcodeCounter++).padStart(6, '0')}`,
          is_active: true,
        });
      });
    });
    
    await Product.bulkCreate(techProducts);
    totalProducts += techProducts.length;
    console.log(`  ✓ Created ${techProducts.length} tech products\n`);

    // ==================== SHOP 2: STYLEHUB FASHION ====================
    console.log('👔 Creating StyleHub Fashion categories and products...');
    
    const fashionCategories = await ProductCategory.bulkCreate([
      { name: "Men's Clothing", description: 'Shirts, pants, suits', shop_id: shops[1].id, is_active: true },
      { name: "Women's Clothing", description: 'Dresses, tops, ethnic wear', shop_id: shops[1].id, is_active: true },
      { name: "Kids' Clothing", description: 'Boys and girls apparel', shop_id: shops[1].id, is_active: true },
      { name: "Men's Footwear", description: 'Formal and casual shoes', shop_id: shops[1].id, is_active: true },
      { name: "Women's Footwear", description: 'Heels, flats, sandals', shop_id: shops[1].id, is_active: true },
      { name: 'Bags & Luggage', description: 'Handbags, backpacks, suitcases', shop_id: shops[1].id, is_active: true },
      { name: 'Watches', description: 'Men and women watches', shop_id: shops[1].id, is_active: true },
      { name: 'Jewelry', description: 'Gold, silver, fashion jewelry', shop_id: shops[1].id, is_active: true },
      { name: 'Sunglasses', description: 'Designer and sports sunglasses', shop_id: shops[1].id, is_active: true },
      { name: 'Belts & Wallets', description: 'Leather accessories', shop_id: shops[1].id, is_active: true },
      { name: 'Ethnic Wear', description: 'Traditional clothing', shop_id: shops[1].id, is_active: true },
      { name: 'Sports Wear', description: 'Gym and athletic clothing', shop_id: shops[1].id, is_active: true },
      { name: 'Winter Wear', description: 'Jackets, sweaters, coats', shop_id: shops[1].id, is_active: true },
      { name: 'Innerwear', description: 'Undergarments and loungewear', shop_id: shops[1].id, is_active: true },
      { name: 'Fashion Accessories', description: 'Scarves, ties, caps', shop_id: shops[1].id, is_active: true },
    ]);

    const fashionProductsData = [
      // Men's Clothing
      ['Levi\'s 511 Slim Jeans', 'Van Heusen Formal Shirt', 'Peter England Suit', 'Allen Solly Chinos', 'Arrow Casual Shirt', 'Louis Philippe Blazer', 'Raymond Trousers', 'Blackberrys Formal', 'Park Avenue Shirt', 'Mufti Casual Wear', 'Tommy Hilfiger Polo', 'US Polo T-Shirt', 'Wrangler Denim', 'Lee Cooper Jeans', 'Pepe Jeans Casual', 'Jack & Jones Shirt', 'Spykar Jeans', 'Being Human Shirt', 'John Players Pants', 'ColorPlus Formal'],
      // Women's Clothing
      ['Biba Kurta Set', 'W Maxi Dress', 'Global Desi Top', 'Fabindia Ethnic', 'AND Party Dress', 'Forever 21 Top', 'Vero Moda Dress', 'Only Western Wear', 'H&M Collection', 'Zara Outfit', 'Mango Dress', 'Max Fashion Top', 'Aurelia Kurta', 'Libas Ethnic Set', 'FabAlley Dress', 'Cottinfab Top', 'Janasya Kurta', 'Styli Ethnic', 'Rangriti Kurta', 'Jaipur Kurti Set'],
      // Kids Clothing
      ['Hopscotch Boys Set', 'Firstcry Girls Dress', 'Carter\'s Baby Wear', 'Mothercare Outfit', 'Babyhug Clothing', 'YK Boys T-Shirt', 'UCB Kids Wear', 'Peppermint Girls', 'Gini & Jony Set', 'Tiny Girl Dress', 'Nauti Nati Boys', 'Lilliput Kids', 'Tales & Stories', 'Dreamline Kids', 'Always Kids Wear', 'Chicco Baby Set', 'Donuts Girls', '612 League Boys', 'Pepe Kids Jeans', 'Allen Solly Junior'],
      // Men's Footwear
      ['Nike Air Max', 'Adidas Ultraboost', 'Puma RS-X', 'Woodland Leather', 'Red Tape Formal', 'Clarks Derby', 'Hush Puppies Loafer', 'Bata Formal Shoes', 'Lee Cooper Casual', 'Sparx Running', 'Campus Sports', 'Fila Sneakers', 'Reebok Classic', 'Skechers Walk', 'New Balance 574', 'Converse Chuck', 'Vans Old Skool', 'Crocs Crocband', 'Liberty Shoes', 'Action Sports'],
      // Women's Footwear
      ['Bata Heels', 'Metro Sandals', 'Inc.5 Wedges', 'Mochi Flats', 'Catwalk Stilettos', 'Lavie Sandals', 'Shoexpress Heels', 'Crocs Classic', 'Relaxo Flite', 'Adidas Sneakers', 'Nike Court', 'Puma Cali', 'Skechers Go Walk', 'Reebok Floatride', 'New Balance Fresh', 'Liberty Sandals', 'Action Bellies', 'Campus Shoes', 'Red Tape Heels', 'Woodland Sandals'],
      // Bags
      ['Wildcraft Backpack', 'American Tourister', 'Skybags Trolley', 'Safari Luggage', 'Aristocrat Bag', 'VIP Suitcase', 'Lavie Handbag', 'Caprese Clutch', 'Baggit Tote', 'Hidesign Leather', 'Fossil Crossbody', 'Michael Kors Bag', 'Coach Handbag', 'Gucci Bag', 'Prada Clutch', 'Tommy Backpack', 'Nike Duffle', 'Adidas Gym Bag', 'Puma Backpack', 'Fastrack Sling'],
      // Watches
      ['Titan Edge', 'Fastrack Reflex', 'Casio G-Shock', 'Timex Weekender', 'Fossil Grant', 'Daniel Wellington', 'Tommy Hilfiger Watch', 'Armani Exchange', 'Michael Kors Watch', 'Tissot PRX', 'Seiko 5 Sports', 'Citizen Eco-Drive', 'Rolex Submariner', 'Omega Seamaster', 'Tag Heuer Carrera', 'Rado Centrix', 'Longines Master', 'Oris Aquis', 'IWC Pilot', 'Breitling Navitimer'],
      // Jewelry
      ['Tanishq Gold Necklace', 'Malabar Gold Chain', 'Kalyan Jewellers Set', 'PC Jeweller Ring', 'Senco Gold Earrings', 'Joyalukkas Bangle', 'Bhima Jewels Pendant', 'Thangamayil Chain', 'GRT Jewellers Set', 'Tribhovandas Ring', 'CaratLane Diamond', 'BlueStone Ring', 'Voylla Fashion', 'Accessorize Jewelry', 'Forever 21 Set', 'H&M Jewelry', 'Zara Accessories', 'Pandora Charm', 'Swarovski Crystal', 'Tiffany & Co'],
      // Sunglasses
      ['Ray-Ban Aviator', 'Oakley Holbrook', 'Carrera Champion', 'Prada Linea', 'Gucci GG', 'Tom Ford Henry', 'Versace Medusa', 'Polaroid PLD', 'Fastrack UV', 'IDEE Wayfarer', 'Vincent Chase', 'John Jacobs', 'Oakley Frogskins', 'Ray-Ban Clubmaster', 'Persol PO', 'Maui Jim Peahi', 'Costa Del Mar', 'Spy Optic', 'Dragon Alliance', 'Smith Optics'],
      // Belts & Wallets
      ['Tommy Hilfiger Belt', 'Louis Philippe Wallet', 'Van Heusen Belt', 'Allen Solly Wallet', 'Peter England Set', 'Arrow Leather Belt', 'Wildcraft Wallet', 'Fastrack Belt', 'Woodland Leather', 'Red Tape Wallet', 'Lee Cooper Belt', 'Levi\'s Wallet', 'Puma Belt', 'Nike Wallet', 'Adidas Belt', 'Fossil Leather', 'Coach Wallet', 'Michael Kors', 'Gucci Belt', 'Ferragamo Wallet'],
      // Ethnic Wear
      ['Fabindia Kurta Pajama', 'Manyavar Sherwani', 'Raymond Suit', 'Biba Salwar Set', 'W Ethnic Dress', 'Global Desi Lehenga', 'Aurelia Anarkali', 'Libas Palazzo Set', 'Jaipur Kurti Suit', 'Rangriti Kurta Set', 'Cottinfab Ethnic', 'Janasya Kurti', 'Soch Salwar', 'Ethnicity Kurta', 'Anouk Ethnic', 'Varanga Kurti', 'Sangria Palazzo', 'Go Colors Leggings', 'Kalini Ethnic', 'Sassafras Kurta'],
      // Sports Wear
      ['Nike Dri-FIT Tee', 'Adidas Tiro Pants', 'Puma IGNITE Short', 'Under Armour Shirt', 'Reebok Track Suit', 'New Balance Tights', 'Asics Running Tee', 'Fila Sports Set', 'Decathlon Kalenji', 'Campus Activewear', 'HRX Track Pants', 'Prowl Gym Wear', 'Alcis Sports', 'Jockey Active', 'Pepe Jeans Sport', 'Lotto Training', 'Slazenger Sports', 'Umbro Kit', 'Kappa Track', 'Li-Ning Sports'],
      // Winter Wear
      ['Monte Carlo Sweater', 'Allen Solly Jacket', 'Van Heusen Coat', 'Wrangler Puffer', 'Pepe Jeans Jacket', 'Mufti Cardigan', 'Roadster Hoodie', 'H&M Winter Coat', 'Zara Overcoat', 'Jack & Jones Parka', 'Tommy Winter Jacket', 'US Polo Sweater', 'Ralph Lauren Coat', 'North Face Puffer', 'Columbia Jacket', 'Canada Goose Parka', 'Moncler Coat', 'Burberry Trench', 'Woolrich Parka', 'Patagonia Fleece'],
      // Innerwear
      ['Jockey Briefs', 'Van Heusen Innerwear', 'Dollar Bigboss', 'Lux Cozi Vests', 'Rupa Frontline', 'Amul Comfy', 'Dixcy Scott', 'Lyra Leggings', 'Enamor Bra', 'Triumph Lingerie', 'Clovia Innerwear', 'Zivame Bra', 'PrettySecrets', 'Lovable Comfort', 'Hanes Innerwear', 'Calvin Klein', 'Victoria Secret', 'La Senza', 'Marks & Spencer', 'Jockey Women'],
      // Accessories
      ['Allen Solly Tie', 'Peter England Cufflinks', 'Fastrack Cap', 'Wildcraft Scarf', 'Noise Smart Band', 'Fossil Keychain', 'Tommy Socks', 'Nike Headband', 'Adidas Wristband', 'Puma Gloves', 'Burberry Scarf', 'Gucci Tie', 'Hermes Scarf', 'Louis Vuitton Cap', 'Prada Gloves', 'Ferragamo Tie', 'Versace Scarf', 'Armani Cufflinks', 'Montblanc Keyring', 'Cartier Cufflinks'],
    ];

    const fashionProducts = [];
    fashionProductsData.forEach((categoryProducts, catIndex) => {
      categoryProducts.forEach((productName, index) => {
        const basePrice = [2500, 2000, 1500, 3500, 2800, 4000, 8000, 15000, 4000, 1500, 3000, 2000, 4000, 800, 1200][catIndex];
        const price = basePrice + Math.floor(Math.random() * basePrice * 1.2);
        const hasSale = Math.random() > 0.45;
        fashionProducts.push({
          name: productName,
          description: `${productName} - Stylish and comfortable. Latest fashion trends with premium quality materials.`,
          price: price,
          sale_price: hasSale ? Math.floor(price * (0.80 + Math.random() * 0.15)) : null,
          stock: Math.floor(Math.random() * 100) + 30,
          unit: 'piece',
          shop_id: shops[1].id,
          product_category_id: fashionCategories[catIndex].id,
          barcode: `FASH${String(barcodeCounter++).padStart(6, '0')}`,
          is_active: true,
        });
      });
    });

    await Product.bulkCreate(fashionProducts);
    totalProducts += fashionProducts.length;
    console.log(`  ✓ Created ${fashionProducts.length} fashion products\n`);

    // ==================== SHOP 3: FRESHMART GROCERY ====================
    console.log('🛒 Creating FreshMart Grocery categories and products...');
    
    const groceryCategories = await ProductCategory.bulkCreate([
      { name: 'Fresh Vegetables', description: 'Farm fresh vegetables', shop_id: shops[2].id, is_active: true },
      { name: 'Fresh Fruits', description: 'Seasonal fruits', shop_id: shops[2].id, is_active: true },
      { name: 'Dairy Products', description: 'Milk, cheese, yogurt', shop_id: shops[2].id, is_active: true },
      { name: 'Bakery Items', description: 'Bread, cakes, cookies', shop_id: shops[2].id, is_active: true },
      { name: 'Rice & Flour', description: 'Grains and flours', shop_id: shops[2].id, is_active: true },
      { name: 'Cooking Oil', description: 'Vegetable and olive oils', shop_id: shops[2].id, is_active: true },
      { name: 'Spices & Masala', description: 'Indian spices', shop_id: shops[2].id, is_active: true },
      { name: 'Beverages', description: 'Tea, coffee, juices', shop_id: shops[2].id, is_active: true },
      { name: 'Snacks & Chips', description: 'Namkeen, biscuits', shop_id: shops[2].id, is_active: true },
      { name: 'Frozen Foods', description: 'Frozen veggies, ready meals', shop_id: shops[2].id, is_active: true },
      { name: 'Personal Care', description: 'Soap, shampoo, toiletries', shop_id: shops[2].id, is_active: true },
      { name: 'Household Items', description: 'Cleaning supplies', shop_id: shops[2].id, is_active: true },
      { name: 'Baby Products', description: 'Diapers, baby food', shop_id: shops[2].id, is_active: true },
      { name: 'Health & Wellness', description: 'Vitamins, supplements', shop_id: shops[2].id, is_active: true },
      { name: 'Pet Supplies', description: 'Pet food and accessories', shop_id: shops[2].id, is_active: true },
    ]);

    const groceryProductsData = [
      // Vegetables
      ['Fresh Tomatoes', 'Onions Red', 'Potatoes', 'Green Capsicum', 'Carrots', 'Cabbage', 'Cauliflower', 'Broccoli', 'Spinach', 'Mint Leaves', 'Coriander', 'Green Chillies', 'Lady Finger', 'Brinjal', 'Cucumber', 'Bottle Gourd', 'Ridge Gourd', 'Bitter Gourd', 'Pumpkin', 'Radish'],
      // Fruits
      ['Fresh Apples', 'Bananas Robusta', 'Oranges', 'Grapes Green', 'Mangoes Alphonso', 'Papayas', 'Watermelon', 'Muskmelon', 'Pomegranate', 'Guava', 'Pineapple', 'Kiwi', 'Dragon Fruit', 'Avocado', 'Strawberries', 'Blueberries', 'Cherries', 'Peaches', 'Plums', 'Pears'],
      // Dairy
      ['Amul Full Cream Milk', 'Mother Dairy Toned', 'Nestle Everyday', 'Amul Butter', 'Britannia Cheese', 'Amul Masti Dahi', 'Mother Dairy Paneer', 'Nestle Milkmaid', 'Amul Ghee', 'Mother Dairy Curd', 'Britannia Cream', 'Go Cheese Slices', 'Amul Shrikhand', 'Epigamia Greek Yogurt', 'Yakult Probiotic', 'Nandini Milk', 'Heritage Fresh', 'Nestle Slim Milk', 'Amul Cool Buttermilk', 'Mother Dairy Lassi'],
      // Bakery
      ['Britannia Bread', 'Modern White Bread', 'Harvest Gold Brown', 'Britannia Cake', 'Hide & Seek Cookies', 'Parle-G Biscuits', 'Oreo Cookies', 'Sunfeast Dark Fantasy', 'Good Day Butter', 'Marie Gold', 'Bourbon Biscuits', 'Nutrichoice Digestive', 'Unibic Cookies', 'Cadbury Choco', 'McVities Digestive', 'Britannia NutriChoice', 'Milano Cookies', 'Karachi Bakery', 'Monginis Cake', 'Cream Rolls'],
      // Rice & Flour
      ['India Gate Basmati', 'Daawat Rozana', 'Kohinoor Super Value', 'Fortune Biryani Rice', 'Aashirvaad Atta', 'Pillsbury Chakki Atta', 'Nature Fresh Sampoorna', 'Annapurna Atta', 'Shakti Bhog Atta', 'Fortune Besan', 'Sujata Maida', 'MP Atta Durum', 'Patanjali Atta', 'Tata Sampann Rice', 'Shrilalmahal Basmati', 'India Gate Brown', 'Kohinoor Gold', 'Daawat Biryani', 'Fortune Basmati', 'Lal Qilla Rice'],
      // Oil
      ['Fortune Sunflower Oil', 'Saffola Gold', 'Sundrop Heart', 'Dalda Vanaspati', 'Dhara Mustard Oil', 'Gemini Refined', 'Postman Rice Bran', 'KTC Sunflower', 'Freedom Oil', 'Oleev Olive Oil', 'Figaro Olive Oil', 'Borges Extra Virgin', 'DiSano Olive Oil', 'Borges Grapeseed', 'Dhara Groundnut', 'Engine Kachi Ghani', 'Fortune Kachi Ghani', 'Patanjali Mustard', 'Freedom Lite', 'Sundrop Nutrilite'],
      // Spices
      ['Everest Garam Masala', 'MDH Chana Masala', 'Catch Sprinklers', 'Patanjali Haldi', 'Aashirvaad Masala', 'Everest Red Chilli', 'MDH Kashmiri Mirch', 'Catch Chat Masala', 'Patanjali Coriander', 'Everest Kitchen King', 'MDH Chicken Masala', 'Catch Pav Bhaji', 'Eastern Sambhar', 'Suhana Biryani', 'Mother\'s Recipe Pickle', 'Priya Mango Pickle', 'Ahmed Mixed Pickle', 'National Pickle', 'Pataks Lime Pickle', 'Nilon\'s Pickle'],
      // Beverages
      ['Tata Tea Premium', 'Red Label Natural', 'Brooke Bond Taj', 'Society Tea', 'Lipton Green Tea', 'Nescafe Classic', 'Bru Gold', 'Davidoff Coffee', 'Real Fruit Juice', 'Tropicana Orange', 'Minute Maid Pulpy', 'Paper Boat Aamras', 'Frooti Mango', 'Maaza Mango', 'Slice Mango', 'Coca Cola', 'Pepsi', 'Sprite', 'Mountain Dew', 'Thums Up'],
      // Snacks
      ['Lays Classic Salted', 'Kurkure Masala', 'Bingo Mad Angles', 'Uncle Chips', 'Haldiram Bhujia', 'Bikaji Aloo Bhujia', 'Act II Popcorn', 'Too Yumm Chips', 'Pringles Original', 'Doritos Nacho', 'Cheetos Flamin', 'Parle Monaco', 'Britannia 50-50', 'Sunfeast YiPPee', 'ITC Bingo', 'Balaji Wafers', 'Haldiram Mixture', 'Bikaji Namkeen', 'Kurkure Puffcorn', 'Cornitos Nachos'],
      // Frozen
      ['McCain French Fries', 'Venky\'s Chicken', 'Godrej Yummiez', 'Prasuma Prawns', 'ID Breakfast Parathas', 'Sumeru French Fries', 'McCain Smiles', 'HyperCITY Nuggets', 'Yummiez Momos', 'McCain Wedges', 'ID Aloo Paratha', 'Godrej Chicken', 'Prasuma Fish Fillet', 'HyperCITY Samosa', 'Sumeru Veg Nuggets', 'ID Paneer Paratha', 'McCain Corn', 'Yummiez Spring Roll', 'Godrej Veg Cutlet', 'Venky\'s Sausages'],
      // Personal Care
      ['Dettol Handwash', 'Lifebuoy Soap', 'Lux Beauty Soap', 'Dove White', 'Pears Pure Gentle', 'Colgate Toothpaste', 'Sensodyne Sensitive', 'Oral-B Brush', 'Head & Shoulders', 'Pantene Shampoo', 'Sunsilk Black Shine', 'Clinic Plus', 'Fair & Lovely Cream', 'Garnier Face Wash', 'Nivea Body Lotion', 'Vaseline Petroleum', 'Ponds Cream', 'Himalaya Neem', 'Patanjali Aloe Gel', 'Biotique Bio'],
      // Household
      ['Vim Dishwash Gel', 'Surf Excel Matic', 'Ariel Matic Liquid', 'Tide Plus', 'Harpic Toilet', 'Lizol Floor Cleaner', 'Colin Glass Cleaner', 'Comfort Fabric', 'Ujala Supreme', 'Robin Blue', 'Scotch-Brite Scrubber', 'Vim Bar', 'Domex Toilet', 'Dettol Disinfectant', 'Savlon Antiseptic', 'Odonil Air Freshener', 'Mortein Spray', 'Good Knight Coil', 'All Out Refill', 'Hit Spray'],
      // Baby Products
      ['Pampers Diaper Pants', 'Huggies Wonder', 'MamyPoko Pants', 'Himalaya Baby Wash', 'Johnson Baby Powder', 'Nestle Cerelac', 'Farex Baby Food', 'Gerber Organic', 'Johnson Oil', 'Himalaya Diaper Rash', 'Chicco Baby Soap', 'Pigeon Baby Wipes', 'Mee Mee Shampoo', 'LuvLap Baby Wash', 'Sebamed Baby', 'Mothercare Lotion', 'Mamaearth Baby', 'Chicco Powder', 'Pigeon Soap', 'Johnson Lotion'],
      // Health
      ['Revital H Capsules', 'Supradyn Daily', 'Becadexamin Cap', 'Neurobion Forte', 'Vitamin C Tablets', 'Omega 3 Fish Oil', 'Calcium Tablets', 'Multivitamin Gummies', 'Protein Powder', 'Whey Protein', 'Glucon-D Orange', 'Electral Powder', 'Chyawanprash', 'Dabur Honey', 'Patanjali Aloe Juice', 'Baidyanath Ashwagandha', 'Himalaya Liv.52', 'Zandu Pancharishta', 'Hamdard Unani', 'Baidyanath Triphala'],
      // Pet Supplies
      ['Pedigree Adult Dog', 'Whiskas Cat Food', 'Royal Canin Mini', 'Drools Puppy', 'Meo Persian Cat', 'Purepet Chicken', 'SmartHeart Dog', 'Sheba Cat Food', 'Petcare Dog Treats', 'Basil Pet Cage', 'Trixie Cat Litter', 'Fekrix Bowl', 'Heads Up Collar', 'Petcare Leash', 'Gnawlers Bones', 'American Kennel', 'Pet Buddies Toy', 'Beaphar Shampoo', 'Himalaya AntiTick', 'Boltz Toy'],
    ];

    const groceryProducts = [];
    groceryProductsData.forEach((categoryProducts, catIndex) => {
      categoryProducts.forEach((productName, index) => {
        const basePrice = [80, 120, 150, 80, 600, 900, 80, 120, 50, 300, 180, 150, 400, 250, 350][catIndex];
        const price = basePrice + Math.floor(Math.random() * basePrice * 0.6);
        const hasSale = Math.random() > 0.4;
        const unit = catIndex < 2 ? 'kg' : (catIndex === 7 ? 'ltr' : 'pack');
        groceryProducts.push({
          name: productName,
          description: `${productName} - Fresh and high quality. Essential for your daily needs. Best value for money.`,
          price: price,
          sale_price: hasSale ? Math.floor(price * (0.88 + Math.random() * 0.10)) : null,
          stock: Math.floor(Math.random() * 200) + 50,
          unit: unit,
          shop_id: shops[2].id,
          product_category_id: groceryCategories[catIndex].id,
          barcode: `GROC${String(barcodeCounter++).padStart(6, '0')}`,
          is_active: true,
        });
      });
    });

    await Product.bulkCreate(groceryProducts);
    totalProducts += groceryProducts.length;
    console.log(`  ✓ Created ${groceryProducts.length} grocery products\n`);

    console.log('\n========================================');
    console.log('✓ Seed completed successfully!');
    console.log('========================================');
    console.log(`Total Products: ${totalProducts}`);
    console.log(`Total Categories: ${techCategories.length + fashionCategories.length + groceryCategories.length}`);
    console.log(`Total Shops: ${shops.length}`);
    console.log('\nLogin Credentials:');
    console.log('  Admin: admin@sultanmehmoodmall.com / admin123');
    console.log('  User 1: ali@test.com / test123');
    console.log('  User 2: fatima@test.com / test123');
    console.log('========================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
