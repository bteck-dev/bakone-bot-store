import { BarChart3, KeyRound, MessageCircle, ShoppingCart, TrendingUp } from "lucide-react";
import { DataBlock, money, StatusBadge } from "../components";
import type { DashboardStats, Order } from "../types";

export function OverviewPanel({ stats, recentOrders, pendingOrders, onMessageOrder }: {
  stats: DashboardStats | null;
  recentOrders: Order[];
  pendingOrders: Order[];
  onMessageOrder: (order: Order) => void;
}) {
  const cards = [
    { label: "Total revenue", value: money(stats?.stats.totalRevenue || 0), sub: `${money(stats?.stats.monthRevenue || 0)} this month`, icon: BarChart3 },
    { label: "Paid orders", value: String(stats?.stats.totalOrders || 0), sub: `${stats?.stats.ordersThisMonth || 0} this month`, icon: ShoppingCart },
    { label: "Pending delivery", value: String(stats?.stats.pendingDeliveries || 0), sub: "Needs license proof", icon: KeyRound },
    { label: "Open threads", value: String(stats?.stats.openMessageThreads || 0), sub: `${stats?.stats.failedMessages || 0} failed messages`, icon: MessageCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-md border border-border bg-card p-5 shadow-xl shadow-black/10">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">{card.label}</div>
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 text-3xl font-bold">{card.value}</div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                {card.sub}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <DataBlock title="Needs delivery">
          <OverviewOrderList orders={pendingOrders} empty="No paid orders waiting for license delivery." onMessageOrder={onMessageOrder} />
        </DataBlock>
        <DataBlock title="Recent orders">
          <OverviewOrderList orders={recentOrders} empty="No recent orders yet." />
        </DataBlock>
      </div>
    </div>
  );
}

function OverviewOrderList({ orders, empty, onMessageOrder }: {
  orders: Order[];
  empty: string;
  onMessageOrder?: (order: Order) => void;
}) {
  if (!orders.length) return <p className="p-6 text-sm text-muted-foreground">{empty}</p>;

  return (
    <div className="divide-y divide-border">
      {orders.slice(0, 5).map((order) => (
        <article key={order.order_id} className="p-4 transition hover:bg-secondary/20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="truncate font-semibold">{order.customer_name}</div>
              <div className="mt-1 truncate text-xs text-muted-foreground">{order.order_id} - {order.customer_email}</div>
              <div className="mt-2 truncate text-sm text-muted-foreground">{order.product_name}</div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
              <StatusBadge status={order.payment_status} />
              <StatusBadge status={order.key_status} />
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</div>
            {onMessageOrder && (
              <button onClick={() => onMessageOrder(order)} className="inline-flex w-fit items-center rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold transition hover:border-primary/50 hover:text-primary">
                Send message
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
