import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const sections = [
  {
    title: "Service Description",
    content:
      "Bakone Trades sells access to forex trading robot products, tools, and related digital license keys. After a successful payment, your license key may be delivered by email or manually by our team. Our products are provided as-is and do not guarantee trading performance, profit, income, or protection from losses.",
  },
  {
    title: "User Responsibilities",
    content:
      "You are responsible for ensuring that forex trading is legal in your country or region and that you understand the risks involved. You are responsible for using the product correctly, protecting your license key, and making your own trading decisions. You should only trade with money you can afford to lose.",
  },
  {
    title: "Refund Policy",
    content:
      "All sales are final. We do not offer refunds for digital products, license keys, setup support, or services once payment has been made. Please make sure you understand the product and this policy before purchasing.",
  },
  {
    title: "Payments and Delivery",
    content:
      "Payments are processed through our supported payment provider. A successful payment does not mean a guaranteed trading outcome. If your license key is not delivered automatically, our team may deliver it manually by email or another agreed communication channel. Please use your correct name, email address, and phone number when purchasing.",
  },
  {
    title: "Limitation of Liability",
    content:
      "Bakone Trades and its affiliates will not be liable for trading losses, account losses, missed profits, indirect damages, incidental damages, or consequential damages arising from the use or inability to use our products or services. You accept full responsibility for your trading activity.",
  },
  {
    title: "Contact",
    content:
      "If you have any questions, please contact us at bakonetrades@gmail.com.",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border/50">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-20">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Legal
            </div>
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
              Terms of <span className="text-gradient-gold">Service</span>
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              Welcome to Bakone Trades. By using our website, purchasing a product, or requesting support, you agree to the following terms and conditions.
            </p>
          </div>
        </section>

        <section className="py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="overflow-hidden rounded-md border border-border bg-card shadow-xl shadow-black/10">
              {sections.map((section) => (
                <article key={section.title} className="border-b border-border p-6 last:border-b-0 sm:p-8">
                  <h2 className="font-display text-2xl font-bold">{section.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                    {section.content}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-md border border-accent/30 bg-accent/10 p-5 text-sm leading-7 text-muted-foreground">
              Trading involves risk. Bakone Trades does not provide financial advice, investment advice, or guaranteed trading results.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
