import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import gopuram from "@/assets/18.jpeg";
import deityPhoto from "@/assets/2.jpeg";
import { Calendar, Star, Sparkles } from "lucide-react";

export const Route = createFileRoute("/temple-history")({
  head: () => ({
    meta: [
      { title: " ஆலய வரலாறு — Temple History" },
      {
        name: "description",
        content: "ஆலயத்தின் வரலாறு, சிறப்புகள் மற்றும் காலந்தோறும் நிகழ்ந்த முக்கிய நிகழ்வுகள்.",
      },
      { property: "og:title", content: "ஆலய வரலாறு — Temple History" },
      {
        property: "og:description",
        content: "The chronicled history, milestones, and legacy of the temple.",
      },
      { property: "og:image", content: gopuram },
    ],
  }),
  component: TempleHistory,
});

const timeline = [
  {
    year: "கி.பி. 2017",
    title: "தெய்வீக ஆணை",
    desc: "எம்பெருமான் முருகன் ஒரு தீவிர பக்தரின் கனவில் தோன்றி, இவ்விடத்தில் ஆலயம் அமைக்க வேண்டும் என ஆணையிட்டார். பர்வதமலை ஸ்ரீ மல்லிகார்ஜுன ஸ்தலத்தில் இருந்து வந்த அறிவிப்பின்படி கிராம மக்கள் ஒன்றிணைந்தனர்.",
    era: "Divine Vision",
  },
  {
    year: "கி.பி. 2017",
    title: "ஆலய கட்டுமானம் தொடங்கியது",
    desc: "கிராம பொதுமக்கள் மற்றும் அறுபடை வீடு முருக பக்தர்களின் ஒத்துழைப்போடு இனாம்காரியந்தல் கிராமத்தில் ஆலய கட்டுமானம் ஆரம்பமானது.",
    era: "Foundation",
  },
  {
    year: "கி.பி. 2019",
    title: "முழு ஆலயம் நிறைவு",
    desc: "இரண்டே வருடத்தில் சிறப்பாக முழு ஆலயமும் கட்டி முடிக்கப்பட்டது. சிவாச்சாரியார்கள் வருகை தந்து குடமுழுக்குக்கு ஏற்பாடுகள் செய்யப்பட்டன.",
    era: "Completion",
  },
  {
    year: "மே 2019",
    title: "மகா குடமுழுக்கு விழா",
    desc: "பல சிவாச்சாரியார்கள் முன்னிலையில் ஸ்ரீ வள்ளி தேவசேனா சமய சுப்ரமணியன் ஆலய குடமுழுக்கு மிகச் சிறப்பாகவும் பிரம்மாண்டமாகவும் நடைபெற்றது.",
    era: "Consecration",
  },
  {
    year: "தொடர்ச்சி",
    title: "மாதாந்திர கிருத்திகை",
    desc: "குடமுழுக்கு நடைபெற்ற நாளிலிருந்து மாதந்தோறும் சிறப்பு அபிஷேக அலங்கார ஆராதனை மற்றும் பொதுமக்களுக்கு அன்னதானம் வழங்கப்படுகிறது.",
    era: "Ongoing Legacy",
  },
];

const highlights = [
  { icon: Star, title: "மே 2019", desc: "குடமுழுக்கு நடைபெற்ற புனித நாள்" },
  { icon: Sparkles, title: "பரிகார தலம்", desc: "குழந்தை வரம் அளிக்கும் கோயில்" },
  { icon: Calendar, title: "மாதா கிருத்திகை", desc: "சிறப்பு அபிஷேக அலங்காரம் & அன்னதானம்" },
];

function TempleHistory() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <PageHero
        sectionNumber="2.1"
        eyebrow="Chapter · அத்தியாயம் ஒன்று"
        titleTamil="ஆலய வரலாறு"
        titleEn="Temple History"
        description="ஸ்ரீ வள்ளி தேவசேனா சமய சுப்ரமணியர் ஆலயத்தின் கதை — இனாம்காரியந்தல் கிராம மக்களின் நம்பிக்கையும் முருகனின் அருளும் இணைந்து உருவான புனித வரலாறு."
        image={gopuram}
      />

      {/* HIGHLIGHTS */}
      <section className="relative-z mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 pt-10 pb-8 sm:pt-12 sm:pb-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="group bg-card border border-brass/30 rounded-2xl p-5 sm:p-6 hover:shadow-brass transition-all"
            >
              <div className="h-11 w-11 rounded-xl bg-gradient-sunset flex items-center justify-center text-parchment shadow-soft">
                <h.icon size={20} />
              </div>
              <div className="mt-3 font-tamil text-2xl sm:text-3xl font-bold text-vermillion">
                {h.title}
              </div>
              <div className="mt-1 font-tamil-sans text-sm sm:text-base text-ink/70">{h.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ORIGIN STORY */}
      <section className="relative-z bg-gradient-parchment border-y border-brass/20 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
          <div className="ornament-divider mb-4">
            <span className="font-display italic tracking-[0.3em] text-xs sm:text-sm">
              ORIGIN · தோற்றம்
            </span>
          </div>
          <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-5xl font-bold text-ink mb-8">
            ஆலயம் தோன்ற காரணம்
          </h2>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-start">
            {/* Story text — wider column */}
            <article className="lg:col-span-3 font-tamil-sans text-base sm:text-lg text-ink/80 leading-[1.9] space-y-4">
              <p className="drop-cap">
                திருவண்ணாமலை மாவட்டம் இனாம்காரியந்தல் கிராம மக்கள் வழிபட நீண்ட ஆண்டு காலமாக முருகன்
                ஆலயம் இல்லாத காரணத்தால் அதே கிராமத்தைச் சேர்ந்த அறுபடை வீடு முருக பக்தர்கள் யாத்திரை
                குழு முன்வந்து பர்வதமலை ஸ்ரீ மல்லிகார்ஜுன ஸ்தலத்தில் இருந்து வந்த அறிவிப்பின்படி
                கிராம பொதுமக்கள் மற்றும் அறுபடை வீடு முருக பக்தர்கள் சார்பாக கிராமத்தில் ஆலயம்
                எழுப்ப முடிவெடுத்தனர்.
              </p>
              <p>
                கடந்த <strong className="text-vermillion">2017 ஆம் ஆண்டு</strong> எதிர்பாராத விதமாக
                எம்பெருமான் முருகனே ஒரு தீவிர பக்தரின் கனவில் வந்து இடம் அமைத்து இவ்விடத்தில் ஆலயம்
                அமைக்க வேண்டும் என்று ஆணையிட்டதாக கூறினார் என்று கிடைத்த தகவலின்படி அதே ஆண்டில்
                ஆலயம் அமைய ஆரம்பித்தது.
              </p>
              <p>
                அடுத்த இரண்டே வருடத்தில் சிறப்பாக முழு ஆலயத்தையும் கட்டி முடித்து கடந்த{" "}
                <strong className="text-vermillion">2019 ஆம் ஆண்டு மே மாதம்</strong> பல
                சிவாச்சாரியார்கள் முன்னிலையில் மிகச் சிறப்பாகவும் பிரம்மாண்டமாகவும்{" "}
                <strong className="text-vermillion">
                  ஸ்ரீ வள்ளி தேவசேனா சமய சுப்ரமணியன் ஆலய குடமுழுக்கு
                </strong>{" "}
                நடைபெற்றது.
              </p>

              {/* Inline highlight banner */}
              <div className="mt-2 rounded-xl border border-brass/30 bg-card p-4 sm:p-5 flex gap-4 items-start">
                <div className="text-3xl leading-none mt-1">🪔</div>
                <div>
                  <div className="font-tamil text-base sm:text-lg font-bold text-vermillion">
                    நினைத்தது நடக்கும் சிறப்பு தலம்
                  </div>
                  <div className="mt-1 font-tamil-sans text-sm text-ink/70 leading-relaxed">
                    ஆலயம் பரிகார ஸ்தலமாகவும் குழந்தை வரம் அளிக்கும் கோயிலாகவும் பக்தர்கள் மத்தியில்
                    சிறப்பு பெயரோடு விளங்குகிறது.
                  </div>
                </div>
              </div>
            </article>

            {/* Deity image — narrower column, two stacked cards */}
            <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-4">
              <div className="relative rounded-2xl overflow-hidden border-2 border-brass/40 shadow-temple aspect-[4/5] group">
                <img
                  src={deityPhoto}
                  alt="ஸ்ரீ வள்ளி தேவசேனா சமேத சுப்ரமணியர் — மூலவர்"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <div className="font-tamil text-parchment text-sm font-bold drop-shadow-lg">
                    மூலவர் — சுப்ரமணியர்
                  </div>
                  <div className="font-display italic text-brass text-[10px] sm:text-xs tracking-wider">
                    WITH VALLI & DEVASENA
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-brass/30 shadow-soft bg-gradient-sanctum p-4 sm:p-5 flex flex-col justify-between">
                <div className="font-display italic text-brass tracking-widest text-xs">
                  CONSECRATION
                </div>
                <div>
                  <div className="font-tamil text-parchment text-2xl sm:text-3xl font-bold mt-2">
                    மே 2019
                  </div>
                  <div className="font-tamil-sans text-parchment/75 text-sm mt-2 leading-relaxed">
                    குடமுழுக்கு — பல சிவாச்சாரியார்கள் முன்னிலையில் பிரம்மாண்டமாக நடைபெற்றது.
                  </div>
                </div>
                <div className="mt-3 text-2xl">🕉️</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN STORY */}
      <section className="relative-z mx-auto max-w-5xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div className="ornament-divider mb-4">
          <span className="font-display italic tracking-[0.3em] text-xs sm:text-sm">
            THE CHRONICLE
          </span>
        </div>
        <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-5xl font-bold text-ink mb-6">
          ஆலயத்தின் சிறப்புகள்
        </h2>
        <article className="font-tamil-sans text-base sm:text-lg text-ink/80 leading-[1.9] space-y-4">
          <p className="drop-cap">
            இந்த புனித ஆலயம் திருவண்ணாமலை மாவட்டம் இனாம்காரியந்தல் கிராமத்தில் 2017 ஆம் ஆண்டு
            தொடங்கி 2019 ஆம் ஆண்டு மே மாதம் குடமுழுக்கோடு திறந்து வைக்கப்பட்டது.
          </p>
          <p>
            அறுபடை வீடு முருக பக்தர்கள் மற்றும் கிராம பொதுமக்களின் ஒத்துழைப்போடு எழுப்பப்பட்ட
            இவ்வாலயம், <strong className="text-vermillion">பரிகார ஸ்தலமாகவும்</strong> குழந்தை வரம்
            அளிக்கும் கோயிலாகவும் பக்தர்கள் மத்தியில் சிறப்பாக விளங்குகிறது.
          </p>
          <p>
            குடமுழுக்கு நடைபெற்ற நாளிலிருந்து மாதாந்திர கிருத்திகையை தவறவிடாமல் எம்பெருமான்
            முருகனுக்கு சிறப்பு அபிஷேக அலங்கார ஆராதனை நடைபெறுகிறது. பொதுமக்களுக்கு{" "}
            <strong className="text-vermillion">அன்னதானமும்</strong> வழங்கப்படுகிறது.
          </p>
          <p>
            "நினைத்தது நடக்கும்" என்ற சிறப்பு பெயரோடு இந்த ஆலயம் இன்று வரை விளங்கி வருகிறது.
            தமிழ்நாட்டின் பல மூலைகளிலிருந்தும் பக்தர்கள் இங்கு வந்து முருகனின் அருளைப் பெறுகின்றனர்.
          </p>
        </article>
      </section>

      {/* TIMELINE */}
      <section className="relative-z bg-gradient-parchment py-10 sm:py-14 border-y border-brass/20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
          <div className="ornament-divider mb-4">
            <span className="font-display italic tracking-[0.3em] text-xs sm:text-sm">
              TIMELINE · காலவரிசை
            </span>
          </div>
          <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-5xl font-bold text-ink">
            முக்கிய நிகழ்வுகள்
          </h2>

          <div className="mt-8 sm:mt-12 relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brass to-transparent hidden md:block" />
            <div className="space-y-7 sm:space-y-9">
              {timeline.map((t, i) => (
                <div
                  key={t.year + t.title}
                  className={`md:grid md:grid-cols-2 md:gap-8 lg:gap-12 items-center ${
                    i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <div className={`${i % 2 === 0 ? "md:text-right" : ""}`}>
                    <div className="font-display italic text-brass-deep tracking-widest text-xs">
                      {t.era}
                    </div>
                    <div className="font-tamil text-2xl sm:text-3xl font-bold text-vermillion mt-1">
                      {t.year}
                    </div>
                  </div>
                  <div className="relative mt-2 md:mt-0">
                    <div className="hidden md:block absolute -left-[2.4rem] lg:-left-[3.4rem] top-3 h-4 w-4 rounded-full bg-gradient-sunset shadow-brass border-2 border-parchment" />
                    <div className="bg-card border border-brass/30 rounded-xl p-4 sm:p-5 shadow-soft">
                      <div className="font-tamil text-lg sm:text-xl font-bold text-ink">
                        {t.title}
                      </div>
                      <div className="mt-1.5 font-tamil-sans text-sm sm:text-base text-ink/75 leading-relaxed">
                        {t.desc}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING QUOTE */}
      <section className="relative-z mx-auto max-w-4xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14 text-center">
        <div className="font-display italic text-brass text-5xl sm:text-6xl leading-none">"</div>
        <blockquote className="font-tamil text-xl sm:text-2xl md:text-3xl text-ink leading-relaxed">
          முருகனின் திருவருள் பெற்ற இந்த தலம் — பக்தர்களின் இதயங்களில் என்றும் ஒளிர்கிறது.
        </blockquote>
        <div className="mt-4 font-display italic text-sm sm:text-base text-brass-deep">
          — ஆலய நிறுவனர்கள்
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
