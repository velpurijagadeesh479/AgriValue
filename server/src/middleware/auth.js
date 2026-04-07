import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { getDb } from "../db.js";

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  location: user.location,
  businessName: user.business_name,
  bio: user.bio,
  address: user.address,
  avatarUrl: user.avatar_url,
  isActive: Boolean(user.is_active),
  createdAt: user.created_at,
});

export const signToken = (user) =>
  jwt.sign({ userId: user.id, role: user.role }, config.jwtSecret, { expiresIn: "7d" });

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const db = getDb();
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [decoded.userId]);
    const user = rows[0];

    if (!user || !user.is_active) {
      return res.status(401).json({ message: "User account is unavailable." });
    }

    req.user = sanitizeUser(user);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have access to this resource." });
    }
    next();
  };
}

export { sanitizeUser };
