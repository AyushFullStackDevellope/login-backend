import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div style={styles.wrapper}>
      {/* Report / alert icon button */}
      <button style={styles.iconBtn} type="button" aria-label="Report issue">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Theme toggle button */}
      <button onClick={toggleTheme} style={styles.iconBtn} type="button" aria-label="Toggle theme">
        {theme === "light" ? (
          // Moon icon → click to go dark
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        ) : (
          // Sun icon → click to go light
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: "absolute",
    top: "24px",
    right: "24px",
    display: "flex",
    gap: "12px",
  },
  iconBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    border: "1px solid var(--border-light, #d1d5db)",
    backgroundColor: "var(--bg-card, #fff)",
    color: "var(--text-main, #111827)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 1px 2px var(--shadow-light, rgba(0,0,0,0.05))",
    padding: 0,
    outline: "none",
    boxSizing: "border-box",
  },
};