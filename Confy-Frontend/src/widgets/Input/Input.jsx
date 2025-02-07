import React from "react";

const Input = ({ type, value, onChange, placeholder }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default Input;
