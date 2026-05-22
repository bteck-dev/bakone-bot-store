import { AlertTriangle, Home, RefreshCw } from "lucide-react";

type ErrorFallbackProps = {
  title?: string;
  message?: string;
  statusCode?: number;
  statusText?: string;
  error?: Error | null;
  details?: Record<string, unknown>;
  onReset?: () => void;
  showDetails?: boolean;
};

export default function ErrorFallback({
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again or return to the home page.",
  statusCode = 500,
  statusText = "Internal Server Error",
  error,
  details,
  onReset,
  showDetails = false,
}: ErrorFallbackProps) {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 grid-bg">
      <section className="w-full max-w-2xl rounded-md border border-destructive/40 bg-card/95 p-6 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-5 text-center sm:text-left">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive sm:mx-0">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <div>
            <div className="text-sm font-semibold uppercase tracking-wider text-destructive">
              {statusCode} {statusText}
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{message}</p>
          </div>

          <div className="rounded-md border border-border bg-background p-4 text-center text-sm text-muted-foreground sm:text-left">
            <p>Our team has been notified. Please try again shortly.</p>
          </div>

          {showDetails && (error || details) && (
            <div className="max-h-56 overflow-auto rounded-md border border-border bg-background p-4 text-left">
              {error && (
                <>
                  <p className="mb-2 font-mono text-sm font-medium text-destructive">
                    {error.name}: {error.message}
                  </p>
                  {error.stack && (
                    <pre className="whitespace-pre-wrap break-words font-mono text-xs text-muted-foreground">
                      {error.stack}
                    </pre>
                  )}
                </>
              )}
              {details && (
                <pre className="whitespace-pre-wrap break-words font-mono text-xs text-muted-foreground">
                  {JSON.stringify(details, null, 2)}
                </pre>
              )}
            </div>
          )}

          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:justify-start">
            {onReset && (
              <button onClick={onReset} className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 font-bold text-primary-foreground transition hover:opacity-90">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            )}
            <button onClick={handleGoHome} className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 font-bold transition hover:border-primary/50 hover:text-primary">
              <Home className="h-4 w-4" />
              Go to Home
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
