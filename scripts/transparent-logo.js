/**
 * Color-to-alpha pass — converts the white background of the logo crest
 * into proper transparency, preserving the gold + dog tones.
 *
 * Formula (GIMP-style "Color to Alpha"):
 *   whiteness  = min(R, G, B) / 255     (how much white is in the pixel)
 *   newAlpha   = (1 - whiteness) * origAlpha
 *   newRGB     = (origRGB - 255 * whiteness) / (1 - whiteness)
 */
const sharp = require("sharp");
const path = require("path");

const SRC = path.resolve(__dirname, "..", "public", "brand", "logo.png");
const OUT = path.resolve(__dirname, "..", "public", "brand", "logo-transparent.png");

(async () => {
    const img = sharp(SRC).ensureAlpha();
    const { data, info } = await img
        .raw()
        .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const out = Buffer.alloc(data.length);

    for (let i = 0; i < data.length; i += channels) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // whiteness ∈ [0, 1] — 1 means fully white
        const whiteness = Math.min(r, g, b) / 255;

        if (whiteness >= 0.999) {
            out[i] = 0;
            out[i + 1] = 0;
            out[i + 2] = 0;
            out[i + 3] = 0;
            continue;
        }

        const inv = 1 - whiteness;
        // un-premultiply white from the channel
        const nr = Math.max(0, Math.min(255, Math.round((r - 255 * whiteness) / inv)));
        const ng = Math.max(0, Math.min(255, Math.round((g - 255 * whiteness) / inv)));
        const nb = Math.max(0, Math.min(255, Math.round((b - 255 * whiteness) / inv)));
        const na = Math.round(a * inv);

        out[i] = nr;
        out[i + 1] = ng;
        out[i + 2] = nb;
        out[i + 3] = na;
    }

    await sharp(out, { raw: { width, height, channels } })
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(OUT);

    console.log(`✓ wrote ${OUT}`);
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
