import { isFirebaseConfigured, getDb, getAuth } from "./firebase";
import { Album, Photo, SiteSettings } from "@/types";
import { MOCK_ALBUMS, MOCK_PHOTOS, MOCK_SETTINGS } from "./mock-data";

// Lazy-load firestore functions (avoids "self is not defined" during static export)
let _firestore: typeof import("firebase/firestore") | null = null;

// Memory Cache for optimization and cost reduction
let cachedPublicAlbums: Album[] | null = null;
let cachedFeaturedAlbums: Album[] | null = null;
let cachedSettings: SiteSettings | null = null;
const cachePhotos = new Map<string, Photo[]>();
const cacheAlbumsBySlug = new Map<string, Album | null>();

export function clearFirestoreCache() {
  cachedPublicAlbums = null;
  cachedFeaturedAlbums = null;
  cachedSettings = null;
  cachePhotos.clear();
  cacheAlbumsBySlug.clear();
}

async function getFirestore() {
  if (!_firestore) {
    _firestore = await import("firebase/firestore");
  }
  return _firestore;
}

async function fb() {
  const [db, fs] = await Promise.all([getDb(), getFirestore()]);
  if (!db || !fs) return null;
  return { db, ...fs };
}

export async function getPublicAlbums(): Promise<Album[]> {
  if (cachedPublicAlbums) return cachedPublicAlbums;
  if (!isFirebaseConfigured) return MOCK_ALBUMS.filter(a => a.is_public);
  const f = await fb(); if (!f) return MOCK_ALBUMS.filter(a => a.is_public);
  try {
    const q = f.query(f.collection(f.db, "albums"), f.where("is_public", "==", true), f.orderBy("created_at", "desc"));
    const snap = await f.getDocs(q);
    const albums = snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Album));
    cachedPublicAlbums = albums;
    return albums;
  } catch (err) {
    console.error("Firestore error in getPublicAlbums:", err);
    return MOCK_ALBUMS.filter(a => a.is_public);
  }
}

export async function getFeaturedAlbums(): Promise<Album[]> {
  if (cachedFeaturedAlbums) return cachedFeaturedAlbums;
  if (!isFirebaseConfigured) return MOCK_ALBUMS.filter(a => a.is_featured).sort((a, b) => b.view_count - a.view_count);
  const f = await fb(); if (!f) return MOCK_ALBUMS.filter(a => a.is_featured).sort((a, b) => b.view_count - a.view_count);
  try {
    const q = f.query(f.collection(f.db, "albums"), f.where("is_featured", "==", true), f.where("is_public", "==", true), f.orderBy("view_count", "desc"), f.limit(10));
    const snap = await f.getDocs(q);
    const albums = snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Album));
    cachedFeaturedAlbums = albums;
    return albums;
  } catch (err) {
    console.error("Firestore error in getFeaturedAlbums:", err);
    return MOCK_ALBUMS.filter(a => a.is_featured).sort((a, b) => b.view_count - a.view_count);
  }
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  const authInstance = await getAuth();
  const currentUser = authInstance?.currentUser;
  const isAdmin = currentUser?.email === "vietnam.tri@gmail.com";
  
  if (!isAdmin && cacheAlbumsBySlug.has(slug)) return cacheAlbumsBySlug.get(slug)!;
  
  if (!isFirebaseConfigured) return MOCK_ALBUMS.find(a => a.slug === slug) || null;
  const f = await fb(); if (!f) return MOCK_ALBUMS.find(a => a.slug === slug) || null;
  try {
    let q;
    if (isAdmin) {
      q = f.query(f.collection(f.db, "albums"), f.where("slug", "==", slug), f.limit(1));
    } else {
      q = f.query(f.collection(f.db, "albums"), f.where("slug", "==", slug), f.where("is_public", "==", true), f.limit(1));
    }

    const snap = await f.getDocs(q);
    if (snap.empty) return null;
    const album = { id: snap.docs[0].id, ...snap.docs[0].data() } as Album;
    if (!isAdmin) cacheAlbumsBySlug.set(slug, album);
    return album;
  } catch (err) {
    console.error("Firestore error in getAlbumBySlug:", err);
    return MOCK_ALBUMS.find(a => a.slug === slug) || null;
  }
}

export async function getPhotos(albumId: string): Promise<Photo[]> {
  if (cachePhotos.has(albumId)) return cachePhotos.get(albumId)!;
  if (!isFirebaseConfigured) return MOCK_PHOTOS[albumId] || [];
  const f = await fb(); if (!f) return MOCK_PHOTOS[albumId] || [];
  try {
    const q = f.query(f.collection(f.db, "photos"), f.where("album_id", "==", albumId));
    const snap = await f.getDocs(q);
    const photos = snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Photo));
    const sorted = photos.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
    cachePhotos.set(albumId, sorted);
    return sorted;
  } catch (err) {
    console.error("Firestore error in getPhotos:", err);
    return MOCK_PHOTOS[albumId] || [];
  }
}

export async function getRelatedAlbums(currentSlug: string, category: string): Promise<Album[]> {
  if (!isFirebaseConfigured) return MOCK_ALBUMS.filter(a => a.slug !== currentSlug && a.is_public).slice(0, 4);
  const f = await fb(); if (!f) return MOCK_ALBUMS.filter(a => a.slug !== currentSlug && a.is_public).slice(0, 4);
  try {
    const q = f.query(f.collection(f.db, "albums"), f.where("category", "==", category), f.where("is_public", "==", true), f.orderBy("created_at", "desc"), f.limit(5));
    const snap = await f.getDocs(q);
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Album)).filter((a: Album) => a.slug !== currentSlug).slice(0, 4);
  } catch { return MOCK_ALBUMS.filter(a => a.slug !== currentSlug).slice(0, 4); }
}

export async function getAlbumsByCategory(category: string): Promise<Album[]> {
  if (!isFirebaseConfigured) return MOCK_ALBUMS.filter(a => a.category === category && a.is_public);
  const f = await fb(); if (!f) return MOCK_ALBUMS.filter(a => a.category === category && a.is_public);
  try {
    const q = f.query(f.collection(f.db, "albums"), f.where("category", "==", category), f.where("is_public", "==", true), f.orderBy("created_at", "desc"));
    const snap = await f.getDocs(q);
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Album));
  } catch { return MOCK_ALBUMS.filter(a => a.category === category && a.is_public); }
}

export async function getAdminAlbums(userId: string): Promise<Album[]> {
  if (!isFirebaseConfigured) return MOCK_ALBUMS;
  const f = await fb(); if (!f) return MOCK_ALBUMS;
  try {
    // Admin có quyền đọc tất cả albums (kể cả private) theo Security Rules.
    // Không filter theo user_id vì Firestore sẽ block nếu có album private trong kết quả.
    const q = f.query(f.collection(f.db, "albums"), f.orderBy("created_at", "desc"));
    const snap = await f.getDocs(q);
    return snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Album));
  } catch (err) {
    console.error("Firestore error in getAdminAlbums:", err);
    return MOCK_ALBUMS;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  if (cachedSettings) return cachedSettings;
  if (!isFirebaseConfigured) return MOCK_SETTINGS;
  const f = await fb(); if (!f) return MOCK_SETTINGS;
  try {
    const snap = await f.getDoc(f.doc(f.db, "settings", "site"));
    if (!snap.exists()) return MOCK_SETTINGS;
    const settings = snap.data() as SiteSettings;
    cachedSettings = settings;
    return settings;
  } catch { return MOCK_SETTINGS; }
}

export async function incrementViewCount(albumId: string) {
  if (!isFirebaseConfigured) return;
  const f = await fb(); if (!f) return;
  try { await f.updateDoc(f.doc(f.db, "albums", albumId), { view_count: f.increment(1) }); } catch {}
}

export async function createAlbum(data: Record<string, any>) {
  clearFirestoreCache();
  const f = await fb(); if (!f) throw new Error("Firebase not available");
  const now = new Date().toISOString();
  return f.addDoc(f.collection(f.db, "albums"), { ...data, created_at: now, updated_at: now });
}
export async function updateAlbum(id: string, data: Partial<Album>) {
  clearFirestoreCache();
  const f = await fb(); if (!f) throw new Error("Firebase not available");
  return f.updateDoc(f.doc(f.db, "albums", id), { ...data, updated_at: new Date().toISOString() });
}
export async function deleteAlbum(id: string) {
  clearFirestoreCache();
  const f = await fb(); if (!f) throw new Error("Firebase not available");
  const q = f.query(f.collection(f.db, "photos"), f.where("album_id", "==", id));
  const snap = await f.getDocs(q);
  const batch = f.writeBatch(f.db);
  snap.docs.forEach((d: any) => batch.delete(d.ref));
  batch.delete(f.doc(f.db, "albums", id));
  return batch.commit();
}
export async function createPhoto(data: Omit<Photo, "id" | "created_at">) {
  const f = await fb(); if (!f) throw new Error("Firebase not available");
  const now = new Date().toISOString();
  return f.addDoc(f.collection(f.db, "photos"), { ...data, created_at: now });
}
export async function updatePhoto(id: string, data: Partial<Photo>) {
  const f = await fb(); if (!f) throw new Error("Firebase not available");
  return f.updateDoc(f.doc(f.db, "photos", id), data);
}
export async function deletePhoto(id: string) {
  const f = await fb(); if (!f) throw new Error("Firebase not available");
  return f.deleteDoc(f.doc(f.db, "photos", id));
}
export async function saveSettings(data: Partial<SiteSettings>) {
  clearFirestoreCache();
  const f = await fb(); if (!f) throw new Error("Firebase not available");
  return f.updateDoc(f.doc(f.db, "settings", "site"), { ...data, updated_at: new Date().toISOString() });
}
export async function seedData(userId: string) {
  const f = await fb(); if (!f) throw new Error("Firebase not available");
  const batch = f.writeBatch(f.db);
  const albumIdMap: Record<string, string> = {};

  for (const a of MOCK_ALBUMS) {
    const ref = f.doc(f.collection(f.db, "albums"));
    albumIdMap[a.id] = ref.id;
    const { id, ...rest } = a;
    batch.set(ref, { ...rest, user_id: userId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }

  for (const [mockAlbumId, photoList] of Object.entries(MOCK_PHOTOS)) {
    const realAlbumId = albumIdMap[mockAlbumId];
    if (!realAlbumId) continue;
    for (const p of photoList) {
      const ref = f.doc(f.collection(f.db, "photos"));
      const { id, album_id, ...rest } = p;
      batch.set(ref, { ...rest, album_id: realAlbumId, created_at: new Date().toISOString() });
    }
  }

  batch.set(f.doc(f.db, "settings", "site"), { ...MOCK_SETTINGS, updated_at: new Date().toISOString() });
  await batch.commit();
}
