import bcrypt from "bcryptjs";
import { getDb } from "./db.js";

const sampleProducts = [
  {
    name: "Organic Tomatoes",
    category: "vegetables",
    description: "Fresh vine-ripened tomatoes grown without synthetic pesticides.",
    price: 42,
    quantity: 180,
    unit: "kg",
    location: "Guntur, Andhra Pradesh",
    imageUrls: [
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "Premium Basmati Rice",
    category: "grains",
    description: "Long-grain basmati rice harvested this season and sun-dried for aroma.",
    price: 88,
    quantity: 520,
    unit: "kg",
    location: "Nellore, Andhra Pradesh",
    imageUrls: [
      "https://images.unsplash.com/photo-1586201375761-83865001e31d?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    name: "Farm Fresh Mangoes",
    category: "fruits",
    description: "Sweet seasonal mangoes sorted by size and ready for wholesale or retail buyers.",
    price: 120,
    quantity: 240,
    unit: "kg",
    location: "Krishna, Andhra Pradesh",
    imageUrls: [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

export async function seedDatabase() {
  const db = getDb();
  const [[settingsCount]] = await db.query("SELECT COUNT(*) AS count FROM platform_settings");
  if (settingsCount.count === 0) {
    await db.query(
      `INSERT INTO platform_settings (site_name, admin_email, notifications, email_notifications, maintenance_mode, auto_approve)
       VALUES (?, ?, 1, 1, 0, 0)`,
      ["AgriValue", "admin@agrivalue.com"]
    );
  }

  const [[userCount]] = await db.query("SELECT COUNT(*) AS count FROM users");
  if (userCount.count > 0) {
    return;
  }

  const passwordHash = await bcrypt.hash("Admin@123", 10);
  const farmerPasswordHash = await bcrypt.hash("Farmer@123", 10);
  const buyerPasswordHash = await bcrypt.hash("Buyer@123", 10);

  await db.query(
    `INSERT INTO users (name, email, phone, password_hash, role, location, business_name, bio, address)
     VALUES (?, ?, ?, ?, 'admin', ?, ?, ?, ?)`,
    ["Platform Admin", "admin@agrivalue.com", "+91 9876500000", passwordHash, "Vijayawada", "AgriValue", "Supervises the marketplace.", "Admin Office, Vijayawada"]
  );

  const [farmerResult] = await db.query(
    `INSERT INTO users (name, email, phone, password_hash, role, location, business_name, bio, address)
     VALUES (?, ?, ?, ?, 'farmer', ?, ?, ?, ?)`,
    ["Ravi Kumar", "farmer@agrivalue.com", "+91 9876501111", farmerPasswordHash, "Guntur", "Ravi Green Farms", "Growing vegetables and grains with sustainable methods.", "Ravi Green Farms, Guntur"]
  );

  const [buyerResult] = await db.query(
    `INSERT INTO users (name, email, phone, password_hash, role, location, business_name, bio, address)
     VALUES (?, ?, ?, ?, 'buyer', ?, ?, ?, ?)`,
    ["Anita Traders", "buyer@agrivalue.com", "+91 9876502222", buyerPasswordHash, "Hyderabad", "Anita Traders", "", "Plot 22, Market Yard, Hyderabad"]
  );

  const farmerId = farmerResult.insertId;
  const buyerId = buyerResult.insertId;

  const productIds = [];
  for (const product of sampleProducts) {
    const [result] = await db.query(
      `INSERT INTO products (farmer_id, name, category, description, price, quantity, unit, location, image_urls)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [farmerId, product.name, product.category, product.description, product.price, product.quantity, product.unit, product.location, JSON.stringify(product.imageUrls)]
    );
    productIds.push(result.insertId);
  }

  await db.query(
    `INSERT INTO wishlist_items (buyer_id, product_id) VALUES (?, ?), (?, ?)`,
    [buyerId, productIds[0], buyerId, productIds[2]]
  );

  await db.query(
    `INSERT INTO cart_items (buyer_id, product_id, quantity) VALUES (?, ?, ?), (?, ?, ?)`,
    [buyerId, productIds[0], 5, buyerId, productIds[1], 10]
  );

  const [orderResult] = await db.query(
    `INSERT INTO orders (buyer_id, farmer_id, status, total_amount, shipping_address)
     VALUES (?, ?, 'processing', ?, ?)`,
    [buyerId, farmerId, 1090, "Plot 22, Market Yard, Hyderabad"]
  );

  await db.query(
    `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
     VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)`,
    [orderResult.insertId, productIds[0], 5, 42, 210, orderResult.insertId, productIds[1], 10, 88, 880]
  );

  await db.query(
    `INSERT INTO orders (buyer_id, farmer_id, status, total_amount, shipping_address)
     VALUES (?, ?, 'delivered', ?, ?)`,
    [buyerId, farmerId, 960, "Plot 22, Market Yard, Hyderabad"]
  );

  const [conversationResult] = await db.query(
    `INSERT INTO conversations (buyer_id, farmer_id) VALUES (?, ?)`,
    [buyerId, farmerId]
  );

  await db.query(
    `INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?), (?, ?, ?)`,
    [
      conversationResult.insertId,
      buyerId,
      "Hello, I want a regular weekly supply if quality stays consistent.",
      conversationResult.insertId,
      farmerId,
      "Absolutely. I can support that and share harvest updates here."
    ]
  );

  const [directConversationResult] = await db.query(
    `INSERT INTO direct_conversations () VALUES ()`
  );
  await db.query(
    `INSERT INTO direct_conversation_members (conversation_id, user_id) VALUES (?, ?), (?, ?)`,
    [directConversationResult.insertId, buyerId, directConversationResult.insertId, farmerId]
  );
  await db.query(
    `INSERT INTO direct_messages (conversation_id, sender_id, body) VALUES (?, ?, ?), (?, ?, ?)`,
    [
      directConversationResult.insertId,
      buyerId,
      "Can you confirm this week's stock availability?",
      directConversationResult.insertId,
      farmerId,
      "Yes, current inventory is updated and ready for dispatch."
    ]
  );

  console.log("Seeded default users:");
  console.log("Admin: admin@agrivalue.com / Admin@123");
  console.log("Farmer: farmer@agrivalue.com / Farmer@123");
  console.log("Buyer: buyer@agrivalue.com / Buyer@123");
}
