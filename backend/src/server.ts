import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

import apiRouter from "./routes";

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware (allow cross-origin images for Vercel frontend)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or if in allowed list
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        // Also allow Vercel preview deployments (*.vercel.app)
        if (origin.endsWith(".vercel.app")) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in production for public legal API
        }
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Logging & Body Parsers
app.use(morgan("dev"));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Static File Serving for Uploaded Assets
const uploadsDir = path.join(process.cwd(), "public", "uploads");
app.use("/uploads", express.static(uploadsDir));

// Mount REST API
app.use("/api", apiRouter);

// Root Route Information
app.get("/", (_req: Request, res: Response) => {
  res.json({
    name: "Colombo Law Society REST API",
    jurisdiction: "Superior Courts Enclave, Hulftsdorp, Colombo 12",
    status: "Active",
    version: "2.0.0",
    docs: "/api/health",
  });
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: "Endpoint not found" });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled API Error:", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🏛️  COLOMBO LAW SOCIETY — STANDALONE BACKEND SERVER`);
  console.log(`📡  Listening on Port: ${PORT}`);
  console.log(`🌍  Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`====================================================`);
});

export default app;
