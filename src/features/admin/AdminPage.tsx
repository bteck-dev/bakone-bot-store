import { useState } from "react";
import { clearAuthToken, getAuthToken, setAuthToken } from "@/lib/api";
import { DashboardShell } from "./DashboardShell";
import { LoginScreen } from "./LoginScreen";

export default function AdminPage() {
  const [token, setToken] = useState(() => getAuthToken() || "");

  if (!token) {
    return <LoginScreen onLogin={(nextToken) => { setAuthToken(nextToken); setToken(nextToken); }} />;
  }

  return <DashboardShell onLogout={() => { clearAuthToken(); setToken(""); }} />;
}
