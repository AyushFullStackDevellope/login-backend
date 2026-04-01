import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import logoLight from "../../assets/logo-light.png";
import logoDark from "../../assets/logo-dark.png";

interface HeaderProps {
  userInitials: string;
  userName?: string;
}

export default function Header({ userInitials, userName }: HeaderProps) {
  const { theme } = useTheme();

  return (
    <header className="header-container" style={styles.header}>
      <div style={styles.brandWrapper}>
        <div style={styles.logoWrapper}>
          <img
            src={theme === "dark" ? logoDark : logoLight}
            alt="SchoolCoreOS Logo"
            style={styles.logoImage}
          />
        </div>
        <span style={styles.brandText}>SchoolCoreOS</span>
      </div>

      <div style={styles.actionsWrapper}>
        <div title={userName || "User"} style={styles.avatar}>
          {userInitials}
        </div>
      </div>
    </header>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {},
  brandWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoWrapper: {
    width: "24px",
    height: "24px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  brandText: {
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--text-main, #111827)",
    letterSpacing: "-0.5px",
  },
  actionsWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    justifyContent: "flex-end",
    width: "auto"
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "var(--bg-card, #ffffff)",
    color: "var(--text-main, #111827)",
    fontSize: "14px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px var(--shadow-light, rgba(0,0,0,0.05))",
    userSelect: "none",
  },
};
