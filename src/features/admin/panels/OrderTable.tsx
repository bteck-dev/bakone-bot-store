import { CheckCircle2, CreditCard, Mail, MessageCircle } from "lucide-react";
import { adminApi } from "../adminApi";
import { paginate, Pagination, StatusBadge } from "../components";
import type { Order } from "../types";
import { useState } from "react";

export function OrderTable({ orders, compact, empty = "No orders found.", onChanged, onMessageOrder }: {
  orders: Order[];
  compact?: boolean;
  empty?: string;
  onChanged?: () => void;
  onMessageOrder?: (order: Order) => void;
}) {
  const pageSize = compact ? 5 : 8;
  const [page, setPage] = useState(1);
  const visibleOrders = paginate(orders, page, pageSize);

  if (!orders.length) {
    return <p className="p-6 text-sm text-muted-foreground">{empty}</p>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="border-b border-border bg-background/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {visibleOrders.map((order) => (
              <tr key={order.order_id} className="transition hover:bg-secondary/20">
                <td className="px-4 py-4 font-mono text-xs text-muted-foreground">{order.order_id}</td>
                <td className="px-4 py-3">
                  <div className="font-semibold">{order.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                  {order.customer_phone && <div className="text-xs text-muted-foreground">{order.customer_phone}</div>}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{order.product_name}</div>
                  <div className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={order.payment_status} /></td>
                <td className="px-4 py-3"><StatusBadge status={order.key_status} /></td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {onMessageOrder && (
                      <button onClick={() => onMessageOrder(order)} className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold transition hover:border-primary/50 hover:text-primary">
                        {order.customer_phone ? <MessageCircle className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
                        Send message
                      </button>
                    )}
                    {!compact && order.payment_status === "pending" && (
                      <ConfirmPaymentButton orderId={order.order_id} onChanged={onChanged} />
                    )}
                    {!compact && order.payment_status === "paid" && order.key_status === "pending_delivery" && (
                      <DeliverButton orderId={order.order_id} onChanged={onChanged} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} pageSize={pageSize} total={orders.length} onPageChange={setPage} />
    </>
  );
}

function ConfirmPaymentButton({ orderId, onChanged }: { orderId: string; onChanged?: () => void }) {
  const [loading, setLoading] = useState(false);

  const confirmPaid = async () => {
    if (!window.confirm("Confirm that this iKhokha payment was received? This will email the customer.")) return;

    setLoading(true);
    try {
      await adminApi.confirmPayment(orderId);
      onChanged?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={confirmPaid} disabled={loading} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
      <CreditCard className="h-3.5 w-3.5" />
      {loading ? "Confirming..." : "Confirm payment"}
    </button>
  );
}

function DeliverButton({ orderId, onChanged }: { orderId: string; onChanged?: () => void }) {
  const [loading, setLoading] = useState(false);

  const deliver = async () => {
    setLoading(true);
    try {
      await adminApi.markDelivered(orderId, {
        delivery_method: "email",
        delivery_notes: "Marked delivered from orders table",
      });
      onChanged?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={deliver} disabled={loading} className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
      <CheckCircle2 className="h-3.5 w-3.5" />
      {loading ? "Saving..." : "Mark delivered"}
    </button>
  );
}
