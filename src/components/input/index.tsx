import FeatherIcon from "feather-icons-react";
import React, { useState } from "react";
export interface PasswordInputType {
  className?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  required?: boolean;
  type?: string;
}
export const PasswordInput: React.FC<PasswordInputType> = ({
  className = "",
  name,
  value,
  onChange,
  placeholder = "Enter password",
  required,
}) => {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => {
    setVisible((prev) => !prev);
  };
  return (
    <div className={`relative `}>
      <input
        id={name}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        required={required}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 focus:outline-none"
      >
        {visible ? (
          <FeatherIcon icon="eye-off" size={18} />
        ) : (
          <FeatherIcon icon="eye" size={18} />
        )}
      </button>
    </div>
  );
};
export const Input: React.FC<PasswordInputType> = ({
  className = "",
  name,
  value,
  onChange,
  placeholder = "Enter Text",
  required,
  type = "text",
}) => {
  return (
    <div className={`relative `}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        required={required}
        onChange={onChange}
        placeholder={placeholder}
        className={`rounded border border-gray-300 h-13 w-full pl-4 ${className}`}
      />
    </div>
  );
};
