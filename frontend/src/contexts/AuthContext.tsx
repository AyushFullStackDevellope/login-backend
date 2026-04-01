import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, Institute, Role } from "../types";

interface AuthContextType {
  user: User | null;
  preContextToken: string | null;
  accessToken: string | null;
  institutes: Institute[];
  selectedInstitute: Institute | null;
  selectedRole: Role | null;
  loginUser: (userData: User, token: string) => void;
  setInstitutes: (institutes: Institute[]) => void;
  selectContext: (institute: Institute, role: Role, token: string) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("auth-user");
    return saved ? JSON.parse(saved) : null;
  });

  const [preContextToken, setPreContextToken] = useState<string | null>(() => {
    return localStorage.getItem("pre-context-token");
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem("access-token");
  });

  const [institutes, setInstitutesState] = useState<Institute[]>(() => {
    const saved = localStorage.getItem("auth-institutes");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(
    () => {
      const saved = localStorage.getItem("selected-institute");
      return saved ? JSON.parse(saved) : null;
    }
  );

  const [selectedRole, setSelectedRole] = useState<Role | null>(() => {
    const saved = localStorage.getItem("selected-role");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("auth-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth-user");
    }
  }, [user]);

  useEffect(() => {
    if (preContextToken) {
      localStorage.setItem("pre-context-token", preContextToken);
    } else {
      localStorage.removeItem("pre-context-token");
    }
  }, [preContextToken]);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("access-token", accessToken);
    } else {
      localStorage.removeItem("access-token");
    }
  }, [accessToken]);

  useEffect(() => {
    if (institutes.length > 0) {
      localStorage.setItem("auth-institutes", JSON.stringify(institutes));
    } else {
      localStorage.removeItem("auth-institutes");
    }
  }, [institutes]);

  useEffect(() => {
    if (selectedInstitute) {
      localStorage.setItem(
        "selected-institute",
        JSON.stringify(selectedInstitute)
      );
    } else {
      localStorage.removeItem("selected-institute");
    }
  }, [selectedInstitute]);

  useEffect(() => {
    if (selectedRole) {
      localStorage.setItem("selected-role", JSON.stringify(selectedRole));
    } else {
      localStorage.removeItem("selected-role");
    }
  }, [selectedRole]);

  function loginUser(userData: User, token: string) {
    setUser(userData);
    setPreContextToken(token);
    setAccessToken(null);
  }

  function setInstitutes(institutesList: Institute[]) {
    setInstitutesState(institutesList);
  }

  function selectContext(institute: Institute, role: Role, token: string) {
    setSelectedInstitute(institute);
    setSelectedRole(role);
    setAccessToken(token);
    setPreContextToken(null);
  }

  function logoutUser() {
    setUser(null);
    setPreContextToken(null);
    setAccessToken(null);
    setInstitutesState([]);
    setSelectedInstitute(null);
    setSelectedRole(null);

    localStorage.removeItem("auth-user");
    localStorage.removeItem("pre-context-token");
    localStorage.removeItem("access-token");
    localStorage.removeItem("auth-institutes");
    localStorage.removeItem("selected-institute");
    localStorage.removeItem("selected-role");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        preContextToken,
        accessToken,
        institutes,
        selectedInstitute,
        selectedRole,
        loginUser,
        setInstitutes,
        selectContext,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}