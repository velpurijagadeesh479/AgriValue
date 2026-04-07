import { Router } from "express";
import { getDb } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

const buildLastSixMonths = () => {
  const months = [];
  const now = new Date();
  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    months.push({
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      month: date.toLocaleString("en-US", { month: "short" }),
      year: date.getFullYear(),
      monthNumber: date.getMonth() + 1,
    });
  }
  return months;
};

router.use(requireAuth, requireRole("admin"));

router.get("/dashboard", async (_req, res) => {
  try {
    const db = getDb();
    const [[users]] = await db.query("SELECT COUNT(*) AS count FROM users");
    const [[farmers]] = await db.query("SELECT COUNT(*) AS count FROM users WHERE role = 'farmer'");
    const [[buyers]] = await db.query("SELECT COUNT(*) AS count FROM users WHERE role = 'buyer'");
    const [[products]] = await db.query("SELECT COUNT(*) AS count FROM products");
    const [[orders]] = await db.query("SELECT COUNT(*) AS count FROM orders");
    const [[revenue]] = await db.query("SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE status != 'cancelled'");
    const [recentUsers] = await db.query("SELECT id, name, email, role, location, created_at FROM users ORDER BY created_at DESC LIMIT 6");
    const [recentTransactions] = await db.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 6");

    res.json({
      stats: {
        totalUsers: users.count,
        activeFarmers: farmers.count,
        activeBuyers: buyers.count,
        totalProducts: products.count,
        totalOrders: orders.count,
        revenue: Number(revenue.total || 0),
      },
      recentUsers,
      recentTransactions,
    });
  } catch {
    res.status(500).json({ message: "Unable to fetch admin dashboard." });
  }
});

router.get("/users", async (req, res) => {
  try {
    const db = getDb();
    const role = req.query.role;
    const query = role
      ? "SELECT id, name, email, phone, role, location, business_name, created_at FROM users WHERE role = ? ORDER BY created_at DESC"
      : "SELECT id, name, email, phone, role, location, business_name, created_at FROM users ORDER BY created_at DESC";
    const [rows] = await db.query(query, role ? [role] : []);
    res.json({ users: rows });
  } catch {
    res.status(500).json({ message: "Unable to fetch users." });
  }
});

router.post("/users", async (req, res) => {
  try {
    const { name, email, phone, role, location, businessName, bio = "", address = "", password = "User@123" } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ message: "Name, email, and role are required." });
    }

    const db = getDb();
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.default.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO users (name, email, phone, password_hash, role, location, business_name, bio, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone || null, passwordHash, role, location || null, businessName || null, bio, address]
    );

    const [rows] = await db.query(
      "SELECT id, name, email, phone, role, location, business_name, bio, address, created_at FROM users WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({ user: rows[0] });
  } catch {
    res.status(500).json({ message: "Unable to create user." });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const { name, email, phone, role, location, businessName, bio = "", address = "" } = req.body;
    const db = getDb();
    await db.query(
      `UPDATE users
       SET name = ?, email = ?, phone = ?, role = ?, location = ?, business_name = ?, bio = ?, address = ?
       WHERE id = ?`,
      [name, email, phone || null, role, location || null, businessName || null, bio, address, req.params.id]
    );
    const [rows] = await db.query(
      "SELECT id, name, email, phone, role, location, business_name, bio, address, created_at FROM users WHERE id = ?",
      [req.params.id]
    );
    res.json({ user: rows[0] });
  } catch {
    res.status(500).json({ message: "Unable to update user." });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.query("SELECT role FROM users WHERE id = ?", [req.params.id]);
    if (!rows[0]) {
      return res.status(404).json({ message: "User not found." });
    }
    await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "User deleted successfully." });
  } catch {
    res.status(500).json({ message: "Unable to delete user." });
  }
});

router.get("/transactions", async (_req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.query(
      `SELECT o.*, buyer.name AS buyer_name, farmer.name AS farmer_name
       FROM orders o
       JOIN users buyer ON buyer.id = o.buyer_id
       JOIN users farmer ON farmer.id = o.farmer_id
       ORDER BY o.created_at DESC`
    );
    res.json({ transactions: rows });
  } catch {
    res.status(500).json({ message: "Unable to fetch transactions." });
  }
});

router.get("/transactions/:id", async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.query(
      `SELECT o.*, buyer.name AS buyer_name, buyer.email AS buyer_email, buyer.phone AS buyer_phone,
              farmer.name AS farmer_name, farmer.email AS farmer_email, farmer.phone AS farmer_phone
       FROM orders o
       JOIN users buyer ON buyer.id = o.buyer_id
       JOIN users farmer ON farmer.id = o.farmer_id
       WHERE o.id = ?`,
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "Transaction not found." });
    }

    const [items] = await db.query(
      `SELECT oi.*, p.name AS product_name, p.unit
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ transaction: rows[0], items });
  } catch {
    res.status(500).json({ message: "Unable to fetch transaction details." });
  }
});

router.get("/analytics", async (_req, res) => {
  try {
    const db = getDb();
    const [userGrowthRows] = await db.query(
      `SELECT YEAR(created_at) AS year, MONTH(created_at) AS monthNumber, COUNT(*) AS users
       FROM users
       GROUP BY YEAR(created_at), MONTH(created_at)
       ORDER BY YEAR(created_at), MONTH(created_at)`
    );
    const [revenueRows] = await db.query(
      `SELECT YEAR(created_at) AS year, MONTH(created_at) AS monthNumber, COALESCE(SUM(total_amount), 0) AS revenue
       FROM orders
       GROUP BY YEAR(created_at), MONTH(created_at)
       ORDER BY YEAR(created_at), MONTH(created_at)`
    );
    const [orderStatsRows] = await db.query("SELECT status, COUNT(*) AS count FROM orders GROUP BY status");
    const [productPerformance] = await db.query(
      `SELECT p.name, COALESCE(SUM(oi.quantity), 0) AS sold
       FROM products p
       LEFT JOIN order_items oi ON oi.product_id = p.id
       GROUP BY p.id
       ORDER BY sold DESC, p.created_at DESC
       LIMIT 6`
    );

    const monthSeries = buildLastSixMonths();

    const userGrowthMap = new Map(
      userGrowthRows.map((row) => [`${row.year}-${String(row.monthNumber).padStart(2, "0")}`, Number(row.users)])
    );
    const revenueMap = new Map(
      revenueRows.map((row) => [`${row.year}-${String(row.monthNumber).padStart(2, "0")}`, Number(row.revenue)])
    );

    const userGrowth = monthSeries.map((item) => ({
      month: item.month,
      users: userGrowthMap.get(item.key) || 0,
    }));

    const revenueTrends = monthSeries.map((item) => ({
      month: item.month,
      revenue: revenueMap.get(item.key) || 0,
    }));

    const statusMap = new Map(orderStatsRows.map((row) => [row.status, Number(row.count)]));
    const orderStats = ["pending", "processing", "shipped", "delivered", "cancelled"].map((status) => ({
      status,
      count: statusMap.get(status) || 0,
    }));

    res.json({
      userGrowth,
      revenueTrends,
      orderStats,
      productPerformance: productPerformance.map((row) => ({
        ...row,
        sold: Number(row.sold || 0),
      })),
    });
  } catch {
    res.status(500).json({ message: "Unable to fetch analytics." });
  }
});

router.get("/reports", async (_req, res) => {
  try {
    const db = getDb();
    const [[counts]] = await db.query(
      `SELECT
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM products) AS products,
        (SELECT COUNT(*) FROM orders) AS orders,
        (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status != 'cancelled') AS revenue`
    );

    res.json({
      reports: [
        { title: "User Report", description: `${counts.users} registered users across all roles.` },
        { title: "Sales Report", description: `Total platform revenue is Rs. ${Number(counts.revenue).toFixed(2)}.` },
        { title: "Product Report", description: `${counts.products} total active and inactive listings available.` },
        { title: "Transaction Report", description: `${counts.orders} total orders processed through the platform.` },
      ],
    });
  } catch {
    res.status(500).json({ message: "Unable to fetch reports." });
  }
});

router.get("/reports/:type", async (req, res) => {
  try {
    const db = getDb();
    const type = req.params.type;

    if (type === "users") {
      const [rows] = await db.query(
        "SELECT id, name, email, role, location, created_at FROM users ORDER BY created_at DESC"
      );
      return res.json({
        title: "User Report",
        columns: ["Name", "Email", "Role", "Location", "Created At"],
        rows: rows.map((row) => [row.name, row.email, row.role, row.location || "-", row.created_at]),
      });
    }

    if (type === "sales") {
      const [rows] = await db.query(
        `SELECT o.id, buyer.name AS buyer_name, farmer.name AS farmer_name, o.total_amount, o.status, o.created_at
         FROM orders o
         JOIN users buyer ON buyer.id = o.buyer_id
         JOIN users farmer ON farmer.id = o.farmer_id
         ORDER BY o.created_at DESC`
      );
      return res.json({
        title: "Sales Report",
        columns: ["Order ID", "Buyer", "Farmer", "Amount", "Status", "Created At"],
        rows: rows.map((row) => [row.id, row.buyer_name, row.farmer_name, row.total_amount, row.status, row.created_at]),
      });
    }

    if (type === "products") {
      const [rows] = await db.query(
        `SELECT p.name, p.category, p.price, p.quantity, p.unit, u.name AS farmer_name, p.created_at
         FROM products p
         JOIN users u ON u.id = p.farmer_id
         ORDER BY p.created_at DESC`
      );
      return res.json({
        title: "Product Report",
        columns: ["Product", "Category", "Price", "Quantity", "Unit", "Farmer", "Created At"],
        rows: rows.map((row) => [row.name, row.category, row.price, row.quantity, row.unit, row.farmer_name, row.created_at]),
      });
    }

    if (type === "transactions") {
      const [rows] = await db.query(
        `SELECT o.id, buyer.name AS buyer_name, farmer.name AS farmer_name, o.total_amount, o.status, o.shipping_address, o.created_at
         FROM orders o
         JOIN users buyer ON buyer.id = o.buyer_id
         JOIN users farmer ON farmer.id = o.farmer_id
         ORDER BY o.created_at DESC`
      );
      return res.json({
        title: "Transaction Report",
        columns: ["Order ID", "Buyer", "Farmer", "Amount", "Status", "Shipping Address", "Created At"],
        rows: rows.map((row) => [row.id, row.buyer_name, row.farmer_name, row.total_amount, row.status, row.shipping_address || "-", row.created_at]),
      });
    }

    return res.status(404).json({ message: "Report type not found." });
  } catch {
    res.status(500).json({ message: "Unable to fetch report details." });
  }
});

router.get("/settings", async (_req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.query("SELECT * FROM platform_settings ORDER BY id ASC LIMIT 1");
    res.json({
      settings: rows[0] || {
        site_name: "AgriValue",
        admin_email: "admin@agrivalue.com",
        notifications: 1,
        email_notifications: 1,
        maintenance_mode: 0,
        auto_approve: 0,
      },
    });
  } catch {
    res.status(500).json({ message: "Unable to fetch settings." });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const { siteName, email, notifications, emailNotifications, maintenanceMode, autoApprove } = req.body;
    const db = getDb();
    const [rows] = await db.query("SELECT id FROM platform_settings ORDER BY id ASC LIMIT 1");
    if (rows[0]) {
      await db.query(
        `UPDATE platform_settings
         SET site_name = ?, admin_email = ?, notifications = ?, email_notifications = ?, maintenance_mode = ?, auto_approve = ?
         WHERE id = ?`,
        [siteName, email, notifications ? 1 : 0, emailNotifications ? 1 : 0, maintenanceMode ? 1 : 0, autoApprove ? 1 : 0, rows[0].id]
      );
    } else {
      await db.query(
        `INSERT INTO platform_settings (site_name, admin_email, notifications, email_notifications, maintenance_mode, auto_approve)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [siteName, email, notifications ? 1 : 0, emailNotifications ? 1 : 0, maintenanceMode ? 1 : 0, autoApprove ? 1 : 0]
      );
    }
    res.json({ message: "Settings updated successfully." });
  } catch {
    res.status(500).json({ message: "Unable to update settings." });
  }
});

export default router;
