import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SUPPORTED_EXTENSIONS = [".gif", ".png", ".jpg", ".jpeg", ".webp", ".svg"];

export async function GET() {
  const videosDir = path.join(process.cwd(), "public", "videos");

  try {
    const files = fs.readdirSync(videosDir);
    const images = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return SUPPORTED_EXTENSIONS.includes(ext);
      })
      .map((file) => `/videos/${file}`);

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
