import React, { ButtonHTMLAttributes, useState } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'card' | 'ghost';
  fullWidth?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  fullWidth, 
  style,
  onMouseEnter,
  onMouseLeave,
  ...props 
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  // Map the variant strings to their respective style objects
  const variantStyles = {
    primary: hovered ? styles.primaryHover : styles.primary,
    secondary: hovered ? styles.secondaryHover : styles.secondary,
    card: hovered ? styles.cardHover : styles.card,
    ghost: hovered ? styles.ghostHover : styles.ghost,
  }[variant];

  return (
    <button
      onMouseEnter={(e) => {
        setHovered(true);
        if (onMouseEnter) onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        if (onMouseLeave) onMouseLeave(e);
      }}
      style={{
        ...styles.base,
        ...variantStyles,
        ...(fullWidth ? { width: "100%" } : {}),
        ...style
      }}
      {...props}
    >
      {children}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  base: {
    fontFamily: "'Inter', inherit",
    cursor: "pointer",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease-in-out",
    padding: "12px 24px",
  },
  primary: {
    backgroundColor: "var(--accent-color, #3b82f6)",
    color: "#fff",
  },
  primaryHover: {
    backgroundColor: "#2563eb",
    transform: "translateY(-1px)",
    color: "#fff",
  },
  secondary: {
    backgroundColor: "var(--border-card, #e2e8f0)",
    color: "var(--text-title, #0f172a)",
  },
  secondaryHover: {
    backgroundColor: "#cbd5e1",
    color: "var(--text-title, #0f172a)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--accent-color, #3b82f6)",
  },
  ghostHover: {
    backgroundColor: "transparent",
    color: "var(--accent-color, #3b82f6)",
    textDecoration: "underline",
  },
  card: {
    backgroundColor: "var(--bg-card, #fff)",
    border: "1px solid var(--border-light, #e2e8f0)",
    borderRadius: "12px",
    boxShadow: "0 2px 6px var(--shadow-light, rgba(0,0,0,0.04))",
    padding: "16px",
    color: "var(--text-title, #0f172a)",
  },
  cardHover: {
    backgroundColor: "var(--bg-card, #fff)",
    border: "1px solid var(--border-light, #e2e8f0)",
    borderRadius: "12px",
    boxShadow: "0 8px 16px var(--shadow-light, rgba(0,0,0,0.08))",
    padding: "16px",
    color: "var(--text-title, #0f172a)",
    transform: "translateY(-2px)",
  }
};
