import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { useContent, useImage, useImageOverride } from "@/lib/content-store";
import gourami from "@/assets/temple-gopuram.jpg";
import deepam from "@/assets/temple-deepam.jpg";
import manuscript from "@/assets/temple-manuscript.jpg";
import carvings from "@/assets/m15.jpeg";
import pooja from "@/assets/m16.jpeg";
import festival from "@/assets/m14.jpeg";
import priest from "@/assets/achakar1.png";
import donation from "@/assets/Donation.jpg";
import kolam from "@/assets/kolam-ornament.png";
import navCalendar from "@/assets/Murugan-3.jpeg";
import muruganDeity from "@/assets/m12.jpeg";
import muruganVel from "@/assets/murugan-vel.png";
import deityGanesha from "@/assets/5.jpeg";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ஸ்ரீ முருகன் ஆலயம் — Sri Muruga Sacred Temple" },
      {
        name: "description",
        content:
          "ஸ்ரீ முருகன் கோவில் வரலாறு, ஸ்தல புராணம், விழாக்கள், தினசரி பூஜை மற்றும் தான வசதிகள்.",
      },
      { property: "og:title", content: "ஸ்ரீ முருகன் ஆலயம் — Sri Muruga Temple" },
      {
        property: "og:description",
        content:
          "Discover Lord Murugan's sacred temple — history, sthala puranam, festivals, panchangam and donations.",
      },
    ],
  }),
  component: Index,
});

const sections = [
  {
    to: "/temple-history",
    tamil: "கோவில் வரலாறு",
    en: "Temple History",
    desc: "சிறப்புகள், முக்கிய நிகழ்வுகள் மற்றும் காலப்பதிவுகள்",
    image: gopuram,
  },
  {
    to: "/sthala-puranam",
    tamil: "ஸ்தல புராணம்",
    en: "Sthala Puranam",
    desc: "ஆன்மீக முக்கியத்துவம், புராணக் கதைகள்",
    image: manuscript,
  },
  {
    to: "/temple-structure",
    tamil: "ஆலய அமைப்பு",
    en: "Temple Structure",
    desc: "கோபுரம், மண்டபம், சன்னதி விவரங்கள்",
    image: carvings,
  },
  {
    to: "/deities",
    tamil: "முக்கிய தெய்வங்கள்",
    en: "Main Deities",
    desc: "கணேஷர், முருகன், அம்மன், சிவன், விஷ்ணு",
    image: deityGanesha,
  },
  {
    to: "/events",
    tamil: "நிகழ்ச்சிகள்",
    en: "Events",
    desc: "தினசரி பூஜை, சிறப்பு நிகழ்வுகள், அறிவிப்புகள்",
    image: pooja,
  },
  {
    to: "/festivals",
    tamil: "விழாக்கள்",
    en: "Festivals",
    desc: "வரவிருக்கும் விழாக்கள், தரிசன வேளைகள்",
    image: festival,
  },
  {
    to: "/calendar",
    tamil: "தமிழ் நாட்காட்டி",
    en: "Calendar",
    desc: "திதி, நட்சத்திரம் மற்றும் பஞ்சாங்கம்",
    image: navCalendar,
  },
  {
    to: "/priest",
    tamil: "அர்ச்சகர் & நிர்வாகம்",
    en: "Priest & Management",
    desc: "அர்ச்சகர் விவரம், தொடர்பு, நிர்வாகம்",
    image: priest,
  },
  {
    to: "/donate",
    tamil: "ஆன்லைன் தானம்",
    en: "Online Donation",
    desc: "UPI / QR மூலம் பாதுகாப்பான தானம்",
    image: donation,
  },
];

function Index() {
  const { content } = useContent();
  const home = content.home;
  const heroDeitySrc = useImage("homeHeroDeity", muruganDeity);
  const cardOverrides = content.images?.homeCards || {};
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* HERO */}
      <section className="relative-z overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={deepam} alt="" aria-hidden className="h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-parchment via-parchment/70 to-parchment" />
        </div>
        <img
          src={kolam}
          alt=""
          aria-hidden
          className="absolute right-0 top-10 w-[40rem] opacity-20 animate-spin-slow pointer-events-none"
        />

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 pt-12 sm:pt-16 lg:pt-24 pb-16 sm:pb-24 lg:pb-32 grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7">
              <h1 className="mt-4 sm:mt-5 font-tamil text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-ink leading-[1.1]">
              {home.heroTamilLine1}
              <br />
              <span className="text-vermillion">{home.heroTamilLine2}</span>
            </h1>
            <p className="mt-2 font-display italic text-base sm:text-lg lg:text-xl text-brass-deep">
              {home.heroEnTagline}
            </p>
            <p className="mt-6 sm:mt-8 max-w-xl font-tamil-sans text-base sm:text-lg text-ink/75 leading-relaxed">
              {home.heroDescription}
            </p>
            <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/temple-history"
                className="group inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-4 rounded-full bg-gradient-sunset text-parchment font-tamil font-semibold text-sm sm:text-base shadow-brass hover:shadow-temple transition-all"
              >
                {home.primaryCta}
                <ArrowUpRight
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  size={18}
                />
              </Link>
              <Link
                to="/calendar"
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-4 rounded-full border-2 border-brass-deep text-ink font-tamil font-semibold text-sm sm:text-base hover:bg-brass/10 transition-all"
              >
                {home.secondaryCta}
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative animate-float-slow max-w-sm mx-auto lg:max-w-[26rem] w-full">
            <div className="absolute -inset-8 bg-gradient-sunset rounded-full blur-3xl opacity-40" />
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-temple border-2 border-brass/40">
              <img
                src={heroDeitySrc}
                alt="ஸ்ரீ முருகன் சுவாமி"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 bg-gradient-to-t from-ink to-transparent">
                <div className="font-display italic text-brass text-xs sm:text-sm tracking-widest">
                  {home.deityCaptionEn}
                </div>
                <div className="font-tamil text-parchment text-xl sm:text-2xl font-bold mt-1">
                  {home.deityCaptionTamil}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTIONS GRID */}
      <section className="relative-z mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 py-14 sm:py-20">
        <div className="ornament-divider mb-6">
          <span className="font-display italic text-xs sm:text-sm tracking-[0.3em]">
            {home.chaptersEyebrow}
          </span>
        </div>
        <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-5xl font-bold text-ink max-w-3xl mx-auto leading-tight">
          {home.chaptersTitle}
        </h2>
        <p className="text-center mt-3 sm:mt-4 font-display italic text-lg sm:text-xl text-brass-deep">
          {home.chaptersSubtitle}
        </p>

        <div className="mt-10 sm:mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sections.map((s, i) => (
            <Link
              key={s.to}
              to={s.to}
              className={`group relative overflow-hidden rounded-2xl border border-brass/30 bg-card hover:shadow-temple transition-all duration-500 ${i % 3 === 1 ? "lg:translate-y-8" : ""}`}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={cardOverrides[s.to.replace(/^\//, "")] || s.image}
                  alt={s.en}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
              </div>
              <div className="absolute top-5 right-5 flex items-start justify-end">
                <span className="h-10 w-10 rounded-full bg-parchment/95 flex items-center justify-center text-vermillion group-hover:bg-vermillion group-hover:text-parchment transition-colors">
                  <ArrowUpRight size={18} />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <div className="font-display italic text-brass text-xs sm:text-sm tracking-widest">
                  {s.en.toUpperCase()}
                </div>
                <div className="font-tamil text-2xl sm:text-3xl text-parchment font-bold mt-1">
                  {s.tamil}
                </div>
                <p className="mt-2 font-tamil-sans text-parchment/75 text-xs sm:text-sm">
                  {s.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
