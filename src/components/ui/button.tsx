import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: { default: "bg-primary text-primary-foreground hover:bg-primary/85", outline: "border border-border bg-card hover:bg-muted", ghost: "hover:bg-muted text-foreground" },
    size: { default: "h-11 px-4", sm: "h-9 px-3", icon: "size-10" },
  },
  defaultVariants: { variant: "default", size: "default" },
});
export function Button({ className, variant, size, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
