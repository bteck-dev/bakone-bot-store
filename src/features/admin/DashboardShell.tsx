import { useCallback, useEffect, useMemo, useState } from "react";
import { BarChart3, Boxes, History, LogOut, MessageCircle, RefreshCw, ShoppingCart } from "lucide-react";
import logo from "../../assets/logo.jpeg";
import { adminApi } from "./adminApi";
import { ErrorPanel } from "./components";
import { AuditPanel } from "./panels/AuditPanel";
import { MessagesPanel } from "./panels/MessagesPanel";
import { OrdersPanel } from "./panels/OrdersPanel";
import { OverviewPanel } from "./panels/OverviewPanel";
import { ProductsPanel } from "./panels/ProductsPanel";
import type { AdminTab, AuditLog, DashboardStats, MessageLog, Order, Product, Thread } from "./types";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "products", label: "Products", icon: Boxes },
  { id: "audit", label: "Audit Logs", icon: History },
] as const;

export function DashboardShell({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, ordersData, productsData, auditData, threadsData, messagesData] = await Promise.all([
        adminApi.dashboard(),
        adminApi.orders(),
        adminApi.products(),
        adminApi.auditLogs(),
        adminApi.threads(),
        adminApi.messages(),
      ]);
      setStats(statsData);
      setOrders(ordersData.orders);
      setProducts(productsData.products);
      setAuditLogs(auditData.logs);
      setThreads(threadsData.threads);
      setMessages(messagesData.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.payment_status === "paid" && order.key_status === "pending_delivery"),
    [orders],
  );
  const failedMessages = stats?.stats.failedMessages || 0;

  const openMessageForOrder = (order: Order) => {
    setSelectedOrder(order);
    setActiveTab("messages");
  };

  return (
    <main className="min-h-screen bg-background grid-bg">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-border bg-card/90 backdrop-blur-xl lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block lg:px-6 lg:py-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Bakone Trades" className="h-11 w-11 rounded-md border border-border object-cover" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-primary">Bakone</div>
                <h1 className="font-display text-2xl font-bold">Dashboard</h1>
              </div>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:flex-col lg:px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`inline-flex min-w-fit items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition lg:w-full ${activeTab === tab.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                  <Icon className="h-4 w-4" /> {tab.label}
                </button>
              );
            })}
          </nav>
          <div className="hidden px-6 pb-6 lg:mt-auto lg:block">
            <div className="rounded-md border border-border bg-background/50 p-4">
              <div className="text-sm font-semibold">Admin session</div>
              <p className="mt-1 text-xs text-muted-foreground">Logged in with a protected API token.</p>
              <button onClick={onLogout} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold transition hover:border-destructive/50 hover:text-destructive">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mb-5 rounded-md border border-border bg-card/90 p-4 shadow-xl shadow-black/10 backdrop-blur-xl">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <h2 className="font-display text-3xl font-bold">Admin Control Center</h2>
                <p className="mt-1 text-sm text-muted-foreground">Track orders, deliver licenses, message customers and monitor system health.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <TopChip label="Pending delivery" value={pendingOrders.length} tone={pendingOrders.length ? "warn" : "ok"} />
                <TopChip label="Products" value={products.filter((product) => product.is_visible).length} tone="ok" />
                <TopChip label="Failed messages" value={failedMessages} tone={failedMessages ? "bad" : "ok"} />
                <button onClick={loadAll} className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:border-primary/50 hover:text-primary">
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current view</div>
              <h3 className="mt-1 font-display text-2xl font-bold capitalize">{activeTab}</h3>
            </div>
          </div>

          {error && <div className="mb-5"><ErrorPanel message={error} onRetry={loadAll} /></div>}

          {activeTab === "overview" && <OverviewPanel stats={stats} recentOrders={stats?.recentOrders || []} pendingOrders={pendingOrders} onMessageOrder={openMessageForOrder} />}
          {activeTab === "orders" && <OrdersPanel orders={orders} onChanged={loadAll} onMessageOrder={openMessageForOrder} />}
          {activeTab === "messages" && <MessagesPanel threads={threads} messages={messages} orders={orders} selectedOrder={selectedOrder} onSelectedOrder={setSelectedOrder} onChanged={loadAll} />}
          {activeTab === "products" && <ProductsPanel products={products} onChanged={loadAll} />}
          {activeTab === "audit" && <AuditPanel logs={auditLogs} />}
        </section>
      </div>
    </main>
  );
}

function TopChip({ label, value, tone }: { label: string; value: number; tone: "ok" | "warn" | "bad" }) {
  const color = tone === "ok" ? "border-primary/30 text-primary" : tone === "warn" ? "border-accent/40 text-accent" : "border-destructive/40 text-destructive";
  return (
    <div className={`rounded-md border bg-background px-3 py-2 text-sm ${color}`}>
      <span className="font-bold">{value}</span>
      <span className="ml-2 text-muted-foreground">{label}</span>
    </div>
  );
}
