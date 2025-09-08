"use client";

import React from "react";

// A simple utility function to join class names, replacing the external dependency.
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variantClasses = {
      primary:
        // Deep green base with lighter hover
        "bg-[#369457] text-[#fdfaf6] hover:bg-[#29773e] focus:ring-[#29773e]",
      secondary:
        // Softer neutral greenish-gray for secondary buttons
        "bg-[#d7e3d7] text-[#1f6032] hover:bg-[#c6d6c6] focus:ring-[#369457]",
      ghost:
        // Minimal button with subtle hover effect
        "bg-transparent text-[#1f6032] hover:bg-[#e9f0e5] focus:ring-[#d7e3d7] transform transition-all duration-200 ease-in-out hover:scale-105",
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      "px-4 py-2",
      className
    );

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
