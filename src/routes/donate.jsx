import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import donationImg from "@/assets/Donation.jpg";
import {
  Copy,
  Check,
  MapPin,
  Navigation,
  Upload,
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
      {
        property: "og:description",
        content: "Secure UPI / QR donation.",
      },
    ],
  }),
  component: DonatePage,
});

const UPI_ID = "srialayam@upi";

function DonatePage() {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState(501);
  const [screenshot, setScreenshot] = useState(null);

  const copyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      name,
      phone,
      email,
      amount,
      screenshot,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <PageHero
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
                  <div className="font-tamil text-2xl font-bold mt-2">QR ஸ்கேன் செய்யுங்கள்</div>
                </div>

                {/* Faux QR */}
                <div className="mt-6 mx-auto aspect-square max-w-xs rounded-2xl bg-ink p-4 grid grid-cols-12 grid-rows-12 gap-[3px]">
                  {Array.from({ length: 144 }).map((_, i) => {
                    const corner =
                      (i < 36 && i % 12 < 3) || (i < 36 && i % 12 > 8) || (i > 107 && i % 12 < 3);
                    const filled = corner || (i * 7) % 5 < 2;
                    return (
                      <div
                        key={i}
                        className={`rounded-[2px] ${filled ? "bg-parchment" : "bg-transparent"}`}
                      />
                    );
                  })}
                </div>

                <div className="mt-5 text-center">
                  <div className="font-tamil-sans text-sm text-ink/70">UPI ID</div>
                  <div className="font-tamil-sans text-lg font-semibold text-ink">{UPI_ID}</div>
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
                  {copied ? "நகலெடுக்கப்பட்டது" : `UPI: ${UPI_ID}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donor Details Form Section */}
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <label className="block">
              <span className="font-display italic text-brass text-xs tracking-widest">
                NAME · பெயர்
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 w-full px-4 py-3 rounded-xl border-2 border-brass/40 bg-transparent text-ink placeholder:text-ink/40 outline-none focus:border-brass font-tamil-sans"
                placeholder="பெயரை உள்ளிடவும்"
              />
            </label>

            {/* Phone */}
            <label className="block">
              <span className="font-display italic text-brass text-xs tracking-widest">
                PHONE · தொலைபேசி
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-2 w-full px-4 py-3 rounded-xl border-2 border-brass/40 bg-transparent text-ink placeholder:text-ink/40 outline-none focus:border-brass font-tamil-sans"
                placeholder="தொலைபேசி எண்"
              />
            </label>

            {/* Email */}
            <label className="block">
              <span className="font-display italic text-brass text-xs tracking-widest">
                EMAIL · ஈ-மெயில்
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full px-4 py-3 rounded-xl border-2 border-brass/40 bg-transparent text-ink placeholder:text-ink/40 outline-none focus:border-brass font-tamil-sans"
                placeholder="ஈ-மெயில் முகவரி"
              />
            </label>

            {/* Amount */}
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
                    setAmount(e.target.value === "" ? "" : Math.max(1, Number(e.target.value)))
                  }
                  required
                  className="flex-1 bg-transparent px-4 py-3 text-xl font-tamil-sans outline-none placeholder:text-ink/40 text-ink"
                  placeholder="தொகையை உள்ளிடவும்"
                />
              </div>
            </label>

            {/* Screenshot Upload */}
            <label className="block">
              <span className="font-display italic text-brass text-xs tracking-widest">
                SCREENSHOT · படிமம் பதிவேற்றம்
              </span>
              <div className="mt-2 relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                  required
                  className="sr-only"
                  id="screenshot-upload"
                />
                <label
                  htmlFor="screenshot-upload"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-brass/40 bg-brass/5 cursor-pointer hover:border-brass transition-all"
                >
                  <Upload size={18} className="text-brass" />
                  <span className="font-tamil-sans text-ink">
                    {screenshot ? screenshot.name : "படிமத்தைத் தேர்ந்தெடுக்கவும்"}
                  </span>
                </label>
              </div>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-8 px-5 py-4 rounded-full bg-gradient-sunset text-parchment font-tamil font-semibold shadow-brass hover:shadow-temple transition-all"
            >
              சமர்ப்பிக்கவும் · Submit
            </button>
          </form>
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
              <div>✉️ info@srimuruganalayam.org</div>
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
