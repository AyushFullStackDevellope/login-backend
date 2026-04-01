import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RoleCard from "../components/RoleCard";
import Header from "../components/common/Header";
import { Button } from "../components/common/Button";
import { useAuth } from "../contexts/AuthContext";
import * as api from "../utils/api";
import { Role } from "../types";
import { getInstituteLogo } from "../utils/assets";
import { useToast } from "../contexts/ToastContext";
import { APP_CONSTANTS } from "../utils/constants";

export default function RoleSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, preContextToken, selectContext } = useAuth();
  const { showToast } = useToast();

  const selectedInstitute = location.state?.selectedInstitute || (location.state as any)?.institute;

  // Automate selection if only one role exists
  useEffect(() => {
    if (selectedInstitute && selectedInstitute.roles.length === 1) {
      handleRoleSelect(selectedInstitute.roles[0]);
    }
  }, [selectedInstitute]);

  async function handleRoleSelect(role: Role) {
    if (!preContextToken || !selectedInstitute) {
      showToast("Session or selection data missing", "error");
      return;
    }

    try {
      const res = await api.selectContext(
        preContextToken, 
        selectedInstitute.tenantId, 
        selectedInstitute.id, 
        role.id
      );
      
      // Handle various response types (data string or data object)
      let token = "";
      if (typeof res === "string") {
        token = res;
      } else if (res) {
        token = res.access_token || res.accessToken || res.token || "";
      }

      if (!token) {
        throw new Error("Activation failed: No access token received");
      }

      selectContext(selectedInstitute, role, token);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Role Selection Error:", err);
      showToast(err.message || "Failed to finalize selection", "error");
    }
  }

  if (!user || !selectedInstitute) {
    return (
      <div style={styles.errorContainer}>
        <h2>{APP_CONSTANTS.SELECT_INST_FIRST}</h2>
        <Button onClick={() => navigate("/select-institute")} style={{marginTop: "20px"}}>
          Go Back
        </Button>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AR";

  const instituteName = selectedInstitute.name || "Institute";
  const instituteCity = selectedInstitute.city || "";
  const instituteState = selectedInstitute.state || "";
  const instituteLogo = selectedInstitute.logo || getInstituteLogo(instituteName, 0);

  return (
    <div style={styles.page}>
      <Header userInitials={initials} userName={user.name} />

      <main style={styles.main}>
        <div style={styles.topActions}>
          <Button
            variant="secondary"
            onClick={() => navigate("/select-institute")}
            style={styles.backBtn}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={styles.backIcon}>
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {APP_CONSTANTS.CHANGE_INSTITUTE}
          </Button>
        </div>

        <div style={styles.selectedInstCard}>
          <div style={styles.instLogoWrap}>
            {instituteLogo ? (
              <img src={instituteLogo} alt={APP_CONSTANTS.ALT_INSTITUTE_LOGO} style={styles.instLogo} />
            ) : (
              <div style={styles.instLogoFallback}>{instituteName.charAt(0)}</div>
            )}
          </div>
          <div style={styles.instInfo}>
            <h3 style={styles.instName}>{instituteName}</h3>
            {instituteCity && (
              <p style={styles.instLocation}>
                <svg width="10" height="12" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: "4px"}}>
                  <path d="M6 0C2.68629 0 0 2.68629 0 6C0 10.5 6 14 6 14C6 14 12 10.5 12 6C12 2.68629 9.31371 0 6 0ZM6 8C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4C7.10457 4 8 4.89543 8 6C8 7.10457 7.10457 8 6 8Z" fill="#94a3b8"/>
                </svg>
                {instituteCity}, {instituteState}
              </p>
            )}
          </div>
          <div style={styles.checkBadge}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#3b82f6" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#3b82f6"/>
                <path d="M9 12l2 2 4-4" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          </div>
        </div>

        <div style={styles.headerText}>
          <h1 style={styles.title}>{APP_CONSTANTS.ROLE_SELECT_TITLE}</h1>
          <p style={styles.subtitle}>
            {APP_CONSTANTS.ROLE_SELECT_SUBTITLE.replace("{institute}", instituteName)}
          </p>
        </div>

        <div style={styles.list}>
          {selectedInstitute.roles.map((role: Role) => (
            <RoleCard
              key={role.id}
              role={role.name || "Role"}
              onClick={() => handleRoleSelect(role)}
            />
          ))}
        </div>
      </main>

      <footer style={styles.footer}>
        {APP_CONSTANTS.FOOTER_SUPPORT_ROLE}
        <a href={`mailto:${APP_CONSTANTS.SUPPORT_EMAIL}`} style={styles.footerLink}>
          {APP_CONSTANTS.SUPPORT_EMAIL}
        </a>
      </footer>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "50px",
    fontFamily: "'Inter', sans-serif",
  },
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--bg-app, #f4f5f6)",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 16px 40px",
    width: "100%",
    boxSizing: "border-box",
  },
  topActions: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  backBtn: {
    display: "flex",
    alignItems: "center",
    background: "var(--bg-page, #f1f5f9)",
    borderRadius: "24px",
    padding: "8px 20px",
    border: "1px solid var(--border-light, #e2e8f0)",
    color: "var(--text-main, #0f172a)",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  backIcon: {
    marginRight: "6px",
    flexShrink: 0,
  },
  selectedInstCard: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "540px",
    backgroundColor: "var(--bg-card, #e6f0fd)",
    border: "1px solid var(--accent-color, #bfdbfe)",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "32px",
    boxSizing: "border-box",
  },
  instLogoWrap: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "var(--icon-bg, #fff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "16px",
    flexShrink: 0,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "hidden",
    padding: "2px",
    boxSizing: "border-box"
  },
  instLogo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: "50%"
  },
  instLogoFallback: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "var(--accent-color, #3b82f6)",
  },
  instInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  instName: {
    margin: 0,
    textAlign: "left",
    fontSize: "16px",
    fontWeight: "700",
    color: "var(--text-main, #0f172a)",
  },
  instLocation: {
    margin: 0,
    fontSize: "13px",
    color: "var(--text-muted, #64748b)",
    display: "flex",
    alignItems: "center",
    fontWeight: "500",
  },
  checkBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "12px",
  },
  headerText: {
    textAlign: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "32px",
    fontWeight: 800,
    color: "var(--text-title, #0c2b5e)",
    margin: "0 0 10px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "16px",
    color: "var(--text-muted, #64748b)",
    margin: 0,
    fontWeight: 500,
  },
  list: {
    width: "100%",
    maxWidth: "540px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  footer: {
    padding: "32px 16px",
    textAlign: "center",
    fontSize: "14px",
    color: "var(--text-muted, #8b949e)",
    fontWeight: 500,
  },
  footerLink: {
    color: "var(--accent-color, #3b82f6)",
    textDecoration: "none",
    fontWeight: 600,
  },
};
