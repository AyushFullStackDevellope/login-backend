import React, { useState } from "react";
import { Institute } from "../types";
import { getInstituteLogo } from "../utils/assets";

interface InstituteCardProps {
  institute: Institute;
  onClick: () => void;
  index: number;
}

function InstituteCard({ institute, onClick, index }: InstituteCardProps) {
  const name = institute.name || "Institute";
  const city = institute.city;
  const state = institute.state;
  const type = institute.type;
  
  const logo = getInstituteLogo(name, index);
  const locationString = [city, state].filter(Boolean).join(", ");
  const [hovered, setHovered] = useState(false);

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
        boxShadow: hovered ? styles.cardHover.boxShadow : styles.card.boxShadow,
        transform: hovered ? styles.cardHover.transform : styles.card.transform,
      }}
    >
      <div style={styles.logoWrapper}>
        {logo ? (
          <img src={logo} alt={name} style={styles.logoImage} />
        ) : (
          <svg width="24" height="24" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M116 112H12V116H116V112Z" fill="var(--accent-color, #3b82f6)"/>
            <path d="M20 112V40L64 12 L108 40V112H20Z" fill="var(--accent-color, #3b82f6)" fillOpacity="0.1" stroke="var(--accent-color, #3b82f6)" strokeWidth="4"/>
            <path d="M52 112V84H76V112" stroke="var(--accent-color, #3b82f6)" strokeWidth="4"/>
            <path d="M40 56H52M76 56H88M40 76H52M76 76H88" stroke="var(--accent-color, #3b82f6)" strokeWidth="4" strokeLinecap="round"/>
          </svg>
        )}
      </div>

      <div style={styles.infoWrapper}>
        <h3 style={styles.name}>{name}</h3>
        {locationString && (
          <p style={styles.location}>
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 0C2.68629 0 0 2.68629 0 6C0 10.5 6 14 6 14C6 14 12 10.5 12 6C12 2.68629 9.31371 0 6 0ZM6 8C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4C7.10457 4 8 4.89543 8 6C8 7.10457 7.10457 8 6 8Z" fill="var(--text-muted, #94a3b8)"/>
            </svg>
            {locationString}
          </p>
        )}
      </div>

      {type && <div style={styles.type}>{type}</div>}

      <div style={styles.chevronBox}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5l7 7-7 7" stroke="var(--text-main, #334155)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
    padding: "16px 20px",
    backgroundColor: "var(--bg-card, #ffffff)",
    border: "1px solid var(--border-light, #e2e8f0)",
    borderRadius: "16px",
    boxShadow: "0 2px 6px var(--shadow-light, rgba(0,0,0,0.02))",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    transform: "translateY(0)",
    transition: "all 0.2s ease-in-out",
    gap: "16px",
    boxSizing: "border-box",
  },
  cardHover: {
    boxShadow: "0 8px 16px var(--shadow-light, rgba(0,0,0,0.06))",
    transform: "translateY(-1px)",
  },
  logoWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "var(--icon-bg, #ffffff)",
    border: "1px solid var(--border-light, #e2e8f0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden",
    padding: "2px",
    boxSizing: "border-box"
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  infoWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
  },
  name: {
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text-title, #0f172a)",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  location: {
    fontSize: "13px",
    color: "var(--text-muted, #64748b)",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: 500,
  },
  type: {
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--text-light, #64748b)",
    flexShrink: 0,
  },
  chevronBox: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    backgroundColor: "var(--bg-card, #ffffff)",
    border: "1px solid var(--border-light, #e2e8f0)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginLeft: "8px",
  },
};

export default InstituteCard;