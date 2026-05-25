import killer from "../assets/killer.jpeg";
import poverty from "../assets/poverty.jpeg";
import { apiRequest } from "./api";

export type Product = {
  id: string;
  slug: string;
  name: string;
  version: string;
  priceUSD: number;
  shortDescription: string;
  longDescription: string;
  features: string[];
  brokers: string[];
  markets: string[];
  imageSrc: string;
};

type BackendProduct = {
  id: string;
  slug: string;
  name: string;
  version?: string | null;
  description?: string | null;
  features?: string[] | null;
  price: number | string;
  image_url?: string | null;
  is_visible?: boolean;
};

export const ALL_BROKERS = [
  "Exness", "Deriv", "XM", "Just Market", "HF Market", "JP Market",
  "Razor Market", "Weltrade", "Scope Market", "RocketX", "Accumarkets",
];

export const ALL_MARKETS = [
  "XAUUSD", "Nas100", "US30", "Ger30", "USDJPY", "EURUSD",
  "Volatility 75", "Volatility 10 (1s)", "Volatility 50",
  "Volatility 25 (1s)", "Volatility 100 (1s)", "Volatility 100",
  "Boom 500", "Boom 1000", "Step Index", "Crash 500",
  "BTCUSDm", "USTECm", "XAUUSDm", "US500_x100m",
];

const PRODUCT_META: Record<string, Partial<Product>> = {
  "fx-killer-pv4-pro": {
    imageSrc: killer,
    shortDescription:
      "Analyzes real-time market data using price action, spread, volatility, RSI, Bollinger Bands and Moving Averages to find low-risk, high-probability trades automatically.",
    longDescription:
      "FX Killer PV4.0 Pro is a precision-tuned Expert Advisor built for serious traders. It continuously scans real-time market data to identify low-risk, high-probability entries and exits with no human input required.",
    features: [
      "Multi-indicator confluence engine",
      "Real-time spread and volatility filtering",
      "Automatic entry, SL and TP management",
      "Optimized for prop firm and personal accounts",
      "RoboTrader app setup support",
      "Free updates included with license",
    ],
  },
  "poverty-scalper-ea": {
    imageSrc: poverty,
    shortDescription:
      "Automated EA that identifies high-probability opportunities using trend analysis, price action and smart risk management.",
    longDescription:
      "Poverty Scalper EA V2.0+ is built for high-frequency scalping opportunities. It combines trend analysis with pure price action signals and smart risk management.",
    features: [
      "Smart trend and price action signal engine",
      "Built-in money management and lot scaling",
      "Tight stop-loss logic to protect equity",
      "Works on synthetic indices, forex and gold",
      "RoboTrader app setup support",
      "Lifetime updates with your license",
    ],
  },
};

export const PRODUCTS: Product[] = [
  {
    id: "fallback-fx-killer-pv4-pro",
    slug: "fx-killer-pv4-pro",
    name: "FX Killer PV4.0 Pro",
    version: "4.0 Pro",
    priceUSD: 30,
    shortDescription: PRODUCT_META["fx-killer-pv4-pro"].shortDescription!,
    longDescription: PRODUCT_META["fx-killer-pv4-pro"].longDescription!,
    features: PRODUCT_META["fx-killer-pv4-pro"].features!,
    brokers: ALL_BROKERS,
    markets: ALL_MARKETS,
    imageSrc: killer,
  },
  {
    id: "fallback-poverty-scalper-ea",
    slug: "poverty-scalper-ea",
    name: "Poverty Scalper EA",
    version: "2.0+",
    priceUSD: 21,
    shortDescription: PRODUCT_META["poverty-scalper-ea"].shortDescription!,
    longDescription: PRODUCT_META["poverty-scalper-ea"].longDescription!,
    features: PRODUCT_META["poverty-scalper-ea"].features!,
    brokers: ALL_BROKERS,
    markets: ALL_MARKETS,
    imageSrc: poverty,
  },
];

function mapProduct(product: BackendProduct): Product {
  const meta = PRODUCT_META[product.slug] || {};
  const description = product.description || meta.longDescription || "";
  const features = product.features?.length ? product.features : meta.features || [];

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    version: product.version || meta.version || "",
    priceUSD: Number(product.price),
    shortDescription: meta.shortDescription || description,
    longDescription: meta.longDescription || description,
    features,
    brokers: ALL_BROKERS,
    markets: ALL_MARKETS,
    imageSrc: product.image_url || meta.imageSrc || killer,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await apiRequest<{ products: BackendProduct[] }>("/products");
  return data.products.map(mapProduct);
}

export async function fetchProduct(slug: string): Promise<Product> {
  const data = await apiRequest<{ product: BackendProduct }>(`/products/${slug}`);
  return mapProduct(data.product);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
