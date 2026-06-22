import { MOCK_ALBUMS } from "@/lib/mock-data";

export function generateStaticParams() {
  return MOCK_ALBUMS.map((a) => ({ slug: a.slug }));
}

export default function AlbumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
