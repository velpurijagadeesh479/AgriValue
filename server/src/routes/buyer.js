import { Router } from "express";
import { getDb } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { formatProduct } from "../utils.js";

const router = Router();

router.use(requireAuth, requireRole("buyer"));

router.get("/dashboard", async (req, res) => {
  try {
    const db = getDb();
    const [[activeOrders]] = await db.query("SELECT COUNT(*) AS count FROM orders WHERE buyer_id = ? AND status IN ('pending', 'processing', 'shipped')", [req.user.id]);
    const [[totalOrders]] = await db.query("SELECT COUNT(*) AS count FROM orders WHERE buyer_id = ?", [req.user.id]);
    const [[wishlistItems]] = await db.query("SELECT COUNT(*) AS count FROM wishlist_items WHERE buyer_id = ?", [req.user.id]);
    const [[spent]] = await db.query("SELECT COALESCE(SUM(total_amount), 0) AS total FROM orders WHERE buyer_id = ? AND status != 'cancelled'", [req.user.id]);
    const [recentOrders] = await db.query(
      `SELECT o.*, u.name AS farmer_name
       FROM orders o
       JOIN users u ON u.id = o.farmer_id
       WHERE o.buyer_id = ?
       ORDER BY o.created_at DESC
       LIMIT 5`,
      [req.user.id]
    );
    const [recommended] = await db.query(
      `SELECT p.*, u.name AS farmer_name, u.location AS farmer_location, u.business_name AS farmer_business_name
       FROM products p
       JOIN users u ON u.id = p.farmer_id
       WHERE p.is_active = 1
       ORDER BY p.created_at DESC
       LIMIT 4`
    );

    res.json({
      stats: {
        activeOrders: activeOrders.count,
        totalOrders: totalOrders.count,
        wishlistItems: wishlistItems.count,
        totalSpent: Number(spent.total || 0),
      },
      recentOrders,
      recommendedProducts: recommended.map(formatProduct),
    });
  } catch {
    res.status(500).json({ message: "Unable to fetch buyer dashboard." });
  }
});

router.get("/cart", async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.query(
      `SELECT ci.id AS cart_item_id, ci.quantity AS cart_quantity, p.*, u.name AS farmer_name, u.location AS farmer_location, u.business_name AS farmer_business_name
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       JOIN users u ON u.id = p.farmer_id
       WHERE ci.buyer_id = ?
       ORDER BY ci.created_at DESC`,
      [req.user.id]
    );

    const items = rows.map((row) => ({
      id: row.cart_item_id,
      quantity: Number(row.cart_quantity),
      product: formatProduct(row),
      total: Number(row.cart_quantity) * Number(row.price),
    }));
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const shipping = subtotal > 0 ? 50 : 0;
    const tax = subtotal * 0.05;

    res.json({
      items,
      summary: { subtotal, shipping, tax, total: subtotal + shipping + tax },
    });
  } catch {
    res.status(500).json({ message: "Unable to fetch cart." });
  }
});

router.post("/cart", async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const db = getDb();
    await db.query(
      `INSERT INTO cart_items (buyer_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.user.id, productId, Number(quantity)]
    );
    res.json({ message: "Product added to cart." });
  } catch {
    res.status(500).json({ message: "Unable to add to cart." });
  }
});

router.put("/cart/:id", async (req, res) => {
  try {
    const db = getDb();
    await db.query("UPDATE cart_items SET quantity = ? WHERE id = ? AND buyer_id = ?", [Number(req.body.quantity), req.params.id, req.user.id]);
    res.json({ message: "Cart updated." });
  } catch {
    res.status(500).json({ message: "Unable to update cart." });
  }
});

router.delete("/cart/:id", async (req, res) => {
  try {
    const db = getDb();
    await db.query("DELETE FROM cart_items WHERE id = ? AND buyer_id = ?", [req.params.id, req.user.id]);
    res.json({ message: "Item removed from cart." });
  } catch {
    res.status(500).json({ message: "Unable to remove cart item." });
  }
});

router.post("/checkout", async (req, res) => {
  const db = getDb();
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();
    const [cartRows] = await connection.query(
      `SELECT ci.quantity AS cart_quantity, p.*
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.buyer_id = ?`,
      [req.user.id]
    );

    if (cartRows.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Your cart is empty." });
    }

    const farmerId = cartRows[0].farmer_id;
    const totalAmount = cartRows.reduce((sum, item) => sum + Number(item.cart_quantity) * Number(item.price), 0);
    const shippingAddress = req.body.shippingAddress || req.user.address || req.user.location || "Address not provided";

    const [orderResult] = await connection.query(
      `INSERT INTO orders (buyer_id, farmer_id, status, total_amount, shipping_address)
       VALUES (?, ?, 'pending', ?, ?)`,
      [req.user.id, farmerId, totalAmount, shippingAddress]
    );

    for (const item of cartRows) {
      const quantity = Number(item.cart_quantity);
      const price = Number(item.price);
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
         VALUES (?, ?, ?, ?, ?)`,
        [orderResult.insertId, item.id, quantity, price, quantity * price]
      );
      await connection.query("UPDATE products SET quantity = GREATEST(quantity - ?, 0) WHERE id = ?", [quantity, item.id]);
    }

    await connection.query("DELETE FROM cart_items WHERE buyer_id = ?", [req.user.id]);
    await connection.commit();

    res.status(201).json({ message: "Order placed successfully.", orderId: orderResult.insertId });
  } catch {
    await connection.rollback();
    res.status(500).json({ message: "Unable to place order." });
  } finally {
    connection.release();
  }
});

router.get("/orders", async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.query(
      `SELECT o.*, u.name AS farmer_name, u.business_name AS farmer_business_name
       FROM orders o
       JOIN users u ON u.id = o.farmer_id
       WHERE o.buyer_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json({ orders: rows });
  } catch {
    res.status(500).json({ message: "Unable to fetch buyer orders." });
  }
});

router.get("/wishlist", async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.query(
      `SELECT wi.id AS wishlist_item_id, p.*, u.name AS farmer_name, u.location AS farmer_location, u.business_name AS farmer_business_name
       FROM wishlist_items wi
       JOIN products p ON p.id = wi.product_id
       JOIN users u ON u.id = p.farmer_id
       WHERE wi.buyer_id = ?
       ORDER BY wi.created_at DESC`,
      [req.user.id]
    );
    res.json({ items: rows.map((row) => ({ id: row.wishlist_item_id, product: formatProduct(row) })) });
  } catch {
    res.status(500).json({ message: "Unable to fetch wishlist." });
  }
});

router.post("/wishlist", async (req, res) => {
  try {
    const db = getDb();
    await db.query("INSERT IGNORE INTO wishlist_items (buyer_id, product_id) VALUES (?, ?)", [req.user.id, req.body.productId]);
    res.json({ message: "Added to wishlist." });
  } catch {
    res.status(500).json({ message: "Unable to add to wishlist." });
  }
});

router.delete("/wishlist/:id", async (req, res) => {
  try {
    const db = getDb();
    await db.query("DELETE FROM wishlist_items WHERE id = ? AND buyer_id = ?", [req.params.id, req.user.id]);
    res.json({ message: "Removed from wishlist." });
  } catch {
    res.status(500).json({ message: "Unable to remove from wishlist." });
  }
});

export default router;
