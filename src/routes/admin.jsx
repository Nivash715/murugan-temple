import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LogOut,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Home as HomeIcon,
  LayoutGrid,
  Compass,
  KeyRound,
  Plus,
  Trash2,
  Check,
  Image as ImageIcon,
  CalendarDays,
  Upload,
  StickyNote,
  Users,
  Bell,
  HandCoins,
  FileSpreadsheet,
  FileText,
  Search,
  Mail as MailIcon,
  AlertTriangle,
  Phone as PhoneIcon,
  IndianRupee,
  Hash,
  CalendarClock,
} from "lucide-react";
import logoImg from "@/assets/m12.jpeg";
import upiQrDefault from "@/assets/Upi.jpeg";
import kolam from "@/assets/kolam-ornament.png";
import gopuram from "@/assets/temple-gopuram.jpg";
import manuscript from "@/assets/temple-manuscript.jpg";
import carvings from "@/assets/m15.jpeg";
import deityGanesha from "@/assets/vina.webp";
import pooja from "@/assets/m16.jpeg";
import festival from "@/assets/m14.jpeg";
import navCalendar from "@/assets/Murugan-3.jpeg";
import priestImg from "@/assets/achakar.jpg";
import donationImg from "@/assets/Donation.jpg";
import muruganDeity from "@/assets/m12.jpeg";
import gopuramHero from "@/assets/temple-gopuram.jpg";
import { useAuth, DEFAULT_CREDENTIALS } from "@/lib/admin-auth";
import { useContent, defaultContent, toLocalDateKey } from "@/lib/content-store";
import { fileToCompressedDataUrl } from "@/lib/image-upload";
import { triggerLogoutToast } from "@/components/LogoutToast";
import { useDonationLog } from "@/lib/donation-log";
import {
  exportDonationsToPdf,
  exportDonationsToExcel,
  exportDonationsToCsv,
} from "@/lib/donation-export";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "உள்ளடக்க மேலாண்மை — Content Management" },
      {
        name: "description",
        content:
          "ஆலய இணையதள உள்ளடக்க நிர்வாக பலகை — தலைப்புகள், பகுதிகள், படங்கள், நாட்காட்டி குறிப்புகள்.",
      },
    ],
  }),
  component: AdminPage,
});

/* -------------------------------------------------------------------------- */
/*  Tabs                                                                      */
/* -------------------------------------------------------------------------- */
const TABS = [
  { id: "header", label: "தலைப்பு & வழிசெலுத்தல்", en: "Header & Navigation", icon: Compass },
  { id: "home", label: "முகப்பு பக்கம்", en: "Home Page", icon: HomeIcon },
  { id: "pages", label: "உள் பக்கங்கள்", en: "Inner Pages", icon: LayoutGrid },
  { id: "images", label: "படங்கள்", en: "Images", icon: ImageIcon },
  { id: "people", label: "மக்கள் & அறிவிப்புகள்", en: "People & Announcements", icon: Users },
  { id: "notes", label: "நாட்காட்டி குறிப்புகள்", en: "Calendar Notes", icon: CalendarDays },
  { id: "donations", label: "தான பதிவு", en: "Donations", icon: HandCoins },
  { id: "footer", label: "அடிக்குறிப்பு", en: "Footer", icon: Eye },
  { id: "account", label: "கணக்கு", en: "Account", icon: KeyRound },
];

/* -------------------------------------------------------------------------- */
/*  Reusable form atoms                                                       */
/* -------------------------------------------------------------------------- */
function Field({
  labelTamil,
  labelEn,
  value,
  onChange,
  multiline = false,
  placeholder = "",
  type = "text",
}) {
  const baseCls =
    "mt-1.5 w-full rounded-xl border border-brass/40 bg-parchment/80 px-4 py-2.5 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-vermillion/40 focus:border-vermillion transition font-tamil-sans text-sm";
  return (
    <label className="block">
      <span className="flex flex-wrap items-baseline gap-2 font-tamil-sans text-sm font-semibold text-ink/80">
        <span className="font-tamil">{labelTamil}</span>
        <span className="text-ink/40 font-display italic text-xs">/ {labelEn}</span>
      </span>
      {multiline ? (
        <textarea
          rows={4}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseCls + " resize-y"}
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseCls}
        />
      )}
    </label>
  );
}

function PasswordField({ labelTamil, labelEn, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="flex flex-wrap items-baseline gap-2 font-tamil-sans text-sm font-semibold text-ink/80">
        <span className="font-tamil">{labelTamil}</span>
        <span className="text-ink/40 font-display italic text-xs">/ {labelEn}</span>
      </span>
      <div className="relative mt-1.5">
        <input
          type={show ? "text" : "password"}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-brass/40 bg-parchment/80 px-4 py-2.5 pr-11 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-vermillion/40 focus:border-vermillion transition font-tamil-sans text-sm"
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-2 my-auto inline-flex items-center justify-center h-9 w-9 rounded-lg text-ink/60 hover:text-vermillion hover:bg-brass/10 transition"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}

function SectionCard({ titleTamil, titleEn, children }) {
  return (
    <div className="rounded-2xl border border-brass/30 bg-card/95 shadow-soft p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline gap-3 border-b border-brass/20 pb-3">
        <h3 className="font-tamil text-xl sm:text-2xl font-bold text-ink">{titleTamil}</h3>
        <span className="font-display italic text-sm text-brass-deep">/ {titleEn}</span>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main admin page                                                           */
/* -------------------------------------------------------------------------- */
function AdminPage() {
  const navigate = useNavigate();
  const { isAuthed, logout, credentials, updateCredentials } = useAuth();
  const { content, setContent, resetContent } = useContent();

  // Working draft so unsaved changes are kept locally
  const [draft, setDraft] = useState(content);
  const [activeTab, setActiveTab] = useState("header");
  const [saved, setSaved] = useState(false);

  // Auth gate — redirect unauthenticated visitors to /admin/login
  useEffect(() => {
    if (!isAuthed) navigate({ to: "/admin/login" });
  }, [isAuthed, navigate]);

  // When the live content updates externally, sync the draft
  useEffect(() => {
    setDraft(content);
  }, [content]);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(content), [draft, content]);

  if (!isAuthed) {
    // Render nothing while the redirect effect runs
    return null;
  }

  const update = (path, value) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      let node = next;
      for (let i = 0; i < path.length - 1; i++) {
        if (node[path[i]] == null) node[path[i]] = {};
        node = node[path[i]];
      }
      node[path[path.length - 1]] = value;
      return next;
    });
  };

  const handleSave = () => {
    setContent(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("அனைத்தையும் இயல்புநிலைக்கு மீட்டமைக்கவா? Reset all content to defaults?")) {
      resetContent();
      setDraft(defaultContent);
    }
  };

  const handleLogout = () => {
    logout();
    triggerLogoutToast();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen relative-z bg-gradient-parchment">
      {/* Decorative ornaments */}
      <img
        src={kolam}
        alt=""
        aria-hidden
        className="absolute right-0 top-12 w-[28rem] opacity-10 animate-spin-slow pointer-events-none -z-0"
      />

      {/* TOP BAR */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-gradient-to-r from-[#A52A2A] to-[#cc7722] border-b border-parchment/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-2xl border border-parchment/30 bg-parchment/10">
              <img
                src={draft.images?.logo || logoImg}
                alt="Temple"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="leading-tight">
              <h1 className="font-tamil text-base sm:text-lg font-bold text-parchment">
                உள்ளடக்க மேலாண்மை
              </h1>
              <div className="font-display italic text-[0.65rem] sm:text-xs text-parchment/80 tracking-widest">
                CONTENT MANAGEMENT · {draft.header.titleTamil}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-parchment/40 text-parchment/90 hover:bg-parchment/10 transition text-xs sm:text-sm font-tamil-sans"
            >
              <Eye size={14} /> தளம் காண்க
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-parchment/15 hover:bg-parchment/25 text-parchment text-xs sm:text-sm font-tamil-sans border border-parchment/30 transition"
            >
              <LogOut size={14} /> வெளியேறு
            </button>
          </div>
        </div>
      </header>

      {/* PAGE TITLE — bilingual */}
      <section className="relative-z mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10">
        <div className="ornament-divider mb-3">
          <span className="font-display italic text-xs sm:text-sm tracking-[0.3em] text-brass-deep">
            ADMIN PANEL · நிர்வாக பலகை
          </span>
        </div>
        <h2 className="font-tamil text-3xl sm:text-4xl md:text-5xl font-bold text-ink leading-tight">
          உள்ளடக்க மேலாண்மை{" "}
          <span className="font-display italic text-brass-deep text-xl sm:text-2xl md:text-3xl font-medium">
            / Content Management
          </span>
        </h2>
        <p className="mt-2 font-tamil-sans text-ink/70 text-sm sm:text-base max-w-3xl">
          இந்த பலகையில் நீங்கள் உங்கள் இணையதளத்தின் ஒவ்வொரு பகுதியையும் தனிப்பயனாக்கலாம்.
          மாற்றங்களைச் சேமிக்க <strong className="text-vermillion">சேமி</strong> பொத்தானை
          அழுத்தவும்.
        </p>
      </section>

      {/* TABS + ACTION BAR */}
      <section className="relative-z mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 mt-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={
                    "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs sm:text-sm transition-all font-tamil-sans " +
                    (active
                      ? "bg-vermillion text-parchment border-vermillion shadow-brass"
                      : "bg-parchment/60 border-brass/30 text-ink/80 hover:bg-parchment hover:border-brass")
                  }
                >
                  <Icon size={14} />
                  <span className="font-tamil font-semibold">{t.label}</span>
                  <span className="hidden sm:inline font-display italic text-[0.65rem] opacity-80">
                    / {t.en}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brass/40 text-ink/80 hover:bg-brass/10 transition text-xs sm:text-sm font-tamil-sans"
            >
              <RotateCcw size={14} /> இயல்புநிலை · Reset
            </button>
            <button
              onClick={handleSave}
              disabled={!dirty}
              className={
                "inline-flex items-center gap-2 px-5 py-2 rounded-full text-parchment font-tamil font-semibold text-xs sm:text-sm transition-all " +
                (dirty
                  ? "bg-gradient-sunset shadow-brass hover:shadow-temple"
                  : "bg-ink/30 cursor-not-allowed")
              }
            >
              {saved ? <Check size={14} /> : <Save size={14} />}
              {saved ? "சேமிக்கப்பட்டது · Saved" : "சேமி · Save"}
            </button>
          </div>
        </div>
      </section>

      {/* BODY */}
      <main className="relative-z mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-8 sm:py-10 space-y-6">
        {activeTab === "header" && <HeaderTab draft={draft} update={update} />}
        {activeTab === "home" && <HomeTab draft={draft} update={update} />}
        {activeTab === "pages" && <PagesTab draft={draft} update={update} />}
        {activeTab === "images" && <ImagesTab draft={draft} update={update} />}
        {activeTab === "people" && <PeopleTab draft={draft} update={update} />}
        {activeTab === "notes" && <NotesTab draft={draft} update={update} />}
        {activeTab === "donations" && <DonationsTab draft={draft} update={update} />}
        {activeTab === "footer" && <FooterTab draft={draft} update={update} />}
        {activeTab === "account" && (
          <AccountTab credentials={credentials} updateCredentials={updateCredentials} />
        )}
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  HEADER TAB                                                                */
/* -------------------------------------------------------------------------- */
function HeaderTab({ draft, update }) {
  const nav = draft.header.nav;

  const updateNavItem = (idx, key, val) => {
    const next = nav.map((item, i) => (i === idx ? { ...item, [key]: val } : item));
    update(["header", "nav"], next);
  };
  const removeNavItem = (idx) => {
    const next = nav.filter((_, i) => i !== idx);
    update(["header", "nav"], next);
  };
  const addNavItem = () => {
    update(["header", "nav"], [...nav, { to: "/", label: "புதிய பகுதி", sub: "New" }]);
  };

  return (
    <>
      <SectionCard titleTamil="தலைப்பு" titleEn="Site Title">
        <Field
          labelTamil="தலைப்பு (தமிழ்)"
          labelEn="Title (Tamil)"
          value={draft.header.titleTamil}
          onChange={(v) => update(["header", "titleTamil"], v)}
        />
        <Field
          labelTamil="தலைப்பு (ஆங்கிலம்)"
          labelEn="Title (English)"
          value={draft.header.titleEn}
          onChange={(v) => update(["header", "titleEn"], v)}
        />
      </SectionCard>

      <SectionCard titleTamil="வழிசெலுத்தல் பட்டியல்" titleEn="Navigation Menu">
        <div className="space-y-3">
          {nav.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-end rounded-xl border border-brass/20 bg-parchment/40 p-3"
            >
              <div className="sm:col-span-3">
                <Field
                  labelTamil="பாதை"
                  labelEn="Path"
                  value={item.to}
                  onChange={(v) => updateNavItem(idx, "to", v)}
                  placeholder="/"
                />
              </div>
              <div className="sm:col-span-4">
                <Field
                  labelTamil="தமிழ்"
                  labelEn="Tamil label"
                  value={item.label}
                  onChange={(v) => updateNavItem(idx, "label", v)}
                />
              </div>
              <div className="sm:col-span-4">
                <Field
                  labelTamil="ஆங்கிலம்"
                  labelEn="English label"
                  value={item.sub}
                  onChange={(v) => updateNavItem(idx, "sub", v)}
                />
              </div>
              <div className="sm:col-span-1 flex sm:justify-end">
                <button
                  onClick={() => removeNavItem(idx)}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition"
                  title="Remove · அகற்று"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addNavItem}
          className="mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brass/40 text-ink/80 hover:bg-brass/10 transition text-xs sm:text-sm font-tamil-sans"
        >
          <Plus size={14} /> புதிய உருப்படி · Add link
        </button>
      </SectionCard>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  HOME TAB                                                                  */
/* -------------------------------------------------------------------------- */
function HomeTab({ draft, update }) {
  const home = draft.home;
  return (
    <>
      <SectionCard titleTamil="முக்கிய ஹீரோ" titleEn="Hero Section">
        <Field
          labelTamil="ஹீரோ வரி 1 (தமிழ்)"
          labelEn="Hero line 1"
          value={home.heroTamilLine1}
          onChange={(v) => update(["home", "heroTamilLine1"], v)}
        />
        <Field
          labelTamil="ஹீரோ வரி 2 (தமிழ்)"
          labelEn="Hero line 2 (highlighted)"
          value={home.heroTamilLine2}
          onChange={(v) => update(["home", "heroTamilLine2"], v)}
        />
        <Field
          labelTamil="ஆங்கிலக் குறிப்பு"
          labelEn="English tagline"
          value={home.heroEnTagline}
          onChange={(v) => update(["home", "heroEnTagline"], v)}
        />
        <Field
          labelTamil="விளக்கம்"
          labelEn="Description"
          value={home.heroDescription}
          onChange={(v) => update(["home", "heroDescription"], v)}
          multiline
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            labelTamil="முதன்மை பொத்தான்"
            labelEn="Primary button"
            value={home.primaryCta}
            onChange={(v) => update(["home", "primaryCta"], v)}
          />
          <Field
            labelTamil="இரண்டாம் பொத்தான்"
            labelEn="Secondary button"
            value={home.secondaryCta}
            onChange={(v) => update(["home", "secondaryCta"], v)}
          />
        </div>
      </SectionCard>

      <SectionCard titleTamil="தெய்வ விளக்கம் (ஹீரோ படத்தில்)" titleEn="Hero deity caption">
        <Field
          labelTamil="ஆங்கிலம்"
          labelEn="English caption"
          value={home.deityCaptionEn}
          onChange={(v) => update(["home", "deityCaptionEn"], v)}
        />
        <Field
          labelTamil="தமிழ்"
          labelEn="Tamil caption"
          value={home.deityCaptionTamil}
          onChange={(v) => update(["home", "deityCaptionTamil"], v)}
        />
      </SectionCard>

      <SectionCard titleTamil="பகுதிகள் தலைப்பு" titleEn="Chapters Section">
        <Field
          labelTamil="மேற்கோள்"
          labelEn="Eyebrow"
          value={home.chaptersEyebrow}
          onChange={(v) => update(["home", "chaptersEyebrow"], v)}
        />
        <Field
          labelTamil="தலைப்பு (தமிழ்)"
          labelEn="Title (Tamil)"
          value={home.chaptersTitle}
          onChange={(v) => update(["home", "chaptersTitle"], v)}
        />
        <Field
          labelTamil="துணை தலைப்பு (ஆங்கிலம்)"
          labelEn="Subtitle (English)"
          value={home.chaptersSubtitle}
          onChange={(v) => update(["home", "chaptersSubtitle"], v)}
        />
      </SectionCard>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  PAGES TAB                                                                 */
/* -------------------------------------------------------------------------- */
const PAGE_TITLES = {
  "temple-history": ["கோவில் வரலாறு", "Temple History"],
  "sthala-puranam": ["ஸ்தல புராணம்", "Sthala Puranam"],
  "temple-structure": ["ஆலய அமைப்பு", "Temple Structure"],
  deities: ["தெய்வங்கள்", "Deities"],
  events: ["நிகழ்ச்சிகள்", "Events"],
  festivals: ["விழாக்கள்", "Festivals"],
  calendar: ["நாட்காட்டி", "Calendar"],
  priest: ["அர்ச்சகர்", "Priest & Management"],
  donate: ["தானம்", "Donate"],
};

function PagesTab({ draft, update }) {
  const slugs = Object.keys(draft.pages);
  const [activeSlug, setActiveSlug] = useState(slugs[0]);
  const page = draft.pages[activeSlug];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-brass/30 bg-card/95 p-3 sm:p-4">
        <div className="flex flex-wrap gap-2">
          {slugs.map((slug) => {
            const [tamil, en] = PAGE_TITLES[slug] || [slug, slug];
            const active = activeSlug === slug;
            return (
              <button
                key={slug}
                onClick={() => setActiveSlug(slug)}
                className={
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all font-tamil-sans " +
                  (active
                    ? "bg-brass-deep text-parchment border-brass-deep"
                    : "border-brass/30 text-ink/80 hover:bg-brass/10")
                }
              >
                <span className="font-tamil font-semibold">{tamil}</span>
                <span className="font-display italic text-[0.65rem] opacity-80">/ {en}</span>
              </button>
            );
          })}
        </div>
      </div>

      <SectionCard
        titleTamil={`${(PAGE_TITLES[activeSlug] || [activeSlug])[0]} — ஹீரோ`}
        titleEn={`${(PAGE_TITLES[activeSlug] || ["", activeSlug])[1]} — Hero`}
      >
        <Field
          labelTamil="மேற்கோள்"
          labelEn="Eyebrow"
          value={page.eyebrow}
          onChange={(v) => update(["pages", activeSlug, "eyebrow"], v)}
        />
        <Field
          labelTamil="தலைப்பு (தமிழ்)"
          labelEn="Title (Tamil)"
          value={page.titleTamil}
          onChange={(v) => update(["pages", activeSlug, "titleTamil"], v)}
        />
        <Field
          labelTamil="தலைப்பு (ஆங்கிலம்)"
          labelEn="Title (English)"
          value={page.titleEn}
          onChange={(v) => update(["pages", activeSlug, "titleEn"], v)}
        />
        <Field
          labelTamil="விளக்கம்"
          labelEn="Description"
          value={page.description}
          onChange={(v) => update(["pages", activeSlug, "description"], v)}
          multiline
        />
      </SectionCard>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  IMAGES TAB                                                                */
/* -------------------------------------------------------------------------- */
const PAGE_DEFAULT_HERO = {
  "temple-history": gopuramHero,
  "sthala-puranam": manuscript,
  "temple-structure": carvings,
  deities: deityGanesha,
  events: pooja,
  festivals: festival,
  calendar: navCalendar,
  priest: priestImg,
  donate: donationImg,
};

const HOME_DEFAULT_CARD = {
  "temple-history": gopuram,
  "sthala-puranam": manuscript,
  "temple-structure": carvings,
  deities: deityGanesha,
  events: pooja,
  festivals: festival,
  calendar: navCalendar,
  priest: priestImg,
  donate: donationImg,
};

function ImageSlot({ labelTamil, labelEn, current, defaultImg, onChange, onClear }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleFile = async (file) => {
    setError("");
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file, { maxDimension: 1600 });
      onChange(dataUrl);
    } catch (e) {
      setError(e.message || "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const preview = current || defaultImg;

  return (
    <div className="rounded-xl border border-brass/30 bg-parchment/50 p-3 sm:p-4 flex flex-col sm:flex-row gap-4 items-stretch">
      <div className="w-full sm:w-40 shrink-0 aspect-[4/3] rounded-lg overflow-hidden border border-brass/30 bg-parchment">
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-ink/40 text-xs">
            (no image)
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="font-tamil text-base font-semibold text-ink leading-tight">
          {labelTamil}
        </div>
        <div className="font-display italic text-xs text-brass-deep">/ {labelEn}</div>
        <div className="mt-1 text-[0.7rem] font-tamil-sans text-ink/60">
          {current ? "தனிப்பயன் பதிவேற்றம் · Custom upload" : "இயல்புநிலை படம் · Default image"}
        </div>

        {error && (
          <div className="mt-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs text-destructive font-tamil-sans">
            {error}
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-sunset text-parchment text-xs font-tamil-sans font-semibold shadow-brass hover:shadow-temple disabled:opacity-60 transition"
          >
            <Upload size={13} /> {busy ? "ஏற்றுகிறது…" : "பதிவேற்று · Upload"}
          </button>
          {current && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brass/40 text-ink/80 hover:bg-brass/10 text-xs font-tamil-sans transition"
            >
              <RotateCcw size={13} /> இயல்புநிலை · Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ImagesTab({ draft, update }) {
  const images = draft.images || {};
  const slugs = Object.keys(PAGE_TITLES);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-brass/30 bg-card/95 p-4 sm:p-5">
        <p className="font-tamil-sans text-sm text-ink/70 leading-relaxed">
          இங்கே நீங்கள் உங்கள் இணையதளத்தின் முக்கிய படங்களை மாற்றலாம். பெரிய படங்கள் தானாக
          சுருக்கப்படும் (1600px-க்கு). சேமிக்க <strong className="text-vermillion">சேமி</strong>{" "}
          பொத்தானை அழுத்தவும்.
          <br />
          <span className="text-ink/50 font-display italic">
            Upload custom images for the site below. Files are auto-resized for best performance.
          </span>
        </p>
      </div>

      <SectionCard titleTamil="இணைய தள படங்கள்" titleEn="Site-wide Images">
        <ImageSlot
          labelTamil="ஆலய லோகோ"
          labelEn="Temple logo (header)"
          current={images.logo}
          defaultImg={logoImg}
          onChange={(v) => update(["images", "logo"], v)}
          onClear={() => update(["images", "logo"], null)}
        />
        <ImageSlot
          labelTamil="முகப்பு ஹீரோ தெய்வ படம்"
          labelEn="Home hero deity image"
          current={images.homeHeroDeity}
          defaultImg={muruganDeity}
          onChange={(v) => update(["images", "homeHeroDeity"], v)}
          onClear={() => update(["images", "homeHeroDeity"], null)}
        />
      </SectionCard>

      <SectionCard titleTamil="முகப்பு பகுதி அட்டைகள்" titleEn="Home page chapter cards">
        <div className="grid sm:grid-cols-2 gap-3">
          {slugs.map((slug) => {
            const [tamil, en] = PAGE_TITLES[slug];
            return (
              <ImageSlot
                key={slug}
                labelTamil={tamil}
                labelEn={en}
                current={images.homeCards?.[slug]}
                defaultImg={HOME_DEFAULT_CARD[slug]}
                onChange={(v) => update(["images", "homeCards", slug], v)}
                onClear={() => update(["images", "homeCards", slug], null)}
              />
            );
          })}
        </div>
      </SectionCard>

      <SectionCard titleTamil="உள் பக்க ஹீரோ படங்கள்" titleEn="Inner page hero images">
        <div className="grid sm:grid-cols-2 gap-3">
          {slugs.map((slug) => {
            const [tamil, en] = PAGE_TITLES[slug];
            return (
              <ImageSlot
                key={slug}
                labelTamil={tamil}
                labelEn={en}
                current={images.pageHero?.[slug]}
                defaultImg={PAGE_DEFAULT_HERO[slug]}
                onChange={(v) => update(["images", "pageHero", slug], v)}
                onClear={() => update(["images", "pageHero", slug], null)}
              />
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  PEOPLE & ANNOUNCEMENTS TAB                                                */
/* -------------------------------------------------------------------------- */
function PeopleTab({ draft, update }) {
  const priest = draft.priest || { label: "", phone: "" };
  const trustees = draft.trustees || [];
  const announcements = draft.announcements || [];

  const updateTrustee = (idx, key, val) => {
    const next = trustees.map((t, i) => (i === idx ? { ...t, [key]: val } : t));
    update(["trustees"], next);
  };
  const removeTrustee = (idx) =>
    update(
      ["trustees"],
      trustees.filter((_, i) => i !== idx),
    );
  const addTrustee = () =>
    update(["trustees"], [...trustees, { name: "திரு புதியவர்", phone: "" }]);

  const updateAnnouncement = (idx, val) => {
    const next = announcements.map((a, i) => (i === idx ? val : a));
    update(["announcements"], next);
  };
  const removeAnnouncement = (idx) =>
    update(
      ["announcements"],
      announcements.filter((_, i) => i !== idx),
    );
  const addAnnouncement = () => update(["announcements"], [...announcements, "புதிய அறிவிப்பு"]);

  return (
    <>
      <SectionCard titleTamil="அர்ச்சகர்" titleEn="Priest">
        <Field
          labelTamil="அர்ச்சகர் பெயர் / பதவி"
          labelEn="Priest name / role"
          value={priest.label}
          onChange={(v) => update(["priest", "label"], v)}
        />
        <Field
          labelTamil="தொலைபேசி எண்"
          labelEn="Phone number"
          value={priest.phone}
          onChange={(v) => update(["priest", "phone"], v)}
          placeholder="9894187394"
        />
      </SectionCard>

      <SectionCard titleTamil="அறங்காவலர் குழு" titleEn="Management / Trustees">
        <div className="space-y-3">
          {trustees.map((t, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-end rounded-xl border border-brass/20 bg-parchment/40 p-3"
            >
              <div className="sm:col-span-6">
                <Field
                  labelTamil="பெயர்"
                  labelEn="Name"
                  value={t.name}
                  onChange={(v) => updateTrustee(idx, "name", v)}
                />
              </div>
              <div className="sm:col-span-5">
                <Field
                  labelTamil="தொலைபேசி எண்"
                  labelEn="Phone"
                  value={t.phone}
                  onChange={(v) => updateTrustee(idx, "phone", v)}
                />
              </div>
              <div className="sm:col-span-1 flex sm:justify-end">
                <button
                  onClick={() => removeTrustee(idx)}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition"
                  title="Remove · அகற்று"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addTrustee}
          className="mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brass/40 text-ink/80 hover:bg-brass/10 transition text-xs sm:text-sm font-tamil-sans"
        >
          <Plus size={14} /> புதிய அறங்காவலர் · Add trustee
        </button>
      </SectionCard>

      <SectionCard titleTamil="விழா அறிவிப்புகள்" titleEn="Festival Announcements">
        <p className="text-xs sm:text-sm font-tamil-sans text-ink/60 -mt-1">
          <Bell size={12} className="inline mr-1 text-vermillion" />
          இந்த அறிவிப்புகள் <strong>விழாக்கள் / Festivals</strong> பக்கத்தில் காட்டப்படும்.
        </p>
        <div className="space-y-3">
          {announcements.map((line, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-end rounded-xl border border-brass/20 bg-parchment/40 p-3"
            >
              <div className="sm:col-span-11">
                <Field
                  labelTamil={`அறிவிப்பு ${idx + 1}`}
                  labelEn={`Announcement ${idx + 1}`}
                  value={line}
                  onChange={(v) => updateAnnouncement(idx, v)}
                  multiline
                />
              </div>
              <div className="sm:col-span-1 flex sm:justify-end">
                <button
                  onClick={() => removeAnnouncement(idx)}
                  className="inline-flex items-center justify-center h-10 w-10 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition"
                  title="Remove · அகற்று"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addAnnouncement}
          className="mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brass/40 text-ink/80 hover:bg-brass/10 transition text-xs sm:text-sm font-tamil-sans"
        >
          <Plus size={14} /> புதிய அறிவிப்பு · Add announcement
        </button>
      </SectionCard>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  CALENDAR NOTES TAB                                                        */
/* -------------------------------------------------------------------------- */
function NotesTab({ draft, update }) {
  const notes = draft.calendarNotes || {};
  const [date, setDate] = useState(toLocalDateKey(new Date()));
  const [text, setText] = useState("");

  const sortedKeys = useMemo(() => Object.keys(notes).sort(), [notes]);

  const onAddOrUpdate = () => {
    if (!text.trim()) return;
    const next = { ...notes, [date]: text.trim() };
    update(["calendarNotes"], next);
    setText("");
  };

  const onDelete = (key) => {
    const next = { ...notes };
    delete next[key];
    update(["calendarNotes"], next);
  };

  return (
    <div className="space-y-5">
      <SectionCard titleTamil="புதிய குறிப்பு சேர்" titleEn="Add / update note">
        <p className="text-xs sm:text-sm font-tamil-sans text-ink/70">
          ஒரு தேதியைத் தேர்ந்தெடுத்து குறிப்பை எழுதுங்கள். அந்தத் தேதியில் ஏற்கனவே குறிப்பு
          இருந்தால், அது புதுப்பிக்கப்படும். குறிப்பு உள்ள தேதிகள் நாட்காட்டியில் சிறப்பு
          புள்ளியுடன் காட்டப்படும்.
          <br />
          <span className="text-ink/50 font-display italic">
            Pick a date and write a note — it will appear with a marker on the public calendar.
          </span>
        </p>

        <div className="grid sm:grid-cols-3 gap-3">
          <Field labelTamil="தேதி" labelEn="Date" type="date" value={date} onChange={setDate} />
          <div className="sm:col-span-2">
            <Field
              labelTamil="குறிப்பு"
              labelEn="Note"
              value={text}
              onChange={setText}
              multiline
              placeholder="உதா: காலை 6:00 மணிக்கு சிறப்பு கங்காபிஷேகம்."
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onAddOrUpdate}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-sunset text-parchment font-tamil font-semibold text-xs sm:text-sm shadow-brass hover:shadow-temple transition-all"
        >
          <Plus size={14} /> குறிப்பைச் சேர் · Save note
        </button>
      </SectionCard>

      <SectionCard titleTamil="அனைத்து குறிப்புகள்" titleEn="All notes">
        {sortedKeys.length === 0 ? (
          <p className="text-sm font-tamil-sans text-ink/60">
            இதுவரை குறிப்புகள் எதுவும் சேர்க்கப்படவில்லை.{" "}
            <span className="font-display italic">No notes added yet.</span>
          </p>
        ) : (
          <div className="space-y-2">
            {sortedKeys.map((key) => (
              <div
                key={key}
                className="flex items-start gap-3 rounded-xl border border-brass/20 bg-parchment/50 p-3"
              >
                <div className="flex flex-col items-center w-16 shrink-0 rounded-lg bg-vermillion/10 border border-vermillion/30 px-2 py-1.5">
                  <CalendarDays size={14} className="text-vermillion" />
                  <div className="mt-1 font-display text-xs font-bold text-ink leading-none">
                    {key}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-brass-deep mb-1">
                    <StickyNote size={13} />
                    <span className="font-display italic text-[0.65rem] tracking-widest uppercase">
                      Note
                    </span>
                  </div>
                  <p className="font-tamil-sans text-sm text-ink/85 break-words whitespace-pre-wrap">
                    {notes[key]}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setDate(key);
                        setText(notes[key]);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-brass/40 text-ink/80 hover:bg-brass/10 text-[0.7rem] font-tamil-sans"
                    >
                      திருத்து · Edit
                    </button>
                    <button
                      onClick={() => onDelete(key)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-destructive/30 text-destructive hover:bg-destructive/10 text-[0.7rem] font-tamil-sans"
                    >
                      <Trash2 size={11} /> நீக்கு · Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  FOOTER TAB                                                                */
/* -------------------------------------------------------------------------- */
function FooterTab({ draft, update }) {
  const footer = draft.footer;
  return (
    <SectionCard titleTamil="அடிக்குறிப்பு" titleEn="Footer">
      <Field
        labelTamil="ஆலய பெயர் (தமிழ்)"
        labelEn="Temple name (Tamil)"
        value={footer.templeNameTamil}
        onChange={(v) => update(["footer", "templeNameTamil"], v)}
      />
      <Field
        labelTamil="ஆலய பெயர் (ஆங்கிலம்)"
        labelEn="Temple name (English)"
        value={footer.templeNameEn}
        onChange={(v) => update(["footer", "templeNameEn"], v)}
      />
      <Field
        labelTamil="பதிப்புரிமை வரி"
        labelEn="Copyright line"
        value={footer.copyrightTamil}
        onChange={(v) => update(["footer", "copyrightTamil"], v)}
      />
    </SectionCard>
  );
}

/* -------------------------------------------------------------------------- */
/*  DONATIONS TAB                                                             */
/* -------------------------------------------------------------------------- */
function formatINR(amount) {
  const v = Number(amount) || 0;
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(v);
  } catch {
    return `₹${v}`;
  }
}

function formatTimestamp(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return d.toString();
  }
}

function DonationsTab({ draft, update }) {
  const { entries, deleteEntry, clearAll } = useDonationLog();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [exporting, setExporting] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((row) => {
      if (statusFilter !== "all" && row.emailStatus !== statusFilter) return false;
      if (!q) return true;
      const haystack = [row.name, row.phone, row.email, row.receiptId, String(row.amount)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [entries, query, statusFilter]);

  const totalAmount = useMemo(
    () => filtered.reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    [filtered],
  );

  const totalAll = useMemo(
    () => entries.reduce((sum, r) => sum + (Number(r.amount) || 0), 0),
    [entries],
  );

  const sentCount = useMemo(
    () => entries.filter((r) => r.emailStatus === "sent").length,
    [entries],
  );
  const failedCount = useMemo(
    () => entries.filter((r) => r.emailStatus === "failed").length,
    [entries],
  );
  const pendingCount = useMemo(
    () => entries.filter((r) => r.emailStatus === "pending").length,
    [entries],
  );

  const handleExportPdf = async () => {
    setErrorMsg("");
    setExporting("pdf");
    try {
      await exportDonationsToPdf(filtered);
    } catch (err) {
      console.error("PDF export failed", err);
      setErrorMsg("PDF export failed: " + (err.message || "unknown error"));
    } finally {
      setExporting(null);
    }
  };

  const handleExportExcel = async () => {
    setErrorMsg("");
    setExporting("xlsx");
    try {
      await exportDonationsToExcel(filtered);
    } catch (err) {
      console.error("Excel export failed", err);
      setErrorMsg("Excel export failed: " + (err.message || "unknown error"));
    } finally {
      setExporting(null);
    }
  };

  const handleExportCsv = async () => {
    setErrorMsg("");
    setExporting("csv");
    try {
      exportDonationsToCsv(filtered);
    } catch (err) {
      console.error("CSV export failed", err);
      setErrorMsg("CSV export failed: " + (err.message || "unknown error"));
    } finally {
      setExporting(null);
    }
  };

  const handleDelete = (id, name) => {
    if (
      window.confirm(
        `${name || "This entry"} — பதிவை நீக்கவா? Delete this donation log entry? This cannot be undone.`,
      )
    ) {
      deleteEntry(id);
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        "அனைத்து தான பதிவுகளையும் நீக்கவா? Clear ALL donation logs? This cannot be undone.",
      )
    ) {
      clearAll();
    }
  };

  return (
    <div className="space-y-5">
      {/* UPI & Payment Settings */}
      <SectionCard titleTamil="UPI & கட்டண அமைப்பு" titleEn="UPI & Payment Settings">
        <p className="text-xs sm:text-sm font-tamil-sans text-ink/70 leading-relaxed">
          தானம் பக்கத்தில் காட்டப்படும் UPI ID மற்றும் QR குறியீட்டை இங்கே மாற்றலாம்.
          மாற்றங்களை சேமிக்க மேலே <strong className="text-vermillion">சேமி</strong> பொத்தானை அழுத்தவும்.{" "}
          <span className="text-ink/50 font-display italic">
            Edit the UPI ID and QR code shown on the donation page. Save using the Save button above.
          </span>
        </p>
        <Field
          labelTamil="UPI ID"
          labelEn="UPI ID (e.g. name@bank)"
          value={draft?.payment?.upiId ?? ""}
          onChange={(v) => update(["payment", "upiId"], v)}
          placeholder="yourname@okicici"
        />
        <div className="mt-2">
          <div className="mb-2 flex flex-wrap items-baseline gap-2 font-tamil-sans text-sm font-semibold text-ink/80">
            <span className="font-tamil">UPI QR குறியீடு</span>
            <span className="text-ink/40 font-display italic text-xs">/ UPI QR Code Image</span>
          </div>
          <ImageSlot
            labelTamil="QR படம்"
            labelEn="QR Code"
            current={draft?.payment?.upiQrImage ?? null}
            defaultImg={upiQrDefault}
            onChange={(v) => update(["payment", "upiQrImage"], v)}
            onClear={() => update(["payment", "upiQrImage"], null)}
          />
        </div>
      </SectionCard>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={<HandCoins size={18} className="text-vermillion" />}
          labelTamil="மொத்த பதிவுகள்"
          labelEn="Total entries"
          value={String(entries.length)}
        />
        <StatCard
          icon={<IndianRupee size={18} className="text-brass-deep" />}
          labelTamil="மொத்த தொகை"
          labelEn="Total amount"
          value={formatINR(totalAll)}
        />
        <StatCard
          icon={<MailIcon size={18} className="text-emerald-700" />}
          labelTamil="அனுப்பப்பட்டவை"
          labelEn="Emails sent"
          value={String(sentCount)}
        />
        <StatCard
          icon={<AlertTriangle size={18} className="text-amber-700" />}
          labelTamil="தோல்வி / நிலுவை"
          labelEn="Failed / pending"
          value={`${failedCount} / ${pendingCount}`}
        />
      </div>

      <SectionCard
        titleTamil="தான பதிவுகள் & ஏற்றுமதி"
        titleEn="Donation Log & Export"
      >
        <p className="text-xs sm:text-sm font-tamil-sans text-ink/70 leading-relaxed">
          இந்த பகுதியில் தான படிவத்தை சமர்ப்பித்த பக்தர்களின் முழு விவரங்களும் காட்டப்படும்.
          PDF அல்லது Excel ஃபார்மட்டில் ஏற்றுமதி செய்யலாம், ஒவ்வொரு பதிவையும் நீக்கலாம்.
          <br />
          <span className="text-ink/50 font-display italic">
            All donation form submissions are listed below. Filter, search, delete or export
            them as a PDF / Excel sheet.
          </span>
        </p>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2 items-center flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="பெயர் / எண் / ரசீது தேடு · Search"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-brass/40 bg-parchment/80 text-sm font-tamil-sans focus:outline-none focus:ring-2 focus:ring-vermillion/40 focus:border-vermillion"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-brass/40 bg-parchment/80 text-sm font-tamil-sans focus:outline-none focus:ring-2 focus:ring-vermillion/40 focus:border-vermillion"
            >
              <option value="all">அனைத்தும் · All</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={exporting === "pdf" || filtered.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-sunset text-parchment text-xs font-tamil-sans font-semibold shadow-brass hover:shadow-temple disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <FileText size={14} />
              {exporting === "pdf" ? "தயாராகிறது..." : "PDF"}
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={exporting === "xlsx" || filtered.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-brass-deep text-ink text-xs font-tamil-sans font-semibold hover:bg-brass/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <FileSpreadsheet size={14} />
              {exporting === "xlsx" ? "தயாராகிறது..." : "Excel"}
            </button>
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={exporting === "csv" || filtered.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-brass/40 text-ink/80 text-xs font-tamil-sans hover:bg-brass/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Upload size={14} className="rotate-180" />
              CSV
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={entries.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-destructive/40 text-destructive text-xs font-tamil-sans hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Trash2 size={14} /> அனைத்தையும் நீக்கு
            </button>
          </div>
        </div>

        {errorMsg ? (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs sm:text-sm text-destructive font-tamil-sans">
            {errorMsg}
          </div>
        ) : null}

        {/* Result summary */}
        <div className="text-xs sm:text-sm font-tamil-sans text-ink/70">
          {filtered.length} / {entries.length} பதிவுகள் காட்டப்படுகிறது ·{" "}
          <span className="font-semibold text-ink">{formatINR(totalAmount)}</span> totalled.
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-brass/30 bg-parchment/60">
          <table className="w-full min-w-[760px] text-sm font-tamil-sans">
            <thead>
              <tr className="bg-ink text-brass">
                <th className="px-3 py-2 text-left font-display italic text-xs tracking-widest">
                  #
                </th>
                <th className="px-3 py-2 text-left font-display italic text-xs tracking-widest">
                  Submitted
                </th>
                <th className="px-3 py-2 text-left font-display italic text-xs tracking-widest">
                  Receipt
                </th>
                <th className="px-3 py-2 text-left font-display italic text-xs tracking-widest">
                  Donor
                </th>
                <th className="px-3 py-2 text-left font-display italic text-xs tracking-widest">
                  Contact
                </th>
                <th className="px-3 py-2 text-right font-display italic text-xs tracking-widest">
                  Amount
                </th>
                <th className="px-3 py-2 text-left font-display italic text-xs tracking-widest">
                  Email
                </th>
                <th className="px-3 py-2 text-right font-display italic text-xs tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-ink/60 font-tamil-sans text-sm"
                  >
                    {entries.length === 0
                      ? "இதுவரை எந்த தான படிவமும் சமர்ப்பிக்கப்படவில்லை. No donations submitted yet."
                      : "தேடல் / வடிகட்டலுக்குத் தகுந்த பதிவுகள் இல்லை. No matching entries."}
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={row.id}
                    className={
                      "border-t border-brass/20 " +
                      (i % 2 === 0 ? "bg-parchment/40" : "bg-parchment/70")
                    }
                  >
                    <td className="px-3 py-2 align-top text-ink/70 text-xs">
                      {i + 1}
                    </td>
                    <td className="px-3 py-2 align-top whitespace-nowrap text-ink/85">
                      <div className="flex items-start gap-1.5">
                        <CalendarClock
                          size={13}
                          className="mt-0.5 shrink-0 text-brass-deep"
                        />
                        <span>{formatTimestamp(row.submittedAt)}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top whitespace-nowrap text-ink/80">
                      <div className="flex items-start gap-1.5">
                        <Hash size={12} className="mt-0.5 shrink-0 text-brass-deep" />
                        <span className="font-mono text-xs">{row.receiptId}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top text-ink font-semibold">
                      {row.name || "—"}
                    </td>
                    <td className="px-3 py-2 align-top text-ink/85 text-xs">
                      <div className="flex items-center gap-1.5">
                        <PhoneIcon size={11} className="text-brass-deep" />
                        <span>{row.phone || "—"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MailIcon size={11} className="text-brass-deep" />
                        <a
                          href={`mailto:${row.email}`}
                          className="hover:underline break-all"
                        >
                          {row.email || "—"}
                        </a>
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top text-right text-ink font-semibold whitespace-nowrap">
                      {formatINR(row.amount)}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <EmailStatusBadge status={row.emailStatus} error={row.emailError} />
                    </td>
                    <td className="px-3 py-2 align-top text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id, row.name)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition"
                        title="Delete · நீக்கு"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

function StatCard({ icon, labelTamil, labelEn, value }) {
  return (
    <div className="rounded-2xl border border-brass/30 bg-card/95 shadow-soft p-4">
      <div className="flex items-center gap-2 text-ink/60">
        {icon}
        <div className="font-tamil text-xs sm:text-sm font-semibold text-ink/80">
          {labelTamil}
        </div>
      </div>
      <div className="mt-1 font-display italic text-[0.65rem] tracking-widest text-brass-deep">
        / {labelEn}
      </div>
      <div className="mt-2 font-tamil text-xl sm:text-2xl font-bold text-ink leading-tight">
        {value}
      </div>
    </div>
  );
}

function EmailStatusBadge({ status, error }) {
  if (status === "sent") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[0.7rem] font-tamil-sans">
        <Check size={11} /> Sent
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 border border-destructive/40 text-destructive text-[0.7rem] font-tamil-sans"
        title={error || "Email send failed"}
      >
        <AlertTriangle size={11} /> Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[0.7rem] font-tamil-sans">
      <Loader2Inline /> Pending
    </span>
  );
}

function Loader2Inline() {
  return (
    <span
      aria-hidden
      className="inline-block w-2.5 h-2.5 rounded-full border-2 border-amber-700 border-t-transparent animate-spin"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  ACCOUNT TAB                                                               */
/* -------------------------------------------------------------------------- */
function AccountTab({ credentials, updateCredentials }) {
  const [userId, setUserId] = useState(credentials.userId);
  const [password, setPassword] = useState(credentials.password);
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setUserId(credentials.userId);
    setPassword(credentials.password);
  }, [credentials]);

  const onSave = (e) => {
    e.preventDefault();
    setMsg("");
    if (!userId.trim() || !password.trim()) {
      setMsg("பயனர் பெயர் மற்றும் கடவுச்சொல் காலியாக இருக்கக்கூடாது.");
      return;
    }
    if (password !== confirm && confirm !== "") {
      setMsg("கடவுச்சொற்கள் பொருந்தவில்லை. Passwords do not match.");
      return;
    }
    updateCredentials({ userId: userId.trim(), password });
    setMsg("கணக்கு புதுப்பிக்கப்பட்டது. Account updated.");
    setConfirm("");
  };

  return (
    <SectionCard titleTamil="நிர்வாகி கணக்கு" titleEn="Admin Account">
      <p className="text-xs sm:text-sm font-tamil-sans text-ink/70">
        இங்கே நீங்கள் நிர்வாகி பயனர் பெயர் மற்றும் கடவுச்சொல்லை மாற்றலாம். இவை இந்த உலாவியில்
        மட்டும் சேமிக்கப்படுகின்றன.
      </p>
      <form onSubmit={onSave} className="space-y-4">
        <Field labelTamil="பயனர் பெயர்" labelEn="User ID" value={userId} onChange={setUserId} />
        <PasswordField
          labelTamil="புதிய கடவுச்சொல்"
          labelEn="New password"
          value={password}
          onChange={setPassword}
        />
        <PasswordField
          labelTamil="கடவுச்சொல்லை உறுதிப்படுத்தவும்"
          labelEn="Confirm password"
          value={confirm}
          onChange={setConfirm}
        />
        {msg && (
          <div className="rounded-xl border border-brass/40 bg-brass/10 px-4 py-2 text-xs sm:text-sm text-ink/80 font-tamil-sans">
            {msg}
          </div>
        )}
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-sunset text-parchment font-tamil font-semibold text-xs sm:text-sm shadow-brass hover:shadow-temple transition-all"
        >
          <Save size={14} /> கணக்கைச் சேமி · Save account
        </button>
      </form>

      <div className="mt-2 rounded-xl border border-brass/20 bg-parchment/50 p-3 text-[0.7rem] sm:text-xs font-tamil-sans text-ink/60">
        <strong className="text-vermillion">இயல்புநிலை அறிமுகம் / Defaults:</strong>{" "}
        <code className="font-mono">{DEFAULT_CREDENTIALS.userId}</code> /{" "}
        <code className="font-mono">{DEFAULT_CREDENTIALS.password}</code>
      </div>
    </SectionCard>
  );
}
