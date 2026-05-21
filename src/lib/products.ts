import killer from "../assets/killer.jpeg";
import poverty from "../assets/poverty.jpeg";

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

export const ALL_BROKERS = [
  "Exness", "Deriv", "XM", "Just Market", "HF Market", "JP Market",
  "Razor Market", "Weltrade", "Scope Market", "RocketX", "Accumarkets",
];

export const ALL_MARKETS = [
  "XAUUSD", "Nas100", "US30", "Ger30", "USDJPY", "EURUSD",
  "Volatility 75", "Volatility 10 (1s)", "Volatility 50",
  "Volatility 25 (1s)", "Volatility 100 (1s)", "Volatility 100",
  "Boom 500", "Boom 1000", "Step Index", "Crash 500",
  "BTCUSDm", "USTECm", "XAUUSDm", "US500_×100m",
];

export const PRODUCTS: Product[] = [
  {
    id: "fx-killer-pv4",
    slug: "fx-killer-pv4",
    name: "FX Killer PV4.0 Pro",
    version: "v4.0 Pro",
    priceUSD: 30,
    shortDescription:
      "Analyzes real-time market data using price action, spread, volatility, RSI, Bollinger Bands and Moving Averages to find low-risk, high-probability trades automatically.",
    longDescription:
      "FX Killer PV4.0 Pro is a precision-tuned Expert Advisor built for serious traders. It continuously scans real-time market data — price action, spread dynamics, volatility, RSI, Bollinger Bands and Moving Averages — to identify low-risk, high-probability entries and exits with no human input required. Designed to perform across forex majors, indices, gold and synthetic indices.",
    features: [
      "Multi-indicator confluence engine (RSI + BB + MA + price action)",
      "Real-time spread and volatility filtering",
      "Automatic entry, SL and TP management",
      "Optimized for prop firm and personal accounts",
      "Works on MT4 and MT5",
      "Free updates included with license",
    ],
    brokers: ALL_BROKERS,
    markets: ALL_MARKETS,
    imageSrc: killer,
  },
  {
    id: "poverty-scalper-v2",
    slug: "poverty-scalper-v2",
    name: "Poverty Scalper EA V2.0+",
    version: "V2.0+",
    priceUSD: 21,
    shortDescription:
      "Automated EA that identifies high-probability opportunities using trend analysis, price action and smart risk management. Also known as Poverty Killer EA.",
    longDescription:
      "Poverty Scalper EA V2.0+ (a.k.a. Poverty Killer EA) is built for high-frequency scalping opportunities. It combines trend analysis with pure price action signals and a smart risk management layer to keep drawdown tight while compounding small wins consistently. Plug it in, set your lot size, and let it work.",
    features: [
      "Smart trend + price action signal engine",
      "Built-in money management & lot scaling",
      "Tight stop-loss logic to protect equity",
      "Works on synthetic indices, forex and gold",
      "MT4 and MT5 compatible",
      "Lifetime updates with your license",
    ],
    brokers: ALL_BROKERS,
    markets: ALL_MARKETS,
    imageSrc: poverty,
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
