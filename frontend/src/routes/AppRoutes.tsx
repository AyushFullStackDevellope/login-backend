import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import InstituteSelection from "../pages/InstituteSelection";
import RoleSelection from "../pages/RoleSelection";
import Dashboard from "../pages/Dashboard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/select-institute" element={<InstituteSelection />} />
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;