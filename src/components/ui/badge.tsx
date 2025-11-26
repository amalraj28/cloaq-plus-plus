import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClass = variant === "default" ? "badge-default" :
                       variant === "secondary" ? "badge-secondary" :
                       variant === "destructive" ? "badge-destructive" :
                       variant === "outline" ? "badge-outline" : "";
  
  return <div className={cn("badge", variantClass, className)} {...props} />;
}

export { Badge };
