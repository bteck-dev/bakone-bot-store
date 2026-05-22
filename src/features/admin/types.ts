export type DashboardStats = {
  stats: {
    totalRevenue: number;
    monthRevenue: number;
    totalOrders: number;
    ordersThisMonth: number;
    pendingDeliveries: number;
    deliveredKeys: number;
    openMessageThreads?: number;
    failedMessages?: number;
  };
  recentOrders: Order[];
  recentActivity: Array<{ action: string; description: string; created_at: string }>;
  pendingDeliveryAlert: boolean;
};

export type Order = {
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  product_name: string;
  amount: number;
  currency?: string;
  payment_status: string;
  key_status: string;
  created_at: string;
};

export type Thread = {
  id: string;
  order_id?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_name?: string;
  subject?: string;
  status: string;
  last_message_at?: string;
};

export type MessageLog = {
  id: string;
  thread_id?: string;
  order_id?: string;
  channel: "email" | "whatsapp";
  direction: "inbound" | "outbound";
  recipient: string;
  sender?: string;
  subject?: string;
  body_text?: string;
  status: string;
  created_at: string;
  error_message?: string;
};

export type Product = {
  id: string;
  name: string;
  version?: string;
  slug: string;
  description?: string;
  features?: string[];
  price: number;
  image_url?: string;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ProductFormInput = {
  name: string;
  version?: string;
  slug: string;
  description?: string;
  features?: string[];
  price: number;
  image_url?: string;
  is_visible?: boolean;
};

export type AuditLog = {
  id: string;
  action: string;
  admin_id?: string;
  entity_type?: string;
  entity_id?: string;
  description: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
};

export type AdminTab = "overview" | "orders" | "messages" | "products" | "audit";
