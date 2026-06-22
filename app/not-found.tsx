import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-bold tracking-tight mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">Trang bạn tìm không tồn tại.</p>
      <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium">
        Về Trang Chủ
      </Link>
    </div>
  );
}
