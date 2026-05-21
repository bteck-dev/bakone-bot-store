import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card-hover group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      {/* Image placeholder slot */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-secondary via-card to-background">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              [Image placeholder]
            </div>
            <div className="text-lg font-bold text-gradient-gold">{product.imagePlaceholder}</div>
          </div>
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
          {product.version}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold">{product.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {product.shortDescription}
        </p>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Price</div>
            <div className="text-3xl font-bold text-gradient-green">${product.priceUSD}</div>
          </div>
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            View
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
