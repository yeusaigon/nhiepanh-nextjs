"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User } from "firebase/auth";
import { getAuth } from "@/lib/firebase";

let _fbAuth: typeof import("firebase/auth") | null = null;

async function loadFbAuth() {
  if (!_fbAuth) {
    _fbAuth = await import("firebase/auth");
  }
  return _fbAuth;
}

type AuthContextType = {
  user: User | null; loading: boolean;
  signInWithGoogle: () => Promise<void>; signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const auth = await getAuth();
      if (!auth || cancelled) { setLoading(false); return; }
      const fb = await loadFbAuth();
      if (!fb || cancelled) { setLoading(false); return; }
      const unsub = fb.onAuthStateChanged(auth, (u) => {
        if (!cancelled) { setUser(u); setLoading(false); }
      });
      return () => { unsub(); };
    })();
    return () => { cancelled = true; };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const [auth, fb] = await Promise.all([getAuth(), loadFbAuth()]);
    if (!auth || !fb) throw new Error("Firebase not available");
    await fb.signInWithPopup(auth, new fb.GoogleAuthProvider());
  }, []);

  const signOut = useCallback(async () => {
    const [auth, fb] = await Promise.all([getAuth(), loadFbAuth()]);
    if (!auth || !fb) throw new Error("Firebase not available");
    await fb.signOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
