import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import festivalImg from "@/assets/7.jpeg";
import { Eye, Star, Flame } from "lucide-react";

export const Route = createFileRoute("/festivals")({
  head: () => ({
    meta: [
      { title: "விழாக்கள் & நிகழ்ச்சிகள் — Festivals & Celebrations" },
      {
        name: "description",
        content: "வரவிருக்கும் விழாக்கள், தினசரி பூஜை வேளைகள் மற்றும் சிறப்பு தரிசன விவரங்கள்.",
      },
      { property: "og:title", content: "Festivals & Celebrations" },
      {
        property: "og:description",
        content: "Upcoming festivals, daily timings, and special darshan.",
      },
    ],
  }),
  component: FestivalsPage,
});

const upcoming = [
  {
    month: "மே",
    day: "15",
    tamil: "வைகாசி விசாகம்",
    en: "Vaikasi Visakam",
    note: "முருகப்பெருமான் அவதார தினம்",
  },
  {
    month: "ஜூன்",
    day: "22",
    tamil: "ஆனி திருமஞ்சனம்",
    en: "Aani Thirumanjanam",
    note: "நடராஜர் சிறப்பு அபிஷேகம்",
  },
  { month: "ஜூலை", day: "07", tamil: "ஆடி பூரம்", en: "Aadi Pooram", note: "அம்பாள் தீர்த்தவாரி" },
  {
    month: "ஆக",
    day: "11",
    tamil: "ஆவணி அவிட்டம்",
    en: "Avani Avittam",
    note: "உபாகர்மா & ரக்ஷாபந்தனம்",
  },
  {
    month: "செப்",
    day: "06",
    tamil: "விநாயகர் சதுர்த்தி",
    en: "Vinayakar Chathurthi",
    note: "கணேஷ விசேஷ பூஜை",
  },
  { month: "அக்", day: "02", tamil: "நவராத்திரி", en: "Navarathri", note: "9 இரவு அம்பாள் கொலு" },
];
const rituals = [
  {
    tamil: "அபிஷேகம்",
    en: "Abhishekam",
    desc: "மூலவருக்கு பால், தயிர், தேன், சந்தனம் ஆகியவற்றால் நீராட்டு.",
  },
  { tamil: "அர்ச்சனை", en: "Archana", desc: "108 / 1008 நாமங்களால் தெய்வத்தை அழைத்து வழிபடல் @7:00 AM." },
];

function FestivalsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <PageHero
        eyebrow="Festivals · விழாக்கள்"
        titleTamil="விழாக்கள் & கொண்டாட்டங்கள்"
        titleEn="Festivals & Celebrations"
        description="ஆண்டின் ஒவ்வொரு மாதமும் ஆலயத்தில் கொண்டாடப்படும் சிறப்பு விழாக்கள், தினசரி தரிசன வேளைகள் மற்றும் சிறப்பு சடங்குகள்."
        image={festivalImg}
      />

      {/* Upcoming Festivals */}
      <section className="relative-z mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="ornament-divider mb-6">
          <span className="font-display italic text-xs sm:text-sm tracking-[0.3em]">
            UPCOMING · வரவிருக்கும்
          </span>
        </div>
        <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-5xl font-bold text-ink">
          வரவிருக்கும் விழாக்கள்
        </h2>

        <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {upcoming.map((f) => (
            <div
              key={f.en}
              className="group relative overflow-hidden rounded-2xl bg-card border border-brass/30 hover:shadow-temple transition-all"
            >
              <div className="flex">
                <div className="w-24 sm:w-28 shrink-0 bg-gradient-sunset text-parchment flex flex-col items-center justify-center py-6 px-2">
                  <div className="font-display italic text-xs tracking-widest opacity-80">
                    {f.month}
                  </div>
                  <div className="font-tamil text-4xl sm:text-5xl font-bold leading-none mt-1">
                    {f.day}
                  </div>
                </div>
                <div className="flex-1 p-5 sm:p-6">
                  <div className="font-display italic text-xs tracking-widest text-brass-deep uppercase">
                    {f.en}
                  </div>
                  <div className="font-tamil text-xl sm:text-2xl text-ink font-bold mt-1 leading-tight">
                    {f.tamil}
                  </div>
                  <p className="mt-2 font-tamil-sans text-sm text-ink/70">{f.note}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Rituals */}
      <section className="relative-z mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="flex items-center gap-3 justify-center mb-6">
          <Flame className="text-vermillion animate-flicker" />
          <span className="font-display italic text-sm tracking-[0.3em] text-brass-deep">
            SPECIAL RITUALS · சிறப்பு சடங்குகள்
          </span>
        </div>
        <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-5xl font-bold text-ink mb-10">
          சிறப்பு சடங்குகள்
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {rituals.map((r) => (
            <div
              key={r.en}
              className="relative p-6 sm:p-8 rounded-2xl border border-brass/30 bg-gradient-to-br from-card to-parchment"
            >
              <Star className="absolute top-5 right-5 text-brass" size={20} />
              <div className="font-display italic text-brass-deep text-xs tracking-widest uppercase">
                {r.en}
              </div>
              <div className="font-tamil text-2xl sm:text-3xl text-ink font-bold mt-1">
                {r.tamil}
              </div>
              <p className="mt-3 font-tamil-sans text-ink/75 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
