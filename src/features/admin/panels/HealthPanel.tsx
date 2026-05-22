import { Activity, Database, MessageCircle, Route, ShieldCheck, Server } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { DataBlock, StatusBadge } from "../components";
import type { DashboardStats } from "../types";

type HealthPanelProps = {
  health: any;
  routeProbe: { ok: boolean; status: number } | null;
  stats: DashboardStats | null;
};

type CheckStatus = "ok" | "warning" | "error";

export function HealthPanel({ health, routeProbe, stats }: HealthPanelProps) {
  const database = health?.database || {};
  const checks: Array<{
    title: string;
    status: CheckStatus;
    detail: string;
    icon: typeof Server;
  }> = [
    {
      title: "Backend API",
      status: health?.status === "ok" ? "ok" : health?.status === "degraded" ? "warning" : "error",
      detail: health ? `Health endpoint responded from ${API_BASE_URL}` : "No response from the health endpoint yet.",
      icon: Server,
    },
    {
      title: "Database",
      status: database.status === "ok" ? "ok" : "error",
      detail: database.message || (database.latency_ms ? `Connected in ${database.latency_ms}ms` : "Database status was not confirmed."),
      icon: Database,
    },
    {
      title: "Service role",
      status: database.service_role_key === "ok" || database.service_role === "ok" ? "ok" : database.status === "ok" ? "warning" : "error",
      detail: database.service_role_key === "ok" || database.service_role === "ok"
        ? "Supabase service role key passed the backend verification."
        : "Check SUPABASE_SERVICE_ROLE_KEY if protected database calls fail.",
      icon: ShieldCheck,
    },
    {
      title: "404 handling",
      status: routeProbe?.ok ? "ok" : "error",
      detail: routeProbe ? `Unknown routes return HTTP ${routeProbe.status}.` : "The 404 route check has not completed.",
      icon: Route,
    },
    {
      title: "Dashboard data",
      status: stats ? "ok" : "warning",
      detail: stats ? `${stats.stats.totalOrders} orders loaded into the admin dashboard.` : "Dashboard stats could not be loaded yet.",
      icon: Activity,
    },
    {
      title: "Messaging",
      status: stats ? (Number(stats.stats.failedMessages || 0) > 0 ? "warning" : "ok") : "warning",
      detail: stats
        ? `${stats.stats.openMessageThreads || 0} open threads, ${stats.stats.failedMessages || 0} failed messages.`
        : "Messaging stats are unavailable until dashboard data loads.",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {checks.map((check) => {
          const Icon = check.icon;
          return (
            <div key={check.title} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="rounded-md bg-secondary p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold">{check.title}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{check.detail}</p>
                  </div>
                </div>
                <StatusBadge status={check.status} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <DataBlock title="Project health response">
          <div className="space-y-4 p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SmallMetric label="Project" value={health?.status || "unknown"} />
              <SmallMetric label="Environment" value={health?.environment || "unknown"} />
              <SmallMetric label="Uptime" value={health?.uptime ? `${Math.round(health.uptime)}s` : "unknown"} />
              <SmallMetric label="Database" value={database.status || "unknown"} />
            </div>
            <pre className="max-h-80 overflow-auto rounded-md bg-background p-4 text-xs text-muted-foreground">
              {JSON.stringify(health || { status: "waiting" }, null, 2)}
            </pre>
          </div>
        </DataBlock>

        <DataBlock title="Recovery guide">
          <div className="space-y-3 p-4 text-sm text-muted-foreground">
            <p>
              If the backend is down, start it first and refresh this screen. If database checks fail, verify Supabase URL,
              anon key, service role key and the database connection string in `.env`.
            </p>
            <p>
              If customer delivery is disputed, open Orders, choose the paid order that is still pending delivery, then click
              Send message. The dashboard will load the customer details into the message composer and log the proof.
            </p>
            <p>
              For WhatsApp production replies, make sure the WhatsApp Business Cloud API token and phone number ID are set on
              the backend. Email delivery needs SMTP credentials.
            </p>
          </div>
        </DataBlock>
      </div>
    </div>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card/60 p-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  );
}
