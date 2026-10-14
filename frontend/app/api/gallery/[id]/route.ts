import { NextRequest, NextResponse } from "next/server";
import { deleteGalleryImage, toggleGalleryFeatured } from "@/lib/db";

interface RouteParams {
  params: { id: string };
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    const updated = await toggleGalleryFeatured(id);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    const deleted = await deleteGalleryImage(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Image removed from gallery" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
