import path from "path";
import dotenv from "dotenv";

dotenv.config();

const parseBoolean = (value, defaultValue = false) => {
  if (value == null || value === "") {
    return defaultValue;
  }

  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const clientUrls = (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

export const config = {
  port: Number(process.env.PORT || 5000),
  clientUrl: clientUrls[0] || "http://localhost:5173",
  clientUrls,
  jwtSecret: process.env.JWT_SECRET || "agri-value-dev-secret",
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "5616",
    database: process.env.DB_NAME || "agri_value",
    ssl: parseBoolean(process.env.DB_SSL, false),
  },
  uploadsDir: path.resolve(process.cwd(), "uploads"),
};
