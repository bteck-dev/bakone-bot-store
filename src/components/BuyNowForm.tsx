import { useState } from "react";
import { AlertCircle, Lock } from "lucide-react";
import { startCheckout } from "@/lib/paypal";
import type { Product } from "@/lib/products";

export function BuyNowForm({ product }: { product: Product }) {
  const [fullNames, setFullNames] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!fullNames.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email. We'll send your license key here.");
      return;
    }

    setSubmitting(true);
    try {
      await startCheckout({
        productId: product.id,
        customerName: fullNames.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="buyer-fullnames">
          Full Names <span className="text-primary">*</span>
        </label>
        <input
          id="buyer-fullnames"
          type="text"
          required
          value={fullNames}
          onChange={(e) => setFullNames(e.target.value)}
          placeholder="John Doe"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>
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
      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="buyer-phone">
          WhatsApp number
        </label>
        <input
          id="buyer-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+27821234567"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="group relative w-full overflow-hidden rounded-full bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:shadow-primary/50 disabled:opacity-60"
      >
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          <Lock className="h-4 w-4" />
          {submitting ? "Redirecting to PayPal..." : `Buy Now - $${product.priceUSD}`}
        </span>
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Secure payment via PayPal. Manual license delivery after payment confirmation.
      </p>
    </form>
  );
}


