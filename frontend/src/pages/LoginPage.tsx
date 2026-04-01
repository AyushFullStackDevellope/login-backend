import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import ThemeSwitcher from "../components/common/ThemeSwitcher";
import { getInstituteLogo, logoLight, logoDark } from "../utils/assets";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import * as api from "../utils/api";
import { APP_CONSTANTS } from "../utils/constants";

function LoginPage() {
  const { showToast } = useToast();
  const { loginUser, setInstitutes } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  async function handleLogin(email: string, password: string) {
    try {
      // 1. POST /auth/login
      const loginRes = await api.login(email, password);
      // Support nested data property or direct object
      const loginData = loginRes.data || loginRes;
      const token = loginData.pre_context_token || loginData.token || "";
      
      const rawUser = loginData.user || {};
      const user = {
        id: rawUser.id || rawUser._id || rawUser.userId || "",
        name: rawUser.name || rawUser.full_name || rawUser.fullName || "User",
        email: rawUser.email || email
      };

      if (!token) {
        throw new Error("No token returned from login");
      }

      loginUser(user, token);

      // 2. GET /auth/my-institutes-roles
      const instRes = await api.getMyInstitutesRoles(token);
      // Support array directly or { data: [...] }
      const institutesRaw = Array.isArray(instRes) ? instRes : (instRes?.data || []);

      if (!institutesRaw || institutesRaw.length === 0) {
        showToast(APP_CONSTANTS.ERROR_NO_INSTITUTE, "error");
        return;
      }

      // 3. Normalization (Handle underscores and camelCase)
      const institutes = institutesRaw.map((inst: any, idx: number) => {
        const rolesRaw = inst.roles || inst.user_roles || inst.role_list || [];
        const mappedName = inst.name || inst.institute_name || inst.instituteName || inst.institute_title || "Institute";
        
        return {
          id: inst.id || inst.institute_id || inst.instituteId || inst._id || 0,
          tenantId: inst.tenant_id || inst.tenantId || inst.id || 0,
          name: mappedName,
          city: inst.city || inst.institute_city || "",
          state: inst.state || inst.institute_state || "",
          type: inst.type || inst.institute_type || "",
          logo: getInstituteLogo(mappedName, idx),
          roles: rolesRaw.map((r: any) => ({
            id: r.id || r.role_id || r.roleId || r._id || 0,
            name: r.name || r.role_name || r.roleName || r.title || "User",
          })),
        };
      });

      setInstitutes(institutes);

      // 4. Navigation
      if (institutes.length === 1) {
        navigate("/select-role", {
          state: { selectedInstitute: institutes[0] },
        });
      } else {
        navigate("/select-institute");
      }
    } catch (err: any) {
      showToast(err.message || APP_CONSTANTS.ERROR_INVALID_CREDS, "error");
    }
  }

  return (
    <div style={styles.page}>
      <ThemeSwitcher />

      <div style={styles.card}>
        <div style={styles.logoWrapper}>
          <img
            src={isDark ? logoDark : logoLight}
            alt={APP_CONSTANTS.ALT_LOGO}
            style={styles.logoImage}
          />
        </div>

        <h2 style={styles.title}>{APP_CONSTANTS.LOGIN_TITLE}</h2>

        <LoginForm onLogin={handleLogin} />
      </div>

      <p style={styles.footer}>
        {APP_CONSTANTS.LOGIN_TERMS}
      </p>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--bg-page, #e8e9eb)",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    padding: "16px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    background: "var(--bg-card, #fff)",
    borderRadius: "16px",
    padding: "40px 32px",
    boxShadow: "0 2px 20px var(--shadow-light, rgba(0,0,0,0.08))",
    textAlign: "center",
    boxSizing: "border-box",
  },
  logoWrapper: {
    width: "70px",
    height: "70px",
    margin: "0 auto 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: "70px",
    height: "70px",
    objectFit: "contain",
  },
  title: {
    marginBottom: "20px",
    color: "var(--text-main, #111827)",
  },
  footer: {
    marginTop: "20px",
    fontSize: "13px",
    color: "var(--text-light, #888)",
  },
};

export default LoginPage;