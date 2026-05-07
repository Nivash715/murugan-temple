import { useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";

const FLAG_KEY = "temple-logout-toast";

/**
 * Notifies the user — in the public site — that they were just logged out
 * of the admin panel. The admin page sets a sessionStorage flag right before
 * navigating to "/", and this component picks it up on mount.
 */
export function LogoutToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const flag = window.sessionStorage.getItem(FLAG_KEY);
      if (flag === "1") {
        window.sessionStorage.removeItem(FLAG_KEY);
        setVisible(true);
        const t = setTimeout(() => setVisible(false), 4500);
        return () => clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-24 right-4 sm:right-6 z-[60] animate-[float-slow_0.5s_ease]">
      <div className="flex items-start gap-3 rounded-2xl border border-brass/40 bg-card/95 backdrop-blur shadow-temple px-4 sm:px-5 py-3 sm:py-3.5 max-w-xs sm:max-w-sm">
        <div className="mt-0.5 inline-flex items-center justify-center h-8 w-8 rounded-full bg-vermillion/15 text-vermillion shrink-0">
          <ShieldCheck size={18} />
        </div>
        <div className="leading-tight">
          <div className="font-tamil text-sm sm:text-base font-bold text-ink">
            நிர்வாகத்திலிருந்து வெளியேறிவிட்டீர்கள்
          </div>
          <div className="font-display italic text-xs sm:text-sm text-brass-deep">
            You have been signed out of the admin panel.
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          className="ml-1 inline-flex items-center justify-center h-7 w-7 rounded-full text-ink/60 hover:bg-brass/10 hover:text-ink shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/** Set the flag right before navigating away from the admin panel. */
export function triggerLogoutToast() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(FLAG_KEY, "1");
  } catch {
    /* ignore */
  }
}
