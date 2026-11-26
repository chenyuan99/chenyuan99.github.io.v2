import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: ComponentProps<"article">) {
  return <article className={cn("rounded-card border border-border bg-card p-5 sm:p-6", className)} {...props} />;
}
