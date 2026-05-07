import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  DEFAULT EDITABLE CONTENT                                                  */
/* -------------------------------------------------------------------------- */
/*  Everything the admin can edit lives inside this object.                   */
/*  Each route reads from this store via the `useContent()` hook.             */
/* -------------------------------------------------------------------------- */

export const defaultContent = {
  // ---------------- Site-wide header ----------------
  header: {
    titleTamil: "ஸ்ரீ சுப்பிரமணியர் ஆலயம்",
    titleEn: "SRI SUBRAMANIYAR TEMPLE",
    nav: [
      { to: "/", label: "முகப்பு", sub: "Home" },
      { to: "/temple-history", label: "வரலாறு", sub: "History" },
      { to: "/sthala-puranam", label: "புராணம்", sub: "Puranam" },
      { to: "/temple-structure", label: "அமைப்பு", sub: "Structure" },
      { to: "/deities", label: "தெய்வங்கள்", sub: "Deities" },
      { to: "/events", label: "நிகழ்ச்சிகள்", sub: "Events" },
      { to: "/festivals", label: "விழாக்கள்", sub: "Festivals" },
      { to: "/calendar", label: "நாட்காட்டி", sub: "Calendar" },
      { to: "/priest", label: "அர்ச்சகர்", sub: "Priest" },
      { to: "/donate", label: "தானம்", sub: "Donate" },
    ],
  },

  // ---------------- Home page (route: /) ----------------
  home: {
    heroTamilLine1: "வேலனின்",
    heroTamilLine2: "புனிதத் தலம்",
    heroEnTagline: "A living chronicle of devotion to Murugan",
    heroDescription:
      "வேல், மயில், சேவல் கொடியுடன் காட்சி தரும் ஆறுமுகனின் அருளை நாடி, நூற்றாண்டுகளாக பக்தர்களின் பிரார்த்தனைகளை ஏற்று வரும் இந்த புனித முருகன் தலத்தின் வரலாற்றை, புராணத்தை, விழாக்களை அறியுங்கள்.",
    primaryCta: "வரலாற்றை அறியுங்கள்",
    secondaryCta: "பஞ்சாங்கம் காண்க",
    chaptersEyebrow: "CHAPTERS · அத்தியாயங்கள்",
    chaptersTitle: "ஏழு புனித பகுதிகள்",
    chaptersSubtitle: "Seven sacred chapters",
    deityCaptionEn: "SHANMUKHA · ஆறுமுகன்",
    deityCaptionTamil: "ஸ்ரீ முருகப் பெருமான்",
  },

  // ---------------- Page hero blocks (one entry per route) ----------------
  pages: {
    "temple-history": {
      eyebrow: "History · வரலாறு",
      titleTamil: "கோவில் வரலாறு",
      titleEn: "Temple History",
      description:
        "சிறப்புகள், முக்கிய நிகழ்வுகள் மற்றும் காலப்பதிவுகள் — நூற்றாண்டுகளாய் தொடரும் பக்தி பாரம்பரியம்.",
    },
    "sthala-puranam": {
      eyebrow: "Sthala Puranam · ஸ்தல புராணம்",
      titleTamil: "ஸ்தல புராணம்",
      titleEn: "Sacred Lore",
      description:
        "ஆன்மீக முக்கியத்துவம், புராணக் கதைகள் மற்றும் இந்த தலத்தின் பெருமைகள்.",
    },
    "temple-structure": {
      eyebrow: "Architecture · அமைப்பு",
      titleTamil: "ஆலய அமைப்பு",
      titleEn: "Temple Structure",
      description:
        "கோபுரம், மண்டபம், சன்னதி உள்ளிட்ட ஆலய அமைப்பின் நுட்பமான விவரங்கள்.",
    },
    deities: {
      eyebrow: "Deities · தெய்வங்கள்",
      titleTamil: "முக்கிய தெய்வங்கள்",
      titleEn: "Main Deities",
      description: "கணேஷர், முருகன், அம்மன், சிவன், விஷ்ணு — அருள் தரும் தெய்வங்கள்.",
    },
    events: {
      eyebrow: "Events · சேவைகள்",
      titleTamil: "நிகழ்ச்சிகள் & சேவைகள்",
      titleEn: "Daily Worship · Special Events",
      description:
        "தினசரி பூஜை வேளைகள், சிறப்பு நிகழ்வுகள் மற்றும் வரவிருக்கும் விழா அறிவிப்புகள்.",
    },
    festivals: {
      eyebrow: "Festivals · விழாக்கள்",
      titleTamil: "விழாக்கள்",
      titleEn: "Sacred Festivals",
      description:
        "வரவிருக்கும் விழாக்கள், தரிசன வேளைகள் மற்றும் சிறப்பு பூஜைகள்.",
    },
    calendar: {
      eyebrow: "Calendar · நாட்காட்டி",
      titleTamil: "தமிழ் நாட்காட்டி",
      titleEn: "Panchangam Calendar",
      description: "திதி, நட்சத்திரம் மற்றும் பஞ்சாங்க விவரங்கள்.",
    },
    priest: {
      eyebrow: "Management · நிர்வாகம்",
      titleTamil: "அர்ச்சகர் & நிர்வாகம்",
      titleEn: "Priest & Management",
      description: "அர்ச்சகர் விவரம், தொடர்பு மற்றும் நிர்வாக தகவல்கள்.",
    },
    donate: {
      eyebrow: "Donation · தானம்",
      titleTamil: "ஆன்லைன் தானம்",
      titleEn: "Online Donation",
      description: "UPI / QR மூலம் பாதுகாப்பான தானம் — பக்தர்களுக்கான வசதி.",
    },
  },

  // ---------------- Footer ----------------
  footer: {
    templeNameTamil: "ஸ்ரீ வள்ளி தேவசேனா சமய சுப்ரமணியர் ஆலயம்",
    templeNameEn: "Sri Valli Devasena Subramaniyar Temple",
    copyrightTamil: "© 2026 ஸ்ரீ சுப்ரமணியர் ஆலயம் . All Rights Reserved",
  },

  // ---------------- Images (data URLs uploaded via the admin panel) ----------------
  // null means "use the bundled default asset" — components fall back automatically.
  images: {
    logo: null, // header / login screens
    homeHeroDeity: null, // big deity photo on the home hero
    homeCards: {
      // chapter cards on the home page (keyed by route slug)
      "temple-history": null,
      "sthala-puranam": null,
      "temple-structure": null,
      deities: null,
      events: null,
      festivals: null,
      calendar: null,
      priest: null,
      donate: null,
    },
    pageHero: {
      // hero image on each inner page (keyed by route slug)
      "temple-history": null,
      "sthala-puranam": null,
      "temple-structure": null,
      deities: null,
      events: null,
      festivals: null,
      calendar: null,
      priest: null,
      donate: null,
    },
  },

  // ---------------- Calendar notes ----------------
  // { "YYYY-MM-DD": "free-form Tamil/English note" }
  calendarNotes: {},
};

/* -------------------------------------------------------------------------- */
/*  STORE                                                                     */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "temple-content-v1";
const ContentContext = createContext(null);

function deepMerge(target, source) {
  if (Array.isArray(source)) return source;
  if (typeof source !== "object" || source === null) return source;
  const out = { ...(target || {}) };
  for (const key of Object.keys(source)) {
    out[key] = deepMerge(target?.[key], source[key]);
  }
  return out;
}

function loadFromStorage() {
  if (typeof window === "undefined") return defaultContent;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultContent;
    const stored = JSON.parse(raw);
    return deepMerge(defaultContent, stored);
  } catch {
    return defaultContent;
  }
}

export function ContentProvider({ children }) {
  const [content, setContentState] = useState(defaultContent);

  // hydrate from localStorage on the client only
  useEffect(() => {
    setContentState(loadFromStorage());
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setContentState(loadFromStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setContent = useCallback((next) => {
    setContentState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors */
    }
  }, []);

  const resetContent = useCallback(() => {
    setContentState(defaultContent);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ content, setContent, resetContent }),
    [content, setContent, resetContent],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    // Allow direct calls outside the provider (e.g. SSR fallback)
    return { content: defaultContent, setContent: () => {}, resetContent: () => {} };
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  Small helpers that components can use directly                            */
/* -------------------------------------------------------------------------- */

/**
 * Returns the current image override (data URL) for a dotted path inside
 * `content.images`, or `null` if none is set. Example: `useImageOverride("logo")`,
 * `useImageOverride("pageHero.events")`.
 */
export function useImageOverride(path) {
  const { content } = useContent();
  if (!path) return null;
  const parts = path.split(".");
  let node = content.images;
  for (const part of parts) {
    if (node == null) return null;
    node = node[part];
  }
  return node || null;
}

/**
 * Returns the override (data URL) or the supplied default for an image path.
 */
export function useImage(path, fallback) {
  return useImageOverride(path) || fallback;
}

/**
 * Format a Date as YYYY-MM-DD using the local timezone (matches what users
 * see on the calendar grid).
 */
export function toLocalDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

