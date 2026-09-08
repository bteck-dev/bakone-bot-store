import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Download, Mail, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default SuccessPage;

const botsyncAppUrl = import.meta.env.VITE_BOTSYNC_APP_DOWNLOAD_URL || "";

function SuccessPage() {
  const [search] = useSearchParams();
  const ref = search.get("ref") ?? "";
  const key = search.get("key") ?? "";
  const status = search.get("status") ?? "paid";
  const successful = status === "paid";

  const setupSteps = [
    "Download the BotSync app on your Android phone.",
    "Open the app and add the license key from your email.",
    "Connect the app to your trading server using your broker login details.",
    "Allow all symbols so the app can see the markets on your trading account.",
  ];

  return (
    <div className="mx-auto min-h-screen max-w-6xl bg-background">
      <Navbar />
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl border border-primary/30 bg-card p-8 text-center sm:p-12 glow-green">
          <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${successful ? "bg-primary/15 text-primary" : "bg-destructive/10 text-destructive"}`}>
            {successful ? <CheckCircle2 className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
            Payment <span className={successful ? "text-gradient-green" : "text-destructive"}>{successful ? "Successful" : "Pending"}</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            {successful
              ? "Thank you for choosing Bakone Trades. Your payment has been confirmed."
              : "We returned from iKhokha, but final payment confirmation is still pending. Please contact support if this does not update."}
          </p>

          {ref && (
            <p className="mt-2 text-xs text-muted-foreground">
              Order reference: <code className="rounded bg-secondary px-2 py-0.5">{ref}</code>
              {status && <span className="ml-2">Status: {status}</span>}
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
                Check your email inbox and spam folder. Your unique license key will be sent to the email you used at checkout.
                If you do not see it within 5 minutes, contact us.
              </div>
            )}
          </div>

          <div className="mt-8 text-left">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-display text-xl font-bold">Start using your bot</h2>
              {botsyncAppUrl ? (
                <a
                  href={botsyncAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground"
                >
                  <Download className="h-4 w-4" /> Download BotSync
                </a>
              ) : (
                <span className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-muted-foreground">
                  <Download className="h-4 w-4" /> Download BotSync
                </span>
              )}
            </div>

            <ol className="mt-4 space-y-3 text-sm">
              {setupSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 rounded-lg border border-border bg-secondary/30 p-4 text-sm leading-6 text-muted-foreground">
              BotSync is the app that runs your license on your phone. You do not need to understand advanced trading tools to start.
              First install the app, then paste your license key when our team sends it to you.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <a
              href="mailto:bakonetrades@gmail.com"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm font-semibold hover:border-primary/50"
            >
              <Mail className="h-4 w-4" /> Email us
            </a>
            <a
              href="https://wa.me/27737526797"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm font-semibold hover:border-primary/50"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm font-semibold hover:border-primary/50"
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
