import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import manuscript from "@/assets/temple-manuscript.jpg";
import kolam from "@/assets/kolam-ornament.png";
import templeNight from "@/assets/m12.jpeg";
import { Flame, Heart, Moon } from "lucide-react";

export const Route = createFileRoute("/sthala-puranam")({
  head: () => ({
    meta: [
      { title: "ஸ்தல புராணம் — Sthala Puranam" },
      {
        name: "description",
        content: "ஆலயத்தின் ஆன்மீக முக்கியத்துவம், புராணக் கதைகள் மற்றும் தெய்வத்தின் சிறப்புகள்.",
      },
      { property: "og:title", content: "ஸ்தல புராணம் — Sthala Puranam" },
      {
        property: "og:description",
        content: "The sacred lore, mythological stories, and divine significance of the temple.",
      },
      { property: "og:image", content: manuscript },
    ],
  }),
  component: SthalaPuranam,
});

const significance = [
  {
    icon: Flame,
    label: "பரிகார தலம்",
    value: "சக்தி தலம்",
    desc: "அனைத்து பரிகாரங்களும் நிறைவேறும் ஆலயம்",
  },
  {
    icon: Heart,
    label: "குழந்தை வரம்",
    value: "வரம் அளிப்பவர்",
    desc: "குழந்தை வரம் அளிக்கும் கோயிலாக பேர் பெற்றது",
  },
  {
    icon: Moon,
    label: "மாதா கிருத்திகை",
    value: "சிறப்பு பூஜை",
    desc: "தவறாது நடைபெறும் மாதாந்திர விழா",
  },
];

const stories = [
  {
    num: "I",
    title: "தோற்றக் கதை",
    en: "The Origin",
    body: "ஒரு காலத்தில் இந்த இடத்தில் அடர்ந்த காடு இருந்தது. ஒரு முனிவர் இங்கு தவம் செய்தபோது, தெய்வம் சுயம்புவாக தோன்றியதாக ஐதீகம்.",
  },
  {
    num: "II",
    title: "பசுவின் அற்புதம்",
    en: "The Sacred Cow",
    body: "ஒரு பசு தினமும் ஒரு குறிப்பிட்ட இடத்தில் தனது பாலை சொரியும் காட்சியை கண்ட இடைய சிறுவன், தோண்டிப் பார்த்தபோது சுயம்பு லிங்கம் வெளிப்பட்டது.",
  },
  {
    num: "III",
    title: "மன்னனின் கனவு",
    en: "The King's Vision",
    body: "சோழ மன்னருக்கு கனவில் தெய்வம் தோன்றி, இந்த தலத்தில் ஆலயம் கட்டுமாறு கட்டளையிட்டதாக வரலாறு கூறுகிறது.",
  },
];

function SthalaPuranam() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <PageHero
        sectionNumber="2.2"
        eyebrow="Chapter · அத்தியாயம் இரண்டு"
        titleTamil="ஸ்தல புராணம்"
        titleEn="Sthala Puranam"
        description="ஓலைச் சுவடிகளில் பதிக்கப்பட்ட, தலைமுறை தலைமுறையாக சொல்லப்பட்டு வரும் இந்த தலத்தின் தெய்வீக கதைகள் — காலத்தைக் கடந்த சத்தியங்கள்."
        image={manuscript}
      />

      {/* SIGNIFICANCE CARDS */}
      <section className="relative-z mx-auto max-w-7xl px-5 sm:px-6 lg:px-10 pt-10 pb-8 sm:pt-12 sm:pb-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {significance.map((s) => (
            <div
              key={s.label}
              className="relative bg-gradient-sanctum text-parchment rounded-2xl p-6 sm:p-7 overflow-hidden group"
            >
              <img
                src={kolam}
                alt=""
                aria-hidden
                className="absolute -right-10 -top-10 w-44 opacity-15 group-hover:rotate-90 transition-transform duration-1000"
              />
              <div className="font-display italic text-brass tracking-widest text-xs">
                {s.label.toUpperCase()}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <s.icon className="text-brass animate-flicker" size={24} />
                <div className="font-tamil text-2xl sm:text-3xl font-bold">{s.value}</div>
              </div>
              <div className="mt-2 font-tamil-sans text-sm sm:text-base text-parchment/75">
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STHALA SPECIALITY — night temple image + text */}
      <section className="relative-z bg-gradient-parchment border-y border-brass/20 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
          <div className="ornament-divider mb-4">
            <span className="font-display italic tracking-[0.3em] text-xs sm:text-sm">
              SPECIALITY · சிறப்பு
            </span>
          </div>
          <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-5xl font-bold text-ink mb-8">
            ஸ்தலத்தின் சிறப்பு
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
            {/* Temple Night Image */}
            <div className="relative w-full">
              <div className="absolute -inset-3 bg-gradient-sunset rounded-3xl blur-3xl opacity-20 pointer-events-none" />
              <div className="relative rounded-3xl overflow-hidden border-2 border-brass/40 shadow-temple aspect-[4/3]">
                <img
                  src={templeNight}
                  alt="ஸ்ரீ வள்ளி தேவசேனா சமய சுப்ரமணியர் ஆலயம் — இரவு அலங்காரம்"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <div className="font-display italic text-brass text-xs tracking-widest">
                    TEMPLE BY NIGHT · இரவு காட்சி
                  </div>
                  <div className="font-tamil text-parchment text-base sm:text-xl font-bold mt-0.5">
                    இனாம்காரியந்தல் ஆலயம்
                  </div>
                </div>
              </div>
              {/* Location badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-parchment border border-brass/40 rounded-full px-4 py-1.5 shadow-soft whitespace-nowrap">
                <span className="font-display italic text-brass-deep tracking-widest text-[10px]">
                  TIRUVANNAMALAI DISTRICT
                </span>
                <span className="ml-2 font-tamil text-vermillion font-bold text-xs">
                  திருவண்ணாமலை
                </span>
              </div>
            </div>

            {/* Speciality Text */}
            <div className="mt-6 lg:mt-0">
              <span className="tamil-chip">தெய்வத்தின் அருள்</span>
              <h3 className="mt-4 font-tamil text-2xl sm:text-3xl lg:text-4xl font-bold text-ink leading-snug">
                நினைத்தது நடக்கும் <span className="text-vermillion">சிறப்பு தலம்</span>
              </h3>
              <article className="mt-4 font-tamil-sans text-base sm:text-lg text-ink/80 leading-[1.9] space-y-3">
                <p>
                  <strong className="text-vermillion">
                    ஸ்ரீ வள்ளி தேவசேனா சமய சுப்ரமணியர் ஆலயம்
                  </strong>{" "}
                  பரிகார ஸ்தலமாகவும் குழந்தை வரம் அளிக்கும் கோயிலாகவும் எம்பெருமான் முருகன் அருளால்
                  "நினைத்தது நடக்கும்" என்ற சிறப்பு பெயரோடு இன்று வரை சிறப்பாக விளங்குகிறது.
                </p>
                <p>
                  அதுமட்டுமின்றி ஆலயம் குடமுழுக்கு நடைபெற்ற நாளிலிருந்து மாதாந்திர கிருத்திகையை
                  தவறவிடாமல் எம்பெருமான் முருகனுக்கு{" "}
                  <strong className="text-ink">சிறப்பு அபிஷேக அலங்கார ஆராதனை</strong> மற்றும்
                  பொதுமக்களுக்கு <strong className="text-ink">அன்னதானம்</strong> வழங்கப்படுகிறது.
                </p>
              </article>
              <ul className="mt-4 space-y-2.5">
                {[
                  "பரிகார ஸ்தலமாக பேர் பெற்றது",
                  "குழந்தை வரம் அளிக்கும் கோயில்",
                  "மாதாந்திர கிருத்திகை சிறப்பு பூஜை",
                  "பொதுமக்களுக்கு அன்னதானம்",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-center gap-3 font-tamil-sans text-sm sm:text-base text-ink/80"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-vermillion shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PURANIC STORIES */}
      <section className="relative-z py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-10">
          <div className="ornament-divider mb-4">
            <span className="font-display italic tracking-[0.3em] text-xs sm:text-sm">
              PURANIC TALES · புராணக் கதைகள்
            </span>
          </div>
          <h2 className="text-center font-tamil text-3xl sm:text-4xl md:text-5xl font-bold text-ink">
            மூன்று புராணக் கதைகள்
          </h2>

          <div className="mt-8 sm:mt-12 space-y-5">
            {stories.map((s) => (
              <article
                key={s.num}
                className="group relative bg-card border border-brass/30 rounded-2xl p-6 sm:p-8 lg:p-10 hover:shadow-brass transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 font-display italic text-[6rem] sm:text-[8rem] lg:text-[10rem] leading-none text-brass/10 select-none -mt-4 mr-2">
                  {s.num}
                </div>
                <div className="relative grid md:grid-cols-12 gap-4 sm:gap-6 items-start">
                  <div className="md:col-span-3">
                    <div className="font-display italic text-brass-deep tracking-widest text-xs">
                      TALE {s.num}
                    </div>
                    <div className="mt-1.5 font-tamil text-2xl sm:text-3xl font-bold text-vermillion leading-tight">
                      {s.title}
                    </div>
                    <div className="font-display italic text-brass-deep mt-1 text-sm">{s.en}</div>
                  </div>
                  <div className="md:col-span-9 font-tamil-sans text-base sm:text-lg text-ink/80 leading-[1.9]">
                    {s.body}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* DEITY FEATURE */}
      <section className="relative-z bg-gradient-parchment border-y border-brass/20 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <span className="tamil-chip">தெய்வத்தின் சிறப்பு</span>
              <h2 className="mt-4 font-tamil text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-tight">
                அருள் பொழியும்
                <br />
                <span className="text-vermillion">இறைவன்</span>
              </h2>
              <p className="mt-4 font-tamil-sans text-base sm:text-lg text-ink/80 leading-relaxed">
                இங்குள்ள மூலவர், பக்தர்களின் வேண்டுதல்களை நிறைவேற்றும் கருணை நிறைந்த தெய்வமாக
                போற்றப்படுகிறார். இந்த தலத்தின் தெய்வத்திற்கு சிறப்பு அபிஷேகங்கள் தினமும்
                நிகழ்த்தப்படுகின்றன.
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  "வள்ளி தேவசேனா சமேத சுப்ரமணியர்",
                  "சக்தி வேல் ஏந்தியவர்",
                  "திருமணப் பிரார்த்தனை நிறைவேற்றுபவர்",
                  "குழந்தை வரம் அளிக்கும் தெய்வம்",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-center gap-3 font-tamil-sans text-sm sm:text-base text-ink/80"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-vermillion shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative max-w-md mx-auto lg:max-w-none w-full">
              <div className="absolute -inset-4 bg-gradient-sunset rounded-full blur-3xl opacity-25" />
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border-2 border-brass/40 shadow-temple">
                <img
                  src={templeNight}
                  alt="ஆலயம் — இரவு காட்சி"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-parchment border border-brass/40 rounded-full px-5 py-2 shadow-soft whitespace-nowrap">
                <span className="font-display italic text-brass-deep tracking-widest text-xs">
                  MOOLAVAR
                </span>
                <span className="ml-2 font-tamil text-vermillion font-bold text-sm">
                  மூலவர் சன்னதி
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING QUOTE */}
      <section className="relative-z mx-auto max-w-4xl px-5 sm:px-6 lg:px-10 py-10 sm:py-14 text-center">
        <div className="font-display italic text-brass text-5xl sm:text-6xl leading-none">"</div>
        <blockquote className="font-tamil text-xl sm:text-2xl md:text-3xl lg:text-4xl text-ink leading-relaxed">
          இறையருள் இல்லாத இடம் இல்லை, ஆனால் சில தலங்களில் அவ்வருள் கங்கையாய் பெருகி வழிகிறது.
        </blockquote>
        <div className="mt-4 font-display italic text-sm sm:text-base text-brass-deep">
          — பண்டைய சுவடி
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
