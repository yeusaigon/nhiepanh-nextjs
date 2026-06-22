"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.opacity = "0";
      ref.current.style.transform = "translateY(6px)";
      const id = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transition = "opacity 0.3s ease-out, transform 0.3s ease-out";
          ref.current.style.opacity = "1";
          ref.current.style.transform = "translateY(0)";
        }
      });
      return () => cancelAnimationFrame(id);
    }
  }, [pathname]);

  return <main className="flex-1" ref={ref}>{children}</main>;
}
