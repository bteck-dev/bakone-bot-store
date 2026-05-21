import { useState } from "react";
import { Lock } from "lucide-react";
import { PAYFAST_URL, payfastFieldsForProduct } from "@/lib/payfast";
import type { Product } from "@/lib/products";

export function BuyNowForm({ product }: { product: Product }) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.preventDefault();
      alert("Please enter a valid email — we'll send your license key here.");
      return;
    }
    setSubmitting(true);
    // form will POST to PayFast
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const fields = payfastFieldsForProduct(product, email || "buyer@example.com", origin);

  return (
    <form action={PAYFAST_URL} method="POST" onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="buyer-email">
          Your email <span className="text-primary">*</span>
        </label>
        <input
          id="buyer-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          Your license key will be sent to this email instantly after payment.
        </p>
      </div>

      {/* Hidden PayFast fields */}
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="group relative w-full overflow-hidden rounded-full bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:shadow-primary/50 disabled:opacity-60"
      >
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          <Lock className="h-4 w-4" />
          {submitting ? "Redirecting to PayFast…" : `Buy Now — $${product.priceUSD}`}
        </span>
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Secure payment via PayFast · Instant license delivery · 24/7 support
      </p>
    </form>
  );
}
