import React from "react";

function IconButton({
  icon,
  text,
  onClick,
  type = "button",
  variant = "primary",
  size = "medium",
  className = "",
}) {
  const baseStyle =
    "rounded focus:outline-none flex items-center justify-center gap-2";
  const variantStyle = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  const sizeStyle = {
    small: "p-2 text-sm",
    medium: "p-3 text-base",
    large: "p-4 text-lg",
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variantStyle[variant]} ${sizeStyle[size]} ${className}`}
      onClick={onClick}
    >
      {icon}
      {text && <span>{text}</span>}
    </button>
  );
}

export default IconButton;
