import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

// Export a function for backwards compatibility with components that use buttonVariants
export const buttonVariants = ({ variant = "default", size = "default" }: { variant?: ButtonProps["variant"], size?: ButtonProps["size"] } = {}) => {
  const variantClass = variant === "default" ? "btn-default" :
                      variant === "destructive" ? "btn-destructive" :
                      variant === "outline" ? "btn-outline" :
                      variant === "secondary" ? "btn-secondary" :
                      variant === "ghost" ? "btn-ghost" :
                      variant === "link" ? "btn-link" : "";
  
  const sizeClass = size === "sm" ? "btn-sm" :
                   size === "lg" ? "btn-lg" :
                   size === "icon" ? "btn-icon" :
                   "btn-default-size";
  
  return cn("btn", variantClass, sizeClass);
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const variantClass = variant === "default" ? "btn-default" :
                        variant === "destructive" ? "btn-destructive" :
                        variant === "outline" ? "btn-outline" :
                        variant === "secondary" ? "btn-secondary" :
                        variant === "ghost" ? "btn-ghost" :
                        variant === "link" ? "btn-link" : "";
    
    const sizeClass = size === "sm" ? "btn-sm" :
                     size === "lg" ? "btn-lg" :
                     size === "icon" ? "btn-icon" :
                     "btn-default-size";
    
    return <Comp className={cn("btn", variantClass, sizeClass, className)} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button };
