import React from "react";

const Button = ({ type = "button", text, onClick }) => {
  return (
    <button type={type} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
