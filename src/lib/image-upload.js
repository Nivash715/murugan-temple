/* -------------------------------------------------------------------------- */
/*  Image upload helper                                                       */
/*                                                                            */
/*  Reads a File from a file <input>, downscales it to a maximum dimension,   */
/*  and returns a JPEG data URL. Keeps localStorage sane (most uploads end    */
/*  up well under 500 KB).                                                    */
/* -------------------------------------------------------------------------- */

const DEFAULT_MAX_DIMENSION = 1600;
const DEFAULT_QUALITY = 0.85;

export async function fileToCompressedDataUrl(
  file,
  { maxDimension = DEFAULT_MAX_DIMENSION, quality = DEFAULT_QUALITY } = {},
) {
  if (!file) throw new Error("No file provided");
  if (!file.type.startsWith("image/")) {
    throw new Error("தவறான கோப்பு வகை — படக் கோப்பை மட்டும் தேர்ந்தெடுக்கவும்.");
  }

  // Read the file as a data URL first so we can decode it as an Image.
  const originalDataUrl = await readAsDataUrl(file);
  const img = await loadImage(originalDataUrl);

  // If the image already fits comfortably, just return the original.
  // PNGs with transparency are kept as-is to preserve alpha.
  const isPng = file.type === "image/png";
  const fitsAsIs =
    img.naturalWidth <= maxDimension &&
    img.naturalHeight <= maxDimension &&
    file.size <= 500 * 1024;
  if (fitsAsIs) return originalDataUrl;

  // Otherwise, draw onto a canvas and re-encode.
  const ratio = Math.min(
    1,
    maxDimension / Math.max(img.naturalWidth, img.naturalHeight),
  );
  const w = Math.round(img.naturalWidth * ratio);
  const h = Math.round(img.naturalHeight * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  // For non-PNG (or large PNG) we encode as JPEG with a flat white background
  // so transparency doesn't show up as pure black.
  if (!isPng) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(img, 0, 0, w, h);

  const mime = isPng ? "image/png" : "image/jpeg";
  return canvas.toDataURL(mime, quality);
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to decode image"));
    img.src = src;
  });
}
