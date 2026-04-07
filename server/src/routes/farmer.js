import { Router } from "express";
import { getDb } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { formatProduct } from "../utils.js";

const router = Router();

router.use(requireAuth, requireRole("farmer"));

router.get("/dashboard", async (req, res) => {
  try {
    const db = getDb();
    const [[totalProducts]] = await db.query("SELECT COUNT(*) AS count FROM products WHERE farmer_id = ?", [req.user.id]);
    const [[activeOrders]] = await db.query("SELECT COUNT(*) AS count FROM orders WHERE farmer_id = ? AND status IN ('pending', 'processing', 'shipped')", [req.user.id]);
    const [[totalEarnings]] = await db.query("SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE farmer_id = ? AND status != 'cancelled'", [req.user.id]);
    const [[profileViews]] = await db.query(
      `SELECT COUNT(DISTINCT viewer_id) AS count FROM (
        SELECT buyer_id AS viewer_id FROM orders WHERE farmer_id = ?
        UNION
        SELECT sender_id AS viewer_id
        FROM direct_messages dm
        JOIN direct_conversation_members me ON me.conversation_id = dm.conversation_id AND me.user_id = ?
        JOIN direct_conversation_members other ON other.conversation_id = dm.conversation_id AND other.user_id != ?
      ) viewers`,
      [req.user.id, req.user.id, req.user.id]
    );
    const [recentOrders] = await db.query("SELECT * FROM orders WHERE farmer_id = ? ORDER BY created_at DESC LIMIT 5", [req.user.id]);
    const [productPerformance] = await db.query(
      `SELECT p.name, COALESCE(SUM(oi.quantity), 0) AS sold_quantity
       FROM products p
       LEFT JOIN order_items oi ON oi.product_id = p.id
       WHERE p.farmer_id = ?
       GROUP BY p.id
       ORDER BY sold_quantity DESC, p.created_at DESC
       LIMIT 5`,
      [req.user.id]
    );

    res.json({
      stats: {
        totalProducts: totalProducts.count,
        activeOrders: activeOrders.count,
        totalEarnings: Number(totalEarnings.total || 0),
        profileViews: profileViews.count,
      },
      recentOrders,
      productPerformance,
    });
  } catch {
    res.status(500).json({ message: "Unable to fetch farmer dashboard." });
  }
});

router.get("/inventory", async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.query("SELECT * FROM products WHERE farmer_id = ? ORDER BY created_at DESC", [req.user.id]);
    const products = rows.map(formatProduct);
    res.json({
      stats: {
        totalItems: products.length,
        lowStockItems: products.filter((product) => product.quantity > 0 && product.quantity <= 50).length,
        outOfStock: products.filter((product) => product.quantity <= 0).length,
      },
      products,
    });
  } catch {
    res.status(500).json({ message: "Unable to fetch inventory." });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.query(
      `SELECT o.*, u.name AS buyer_name, u.business_name AS buyer_business_name
       FROM orders o
       JOIN users u ON u.id = o.buyer_id
       WHERE o.farmer_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ orders: rows });
  } catch {
    res.status(500).json({ message: "Unable to fetch farmer orders." });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.query(
      `SELECT o.*, u.name AS buyer_name, u.business_name AS buyer_business_name, u.phone AS buyer_phone, u.email AS buyer_email
       FROM orders o
       JOIN users u ON u.id = o.buyer_id
       WHERE o.farmer_id = ? AND o.id = ?`,
      [req.user.id, req.params.id]
    );
    if (!rows[0]) {
      return res.status(404).json({ message: "Order not found." });
    }
    const [items] = await db.query(
      `SELECT oi.*, p.name AS product_name, p.unit
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );
    res.json({ order: rows[0], items });
  } catch {
    res.status(500).json({ message: "Unable to fetch order details." });
  }
});

router.get("/earnings", async (req, res) => {
  try {
    const db = getDb();
    const [[total]] = await db.query("SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE farmer_id = ? AND status != 'cancelled'", [req.user.id]);
    const [[month]] = await db.query(
      "SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE farmer_id = ? AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE()) AND status != 'cancelled'",
      [req.user.id]
    );
    const [[pending]] = await db.query("SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE farmer_id = ? AND status IN ('pending', 'processing')", [req.user.id]);
    const [transactions] = await db.query("SELECT * FROM orders WHERE farmer_id = ? ORDER BY created_at DESC LIMIT 10", [req.user.id]);
    const [pendingOrders] = await db.query(
      "SELECT id, total_amount, status, created_at, shipping_address FROM orders WHERE farmer_id = ? AND status IN ('pending', 'processing') ORDER BY created_at DESC",
      [req.user.id]
    );
    const [monthOrders] = await db.query(
      "SELECT id, total_amount, status, created_at FROM orders WHERE farmer_id = ? AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE()) ORDER BY created_at DESC",
      [req.user.id]
    );

    res.json({
      stats: {
        totalEarnings: Number(total.total || 0),
        thisMonth: Number(month.total || 0),
        pending: Number(pending.total || 0),
      },
      transactions,
      detail: {
        totalOrders: transactions,
        monthOrders,
        pendingOrders,
        processGuide: [
          "Buyer places an order from the marketplace.",
          "Farmer reviews the order and prepares the requested products.",
          "Update the order to processing or shipped once dispatch starts.",
          "After delivery is completed, the order becomes delivered and moves from pending to completed earnings."
        ]
      }
    });
  } catch {
    res.status(500).json({ message: "Unable to fetch earnings." });
  }
});

export default router;
