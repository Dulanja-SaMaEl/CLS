import { Router } from "express";
import {
  getGalleryHandler,
  addGalleryHandler,
  toggleFeaturedHandler,
  deleteGalleryHandler,
} from "../controllers/gallery.controller";

const router = Router();

router.get("/", getGalleryHandler);
router.post("/", addGalleryHandler);
router.put("/:id", toggleFeaturedHandler);
router.delete("/:id", deleteGalleryHandler);

export default router;
