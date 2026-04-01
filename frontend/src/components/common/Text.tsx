import React, { HTMLAttributes } from 'react';

interface TextProps extends HTMLAttributes<HTMLParagraphElement | HTMLHeadingElement | HTMLSpanElement> {
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span';
  variant?: 'title' | 'subtitle' | 'body' | 'muted';
}

export function Text({ as = 'p', variant = 'body', children, style, ...props }: TextProps) {
  const Component = as;
  
  return (
    <Component style={{ ...styles.base, ...styles[variant], ...style }} {...props}>
      {children}
    </Component>
  );
}

const styles: Record<string, React.CSSProperties> = {
  base: {
    fontFamily: "inherit",
    margin: 0,
  },
  title: {
    fontSize: "32px",
    fontWeight: 800,
    color: "var(--text-title, #0f172a)",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "16px",
    fontWeight: 500,
    color: "var(--text-muted, #64748b)",
  },
  body: {
    fontSize: "15px",
    color: "var(--text-main, #334155)",
  },
  muted: {
    fontSize: "13px",
    color: "var(--text-light, #94a3b8)",
  }
};
