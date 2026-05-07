import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import pooja from "@/assets/2.jpeg";
import festival from "@/assets/temple-festival.jpg";
import murugan from "@/assets/Murugan-1.jpeg";
import video1 from "@/assets/video2.mp4";
import { Clock, Calendar, Sparkles, Bell, Flame, Star } from "lucide-react";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "நிகழ்ச்சிகள் & சேவைகள் — Events & Activities" },
      {
        name: "description",
        content: "தினசரி பூஜை விவரங்கள், சிறப்பு நிகழ்வுகள் மற்றும் விழா அறிவிப்புகள்.",
      },
      { property: "og:title", content: "Temple Events & Activities" },
      {
        property: "og:description",
        content: "Daily pooja, special events, and festival announcements.",
      },
    ],
  }),
  component: EventsPage,
});

const dailyPooja = [
  { time: "5:30 AM", tamil: "உஷத்காலம்", en: "Ushatkalam", desc: "சுப்ரபாதம் & விழிப்பூட்டுதல்" },
  { time: "7:00 AM", tamil: "காலசந்தி", en: "Kalasanthi", desc: "காலை அபிஷேகம் & அலங்காரம்" },
];

const announcements = [
  "மே 15 அன்று காலை 6:00 மணிக்கு சிறப்பு கங்காபிஷேகம் நடைபெறும்.",
  "ஆடி மாத பௌர்ணமி அன்று 1008 சங்காபிஷேகம் ஏற்பாடு செய்யப்பட்டுள்ளது.",
  "புதிய ஆன்லைன் டிக்கெட் முறை விரைவில் அறிமுகப்படுத்தப்படும்.",
];

const rituals = [
  {
    tamil: "அபிஷேகம்",
    en: "Abhishekam",
    desc: "மூலவருக்கு பால், தயிர், தேன், சந்தனம் ஆகியவற்றால் நீராட்டு.",
  },
  { tamil: "அர்ச்சனை", en: "Archana", desc: "108 / 1008 நாமங்களால் தெய்வத்தை அழைத்து வழிபடல் @7:00 AM." },
];

function EventsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <PageHero
        slug="events"
        eyebrow="Events · சேவைகள்"
        titleTamil="நிகழ்ச்சிகள் & சேவைகள்"
        titleEn="Daily Worship · Special Events"
        description="தினசரி பூஜை வேளைகள், சிறப்பு நிகழ்வுகள் மற்றும் வரவிருக்கும் விழா அறிவிப்புகளை இங்கே காணலாம்."
        image={pooja}
      />

      {/* Daily Pooja */}
      <section className="relative-z mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-10 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div>
          <div className="ornament-divider mb-6">
            <span className="font-display italic text-xs sm:text-sm tracking-[0.3em]">
              DAILY POOJA · தினசரி பூஜை
            </span>
          </div>
          <h2 className="font-tamil text-3xl sm:text-4xl md:text-5xl font-bold text-ink">
            பூஜை வேளைகள்
          </h2>

          <div className="mt-10 sm:mt-14 relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brass to-transparent" />
            <ol className="space-y-6 sm:space-y-10">
              {dailyPooja.map((p, i) => (
                <li
                  key={p.en}
                  className={`relative grid sm:grid-cols-2 gap-4 sm:gap-10 ${i % 2 === 0 ? "" : "sm:[&>:first-child]:order-2"}`}
                >
                  <div
                    className={`pl-12 sm:pl-0 ${i % 2 === 0 ? "sm:text-right sm:pr-10" : "sm:pl-10"}`}
                  >
                    <div className="font-display italic text-brass-deep text-sm tracking-widest">
                      {p.en}
                    </div>
                    <div className="font-tamil text-2xl sm:text-3xl text-ink font-bold">
                      {p.tamil}
                    </div>
                    <p className="mt-1 font-tamil-sans text-ink/70 text-sm">{p.desc}</p>
                  </div>
                  <div
                    className={`pl-12 sm:pl-0 ${i % 2 === 0 ? "sm:pl-10" : "sm:text-right sm:pr-10"}`}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vermillion text-parchment font-semibold shadow-brass">
                      <Clock size={16} /> {p.time}
                    </div>
                  </div>
                  <span className="absolute left-2 sm:left-1/2 top-2 -translate-x-1/2 h-4 w-4 rounded-full bg-gradient-sunset border-2 border-parchment shadow-brass" />
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-temple border border-brass/30">
          <video src={video1} className="h-full w-full object-cover" controls autoPlay muted loop />
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
