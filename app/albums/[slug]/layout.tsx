import { MOCK_ALBUMS } from "@/lib/mock-data";
import type { Metadata } from "next";

export function generateStaticParams() {
  return MOCK_ALBUMS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const album = MOCK_ALBUMS.find(a => a.slug === slug);
  if (!album) return { title: "Album không tìm thấy" };
  return {
    title: album.seo_title || album.title,
    description: album.seo_description || album.description,
    openGraph: { title: album.title, description: album.description, type: "article", images: [album.cover_image_url] },
  };
}

export default function AlbumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
