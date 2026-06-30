import { apiRequest, authRequest } from "@/lib/api";
import type { AuditLog, DashboardStats, MessageLog, Order, Product, ProductFormInput, Thread } from "./types";

export const adminApi = {
  login: (email: string, password: string) =>
    apiRequest<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  dashboard: () => authRequest<DashboardStats>("/dashboard/stats"),
  orders: () => authRequest<{ orders: Order[] }>("/orders"),
  products: () => authRequest<{ products: Product[] }>("/products/admin/all"),
  auditLogs: () => authRequest<{ logs: AuditLog[] }>("/audit?limit=50"),
  threads: () => authRequest<{ threads: Thread[] }>("/messages/threads"),
  messages: () => authRequest<{ messages: MessageLog[] }>("/messages"),
  createProduct: (payload: ProductFormInput) =>
    authRequest<{ product: Product }>("/products", { method: "POST", body: JSON.stringify(payload) }),
  updateProduct: (id: string, payload: Partial<ProductFormInput>) =>
    authRequest<{ product: Product }>(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  removeProduct: (id: string) =>
    authRequest<{ product: Product }>(`/products/${id}`, { method: "DELETE" }),
  sendEmail: (payload: { order_id?: string; to: string; subject: string; html: string }) =>
    authRequest("/messages/email", { method: "POST", body: JSON.stringify(payload) }),
  confirmPayment: (orderId: string, payload?: { payment_reference?: string }) =>
    authRequest<{ order: Order }>(`/orders/${orderId}/confirm-payment`, {
      method: "PATCH",
      body: JSON.stringify({ payment_reference: payload?.payment_reference }),
    }),
  markDelivered: (orderId: string, payload?: { delivery_method?: "email" | "whatsapp" | "both"; delivery_notes?: string }) =>
    authRequest(`/orders/${orderId}/deliver`, {
      method: "PATCH",
      body: JSON.stringify({
        delivery_method: payload?.delivery_method || "email",
        delivery_notes: payload?.delivery_notes || "Marked delivered from dashboard",
      }),
    }),
};
