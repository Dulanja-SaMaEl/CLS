import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${timestamp}-${sanitizedName}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
});

export function uploadFileHandler(req: Request, res: Response) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const publicUrl = `/uploads/${file.filename}`;
    return res.status(201).json({
      success: true,
      url: publicUrl,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
