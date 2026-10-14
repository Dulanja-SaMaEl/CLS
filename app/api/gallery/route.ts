import { NextRequest, NextResponse } from "next/server";
import { getGalleryImages, addGalleryImage } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";

    let images = await getGalleryImages(category);

    if (featuredOnly) {
      images = images.filter((img) => img.featured);
    }

    return NextResponse.json({ success: true, count: images.length, data: images });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.imageUrl) {
      return NextResponse.json(
        { success: false, error: "Title and imageUrl are required" },
        { status: 400 }
      );
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

    return NextResponse.json({ success: true, data: image }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
