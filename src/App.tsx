import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ErrorFallback from "./components/ErrorFallback";
import { API_BASE_URL } from "./lib/api";

const Home = lazy(() => import("./routes/index"));
const Shop = lazy(() => import("./routes/shop"));
const Product = lazy(() => import("./routes/products.$slug"));
const Contact = lazy(() => import("./routes/contact"));
const Success = lazy(() => import("./routes/success"));
const Admin = lazy(() => import("./routes/admin"));
const TermsOfService = lazy(() => import("./routes/termsofservice"));

type BootState = "checking" | "ready" | "error";

// eslint-disable-next-line prettier/prettier
export default function App() {
  const [bootState, setBootState] = useState<BootState>("checking");
  const [error, setError] = useState("");

  const checkHealth = async () => {
    setBootState("checking");
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        headers: { Accept: "application/json" },
      });
      const body = await response.json().catch(() => null);
      const health = body?.data;

      if (!response.ok || !body?.success || health?.status !== "ok") {
        throw new Error(body?.message || "Backend health check failed.");
      }

      setBootState("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Backend server is not running.");
      setBootState("error");
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  if (bootState === "checking") {
    return <StartupScreen />;
  }

  if (bootState === "error") {
    return (
      <ErrorFallback
        title="We are still working on it"
        message="Something is temporarily unavailable on our side. Please try again in a few moments."
        statusCode={500}
        statusText="Internal Server Error"
        error={new Error(error)}
        details={{
          healthEndpoint: `${API_BASE_URL}/health`,
          expected: "Backend health response with success=true and data.status=ok",
        }}
        onReset={checkHealth}
      />
    );
  }

  return (
    <Suspense fallback={<StartupScreen label="Loading page" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/products/:slug" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/termsofservice" element={<TermsOfService />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function StartupScreen({ label = "Checking system health" }: { label?: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 grid-bg">
      <section className="w-full max-w-md rounded-md border border-border bg-card/90 p-6 text-center shadow-2xl shadow-black/30">
        <img src="/logo.jpeg" alt="Bakone Trades" className="mx-auto h-14 w-14 rounded-md border border-border object-cover" />
        <h1 className="mt-5 font-display text-3xl font-bold">Bakone Trades</h1>
        <p className="mt-2 text-sm text-muted-foreground">{label}</p>
        <div className="mx-auto mt-6 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/2 animate-[loading-bar_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Preparing your experience</p>
      </section>
    </main>
  );
}
