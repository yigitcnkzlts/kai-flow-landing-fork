import fs from "fs";
import path from "path";

function hexToLuminance(hex) {
  const clean = hex.replace("#", "");
  let r, g, b;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function isLightColor(color) {
  if (color === "white" || color === "#fff" || color === "#ffffff") return true;
  if (color === "none" || color === "currentcolor") return false;
  if (color.startsWith("#")) return hexToLuminance(color) > 0.6;
  return false;
}

const dir = path.join(process.cwd(), "public", "icons");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".svg"));

console.log("=== INVERT TRUE ===");
let invertCount = 0;
files.forEach((file) => {
  const ct = fs.readFileSync(path.join(dir, file), "utf-8").toLowerCase();
  const fm = (ct.match(/fill="([^"]+)"/g) || []).map(
    (m) => m.match(/fill="([^"]+)"/)[1]
  );
  const sm = (ct.match(/stroke="([^"]+)"/g) || []).map(
    (m) => m.match(/stroke="([^"]+)"/)[1]
  );
  const rf = fm.filter((f) => f !== "none");
  const rs = sm.filter((s) => s !== "none" && s !== "currentcolor");

  let inv = false;
  if (rf.length > 0 && rf.every((f) => isLightColor(f))) inv = true;
  if (
    !inv &&
    fm.includes("none") &&
    rs.length > 0 &&
    rs.every((s) => isLightColor(s))
  )
    inv = true;

  if (inv) {
    invertCount++;
    console.log(
      file,
      "| fills:",
      rf.join(",") || "(none)",
      "| strokes:",
      rs.join(",") || "(none)"
    );
  }
});
console.log(`\nTotal: ${invertCount} invert / ${files.length} total`);

console.log("\n=== INVERT FALSE (sample stroke colors) ===");
files.forEach((file) => {
  const ct = fs.readFileSync(path.join(dir, file), "utf-8").toLowerCase();
  const sm = (ct.match(/stroke="([^"]+)"/g) || []).map(
    (m) => m.match(/stroke="([^"]+)"/)[1]
  );
  const rs = sm.filter((s) => s !== "none" && s !== "currentcolor");
  if (rs.length > 0) {
    const lums = rs.map((s) =>
      s.startsWith("#") ? hexToLuminance(s).toFixed(2) : "?"
    );
    console.log(file, "| strokes:", rs.join(","), "| luminance:", lums.join(","));
  }
});
