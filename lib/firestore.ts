import {
  collection, query, where, orderBy, limit, getDocs, getDoc, doc,
  addDoc, updateDoc, deleteDoc, increment, writeBatch, Timestamp
} from "firebase/firestore";
import { db, isFirebaseConfigured, withTimeout } from "./firebase";
import { Album, Photo, SiteSettings, ADMIN_EMAIL } from "@/types";
import { MOCK_ALBUMS, MOCK_PHOTOS, MOCK_SETTINGS } from "./mock-data";

export async function getPublicAlbums(): Promise<Album[]> {
  if (!isFirebaseConfigured) return MOCK_ALBUMS.filter(a => a.is_public);
  try {
    const q = query(collection(db, "albums"), where("is_public", "==", true), orderBy("created_at", "desc"));
    const snap = await withTimeout(getDocs(q), 5000, "albums");
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Album));
  } catch { return MOCK_ALBUMS.filter(a => a.is_public); }
}

export async function getFeaturedAlbums(): Promise<Album[]> {
  if (!isFirebaseConfigured) return MOCK_ALBUMS.filter(a => a.is_featured).sort((a, b) => b.view_count - a.view_count);
  try {
    const q = query(collection(db, "albums"), where("is_featured", "==", true), where("is_public", "==", true), orderBy("view_count", "desc"), limit(6));
    const snap = await withTimeout(getDocs(q), 5000, "featured");
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Album));
  } catch { return MOCK_ALBUMS.filter(a => a.is_featured).sort((a, b) => b.view_count - a.view_count); }
}

export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  if (!isFirebaseConfigured) return MOCK_ALBUMS.find(a => a.slug === slug) || null;
  try {
    const q = query(collection(db, "albums"), where("slug", "==", slug), limit(1));
    const snap = await withTimeout(getDocs(q), 5000, "album");
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Album;
  } catch { return MOCK_ALBUMS.find(a => a.slug === slug) || null; }
}

export async function getPhotos(albumId: string): Promise<Photo[]> {
  if (!isFirebaseConfigured) return MOCK_PHOTOS[albumId] || [];
  try {
    const q = query(collection(db, "photos"), where("album_id", "==", albumId), orderBy("display_order", "asc"));
    const snap = await withTimeout(getDocs(q), 5000, "photos");
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Photo));
  } catch { return MOCK_PHOTOS[albumId] || []; }
}

export async function getRelatedAlbums(currentSlug: string, category: string): Promise<Album[]> {
  if (!isFirebaseConfigured) return MOCK_ALBUMS.filter(a => a.slug !== currentSlug && a.is_public).slice(0, 4);
  try {
    const q = query(collection(db, "albums"), where("category", "==", category), where("is_public", "==", true), orderBy("created_at", "desc"), limit(5));
    const snap = await withTimeout(getDocs(q), 5000, "related");
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Album)).filter(a => a.slug !== currentSlug).slice(0, 4);
  } catch { return MOCK_ALBUMS.filter(a => a.slug !== currentSlug).slice(0, 4); }
}

export async function getAlbumsByCategory(category: string): Promise<Album[]> {
  if (!isFirebaseConfigured) return MOCK_ALBUMS.filter(a => a.category === category && a.is_public);
  try {
    const q = query(collection(db, "albums"), where("category", "==", category), where("is_public", "==", true), orderBy("created_at", "desc"));
    const snap = await withTimeout(getDocs(q), 5000, "category");
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Album));
  } catch { return MOCK_ALBUMS.filter(a => a.category === category && a.is_public); }
}

export async function getAdminAlbums(userId: string): Promise<Album[]> {
  if (!isFirebaseConfigured) return MOCK_ALBUMS;
  try {
    const q = query(collection(db, "albums"), where("user_id", "==", userId), orderBy("created_at", "desc"));
    const snap = await withTimeout(getDocs(q), 5000, "admin-albums");
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Album));
  } catch { return MOCK_ALBUMS; }
}

export async function getSettings(): Promise<SiteSettings> {
  if (!isFirebaseConfigured) return MOCK_SETTINGS;
  try {
    const snap = await withTimeout(getDoc(doc(db, "settings", "site")), 5000, "settings");
    if (!snap.exists()) return MOCK_SETTINGS;
    return snap.data() as SiteSettings;
  } catch { return MOCK_SETTINGS; }
}

export async function incrementViewCount(albumId: string) {
  if (!isFirebaseConfigured) return;
  try { await withTimeout(updateDoc(doc(db, "albums", albumId), { view_count: increment(1) }), 3000); } catch {}
}

// Admin CRUD
export async function createAlbum(data: Record<string, any>) {
  const now = new Date().toISOString();
  return addDoc(collection(db, "albums"), { ...data, created_at: now, updated_at: now });
}
export async function updateAlbum(id: string, data: Partial<Album>) {
  return updateDoc(doc(db, "albums", id), { ...data, updated_at: new Date().toISOString() });
}
export async function deleteAlbum(id: string) {
  const q = query(collection(db, "photos"), where("album_id", "==", id));
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  batch.delete(doc(db, "albums", id));
  return batch.commit();
}
export async function createPhoto(data: Omit<Photo, "id" | "created_at">) {
  const now = new Date().toISOString();
  return addDoc(collection(db, "photos"), { ...data, created_at: now });
}
export async function updatePhoto(id: string, data: Partial<Photo>) {
  return updateDoc(doc(db, "photos", id), data);
}
export async function deletePhoto(id: string) {
  return deleteDoc(doc(db, "photos", id));
}
export async function saveSettings(data: Partial<SiteSettings>) {
  return updateDoc(doc(db, "settings", "site"), { ...data, updated_at: new Date().toISOString() });
}
export async function seedData(userId: string) {
  const batch = writeBatch(db);
  const albumIdMap: Record<string, string> = {};

  // 1. Create albums
  for (const a of MOCK_ALBUMS) {
    const ref = doc(collection(db, "albums"));
    albumIdMap[a.id] = ref.id;
    const { id, ...rest } = a;
    batch.set(ref, { ...rest, user_id: userId, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
  }

  // 2. Create photos with correct album references
  for (const [mockAlbumId, photoList] of Object.entries(MOCK_PHOTOS)) {
    const realAlbumId = albumIdMap[mockAlbumId];
    if (!realAlbumId) continue;
    for (const p of photoList) {
      const ref = doc(collection(db, "photos"));
      const { id, album_id, ...rest } = p;
      batch.set(ref, { ...rest, album_id: realAlbumId, created_at: new Date().toISOString() });
    }
  }

  // 3. Create settings document
  batch.set(doc(db, "settings", "site"), { ...MOCK_SETTINGS, updated_at: new Date().toISOString() });

  await batch.commit();
}
