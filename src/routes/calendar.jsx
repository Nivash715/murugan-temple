import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import navCalendar from "@/assets/Murugan-3.jpeg";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Sun,
  Moon,
  Sparkles,
  Sunrise,
  Sunset,
  AlertTriangle,
  Flame,
  StickyNote,
} from "lucide-react";
import muruganVel from "@/assets/murugan-vel.png";
import { useContent, toLocalDateKey } from "@/lib/content-store";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "தமிழ் நாட்காட்டி — Tamil Calendar | ஸ்ரீ ஆலயம்" },
      {
        name: "description",
        content:
          "தமிழ் மாதங்கள், திதி, நட்சத்திரம், விழாக்கள் மற்றும் சுப தினங்கள் கொண்ட தமிழ் நாட்காட்டி.",
      },
    ],
  }),
  component: CalendarPage,
});

const tamilMonths = [
  { ta: "சித்திரை", en: "Chithirai", range: "Apr–May" },
  { ta: "வைகாசி", en: "Vaikasi", range: "May–Jun" },
  { ta: "ஆனி", en: "Aani", range: "Jun–Jul" },
  { ta: "ஆடி", en: "Aadi", range: "Jul–Aug" },
  { ta: "ஆவணி", en: "Aavani", range: "Aug–Sep" },
  { ta: "புரட்டாசி", en: "Purattasi", range: "Sep–Oct" },
  { ta: "ஐப்பசி", en: "Aippasi", range: "Oct–Nov" },
  { ta: "கார்த்திகை", en: "Karthigai", range: "Nov–Dec" },
  { ta: "மார்கழி", en: "Margazhi", range: "Dec–Jan" },
  { ta: "தை", en: "Thai", range: "Jan–Feb" },
  { ta: "மாசி", en: "Maasi", range: "Feb–Mar" },
  { ta: "பங்குனி", en: "Panguni", range: "Mar–Apr" },
];

const nakshatras = [
  "அஸ்வினி",
  "பரணி",
  "கார்த்திகை",
  "ரோகிணி",
  "மிருகசீரிடம்",
  "திருவாதிரை",
  "புனர்பூசம்",
  "பூசம்",
  "ஆயில்யம்",
  "மகம்",
  "பூரம்",
  "உத்திரம்",
  "ஹஸ்தம்",
  "சித்திரை",
  "சுவாதி",
  "விசாகம்",
  "அனுஷம்",
  "கேட்டை",
  "மூலம்",
  "பூராடம்",
  "உத்திராடம்",
  "திருவோணம்",
  "அவிட்டம்",
  "சதயம்",
  "பூரட்டாதி",
  "உத்திரட்டாதி",
  "ரேவதி",
];

const tithis = [
  "பிரதமை",
  "துவிதியை",
  "திருதியை",
  "சதுர்த்தி",
  "பஞ்சமி",
  "சஷ்டி",
  "சப்தமி",
  "அஷ்டமி",
  "நவமி",
  "தசமி",
  "ஏகாதசி",
  "துவாதசி",
  "திரயோதசி",
  "சதுர்தசி",
  ":பௌர்ணமி/அமாவாசை",
];

const weekdaysTa = ["ஞாயி", "திங்", "செவ்", "புத", "வியா", "வெள்", "சனி"];

const festivalMap = {
  "1-14": { ta: "தைப்பொங்கல்", en: "Thai Pongal" },
  "1-15": { ta: "மாட்டுப்பொங்கல்", en: "Mattu Pongal" },
  "1-26": { ta: "தைப்பூசம் ★ முருகன்", en: "Thaipusam (Murugan)" },
  "2-26": { ta: "மகா சிவராத்திரி", en: "Maha Shivaratri" },
  "5-4": { ta: "சீதை விரதம்", en: "Sita Vratham" },
  "4-14": { ta: "தமிழ் புத்தாண்டு", en: "Tamil New Year" },
  "5-12": { ta: "வைகாசி சதுர்த்தி", en: "Vaikasi Sathurthi" },
  "5-13": { ta: "வைகாசி விசாகம் ★ முருகன்", en: "Vaikasi Visakam (Murugan)" },
  "5-29": { ta: "ஆடி வெள்ளி", en: "Aadi Velli" },
  "6-3": { ta: "ஆடி அமாவாசை", en: "Aadi Amavasai" },
  "6-14": { ta: "ஆனி திருவிழா", en: "Aani Thiruvizha" },
  "6-20": { ta: "ஆனி கிருஷ்ண ஜெயந்தி", en: "Aani Krishna Jayanthi" },
  "6-18": { ta: "ஆனி உத்திரம்", en: "Aani Uthiram" },
  "7-27": { ta: "ஆவணி அமாவாசை", en: "Aavani Amavasai" },
  "8-3": { ta: "ஆவணி உத்திரம்", en: "Aavani Uthiram" },
  "8-14": { ta: "ஆவணி திருவிழா", en: "Aavani Thiruvizha" },
  "8-15": { ta: "கிருஷ்ண ஜெயந்தி", en: "Krishna Jayanthi" },
  "8-27": { ta: "விநாயக சதுர்த்தி", en: "Vinayaka Chaturthi" },
  "9-19": { ta: "புரட்டாசி சனிக்கிழமை", en: "Purattasi Saturdays" },
  "9-29": { ta: "ஐப்பசி அமாவாசை", en: "Aippasi Amavasai" },
  "9-31": { ta: "ஐப்பசி உத்திரம்", en: "Aippasi Uthiram" },
  "10-1": { ta: "ஐப்பசி திருவிழா", en: "Aippasi Thiruvizha" },
  "10-2": { ta: "ஐப்பசி கந்த சஷ்டி", en: "Aippasi Skanda Sashti" },
  "10-5": { ta: "ஐப்பசி விநாயகர் சதுர்த்தி", en: "Aippasi Vinayaka Chaturthi" },
  "10-20": { ta: "தீபாவளி", en: "Deepavali" },
  "10-29": { ta: "கந்த சஷ்டி ★ முருகன்", en: "Skanda Sashti (Murugan)" },
  "11-1": { ta: "கார்த்திகை திருவிழா", en: "Karthigai Thiruvizha" },
  "11-5": { ta: "கார்த்திகை சதுர்த்தி", en: "Karthigai Chaturthi" },
  "11-13": { ta: "கார்த்திகை தீபம் ★ முருகன்", en: "Karthigai Deepam (Murugan)" },
  "11-27": { ta: "கார்த்திகை அமாவாசை", en: "Karthigai Amavasai" },
  "12-1": { ta: "மார்கழி உத்திரம்", en: "Margazhi Uthiram" },
  "12-10": { ta: "மார்கழி திருவிழா", en: "Margazhi Thiruvizha" },
  "12-15": { ta: "மார்கழி திருவாதிரை", en: "Margazhi Thiruvadhirai" },
  "12-26": { ta: "மார்கழி அமாவாசை", en: "Margazhi Amavasai" },
  "1-16": { ta: "மாட்டுப்பொங்கல்", en: "Mattu Pongal" },
  "1-17": { ta: "கனும பொங்கல்", en: "Kanum Pongal" },
  "1-26": { ta: "தைப்பூசம் ★ முருகன்", en: "Thaipusam (Murugan)" },
  "1-27": { ta: "தைப்பூசம் அடுத்த நாள்", en: "Day after Thaipusam" },
  "2-5": { ta: "மகா சிவராத்திரி", en: "Maha Shivaratri" },
  "2-19": { ta: "மாசி மகம் ★ முருகன்", en: "Maasi Magam (Murugan)" },
  "2-20": { ta: "மாசி அமாவாசை", en: "Maasi Amavasai" },
  "2-21": { ta: "மாசி உத்திரம்", en: "Maasi Uthiram" },
  "2-29": { ta: "மாசி திருவிழா", en: "Maasi Thiruvizha" },
  "3-8": { ta: "பங்குனி அமாவாசை", en: "Panguni Amavasai" },
  "3-10": { ta: "பங்குனி உத்திரம்", en: "Panguni Uthiram" },
  "3-20": { ta: "பங்குனி திருவிழா", en: "Panguni Thiruvizha" },
  "3-28": { ta: "பங்குனி பூரம் ★ முருகன்", en: "Panguni Puram (Murugan)" },
  "4-14": { ta: "தமிழ் புத்தாண்டு", en: "Tamil New Year" },
};

function getTamilMonthIndex(d) {
  // Approximation: Tamil month transitions roughly mid-month (~14th)
  const m = d.getMonth(); // 0=Jan
  const day = d.getDate();
  // Thai starts ~Jan 14
  const startDays = [14, 13, 14, 14, 14, 15, 16, 17, 17, 17, 16, 15];
  const tamilStart = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8]; // index into tamilMonths
  return day >= startDays[m] ? tamilStart[m] : tamilStart[(m + 11) % 12];
}

// Rahu Kalam & Yamagandam typically vary by weekday (1.5 hour windows from sunrise)
const rahuKalamByWeekday = [
  "4:30 PM – 6:00 PM", // Sun
  "7:30 AM – 9:00 AM", // Mon
  "3:00 PM – 4:30 PM", // Tue
  "12:00 PM – 1:30 PM", // Wed
  "1:30 PM – 3:00 PM", // Thu
  "10:30 AM – 12:00 PM", // Fri
  "9:00 AM – 10:30 AM", // Sat
];
const yamagandamByWeekday = [
  "12:00 PM – 1:30 PM",
  "10:30 AM – 12:00 PM",
  "9:00 AM – 10:30 AM",
  "7:30 AM – 9:00 AM",
  "6:00 AM – 7:30 AM",
  "3:00 PM – 4:30 PM",
  "1:30 PM – 3:00 PM",
];
const gulikaiByWeekday = [
  "3:00 PM – 4:30 PM",
  "1:30 PM – 3:00 PM",
  "12:00 PM – 1:30 PM",
  "10:30 AM – 12:00 PM",
  "9:00 AM – 10:30 AM",
  "7:30 AM – 9:00 AM",
  "6:00 AM – 7:30 AM",
];
const muruganDayByWeekday = {
  2: "செவ்வாய் — முருகனுக்கு உகந்த நாள்", // Tuesday
  5: "வெள்ளி — வேலனுக்கு சிறப்பு வழிபாடு", // Friday
  0: null,
  1: null,
  3: null,
  4: null,
  6: null,
};

function computeDayInfo(date) {
  const d = date.getDate();
  const m = date.getMonth();
  const wd = date.getDay();
  const tithi = tithis[d % tithis.length];
  const nakshatra = nakshatras[(d + m) % nakshatras.length];
  const tamilMonth = tamilMonths[getTamilMonthIndex(date)];
  const fest = festivalMap[`${m + 1}-${d}`];
  const weekday = ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"][wd];
  const yoga = ["சுபம்", "சித்தம்", "சாத்தியம்", "சுபதினம்", "அமிர்தம்"][d % 5];
  const karana = ["பவ", "பாலவ", "கௌலவ", "தைதுல", "கரஜ", "வணிஜ", "விஷ்டி"][d % 7];
  const isAuspicious = ["சுபம்", "சுபதினம்", "அமிர்தம்"].includes(yoga);
  const paksha = d <= 15 ? "சுக்ல பக்ஷம் (வளர் பிறை)" : "கிருஷ்ண பக்ஷம் (தேய் பிறை)";
  // approx sunrise/sunset for Tamil Nadu
  const sunriseMin = 360 + Math.round(15 * Math.sin((m / 12) * Math.PI * 2));
  const sunsetMin = 1080 + Math.round(20 * Math.sin(((m + 3) / 12) * Math.PI * 2));
  const fmt = (mins) => {
    const h = Math.floor(mins / 60),
      mm = mins % 60;
    const h12 = ((h + 11) % 12) + 1;
    return `${h12}:${String(mm).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };
  const rahuKalam = rahuKalamByWeekday[wd];
  const yamagandam = yamagandamByWeekday[wd];
  const gulikai = gulikaiByWeekday[wd];
  const muruganNote = muruganDayByWeekday[wd];
  const moonPhases = [
    "அமாவாசை",
    "வளர்பிறை",
    "வளர்பிறை",
    "அர்த்த சந்திரன்",
    "வளர்பிறை",
    "பௌர்ணமி",
    "தேய்பிறை",
    "அர்த்த சந்திரன்",
  ];
  const moonPhase = moonPhases[Math.floor((d - 1) / 4) % moonPhases.length];
  const choghadiya = ["அமிர்த", "சுப", "லாப", "உத்தேக", "ரோக", "காள", "சார"][d % 7];
  return {
    tithi,
    nakshatra,
    tamilMonth,
    fest,
    weekday,
    yoga,
    karana,
    isAuspicious,
    paksha,
    sunrise: fmt(sunriseMin),
    sunset: fmt(sunsetMin),
    rahuKalam,
    yamagandam,
    gulikai,
    muruganNote,
    moonPhase,
    choghadiya,
  };
}

function CalendarPage() {
  const today = new Date();
  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(today);
  const { content } = useContent();
  const calendarNotes = content.calendarNotes || {};

  const { y, m } = view;
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const noteForSelected = calendarNotes[toLocalDateKey(selected)];

  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [firstDay, daysInMonth]);

  const monthName = new Date(y, m, 1).toLocaleString("en-US", { month: "long" });
  const tamilMonth = tamilMonths[getTamilMonthIndex(today)];
  const todayTithi = tithis[today.getDate() % tithis.length];
  const todayNakshatra = nakshatras[(today.getDate() + today.getMonth()) % nakshatras.length];

  const goPrev = () => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }));
  const goNext = () => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }));

  const isToday = (d) =>
    d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
  const isSelected = (d) =>
    d === selected.getDate() && m === selected.getMonth() && y === selected.getFullYear();

  const selectedInfo = computeDayInfo(selected);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <PageHero
        slug="calendar"
        eyebrow="தமிழ் நாட்காட்டி · Panchangam"
        titleTamil="தமிழ் நாட்காட்டி"
        titleEn="Tamil Calendar & Panchangam"
        description="தமிழ் மாதங்கள், திதி, நட்சத்திரம் மற்றும் விழாக்கள் — ஒரு புனித நாட்காட்டி."
        image={navCalendar}
      />

      {/* Today's panchangam */}
      <section className="mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-10 py-10 sm:py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              icon: <Sun size={20} />,
              label: "இன்றைய தேதி",
              value: today.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
            },
            {
              icon: <Star size={20} />,
              label: "தமிழ் மாதம்",
              value: `${tamilMonth.ta} (${tamilMonth.en})`,
            },
            { icon: <Moon size={20} />, label: "திதி", value: todayTithi },
            { icon: <Star size={20} />, label: "நட்சத்திரம்", value: todayNakshatra },
          ].map((it, i) => (
            <div
              key={i}
              className="rounded-2xl border border-brass/30 bg-card p-5 shadow-brass/30 shadow-md"
            >
              <div className="flex items-center gap-2 text-vermillion">
                {it.icon}
                <span className="font-display italic text-xs tracking-widest">TODAY</span>
              </div>
              <div className="mt-3 font-tamil-sans text-sm text-ink/70">{it.label}</div>
              <div className="mt-1 font-tamil text-lg sm:text-xl font-bold text-ink">
                {it.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Monthly grid */}
      <section className="mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-10 pb-14">
        <div className="rounded-3xl border border-brass/30 bg-card p-4 sm:p-8 shadow-temple">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goPrev}
              className="h-10 w-10 rounded-full bg-brass/10 hover:bg-brass/20 flex items-center justify-center text-ink"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-center">
              <div className="font-tamil text-xl sm:text-2xl font-bold text-ink">
                {monthName} {y}
              </div>
              <div className="font-display italic text-xs sm:text-sm text-brass-deep tracking-widest">
                PANCHANGAM
              </div>
            </div>
            <button
              onClick={goNext}
              className="h-10 w-10 rounded-full bg-brass/10 hover:bg-brass/20 flex items-center justify-center text-ink"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-tamil text-[0.65rem] sm:text-sm text-brass-deep mb-2">
            {weekdaysTa.map((d) => (
              <div key={d} className="py-1 sm:py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const fest = festivalMap[`${m + 1}-${d}`];
              const today_ = isToday(d);
              const sel = isSelected(d);
              const cellDate = new Date(y, m, d);
              const note = calendarNotes[toLocalDateKey(cellDate)];
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelected(cellDate)}
                  title={note ? note : undefined}
                  className={`relative aspect-square rounded-lg sm:rounded-xl border p-1 sm:p-2 flex flex-col text-left transition-all hover:scale-105 ${
                    today_
                      ? "bg-vermillion text-parchment border-vermillion"
                      : sel
                        ? "bg-brass text-parchment border-brass-deep ring-2 ring-brass-deep"
                        : note
                          ? "bg-brass/10 border-brass-deep/60 ring-1 ring-brass-deep/40 hover:bg-brass/20"
                          : "bg-parchment border-brass/20 hover:bg-brass/10"
                  }`}
                >
                  <span
                    className={`font-display text-sm sm:text-base font-bold ${today_ || sel ? "text-parchment" : "text-ink"}`}
                  >
                    {d}
                  </span>
                  {note && (
                    <span
                      aria-hidden
                      className={`absolute top-1 right-1 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${today_ || sel ? "bg-parchment" : "bg-vermillion"}`}
                    />
                  )}
                  {fest && (
                    <span
                      className={`mt-auto font-tamil text-[0.55rem] sm:text-[0.7rem] leading-tight truncate ${today_ || sel ? "text-parchment" : "text-vermillion"}`}
                    >
                      ★ {fest.ta}
                    </span>
                  )}
                  {!fest && note && (
                    <span
                      className={`mt-auto font-tamil text-[0.55rem] sm:text-[0.7rem] leading-tight truncate ${today_ || sel ? "text-parchment" : "text-brass-deep"}`}
                    >
                      • {note}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Selected day details */}
      <section className="mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-10 pb-14">
        <div className="rounded-3xl border-2 border-vermillion/40 bg-gradient-to-br from-parchment to-brass/10 p-6 sm:p-10 shadow-temple relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {!isToday(selected.getDate()) ||
            selected.getMonth() !== today.getMonth() ||
            selected.getFullYear() !== today.getFullYear() ? (
              <button
                onClick={() => {
                  setSelected(today);
                  setView({ y: today.getFullYear(), m: today.getMonth() });
                }}
                className="text-xs font-display italic tracking-widest text-brass-deep hover:text-vermillion px-3 py-1 rounded-full border border-brass/30"
              >
                TODAY
              </button>
            ) : null}
          </div>
          <div className="flex items-center gap-2 text-vermillion mb-2">
            <Sparkles size={18} />
            <span className="font-display italic text-xs sm:text-sm tracking-[0.3em]">
              SELECTED DAY · தேர்ந்தெடுத்த நாள்
            </span>
          </div>
          <div className="font-tamil text-2xl sm:text-4xl font-bold text-ink mb-1">
            {selected.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
          <div className="font-tamil text-base sm:text-lg text-brass-deep mb-6">
            {selectedInfo.weekday} · {selectedInfo.tamilMonth.ta} ({selectedInfo.tamilMonth.en})
          </div>

          {/* Admin-managed note for the selected date */}
          {noteForSelected && (
            <div className="mb-6 rounded-2xl border-2 border-vermillion/40 bg-gradient-to-br from-brass/15 to-vermillion/10 p-4 sm:p-5 shadow-brass/40">
              <div className="flex items-center gap-2 text-vermillion mb-2">
                <StickyNote size={16} />
                <span className="font-display italic text-xs sm:text-sm tracking-[0.3em]">
                  TEMPLE NOTE · ஆலயக் குறிப்பு
                </span>
              </div>
              <p className="font-tamil-sans text-sm sm:text-base text-ink/85 leading-relaxed whitespace-pre-wrap">
                {noteForSelected}
              </p>
            </div>
          )}

          {/* Panchangam grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { l: "திதி · TITHI", v: selectedInfo.tithi, i: <Moon size={16} /> },
              { l: "நட்சத்திரம் · NAKSHATRA", v: selectedInfo.nakshatra, i: <Star size={16} /> },
              { l: "யோகம் · YOGA", v: selectedInfo.yoga, i: <Sparkles size={16} /> },
              { l: "கரணம் · KARANA", v: selectedInfo.karana, i: <Sparkles size={16} /> },
              { l: "பக்ஷம் · PAKSHA", v: selectedInfo.paksha, i: <Moon size={16} /> },
              { l: "சந்திர நிலை · MOON", v: selectedInfo.moonPhase, i: <Moon size={16} /> },
              { l: "சோகடியா · CHOGHADIYA", v: selectedInfo.choghadiya, i: <Sparkles size={16} /> },
              {
                l: "சுப நாள் · AUSPICIOUS",
                v: selectedInfo.isAuspicious ? "சுப தினம்" : "சாதாரணம்",
                i: <Star size={16} />,
                highlight: selectedInfo.isAuspicious,
              },
            ].map((it, i) => (
              <div
                key={i}
                className={`rounded-xl border p-4 ${it.highlight ? "bg-vermillion/10 border-vermillion/40" : "bg-card border-brass/30"}`}
              >
                <div className="flex items-center gap-1.5 text-brass-deep">
                  {it.i}
                  <span className="font-display italic text-[0.65rem] tracking-widest">{it.l}</span>
                </div>
                <div className="mt-1 font-tamil text-base sm:text-lg font-bold text-ink">
                  {it.v}
                </div>
              </div>
            ))}
          </div>

          {/* Sun timings */}
          <div className="mt-5 grid sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-xl bg-gradient-to-br from-amber-200/40 to-brass/10 border border-brass/30 p-4 flex items-center gap-3">
              <Sunrise className="text-vermillion shrink-0" size={26} />
              <div>
                <div className="font-display italic text-[0.65rem] text-brass-deep tracking-widest">
                  சூரிய உதயம் · SUNRISE
                </div>
                <div className="font-tamil text-xl font-bold text-ink">{selectedInfo.sunrise}</div>
              </div>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-orange-200/40 to-vermillion/10 border border-brass/30 p-4 flex items-center gap-3">
              <Sunset className="text-vermillion shrink-0" size={26} />
              <div>
                <div className="font-display italic text-[0.65rem] text-brass-deep tracking-widest">
                  சூரிய அஸ்தமனம் · SUNSET
                </div>
                <div className="font-tamil text-xl font-bold text-ink">{selectedInfo.sunset}</div>
              </div>
            </div>
          </div>

          {/* Inauspicious periods */}
          <div className="mt-5">
            <div className="font-display italic text-xs tracking-[0.25em] text-brass-deep mb-3 flex items-center gap-2">
              <AlertTriangle size={14} /> அசுப காலங்கள் · INAUSPICIOUS PERIODS
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                {
                  l: "ராகு காலம் · Rahu Kalam",
                  v: selectedInfo.rahuKalam,
                  c: "from-red-900/20 to-vermillion/10 border-vermillion/30",
                },
                {
                  l: "எம கண்டம் · Yamagandam",
                  v: selectedInfo.yamagandam,
                  c: "from-purple-900/20 to-brass/10 border-brass/30",
                },
                {
                  l: "குளிகை · Gulikai",
                  v: selectedInfo.gulikai,
                  c: "from-slate-700/20 to-brass/10 border-brass/30",
                },
              ].map((it, i) => (
                <div key={i} className={`rounded-xl bg-gradient-to-br ${it.c} border p-4`}>
                  <div className="font-display italic text-[0.65rem] text-brass-deep tracking-widest">
                    {it.l}
                  </div>
                  <div className="mt-1 font-tamil text-base font-bold text-ink">{it.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Murugan special note */}
          {selectedInfo.muruganNote && (
            <div className="mt-5 rounded-2xl bg-gradient-to-r from-vermillion/15 via-brass/10 to-emerald-700/15 border-2 border-vermillion/30 p-5 flex items-center gap-4">
              <img
                src={muruganVel}
                alt=""
                aria-hidden
                width={56}
                height={56}
                loading="lazy"
                className="h-14 w-14 object-contain shrink-0"
              />
              <div>
                <div className="font-display italic text-[0.7rem] tracking-[0.3em] text-vermillion">
                  MURUGAN SPECIAL · முருகனுக்கு உகந்த நாள்
                </div>
                <div className="mt-1 font-tamil text-lg font-bold text-ink">
                  {selectedInfo.muruganNote}
                </div>
              </div>
            </div>
          )}

          {selectedInfo.fest && (
            <div className="mt-5 rounded-2xl bg-vermillion text-parchment p-5 sm:p-6 flex items-start gap-4">
              <Flame size={28} className="shrink-0 mt-1" />
              <div>
                <div className="font-display italic text-[0.7rem] tracking-[0.3em] opacity-80">
                  FESTIVAL · விழா
                </div>
                <div className="mt-1 font-tamil text-2xl font-bold">{selectedInfo.fest.ta}</div>
                <div className="font-display italic text-base opacity-90">
                  {selectedInfo.fest.en}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tamil months list */}
      <section className="mx-auto max-w-7xl w-full px-5 sm:px-6 lg:px-10 pb-20">
        <div className="ornament-divider mb-6">
          <span className="font-display italic text-xs sm:text-sm tracking-[0.3em]">
            12 MONTHS · தமிழ் மாதங்கள்
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {tamilMonths.map((mo, i) => (
            <div
              key={mo.ta}
              className="rounded-xl border border-brass/30 bg-card p-4 hover:shadow-brass transition-shadow"
            >
              <div className="font-display italic text-[0.7rem] text-brass-deep tracking-widest">
                {String(i + 1).padStart(2, "0")} · {mo.range}
              </div>
              <div className="mt-1 font-tamil text-lg font-bold text-ink">{mo.ta}</div>
              <div className="font-display italic text-sm text-ink/60">{mo.en}</div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
