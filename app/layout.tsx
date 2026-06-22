import "./globals.css"; import type { Metadata } from "next"; import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext"; import Header from "@/components/layout/Header"; import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner"; import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Nhiếp Ảnh Số", template: "%s | Nhiếp Ảnh Số" },
  description: "Bộ sưu tập ảnh nghệ thuật - Nơi lưu giữ khoảnh khắc",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
