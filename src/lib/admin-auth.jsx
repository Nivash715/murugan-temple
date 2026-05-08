import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Simple client-side auth for the admin / content management panel.         */
/*  NOTE: This is a frontend-only check intended for site administration on   */
/*  a trusted machine. For real production security, replace this with a      */
/*  proper backend / SSO integration.                                         */
/* -------------------------------------------------------------------------- */

const SESSION_KEY = "temple-admin-session-v1";

// Default admin credentials. The temple admin can change these
// inside the editor (Account / கணக்கு tab) and they will be stored locally.
export const DEFAULT_CREDENTIALS = {
  userId: "admin",
  password: "temple@123",
};

const CREDENTIALS_KEY = "temple-admin-credentials-v1";

function loadCredentials() {
  if (typeof window === "undefined") return DEFAULT_CREDENTIALS;
  try {
    const raw = window.localStorage.getItem(CREDENTIALS_KEY);
    if (!raw) return DEFAULT_CREDENTIALS;
    const parsed = JSON.parse(raw);
    return {
      userId: parsed.userId || DEFAULT_CREDENTIALS.userId,
      password: parsed.password || DEFAULT_CREDENTIALS.password,
    };
  } catch {
    return DEFAULT_CREDENTIALS;
  }
}

function saveCredentials(creds) {
  try {
    window.localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
  } catch {
    /* ignore */
  }
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [credentials, setCredentialsState] = useState(DEFAULT_CREDENTIALS);

  useEffect(() => {
    // hydrate session + credentials on the client
    setCredentialsState(loadCredentials());
    try {
      const s = window.sessionStorage.getItem(SESSION_KEY);
      if (s === "1") setIsAuthed(true);
    } catch {
      /* ignore */
    }
  }, []);

  const login = useCallback((userId, password) => {
    const creds = loadCredentials();
    if (userId === creds.userId && password === creds.password) {
      setIsAuthed(true);
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      return { ok: true };
    }
    return {
      ok: false,
      error: "தவறான பயனர் பெயர் அல்லது கடவுச்சொல் (Invalid user id or password)",
    };
  }, []);

  const logout = useCallback(() => {
    setIsAuthed(false);
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const updateCredentials = useCallback((next) => {
    setCredentialsState(next);
    saveCredentials(next);
  }, []);

  const value = useMemo(
    () => ({ isAuthed, credentials, login, logout, updateCredentials }),
    [isAuthed, credentials, login, logout, updateCredentials],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      isAuthed: false,
      credentials: DEFAULT_CREDENTIALS,
      login: () => ({ ok: false, error: "Auth not ready" }),
      logout: () => {},
      updateCredentials: () => {},
    };
  }
  return ctx;
}
