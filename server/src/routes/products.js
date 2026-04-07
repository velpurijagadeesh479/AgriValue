import { Router } from "express";
import { getDb } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { deleteUploadedFiles, saveUploadedFiles } from "../storage.js";
import { formatProduct } from "../utils.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const { q = "", category = "all" } = req.query;
    const params = [];
    let where = "WHERE p.is_active = 1";

    if (category !== "all") {
      where += " AND p.category = ?";
      params.push(category);
    }

    if (q) {
      where += " AND (p.name LIKE ? OR p.description LIKE ? OR p.location LIKE ?)";
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    const [rows] = await db.query(
      `SELECT p.*, u.name AS farmer_name, u.location AS farmer_location, u.business_name AS farmer_business_name
       FROM products p
       JOIN users u ON u.id = p.farmer_id
       ${where}
       ORDER BY p.created_at DESC`,
      params
    );

    res.json({ products: rows.map(formatProduct) });
  } catch {
    res.status(500).json({ message: "Unable to fetch products." });
  }
});

router.get("/farmer/mine/list", requireAuth, requireRole("farmer"), async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.query("SELECT * FROM products WHERE farmer_id = ? ORDER BY created_at DESC", [req.user.id]);
    res.json({ products: rows.map(formatProduct) });
  } catch {
    res.status(500).json({ message: "Unable to fetch farmer products." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.query(
      `SELECT p.*, u.name AS farmer_name, u.location AS farmer_location, u.business_name AS farmer_business_name
       FROM products p
       JOIN users u ON u.id = p.farmer_id
       WHERE p.id = ?`,
      [req.params.id]
    );

    if (!rows[0]) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json({ product: formatProduct(rows[0]) });
  } catch {
    res.status(500).json({ message: "Unable to fetch product details." });
  }
});

router.post("/", requireAuth, requireRole("farmer"), upload.array("images", 5), async (req, res) => {
  let imageUrls = [];
  try {
    const { name, category, description, price, quantity, unit, location } = req.body;
    if (!name || !category || !description || !price || !quantity || !unit || !location) {
      return res.status(400).json({ message: "Please fill in all product fields." });
    }

    imageUrls = await saveUploadedFiles(req, req.files || []);
    const db = getDb();
    const [result] = await db.query(
      `INSERT INTO products (farmer_id, name, category, description, price, quantity, unit, location, image_urls)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, name, category, description, Number(price), Number(quantity), unit, location, JSON.stringify(imageUrls)]
    );

    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [result.insertId]);
    res.status(201).json({ product: formatProduct(rows[0]) });
  } catch {
    await deleteUploadedFiles(imageUrls);
    res.status(500).json({ message: "Unable to create product." });
  }
});

router.put("/:id", requireAuth, requireRole("farmer"), async (req, res) => {
  try {
    const { name, category, description, price, quantity, unit, location, isActive } = req.body;
    const db = getDb();
    const [rows] = await db.query("SELECT * FROM products WHERE id = ? AND farmer_id = ?", [req.params.id, req.user.id]);
    if (!rows[0]) {
      return res.status(404).json({ message: "Product not found." });
    }

    await db.query(
      `UPDATE products
       SET name = ?, category = ?, description = ?, price = ?, quantity = ?, unit = ?, location = ?, is_active = ?
       WHERE id = ? AND farmer_id = ?`,
      [name, category, description, Number(price), Number(quantity), unit, location, isActive ? 1 : 0, req.params.id, req.user.id]
    );

    const [updatedRows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    res.json({ product: formatProduct(updatedRows[0]) });
  } catch {
    res.status(500).json({ message: "Unable to update product." });
  }
});

router.delete("/:id", requireAuth, requireRole("farmer"), async (req, res) => {
  try {
    const db = getDb();
    const [rows] = await db.query("SELECT * FROM products WHERE id = ? AND farmer_id = ?", [req.params.id, req.user.id]);
    if (!rows[0]) {
      return res.status(404).json({ message: "Product not found." });
    }

    await db.query("DELETE FROM products WHERE id = ? AND farmer_id = ?", [req.params.id, req.user.id]);
    await deleteUploadedFiles(formatProduct(rows[0]).imageUrls);
    res.json({ message: "Product removed successfully." });
  } catch {
    res.status(500).json({ message: "Unable to remove product." });
  }
});

export default router;
