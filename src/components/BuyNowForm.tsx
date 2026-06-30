import { useState } from "react";
import { AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { startCheckout } from "@/lib/paypal";
import type { Product } from "@/lib/products";

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function BuyNowForm({ product }: { product: Product }) {
  const [fullNames, setFullNames] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validateCustomer = () => {
    setError("");

    if (!fullNames.trim()) {
      setError("Please enter your full name.");
      return false;
    }

    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email. We'll use it to match your payment and send your license key.");
      return false;
    }

    return true;
  };

  const goToHostedCheckout = async () => {
    if (!validateCustomer()) return;

    try {
      setSubmitting(true);
      await startCheckout({
        productId: product.id,
        customerName: fullNames.trim(),
        customerEmail: email.trim(),
        customerPhone: phone.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No payment link is configured for this product yet.");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
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
          Use the same email on PayPal so we can match your payment quickly.
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium" htmlFor="buyer-phone">WhatsApp number</label>
        <input
          id="buyer-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+27737526797"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <button
        type="button"
        onClick={goToHostedCheckout}
        disabled={submitting}
        className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Opening secure checkout..." : `Continue - $${product.priceUSD}`}
        <ArrowRight className="h-5 w-5" />
      </button>

      <div className="flex items-start gap-2 rounded-lg border border-primary/25 bg-primary/5 p-3 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-primary" />
        <span>Secure checkout is handled by PayPal. You can choose PayPal or debit/credit card on the next page.</span>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
          <span>{error}</span>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        {submitting ? "Redirecting to secure PayPal checkout..." : "You will choose your payment method on PayPal."}
      </p>
    </div>
  );
}