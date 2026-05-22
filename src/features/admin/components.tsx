import React from "react";
import { AlertCircle, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

export function StatusBadge({ status }: { status: string }) {
  const label = (status || "unknown").replace(/_/g, " ");
  const tone =
    status === "paid" || status === "sent" || status === "delivered" || status === "ok"
      ? "border-primary/40 bg-primary/10 text-primary"
      : status === "failed" || status === "error" || status === "cancelled"
        ? "border-destructive/40 bg-destructive/10 text-destructive"
        : "border-accent/40 bg-accent/10 text-accent";

  return <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${tone}`}>{label}</span>;
}

export function ErrorPanel({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 text-destructive" />
        <div className="min-w-0">
          <div className="font-semibold text-destructive">Something needs attention</div>
          <div className="mt-1 text-muted-foreground">{message}</div>
          {onRetry && (
            <button onClick={onRetry} className="mt-3 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-semibold transition hover:border-primary/50 hover:text-primary">
              <RefreshCw className="h-4 w-4" /> Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function DataBlock({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-md border border-border bg-card shadow-xl shadow-black/10">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/20 px-4 py-3">
        <h3 className="font-display text-lg font-bold">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export function money(value: number) {
  return `$${Number(value || 0).toFixed(2)}`;
}

export function Pagination({ page, pageSize, total, onPageChange }: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  if (total <= pageSize) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-border bg-secondary/10 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <div>
        Showing <span className="font-semibold text-foreground">{start}</span> to <span className="font-semibold text-foreground">{end}</span> of <span className="font-semibold text-foreground">{total}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 font-semibold transition hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>
        <span className="rounded-md border border-border bg-background px-3 py-2 font-semibold text-foreground">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 font-semibold transition hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  return items.slice((page - 1) * pageSize, page * pageSize);
}
