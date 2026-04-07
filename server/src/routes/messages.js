import { Router } from "express";
import { getDb } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

const memberCheckSql = `
  SELECT 1
  FROM direct_conversation_members
  WHERE conversation_id = ? AND user_id = ?
  LIMIT 1`;

router.get("/directory", async (req, res) => {
  try {
    const db = getDb();
    const [users] = await db.query(
      `SELECT id, name, role, business_name, location
       FROM users
       WHERE id != ?
       ORDER BY role, name`,
      [req.user.id]
    );
    res.json({ users });
  } catch {
    res.status(500).json({ message: "Unable to fetch contacts." });
  }
});

router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.query(
      `SELECT dc.id, dc.updated_at, u.id AS partner_id, u.name AS partner_name, u.business_name AS partner_business_name, u.role AS partner_role
       FROM direct_conversations dc
       JOIN direct_conversation_members me ON me.conversation_id = dc.id AND me.user_id = ?
       JOIN direct_conversation_members other ON other.conversation_id = dc.id AND other.user_id != ?
       JOIN users u ON u.id = other.user_id
       ORDER BY dc.updated_at DESC`,
      [req.user.id, req.user.id]
    );
    res.json({ conversations: rows });
  } catch {
    res.status(500).json({ message: "Unable to fetch conversations." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = getDb();
    const [allowed] = await db.query(memberCheckSql, [req.params.id, req.user.id]);
    if (!allowed[0]) {
      return res.status(403).json({ message: "Access denied." });
    }

    const [messages] = await db.query(
      `SELECT dm.*, u.name AS sender_name, u.role AS sender_role
       FROM direct_messages dm
       JOIN users u ON u.id = dm.sender_id
       WHERE dm.conversation_id = ?
       ORDER BY dm.created_at ASC`,
      [req.params.id]
    );

    res.json({ messages });
  } catch {
    res.status(500).json({ message: "Unable to fetch messages." });
  }
});

router.post("/start", async (req, res) => {
  try {
    const { participantId, farmerId, message } = req.body;
    const targetUserId = participantId || farmerId;
    if (!targetUserId || Number(targetUserId) === Number(req.user.id)) {
      return res.status(400).json({ message: "Select a valid user to start a conversation." });
    }

    const db = getDb();
    const [existing] = await db.query(
      `SELECT dc.id
       FROM direct_conversations dc
       JOIN direct_conversation_members m1 ON m1.conversation_id = dc.id AND m1.user_id = ?
       JOIN direct_conversation_members m2 ON m2.conversation_id = dc.id AND m2.user_id = ?
       GROUP BY dc.id
       HAVING COUNT(*) = 1
       LIMIT 1`,
      [req.user.id, targetUserId]
    );

    let conversationId = existing[0]?.id;
    if (!conversationId) {
      const [result] = await db.query("INSERT INTO direct_conversations () VALUES ()");
      conversationId = result.insertId;
      await db.query(
        `INSERT INTO direct_conversation_members (conversation_id, user_id) VALUES (?, ?), (?, ?)`,
        [conversationId, req.user.id, conversationId, targetUserId]
      );
    }

    if (message?.trim()) {
      await db.query("INSERT INTO direct_messages (conversation_id, sender_id, body) VALUES (?, ?, ?)", [conversationId, req.user.id, message.trim()]);
      await db.query("UPDATE direct_conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", [conversationId]);
    }

    res.status(201).json({ conversationId });
  } catch {
    res.status(500).json({ message: "Unable to start conversation." });
  }
});

router.post("/:id", async (req, res) => {
  try {
    const { body } = req.body;
    if (!body?.trim()) {
      return res.status(400).json({ message: "Message body is required." });
    }

    const db = getDb();
    const [allowed] = await db.query(memberCheckSql, [req.params.id, req.user.id]);
    if (!allowed[0]) {
      return res.status(403).json({ message: "Access denied." });
    }

    const [result] = await db.query("INSERT INTO direct_messages (conversation_id, sender_id, body) VALUES (?, ?, ?)", [req.params.id, req.user.id, body.trim()]);
    await db.query("UPDATE direct_conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?", [req.params.id]);
    const [rows] = await db.query(
      `SELECT dm.*, u.name AS sender_name, u.role AS sender_role
       FROM direct_messages dm
       JOIN users u ON u.id = dm.sender_id
       WHERE dm.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ message: rows[0] });
  } catch {
    res.status(500).json({ message: "Unable to send message." });
  }
});

export default router;
