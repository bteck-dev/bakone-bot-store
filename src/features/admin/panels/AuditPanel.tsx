import { useState } from "react";
import { History } from "lucide-react";
import { DataBlock, paginate, Pagination, StatusBadge } from "../components";
import type { AuditLog } from "../types";

export function AuditPanel({ logs }: { logs: AuditLog[] }) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const visibleLogs = paginate(logs, page, pageSize);

  return (
    <DataBlock title="Audit logs" action={<StatusBadge status={`${logs.length} events`} />}>
      <div className="divide-y divide-border">
        {visibleLogs.length ? visibleLogs.map((log) => (
          <article key={log.id} className="grid gap-3 p-4 transition hover:bg-secondary/20 md:grid-cols-[180px_1fr_160px]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold">
                <History className="h-3.5 w-3.5 text-primary" />
                {new Date(log.created_at).toLocaleString()}
              </div>
            </div>
            <div className="min-w-0">
              <div className="font-semibold">{log.description}</div>
              <div className="mt-1 break-all text-xs text-muted-foreground">{log.entity_type || "system"} {log.entity_id ? `- ${log.entity_id}` : ""}</div>
            </div>
            <div className="flex items-start justify-start md:justify-end">
              <StatusBadge status={log.action.toLowerCase()} />
            </div>
          </article>
        )) : <p className="p-6 text-sm text-muted-foreground">No audit logs found.</p>}
      </div>
      <Pagination page={page} pageSize={pageSize} total={logs.length} onPageChange={setPage} />
    </DataBlock>
  );
}
