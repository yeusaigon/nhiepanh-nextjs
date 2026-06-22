import { CATEGORIES } from "@/types";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
