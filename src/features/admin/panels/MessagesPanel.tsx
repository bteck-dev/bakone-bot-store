import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { CheckCircle2, ExternalLink, Mail, MessageCircle, Phone, Search, Send, UserRound } from "lucide-react";
import { adminApi } from "../adminApi";
import { DataBlock, paginate, Pagination, StatusBadge } from "../components";
import type { MessageLog, Order, Thread } from "../types";

const botsyncAppUrl = import.meta.env.VITE_BOTSYNC_APP_DOWNLOAD_URL || "";

export function MessagesPanel({ threads, messages, orders, selectedOrder, onSelectedOrder, onChanged }: {
  threads: Thread[];
  messages: MessageLog[];
  orders: Order[];
  selectedOrder?: Order;
  onSelectedOrder: (order: Order | undefined) => void;
  onChanged: () => void;
}) {
  const [query, setQuery] = useState("");
  const [customerPage, setCustomerPage] = useState(1);
  const customerPageSize = 6;
  const paidUndelivered = useMemo(
    () => orders.filter((order) => order.payment_status === "paid" && order.key_status === "pending_delivery"),
    [orders],
  );
  const filteredOrders = useMemo(() => {
    const value = query.toLowerCase().trim();
    if (!value) return orders;
    return orders.filter((order) =>
      [order.order_id, order.customer_name, order.customer_email, order.customer_phone, order.product_name]
        .filter(Boolean)
        .some((item) => String(item).toLowerCase().includes(value)),
    );
  }, [orders, query]);
  const currentOrder = selectedOrder || paidUndelivered[0] || filteredOrders[0] || orders[0];
  const visibleCustomers = paginate(filteredOrders, customerPage, customerPageSize);

  return (
    <div className="space-y-5">
      <DataBlock title="Customers" action={<StatusBadge status={`${paidUndelivered.length} need delivery`} />}>
        <div className="border-b border-border p-4">
          <label className="relative block max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCustomerPage(1);
              }}
              placeholder="Search by customer, email, order or product"
              className="w-full rounded-md border border-input bg-background py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary"
            />
          </label>
        </div>

        <div className="grid gap-3 p-4 lg:grid-cols-2 2xl:grid-cols-3">
          {visibleCustomers.map((order) => (
            <button
              key={order.order_id}
              onClick={() => onSelectedOrder(order)}
              className={`rounded-md border p-4 text-left transition hover:border-primary/50 hover:bg-secondary/20 ${currentOrder?.order_id === order.order_id ? "border-primary/60 bg-primary/10" : "border-border bg-background/60"}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-bold">
                  {initials(order.customer_name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{order.customer_name}</div>
                      <div className="mt-1 truncate text-xs text-muted-foreground">{order.order_id}</div>
                    </div>
                    <StatusBadge status={order.key_status} />
                  </div>
                  <div className="mt-3 truncate text-sm text-muted-foreground">{order.product_name}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge status={order.payment_status} />
                    {order.customer_phone && <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">Phone available</span>}
                  </div>
                </div>
              </div>
            </button>
          ))}
          {!visibleCustomers.length && <p className="text-sm text-muted-foreground">No customers found.</p>}
        </div>
        <Pagination page={customerPage} pageSize={customerPageSize} total={filteredOrders.length} onPageChange={setCustomerPage} />
      </DataBlock>

      {currentOrder && (
        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <CustomerConversation order={currentOrder} messages={messages} />
          <CustomerActionPanel order={currentOrder} threads={threads} onSent={onChanged} />
        </section>
      )}
    </div>
  );
}

function CustomerConversation({ order, messages }: { order: Order; messages: MessageLog[] }) {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const relatedMessages = useMemo(
    () => messages.filter((message) => !message.order_id || message.order_id === order.order_id),
    [messages, order.order_id],
  );
  const visibleMessages = paginate(relatedMessages, page, pageSize);

  useEffect(() => setPage(1), [order.order_id]);

  return (
    <DataBlock title="Conversation">
      <div className="border-b border-border p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-2xl font-bold">{order.customer_name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{order.product_name} - {order.order_id}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={order.payment_status} />
            <StatusBadge status={order.key_status} />
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {visibleMessages.length ? visibleMessages.map((message) => (
          <article key={message.id} className="rounded-md border border-border bg-background/70 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {message.channel === "email" ? <Mail className="h-4 w-4 text-primary" /> : <MessageCircle className="h-4 w-4 text-primary" />}
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{message.channel}</span>
                <StatusBadge status={message.status} />
              </div>
              <time className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString()}</time>
            </div>
            {message.subject && <h4 className="mt-3 font-semibold">{message.subject}</h4>}
            <p className="mt-2 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {message.body_text || "Rich email content was sent and logged."}
            </p>
            <div className="mt-3 text-xs text-muted-foreground">To: {message.recipient}</div>
            {message.error_message && <div className="mt-2 text-xs text-destructive">{message.error_message}</div>}
          </article>
        )) : (
          <div className="rounded-md border border-dashed border-border p-8 text-center">
            <MessageCircle className="mx-auto h-8 w-8 text-primary" />
            <p className="mt-3 font-semibold">No messages for this order yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Use the send panel to contact the customer and keep proof in the system.</p>
          </div>
        )}
      </div>
      <Pagination page={page} pageSize={pageSize} total={relatedMessages.length} onPageChange={setPage} />
    </DataBlock>
  );
}

function CustomerActionPanel({ order, threads, onSent }: { order: Order; threads: Thread[]; onSent: () => void }) {
  const relatedThreads = threads.filter((thread) => thread.order_id === order.order_id || thread.customer_email === order.customer_email);
  const whatsappHref = order.customer_phone ? `https://wa.me/${order.customer_phone.replace(/\D/g, "")}` : "";

  return (
    <div className="space-y-5">
      <DataBlock title="Customer details">
        <div className="space-y-4 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <UserRound className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold">{order.customer_name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{order.product_name}</div>
            </div>
          </div>

          <ContactLink icon={<Mail className="h-4 w-4" />} label={order.customer_email} href={`mailto:${order.customer_email}`} />
          {order.customer_phone && <ContactLink icon={<Phone className="h-4 w-4" />} label={`${order.customer_phone} - open phone WhatsApp`} href={whatsappHref} />}

          <div className="rounded-md border border-border bg-background p-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Threads linked to customer</div>
            <div className="mt-2 space-y-2">
              {relatedThreads.slice(0, 3).map((thread) => (
                <div key={thread.id} className="rounded-md bg-card p-2 text-xs">
                  <div className="font-semibold">{thread.subject || thread.order_id || "Customer thread"}</div>
                  <div className="mt-1 text-muted-foreground">{thread.status}</div>
                </div>
              ))}
              {!relatedThreads.length && <p className="text-xs text-muted-foreground">No thread has been created yet.</p>}
            </div>
          </div>
        </div>
      </DataBlock>

      <ManualDeliveryCard order={order} onChanged={onSent} />
      <MessageComposer order={order} onSent={onSent} />
    </div>
  );
}

function ContactLink({ icon, label, href }: { icon: ReactNode; label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm transition hover:border-primary/50 hover:text-primary">
      <span className="flex min-w-0 items-center gap-2">
        <span className="text-primary">{icon}</span>
        <span className="truncate">{label}</span>
      </span>
      <ExternalLink className="h-4 w-4 shrink-0" />
    </a>
  );
}

function MessageComposer({ order, onSent }: { order: Order; onSent: () => void }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTo(order.customer_email);
    setSubject(`Your ${order.product_name} license key`);
    setMessage(
      `<div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:auto;color:#111827">` +
      `<div style="background:#0f0f0f;padding:24px;text-align:center;border-radius:16px 16px 0 0">` +
      `<h1 style="margin:0;color:#ffffff">Bakone <span style="color:#f7c948">Trades</span></h1>` +
      `</div>` +
      `<div style="border:1px solid #e5e7eb;border-top:0;border-radius:0 0 16px 16px;padding:28px">` +
      `<h2>Your Bakone Trades License Key</h2>` +
      `<p>Hi ${order.customer_name},</p>` +
      `<p>Your <strong>${order.product_name}</strong> license key is:</p>` +
      `<p style="font-size:20px;padding:14px;border:1px solid #bbf7d0;background:#f0fdf4;border-radius:10px"><strong>PASTE-LICENSE-KEY-HERE</strong></p>` +
      `<h3>Start using your bot</h3>` +
      `<ol style="line-height:1.8">` +
      `<li><strong>Download the BotSync app on your Android phone.</strong><br/>${botsyncAppUrl ? `<a href="${botsyncAppUrl}">Download the BotSync app here</a>` : "Use the BotSync download link provided by Bakone Trades support."}</li>` +
      `<li><strong>Open the app and add the license key.</strong><br/>Paste the key exactly as it appears in this email.</li>` +
      `<li><strong>Connect the app to your trading server.</strong><br/>Use your broker login details.</li>` +
      `<li><strong>Allow all symbols.</strong><br/>This lets the app see the markets available on your trading account.</li>` +
      `</ol>` +
      `<p style="color:#6b7280">Order: ${order.order_id}</p>` +
      `</div>` +
      `</div>`,
    );
  }, [order]);

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      await adminApi.sendEmail({ order_id: order.order_id, to, subject, html: message });
      setStatus("Email sent, logged, and order marked delivered.");
      onSent();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Message failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataBlock title="Send message">
      <form onSubmit={send} className="space-y-3 p-4">
        <div className="rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
          System delivery is email only. Phone/WhatsApp delivery can still be marked manually below.
        </div>
        <input value={to} onChange={(event) => setTo(event.target.value)} placeholder="customer@email.com" className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary" required />
        <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary" required />
        <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={7} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary" required />
        <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
          <Send className="h-4 w-4" /> {loading ? "Sending..." : "Send and log"}
        </button>
        {status && <p className="text-sm text-muted-foreground">{status}</p>}
      </form>
    </DataBlock>
  );
}

function ManualDeliveryCard({ order, onChanged }: { order: Order; onChanged: () => void }) {
  const [notes, setNotes] = useState("Sent license key manually from my phone.");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const markDelivered = async () => {
    setLoading(true);
    setStatus("");
    try {
      await adminApi.markDelivered(order.order_id, {
        delivery_method: "whatsapp",
        delivery_notes: notes,
      });
      setStatus("Order marked delivered.");
      onChanged();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not mark delivered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataBlock title="Manual phone delivery">
      <div className="space-y-3 p-4">
        <p className="text-sm text-muted-foreground">
          Use this after you send the license key from your own phone or WhatsApp. It updates the order to delivered and creates an audit log.
        </p>
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary" />
        <button disabled={loading || order.key_status === "delivered"} onClick={markDelivered} className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-4 py-2.5 font-bold text-primary transition hover:bg-primary hover:text-primary-foreground disabled:opacity-60">
          <CheckCircle2 className="h-4 w-4" /> {loading ? "Saving..." : order.key_status === "delivered" ? "Already delivered" : "Mark delivered"}
        </button>
        {status && <p className="text-sm text-muted-foreground">{status}</p>}
      </div>
    </DataBlock>
  );
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "BT";
}
