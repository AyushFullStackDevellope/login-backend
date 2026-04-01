import React, { useState } from "react";
import { useToast } from "../contexts/ToastContext";
import { Button } from "./common/Button";
import { Input } from "./common/Input";
import { APP_CONSTANTS } from "../utils/constants";

interface LoginFormProps {
  onLogin: (email: string, pass: string) => void;
}

// Form component that handles capturing the user credentials
function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) {
      showToast(APP_CONSTANTS.ERROR_ENTER_CREDENTIALS, "error");
      return;
    }

    // Pass the credentials up to the parent component (LoginPage)
    onLogin(email, password);
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <Input
        type="text"
        placeholder={APP_CONSTANTS.USERNAME_PLACEHOLDER}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />

      <Input
        type="password"
        placeholder={APP_CONSTANTS.PASSWORD_PLACEHOLDER}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />

      <Button type="submit" variant="primary" fullWidth style={styles.loginBtn}>
        {APP_CONSTANTS.LOGIN_BUTTON}
      </Button>
    </form>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  // Original login button color — teal green
  loginBtn: {
    backgroundColor: "#3d7a6e",
    color: "#ffffff",
  },
};

export default LoginForm;