// src/components/Container.jsx
import React from "react";
import clsx from "clsx";

/**
 * Responsive Container component for Tailwind + React (JS)
 *
 * Props:
 * - size: "sm" | "md" | "lg" | "xl" | "2xl" | "full"    (default: "lg")
 * - center: boolean                                       (default: true) -- centers with mx-auto
 * - fluid: boolean                                        (default: false) -- ignores max-width and becomes full width
 * - px: boolean|string                                    (default: true) -- horizontal padding: true uses default px-4 sm:px-6 lg:px-8
 * - className: string                                     (extra classes)
 * - as: string                                            (root element, default: "div")
 * - children
 */
export default function Container1 ({
  size = "lg",
  center = true,
  fluid = false,
  px = true,
  className = "",
  as = "div",
  children,
  ...props
}) {
  const Tag = as;

  // map sizes to Tailwind max-width classes
  const sizeMap = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  const basePadding =
    px === true
      ? "px-4 sm:px-6 lg:px-8"
      : typeof px === "string"
      ? px
      : ""; // allow custom string like "px-2 md:px-4"

  const classes = clsx(
    // container behavior
    !fluid && sizeMap[size],
    center && !fluid && "mx-auto",
    // padding
    !fluid && basePadding,
    // full-width fallback when fluid
    fluid && "w-full px-4 sm:px-6 lg:px-8",
    // allow user overrides
    className
  );

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
}
