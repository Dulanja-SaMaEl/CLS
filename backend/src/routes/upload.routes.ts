import { Router } from "express";
import { uploadMiddleware, uploadFileHandler } from "../controllers/upload.controller";

const router = Router();

router.post("/", uploadMiddleware.single("file"), uploadFileHandler);

export default router;
