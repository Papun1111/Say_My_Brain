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
        "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
      secondary:
        "bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400",
      ghost:
        "bg-slate-100 text-slate-800 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-200 transform transition-all duration-200 ease-in-out hover:scale-105",
    };

    const classes = cn(baseClasses, variantClasses[variant], "px-4 py-2", className);

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

