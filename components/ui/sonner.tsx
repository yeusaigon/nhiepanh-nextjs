"use client"; import { Toaster as Sonner } from "sonner";
const Toaster = ({ ...props }: React.ComponentProps<typeof Sonner>) => (
  <Sonner className="toaster group" toastOptions={{ classNames: { toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border/50 group-[.toaster]:shadow-xl rounded-2xl", description: "group-[.toast]:text-muted-foreground", actionButton: "group-[.toast]:bg-foreground group-[.toast]:text-background rounded-full", cancelButton: "group-[.toast]:bg-secondary group-[.toast]:text-muted-foreground rounded-full" }}} {...props} />
);
export { Toaster };
