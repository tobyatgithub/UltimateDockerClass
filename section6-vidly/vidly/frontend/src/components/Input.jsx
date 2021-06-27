import React from "react";
import "./Input.css";

function Input({ onChange, placeholder, value, ...props }) {
  return (
    <input
      onChange={onChange}
      className="Input"
      placeholder={placeholder}
      type="text"
      value={value}
      {...props}
    />
  );
}

export default Input;
