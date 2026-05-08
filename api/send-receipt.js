/* -------------------------------------------------------------------------- */
/*  Vercel API route — /api/send-receipt                                      */
/*                                                                            */
/*  Mirrors netlify/functions/send-receipt.js so the same fetch URL works on  */
/*  both hosts. Uses native fetch — no extra npm dependencies required.       */
/* -------------------------------------------------------------------------- */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

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

function buildEmailHtml({ name, phone, email, amount, receiptId, issuedAt, upiId }) {
  const safe = {
    name: escapeHtml(name || "Devotee"),
    phone: escapeHtml(phone || "—"),
    email: escapeHtml(email || "—"),
    amount: escapeHtml(formatINR(amount)),
    receiptId: escapeHtml(receiptId || "—"),
    issuedAt: escapeHtml(issuedAt || ""),
    upiId: escapeHtml(upiId || "srialayam@upi"),
  };
  return `<!doctype html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f6efdb;font-family:'Cormorant Garamond','Georgia',serif;color:#2a1c14;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6efdb;padding:32px 0;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fbf5e6;border:2px solid #c4984e;border-radius:18px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#7a1f1f 0%,#b03020 50%,#c4984e 100%);padding:36px 32px 28px 32px;text-align:center;color:#fff8e8;">
<div style="font-style:italic;letter-spacing:0.25em;font-size:11px;color:#fde9b6;">SRI SUBRAMANIYAR TEMPLE</div>
<h1 style="margin:8px 0 0 0;font-weight:700;font-size:26px;line-height:1.15;color:#fff8e8;">ஸ்ரீ சுப்பிரமணியர் ஆலயம்</h1>
<div style="margin-top:6px;font-style:italic;font-size:13px;color:#fde9b6;">Inamkariyandhal · Tiruvannamalai District</div>
</td></tr>
<tr><td style="background:#c4984e;padding:10px 16px;text-align:center;font-weight:700;letter-spacing:0.2em;color:#28180c;font-size:12px;">DONATION RECEIPT · தான ரசீது</td></tr>
<tr><td style="padding:32px;">
<p style="margin:0 0 6px 0;font-style:italic;color:#946e38;font-size:13px;">With deep gratitude · நன்றியுடன்</p>
<h2 style="margin:0 0 14px 0;color:#2a1c14;font-weight:700;font-size:22px;">Thank you, ${safe.name}</h2>
<p style="margin:0 0 22px 0;color:#46322a;line-height:1.55;font-size:14px;font-family:Georgia,serif;">Your offering supports the daily rituals, lamp services and upkeep of the temple. May Lord Murugan bless you with health, prosperity and peace. The themed PDF receipt is attached for your records.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8daa0;border-radius:12px;background:#fefaee;">
${[
  ["Donor Name · பெயர்", safe.name],
  ["Phone · தொலைபேசி", safe.phone],
  ["Email · ஈ-மெயில்", safe.email],
  ["Amount · தொகை", safe.amount],
  ["Payment Mode · முறை", `UPI · ${safe.upiId}`],
  ["Receipt No. · ரசீது எண்", safe.receiptId],
  ["Issued · தேதி", safe.issuedAt],
]
  .map(
    ([k, v], i, arr) =>
      `<tr><td style="padding:12px 18px;font-style:italic;color:#946e38;font-size:11px;letter-spacing:0.08em;border-bottom:${i === arr.length - 1 ? "0" : "1px solid #f0e0b6"};">${k}</td><td align="right" style="padding:12px 18px;color:#2a1c14;font-weight:700;font-size:14px;border-bottom:${i === arr.length - 1 ? "0" : "1px solid #f0e0b6"};">${v}</td></tr>`,
  )
  .join("")}
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;background:#1f130c;border-radius:10px;">
<tr><td style="padding:18px 22px;font-style:italic;color:#c4984e;font-size:12px;letter-spacing:0.18em;">TOTAL DONATION</td>
<td align="right" style="padding:18px 22px;color:#fff8e8;font-weight:700;font-size:24px;">${safe.amount}</td></tr></table>
<p style="margin:28px 0 0 0;text-align:center;font-style:italic;color:#b03020;font-size:15px;">ஓம் சரவணபவ</p>
<p style="margin:6px 0 0 0;text-align:center;color:#5a4634;font-size:11px;">This is a system-generated receipt. No signature required.</p>
</td></tr>
<tr><td style="background:#1f130c;padding:18px 24px;text-align:center;color:#c4984e;font-style:italic;font-size:11px;letter-spacing:0.1em;">Sri Subramaniyar Temple · Online Donation Portal</td></tr>
</table>
<p style="font-size:11px;color:#6b5640;margin:14px 0 0 0;font-family:Georgia,serif;">Need help? Reply to this email or write to gokulsaravanana663@gmail.com</p>
</td></tr></table></body></html>`;
}

function buildEmailText({ name, phone, email, amount, receiptId, issuedAt, upiId }) {
  return [
    "SRI SUBRAMANIYAR TEMPLE",
    "ஸ்ரீ சுப்பிரமணியர் ஆலயம்",
    "Inamkariyandhal, Tiruvannamalai — 606604",
    "",
    "DONATION RECEIPT · தான ரசீது",
    "------------------------------------",
    `Dear ${name || "Devotee"},`,
    "",
    "Thank you for your generous offering. The themed PDF receipt is attached.",
    "",
    `Donor name : ${name || "—"}`,
    `Phone      : ${phone || "—"}`,
    `Email      : ${email || "—"}`,
    `Amount     : ${formatINR(amount)}`,
    `Mode       : UPI · ${upiId || "srialayam@upi"}`,
    `Receipt #  : ${receiptId || "—"}`,
    `Issued     : ${issuedAt || ""}`,
    "",
    "ஓம் சரவணபவ",
    "Sri Subramaniyar Temple · Online Donation Portal",
  ].join("\n");
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // Vercel may already parse JSON; handle both
  let payload = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      return res.status(400).json({ ok: false, error: "Invalid JSON body" });
    }
  }
  payload = payload || {};

  const {
    name,
    phone,
    email,
    amount,
    receiptId,
    issuedAt,
    upiId = "srialayam@upi",
    pdfBase64,
    pdfFilename = "donation-receipt.pdf",
  } = payload;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ ok: false, error: "Valid donor email required" });
  if (!name || !amount)
    return res.status(400).json({ ok: false, error: "Name and amount are required" });

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || "Sri Subramaniyar Temple <onboarding@resend.dev>";
  const replyTo = process.env.REPLY_TO_EMAIL || undefined;
  const ccAdmin = process.env.ADMIN_EMAIL || undefined;

  if (!apiKey) {
    return res.status(500).json({
      ok: false,
      error: "Email service is not configured. Set RESEND_API_KEY in your hosting environment.",
    });
  }

  const html = buildEmailHtml({ name, phone, email, amount, receiptId, issuedAt, upiId });
  const text = buildEmailText({ name, phone, email, amount, receiptId, issuedAt, upiId });

  const body = {
    from: fromEmail,
    to: [email],
    subject: `Donation Receipt · தான ரசீது · ${receiptId || ""}`.trim(),
    html,
    text,
  };
  if (replyTo) body.reply_to = replyTo;
  if (ccAdmin) body.bcc = [ccAdmin];
  if (pdfBase64) {
    body.attachments = [{ filename: pdfFilename, content: pdfBase64 }];
  }

  try {
    const r = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return res.status(r.status).json({
        ok: false,
        error: data?.message || "Email provider rejected the request",
      });
    }
    return res.status(200).json({ ok: true, id: data?.id, receiptId });
  } catch {
    return res.status(502).json({ ok: false, error: "Failed to reach email provider" });
  }
}
