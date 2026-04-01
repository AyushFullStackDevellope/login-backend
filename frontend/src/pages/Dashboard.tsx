import React from "react";
import { useNavigate } from "react-router-dom";
import logoLight from "../assets/logo-light.png";
import logoDark from "../assets/logo-dark.png";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/common/Button";
import { APP_CONSTANTS } from "../utils/constants";

function Dashboard() {
  const navigate = useNavigate();
  const { user, selectedInstitute, selectedRole, logoutUser } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!user || !selectedInstitute || !selectedRole) {
    return (
      <div style={styles.errorContainer}>
        <h2>{APP_CONSTANTS.ERROR_NO_DASHBOARD_DATA}</h2>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AR";

  const instituteName = selectedInstitute.name || (selectedInstitute as any).institute_name || "Institute";
  const roleName = selectedRole.name || (selectedRole as any).role_name || "Role";

  const roleBadgeStyle: React.CSSProperties = {
    ...styles.roleBadge,
    color: isDark ? "#ffffff" : "#0284c7",
  };

  return (
    <div style={styles.page}>
      <header className="dashboard-header" style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logoWrapper}>
            <img
              src={isDark ? logoDark : logoLight}
              alt={APP_CONSTANTS.ALT_SCHOOLCOREOS_LOGO}
              style={styles.logoImage}
            />
          </div>
          <span style={styles.brandText}>{APP_CONSTANTS.APP_NAME}</span>
        </div>

        <div className="dashboard-header-right" style={styles.headerRight}>
          <div className="dashboard-user-info" style={styles.userInfo}>
            <p style={styles.userName}>{user.name}</p>
            <p style={styles.userMeta}>
              {roleName} {APP_CONSTANTS.DASHBOARD_AT} {instituteName}
            </p>
          </div>

          <div title={user.name} style={styles.avatar}>
            {initials}
          </div>

          <Button onClick={() => { logoutUser(); navigate("/"); }} style={styles.logoutBtn}>
            {APP_CONSTANTS.DASHBOARD_LOGOUT}
          </Button>
        </div>
      </header>

      <main className="dashboard-main" style={styles.main}>
        <div style={styles.topSection}>
          <h1 style={styles.title}>
            {APP_CONSTANTS.DASHBOARD_WELCOME_NAME.replace("{name}", user.name?.split(" ")[0])}
          </h1>
          <p style={styles.subtitle}>
            {APP_CONSTANTS.DASHBOARD_SUBTITLE.replace("{institute}", instituteName)}
          </p>
        </div>

        <div className="dashboard-grid" style={styles.grid}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>{APP_CONSTANTS.DASHBOARD_PROFILE_TITLE}</h3>
            <ul style={styles.list}>
              <li style={styles.listItem} className="dashboard-list-item">
                <span style={styles.label}>{APP_CONSTANTS.DASHBOARD_NAME}</span>
                <span style={styles.value}>{user.name}</span>
              </li>
              <li style={styles.listItem} className="dashboard-list-item">
                <span style={styles.label}>{APP_CONSTANTS.DASHBOARD_EMAIL}</span>
                <span style={styles.value}>{user.email}</span>
              </li>
              <li style={styles.listItem} className="dashboard-list-item">
                <span style={styles.label}>{APP_CONSTANTS.DASHBOARD_CURRENT_ROLE}</span>
                <span style={roleBadgeStyle}>{roleName}</span>
              </li>
              <li style={styles.listItem} className="dashboard-list-item">
                <span style={styles.label}>{APP_CONSTANTS.DASHBOARD_INSTITUTE}</span>
                <span style={styles.value} className="dashboard-institute-value">{instituteName}</span>
              </li>
            </ul>
          </div>

          <div style={styles.cardCenter}>
            <div style={styles.iconCircle}>🚀</div>
            <h3 style={styles.cardTitle}>{APP_CONSTANTS.DASHBOARD_READY_TITLE}</h3>
            <p style={styles.centerText}>
              {APP_CONSTANTS.DASHBOARD_CONFIGURED_FOR}
              <strong>{roleName.toLowerCase()}</strong>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "50px",
    fontFamily: "'Inter', sans-serif",
    padding: "0 16px",
    textAlign: "center",
  },

  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--bg-app, #f5f6f8)",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },

  header: {
    backgroundColor: "var(--header-bg, #ffffff)",
    boxShadow: "0 1px 3px var(--shadow-light, rgba(0,0,0,0.05))",
  },

  brand: {
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
  },

  headerRight: {},

  userInfo: {},

  userName: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 600,
    color: "var(--text-main, #111827)",
  },

  userMeta: {
    margin: 0,
    fontSize: "12px",
    color: "var(--text-muted, #64748b)",
    wordBreak: "break-word",
  },

  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "var(--bg-page, #f1f5f9)",
    color: "var(--accent-color, #3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    flexShrink: 0,
  },

  logoutBtn: {
    padding: "8px 16px",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    flexShrink: 0,
  },

  main: {
    flex: 1,
  },

  topSection: {
    maxWidth: "1200px",
    margin: "0 auto 32px",
  },

  title: {
    fontWeight: 800,
    color: "var(--text-title, #0c2b5e)",
    marginBottom: "8px",
  },

  subtitle: {
    color: "var(--text-muted, #6b7280)",
  },

  grid: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  card: {
    backgroundColor: "var(--bg-card, #ffffff)",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 2px 10px var(--shadow-light, rgba(0,0,0,0.02))",
  },

  cardCenter: {
    backgroundColor: "var(--bg-card, #ffffff)",
    padding: "24px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    boxShadow: "0 2px 10px var(--shadow-light, rgba(0,0,0,0.02))",
  },

  cardTitle: {
    marginBottom: "16px",
    fontSize: "18px",
    color: "var(--text-main, #111827)",
  },

  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },

  listItem: {
    marginBottom: "12px",
  },

  label: {
    color: "var(--text-subtitle, #64748b)",
  },

  value: {
    fontWeight: 600,
    color: "var(--text-main, #0f172a)",
  },

  roleBadge: {
    backgroundColor: "var(--icon-bg, #ffffff)",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: 600,
  },

  iconCircle: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "var(--bg-page, #fef3c7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
    fontSize: "24px",
  },

  centerText: {
    textAlign: "center",
    fontSize: "14px",
    color: "var(--text-muted, #64748b)",
    lineHeight: "1.6",
  },
};

export default Dashboard;