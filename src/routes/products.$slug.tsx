import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { BuyNowForm } from "@/components/BuyNowForm";
import { fetchProduct, getProduct, type Product } from "@/lib/products";

export default ProductPage;

function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | undefined>(() => getProduct(slug || ""));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let active = true;

    fetchProduct(slug)
      .then((item) => {
        if (active) setProduct(item);
      })
      .catch(() => {
        if (active) setProduct(getProduct(slug));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (!product && !loading) {
    return (
      <div className="min-h-screen bg-background max-w-6xl mx-auto">
        <Navbar />
        <div className="mx-auto max-w-xl px-4 py-32 text-center">
          <h1 className="font-display text-4xl font-bold">Product not found</h1>
          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Back to shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background max-w-6xl mx-auto">
        <Navbar />
        <div className="mx-auto max-w-xl px-4 py-32 text-center text-muted-foreground">Loading product...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-6xl mx-auto">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>
      </div>

      <section className="pb-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-card">
              <img
                src={product.imageSrc}
                alt={`${product.name} screenshot`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute right-4 top-4 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                {product.version}
              </div>
            </div>
          </div>

          <div>
            <h1 className="font-display text-4xl font-bold sm:text-5xl">{product.name}</h1>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gradient-green">${product.priceUSD}</span>
              <span className="text-sm text-muted-foreground">180 days license key</span>
            </div>

            <p className="mt-6 text-muted-foreground">{product.longDescription}</p>

            <div className="mt-8 rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-bold">Get your license</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Continue to secure checkout. You can choose PayPal or debit/credit card on the next page.
              </p>
              <div className="mt-5">
                <BuyNowForm product={product} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 bg-card/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold">What's included</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {product.features.map((f: string) => (
              <li key={f} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border/50 py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 md:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl font-bold">Supported brokers</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {product.brokers.map((b: string) => (
                <span key={b} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm">{b}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold">Supported markets</h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {product.markets.map((m: string) => (
                <span key={m} className="rounded-md border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

