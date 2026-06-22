import * as React from "react"; import { cn } from "@/lib/utils";
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea className={cn("flex min-h-[80px] w-full rounded-xl border border-border/50 bg-secondary/50 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:border-ring/50 transition-colors disabled:cursor-not-allowed disabled:opacity-50", className)} ref={ref} {...props} />
)); Textarea.displayName = "Textarea";
export { Textarea };
