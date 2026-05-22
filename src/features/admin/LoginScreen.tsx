import React, { useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { adminApi } from "./adminApi";
import { ErrorPanel } from "./components";

export function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await adminApi.login(email, password);
      onLogin(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 grid-bg">
      <form onSubmit={submit} className="w-full max-w-md rounded-md border border-border bg-card/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="mb-6">
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage payments, deliveries and customer conversations.</p>
        </div>
        {error && <div className="mb-4"><ErrorPanel message={error} /></div>}
        <label className="mb-1.5 block text-sm font-medium" htmlFor="admin-email">Email</label>
        <input id="admin-email" value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="mb-4 w-full rounded-md border border-input bg-background px-4 py-3 outline-none transition focus:border-primary" required />
        <label className="mb-1.5 block text-sm font-medium" htmlFor="admin-password">Password</label>
        <input id="admin-password" value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="mb-5 w-full rounded-md border border-input bg-background px-4 py-3 outline-none transition focus:border-primary" required />
        <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
          <LockKeyhole className="h-4 w-4" />
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="mt-4 text-center text-xs text-muted-foreground">Backend: {API_BASE_URL}</p>
      </form>
    </main>
  );
}
