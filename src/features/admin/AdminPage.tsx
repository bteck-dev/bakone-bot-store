import { useEffect, useState } from "react";
import { clearAuthToken, getAuthToken, onAuthExpired, setAuthToken } from "@/lib/api";
import { DashboardShell } from "./DashboardShell";
import { LoginScreen } from "./LoginScreen";

export default function AdminPage() {
  const [token, setToken] = useState(() => getAuthToken() || "");

  useEffect(() => onAuthExpired(() => setToken("")), []);

  const logout = () => {
    clearAuthToken();
    setToken("");
  };

  if (!token) {
    return <LoginScreen onLogin={(nextToken) => { setAuthToken(nextToken); setToken(nextToken); }} />;
  }

  return <DashboardShell onLogout={logout} />;
}
