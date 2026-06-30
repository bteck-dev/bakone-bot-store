import { Link } from "react-router-dom";
import { Mail, Phone, Music2 } from "lucide-react";
export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-display text-lg font-bold">
              <img
                src="/logo.jpeg"
                alt="Bakone Trades logo"
                className="h-8 w-8 rounded-md border border-border object-cover bg-card"
              />
              Bakone <span className="text-gradient-gold">Trades</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Automate your trades. Grow your wealth.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Navigate
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-primary">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/termsofservice" className="hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Contact
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:bakonetrades@gmail.com" className="hover:text-primary">
                  bakonetrades@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+27737526797" className="hover:text-primary">
                  +27 73 752 6797
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Music2 className="h-4 w-4 text-primary" />
                <a
                  href="https://www.tiktok.com/@btech_1?_r=1&_t=ZS-97HQfW79s7Z"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary"
                >
                  @bakonetrades
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border/60 pt-6">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground/80">Risk disclaimer:</strong> Trading involves risk.
            Past performance is not indicative of future results. Only trade with capital you can
            afford to lose.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bakone Trades. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
