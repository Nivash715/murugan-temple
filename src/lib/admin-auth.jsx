import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  updateEmail,
} from "firebase/auth";
import { auth } from "./firebase";

/* -------------------------------------------------------------------------- */
/*  Admin auth — powered by Firebase Authentication (email / password).       */
/*                                                                            */
/*  Setup (one-time, in Firebase Console):                                    */
/*    Authentication → Sign-in method → Email/Password → Enable              */
/*    Authentication → Users → Add user  (your admin email + password)       */
/* -------------------------------------------------------------------------- */

// Exported for backward-compat with admin.jsx AccountTab "defaults" note.
// With Firebase Auth there are no hard-coded defaults — set the account in
// the Firebase Console before first use.
export const DEFAULT_CREDENTIALS = {
  userId: "admin@yourtemple.com",
  password: "",
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);

  // Listen for Firebase auth state changes (persists across page reloads)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsAuthed(!!user);
    });
    return unsubscribe;
  }, []);

  /** Sign in with email + password via Firebase Auth */
  const login = useCallback(async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: "தவறான மின்னஞ்சல் அல்லது கடவுச்சொல் (Invalid email or password)",
      };
    }
  }, []);

  /** Sign out */
  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  /**
   * Update the admin's email and/or password via Firebase Auth.
   * Requires a recent sign-in; if the session is too old Firebase will throw
   * an error and the change will be skipped.
   */
  const updateCredentials = useCallback(
    async ({ userId: newEmail, password: newPassword }) => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        if (newEmail && newEmail !== user.email) {
          await updateEmail(user, newEmail);
        }
        if (newPassword && newPassword.length >= 6) {
          await updatePassword(user, newPassword);
        }
      } catch (err) {
        console.error("updateCredentials error:", err);
      }
    },
    [],
  );

  // Expose credentials in the same shape as before so admin.jsx doesn't change
  const credentials = useMemo(
    () => ({
      userId: firebaseUser?.email ?? DEFAULT_CREDENTIALS.userId,
      password: "",
    }),
    [firebaseUser],
  );

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
      login: async () => ({ ok: false, error: "Auth not ready" }),
      logout: async () => {},
      updateCredentials: async () => {},
    };
  }
  return ctx;
}
