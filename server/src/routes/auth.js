import { Router } from "express";
import bcrypt from "bcryptjs";
import { getDb } from "../db.js";
import { requireAuth, sanitizeUser, signToken } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role, location, businessName, bio = "", address = "" } = req.body;

    if (!name || !email || !phone || !password || !role || !location) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    if (!["admin", "farmer", "buyer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected." });
    }

    const db = getDb();
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO users (name, email, phone, password_hash, role, location, business_name, bio, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, passwordHash, role, location, businessName || null, bio, address]
    );

    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [result.insertId]);
    const user = sanitizeUser(rows[0]);
    const token = signToken(user);

    res.status(201).json({ token, user });
  } catch {
    res.status(500).json({ message: "Unable to register user right now." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email, password, and role are required." });
    }

    const db = getDb();
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user || user.role !== role) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid login credentials." });
    }

    const safeUser = sanitizeUser(user);
    const token = signToken(safeUser);
    res.json({ token, user: safeUser });
  } catch {
    res.status(500).json({ message: "Unable to sign in right now." });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: req.user });
});

export default router;
