/* Donation Receipt — Email Delivery (browser-side, multi-provider). */

const EMAILJS_CDN_URLS = [
  "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
  "https://unpkg.com/@emailjs/browser@4/dist/email.min.js",
];
const CDN_TIMEOUT_MS = 12000;
const FETCH_TIMEOUT_MS = 12000;

const ENDPOINT =
  import.meta.env.VITE_SEND_RECEIPT_ENDPOINT?.trim() || "/api/send-receipt";
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim();
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim();
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim();
const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY?.trim();
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const ADMIN_EMAIL =
  import.meta.env.VITE_ADMIN_EMAIL?.trim() || "gokulsaravanana663@gmail.com";

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
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

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
  const safe = {
    name: escapeHtml(p.name || "Devotee"),
    phone: escapeHtml(p.phone || "-"),
    email: escapeHtml(p.email || "-"),
    amount: escapeHtml(p.amount),
    receiptId: escapeHtml(p.receiptId || "-"),
    issuedAt: escapeHtml(p.issuedAt || ""),
    upiId: escapeHtml(p.upiId || "srialayam@upi"),
  };
  const rows = [
    ["Donor Name", safe.name],
    ["Phone", safe.phone],
    ["Email", safe.email],
    ["Amount", safe.amount],
    ["Payment Mode", `UPI - ${safe.upiId}`],
    ["Receipt No.", safe.receiptId],
    ["Issued", safe.issuedAt],
  ]
    .map(
      ([k, v], i, arr) =>
        `<tr><td style="padding:12px 18px;font-style:italic;color:#946e38;font-size:11px;letter-spacing:0.08em;border-bottom:${
          i === arr.length - 1 ? "0" : "1px solid #f0e0b6"
        };">${k}</td><td align="right" style="padding:12px 18px;color:#2a1c14;font-weight:700;font-size:14px;border-bottom:${
          i === arr.length - 1 ? "0" : "1px solid #f0e0b6"
        };">${v}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"/><title>Donation Receipt</title></head><body style="margin:0;padding:0;background:#f6efdb;font-family:Georgia,serif;color:#2a1c14;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6efdb;padding:32px 0;"><tr><td align="center"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fbf5e6;border:2px solid #c4984e;border-radius:18px;overflow:hidden;"><tr><td style="background:linear-gradient(135deg,#7a1f1f 0%,#b03020 50%,#c4984e 100%);padding:36px 32px;text-align:center;color:#fff8e8;"><div style="font-style:italic;letter-spacing:0.25em;font-size:11px;color:#fde9b6;">SRI SUBRAMANIYAR TEMPLE</div><h1 style="margin:8px 0 0 0;font-weight:700;font-size:26px;color:#fff8e8;">Sri Subramaniyar Aalayam</h1><div style="margin-top:6px;font-style:italic;font-size:13px;color:#fde9b6;">Inamkariyandhal &middot; Tiruvannamalai District</div></td></tr><tr><td style="background:#c4984e;padding:10px 16px;text-align:center;font-weight:700;letter-spacing:0.2em;color:#28180c;font-size:12px;">DONATION RECEIPT</td></tr><tr><td style="padding:32px;"><p style="margin:0 0 6px 0;font-style:italic;color:#946e38;font-size:13px;">With deep gratitude</p><h2 style="margin:0 0 14px 0;font-weight:700;font-size:22px;">Thank you, ${safe.name}</h2><p style="margin:0 0 22px 0;color:#46322a;line-height:1.55;font-size:14px;">Your offering supports the daily rituals, lamp services and upkeep of the temple. May Lord Murugan bless you with health, prosperity and peace.</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8daa0;border-radius:12px;background:#fefaee;">${rows}</table><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;background:#1f130c;border-radius:10px;"><tr><td style="padding:18px 22px;font-style:italic;color:#c4984e;font-size:12px;letter-spacing:0.18em;">TOTAL DONATION</td><td align="right" style="padding:18px 22px;color:#fff8e8;font-weight:700;font-size:24px;">${safe.amount}</td></tr></table><p style="margin:28px 0 0 0;text-align:center;font-style:italic;color:#b03020;font-size:15px;">Om Saravanabava</p><p style="margin:6px 0 0 0;text-align:center;color:#5a4634;font-size:11px;">This is a system-generated receipt.</p></td></tr><tr><td style="background:#1f130c;padding:18px 24px;text-align:center;color:#c4984e;font-style:italic;font-size:11px;letter-spacing:0.1em;">Sri Subramaniyar Temple &middot; Online Donation Portal</td></tr></table></td></tr></table></body></html>`;
}

let emailJsPromise = null;
function loadEmailJs() {
  if (typeof window === "undefined") return Promise.reject(new Error("EmailJS requires a browser"));
  if (window.emailjs) return Promise.resolve(window.emailjs);
  if (emailJsPromise) return emailJsPromise;
  const promise = new Promise((resolve, reject) => {
    let done = false;
    const finishOk = (v) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(v);
    };
    const finishErr = (e) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      reject(e);
    };
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
          if (window.emailjs) {
            clearInterval(poll);
            finishOk(window.emailjs);
          }
        }, 100);
        setTimeout(() => {
          if (done) return;
          clearInterval(poll);
          tryIdx(i + 1);
        }, 4000);
        return;
      }
      const script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.emailjsSrc = url;
      script.onload = () => {
        if (window.emailjs) finishOk(window.emailjs);
        else tryIdx(i + 1);
      };
      script.onerror = () => tryIdx(i + 1);
      document.head.appendChild(script);
    };
    tryIdx(0);
  });
  emailJsPromise = promise;
  promise.catch(() => {
    emailJsPromise = null;
  });
  return promise;
}

const isWeb3FormsConfigured = Boolean(WEB3FORMS_ACCESS_KEY);
const isEmailJsConfigured =
  Boolean(EMAILJS_SERVICE_ID) && Boolean(EMAILJS_TEMPLATE_ID) && Boolean(EMAILJS_PUBLIC_KEY);

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
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      },
      FETCH_TIMEOUT_MS,
    );
  } catch (err) {
    if (err?.name === "AbortError") throw new Error("Web3Forms request timed out");
    throw err;
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* ignore */
  }
  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || `Web3Forms returned ${res.status}`);
  }
  return { ok: true, provider: "web3forms", id: data?.id || data?.message };
}

async function sendViaEmailJs(payload) {
  const emailjs = await loadEmailJs();
  if (typeof emailjs.init === "function") {
    try {
      emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    } catch {
      try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
      } catch {
        /* ignore */
      }
    }
  }
  const amountText = formatINR(payload.amount);
  const params = {
    to_email: payload.email,
    to_name: payload.name || "Devotee",
    from_name: "Sri Subramaniyar Temple",
    reply_to: ADMIN_EMAIL,
    subject: `Donation Receipt - ${payload.receiptId || ""}`.trim(),
    message: buildEmailText({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      amount: amountText,
      receiptId: payload.receiptId,
      issuedAt: payload.issuedAt,
      upiId: payload.upiId,
    }),
    message_html: buildEmailHtml({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      amount: amountText,
      receiptId: payload.receiptId,
      issuedAt: payload.issuedAt,
      upiId: payload.upiId,
    }),
    donor_name: payload.name,
    donor_phone: payload.phone,
    donor_email: payload.email,
    donation_amount: amountText,
    receipt_id: payload.receiptId,
    issued_at: payload.issuedAt,
    upi_id: payload.upiId,
    pdf_filename: payload.pdfFilename || "",
    pdf_base64: payload.pdfBase64 || "",
  };
  const res = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params, {
    publicKey: EMAILJS_PUBLIC_KEY,
  });
  if (res?.status >= 200 && res?.status < 300) {
    return { ok: true, provider: "emailjs", id: res.text };
  }
  throw new Error(res?.text || `EmailJS error: ${res?.status}`);
}

async function sendViaServerless(payload) {
  let res;
  try {
    res = await fetchWithTimeout(
      ENDPOINT,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
      FETCH_TIMEOUT_MS,
    );
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new Error("Email service timed out. /api/send-receipt did not respond.");
    }
    throw err;
  }
  let textBody = "";
  let data = null;
  try {
    textBody = await res.text();
    if (textBody) data = JSON.parse(textBody);
  } catch {
    /* ignore */
  }
  if (!res.ok || !data?.ok) {
    const reason =
      data?.error ||
      (textBody && textBody.startsWith("<")
        ? "Email endpoint not found (received HTML)."
        : `Email service returned ${res.status} ${res.statusText || ""}`.trim());
    const err = new Error(reason);
    err.status = res.status;
    throw err;
  }
  return { ok: true, provider: "serverless", ...data };
}

export async function sendDonationReceipt(payload) {
  const errors = [];
  if (isWeb3FormsConfigured) {
    try {
      return await withHardTimeout(sendViaWeb3Forms(payload), 20000, "Web3Forms send");
    } catch (err) {
      console.warn("Web3Forms delivery failed:", err);
      errors.push(`Web3Forms: ${err.message}`);
    }
  }
  if (isEmailJsConfigured) {
    try {
      return await withHardTimeout(sendViaEmailJs(payload), 25000, "EmailJS send");
    } catch (err) {
      console.warn("EmailJS delivery failed:", err);
      errors.push(`EmailJS: ${err.message}`);
    }
  }
  try {
    return await withHardTimeout(sendViaServerless(payload), 25000, "Serverless email send");
  } catch (err) {
    errors.push(`Server: ${err.message}`);
    const noProviders = !isWeb3FormsConfigured && !isEmailJsConfigured;
    const combined = new Error(
      noProviders
        ? "No email provider configured. Set VITE_WEB3FORMS_KEY (easiest) or VITE_EMAILJS_* keys, or deploy /api/send-receipt with RESEND_API_KEY."
        : errors.join(" | "),
    );
    combined.causes = errors;
    throw combined;
  }
}

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

export const emailDeliveryInfo = {
  web3FormsConfigured: isWeb3FormsConfigured,
  emailJsConfigured: isEmailJsConfigured,
  endpoint: ENDPOINT,
};
