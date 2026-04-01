import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InstituteCard from "../components/InstituteCard";
import Header from "../components/common/Header";
import { Institute } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { APP_CONSTANTS } from "../utils/constants";

export default function InstituteSelection() {
  const navigate = useNavigate();
  const { user, institutes, selectContext, selectedInstitute, selectedRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Safety check: hooks must be called before early returns
  if (!user || !institutes) {
    return <div>Loading...</div>;
  }

  // Navigates to the next page depending on how many roles the user has
  function handleInstituteSelect(institute: Institute) {
    // We don't have the final context yet, just setting the institute
    // The select-context API needs both institute and role.
    // So we just navigate. RoleSelection will handle the final call.
    if (institute.roles.length === 1) {
      // If only one role, we can't call API here because we need to navigate first 
      // or we can call it here and go to dashboard.
      // To keep flow exact, we go to RoleSelection which will handle 1 role.
      navigate("/select-role", { state: { selectedInstitute: institute } });
    } else {
      navigate("/select-role", { state: { selectedInstitute: institute } });
    }
  }

  const initials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "AR";
  
  const showSearchBar = institutes.length >= 5;

  const filteredInstitutes = institutes.filter((institute: any) => {
    const name = institute.name || institute.institute_name || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={styles.page}>
      <Header userInitials={initials} userName={user.name} />
    
      <main style={styles.main}>
        <div style={styles.headerText}>
          <h1 style={styles.title}>
            {APP_CONSTANTS.INSTITUTE_SELECT_TITLE.replace("{name}", user.name?.split(" ")[0])}
          </h1>
          <p style={styles.subtitle}>
            {APP_CONSTANTS.INSTITUTE_SELECT_SUBTITLE}
          </p>
        </div>

        <div style={styles.list}>
          {showSearchBar && (
            <div style={styles.searchContainer}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={styles.searchIcon}>
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.3-4.3"/>
              </svg>
              <input
                type="text"
                placeholder={APP_CONSTANTS.SEARCH_PLACEHOLDER}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          )}

          {filteredInstitutes.map((institute: Institute, index: number) => (
            <InstituteCard 
              key={institute.id || index} 
              index={index}
              institute={institute} 
              onClick={() => handleInstituteSelect(institute)} 
            />
          ))}
        </div>
      </main>

      <footer style={styles.footer}>
        {APP_CONSTANTS.FOOTER_SUPPORT_INSTITUTE}
        <a href={`mailto:${APP_CONSTANTS.SUPPORT_EMAIL}`} style={styles.footerLink}>
          {APP_CONSTANTS.SUPPORT_EMAIL}
        </a>
      </footer>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
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
  headerText: {
    textAlign: "center",
    marginBottom: "36px",
  },
  title: {
    fontSize: "32px",
    fontWeight: 800,
    color: "var(--text-title, #0c2b5e)",
    margin: "0 0 12px",
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
  searchContainer: {
    marginBottom: "8px",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
  },
  searchInput: {
    width: "100%",
    padding: "16px 20px 16px 48px",
    borderRadius: "12px",
    border: "1px solid var(--border-light, #cbd5e1)",
    backgroundColor: "transparent",
    color: "var(--text-main, #0f172a)",
    fontSize: "18px",
    outline: "none",
    boxSizing: "border-box",
  },
  footer: {
    padding: "32px 16px",
    textAlign: "center",
    fontSize: "13px",
    color: "var(--text-muted, #64748b)",
    fontWeight: 500,
  },
  footerLink: {
    color: "var(--accent-color, #3b82f6)",
    textDecoration: "none",
    fontWeight: 500,
  },
};