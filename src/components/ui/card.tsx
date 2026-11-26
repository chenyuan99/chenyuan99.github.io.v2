import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
export function Card({ className, ...props }: ComponentProps<"article">) {
  return <article className={cn("rounded-xl border border-border bg-card p-5", className)} {...props} />;
}
