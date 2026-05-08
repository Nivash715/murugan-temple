import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import donationImg from "@/assets/Donation.jpg";
import upiQr from "@/assets/Upi.jpeg";
import {
  generateReceiptPdf,
  downloadReceiptBlob,
  preloadJsPdf,
} from "@/lib/pdf-receipt";
import { sendDonationReceipt, buildReceiptMailto } from "@/lib/donation-email";
import { useDonationLog } from "@/lib/donation-log";
import {
  Copy,
  Check,
  MapPin,
  Navigation,
  Upload,
  Loader2,
  Download,
  Mail,
  AlertTriangle,
} from "lucide-react";

const TEMPLE_ADDRESS =
  "ஸ்ரீ வள்ளி தேவசேனா சமேத சுப்பிரமணியர் ஆலயம், இனாம்காரியந்தல், திருவண்ணாமலை மாவட்டம். 606604";
const TEMPLE_LAT = 12.2988864;
const TEMPLE_LNG = 79.0549598;
const MAP_EMBED = `https://www.google.com/maps?q=${TEMPLE_LAT},${TEMPLE_LNG}&hl=ta&z=15&output=embed`;
const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${TEMPLE_LAT},${TEMPLE_LNG}`;

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "ஆன்லைன் தான வசதி — Online Donation" },
      {
        name: "description",
        content: "UPI / QR மூலம் பாதுகாப்பான ஆன்லைன் தான வசதி.",
      },
      { property: "og:title", content: "Online Donation · தானம்" },
      { property: "og:description", content: "Secure UPI / QR donation." },
    ],
  }),
  component: DonatePage,
});

const UPI_ID = "gokulsaravanan633@okicici";

function makeReceiptId() {
  const now = new Date();
  const ymd =
    String(now.getFullYear()) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SST-${ymd}-${rand}`;
}

function formatIssuedAt(date = new Date()) {
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

function DonatePage() {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(501);
  const [screenshot, setScreenshot] = useState(null);
  const [status, setStatus] = useState({ kind: "idle" });

  const log = useDonationLog();

  // Pre-warm jsPDF so by the time the donor submits, the PDF download is
  // (almost always) ready instantly with no perceived delay.
  useEffect(() => {
    preloadJsPdf();
  }, []);

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = UPI_ID;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const copyUpiFromCard = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopiedUpiCard(true);
      setTimeout(() => setCopiedUpiCard(false), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = UPI_ID;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedUpiCard(true);
      setTimeout(() => setCopiedUpiCard(false), 2500);
    }
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setAmount(501);
    setScreenshot(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      const trimmedPhone = phone.trim();
      const numericAmount = Number(amount);

      if (!trimmedName || !trimmedEmail || !trimmedPhone || !numericAmount || !screenshot) {
        setStatus({
          kind: "error",
          message: "தயவு செய்து அனைத்து புலங்களையும் நிரப்பவும். Please fill all fields including screenshot.",
        });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setStatus({
          kind: "error",
          message: "சரியான ஈ-மெயில் முகவரியை உள்ளிடவும். Please enter a valid email.",
        });
        return;
      }

      // 1. Pre-compute receipt metadata.
      const receiptId = makeReceiptId();
      const issuedAt = formatIssuedAt();

      // 2. Record in admin log immediately (synchronous, can't fail).
      const logEntry = log.addEntry({
        receiptId,
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        amount: numericAmount,
        upiId: UPI_ID,
        issuedAt,
        emailStatus: "pending",
        screenshotName: screenshot?.name || "",
      }) || { id: receiptId };

      // 3. Show success page IMMEDIATELY — no spinner, no awaits.
      setStatus({
        kind: "success",
        logId: logEntry.id,
        receiptId,
        issuedAt,
        donorName: trimmedName,
        donorPhone: trimmedPhone,
        email: trimmedEmail,
        amount: numericAmount,
        pdfState: "preparing",
        pdfBlob: null,
        pdfFilename: null,
        pdfBase64: null,
        pdfError: null,
        emailState: "sending",
        emailError: null,
      });
      resetForm();

      // 4. Background work — never blocks the form.
      runBackgroundDelivery(logEntry.id, {
        receiptId,
        issuedAt,
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        amount: numericAmount,
      });
    } catch (err) {
      console.error("Submit handler crashed:", err);
      setStatus({
        kind: "error",
        message:
          "சமர்ப்பிக்க முடியவில்லை. Submission failed: " + (err?.message || String(err)),
      });
    }
  };

  const runBackgroundDelivery = async (logId, fields) => {
    let receipt = null;
    try {
      receipt = await generateReceiptPdf({ ...fields, upiId: UPI_ID });
      log.updateEntry(logId, {
        receiptId: receipt.receiptId,
        issuedAt: receipt.issuedAt,
      });
      setStatus((prev) =>
        prev.kind === "success" && prev.logId === logId
          ? {
              ...prev,
              pdfState: "ready",
              pdfBlob: receipt.blob,
              pdfFilename: receipt.filename,
              pdfBase64: receipt.base64,
              receiptId: receipt.receiptId,
              issuedAt: receipt.issuedAt,
              pdfError: null,
            }
          : prev,
      );
    } catch (err) {
      console.warn("Background PDF gen failed:", err);
      log.updateEntry(logId, {
        emailStatus: "failed",
        emailError: "PDF: " + (err?.message || err),
      });
      setStatus((prev) =>
        prev.kind === "success" && prev.logId === logId
          ? {
              ...prev,
              pdfState: "failed",
              pdfError: err?.message || "PDF generation failed",
              emailState: "failed",
              emailError: "PDF could not be generated; email not sent.",
            }
          : prev,
      );
      return;
    }

    try {
      await sendDonationReceipt({
        ...fields,
        upiId: UPI_ID,
        receiptId: receipt.receiptId,
        issuedAt: receipt.issuedAt,
        pdfBase64: receipt.base64,
        pdfFilename: receipt.filename,
      });
      log.updateEntry(logId, { emailStatus: "sent", emailError: "" });
      setStatus((prev) =>
        prev.kind === "success" && prev.logId === logId
          ? { ...prev, emailState: "sent", emailError: null }
          : prev,
      );
    } catch (err) {
      console.warn("Background email failed:", err);
      log.updateEntry(logId, {
        emailStatus: "failed",
        emailError: err?.message || "Email send failed",
      });
      setStatus((prev) =>
        prev.kind === "success" && prev.logId === logId
          ? {
              ...prev,
              emailState: "failed",
              emailError: err?.message || "Email send failed",
            }
          : prev,
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <PageHero
        slug="donate"
        eyebrow="Donate · தானம்"
        titleTamil="ஆன்லைன் தான வசதி"
        titleEn="Online Donation · Secure UPI"
        description="உங்கள் பங்களிப்பு ஆலயத்தின் தினசரி சேவைகளுக்கு பயன்படுகிறது."
        image={donationImg}
      />

      {/* QR Code Section */}
      <section className="relative-z bg-gradient-sanctum text-parchment">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-sunset rounded-3xl blur-3xl opacity-30" />
              <div className="relative bg-parchment text-ink rounded-3xl p-6 sm:p-8 shadow-temple border-2 border-brass">
                <div className="text-center">
                  <div className="font-display italic text-brass-deep text-xs tracking-widest">
                    SCAN & PAY · QR
                  </div>
                  <div className="font-tamil text-2xl font-bold mt-2">
                    QR ஸ்கேன் செய்யுங்கள்
                  </div>
                </div>
                <div className="mt-6 mx-auto max-w-xs">
                  <a
                    href={`upi://pay?pa=${UPI_ID}&pn=Sri%20Murugan%20Temple&tn=Donation`}
                    className="inline-block w-full rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    <img
                      src={upiQr}
                      alt="UPI QR Code"
                      className="w-full h-auto"
                    />
                  </a>
                </div>
                <div className="mt-5 text-center">
                  <div className="font-tamil-sans text-sm text-ink/70">UPI ID</div>
                  <div className="font-tamil-sans text-lg font-semibold text-ink mt-2">
                    {UPI_ID}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                  {["GPay", "PhonePe", "Paytm", "BHIM"].map((a) => (
                    <div
                      key={a}
                      className="px-2 py-2 rounded-lg border border-brass/30 font-display italic text-xs text-brass-deep"
                    >
                      {a}
                    </div>
                  ))}
                </div>
                <button
                  onClick={copyUpi}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-sunset text-parchment font-tamil font-semibold shadow-brass hover:shadow-temple transition-all"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? "🦚Copied..." : `UPI: ${UPI_ID}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donor Details Form */}
      <section className="relative-z mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="ornament-divider mb-6">
          <span className="font-display italic text-xs sm:text-sm tracking-[0.3em]">
            DONOR DETAILS · பக்தர் விவரங்கள்
          </span>
        </div>
        <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-5xl font-bold text-ink">
          உங்கள் விவரங்களை பூரணப்படுத்துங்கள்
        </h2>

        <div className="mt-10 max-w-2xl mx-auto bg-card rounded-2xl border-2 border-brass/30 p-6 sm:p-8">
          {status.kind === "success" ? (
            <SuccessPanel status={status} onAgain={() => setStatus({ kind: "idle" })} />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <label className="block">
                <span className="font-display italic text-brass text-xs tracking-widest">
                  NAME · பெயர்
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-xl border-2 border-brass/40 bg-transparent text-ink placeholder:text-ink/40 outline-none focus:border-brass font-tamil-sans"
                  placeholder="பெயரை உள்ளிடவும்"
                />
              </label>

              <label className="block">
                <span className="font-display italic text-brass text-xs tracking-widest">
                  PHONE · தொலைபேசி
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-xl border-2 border-brass/40 bg-transparent text-ink placeholder:text-ink/40 outline-none focus:border-brass font-tamil-sans"
                  placeholder="தொலைபேசி எண்"
                />
              </label>

              <label className="block">
                <span className="font-display italic text-brass text-xs tracking-widest">
                  EMAIL · ஈ-மெயில்
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full px-4 py-3 rounded-xl border-2 border-brass/40 bg-transparent text-ink placeholder:text-ink/40 outline-none focus:border-brass font-tamil-sans"
                  placeholder="ஈ-மெயில் முகவரி"
                />
                <span className="mt-1 block font-tamil-sans text-[0.7rem] text-ink/60">
                  இந்த முகவரிக்கே PDF ரசீது அனுப்பப்படும்.
                </span>
              </label>

              <label className="block">
                <span className="font-display italic text-brass text-xs tracking-widest">
                  AMOUNT · தொகை
                </span>
                <div className="mt-2 flex items-stretch rounded-xl overflow-hidden border-2 border-brass/40 focus-within:border-brass">
                  <span className="px-4 flex items-center bg-brass/10 font-tamil-sans text-xl text-ink">
                    ₹
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(e) =>
                      setAmount(
                        e.target.value === ""
                          ? ""
                          : Math.max(1, Number(e.target.value)),
                      )
                    }
                    className="flex-1 bg-transparent px-4 py-3 text-xl font-tamil-sans outline-none placeholder:text-ink/40 text-ink"
                    placeholder="தொகையை உள்ளிடவும்"
                  />
                </div>
              </label>

              <label className="block">
                <span className="font-display italic text-brass text-xs tracking-widest">
                  SCREENSHOT · படிமம் பதிவேற்றம்
                </span>
                <div className="mt-2 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setScreenshot(e.target.files?.[0] || null)
                    }
                    className="sr-only"
                    id="screenshot-upload"
                    required
                  />
                  <label
                    htmlFor="screenshot-upload"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-brass/40 bg-brass/5 cursor-pointer hover:border-brass transition-all"
                  >
                    <Upload size={18} className="text-brass" />
                    <span className="font-tamil-sans text-ink">
                      {screenshot
                        ? screenshot.name
                        : "படிமத்தைத் தேர்ந்தெடுக்கவும்"}
                    </span>
                  </label>
                </div>
              </label>

              {status.kind === "error" && (
                <StatusMessage tone="error" message={status.message} />
              )}

              <button
                type="submit"
                className="w-full mt-2 px-5 py-4 rounded-full bg-gradient-sunset text-parchment font-tamil font-semibold shadow-brass hover:shadow-temple transition-all inline-flex items-center justify-center gap-2"
              >
                சமர்ப்பிக்கவும் · Submit
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Temple Location & Map */}
      <section className="relative-z mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="ornament-divider mb-6">
          <span className="font-display italic text-xs sm:text-sm tracking-[0.3em]">
            LOCATION · ஆலய இருப்பிடம்
          </span>
        </div>
        <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-5xl font-bold text-ink">
          ஆலயத்திற்கு வழி
        </h2>

        <div className="mt-10 grid lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
          <div className="lg:col-span-2 rounded-2xl border-2 border-brass/30 bg-card p-6 flex flex-col">
            <div className="flex items-center gap-2 text-vermillion">
              <MapPin size={20} />
              <div className="font-display italic text-xs tracking-widest text-brass-deep">
                TEMPLE ADDRESS
              </div>
            </div>
            <p className="mt-3 font-tamil text-lg sm:text-xl text-ink leading-relaxed">
              {TEMPLE_ADDRESS}
            </p>
            <div className="mt-4 font-tamil-sans text-sm text-ink/70 space-y-1">
              <div>📞 +91 98765 43210</div>
              <div>✉️ gokulsaravanana663@gmail.com</div>
              <div>🕕 காலை 6:00 — மாலை 9:00</div>
            </div>
            <div className="mt-auto pt-6 grid sm:grid-cols-2 gap-3">
              <a
                href={MAP_DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gradient-sunset text-parchment font-tamil font-semibold shadow-brass hover:shadow-temple transition-all"
              >
                <Navigation size={18} /> வழி காட்டி
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${TEMPLE_LAT},${TEMPLE_LNG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border-2 border-brass-deep text-ink font-tamil font-semibold hover:bg-brass/10 transition-all"
              >
                <MapPin size={18} /> Google Maps
              </a>
            </div>
          </div>
          <div className="lg:col-span-3 rounded-2xl overflow-hidden border-2 border-brass/30 shadow-temple min-h-[320px]">
            <iframe
              title="Sri Murugan Temple location"
              src={MAP_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[320px]"
              style={{ border: 0 }}
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function StatusMessage({ tone, message }) {
  const palette =
    tone === "warning"
      ? {
          bg: "bg-brass/10",
          border: "border-brass/50",
          text: "text-brass-deep",
          icon: <AlertTriangle size={18} className="shrink-0 text-brass-deep" />,
        }
      : {
          bg: "bg-vermillion/10",
          border: "border-vermillion/40",
          text: "text-vermillion",
          icon: <AlertTriangle size={18} className="shrink-0 text-vermillion" />,
        };
  return (
    <div
      role="alert"
      className={
        "flex items-start gap-3 rounded-xl border-2 px-4 py-3 font-tamil-sans text-sm " +
        palette.border +
        " " +
        palette.bg +
        " " +
        palette.text
      }
    >
      {palette.icon}
      <div className="flex-1 leading-relaxed">{message}</div>
    </div>
  );
}

function SuccessPanel({ status, onAgain }) {
  const pdfReady = status.pdfState === "ready";
  const pdfFailed = status.pdfState === "failed";
  const emailSent = status.emailState === "sent";
  const emailFailed = status.emailState === "failed";

  const mailtoHref = buildReceiptMailto({
    name: status.donorName,
    phone: status.donorPhone,
    email: status.email,
    amount: status.amount,
    receiptId: status.receiptId,
    issuedAt: status.issuedAt,
    upiId: UPI_ID,
  });

  return (
    <div className="text-center py-6">
      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-sunset text-parchment flex items-center justify-center shadow-brass">
        <Check size={32} />
      </div>
      <div className="mt-5 font-display italic text-brass-deep text-xs tracking-[0.3em]">
        DONATION RECEIVED · நன்றி
      </div>
      <h3 className="mt-2 font-tamil text-2xl sm:text-3xl font-bold text-ink">
        {status.donorName ? `நன்றி, ${status.donorName}!` : "உங்கள் தானத்திற்கு நன்றி"}
      </h3>
      <p className="mt-3 font-tamil-sans text-sm text-ink/75 leading-relaxed max-w-md mx-auto">
        உங்கள் தானம் நிர்வாகப் பலகையில் உடனடியாக பதிவாகியுள்ளது.{" "}
        {emailSent
          ? `PDF ரசீது ${status.email} முகவரிக்கு அனுப்பப்பட்டது.`
          : "ரசீது தயாராகிறது / ஈ-மெயில் அனுப்பப்படுகிறது."}
      </p>
      <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brass/40 bg-brass/10 font-display italic text-xs tracking-widest text-brass-deep">
        Receipt #{status.receiptId}
      </div>

      <div className="mt-5 max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-tamil-sans">
        <ProgressPill
          label="PDF"
          state={status.pdfState}
          okText="தயார் · Ready"
          pendingText="தயாராகிறது..."
          failText={status.pdfError || "தோல்வி"}
        />
        <ProgressPill
          label="EMAIL"
          state={status.emailState === "sending" ? "preparing" : status.emailState}
          okText="அனுப்பப்பட்டது · Sent"
          pendingText="அனுப்பப்படுகிறது..."
          failText={status.emailError || "தோல்வி"}
        />
      </div>

      {emailFailed && pdfReady ? (
        <p className="mt-3 font-tamil-sans text-xs text-brass-deep max-w-md mx-auto leading-relaxed">
          ஈ-மெயில் சேவை இணைப்பு இல்லை. கீழே "PDF பதிவிறக்கம்" அல்லது "ஈ-மெயிலில் திறக்கவும்"
          பொத்தானை அழுத்தவும்.
        </p>
      ) : null}
      {pdfFailed ? (
        <p className="mt-3 font-tamil-sans text-xs text-vermillion max-w-md mx-auto leading-relaxed">
          PDF: {status.pdfError}. உங்கள் தானம் நிர்வாகப் பலகையில் (Donations tab) பாதுகாப்பாக பதிவாகியுள்ளது.
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          disabled={!pdfReady}
          onClick={() => pdfReady && downloadReceiptBlob(status.pdfBlob, status.pdfFilename)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 border-brass-deep text-ink font-tamil font-semibold hover:bg-brass/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} /> {pdfReady ? "ரசீதை பதிவிறக்கம்" : "தயாராகிறது..."}
        </button>
        <a
          href={mailtoHref}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-brass/40 text-ink hover:bg-brass/10 transition-all font-tamil font-semibold"
        >
          <Mail size={16} /> ஈ-மெயிலில் திற
        </a>
        <button
          type="button"
          onClick={onAgain}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-sunset text-parchment font-tamil font-semibold shadow-brass hover:shadow-temple transition-all"
        >
          <Loader2 size={16} className={status.emailState === "sending" ? "animate-spin" : "hidden"} />
          மற்றொரு தானம்
        </button>
      </div>
    </div>
  );
}

function ProgressPill({ label, state, okText, pendingText, failText }) {
  let icon;
  let tone;
  let text;
  if (state === "ready" || state === "sent") {
    icon = <Check size={12} />;
    tone = "bg-emerald-100 border-emerald-300 text-emerald-800";
    text = okText;
  } else if (state === "failed") {
    icon = <AlertTriangle size={12} />;
    tone = "bg-amber-100 border-amber-300 text-amber-800";
    text = failText;
  } else {
    icon = <Loader2 size={12} className="animate-spin" />;
    tone = "bg-brass/10 border-brass/40 text-brass-deep";
    text = pendingText;
  }
  return (
    <div
      className={
        "inline-flex items-center justify-center gap-2 rounded-full border px-3 py-1.5 " +
        tone
      }
    >
      {icon}
      <span className="font-display italic text-[0.65rem] tracking-widest">{label}</span>
      <span className="text-[0.7rem]">{text}</span>
    </div>
  );
}
