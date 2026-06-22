export type Album = {
  id: string; slug: string; title: string; description: string; content: string;
  cover_image_url: string; category: string; tags: string[];
  author: string; location: string; date_taken: string;
  is_public: boolean; is_featured: boolean; pin: string | null;
  view_count: number; user_id: string;
  seo_title: string; seo_description: string;
  created_at: string; updated_at: string;
};

export type Photo = {
  id: string; album_id: string; image_url: string; thumbnail_url: string;
  title: string; description: string; alt_text: string;
  display_order: number; created_at: string;
};

export type SiteSettings = {
  site_name: string; site_description: string; logo_url: string;
  author_name: string; author_bio: string; author_avatar: string;
  author_social: { facebook?: string; twitter?: string; instagram?: string; website?: string };
  copyright_text: string; dmca_text: string;
  primary_color: string; updated_at: string;
};

export const CATEGORIES = [
  { slug: "street", name: "Street Photography", icon: "Building2" },
  { slug: "portrait", name: "Portrait", icon: "User" },
  { slug: "landscape", name: "Landscape", icon: "Mountain" },
  { slug: "architecture", name: "Architecture", icon: "Landmark" },
  { slug: "travel", name: "Travel", icon: "Globe" },
  { slug: "macro", name: "Macro", icon: "Eye" },
  { slug: "aerial", name: "Aerial", icon: "Plane" },
  { slug: "film", name: "Film", icon: "Camera" },
] as const;

export const ADMIN_EMAIL = "vietnam.tri@gmail.com";
