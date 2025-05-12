import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  // Generate a unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Base input classes
  const baseClasses = 'bg-background-light text-white rounded-md px-3 py-2 border focus:ring-2 focus:outline-none transition-all duration-200';
  
  // Error styles
  const errorStyles = error 
    ? 'border-error-500 focus:ring-error-500' 
    : 'border-gray-700 focus:ring-primary-500 focus:border-primary-500';
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          ${baseClasses}
          ${errorStyles}
          ${widthStyles}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;