/* -------------------------------------------------------------------------- */
/*  Donation Receipt — Tamil-styled PDF generator                             */
/*                                                                            */
/*  Uses html2canvas + jsPDF to render the receipt with full Tamil text       */
/*  support, matching the official Tamil receipt design.                      */
/*                                                                            */
/*  Usage:                                                                    */
/*    const { dataUrl, base64, blob, filename } = await generateReceiptPdf({  */
/*      name, phone, email, amount, upiId                                     */
/*    });                                                                     */
/* -------------------------------------------------------------------------- */

const JSPDF_CDN_URLS = [
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js",
  "https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js",
];

const HTML2CANVAS_CDN_URLS = [
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
  "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js",
];

const CDN_TIMEOUT_MS = 15000;

let jsPdfPromise = null;
let html2canvasPromise = null;

/* ── CDN loader helper ─────────────────────────────────────────────────── */

function loadScript(urls, globalKey) {
  if (typeof window === "undefined")
    return Promise.reject(new Error("PDF generation requires a browser"));

  // Already loaded
  const already = globalKey.split(".").reduce((o, k) => o?.[k], window);
  if (already) return Promise.resolve(already);

  return new Promise((resolve, reject) => {
    let done = false;
    const finish = (val) => { if (!done) { done = true; clearTimeout(timer); resolve(val); } };
    const fail   = (err) => { if (!done) { done = true; clearTimeout(timer); reject(err); } };

    const timer = setTimeout(
      () => fail(new Error(`CDN load timed out for ${globalKey}`)),
      CDN_TIMEOUT_MS,
    );

    const tryUrl = (idx) => {
      if (done) return;
      const check = globalKey.split(".").reduce((o, k) => o?.[k], window);
      if (check) return finish(check);
      if (idx >= urls.length) return fail(new Error(`Could not load ${globalKey} from any CDN`));

      const url = urls[idx];
      const existing = document.querySelector(`script[data-cdnlib="${url}"]`);
      if (existing) {
        const poll = setInterval(() => {
          if (done) { clearInterval(poll); return; }
          const val = globalKey.split(".").reduce((o, k) => o?.[k], window);
          if (val) { clearInterval(poll); finish(val); }
        }, 100);
        setTimeout(() => { if (!done) { clearInterval(poll); tryUrl(idx + 1); } }, 4000);
        return;
      }

      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.cdnlib = url;
      script.onload = () => {
        const val = globalKey.split(".").reduce((o, k) => o?.[k], window);
        if (val) finish(val); else tryUrl(idx + 1);
      };
      script.onerror = () => tryUrl(idx + 1);
      document.head.appendChild(script);
    };

    tryUrl(0);
  });
}

function loadJsPdf() {
  if (jsPdfPromise) return jsPdfPromise;
  jsPdfPromise = loadScript(JSPDF_CDN_URLS, "jspdf.jsPDF");
  jsPdfPromise.catch(() => { jsPdfPromise = null; });
  return jsPdfPromise;
}

function loadHtml2Canvas() {
  if (html2canvasPromise) return html2canvasPromise;
  html2canvasPromise = loadScript(HTML2CANVAS_CDN_URLS, "html2canvas");
  html2canvasPromise.catch(() => { html2canvasPromise = null; });
  return html2canvasPromise;
}

/**
 * Eagerly start fetching both libraries in the background so they are ready
 * by the time the donor clicks "Submit".
 */
export function preloadJsPdf() {
  loadJsPdf().catch(() => {});
  loadHtml2Canvas().catch(() => {});
}

/* ── Helpers ───────────────────────────────────────────────────────────── */

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

/* ── Tamil receipt HTML builder — "Sacred Gold" design ────────────────── */

function buildReceiptHTML({ name, phone, email, amount, upiId, id, issuedAt }) {
  const amtStr     = String(amount ?? "—");
  const donorName  = (name  || "பக்தர்").trim();
  const donorPhone = (phone || "—").trim();
  const donorEmail = (email || "—").trim();

  /*
   * Detail card helper.
   * Each card = [coloured accent strip | content column]
   * Content column has:
   *   • English label  — Cormorant Garamond italic, uppercase, small, gold
   *   • Tamil label    — Noto Sans Tamil, smaller, muted gold
   *   • Value          — Noto Sans Tamil bold (or custom style), dark
   *
   * Using a sidebar strip + overflow:hidden instead of border-left so
   * border-radius renders perfectly on both sides.
   */
  const card = ({ accent, bg = "#ffffff", enLabel, taLabel, value, valStyle = "" }) => `
    <div style="display:flex;flex:1;border-radius:8px;overflow:hidden;border:1px solid #ddc98a;">
      <div style="width:4px;flex-shrink:0;background:${accent};"></div>
      <div style="flex:1;background:${bg};padding:11px 14px;
                  display:flex;flex-direction:column;justify-content:flex-start;">
        <span style="display:block;font-family:'Cormorant Garamond',Georgia,serif;
                     font-style:italic;font-size:9px;font-weight:600;
                     color:#7a5c1e;letter-spacing:0.07em;text-transform:uppercase;
                     line-height:1.3;margin-bottom:2px;">${enLabel}</span>
        <span style="display:block;font-family:'Noto Sans Tamil',sans-serif;
                     font-size:8.5px;color:#a07832;line-height:1.4;
                     margin-bottom:6px;">${taLabel}</span>
        <span style="display:block;${valStyle ||
          "font-family:'Noto Sans Tamil',sans-serif;font-size:13px;font-weight:700;color:#1a1208;line-height:1.4;"
        }">${value}</span>
      </div>
    </div>`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Noto+Sans+Tamil:wght@400;600;700&family=Noto+Serif+Tamil:wght@700&display=swap" rel="stylesheet"/>
  <style>* { box-sizing:border-box; margin:0; padding:0; } body { background:transparent; }</style>
</head>
<body>
<div id="receipt-root" style="
  width:595px; background:#f9f4e8;
  font-family:'Noto Sans Tamil',sans-serif;
  border:2px solid #c4984e;
">

  <!-- ══ HEADER ══════════════════════════════════════════════════════════ -->
  <div style="background:linear-gradient(135deg,#6B0E0A 0%,#8B1A14 55%,#9e2215 100%);
              padding:26px 30px 20px; text-align:center;
              position:relative; overflow:hidden;">

    <!-- decorative rings -->
    <div style="position:absolute;top:-28px;left:-28px;width:110px;height:110px;
                border-radius:50%;border:1px solid rgba(196,152,78,0.25);"></div>
    <div style="position:absolute;bottom:-24px;right:-24px;width:120px;height:120px;
                border-radius:50%;border:1px solid rgba(196,152,78,0.22);"></div>

    <!-- OM -->
    <div style="font-size:20px;color:rgba(245,213,128,0.85);margin-bottom:8px;
                font-family:serif;">ॐ</div>

    <!-- Temple name — Noto Serif Tamil, white, large -->
    <div style="font-family:'Noto Serif Tamil',serif;font-size:26px;font-weight:700;
                color:#ffffff;letter-spacing:0.02em;line-height:1.4;">
      ஸ்ரீ சுப்பிரமணியர் ஆலயம்
    </div>

    <!-- Address — Noto Sans Tamil, gold-yellow, small -->
    <div style="font-family:'Noto Sans Tamil',sans-serif;font-size:10px;
                color:#f0cc70;margin-top:5px;letter-spacing:0.03em;line-height:1.5;">
      இனாம்காரியந்தல், திருவண்ணாமலை மாவட்டம். 606604
    </div>

    <!-- thin gold rule -->
    <div style="margin:14px auto 12px;height:1px;width:60%;
                background:linear-gradient(90deg,transparent,rgba(196,152,78,0.6),transparent);"></div>

    <!-- Donation Receipt — Cormorant italic, spaced, gold -->
    <div style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;
                font-size:11px;color:#f0cc70;letter-spacing:0.35em;text-transform:uppercase;">
      Donation Receipt
    </div>

    <!-- நன்கொடை ரசீது — Noto Serif Tamil, parchment -->
    <div style="font-family:'Noto Serif Tamil',serif;font-size:14px;font-weight:700;
                color:#fdf0d8;margin-top:4px;letter-spacing:0.03em;">
      நன்கொடை ரசீது
    </div>
  </div>

  <!-- ══ META STRIP ═══════════════════════════════════════════════════════ -->
  <div style="background:#2a1a0e;padding:7px 24px;
              display:flex;justify-content:space-between;align-items:center;">
    <span style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;
                 font-size:9.5px;color:#b8883c;letter-spacing:0.05em;">
      Receipt No.&nbsp; ${id}
    </span>
    <span style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;
                 font-size:9.5px;color:#b8883c;letter-spacing:0.05em;">
      Issued : ${issuedAt}
    </span>
  </div>

  <!-- ══ BODY ═════════════════════════════════════════════════════════════ -->
  <div style="padding:22px 24px 18px;">

    <!-- Greeting section -->
    <div style="text-align:center;margin-bottom:18px;">

      <!-- Sub-heading — Cormorant italic, small, gold -->
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;
                  font-size:11px;color:#8a6820;letter-spacing:0.18em;
                  margin-bottom:5px;">ஆழ்ந்த நன்றியுணர்வுடன்</div>

      <!-- Main Thank-You — Noto Serif Tamil, large, dark -->
      <div style="font-family:'Noto Serif Tamil',serif;font-size:29px;font-weight:700;
                  color:#1a1208;line-height:1.3;margin-bottom:10px;">
        நன்றி, ${donorName}.
      </div>

      <!-- ornament rule -->
      <div style="display:flex;align-items:center;justify-content:center;
                  gap:10px;margin-bottom:10px;">
        <div style="flex:1;max-width:80px;height:1px;
                    background:linear-gradient(90deg,transparent,#c4984e);"></div>
        <span style="color:#c4984e;font-size:14px;line-height:1;">&#10039;</span>
        <div style="flex:1;max-width:80px;height:1px;
                    background:linear-gradient(90deg,#c4984e,transparent);"></div>
      </div>

      <!-- Blessing lines — Noto Sans Tamil, normal weight, dark brown -->
      <div style="font-family:'Noto Sans Tamil',sans-serif;font-size:11.5px;
                  font-weight:600;color:#3d2810;line-height:1.8;">
        உங்கள் காணிக்கை கோயிலின் பராமரிப்புக்கு உதவுகிறது.
      </div>
      <div style="font-family:'Noto Sans Tamil',sans-serif;font-size:11.5px;
                  font-weight:600;color:#3d2810;line-height:1.8;">
        முருகப்பெருமான் உங்களுக்கு ஆரோக்கியம், செழிப்பு மற்றும் அமைதியை அருளட்டும்.
      </div>
    </div>

    <!-- Section divider -->
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
      <div style="height:1px;flex:1;background:#ddc98a;"></div>
      <span style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;
                   font-size:9px;color:#8a6820;letter-spacing:0.2em;
                   text-transform:uppercase;white-space:nowrap;">
        Donation Details &nbsp;·&nbsp;
        <span style="font-family:'Noto Sans Tamil',sans-serif;font-style:normal;
                     letter-spacing:0;font-size:9px;">நன்கொடை விவரங்கள்</span>
      </span>
      <div style="height:1px;flex:1;background:#ddc98a;"></div>
    </div>

    <!-- ── Row 1: Donator Name (full width) ── -->
    <div style="display:flex;">
      ${card({
        accent: "#8B1A14",
        enLabel: "Donator Name",
        taLabel: "நன்கொடையாளர் பெயர்",
        value: donorName,
        valStyle: "font-family:'Noto Sans Tamil',sans-serif;font-size:14px;font-weight:700;color:#1a1208;line-height:1.4;"
      })}
    </div>

    <!-- ── Row 2: Phone + Email ── -->
    <div style="display:flex;gap:9px;margin-top:9px;align-items:stretch;">
      ${card({
        accent: "#c4984e",
        enLabel: "Phone",
        taLabel: "தொலைபேசி",
        value: donorPhone
      })}
      ${card({
        accent: "#c4984e",
        enLabel: "Email",
        taLabel: "மின்னஞ்சல்",
        value: donorEmail,
        valStyle: "font-family:'Noto Sans Tamil',sans-serif;font-size:11px;font-weight:700;color:#1a1208;line-height:1.4;word-break:break-all;"
      })}
    </div>

    <!-- ── Row 3: Amount + Date ── -->
    <div style="display:flex;gap:9px;margin-top:9px;align-items:stretch;">
      ${card({
        accent: "#8B1A14",
        bg: "#fff8ee",
        enLabel: "Amount",
        taLabel: "தொகை",
        value: `&#8377;&thinsp;${amtStr}`,
        valStyle: "font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:600;color:#8B1A14;line-height:1.2;letter-spacing:0.02em;"
      })}
      ${card({
        accent: "#c4984e",
        enLabel: "Date",
        taLabel: "தேதி",
        value: issuedAt,
        valStyle: "font-family:'Cormorant Garamond',Georgia,serif;font-size:11px;font-weight:600;color:#1a1208;line-height:1.4;letter-spacing:0.01em;"
      })}
    </div>

    <!-- ── Row 4: Payment Mode (full width) ── -->
    <div style="display:flex;margin-top:9px;">
      ${card({
        accent: "#c4984e",
        enLabel: "Payment Mode",
        taLabel: "பணம் செலுத்தும் முறை",
        value: `UPI &nbsp;·&nbsp; ${upiId}`
      })}
    </div>

    <!-- ── TOTAL BAND ──────────────────────────────────────────────── -->
    <div style="background:linear-gradient(135deg,#1a1208 0%,#2e1c0c 100%);
                border-radius:9px;margin-top:16px;padding:15px 22px;
                display:flex;justify-content:space-between;align-items:center;
                border:1px solid rgba(196,152,78,0.3);">
      <div>
        <!-- English — Cormorant italic, muted gold -->
        <div style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;
                    font-size:10px;color:rgba(196,152,78,0.7);
                    letter-spacing:0.22em;text-transform:uppercase;margin-bottom:4px;">
          Total Donation
        </div>
        <!-- Tamil — Noto Serif Tamil, bright gold -->
        <div style="font-family:'Noto Serif Tamil',serif;font-size:12.5px;
                    font-weight:700;color:#c4984e;line-height:1.4;">
          மொத்த நன்கொடை
        </div>
      </div>
      <!-- Amount — Cormorant, large, pale gold -->
      <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:38px;
                  font-weight:600;color:#f5d580;letter-spacing:0.03em;line-height:1;">
        &#8377;&thinsp;${amtStr}
      </div>
    </div>

  </div>

  <!-- ══ FOOTER ════════════════════════════════════════════════════════════ -->
  <div style="border-top:1px solid #ddc98a;margin:0 26px;"></div>
  <div style="padding:12px 24px 16px;text-align:center;">
    <div style="font-family:Georgia,serif;font-size:8.5px;color:#666;line-height:1.9;">
      This is a system-generated receipt of a UPI donation. No signature is required.<br/>
      For queries: gokulsaravanana663@gmail.com &middot; +91 98765 43210
    </div>
    <div style="margin-top:9px;text-align:right;font-family:'Noto Sans Tamil',Georgia,serif;
                font-size:8px;color:#8a6820;font-style:italic;">
      ஸ்ரீ சுப்பிரமணியர் கோயில் &middot; இணையவழி நன்கொடை தளம்
    </div>
  </div>

</div>
</body>
</html>`;
}

/* ── Main PDF generator ────────────────────────────────────────────────── */

/**
 * Generate a Tamil-styled PDF receipt for a donation.
 *
 * @param {Object} params
 * @param {string}        params.name       Donor name
 * @param {string}        params.phone      Donor phone
 * @param {string}        params.email      Donor email
 * @param {number|string} params.amount     Donation amount in INR
 * @param {string}        [params.upiId]    UPI ID the donation was paid to
 * @param {string}        [params.receiptId] Optional pre-generated receipt ID
 * @returns {Promise<{ dataUrl, base64, blob, filename, receiptId, issuedAt }>}
 */
export async function generateReceiptPdf({
  name,
  phone,
  email,
  amount,
  upiId = "srialayam@upi",
  receiptId,
} = {}) {
  const [JsPDF, html2canvas] = await Promise.all([loadJsPdf(), loadHtml2Canvas()]);

  const id       = receiptId || makeReceiptId();
  const issuedAt = formatDate(new Date());

  /* 1. Build a hidden iframe to host the receipt HTML (avoids style bleed) */
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;left:-9999px;top:0;width:595px;height:842px;border:none;visibility:hidden;";
  document.body.appendChild(iframe);

  const iDoc = iframe.contentDocument || iframe.contentWindow.document;
  iDoc.open();
  iDoc.write(buildReceiptHTML({ name, phone, email, amount, upiId, id, issuedAt }));
  iDoc.close();

  /* 2. Wait for fonts to load inside the iframe */
  await new Promise((res) => {
    const tryFonts = () =>
      (iframe.contentWindow.document.fonts?.ready ?? Promise.resolve())
        .then(res)
        .catch(res);
    // Give the font link element a moment to fire
    setTimeout(tryFonts, 800);
  });

  /* 3. Capture the receipt element with html2canvas */
  const receiptEl = iDoc.getElementById("receipt-root");
  const canvas = await html2canvas(receiptEl, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: "#f8f4e9",
    windowWidth: 595,
  });

  /* 4. Clean up */
  document.body.removeChild(iframe);

  /* 5. Build PDF from the canvas image */
  const doc = new JsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  const pageW = doc.internal.pageSize.getWidth();   // 595.28 pt
  const pageH = doc.internal.pageSize.getHeight();  // 841.89 pt

  const imgData   = canvas.toDataURL("image/jpeg", 0.95);
  const imgW      = pageW;
  const imgH      = (canvas.height / canvas.width) * imgW;
  const yOffset   = imgH < pageH ? (pageH - imgH) / 2 : 0; // centre vertically if shorter

  doc.addImage(imgData, "JPEG", 0, yOffset, imgW, Math.min(imgH, pageH));

  /* 6. Output */
  const dataUrl  = doc.output("datauristring");
  const base64   = dataUrl.split(",")[1] || "";
  const blob     = doc.output("blob");
  const filename = `donation-receipt-${id}.pdf`;

  return { dataUrl, base64, blob, filename, receiptId: id, issuedAt };
}

/** Trigger a browser download of the receipt blob. */
export function downloadReceiptBlob(blob, filename) {
  if (!blob || typeof window === "undefined") return;
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href     = url;
  link.download = filename || "donation-receipt.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
