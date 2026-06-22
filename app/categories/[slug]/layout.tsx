import { CATEGORIES } from "@/types";
import type { Metadata } from "next";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find(c => c.slug === slug);
  return {
    title: cat ? `${cat.name} Albums` : "Category",
    description: cat ? `Khám phá bộ sưu tập ảnh ${cat.name.toLowerCase()}` : "",
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
