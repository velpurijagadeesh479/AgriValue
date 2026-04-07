import { Router } from "express";
import { getDb } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const db = getDb();
    let notifications = [];

    if (req.user.role === "admin") {
      const [recentOrders] = await db.query(
        `SELECT o.id, o.total_amount, o.status, o.created_at, buyer.name AS buyer_name, farmer.name AS farmer_name
         FROM orders o
         JOIN users buyer ON buyer.id = o.buyer_id
         JOIN users farmer ON farmer.id = o.farmer_id
         ORDER BY o.created_at DESC
         LIMIT 5`
      );

      const [recentUsers] = await db.query(
        `SELECT id, name, role, created_at
         FROM users
         WHERE role IN ('buyer', 'farmer')
         ORDER BY created_at DESC
         LIMIT 5`
      );

      notifications = [
        ...recentOrders.map((order) => ({
          id: `order-${order.id}`,
          type: "order",
          title: `New order #${order.id}`,
          message: `${order.buyer_name} placed an order with ${order.farmer_name} for Rs. ${Number(order.total_amount).toFixed(2)}.`,
          createdAt: order.created_at,
          status: order.status,
        })),
        ...recentUsers.map((user) => ({
          id: `user-${user.id}`,
          type: "user",
          title: `New ${user.role} joined`,
          message: `${user.name} registered as a ${user.role}.`,
          createdAt: user.created_at,
          status: "new",
        })),
      ];
    }

    if (req.user.role === "farmer") {
      const [recentOrders] = await db.query(
        `SELECT o.id, o.total_amount, o.status, o.created_at, buyer.name AS buyer_name
         FROM orders o
         JOIN users buyer ON buyer.id = o.buyer_id
         WHERE o.farmer_id = ?
         ORDER BY o.created_at DESC
         LIMIT 6`,
        [req.user.id]
      );

      const [recentMessages] = await db.query(
        `SELECT m.id, m.body, m.created_at, sender.name AS sender_name
         FROM messages m
         JOIN conversations c ON c.id = m.conversation_id
         JOIN users sender ON sender.id = m.sender_id
         WHERE c.farmer_id = ? AND m.sender_id != ?
         ORDER BY m.created_at DESC
         LIMIT 6`,
        [req.user.id, req.user.id]
      );

      notifications = [
        ...recentOrders.map((order) => ({
          id: `order-${order.id}`,
          type: "order",
          title: `Order #${order.id} updated`,
          message: `${order.buyer_name} has an order worth Rs. ${Number(order.total_amount).toFixed(2)}. Status: ${order.status}.`,
          createdAt: order.created_at,
          status: order.status,
        })),
        ...recentMessages.map((message) => ({
          id: `message-${message.id}`,
          type: "message",
          title: `New buyer message`,
          message: `${message.sender_name}: ${message.body.slice(0, 80)}`,
          createdAt: message.created_at,
          status: "new",
        })),
      ];
    }

    if (req.user.role === "buyer") {
      const [recentOrders] = await db.query(
        `SELECT o.id, o.total_amount, o.status, o.created_at, farmer.name AS farmer_name
         FROM orders o
         JOIN users farmer ON farmer.id = o.farmer_id
         WHERE o.buyer_id = ?
         ORDER BY o.created_at DESC
         LIMIT 6`,
        [req.user.id]
      );

      const [recentMessages] = await db.query(
        `SELECT m.id, m.body, m.created_at, sender.name AS sender_name
         FROM messages m
         JOIN conversations c ON c.id = m.conversation_id
         JOIN users sender ON sender.id = m.sender_id
         WHERE c.buyer_id = ? AND m.sender_id != ?
         ORDER BY m.created_at DESC
         LIMIT 6`,
        [req.user.id, req.user.id]
      );

      notifications = [
        ...recentOrders.map((order) => ({
          id: `order-${order.id}`,
          type: "order",
          title: `Order #${order.id} status`,
          message: `${order.farmer_name} order worth Rs. ${Number(order.total_amount).toFixed(2)} is now ${order.status}.`,
          createdAt: order.created_at,
          status: order.status,
        })),
        ...recentMessages.map((message) => ({
          id: `message-${message.id}`,
          type: "message",
          title: `New farmer message`,
          message: `${message.sender_name}: ${message.body.slice(0, 80)}`,
          createdAt: message.created_at,
          status: "new",
        })),
      ];
    }

    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentNotifications = notifications.slice(0, 8);
    const unreadCount = recentNotifications.filter((item) => {
      const createdTime = new Date(item.createdAt).getTime();
      return Date.now() - createdTime < 24 * 60 * 60 * 1000;
    }).length;

    res.json({
      notifications: recentNotifications,
      unreadCount,
    });
  } catch {
    res.status(500).json({ message: "Unable to fetch notifications." });
  }
});

export default router;
