import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Download, Settings, TrendingUp, Check } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChartBackground } from "@/components/ChartBackground";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, ALL_BROKERS, ALL_MARKETS, fetchProducts, type Product } from "@/lib/products";

export default HomePage;

const STEPS = [
  { icon: ShoppingBag, title: "Buy License Key", desc: "Pick a bot and pay securely with PayFast." },
  { icon: Download, title: "Download Bot", desc: "Get instant access to the EA file by email." },
  { icon: Settings, title: "Install on Broker", desc: "Drop it on your MT4 / MT5 chart in minutes." },
  { icon: TrendingUp, title: "Bot Trades For You", desc: "Sit back while the EA scans and executes." },
];

const TRUST = [
  { label: "Secure Payment", desc: "PayFast SSL-encrypted checkout" },
  { label: "Instant Delivery", desc: "License key emailed immediately" },
  { label: "24/7 Support", desc: "WhatsApp, email or TikTok DM" },
];

function HomePage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);

  useEffect(() => {
    let active = true;

    fetchProducts()
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch(() => {
        if (active) setProducts(PRODUCTS);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background max-w-6xl mx-auto">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <ChartBackground />
        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Automated Forex Trading Bots
            </div>
            <h1 className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl">
              Automate your trades.
              <br />
              <span className="text-gradient-gold">Grow your wealth.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Premium Expert Advisors built for serious traders. Buy a license, plug it into your
              broker, and let the bot do the work — across forex, gold, indices and synthetic
              markets.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:shadow-primary/60"
              >
                Shop Now
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-4 text-base font-semibold backdrop-blur transition hover:border-primary/50"
              >
                Talk to us
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {TRUST.map((t) => (
                <div key={t.label} className="rounded-xl border border-border bg-card/60 px-4 py-3 text-left backdrop-blur">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Check className="h-4 w-4 text-primary" />
                    {t.label}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{t.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-border/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</div>
            <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">From key to profit in 4 steps</h2>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-2xl border border-border bg-card p-6"
              >
                <div className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-accent-foreground">
                  Step {i + 1}
                </div>
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS PREVIEW */}
      <section className="border-t border-border/50 bg-card/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-primary">Our bots</div>
              <h2 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Built to perform</h2>
            </div>
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Browse the shop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* BROKERS */}
      <section className="border-t border-border/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Supported brokers</div>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Works on the brokers you already trust</h2>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {ALL_BROKERS.map((b) => (
              <div key={b} className="rounded-full border border-border bg-card px-5 py-2 text-sm font-medium transition hover:border-primary/50 hover:text-primary">
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETS */}
      <section className="border-t border-border/50 bg-card/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Supported markets</div>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Forex, gold, indices &amp; synthetics</h2>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {ALL_MARKETS.map((m) => (
              <span key={m} className="rounded-md border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-border/50 py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Stop watching charts. <span className="text-gradient-green">Start automating.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Grab a license key and have your bot live on your broker today.
          </p>
          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:shadow-primary/60"
          >
            Shop Now <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
