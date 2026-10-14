import { Request, Response } from "express";
import { getGalleryImages, addGalleryImage, toggleGalleryFeatured, deleteGalleryImage } from "../config/db";

export async function getGalleryHandler(req: Request, res: Response) {
  try {
    const { category, featured } = req.query;
    let images = await getGalleryImages(category ? String(category) : undefined);

    if (featured === "true") {
      images = images.filter((img) => img.featured);
    }

    return res.json({ success: true, count: images.length, data: images });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function addGalleryHandler(req: Request, res: Response) {
  try {
    const body = req.body;
    if (!body.title || !body.imageUrl) {
      return res.status(400).json({ success: false, error: "Title and imageUrl are required" });
    }

    const image = await addGalleryImage({
      title: body.title,
      category: body.category || "National Conference",
      imageUrl: body.imageUrl,
      thumbnailUrl: body.thumbnailUrl || body.imageUrl,
      date: body.date || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      venue: body.venue || "Superior Courts Complex, Hulftsdorp",
      description: body.description || "",
      featured: Boolean(body.featured),
      photographer: body.photographer || "CLS Secretariat Media",
      eventId: body.eventId ? parseInt(body.eventId, 10) : undefined,
    });

    return res.status(201).json({ success: true, data: image });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function toggleFeaturedHandler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const updated = await toggleGalleryFeatured(id);
    if (!updated) return res.status(404).json({ success: false, error: "Image not found" });
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function deleteGalleryHandler(req: Request, res: Response) {
  try {
    const id = parseInt(req.params.id, 10);
    const deleted = await deleteGalleryImage(id);
    if (!deleted) return res.status(404).json({ success: false, error: "Image not found" });
    return res.json({ success: true, message: "Photograph removed from showcase" });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
