"use client";

import { cn } from "@/app/lib/utils";
import React from "react";
import { motion, HTMLMotionProps } from 'motion/react';

// By extending HTMLMotionProps, the component's props will be compatible
// with the underlying motion component, resolving the type conflict.
export interface InputProps extends Omit<HTMLMotionProps<"input">, "ref"> {}

// Create a motion-enabled input component
const MotionInput = motion.input;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <MotionInput
        type={type}
        className={cn(
          "text-black flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 transition-shadow",
          "focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        whileFocus={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

