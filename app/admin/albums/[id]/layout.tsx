export function generateStaticParams() {
  return [{ id: "new" }];
}

export default function EditAlbumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
