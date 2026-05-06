import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import priestImg from "@/assets/achakar.jpg";
import { Phone, Mail, MapPin, User } from "lucide-react";

export const Route = createFileRoute("/priest")({
  head: () => ({
    meta: [
      { title: "அர்ச்சகர் & நிர்வாகம் — Priest & Administration" },
      {
        name: "description",
        content: "ஆலய அர்ச்சகர், தொடர்பு விவரம் மற்றும் நிர்வாக குழு பற்றிய தகவல்.",
      },
      { property: "og:title", content: "Priest & Administration" },
      { property: "og:description", content: "Meet the priest and the temple management team." },
    ],
  }),
  component: PriestPage,
});

const priests = [
  {
    tamil: "ஸ்ரீ வேதநாராயண சாஸ்திரிகள்",
    en: "Sri Vedanarayana Sastrigal",
    role: "பிரதான அர்ச்சகர் / Chief Priest",
    years: "32 ஆண்டுகள் சேவை",
  },
  {
    tamil: "ஸ்ரீ ராமசுப்ரமணியன்",
    en: "Sri Ramasubramanian",
    role: "உப அர்ச்சகர் / Assistant Priest",
    years: "18 ஆண்டுகள் சேவை",
  },
  {
    tamil: "ஸ்ரீ கிருஷ்ணமூர்த்தி",
    en: "Sri Krishnamurthy",
    role: "வேத பாராயணர் / Veda Pundit",
    years: "24 ஆண்டுகள் சேவை",
  },
  {
    tamil: "கிருஷ்ண",
    en: "Krishna",
    role: "வேத பாராயணர் / Veda Pundit",
    years: "2 ஆண்டுகள் சேவை",
  },
];

const trustees = [
  { name: "திரு. சுந்தர் ராஜன்", role: "தலைவர் / President" },
  { name: "திரு. முருகன் சுவாமி", role: "செயலாளர் / Secretary" },
  { name: "திருமதி. லட்சுமி", role: "பொருளாளர் / Treasurer" },
  { name: "திரு. ராமன்", role: "உறுப்பினர் / Member" },
];

function PriestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <PageHero
        eyebrow="Priest · அர்ச்சகர்"
        titleTamil="அர்ச்சகர் & நிர்வாகம்"
        titleEn="Priest & Temple Administration"
        description="பாரம்பரிய சாஸ்திர முறைப்படி ஆலய பூஜைகளை நடத்தும் அர்ச்சகர்களையும், ஆலய நிர்வாக குழுவையும் அறிமுகப்படுத்துகிறோம்."
        image={priestImg}
      />

      {/* Priests */}
      <section className="relative-z mx-auto max-w-6xl w-full px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="ornament-divider mb-3">
          <span className="font-display italic text-xs sm:text-sm tracking-[0.3em]">
            PRIESTS · அர்ச்சகர்கள்
          </span>
        </div>
        <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-ink">
          பாரம்பரிய அர்ச்சகர்கள்
        </h2>

        <div className="mt-6 sm:mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {priests.map((p) => (
            <div
              key={p.en}
              className="group relative bg-card border border-brass/30 rounded-2xl p-4 sm:p-5 hover:shadow-temple transition-all"
            >
              <div className="h-14 w-14 rounded-full bg-gradient-brass text-parchment flex items-center justify-center mb-3 shadow-brass">
                <User size={22} />
              </div>
              <div className="font-tamil text-base sm:text-xl text-ink font-bold leading-tight">
                {p.tamil}
              </div>
              <div className="font-display italic text-brass-deep text-xs sm:text-sm mt-1">
                {p.en}
              </div>
              <div className="mt-3 pt-3 border-t border-brass/20">
                <div className="font-tamil-sans text-sm text-ink/80">{p.role}</div>
                <div className="font-display italic text-xs text-vermillion mt-1">{p.years}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="relative-z bg-gradient-sanctum text-parchment">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 py-8 sm:py-10 grid gap-6 lg:grid-cols-2">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full border border-brass/50 text-brass text-xs tracking-[0.3em] uppercase font-display italic">
              Contact · தொடர்பு
            </span>
            <h2 className="mt-4 font-tamil text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold">
              தொடர்பு விவரம்
            </h2>
            <p className="mt-4 font-tamil-sans text-parchment/75 text-base sm:text-lg leading-relaxed max-w-md">
              பூஜை, விசேஷ சேவைகள் அல்லது நிர்வாக கேள்விகளுக்கு எங்களை தொடர்பு கொள்ளுங்கள்.
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <a
              href="tel:+919876543210"
              className="flex items-start gap-3 p-4 rounded-xl bg-parchment/10 hover:bg-parchment/15 backdrop-blur border border-brass/20 transition-all"
            >
              <div className="h-12 w-12 shrink-0 rounded-full bg-vermillion flex items-center justify-center">
                <Phone size={18} />
              </div>
              <div>
                <div className="font-display italic text-brass text-[11px] tracking-widest">
                  PHONE / தொலைபேசி
                </div>
                <div className="font-tamil-sans text-base sm:text-lg mt-1">+91 98765 43210</div>
                <div className="font-tamil text-sm text-parchment/70">
                  அர்ச்சகர் தொடர்பு: +91 98765 11111
                </div>
              </div>
            </a>
            <a
              href="mailto:contact@srialayam.org"
              className="flex items-start gap-3 p-4 rounded-xl bg-parchment/10 hover:bg-parchment/15 backdrop-blur border border-brass/20 transition-all"
            >
              <div className="h-12 w-12 shrink-0 rounded-full bg-brass flex items-center justify-center text-ink">
                <Mail size={18} />
              </div>
              <div>
                <div className="font-display italic text-brass text-[11px] tracking-widest">
                  EMAIL / மின்னஞ்சல்
                </div>
                <div className="font-tamil-sans text-base sm:text-lg mt-1">
                  contact@srialayam.org
                </div>
              </div>
            </a>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-parchment/10 backdrop-blur border border-brass/20">
              <div className="h-12 w-12 shrink-0 rounded-full bg-brass-deep flex items-center justify-center">
                <MapPin size={18} />
              </div>
              <div>
                <div className="font-display italic text-brass text-[11px] tracking-widest">
                  ADDRESS / முகவரி
                </div>
                <div className="font-tamil text-base sm:text-lg mt-1">
                  ஸ்ரீ ஆலயம், கோவில் தெரு, மயிலாப்பூர், சென்னை - 600 004
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trustees */}
      <section className="relative-z mx-auto max-w-6xl w-full px-5 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="ornament-divider mb-3">
          <span className="font-display italic text-xs sm:text-sm tracking-[0.3em]">
            MANAGEMENT · நிர்வாகம்
          </span>
        </div>
        <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-ink">
          அறங்காவலர் குழு
        </h2>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {trustees.map((t) => (
            <div
              key={t.name}
              className="bg-card border border-brass/30 rounded-xl p-4 sm:p-5 text-center hover:shadow-brass transition-all"
            >
              <div className="mx-auto h-14 w-14 rounded-full bg-gradient-brass text-parchment flex items-center justify-center mb-3 shadow-brass">
                <User size={20} />
              </div>
              <div className="font-tamil text-base sm:text-lg text-ink font-bold">{t.name}</div>
              <div className="font-display italic text-sm text-brass-deep mt-1">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
