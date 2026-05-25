import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTop = isHome && !scrolled;
  const headerClasses = [
    "sticky top-0 z-40 transition-all duration-300 ease-out",
    "backdrop-blur-xl",
    "border-b",
    isTop
      ? "bg-transparent border-transparent shadow-none"
      : "bg-background/95 border-border/50 shadow-sm shadow-black/20",
  ].join(" ");

  return (
    <header className={headerClasses}>
      <div className="mx-auto flex h-16 max-w-8xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-3 font-display text-lg font-bold transition hover:opacity-90"
        >
          <img
            src="/logo.jpeg"
            alt="Bakone Trades logo"
            className="h-10 w-10 rounded-2xl border border-border/50 object-cover bg-card"
            loading="lazy"
          />
          <span className="tracking-tight">
            Bakone <span className="text-gradient-gold">Trades</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-foreground" : "text-muted-foreground"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/shop"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:shadow-primary/40 hover:opacity-95"
          >
            Shop Now
          </Link>
        </nav>

        <button
          className="md:hidden rounded-full border border-border/50 bg-card/80 p-2 text-foreground transition hover:bg-card"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/50 bg-background/95 py-3 md:hidden backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:bg-secondary/20 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/shop"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
