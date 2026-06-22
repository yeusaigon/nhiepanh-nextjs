"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handle = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  if (!visible) return null;

  return (
    <Button
      size="icon"
      variant="secondary"
      className="fixed bottom-6 right-6 z-40 rounded-2xl shadow-lg opacity-80 hover:opacity-100 transition-all duration-300 animate-scale-in"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <ArrowUp className="w-4 h-4" />
    </Button>
  );
}
