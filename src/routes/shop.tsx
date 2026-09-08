import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, fetchProducts, type Product } from "@/lib/products";

export default ShopPage;

function ShopPage() {
  const [search] = useSearchParams();
  const cancelled = search.get("cancelled") === "1" || search.get("cancelled") === "true";
  const failed = search.get("failed") === "1" || search.get("status") === "failed";
  const status = search.get("status");
  const ref = search.get("ref");
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchProducts()
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch(() => {
        if (active) setProducts(PRODUCTS);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background max-w-6xl mx-auto">
      <Navbar />
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">Shop</div>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            Pick your <span className="text-gradient-gold">Expert Advisor</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Each license is a one-time purchase. Your unique key is prepared after iKhokha confirms payment.
          </p>
          {(cancelled || failed) && (
            <div className="mt-6 flex max-w-xl items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm">
              <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
              <div>
                <div className="font-semibold">{failed ? "Payment unsuccessful" : "Payment cancelled"}</div>
                <div className="text-muted-foreground">
                  {failed ? "iKhokha could not complete the payment." : "No charge was made."} {ref ? `Order ${ref} is ${status || (failed ? "failed" : "cancelled")}.` : "Feel free to try again whenever you're ready."}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {loading && <p className="mt-4 text-sm text-muted-foreground">Loading products...</p>}
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

