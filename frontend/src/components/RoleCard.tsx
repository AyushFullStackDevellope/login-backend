import React, { useState } from "react";
import { APP_CONSTANTS } from "../utils/constants";

interface RoleCardProps {
  role: string;
  onClick: () => void;
}

export default function RoleCard({ role, onClick }: RoleCardProps) {
  const [hovered, setHovered] = useState(false);

  // First letter of the role name for the avatar circle
  const initial = role ? role.charAt(0).toUpperCase() : "?";

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
      }}
    >
      {/* Circular avatar showing the first letter of the role */}
      <div style={styles.avatar}>
        <span style={styles.avatarText}>{initial}</span>
      </div>

      {/* Role name and fixed subtext */}
      <div style={styles.info}>
        <h3 style={styles.roleName}>{role}</h3>
        <p style={styles.subText}>{APP_CONSTANTS.ROLE_CARD_SUBTEXT}</p>
      </div>

      {/* Chevron arrow on the right */}
      <div style={styles.chevronBox}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-main, #1e293b)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "18px 20px",
    backgroundColor: "var(--bg-card, #ffffff)",
    border: "1px solid var(--border-light, #e2e8f0)",
    borderRadius: "16px",
    boxShadow: "0 2px 8px var(--shadow-light, rgba(0,0,0,0.04))",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    outline: "none",
  },
  cardHover: {
    boxShadow: "0 6px 20px var(--shadow-light, rgba(0,0,0,0.08))",
    transform: "translateY(-2px)",
    borderColor: "var(--accent-color, #3b82f6)",
  },
  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    backgroundColor: "var(--icon-bg, #eff6ff)",
    border: "1px solid var(--border-light, #dbeafe)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: {
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--accent-color, #3b82f6)",
    lineHeight: 1,
  },
  info: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    minWidth: 0,
  },
  roleName: {
    margin: 0,
    fontSize: "17px",
    fontWeight: 700,
    color: "var(--text-main, #0f172a)",
  },
  subText: {
    margin: 0,
    fontSize: "14px",
    color: "var(--text-muted, #64748b)",
    fontWeight: 400,
  },
  chevronBox: {
    width: "34px",
    height: "34px",
    borderRadius: "8px",
    backgroundColor: "var(--bg-page, #f1f5f9)",
    border: "1px solid var(--border-light, #e2e8f0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};