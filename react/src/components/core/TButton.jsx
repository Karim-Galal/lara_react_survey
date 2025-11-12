import clsx from "clsx";
import { Link } from "react-router-dom";
import React from "react";

const TButton = ({
  color = "indigo",
  size = "md", // new prop
  to = "",
  href = "",
  link = false,
  target = "_self",
  circle = false,
  onClick = () => {},
  children,
}) => {
  const baseClasses =
    "inline-flex whitespace-nowrap font-medium transition items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2";

  // 🎨 Color Variants
  const colorClasses = link
    ? {
        indigo:
          "text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200",
        red: "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200",
        yellow:
          "text-yellow-500 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300",
        gray:
          "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200",
      }[color]
    : {
        indigo:
          "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
        red: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
        green:
          "bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600",
        yellow:
          "bg-yellow-500 text-black hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500",
        blue: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
        gray:
          "bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600",
        black:
          "bg-black text-white hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-900",
      }[color];

  // 📏 Size Variants
  const sizeClasses = circle
    ? {
        sm: "w-8 h-8 rounded-full",
        md: "w-10 h-10 rounded-full",
        lg: "w-12 h-12 rounded-full",
      }[size]
    : {
        sm: "px-2 py-1 text-sm rounded-md",
        md: "px-4 py-2 text-base rounded-md",
        lg: "px-6 py-3 text-lg rounded-md",
      }[size];

  // ✨ Combine All
  const classes = clsx(baseClasses, colorClasses, sizeClasses, link && "hover:underline");

  if (href)
    return (
      <a href={href} target={target} className={classes}>
        {children}
      </a>
    );

  if (to)
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
};

export default TButton;
