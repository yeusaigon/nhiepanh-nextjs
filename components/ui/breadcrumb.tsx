import * as React from "react"; import { cn } from "@/lib/utils";
function Breadcrumb({ ...props }: React.ComponentProps<"nav">) { return <nav aria-label="breadcrumb" {...props} />; }
function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) { return <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground", className)} {...props} />; }
function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) { return <li className={cn("inline-flex items-center gap-1.5", className)} {...props} />; }
function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) { return <li role="presentation" aria-hidden="true" className={cn("[&>svg]:size-3.5", className)} {...props}>{children ?? "/"}</li>; }
export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator };
