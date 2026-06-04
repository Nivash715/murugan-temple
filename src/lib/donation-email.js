/* ============================================================================
   Donation Receipt — Email Delivery (browser-side only)
   Compatible with Hostinger static / any CDN — NO server required.

   Provider priority (first configured wins):
     1. Web3Forms  — configure VITE_WEB3FORMS_KEY   (recommended, free 250/mo)
     2. EmailJS    — configure VITE_EMAILJS_*        (free 200/mo)
     3. mailto:    — fallback: opens the user's email client (always works)
   ============================================================================ */

const EMAILJS_CDN_URLS = [
  "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
  "https://unpkg.com/@emailjs/browser@4/dist/email.min.js",
];
const CDN_TIMEOUT_MS  = 12_000;
const FETCH_TIMEOUT_MS = 12_000;

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim();
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim();
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim();
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY?.trim();
const WEB3FORMS_ENDPOINT   = "https://api.web3forms.com/submit";
const ADMIN_EMAIL =
  import.meta.env.VITE_ADMIN_EMAIL?.trim() || "gokulsaravanana663@gmail.com";

/* ── Utilities ─────────────────────────────────────────────────────────── */

const formatINR = (amount) => {
  const value = Number(amount) || 0;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `Rs. ${value}`;
  }
};

const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timer),
  );
}

function withHardTimeout(promise, ms, label = "operation") {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`));
    }, ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}

/* ── Email body builders ────────────────────────────────────────────────── */

function buildEmailText({ name, phone, email, amount, receiptId, issuedAt, upiId }) {
  return [
    "SRI SUBRAMANIYAR TEMPLE",
    "Inamkariyandhal, Tiruvannamalai - 606604",
    "",
    "DONATION RECEIPT",
    "------------------------------------",
    `Dear ${name || "Devotee"},`,
    "",
    "Thank you for your generous offering. Your contribution supports the",
    "daily rituals, lamp services and upkeep of the temple.",
    "",
    `Donor name : ${name || "-"}`,
    `Phone      : ${phone || "-"}`,
    `Email      : ${email || "-"}`,
    `Amount     : ${amount}`,
    `Mode       : UPI - ${upiId || "srialayam@upi"}`,
    `Receipt #  : ${receiptId || "-"}`,
    `Issued     : ${issuedAt || ""}`,
    "",
    "Om Saravanabava",
    "May Lord Murugan bless you with health, prosperity and peace.",
    "",
    "Sri Subramaniyar Temple - Online Donation Portal",
  ].join("\n");
}

function buildEmailHtml(p) {
  const s = {
    name:      escapeHtml(p.name      || "பக்தர்"),
    phone:     escapeHtml(p.phone     || "—"),
    email:     escapeHtml(p.email     || "—"),
    amount:    escapeHtml(p.amount),
    receiptId: escapeHtml(p.receiptId || "—"),
    issuedAt:  escapeHtml(p.issuedAt  || ""),
    upiId:     escapeHtml(p.upiId     || "srialayam@upi"),
  };

  const card = (accentColor, enLabel, taLabel, value, valStyle) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="border:1px solid #ddc98a;border-radius:8px;overflow:hidden;margin-bottom:0;">
      <tr>
        <td width="4" style="background:${accentColor};padding:0;"></td>
        <td style="background:#ffffff;padding:11px 14px;vertical-align:top;">
          <span style="display:block;font-family:Georgia,serif;font-style:italic;
                       font-size:9px;font-weight:600;color:#7a5c1e;
                       letter-spacing:0.07em;text-transform:uppercase;margin-bottom:2px;">${enLabel}</span>
          <span style="display:block;font-family:Georgia,serif;font-size:8.5px;
                       color:#a07832;margin-bottom:6px;">${taLabel}</span>
          <span style="${valStyle || "font-family:Georgia,serif;font-size:13px;font-weight:700;color:#1a1208;"}">${value}</span>
        </td>
      </tr>
    </table>`;

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>நன்கொடை ரசீது — Donation Receipt</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Tamil:wght@400;600;700&family=Noto+Serif+Tamil:wght@700&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:0;background:#f6efdb;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
       style="background:#f6efdb;padding:28px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0"
       style="max-width:600px;width:100%;background:#f9f4e8;border:2px solid #c4984e;border-radius:12px;overflow:hidden;">
  <tr>
    <td style="background:#8B1A14;padding:28px 28px 22px;text-align:center;">
      <div style="font-family:Georgia,serif;font-size:20px;color:rgba(245,213,128,0.85);margin-bottom:8px;">&#2384;</div>
      <div style="font-family:'Noto Serif Tamil',Georgia,serif;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:0.02em;line-height:1.4;">
        ஸ்ரீ சுப்பிரமணியர் ஆலயம்
      </div>
      <div style="font-family:'Noto Sans Tamil',Georgia,serif;font-size:10px;color:#f0cc70;margin-top:5px;letter-spacing:0.03em;line-height:1.5;">
        இனாம்காரியந்தல், திருவண்ணாமலை மாவட்டம். 606604
      </div>
      <div style="margin:14px auto 12px;height:1px;width:60%;background:#c4984e;opacity:0.5;"></div>
      <div style="font-family:Georgia,serif;font-style:italic;font-size:11px;color:#f0cc70;letter-spacing:0.35em;text-transform:uppercase;">
        Donation Receipt
      </div>
      <div style="font-family:'Noto Serif Tamil',Georgia,serif;font-size:14px;font-weight:700;color:#fdf0d8;margin-top:4px;letter-spacing:0.03em;">
        நன்கொடை ரசீது
      </div>
    </td>
  </tr>
  <tr>
    <td style="background:#2a1a0e;padding:7px 24px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-family:Georgia,serif;font-style:italic;font-size:9.5px;color:#b8883c;letter-spacing:0.05em;">
            Receipt No. &nbsp; ${s.receiptId}
          </td>
          <td align="right" style="font-family:Georgia,serif;font-style:italic;font-size:9.5px;color:#b8883c;letter-spacing:0.05em;">
            Issued : ${s.issuedAt}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:24px 24px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        <tr>
          <td style="text-align:center;">
            <div style="font-family:Georgia,serif;font-style:italic;font-size:11px;color:#8a6820;letter-spacing:0.18em;margin-bottom:5px;">
              ஆழ்ந்த நன்றியுணர்வுடன்
            </div>
            <div style="font-family:'Noto Serif Tamil',Georgia,serif;font-size:26px;font-weight:700;color:#1a1208;line-height:1.3;margin-bottom:10px;">
              நன்றி, ${s.name}.
            </div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
              <tr>
                <td style="border-bottom:1px solid #c4984e;width:40%;"></td>
                <td style="text-align:center;padding:0 8px;color:#c4984e;font-size:14px;">&#10039;</td>
                <td style="border-bottom:1px solid #c4984e;width:40%;"></td>
              </tr>
            </table>
            <div style="font-family:'Noto Sans Tamil',Georgia,serif;font-size:11.5px;font-weight:600;color:#3d2810;line-height:1.8;">
              உங்கள் காணிக்கை கோயிலின் பராமரிப்புக்கு உதவுகிறது.
            </div>
            <div style="font-family:'Noto Sans Tamil',Georgia,serif;font-size:11px;color:#3d2810;line-height:1.8;">
              முருகப்பெருமான் உங்களுக்கு ஆரோக்கியம், செழிப்பு மற்றும் அமைதியை அருளட்டும்.
            </div>
          </td>
        </tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
        <tr>
          <td style="border-bottom:1px solid #ddc98a;"></td>
          <td style="white-space:nowrap;padding:0 10px;font-family:Georgia,serif;font-style:italic;font-size:9px;color:#8a6820;letter-spacing:0.2em;text-transform:uppercase;">
            Donation Details &nbsp;·&nbsp; நன்கொடை விவரங்கள்
          </td>
          <td style="border-bottom:1px solid #ddc98a;"></td>
        </tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:9px;">
        <tr>
          <td>${card("#8B1A14","Donator Name","நன்கொடையாளர் பெயர்", s.name,
            "font-family:'Noto Sans Tamil',Georgia,serif;font-size:14px;font-weight:700;color:#1a1208;")}</td>
        </tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:9px;">
        <tr>
          <td width="48%" valign="top" style="padding-right:5px;">
            ${card("#c4984e","Phone","தொலைபேசி", s.phone, "")}
          </td>
          <td width="4%"></td>
          <td width="48%" valign="top" style="padding-left:5px;">
            ${card("#c4984e","Email","மின்னஞ்சல்", s.email,
              "font-family:Georgia,serif;font-size:10px;font-weight:700;color:#1a1208;word-break:break-all;")}
          </td>
        </tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:9px;">
        <tr>
          <td width="48%" valign="top" style="padding-right:5px;">
            ${card("#8B1A14","Amount","தொகை",
              "&#8377;&thinsp;" + s.amount,
              "font-family:Georgia,serif;font-size:20px;font-weight:700;color:#8B1A14;")}
          </td>
          <td width="4%"></td>
          <td width="48%" valign="top" style="padding-left:5px;">
            ${card("#c4984e","Date","தேதி", s.issuedAt,
              "font-family:Georgia,serif;font-size:10px;font-weight:600;color:#1a1208;")}
          </td>
        </tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:18px;">
        <tr>
          <td>${card("#c4984e","Payment Mode","பணம் செலுத்தும் முறை",
            "UPI &nbsp;&middot;&nbsp; " + s.upiId, "")}</td>
        </tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
             style="background:#1a1208;border-radius:9px;border:1px solid rgba(196,152,78,0.3);">
        <tr>
          <td style="padding:15px 22px;vertical-align:middle;">
            <div style="font-family:Georgia,serif;font-style:italic;font-size:10px;color:rgba(196,152,78,0.8);letter-spacing:0.22em;text-transform:uppercase;margin-bottom:4px;">Total Donation</div>
            <div style="font-family:'Noto Serif Tamil',Georgia,serif;font-size:12px;font-weight:700;color:#c4984e;">மொத்த நன்கொடை</div>
          </td>
          <td align="right" style="padding:15px 22px;vertical-align:middle;">
            <span style="font-family:Georgia,serif;font-size:34px;font-weight:700;color:#f5d580;letter-spacing:0.03em;">
              &#8377;&thinsp;${s.amount}
            </span>
          </td>
        </tr>
      </table>
      <p style="margin:22px 0 4px;text-align:center;font-family:Georgia,serif;font-style:italic;color:#8B1A14;font-size:15px;">Om Saravanabava</p>
      <p style="margin:0;text-align:center;font-family:Georgia,serif;font-size:10px;color:#666;">This is a system-generated receipt. No signature required.</p>
    </td>
  </tr>
  <tr>
    <td style="border-top:1px solid #ddc98a;background:#f9f4e8;padding:12px 24px;text-align:center;">
      <div style="font-family:Georgia,serif;font-size:8.5px;color:#666;line-height:1.9;">
        For queries: gokulsaravanana663@gmail.com &middot; +91 98765 43210
      </div>
      <div style="margin-top:6px;font-family:Georgia,serif;font-style:italic;font-size:8px;color:#8a6820;">
        ஸ்ரீ சுப்பிரமணியர் கோயில் &middot; இணையவழி நன்கொடை தளம்
      </div>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/* ── EmailJS CDN loader ──────────────────────────────────────────────────── */

let emailJsPromise = null;
function loadEmailJs() {
  if (typeof window === "undefined") return Promise.reject(new Error("EmailJS requires a browser"));
  if (window.emailjs) return Promise.resolve(window.emailjs);
  if (emailJsPromise) return emailJsPromise;

  const promise = new Promise((resolve, reject) => {
    let done = false;
    const finishOk  = (v) => { if (done) return; done = true; clearTimeout(timer); resolve(v); };
    const finishErr = (e) => { if (done) return; done = true; clearTimeout(timer); reject(e); };
    const timer = setTimeout(() => finishErr(new Error("EmailJS CDN load timed out")), CDN_TIMEOUT_MS);

    const tryIdx = (i) => {
      if (done) return;
      if (window.emailjs) return finishOk(window.emailjs);
      if (i >= EMAILJS_CDN_URLS.length) return finishErr(new Error("EmailJS could not be loaded"));
      const url = EMAILJS_CDN_URLS[i];
      const existing = document.querySelector(`script[data-emailjs-src="${url}"]`);
      if (existing) {
        const poll = setInterval(() => {
          if (done) return clearInterval(poll);
          if (window.emailjs) { clearInterval(poll); finishOk(window.emailjs); }
        }, 100);
        setTimeout(() => { if (done) return; clearInterval(poll); tryIdx(i + 1); }, 4000);
        return;
      }
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.emailjsSrc = url;
      script.onload  = () => { if (window.emailjs) finishOk(window.emailjs); else tryIdx(i + 1); };
      script.onerror = () => tryIdx(i + 1);
      document.head.appendChild(script);
    };
    tryIdx(0);
  });

  emailJsPromise = promise;
  promise.catch(() => { emailJsPromise = null; });
  return promise;
}

/* ── Provider flags ─────────────────────────────────────────────────────── */

const isWeb3FormsConfigured = Boolean(WEB3FORMS_ACCESS_KEY);
const isEmailJsConfigured   =
  Boolean(EMAILJS_SERVICE_ID) && Boolean(EMAILJS_TEMPLATE_ID) && Boolean(EMAILJS_PUBLIC_KEY);

/* ── Provider: Web3Forms (browser-only, recommended) ───────────────────── */

async function sendViaWeb3Forms(payload) {
  const { name, email, phone, amount, receiptId, issuedAt, upiId } = payload;
  const amountText = formatINR(amount);
  const body = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: `Donation Receipt - ${receiptId || ""}`.trim(),
    from_name: "Sri Subramaniyar Temple",
    email: ADMIN_EMAIL,
    replyto: ADMIN_EMAIL,
    to: email,
    bcc: ADMIN_EMAIL,
    html: buildEmailHtml({ name, phone, email, amount: amountText, receiptId, issuedAt, upiId }),
    donor_name: name,
    donor_phone: phone,
    donor_email: email,
    donation_amount: amountText,
    receipt_id: receiptId,
    issued_at: issuedAt,
    upi_id: upiId,
  };
  let res;
  try {
    res = await fetchWithTimeout(
      WEB3FORMS_ENDPOINT,
      { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body) },
      FETCH_TIMEOUT_MS,
    );
  } catch (err) {
    if (err?.name === "AbortError") throw new Error("Web3Forms request timed out");
    throw err;
  }
  let data = null;
  try { data = await res.json(); } catch { /* ignore */ }
  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || `Web3Forms returned ${res.status}`);
  }
  return { ok: true, provider: "web3forms", id: data?.id || data?.message };
}

/* ── Provider: EmailJS (browser-only) ──────────────────────────────────── */

async function sendViaEmailJs(payload) {
  const emailjs = await loadEmailJs();
  if (typeof emailjs.init === "function") {
    try { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch {
      try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch { /* ignore */ }
    }
  }
  const amountText = formatINR(payload.amount);
  const params = {
    to_email:        payload.email,
    to_name:         payload.name || "Devotee",
    from_name:       "Sri Subramaniyar Temple",
    reply_to:        ADMIN_EMAIL,
    subject:         `Donation Receipt - ${payload.receiptId || ""}`.trim(),
    message:         buildEmailText({ name: payload.name, phone: payload.phone, email: payload.email, amount: amountText, receiptId: payload.receiptId, issuedAt: payload.issuedAt, upiId: payload.upiId }),
    message_html:    buildEmailHtml({ name: payload.name, phone: payload.phone, email: payload.email, amount: amountText, receiptId: payload.receiptId, issuedAt: payload.issuedAt, upiId: payload.upiId }),
    donor_name:      payload.name,
    donor_phone:     payload.phone,
    donor_email:     payload.email,
    donation_amount: amountText,
    receipt_id:      payload.receiptId,
    issued_at:       payload.issuedAt,
    upi_id:          payload.upiId,
    pdf_filename:    payload.pdfFilename || "",
  };
  const res = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, { publicKey: EMAILJS_PUBLIC_KEY });
  if (res?.status >= 200 && res?.status < 300) {
    return { ok: true, provider: "emailjs", id: res.text };
  }
  throw new Error(res?.text || `EmailJS error: ${res?.status}`);
}

/* ── Main exported send function ────────────────────────────────────────── */

/**
 * Send the donation receipt email using whichever browser-side provider is
 * configured. Falls through providers in order: Web3Forms → EmailJS.
 *
 * Throws if no provider succeeds so the caller can show a mailto: fallback.
 */
export async function sendDonationReceipt(payload) {
  const errors = [];

  if (isWeb3FormsConfigured) {
    try {
      return await withHardTimeout(sendViaWeb3Forms(payload), 20_000, "Web3Forms send");
    } catch (err) {
      console.warn("Web3Forms delivery failed:", err);
      errors.push(`Web3Forms: ${err.message}`);
    }
  }

  if (isEmailJsConfigured) {
    try {
      return await withHardTimeout(sendViaEmailJs(payload), 25_000, "EmailJS send");
    } catch (err) {
      console.warn("EmailJS delivery failed:", err);
      errors.push(`EmailJS: ${err.message}`);
    }
  }

  // No provider succeeded — throw so the UI can fall back to mailto:
  const noProviders = !isWeb3FormsConfigured && !isEmailJsConfigured;
  const combined = new Error(
    noProviders
      ? "No email provider configured. Set VITE_WEB3FORMS_KEY or VITE_EMAILJS_* in your .env file."
      : errors.join(" | "),
  );
  combined.causes = errors;
  throw combined;
}

/* ── mailto: fallback (always works, no server needed) ─────────────────── */

/**
 * Build a mailto: URL that pre-fills the donor's email client with the
 * receipt text. This is a 100% offline, server-free fallback.
 */
export function buildReceiptMailto(payload) {
  const { name, phone, email, amount, receiptId, issuedAt, upiId } = payload || {};
  const subject = `Donation Receipt - ${receiptId || ""}`.trim();
  const body = buildEmailText({
    name,
    phone,
    email,
    amount: formatINR(amount),
    receiptId,
    issuedAt,
    upiId,
  });
  const params = new URLSearchParams({ subject, body });
  return `mailto:${email || ADMIN_EMAIL}?${params.toString()}`;
}

/* ── Diagnostics (used by devtools / admin info panel) ─────────────────── */

export const emailDeliveryInfo = {
  web3FormsConfigured: isWeb3FormsConfigured,
  emailJsConfigured:   isEmailJsConfigured,
  // NOTE: no serverless endpoint — this project is 100% static / frontend-only.
};
