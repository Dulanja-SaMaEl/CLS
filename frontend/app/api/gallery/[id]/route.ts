import { NextRequest, NextResponse } from "next/server";
import { deleteGalleryImage, toggleGalleryFeatured } from "@/lib/db";

async function parseId(req: NextRequest, params: any): Promise<number> {
  const resolved = await Promise.resolve(params);
  let id = parseInt(resolved?.id, 10);
  if (isNaN(id)) {
    const parts = req.nextUrl.pathname.split("/").filter(Boolean);
    id = parseInt(parts[parts.length - 1], 10);
  }
  return isNaN(id) ? 0 : id;
}

export async function PUT(req: NextRequest, { params }: { params: any }) {
  try {
    const id = await parseId(req, params);
    const updated = await toggleGalleryFeatured(id);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
  try {
    const id = await parseId(req, params);
    const deleted = await deleteGalleryImage(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Image removed from gallery" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
