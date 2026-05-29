/**
 * Favicon generator — produces a full favicon set for Next.js App Router
 * file-based metadata convention.
 *
 *   src/app/icon.png         — 256×256, used as the primary <link rel="icon">
 *   src/app/apple-icon.png   — 180×180, iOS home-screen
 *   src/app/favicon.ico      — 16/32/48 multi-size, legacy browsers
 *
 * The source crest already has rounded-corner + transparent background.
 */
const sharp = require("sharp");
const pngToIco = require("png-to-ico").default;
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public", "brand", "favicon-source.png");
const APP = path.join(ROOT, "src", "app");

async function makePng(size, outName) {
    const out = path.join(APP, outName);
    await sharp(SRC)
        .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(out);
    console.log(`✓ ${outName} (${size}×${size})`);
}

async function makeIco() {
    // Build 16, 32, 48 buffers in memory, then pack into one .ico
    const sizes = [16, 32, 48];
    const buffers = await Promise.all(
        sizes.map((s) =>
            sharp(SRC)
                .resize(s, s, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .png()
                .toBuffer(),
        ),
    );
    const ico = await pngToIco(buffers);
    const out = path.join(APP, "favicon.ico");
    fs.writeFileSync(out, ico);
    console.log(`✓ favicon.ico (16/32/48)`);
}

(async () => {
    await makePng(256, "icon.png");
    await makePng(180, "apple-icon.png");
    await makeIco();
    console.log("done");
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
