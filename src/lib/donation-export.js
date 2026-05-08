/* -------------------------------------------------------------------------- */
/*  Donation Log — Export helpers                                             */
/*                                                                            */
/*  Exports the admin's donation log to:                                      */
/*    - a themed multi-page PDF (jsPDF)                                       */
/*    - an Excel-compatible XLSX file (SheetJS via CDN)                       */
/*    - a simple CSV fallback                                                 */
/*                                                                            */
/*  Both libraries are loaded on-demand from a CDN so we don't bloat the      */
/*  bundle.                                                                   */
/* -------------------------------------------------------------------------- */

const JSPDF_CDN_URLS = [
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
  "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js",
  "https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js",
];
const SHEETJS_CDN_URLS = [
  "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
  "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js",
  "https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js",
];
const CDN_TIMEOUT_MS = 15000;

/* -------------------------------------------------------------------------- */
/*  CDN loaders — every loader has a hard timeout + multi-CDN fallback        */
/*  so the admin export buttons never lock the UI on flaky networks.          */
/* -------------------------------------------------------------------------- */

function loadFromCdnList({ urls, hasGlobal, getGlobal, timeoutMs, scriptKey }) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("CDN load requires a browser"));
      return;
    }
    if (hasGlobal()) return resolve(getGlobal());

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
    const timer = setTimeout(
      () => finishErr(new Error("CDN load timed out — check your internet connection")),
      timeoutMs,
    );

    const tryIdx = (i) => {
      if (done) return;
      if (hasGlobal()) return finishOk(getGlobal());
      if (i >= urls.length) return finishErr(new Error("All CDN sources failed"));

      const url = urls[i];
      const dataAttr = `data-${scriptKey}-src`;
      const existing = document.querySelector(`script[${dataAttr}="${url}"]`);
      if (existing) {
        const poll = setInterval(() => {
          if (done) return clearInterval(poll);
          if (hasGlobal()) {
            clearInterval(poll);
            finishOk(getGlobal());
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
      script.setAttribute(dataAttr, url);
      script.onload = () => {
        if (hasGlobal()) finishOk(getGlobal());
        else tryIdx(i + 1);
      };
      script.onerror = () => tryIdx(i + 1);
      document.head.appendChild(script);
    };
    tryIdx(0);
  });
}

let jsPdfPromise = null;
function loadJsPdf() {
  if (typeof window === "undefined") return Promise.reject(new Error("PDF requires a browser"));
  if (window.jspdf?.jsPDF) return Promise.resolve(window.jspdf.jsPDF);
  if (jsPdfPromise) return jsPdfPromise;
  jsPdfPromise = loadFromCdnList({
    urls: JSPDF_CDN_URLS,
    hasGlobal: () => Boolean(window.jspdf?.jsPDF),
    getGlobal: () => window.jspdf.jsPDF,
    timeoutMs: CDN_TIMEOUT_MS,
    scriptKey: "jspdf",
  });
  jsPdfPromise.catch(() => {
    jsPdfPromise = null;
  });
  return jsPdfPromise;
}

let sheetJsPromise = null;
function loadSheetJs() {
  if (typeof window === "undefined") return Promise.reject(new Error("XLSX requires a browser"));
  if (window.XLSX) return Promise.resolve(window.XLSX);
  if (sheetJsPromise) return sheetJsPromise;
  sheetJsPromise = loadFromCdnList({
    urls: SHEETJS_CDN_URLS,
    hasGlobal: () => Boolean(window.XLSX),
    getGlobal: () => window.XLSX,
    timeoutMs: CDN_TIMEOUT_MS,
    scriptKey: "sheetjs",
  });
  sheetJsPromise.catch(() => {
    sheetJsPromise = null;
  });
  return sheetJsPromise;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const THEME = {
  parchment: [248, 244, 233],
  ink: [38, 28, 22],
  brass: [196, 152, 78],
  brassDeep: [148, 110, 56],
  vermillion: [176, 48, 32],
  shadow: [220, 200, 170],
  rowAlt: [253, 248, 235],
};

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
    return `Rs. ${value}`;
  }
}

function formatTimestamp(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return d.toString();
  }
}

function downloadBlob(blob, filename) {
  if (!blob || typeof window === "undefined") return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function todayStamp() {
  const now = new Date();
  const ymd =
    String(now.getFullYear()) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  return ymd;
}

/* -------------------------------------------------------------------------- */
/*  PDF export                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Export the supplied entries as a styled PDF document.
 * Each row shows: Receipt #, Donor, Phone, Email, Amount, Date, Status.
 */
export async function exportDonationsToPdf(entries, { filename } = {}) {
  const JsPDF = await loadJsPdf();
  const doc = new JsPDF({ unit: "pt", format: "a4", orientation: "landscape" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 32;

  const list = Array.isArray(entries) ? entries : [];
  const totalAmount = list.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  // Column layout
  const columns = [
    { key: "index", label: "#", width: 26, align: "right" },
    { key: "submittedAt", label: "Submitted", width: 110 },
    { key: "receiptId", label: "Receipt", width: 110 },
    { key: "name", label: "Donor", width: 120 },
    { key: "phone", label: "Phone", width: 90 },
    { key: "email", label: "Email", width: 160 },
    { key: "amount", label: "Amount", width: 80, align: "right" },
    { key: "emailStatus", label: "Email", width: 70 },
  ];
  const tableX = margin;
  const tableWidth = columns.reduce((s, c) => s + c.width, 0);
  let cursorY = margin;

  function drawHeader(pageNum, totalPages) {
    // Background
    setColor(doc, "setFillColor", THEME.parchment);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Title bar
    const headerHeight = 60;
    setColor(doc, "setFillColor", THEME.vermillion);
    doc.roundedRect(margin, margin, pageWidth - margin * 2, headerHeight, 8, 8, "F");
    setColor(doc, "setFillColor", THEME.brass);
    doc.roundedRect(margin, margin + headerHeight - 18, pageWidth - margin * 2, 18, 8, 8, "F");

    setColor(doc, "setTextColor", [255, 248, 232]);
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("SRI SUBRAMANIYAR TEMPLE — Donation Log", pageWidth / 2, margin + 24, {
      align: "center",
    });
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.text(
      "Sri Valli Devasena Sametha Subramaniyar Aalayam · Inamkariyandhal",
      pageWidth / 2,
      margin + 38,
      { align: "center" },
    );

    setColor(doc, "setTextColor", [40, 24, 12]);
    doc.setFont("times", "bold");
    doc.setFontSize(9);
    doc.text(
      `DONATION REGISTER · தான பதிவு  ·  ${list.length} entries  ·  Total ${formatINR(totalAmount)}`,
      pageWidth / 2,
      margin + headerHeight - 5,
      { align: "center" },
    );

    // Page footer
    setColor(doc, "setTextColor", THEME.brassDeep);
    doc.setFont("times", "italic");
    doc.setFontSize(8);
    doc.text(
      `Generated ${formatTimestamp(new Date().toISOString())}`,
      margin,
      pageHeight - margin / 2,
    );
    if (pageNum && totalPages) {
      doc.text(
        `Page ${pageNum} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - margin / 2,
        { align: "right" },
      );
    } else {
      doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - margin / 2, {
        align: "right",
      });
    }

    cursorY = margin + headerHeight + 18;

    // Column header
    setColor(doc, "setFillColor", THEME.ink);
    doc.rect(tableX, cursorY, tableWidth, 22, "F");
    setColor(doc, "setTextColor", THEME.brass);
    doc.setFont("times", "bold");
    doc.setFontSize(9);
    let cx = tableX;
    columns.forEach((col) => {
      const tx =
        col.align === "right" ? cx + col.width - 6 : cx + 6;
      doc.text(col.label, tx, cursorY + 14, {
        align: col.align === "right" ? "right" : "left",
      });
      cx += col.width;
    });
    cursorY += 22;
  }

  drawHeader(1);

  // Body rows
  setColor(doc, "setTextColor", THEME.ink);
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  const rowHeight = 22;

  let pageNum = 1;
  const safeBottom = pageHeight - margin - 24;

  if (list.length === 0) {
    setColor(doc, "setTextColor", THEME.brassDeep);
    doc.setFont("times", "italic");
    doc.setFontSize(11);
    doc.text(
      "No donations have been recorded yet.",
      pageWidth / 2,
      cursorY + 60,
      { align: "center" },
    );
  }

  list.forEach((row, i) => {
    if (cursorY + rowHeight > safeBottom) {
      doc.addPage();
      pageNum += 1;
      drawHeader(pageNum);
    }

    // Alternate row background
    if (i % 2 === 0) {
      setColor(doc, "setFillColor", THEME.rowAlt);
      doc.rect(tableX, cursorY, tableWidth, rowHeight, "F");
    }
    setColor(doc, "setDrawColor", [232, 218, 188]);
    doc.setLineWidth(0.3);
    doc.line(tableX, cursorY + rowHeight, tableX + tableWidth, cursorY + rowHeight);

    setColor(doc, "setTextColor", THEME.ink);
    doc.setFont("times", "normal");
    doc.setFontSize(9);

    let cx = tableX;
    columns.forEach((col) => {
      let value = "";
      switch (col.key) {
        case "index":
          value = String(i + 1);
          break;
        case "submittedAt":
          value = formatTimestamp(row.submittedAt);
          break;
        case "amount":
          value = formatINR(row.amount);
          break;
        default:
          value = row[col.key] == null ? "" : String(row[col.key]);
      }
      const wrapped = doc.splitTextToSize(value, col.width - 8);
      const text = wrapped[0] || "";
      const tx = col.align === "right" ? cx + col.width - 6 : cx + 6;
      doc.text(text, tx, cursorY + 14, {
        align: col.align === "right" ? "right" : "left",
      });
      cx += col.width;
    });

    cursorY += rowHeight;
  });

  // Total band
  if (cursorY + 36 > safeBottom) {
    doc.addPage();
    pageNum += 1;
    drawHeader(pageNum);
  }
  cursorY += 12;
  setColor(doc, "setFillColor", THEME.ink);
  doc.roundedRect(tableX, cursorY, tableWidth, 28, 6, 6, "F");
  setColor(doc, "setTextColor", THEME.brass);
  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.text("TOTAL DONATIONS", tableX + 14, cursorY + 18);
  setColor(doc, "setTextColor", [255, 248, 232]);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text(formatINR(totalAmount), tableX + tableWidth - 14, cursorY + 19, {
    align: "right",
  });

  const blob = doc.output("blob");
  const fname = filename || `donation-register-${todayStamp()}.pdf`;
  downloadBlob(blob, fname);
  return { ok: true, filename: fname };
}

/* -------------------------------------------------------------------------- */
/*  Excel export                                                              */
/* -------------------------------------------------------------------------- */

export async function exportDonationsToExcel(entries, { filename } = {}) {
  const list = Array.isArray(entries) ? entries : [];
  const totalAmount = list.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  try {
    const XLSX = await loadSheetJs();

    const headers = [
      "S.No",
      "Submitted At",
      "Receipt No",
      "Donor Name",
      "Phone",
      "Email",
      "Amount (INR)",
      "UPI ID",
      "Email Status",
      "Email Error",
      "Issued At",
      "Screenshot",
    ];
    const rows = list.map((r, i) => [
      i + 1,
      formatTimestamp(r.submittedAt),
      r.receiptId || "",
      r.name || "",
      r.phone || "",
      r.email || "",
      Number(r.amount) || 0,
      r.upiId || "",
      r.emailStatus || "",
      r.emailError || "",
      r.issuedAt || "",
      r.screenshotName || "",
    ]);

    // Title block
    const matrix = [
      ["Sri Subramaniyar Temple — Donation Register"],
      [`Generated ${formatTimestamp(new Date().toISOString())}`],
      [`Entries: ${list.length}    Total: ${formatINR(totalAmount)}`],
      [],
      headers,
      ...rows,
      [],
      ["", "", "", "", "", "TOTAL", totalAmount],
    ];

    const ws = XLSX.utils.aoa_to_sheet(matrix);
    ws["!cols"] = [
      { wch: 6 },
      { wch: 22 },
      { wch: 22 },
      { wch: 24 },
      { wch: 16 },
      { wch: 28 },
      { wch: 14 },
      { wch: 18 },
      { wch: 14 },
      { wch: 28 },
      { wch: 22 },
      { wch: 24 },
    ];
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: headers.length - 1 } },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Donations");

    const fname = filename || `donation-register-${todayStamp()}.xlsx`;
    const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    downloadBlob(blob, fname);
    return { ok: true, filename: fname, format: "xlsx" };
  } catch (err) {
    // Fallback to CSV when SheetJS can't load
    console.warn("XLSX export fell back to CSV:", err);
    return exportDonationsToCsv(list, { filename: filename?.replace(/\.xlsx?$/i, ".csv") });
  }
}

/* -------------------------------------------------------------------------- */
/*  CSV fallback (always works)                                               */
/* -------------------------------------------------------------------------- */

export function exportDonationsToCsv(entries, { filename } = {}) {
  const list = Array.isArray(entries) ? entries : [];
  const headers = [
    "S.No",
    "Submitted At",
    "Receipt No",
    "Donor Name",
    "Phone",
    "Email",
    "Amount (INR)",
    "UPI ID",
    "Email Status",
    "Email Error",
    "Issued At",
    "Screenshot",
  ];
  const escape = (v) => {
    const s = v == null ? "" : String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const rows = list.map((r, i) =>
    [
      i + 1,
      formatTimestamp(r.submittedAt),
      r.receiptId,
      r.name,
      r.phone,
      r.email,
      Number(r.amount) || 0,
      r.upiId,
      r.emailStatus,
      r.emailError,
      r.issuedAt,
      r.screenshotName,
    ]
      .map(escape)
      .join(","),
  );
  const csv = [headers.map(escape).join(","), ...rows].join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const fname = filename || `donation-register-${todayStamp()}.csv`;
  downloadBlob(blob, fname);
  return { ok: true, filename: fname, format: "csv" };
}
