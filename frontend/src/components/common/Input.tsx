import React, { InputHTMLAttributes, useState } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}

export function Input({ fullWidth, style, onFocus, onBlur, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <input
      onFocus={(e) => {
        setFocused(true);
        if (onFocus) onFocus(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        if (onBlur) onBlur(e);
      }}
      style={{
        ...styles.base,
        ...(fullWidth ? styles.fullWidth : {}),
        ...(focused ? styles.focus : {}),
        ...style
      }}
      {...props}
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  base: {
    fontFamily: "inherit",
    padding: "14px 16px",
    border: "1px solid var(--border-light, #e2e8f0)",
    borderRadius: "8px",
    fontSize: "15px",
    backgroundColor: "var(--bg-card, #fff)",
    color: "var(--text-main, #0f172a)",
    transition: "border-color 0.2s",
    outline: "none",
  },
  focus: {
    borderColor: "var(--accent-color, #3b82f6)",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
  },
  fullWidth: {
    width: "100%",
    boxSizing: "border-box",
  }
};
