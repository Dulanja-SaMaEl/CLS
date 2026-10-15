/**
 * Client-side image optimization and compression utility for the Colombo Law Society portal.
 * Ensures image uploads never exceed serverless payload limits (4.5MB on Vercel)
 * and load quickly on mobile and desktop devices.
 */

export async function compressImageFile(
  file: File,
  maxWidth = 1600,
  quality = 0.82
): Promise<Blob> {
  // If not an image or if it's SVG, return original file
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;

      // Only resize if wider than maxWidth
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Convert PNGs > 1MB to JPEG to save significant bandwidth
      const outputMime =
        file.type === "image/png" && file.size > 1024 * 1024
          ? "image/jpeg"
          : file.type || "image/jpeg";

      canvas.toBlob(
        (blob) => {
          resolve(blob || file);
        },
        outputMime,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

export function readFileAsDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
