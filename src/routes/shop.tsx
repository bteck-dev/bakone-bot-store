import { createFileRoute, useSearch } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>) => ({
    cancelled: s.cancelled === "1" || s.cancelled === 1 ? true : false,
  }),
  head: () => ({
    meta: [
      { title: "Shop — Bakone Trades Forex Bot License Keys" },
      {
        name: "description",
        content: "Buy a license key for FX Killer PV4.0 Pro or Poverty Scalper EA V2.0+.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { cancelled } = useSearch({ from: "/shop" });
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">Shop</div>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            Pick your <span className="text-gradient-gold">Expert Advisor</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Each license is a one-time purchase. Your unique key is emailed immediately
            after PayFast confirms payment.
          </p>
          {cancelled && (
            <div className="mt-6 flex max-w-xl items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
              <div>
                <div className="font-semibold">Payment cancelled</div>
                <div className="text-muted-foreground">No charge was made — feel free to try again whenever you're ready.</div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-2">
          {PRODUCTS.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
