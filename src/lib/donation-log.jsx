import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Donation Log Store                                                        */
/*                                                                            */
/*  Persists every submitted donation form locally (browser localStorage) so  */
/*  the admin panel can show a list of contributions, export them to          */
/*  PDF / Excel, and notify the temple administrators.                        */
/*                                                                            */
/*  Schema for a single entry:                                                */
/*    {                                                                       */
/*      id:           string  (uuid-ish)                                      */
/*      receiptId:    string  (matches PDF receipt)                           */
/*      name:         string                                                  */
/*      phone:        string                                                  */
/*      email:        string                                                  */
/*      amount:       number                                                  */
/*      upiId:        string                                                  */
/*      issuedAt:     string  (formatted timestamp shown on receipt)          */
/*      submittedAt:  string  (ISO timestamp)                                 */
/*      emailStatus:  "sent" | "failed" | "pending"                           */
/*      emailError:   string (when failed)                                    */
/*      screenshotName: string                                                */
/*    }                                                                       */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "temple-donation-log-v1";
const DonationLogContext = createContext(null);

function loadFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveToStorage(entries) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* ignore quota errors */
  }
}

function makeId() {
  return (
    "log-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 8)
  );
}

export function DonationLogProvider({ children }) {
  const [entries, setEntries] = useState([]);

  // Hydrate from localStorage on mount; cross-tab sync via storage event.
  useEffect(() => {
    setEntries(loadFromStorage());
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setEntries(loadFromStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addEntry = useCallback((entry) => {
    const id = entry.id || makeId();
    const submittedAt = entry.submittedAt || new Date().toISOString();
    const next = {
      id,
      receiptId: entry.receiptId || "",
      name: entry.name || "",
      phone: entry.phone || "",
      email: entry.email || "",
      amount: Number(entry.amount) || 0,
      upiId: entry.upiId || "",
      issuedAt: entry.issuedAt || "",
      submittedAt,
      emailStatus: entry.emailStatus || "pending",
      emailError: entry.emailError || "",
      screenshotName: entry.screenshotName || "",
    };
    setEntries((prev) => {
      const combined = [next, ...prev];
      saveToStorage(combined);
      return combined;
    });
    return next;
  }, []);

  const updateEntry = useCallback((id, patch) => {
    setEntries((prev) => {
      const next = prev.map((row) => (row.id === id ? { ...row, ...patch } : row));
      saveToStorage(next);
      return next;
    });
  }, []);

  const deleteEntry = useCallback((id) => {
    setEntries((prev) => {
      const next = prev.filter((row) => row.id !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
    saveToStorage([]);
  }, []);

  const value = useMemo(
    () => ({ entries, addEntry, updateEntry, deleteEntry, clearAll }),
    [entries, addEntry, updateEntry, deleteEntry, clearAll],
  );

  return <DonationLogContext.Provider value={value}>{children}</DonationLogContext.Provider>;
}

export function useDonationLog() {
  const ctx = useContext(DonationLogContext);
  if (!ctx) {
    return {
      entries: [],
      addEntry: () => null,
      updateEntry: () => {},
      deleteEntry: () => {},
      clearAll: () => {},
    };
  }
  return ctx;
}
