import React from "react";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";
import { useTheme } from "./contexts/ThemeContext";

function App() {
  const { theme } = useTheme();

  return (
    <div className="App" data-theme={theme}>
      <AppRoutes />
    </div>
  );
}

export default App;