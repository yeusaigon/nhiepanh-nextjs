const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "mock-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mock.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mock-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mock.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "000",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "mock-app-id",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Lazy-load Firebase to avoid "self is not defined" during static export build.
// All Firebase imports are done via dynamic import() so they only load in the browser.
let _modulesPromise: Promise<{ auth: any; db: any }> | null = null;

async function getModules(): Promise<{ auth: any; db: any }> {
  if (_modulesPromise) return _modulesPromise;

  _modulesPromise = (async () => {
    if (typeof window === "undefined") {
      return { auth: undefined, db: undefined };
    }
    const [fbApp, fbAuth, fbFirestore] = await Promise.all([
      import("firebase/app"),
      import("firebase/auth"),
      import("firebase/firestore"),
    ]);
    const app =
      fbApp.getApps().length > 0 ? fbApp.getApp() : fbApp.initializeApp(firebaseConfig);
    return {
      auth: fbAuth.getAuth(app),
      db: fbFirestore.getFirestore(app),
    };
  })();

  return _modulesPromise;
}

export async function getAuth() {
  return (await getModules()).auth;
}

export async function getDb() {
  return (await getModules()).db;
}

// Keep auth/db as lazy placeholders (will be set after first client-side load).
// Use getAuth()/getDb() for reliable access.
export let auth: any;
export let db: any;

// Pre-warm on client (happens after the module loads in browser)
getModules().then((m) => {
  auth = m.auth;
  db = m.db;
});

export const isFirebaseConfigured =
  !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock-key";

export function withTimeout<T>(p: Promise<T>, ms: number, label?: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(label ? `Timeout: ${label}` : "Timeout")), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }).catch((e) => { clearTimeout(t); reject(e); });
  });
}

export function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
}
