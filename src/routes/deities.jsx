import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import ganesha from "@/assets/20.jpeg";
import murugan from "@/assets/5.jpeg";
import valliyammai from "@/assets/2.jpeg";
import dheivayanai from "@/assets/4.jpeg";
import idumban from "@/assets/21.jpeg";
import vishnu from "@/assets/perumal.jpg";
import { Sparkles, Clock, CalendarHeart, Flame } from "lucide-react";

export const Route = createFileRoute("/deities")({
  head: () => ({
    meta: [
      { title: "முக்கிய தெய்வங்கள் — Main Deities" },
      {
        name: "description",
        content: "ஆலயத்தில் அமைந்துள்ள முக்கிய தெய்வங்களின் வரலாறு, அருள் மற்றும் பூஜை நேரங்கள்.",
      },
      { property: "og:title", content: "Main Deities · முக்கிய தெய்வங்கள்" },
      {
        property: "og:description",
        content: "Ganesha, Murugan, Amman, Shiva, Vishnu — sacred deities of the temple.",
      },
    ],
  }),
  component: DeitiesPage,
});

const deities = [
  {
    id: "ganesha",
    tamil: "ஸ்ரீ விநாயகர்",
    en: "Ganesha",
    image: ganesha,
    description:
      "தடைகளை நீக்கும் முதல்வன் கணேஷர். எல்லாப் பூஜைகளிலும் முதலில் வழிபடப்படும் பிரதம தெய்வம். ஞானம், செல்வம் மற்றும் வெற்றியின் அதிபதி.",
    blessings: [
      "தடைகள் நீக்கம்",
      "ஞானம் & கல்வி",
      "புதிய தொடக்கங்களில் வெற்றி",
      "செல்வம் & செழிப்பு",
    ],
    timings: [{ label: "தினசரி காலை 7 மணி", time: "7:00 AM" }],
    specialDays: ["சங்கடஹர சதுர்த்தி", "விநாயக சதுர்த்தி", "செவ்வாய் & வெள்ளி"],
    accent: "from-[oklch(0.55_0.13_60)] to-[oklch(0.78_0.13_75)]",
  },
  {
    id: "murugan",
    tamil: "ஸ்ரீ முருகன்",
    en: "Murugan",
    image: murugan,
    description:
      "வேலனின் அருள் கொண்ட ஆறுமுகன் — தமிழர்களின் தெய்வம். வீரம், ஞானம், காவல் தந்து தீமைகளை அழிக்கும் கந்தப் பெருமான்.",
    blessings: ["தீமைகள் அழிப்பு", "வீரம் & தைரியம்", "ஞானம் (சக்தி வேல்)", "காவலும் பாதுகாப்பும்"],
    timings: [{ label: "தினசரி காலை 7 மணி", time: "7:00 AM" }],
    specialDays: ["தைப்பூசம்", "ஸ்கந்த சஷ்டி", "வைகாசி விசாகம்", "செவ்வாய் & வெள்ளி"],
    accent: "from-[oklch(0.50_0.20_28)] to-[oklch(0.72_0.14_70)]",
  },
  {
    id: "valliyammai",
    tamil: "ஸ்ரீ வள்ளியம்மை",
    en: "valliyammai",
    image: valliyammai,
    description:
      "வள்ளியம்மை என்பது முருகப்பெருமானின் இரண்டாம் துணைவியார் ஆகும்.முருகன் வேடன் வடிவில் வந்து வள்ளியை மணந்த கதை தமிழர் மரபில் மிகவும் புகழ்பெற்றதாகும்.",
    blessings: ["குடும்ப பாதுகாப்பு", "சந்தான வரம்", "நோய் நீக்கம்", "தீய சக்தி நிவாரணம்"],
    timings: [{ label: "தினசரி காலை 7 மணி", time: "7:00 AM" }],
    specialDays: ["நவராத்திரி", "ஆடி பூரம்", "வெள்ளிக்கிழமை"],
    accent: "from-[oklch(0.45_0.18_25)] to-[oklch(0.62_0.18_30)]",
  },
  {
    id: "dheivayanai",
    tamil: "ஸ்ரீ தெய்வயானை",
    en: "Deivayanai",
    image: dheivayanai,
    description:
      "தெய்வயானை இந்திரனின் மகளும் முருகப்பெருமானின் முதல் துணைவியாரும் ஆவார்.அழகு, கருணை மற்றும் பக்தியின் அடையாளம்.",
    blessings: ["குடும்ப ஒற்றுமை", "அழகு & கருணை", "பக்தி & தியானம்", "தீய சக்தி நிவாரணம்"],
    timings: [{ label: "தினசரி காலை 7 மணி", time: "7:00 AM" }],
    specialDays: ["தைப்பூசம்", "ஸ்கந்த சஷ்டி", "வைகாசி விசாகம்", "வெள்ளிக்கிழமை"],
    accent: "from-[oklch(0.45_0.18_25)] to-[oklch(0.62_0.18_30)]",
  },
  {
    id: "idumban",
    tamil: "இடும்பன்",
    en: "Idumban",
    image: idumban,
    description:
      "இடும்பன் என்பது அகத்திய முனிவரின் சீடராகவும், முருகப்பெருமானின் பக்தராகவும் அறியப்படுகிறார்.பழனி மலையை காவடியாக சுமந்த இடும்பனை முருகன் அருளால் உயிர்ப்பித்து தனது காவலராக ஆசீர்வதித்தார்.",
    blessings: ["பக்தி & தியானம்", "உழைப்பின் பலன்", "கடின உழைப்பு", "முருகன் அருள்"],
    timings: [{ label: "தினசரி காலை 7 மணி", time: "7:00 AM" }],
    specialDays: ["தைப்பூசம்", "ஸ்கந்த சஷ்டி", "வைகாசி விசாகம்", "செவ்வாய் & வெள்ளி"],
    accent: "from-[oklch(0.55_0.13_60)] to-[oklch(0.65_0.15_85)]",
  },
];

function DeitiesPage() {
  const [active, setActive] = useState(deities[0].id);
  const current = deities.find((d) => d.id === active);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <PageHero
        eyebrow="Main Deities · முக்கிய தெய்வங்கள்"
        titleTamil="முக்கிய தெய்வங்கள்"
        titleEn="Sacred Deities of the Temple"
        description="ஆலயத்தில் அமர்ந்தருளும் ஐம்பெரும் தெய்வங்களின் வரலாறு, அருள், பூஜை நேரம் மற்றும் சிறப்பு நாட்களை அறியுங்கள்."
        image={murugan}
      />

      {/* Deity selector */}
      <section className="relative-z mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {deities.map((d) => (
            <button
              key={d.id}
              onClick={() => setActive(d.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-full border-2 font-tamil font-semibold text-sm sm:text-base transition-all ${
                active === d.id
                  ? "bg-vermillion border-vermillion text-parchment shadow-brass"
                  : "border-brass/40 text-ink hover:border-brass-deep hover:bg-brass/10"
              }`}
            >
              {d.tamil}
            </button>
          ))}
        </div>

        {/* Active deity detail */}
        <div className="mt-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Image with glow */}
          <div className="lg:col-span-5 relative mx-auto max-w-md w-full">
            <div
              className={`absolute -inset-6 rounded-[2rem] bg-gradient-to-br ${current.accent} blur-3xl opacity-50 animate-pulse`}
            />
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-4 border-brass shadow-temple">
              <img
                src={current.image}
                alt={current.tamil}
                width={768}
                height={960}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-ink to-transparent">
                <div className="font-display italic text-brass text-xs tracking-widest">
                  {current.en.toUpperCase()}
                </div>
                <div className="font-tamil text-2xl text-parchment font-bold mt-1">
                  {current.tamil}
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-7">
            <div className="font-display italic text-brass-deep text-sm tracking-widest">
              DESCRIPTION · வரலாறு
            </div>
            <h2 className="mt-2 font-tamil text-3xl sm:text-4xl font-bold text-ink">
              {current.tamil}
            </h2>
            <p className="mt-4 font-tamil-sans text-base sm:text-lg text-ink/75 leading-relaxed">
              {current.description}
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border-2 border-brass/30 bg-card p-5">
                <div className="flex items-center gap-2 text-vermillion">
                  <Sparkles size={18} />
                  <div className="font-display italic text-xs tracking-widest text-brass-deep">
                    BLESSINGS · அருள்
                  </div>
                </div>
                <ul className="mt-3 space-y-2 font-tamil-sans text-sm text-ink/80">
                  {current.blessings.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Flame size={14} className="mt-1 text-vermillion shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-brass/30 bg-card p-5">
                <div className="flex items-center gap-2 text-brass-deep">
                  <Clock size={18} />
                  <div className="font-display italic text-xs tracking-widest">
                    POOJA TIMINGS · பூஜை நேரம்
                  </div>
                </div>
                <ul className="mt-3 space-y-2 font-tamil-sans text-sm text-ink/80">
                  {current.timings.map((t) => (
                    <li
                      key={t.label}
                      className="flex items-center justify-between gap-2 border-b border-brass/15 pb-1.5 last:border-0"
                    >
                      <span>{t.label}</span>
                      <span className="font-semibold text-vermillion">{t.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border-2 border-brass/30 bg-card p-5 sm:col-span-2">
                <div className="flex items-center gap-2 text-brass-deep">
                  <CalendarHeart size={18} />
                  <div className="font-display italic text-xs tracking-widest">
                    SPECIAL DAYS · சிறப்பு நாட்கள் & விழாக்கள்
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {current.specialDays.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1.5 rounded-full bg-vermillion/10 border border-vermillion/30 font-tamil text-sm text-ink"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All deity gallery */}
      <section className="relative-z bg-gradient-sanctum text-parchment">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
          <div className="ornament-divider mb-6">
            <span className="font-display italic text-xs sm:text-sm tracking-[0.3em] text-brass">
              ALL DEITIES · அனைத்து தெய்வங்கள்
            </span>
          </div>
          <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-5xl font-bold">
            ஐம்பெரும் தெய்வங்கள்
          </h2>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {deities.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setActive(d.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-left group relative overflow-hidden rounded-2xl border-2 border-brass/30 bg-parchment/5 hover:border-brass transition-all"
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${d.accent} opacity-30 group-hover:opacity-50 transition-opacity`}
                  />
                  <img
                    src={d.image}
                    alt={d.tamil}
                    loading="lazy"
                    width={768}
                    height={960}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="font-display italic text-brass text-xs tracking-widest">
                    {d.en.toUpperCase()}
                  </div>
                  <div className="font-tamil text-2xl text-parchment font-bold mt-1">{d.tamil}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
