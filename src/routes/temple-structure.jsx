import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import carvings from "@/assets/19.jpeg";
import aerial from "@/assets/1.jpeg";
import gopuram from "@/assets/12.jpeg";
import { Ruler, Layers, Building2 } from "lucide-react";

export const Route = createFileRoute("/temple-structure")({
  head: () => ({
    meta: [
      { title: "ஆலய அமைப்பு — Temple Structure" },
      { name: "description", content: "கோபுரம், மண்டபம், சன்னதி உள்ளிட்ட ஆலய கட்டுமான விவரங்கள்." },
      { property: "og:title", content: "ஆலய அமைப்பு — Temple Structure" },
      {
        property: "og:description",
        content: "Detailed architecture of the gopuram, mandapams, and sanctums.",
      },
      { property: "og:image", content: aerial },
    ],
  }),
  component: TempleStructure,
});

const parts = [
  {
    code: "03",
    tamil: "கருவறை சன்னதி",
    en: "Garbhagriha",
    height: "15*15",
    desc: "மூலவர் வீற்றிருக்கும் புனித சன்னதி. சதுர வடிவில் கட்டப்பட்டு, மேலே விமானத்தைக் கொண்டுள்ளது.",
    image: gopuram,
  },
];

const specs = [
  { label: "மொத்த பரப்பு", value: "10 சென்ட் " },
  { label: "கோபுரத்தின் உயரம்", value: "60 அடி இரு நிலை  கோபுரம்" },
  { label: "சன்னதிகள்", value: "3" },
  { label: "மண்டபங்கள்", value: "1" },
  { label: "வாயில்", value: "கிழக்கு வாயில்" },
];

function TempleStructure() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <PageHero
        slug="temple-structure"
        sectionNumber="2.3"
        eyebrow="Chapter · அத்தியாயம் மூன்று"
        titleTamil="ஆலய அமைப்பு"
        titleEn="Temple Structure"
        description="இனாம்காரியந்தல் கிராமத்தில் அமைந்துள்ள ஸ்ரீ வள்ளி தேவசேனா சமேத சுப்ரமணியன் ஆலயம், முருக பக்தர்களின் முயற்சியாலும் கிராம மக்களின் ஒற்றுமையாலும் உருவாக்கப்பட்டது.
எம்பெருமான் முருகன் அருளால் 2017 ஆம் ஆண்டு தொடங்கப்பட்ட இவ்வாலயம், 2019 ஆம் ஆண்டு சிறப்பான குடமுழுக்குடன் பக்தர்களின் வழிபாட்டிற்கு திறக்கப்பட்டது."
        image={carvings}
      />

      {/* QUICK SPECS */}
      <section className="relative-z mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="bg-gradient-sanctum text-parchment rounded-3xl p-6 sm:p-8 lg:p-12 shadow-temple">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <Ruler className="text-brass" size={20} />
            <div className="font-display italic text-brass tracking-widest text-xs sm:text-sm">
              AT A GLANCE · ஓரு பார்வை
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {specs.map((s) => (
              <div key={s.label} className="border-l-2 border-brass/40 pl-3 sm:pl-4 text-left">
                <div className="font-tamil-sans text-parchment/60 text-[0.65rem] sm:text-[0.72rem] uppercase tracking-widest leading-tight">
                  {s.label}
                </div>
                <div className="mt-1 sm:mt-2 font-tamil text-lg sm:text-xl font-bold text-brass break-words leading-tight">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AERIAL VIEW */}
      <section className="relative-z mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-14 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <div>
            <span className="tamil-chip">Layout · தளவமைப்பு</span>
            <h2 className="mt-4 sm:mt-5 font-tamil text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-tight">
              வானிலிருந்து
              <br />
              <span className="text-vermillion">பார்க்கும்போது</span>
            </h2>
            <p className="mt-5 sm:mt-6 font-tamil-sans text-base sm:text-lg text-ink/80 leading-relaxed">
              ஆலயத்தின் ராஜகோபுரம் 60 அடி உயரத்தில் இரு நிலைகளுடன் சிறப்பாக அமைக்கப்பட்டுள்ளது. இந்த
              கோபுரம் அழகிய சிற்பக் கலை நயத்துடன் பக்தர்களை ஈர்க்கும் வகையில் கம்பீரமாக
              விளங்குகிறது.
            </p>
            <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
              <div className="border border-brass/30 rounded-xl p-4 bg-card">
                <Layers className="text-vermillion mb-2" size={20} />
                <div className="font-tamil text-base sm:text-lg font-bold text-ink">1 பிரகாரம்</div>
                <div className="font-tamil-sans text-xs sm:text-sm text-ink/65">
                  படிநிலை வழிபாடு
                </div>
              </div>
              <div className="border border-brass/30 rounded-xl p-4 bg-card">
                <Building2 className="text-vermillion mb-2" size={20} />
                <div className="font-tamil text-base sm:text-lg font-bold text-ink">1 கோபுரம்</div>
                <div className="font-tamil-sans text-xs sm:text-sm text-ink/65">கிழக்கு வாயில்</div>
              </div>
            </div>
          </div>
          <div className="relative max-w-lg mx-auto lg:max-w-none w-full">
            <div className="absolute -inset-6 bg-gradient-sunset rounded-3xl blur-3xl opacity-25" />
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-brass/40 shadow-temple">
              <img
                src={aerial}
                alt="ஆலய தளவமைப்பு"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PARTS - alternating layout */}
      <section className="relative-z bg-gradient-parchment py-14 sm:py-20 lg:py-24 border-y border-brass/20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
          <div className="ornament-divider mb-6">
            <span className="font-display italic tracking-[0.3em] text-xs sm:text-sm">
              COMPONENTS · கூறுகள்
            </span>
          </div>
          <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-5xl font-bold text-ink">
            முக்கிய பகுதிகள்
          </h2>

          <div className="mt-12 sm:mt-16 lg:mt-20 space-y-16 sm:space-y-20 lg:space-y-24">
            {parts.map((p, i) => (
              <div
                key={p.code}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <div className="relative max-w-md mx-auto lg:max-w-none w-full">
                  <div className="absolute -top-6 sm:-top-8 -left-1 sm:-left-2 font-display italic text-[4rem] sm:text-[5rem] lg:text-[6rem] leading-none text-brass/30 select-none">
                    {p.code}
                  </div>
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-brass/30 shadow-temple">
                    <img
                      src={p.image}
                      alt={p.en}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5">
                      <div className="font-display italic text-brass tracking-widest text-xs">
                        {p.en.toUpperCase()}
                      </div>
                      <div className="font-tamil text-xl sm:text-2xl text-parchment font-bold">
                        {p.tamil}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-display italic text-brass-deep tracking-widest text-xs sm:text-sm">
                    PART {p.code}
                  </div>
                  <h3 className="mt-2 font-tamil text-2xl sm:text-3xl lg:text-4xl font-bold text-ink leading-tight">
                    {p.tamil}
                  </h3>
                  <div className="mt-1 font-display italic text-lg sm:text-xl lg:text-2xl text-brass-deep">
                    {p.en}
                  </div>
                  <div className="mt-5 sm:mt-6 inline-flex items-baseline gap-2 sm:gap-3 px-4 sm:px-5 py-2 sm:py-3 rounded-full bg-vermillion/10 border border-vermillion/30">
                    <span className="font-display italic text-brass-deep text-xs tracking-widest">
                      DIMENSION
                    </span>
                    <span className="font-tamil text-vermillion font-bold text-base sm:text-xl">
                      {p.height}
                    </span>
                  </div>
                  <p className="mt-5 sm:mt-6 font-tamil-sans text-base sm:text-lg text-ink/80 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONSTRUCTION DETAILS */}
      <section className="relative-z mx-auto max-w-5xl px-5 sm:px-6 lg:px-10 py-14 sm:py-20 lg:py-24">
        <div className="ornament-divider mb-6 sm:mb-8">
          <span className="font-display italic tracking-[0.3em] text-xs sm:text-sm">
            CONSTRUCTION · கட்டுமான விவரங்கள்
          </span>
        </div>
        <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-5xl font-bold text-ink mb-8 sm:mb-12">
          கட்டுமான தொழில்நுட்பம்
        </h2>

        <div className="grid sm:grid-cols-2 gap-5 sm:gap-8">
          {[
            {
              t: "கருங்கல் பயன்பாடு",
              d: "ஆலயத்தின் அஸ்திவாரம் சுமார்  15 டன் கருங்கல் பயன்படுத்தப்பட்டுள்ளது.",
            },
            {
              t: "சுதை வேலைப்பாடு",
              d: "கோபுர சிற்பங்கள் சுண்ணாம்பு, வெல்லம், நாதவளை போன்ற இயற்கை பொருட்களால் ஆன பாரம்பரிய சுதையால் வடிக்கப்பட்டவை.",
            },
            {
              t: "வாஸ்து சாஸ்திரம்",
              d: "முழு வடிவமைப்பும் பழமையான வாஸ்து கோட்பாடுகளின்படி, கணித துல்லியத்துடன் திட்டமிடப்பட்டுள்ளது.",
            },
            {
              t: "காலத்தை வென்றது",
              d: 'எவ்வித இரும்பு பயன்பாடின்றி, கல்லின் மேல் கல்லை அமைக்கும் பழமையான "கல் பூட்டு" முறையில் கட்டப்பட்டுள்ளது.',
            },
          ].map((b) => (
            <div
              key={b.t}
              className="bg-card border-l-4 border-vermillion rounded-r-xl p-5 sm:p-6 shadow-soft hover:shadow-brass transition-shadow"
            >
              <div className="font-tamil text-xl sm:text-2xl font-bold text-ink">{b.t}</div>
              <div className="mt-2 sm:mt-3 font-tamil-sans text-sm sm:text-base text-ink/75 leading-relaxed">
                {b.d}
              </div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
