import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import priestImg from "@/assets/achakar.jpg";
import { Phone, User } from "lucide-react";
import { useContent } from "@/lib/content-store";

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

const defaultPriest = {
  label: "அர்ச்சகர்",
  phone: "9894187394",
};

const defaultTrustees = [
  { name: "திரு கிருஷ்ணமூர்த்தி", phone: "9486525147" },
  { name: "திரு சரவணன்", phone: "8248466414" },
  { name: "திரு வெங்கடேஷ்", phone: "9362661814" },
];

function PriestPage() {
  const { content } = useContent();
  const priest = content.priest || defaultPriest;
  const trustees = content.trustees && content.trustees.length > 0 ? content.trustees : defaultTrustees;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <PageHero
        slug="priest"
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
            அர்ச்சகர்
          </span>
        </div>
        <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-ink">
          அர்ச்சகர்
        </h2>

        <div className="mt-6 sm:mt-8 flex justify-center">
          <div className="group relative bg-card border border-brass/30 rounded-2xl p-4 sm:p-5 hover:shadow-temple transition-all w-full sm:w-80 text-center">
            <div className="mx-auto h-14 w-14 rounded-full bg-gradient-brass text-parchment flex items-center justify-center mb-3 shadow-brass">
              <User size={22} />
            </div>
            <div className="font-tamil text-base sm:text-xl text-ink font-bold leading-tight">
              {priest.label}
            </div>
            <a
              href={`tel:${priest.phone}`}
              className="inline-flex items-center justify-center gap-1.5 mt-2 font-tamil-sans text-sm text-brass-deep hover:text-vermillion transition-colors"
            >
              <Phone size={13} />
              {priest.phone}
            </a>
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

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {trustees.map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="bg-card border border-brass/30 rounded-xl p-4 sm:p-5 text-center hover:shadow-brass transition-all"
            >
              <div className="mx-auto h-14 w-14 rounded-full bg-gradient-brass text-parchment flex items-center justify-center mb-3 shadow-brass">
                <User size={20} />
              </div>
              <div className="font-tamil text-base sm:text-lg text-ink font-bold">{t.name}</div>
              <a
                href={`tel:${t.phone}`}
                className="inline-flex items-center gap-1.5 mt-2 font-tamil-sans text-sm text-brass-deep hover:text-vermillion transition-colors"
              >
                <Phone size={13} />
                {t.phone}
              </a>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
