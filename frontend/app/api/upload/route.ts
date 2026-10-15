import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Prepare resilient Base64 Data URL (guaranteed to work across all serverless & edge platforms)
    const mimeType = file.type || "image/jpeg";
    const base64String = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64String}`;

    let finalUrl = dataUrl;

    // Try saving to disk if the filesystem is writable (e.g. local development)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const filename = `${timestamp}_${originalName}`;
      const filepath = path.join(uploadsDir, filename);

      fs.writeFileSync(filepath, buffer);
      finalUrl = `/uploads/${filename}`;
    } catch (fsErr) {
      // Vercel serverless / AWS Lambda filesystem is read-only (EROFS).
      // Seamlessly fallback to the high-fidelity data URL without throwing errors.
      console.warn("Serverless read-only filesystem detected; using Base64 Data URL for asset.");
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      filename: file.name,
      size: file.size,
    });
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
