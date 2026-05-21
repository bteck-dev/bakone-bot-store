import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Music2, Send, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Bakone Trades" },
      { name: "description", content: "Get in touch with Bakone Trades for support, demos, or questions about our trading bots." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSending(true);
    const { error: insertError } = await supabase
      .from("contact_messages")
      .insert({ name: name.trim(), email: email.trim(), message: message.trim() });
    setSending(false);
    if (insertError) {
      setError("Could not send your message. Please try again or email us directly.");
      return;
    }
    setSent(true);
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">Contact</div>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            Let's <span className="text-gradient-gold">talk</span>
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Questions about the bots, install help, or partnerships — we typically reply within a few hours.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-5">
          {/* Direct contact */}
          <div className="md:col-span-2">
            <h2 className="font-display text-2xl font-bold">Reach us directly</h2>
            <div className="mt-6 space-y-3">
              <a href="mailto:bakonetrades@gmail.com" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/50">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Email</div>
                  <div className="font-medium">bakonetrades@gmail.com</div>
                </div>
              </a>
              <a href="https://wa.me/27603733640" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/50">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp / Call</div>
                  <div className="font-medium">+27 60 373 3640</div>
                </div>
              </a>
              <a href="https://tiktok.com/@bakonetrades" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition hover:border-primary/50">
                <Music2 className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">TikTok</div>
                  <div className="font-medium">@bakonetrades</div>
                </div>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              <h2 className="font-display text-2xl font-bold">Send a message</h2>
              {sent ? (
                <div className="mt-6 flex items-start gap-3 rounded-lg border border-primary/40 bg-primary/10 p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                  <div className="text-sm">
                    <div className="font-semibold">Message sent</div>
                    <div className="text-muted-foreground">We'll get back to you shortly. Thank you.</div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium" htmlFor="name">Name</label>
                    <input
                      id="name" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium" htmlFor="email">Email</label>
                    <input
                      id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium" htmlFor="message">Message</label>
                    <textarea
                      id="message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                      className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                      maxLength={2000}
                    />
                  </div>
                  {error && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {sending ? "Sending…" : "Send message"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
