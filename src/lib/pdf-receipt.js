/* -------------------------------------------------------------------------- */
/*  Donation Receipt — themed PDF generator                                   */
/*                                                                            */
/*  Loads jsPDF on demand from a CDN (no extra npm dep needed) and builds a   */
/*  receipt styled with the temple's brass / vermillion / parchment palette.  */
/*                                                                            */
/*  Usage:                                                                    */
/*    const { dataUrl, base64, filename } = await generateReceiptPdf({...});  */
/* -------------------------------------------------------------------------- */

const JSPDF_CDN_URLS = [
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js",
  "https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js",
];
const CDN_TIMEOUT_MS = 15000;

/* Theme colours pulled from src/styles.css (oklch converted to RGB) */
const THEME = {
  parchment: [248, 244, 233], // soft cream background
  ink: [38, 28, 22], // deep brown ink
  brass: [196, 152, 78], // brass gold
  brassDeep: [148, 110, 56],
  vermillion: [176, 48, 32], // kumkumam red
  shadow: [220, 200, 170],
};

let jsPdfPromise = null;

/**
 * Load jsPDF from a list of CDNs, falling back if any individual host fails.
 * Always resolves or rejects within `CDN_TIMEOUT_MS` so the form never freezes
 * waiting for a hung script load.
 */
function loadJsPdf() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("PDF generation requires a browser"));
  }
  if (window.jspdf?.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
  if (jsPdfPromise) return jsPdfPromise;

  const promise = new Promise((resolve, reject) => {
    let done = false;
    const finishOk = (val) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(val);
    };
    const finishErr = (err) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      reject(err);
    };

    const timer = setTimeout(
      () => finishErr(new Error("jsPDF CDN load timed out — check your internet connection")),
      CDN_TIMEOUT_MS,
    );

    const tryUrl = (idx) => {
      if (done) return;
      if (window.jspdf?.jsPDF) return finishOk(window.jspdf.jsPDF);
      if (idx >= JSPDF_CDN_URLS.length) {
        return finishErr(new Error("jsPDF could not be loaded from any CDN"));
      }
      const url = JSPDF_CDN_URLS[idx];
      const existing = document.querySelector(`script[data-jspdf-src="${url}"]`);
      if (existing) {
        // Poll for the global since the load event may have already fired.
        const poll = setInterval(() => {
          if (done) {
            clearInterval(poll);
            return;
          }
          if (window.jspdf?.jsPDF) {
            clearInterval(poll);
            finishOk(window.jspdf.jsPDF);
          }
        }, 100);
        // Stop polling after a short window and try the next CDN.
        setTimeout(() => {
          if (done) return;
          clearInterval(poll);
          tryUrl(idx + 1);
        }, 4000);
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.jspdfSrc = url;
      script.onload = () => {
        if (window.jspdf?.jsPDF) finishOk(window.jspdf.jsPDF);
        else tryUrl(idx + 1);
      };
      script.onerror = () => tryUrl(idx + 1);
      document.head.appendChild(script);
    };

    tryUrl(0);
  });

  jsPdfPromise = promise;
  // Clear cached promise on rejection so a future submit can retry the load.
  promise.catch(() => {
    jsPdfPromise = null;
  });
  return promise;
}

/**
 * Eagerly start fetching jsPDF in the background so it's ready by the time
 * the donor clicks "Submit". Safe to call from any component's `useEffect`.
 */
export function preloadJsPdf() {
  loadJsPdf().catch(() => {
    /* swallow — actual users see the real error on submit */
  });
}

function setColor(doc, fn, [r, g, b]) {
  doc[fn](r, g, b);
}

function formatINR(amount) {
  const value = Number(amount) || 0;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `₹${value}`;
  }
}

function makeReceiptId() {
  const now = new Date();
  const ymd =
    String(now.getFullYear()) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SST-${ymd}-${rand}`;
}

function formatDate(date = new Date()) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return date.toString();
  }
}

/**
 * Generate a themed PDF receipt for a donation.
 *
 * @param {Object} params
 * @param {string} params.name        Donor name
 * @param {string} params.phone       Donor phone
 * @param {string} params.email       Donor email
 * @param {number|string} params.amount  Donation amount in INR
 * @param {string} [params.upiId]     UPI id receipt was paid to
 * @param {string} [params.receiptId] Optional pre-generated receipt id
 * @returns {Promise<{ dataUrl:string, base64:string, blob:Blob, filename:string, receiptId:string, issuedAt:string }>}
 */
export async function generateReceiptPdf({
  name,
  phone,
  email,
  amount,
  upiId = "srialayam@upi",
  receiptId,
} = {}) {
  const JsPDF = await loadJsPdf();
  const doc = new JsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const innerLeft = margin + 18;
  const innerRight = pageWidth - margin - 18;
  const contentWidth = innerRight - innerLeft;

  const id = receiptId || makeReceiptId();
  const issuedAt = formatDate(new Date());

  // ---------- Page background (parchment) ----------
  setColor(doc, "setFillColor", THEME.parchment);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Outer brass border
  setColor(doc, "setDrawColor", THEME.brass);
  doc.setLineWidth(2);
  doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin, "S");

  // Inner deep border
  setColor(doc, "setDrawColor", THEME.brassDeep);
  doc.setLineWidth(0.6);
  doc.rect(
    margin + 6,
    margin + 6,
    pageWidth - 2 * (margin + 6),
    pageHeight - 2 * (margin + 6),
    "S",
  );

  // ---------- Header band (sunset gradient via overlapping bands) ----------
  const headerTop = margin + 20;
  const headerHeight = 110;
  setColor(doc, "setFillColor", THEME.vermillion);
  doc.roundedRect(innerLeft, headerTop, contentWidth, headerHeight, 10, 10, "F");
  setColor(doc, "setFillColor", THEME.brass);
  doc.roundedRect(innerLeft, headerTop + headerHeight - 28, contentWidth, 28, 10, 10, "F");

  // Header text — Tamil + English temple name
  setColor(doc, "setTextColor", [255, 248, 232]);
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text("SRI SUBRAMANIYAR TEMPLE", pageWidth / 2, headerTop + 38, {
    align: "center",
  });
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.text("Sri Valli Devasena Sametha Subramaniyar Aalayam", pageWidth / 2, headerTop + 56, {
    align: "center",
  });
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.text("Inamkariyandhal, Tiruvannamalai District — 606604", pageWidth / 2, headerTop + 70, {
    align: "center",
  });

  // Receipt eyebrow on brass band
  setColor(doc, "setTextColor", [40, 24, 12]);
  doc.setFont("times", "bold");
  doc.setFontSize(10);
  doc.text("DONATION RECEIPT  ·  தான ரசீது", pageWidth / 2, headerTop + headerHeight - 10, {
    align: "center",
  });

  // ---------- Receipt meta (id + date) ----------
  let cursorY = headerTop + headerHeight + 28;
  setColor(doc, "setTextColor", THEME.ink);
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.text(`Receipt No.   ${id}`, innerLeft, cursorY);
  doc.text(`Issued        ${issuedAt}`, innerRight, cursorY, { align: "right" });

  // Decorative gold rule
  cursorY += 14;
  setColor(doc, "setDrawColor", THEME.brass);
  doc.setLineWidth(0.8);
  doc.line(innerLeft, cursorY, innerRight, cursorY);

  // ---------- Greeting ----------
  cursorY += 28;
  setColor(doc, "setTextColor", THEME.brassDeep);
  doc.setFont("times", "italic");
  doc.setFontSize(11);
  doc.text("With deep gratitude · நன்றியுடன்", pageWidth / 2, cursorY, {
    align: "center",
  });

  cursorY += 22;
  setColor(doc, "setTextColor", THEME.ink);
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text(`Thank you, ${(name || "Devotee").trim()}`, pageWidth / 2, cursorY, { align: "center" });

  cursorY += 18;
  doc.setFont("times", "normal");
  doc.setFontSize(10.5);
  setColor(doc, "setTextColor", [70, 50, 38]);
  const blessing =
    "Your offering supports the daily rituals, lamp services and upkeep of the temple. May Lord Murugan bless you with health, prosperity and peace.";
  const blessingLines = doc.splitTextToSize(blessing, contentWidth - 40);
  doc.text(blessingLines, pageWidth / 2, cursorY, { align: "center" });
  cursorY += blessingLines.length * 13 + 8;

  // ---------- Details card ----------
  const cardX = innerLeft;
  const cardY = cursorY;
  const cardW = contentWidth;
  const rows = [
    ["Donor Name · பெயர்", (name || "—").trim()],
    ["Phone · தொலைபேசி", (phone || "—").trim()],
    ["Email · ஈ-மெயில்", (email || "—").trim()],
    ["Amount · தொகை", formatINR(amount)],
    ["Payment Mode · முறை", `UPI · ${upiId}`],
    ["Date · தேதி", issuedAt],
  ];
  const rowHeight = 30;
  const cardH = rowHeight * rows.length + 18;

  // Card background
  setColor(doc, "setFillColor", [253, 248, 235]);
  doc.roundedRect(cardX, cardY, cardW, cardH, 10, 10, "F");
  setColor(doc, "setDrawColor", THEME.brass);
  doc.setLineWidth(1);
  doc.roundedRect(cardX, cardY, cardW, cardH, 10, 10, "S");

  // Rows
  rows.forEach((row, i) => {
    const y = cardY + 18 + i * rowHeight;
    if (i > 0) {
      setColor(doc, "setDrawColor", [232, 218, 188]);
      doc.setLineWidth(0.4);
      doc.line(cardX + 14, y - 12, cardX + cardW - 14, y - 12);
    }
    setColor(doc, "setTextColor", THEME.brassDeep);
    doc.setFont("times", "italic");
    doc.setFontSize(9.5);
    doc.text(row[0], cardX + 18, y);

    setColor(doc, "setTextColor", THEME.ink);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    const valueLines = doc.splitTextToSize(String(row[1] || "—"), cardW - 220);
    doc.text(valueLines, cardX + cardW - 18, y, { align: "right" });
  });

  cursorY = cardY + cardH + 28;

  // ---------- Total band ----------
  const totalBandH = 50;
  setColor(doc, "setFillColor", THEME.ink);
  doc.roundedRect(innerLeft, cursorY, contentWidth, totalBandH, 8, 8, "F");
  setColor(doc, "setTextColor", THEME.brass);
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.text("TOTAL DONATION", innerLeft + 24, cursorY + 22);
  setColor(doc, "setTextColor", [255, 248, 232]);
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text(formatINR(amount), innerRight - 24, cursorY + 32, { align: "right" });

  cursorY += totalBandH + 28;

  // ---------- Footer / blessing ----------
  setColor(doc, "setDrawColor", THEME.brass);
  doc.setLineWidth(0.6);
  doc.line(innerLeft + 60, cursorY, innerRight - 60, cursorY);

  cursorY += 22;
  setColor(doc, "setTextColor", THEME.vermillion);
  doc.setFont("times", "italic");
  doc.setFontSize(13);
  doc.text("ஓம் சரவணபவ", pageWidth / 2, cursorY, { align: "center" });

  cursorY += 18;
  setColor(doc, "setTextColor", [90, 70, 52]);
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.text(
    "This is a system-generated receipt of a UPI donation. No signature is required.",
    pageWidth / 2,
    cursorY,
    { align: "center" },
  );
  cursorY += 12;
  doc.text(
    "For queries: gokulsaravanana663@gmail.com  ·  +91 98765 43210",
    pageWidth / 2,
    cursorY,
    { align: "center" },
  );

  // Bottom-right credit
  setColor(doc, "setTextColor", THEME.brassDeep);
  doc.setFont("times", "italic");
  doc.setFontSize(8);
  doc.text(
    "Sri Subramaniyar Temple · Online Donation Portal",
    pageWidth - margin - 18,
    pageHeight - margin - 18,
    { align: "right" },
  );

  // ---------- Output ----------
  const dataUrl = doc.output("datauristring"); // "data:application/pdf;base64,..."
  const base64 = dataUrl.split(",")[1] || "";
  const blob = doc.output("blob");
  const filename = `donation-receipt-${id}.pdf`;

  return { dataUrl, base64, blob, filename, receiptId: id, issuedAt };
}

/** Trigger a browser download of the receipt blob. */
export function downloadReceiptBlob(blob, filename) {
  if (!blob || typeof window === "undefined") return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "donation-receipt.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
