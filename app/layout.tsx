import "./globals.css"; import type { Metadata } from "next"; import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext"; import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/layout/Header"; import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/layout/BackToTop"; import PageWrapper from "@/components/layout/PageWrapper";
import { Toaster } from "@/components/ui/sonner"; import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Nhiếp Ảnh Số — Bộ sưu tập ảnh nghệ thuật", template: "%s | Nhiếp Ảnh Số" },
  description: "Bộ sưu tập ảnh nghệ thuật - Nơi lưu giữ khoảnh khắc qua ống kính. Khám phá ảnh đường phố, phong cảnh, chân dung, kiến trúc.",
  openGraph: { title: "Nhiếp Ảnh Số", description: "Bộ sưu tập ảnh nghệ thuật - Nơi lưu giữ khoảnh khắc", type: "website" },
  twitter: { card: "summary_large_image", title: "Nhiếp Ảnh Số", description: "Bộ sưu tập ảnh nghệ thuật" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem("theme");if(t==="light")document.documentElement.classList.add("light")}catch(e){}`,
        }} />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <PageWrapper>{children}</PageWrapper>
              <Footer />
            </div>
            <Toaster />
              <BackToTop />
          </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
