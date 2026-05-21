
-- Products are hardcoded but we store them for reference
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_usd NUMERIC(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO public.products (id, name, price_usd, description) VALUES
  ('fx-killer-pv4', 'FX Killer PV4.0 Pro', 30.00, 'Analyzes real-time market data using price action, spread, volatility, RSI, Bollinger Bands, and Moving Averages to find low-risk, high-probability trade entries and exits automatically.'),
  ('poverty-scalper-v2', 'Poverty Scalper EA V2.0+', 21.00, 'An automated Expert Advisor that identifies high-probability market opportunities using trend analysis, price action, and smart risk management. Also known as Poverty Killer EA.');

-- License keys pool
CREATE TABLE public.license_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES public.products(id),
  key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'used')),
  assigned_to_email TEXT,
  assigned_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payfast_payment_id TEXT UNIQUE,
  m_payment_id TEXT UNIQUE,
  product_id TEXT NOT NULL REFERENCES public.products(id),
  customer_email TEXT NOT NULL,
  amount_usd NUMERIC(10,2) NOT NULL,
  amount_zar NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  license_key_id UUID REFERENCES public.license_keys(id),
  payfast_raw JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contact messages
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.license_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can read products (public catalog)
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);

-- License keys: no public access (only service role / edge functions)
-- Orders: customers can look up their own order by m_payment_id via edge function
-- (no direct table policies needed; edge functions use service role)

-- Anyone can submit a contact message
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
