import React from "react";

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "medium",
  className = "",
}) {
  const baseStyle =
    "rounded focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]";

  const variantStyle = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md",
    secondary:
      "rounded-lg border border-blue-600 bg-white text-blue-600 hover:bg-gray-50 hover:shadow-md",
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-md",
  };

  const sizeStyle = {
    small: "px-2 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variantStyle[variant]} ${sizeStyle[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
