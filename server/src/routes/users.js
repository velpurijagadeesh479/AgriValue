import { Router } from "express";
import { getDb } from "../db.js";
import { requireAuth, sanitizeUser } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.put("/me", async (req, res) => {
  try {
    const { name, email, phone, location, businessName, bio, address } = req.body;
    const db = getDb();
    await db.query(
      `UPDATE users
       SET name = ?, email = ?, phone = ?, location = ?, business_name = ?, bio = ?, address = ?
       WHERE id = ?`,
      [name, email, phone, location, businessName || null, bio || "", address || "", req.user.id]
    );
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    res.json({ user: sanitizeUser(rows[0]) });
  } catch {
    res.status(500).json({ message: "Unable to update profile." });
  }
});

export default router;
