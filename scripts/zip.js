import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import archiver from "archiver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    const rootDir = path.resolve(__dirname, "..");
    const distDir = path.join(rootDir, "dist");
    const zipPath = path.join(rootDir, "show-image.zip");

    if (!fs.existsSync(distDir)) {
      console.error("[zip] dist folder not found. Run `npm run build` first.");
      process.exit(1);
    }

    if (fs.existsSync(zipPath)) {
      fs.rmSync(zipPath, { force: true });
    }

    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", () => {
      console.log(`[zip] Created: ${zipPath} (${archive.pointer()} bytes)`);
    });

    archive.on("warning", (err) => {
      if (err.code === "ENOENT") {
        console.warn("[zip] Warning:", err);
      } else {
        throw err;
      }
    });

    archive.on("error", (err) => {
      console.error("[zip] Error:", err);
      process.exit(1);
    });

    archive.pipe(output);

    archive.directory(distDir + path.sep, false);

    await archive.finalize();
  } catch (err) {
    console.error("[zip] Failed to create zip:", err);
    process.exit(1);
  }
})();
