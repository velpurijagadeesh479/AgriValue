import fs from "fs";
import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { initDb } from "./db.js";
import { seedDatabase } from "./seed.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import buyerRoutes from "./routes/buyer.js";
import farmerRoutes from "./routes/farmer.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
import notificationRoutes from "./routes/notifications.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.clientUrls.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

fs.mkdirSync(config.uploadsDir, { recursive: true });
app.use("/uploads", express.static(config.uploadsDir));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});

async function start() {
  await initDb();
  await seedDatabase();
  app.listen(config.port, () => {
    console.log(`Agri Value backend running on http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});
