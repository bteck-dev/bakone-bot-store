import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { CheckCircle2, Download, Mail, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/success")({
  validateSearch: (s: Record<string, unknown>) => ({
    ref: typeof s.ref === "string" ? s.ref : "",
    key: typeof s.key === "string" ? s.key : "",
  }),
  head: () => ({
    meta: [{ title: "Payment Successful — Bakone Trades" }],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { ref, key } = useSearch({ from: "/success" });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl border border-primary/30 bg-card p-8 text-center sm:p-12 glow-green">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/15 text-primary">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            Payment <span className="text-gradient-green">Successful</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Thank you for choosing Bakone Trades. Your license key has been sent to your email.
          </p>
          {ref && (
            <p className="mt-2 text-xs text-muted-foreground">
              Order reference: <code className="rounded bg-secondary px-2 py-0.5">{ref}</code>
            </p>
          )}

          <div className="mt-8 rounded-2xl border border-border bg-background p-6 text-left">
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Your License Key
            </div>
            {key ? (
              <div className="mt-2 break-all rounded-lg border border-primary/40 bg-primary/10 p-4 font-mono text-lg text-primary">
                {key}
              </div>
            ) : (
              <div className="mt-2 rounded-lg border border-dashed border-border bg-secondary/30 p-4 text-sm text-muted-foreground">
                Check your email inbox (and spam folder) — your unique license key
                has just been sent to the email you used at checkout. If you don't
                see it within 5 minutes, contact us.
              </div>
            )}
          </div>

          {/* Install instructions */}
          <div className="mt-8 text-left">
            <h2 className="font-display text-xl font-bold">How to install your bot</h2>
            <ol className="mt-4 space-y-3 text-sm">
              {[
                "Download the EA file from the link in your confirmation email.",
                "Open your MT4 or MT5 platform on your broker (e.g. Exness, Deriv).",
                "Copy the .ex4 / .ex5 file into the MQL4/Experts or MQL5/Experts folder.",
                "Restart your platform and drag the bot onto the chart of your preferred market.",
                "Enter your license key when prompted, set your lot size, and enable AutoTrading.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <a
              href="mailto:bakonetrades@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm font-semibold hover:border-primary/50"
            >
              <Mail className="h-4 w-4" /> Email us
            </a>
            <a
              href="https://wa.me/27603733640"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm font-semibold hover:border-primary/50"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
            >
              <Download className="h-4 w-4" /> More bots
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
