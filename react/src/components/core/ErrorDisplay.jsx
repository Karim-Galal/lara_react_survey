// components/CustomError.jsx
import React from "react";
import { AlertTriangle } from "lucide-react";

const ErrorDisplay = ({ type = "data", error }) => {

  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || `Something went wrong while loading ${typeLabel}. Please try again later.`;

  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="p-6 text-center flex flex-col items-center justify-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-3" />
      <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-2">
        Failed to load {typeLabel}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md">
        {/* {error?.message || `Something went wrong while loading ${typeLabel}. Please try again later.`} */}
        { errorMessage }
      </p>
    </div>
  );
};

export default ErrorDisplay;
