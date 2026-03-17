import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const brandNames: Record<string, string> = {
  "openai": "OpenAI",
  "deepseek": "DeepSeek",
  "xai": "xAI",
  "grok": "Grok",
  "claude": "Claude",
  "anthropic": "Anthropic",
  "gemini": "Gemini",
  "gemma": "Gemma",
  "google": "Google",
  "google-drive": "Google Drive",
  "amazon": "Amazon Bedrock",
  "meta": "Meta",
  "llama": "LLaMA",
  "mistral": "Mistral AI",
  "cohere": "Cohere",
  "qwen": "Qwen",
  "github": "GitHub",
  "microsoft": "Microsoft",
  "ms-office": "MS Office",
  "databricks": "Databricks",
  "postgresql": "PostgreSQL",
  "postgresql_vectorstore": "PGVector",
  "redis": "Redis",
  "stepfun": "StepFun",
  "yi": "Yi",
  "zhipu": "Zhipu AI",
  "tavily_search": "Tavily Search",
  "tavily-nonbrand": "Tavily",
  "javascript": "JavaScript",
  "python": "Python",
  "kafka": "Kafka",
  "json": "JSON",
  "csv": "CSV",
  "xml": "XML",
  "pdf": "PDF",
  "excel": "Excel",
  "word": "Word",
  "webhook": "Webhook",
  "webhook-flow": "Webhook Flow",
  "git-compare": "Git Compare",
  "file-input": "File Input",
  "file-stack": "File Stack",
  "file-text": "File Text",
  "book-open": "Book Open",
  "message-circle": "Message Circle",
  "message-square": "Message Square",
  "chart-column": "Chart Column",
};

function formatName(filename: string): string {
  const name = filename.replace(/\.svg$/, "");
  if (brandNames[name]) return brandNames[name];
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function hexToLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  let r: number, g: number, b: number;

  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }

  // Relative luminance (0 = black, 1 = white)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function isLightColor(color: string): boolean {
  if (color === "white" || color === "#fff" || color === "#ffffff") return true;
  if (color === "none" || color === "currentcolor") return false;
  if (color.startsWith("#")) return hexToLuminance(color) > 0.6;
  return false;
}

function analyzeIcon(svgContent: string): { invert: boolean } {
  const content = svgContent.toLowerCase();

  // Extract all fill and stroke colors
  const fillMatches = content.match(/fill="([^"]+)"/g) || [];
  const strokeMatches = content.match(/stroke="([^"]+)"/g) || [];

  const fills = fillMatches.map((m) => m.match(/fill="([^"]+)"/)?.[1] ?? "");
  const strokes = strokeMatches.map(
    (m) => m.match(/stroke="([^"]+)"/)?.[1] ?? ""
  );

  // Case 1: white/light fill icons (openai, github, grok, etc.)
  const hasFillNone = fills.includes("none");
  const realFills = fills.filter((f) => f !== "none");
  if (realFills.length > 0 && realFills.every((f) => isLightColor(f))) {
    return { invert: true };
  }

  // Case 2: stroke-only icons with light strokes (lucide-style)
  if (hasFillNone && strokes.length > 0) {
    const realStrokes = strokes.filter(
      (s) => s !== "none" && s !== "currentcolor"
    );
    if (realStrokes.length > 0 && realStrokes.every((s) => isLightColor(s))) {
      return { invert: true };
    }
  }

  return { invert: false };
}

export async function GET() {
  const iconsDir = path.join(process.cwd(), "public", "icons");

  try {
    const files = fs.readdirSync(iconsDir);
    const icons = files
      .filter((file) => path.extname(file).toLowerCase() === ".svg")
      .map((file) => {
        const content = fs.readFileSync(path.join(iconsDir, file), "utf-8");
        const { invert } = analyzeIcon(content);
        return {
          icon: `/icons/${file}`,
          name: formatName(file),
          invert,
        };
      });

    return NextResponse.json({ icons });
  } catch {
    return NextResponse.json({ icons: [] });
  }
}
