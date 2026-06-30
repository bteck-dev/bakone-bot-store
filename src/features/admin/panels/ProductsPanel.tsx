import { useMemo, useState } from "react";
import { Edit3, Eye, EyeOff, Plus, Save, Trash2, X } from "lucide-react";
import { adminApi } from "../adminApi";
import { DataBlock, money, paginate, Pagination, StatusBadge } from "../components";
import type { Product, ProductFormInput } from "../types";

const blankForm: ProductFormInput = {
  name: "",
  version: "",
  slug: "",
  description: "",
  features: [],
  price: 0,
  image_url: "",
  payment_link: "",
  is_visible: true,
};

export function ProductsPanel({ products, onChanged }: { products: Product[]; onChanged: () => void }) {
  const [form, setForm] = useState<ProductFormInput>(blankForm);
  const [featuresText, setFeaturesText] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const activeProducts = useMemo(() => products.filter((product) => product.is_visible), [products]);
  const visibleProducts = paginate(products, page, pageSize);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await adminApi.createProduct({
        ...form,
        slug: form.slug || slugify(form.name),
        price: Number(form.price),
        features: featuresText.split("\n").map((item) => item.trim()).filter(Boolean),
      });
      setForm(blankForm);
      setFeaturesText("");
      setMessage("Product created and audit log recorded.");
      onChanged();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not create product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <DataBlock title="Add product">
        <form onSubmit={submit} className="space-y-4 p-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Field label="Name" value={form.name} onChange={(value) => setForm({ ...form, name: value, slug: form.slug || slugify(value) })} required />
            <Field label="Version" value={form.version || ""} onChange={(value) => setForm({ ...form, version: value })} />
            <Field label="Slug" value={form.slug} onChange={(value) => setForm({ ...form, slug: slugify(value) })} required />
            <Field label="Price USD" type="number" value={String(form.price)} onChange={(value) => setForm({ ...form, price: Number(value) })} required />
          </div>
          <label className="block text-sm font-medium">
            Description
            <textarea value={form.description || ""} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={4} className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 outline-none transition focus:border-primary" />
          </label>
          <label className="block text-sm font-medium">
            Features
            <textarea value={featuresText} onChange={(event) => setFeaturesText(event.target.value)} rows={5} placeholder="One feature per line" className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 outline-none transition focus:border-primary" />
          </label>
          <Field label="Image URL" value={form.image_url || ""} onChange={(value) => setForm({ ...form, image_url: value })} />
          <Field label="Payment link" value={form.payment_link || ""} onChange={(value) => setForm({ ...form, payment_link: value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_visible} onChange={(event) => setForm({ ...form, is_visible: event.target.checked })} />
            Visible on store
          </label>
          <button disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
            <Plus className="h-4 w-4" /> {saving ? "Saving..." : "Create product"}
          </button>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </form>
      </DataBlock>

      <DataBlock title="Product catalog" action={<StatusBadge status={`${activeProducts.length} visible`} />}>
        <div className="grid gap-3 p-4 lg:grid-cols-2">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onChanged={onChanged} />
          ))}
          {!products.length && <p className="text-sm text-muted-foreground">No products yet.</p>}
        </div>
        <Pagination page={page} pageSize={pageSize} total={products.length} onPageChange={setPage} />
      </DataBlock>
    </div>
  );
}

function ProductCard({ product, onChanged }: { product: Product; onChanged: () => void }) {
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<ProductFormInput>({
    name: product.name,
    version: product.version || "",
    slug: product.slug,
    description: product.description || "",
    features: product.features || [],
    price: product.price,
    image_url: product.image_url || "",
    payment_link: product.payment_link || "",
    is_visible: product.is_visible,
  });
  const [editFeatures, setEditFeatures] = useState((product.features || []).join("\n"));
  const [error, setError] = useState("");

  const startEditing = () => {
    setEditForm({
      name: product.name,
      version: product.version || "",
      slug: product.slug,
      description: product.description || "",
      features: product.features || [],
      price: product.price,
      image_url: product.image_url || "",
      payment_link: product.payment_link || "",
      is_visible: product.is_visible,
    });
    setEditFeatures((product.features || []).join("\n"));
    setError("");
    setEditing(true);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminApi.updateProduct(product.id, {
        ...editForm,
        slug: editForm.slug || slugify(editForm.name),
        price: Number(editForm.price),
        features: editFeatures.split("\n").map((item) => item.trim()).filter(Boolean),
      });
      setEditing(false);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update product.");
    } finally {
      setBusy(false);
    }
  };

  const toggleVisibility = async () => {
    setBusy(true);
    try {
      await adminApi.updateProduct(product.id, { is_visible: !product.is_visible });
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Remove ${product.name} from the storefront?`)) return;
    setBusy(true);
    try {
      await adminApi.removeProduct(product.id);
      onChanged();
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="rounded-md border border-border bg-background/60 p-4">
      {editing ? (
        <form onSubmit={save} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name" value={editForm.name} onChange={(value) => setEditForm({ ...editForm, name: value })} required />
            <Field label="Version" value={editForm.version || ""} onChange={(value) => setEditForm({ ...editForm, version: value })} />
            <Field label="Slug" value={editForm.slug} onChange={(value) => setEditForm({ ...editForm, slug: slugify(value) })} required />
            <Field label="Price USD" type="number" value={String(editForm.price)} onChange={(value) => setEditForm({ ...editForm, price: Number(value) })} required />
          </div>
          <label className="block text-sm font-medium">
            Description
            <textarea value={editForm.description || ""} onChange={(event) => setEditForm({ ...editForm, description: event.target.value })} rows={3} className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 outline-none transition focus:border-primary" />
          </label>
          <label className="block text-sm font-medium">
            Features
            <textarea value={editFeatures} onChange={(event) => setEditFeatures(event.target.value)} rows={4} className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 outline-none transition focus:border-primary" />
          </label>
          <Field label="Image URL" value={editForm.image_url || ""} onChange={(value) => setEditForm({ ...editForm, image_url: value })} />
          <Field label="Payment link" value={editForm.payment_link || ""} onChange={(value) => setEditForm({ ...editForm, payment_link: value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={editForm.is_visible} onChange={(event) => setEditForm({ ...editForm, is_visible: event.target.checked })} />
            Visible on store
          </label>
          <div className="flex flex-wrap gap-2">
            <button disabled={busy} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-60">
              <Save className="h-4 w-4" /> {busy ? "Saving..." : "Save changes"}
            </button>
            <button type="button" disabled={busy} onClick={() => setEditing(false)} className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold transition hover:border-destructive/50 hover:text-destructive">
              <X className="h-4 w-4" /> Cancel
            </button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate font-semibold">{product.name}</div>
              <div className="mt-1 text-xs text-muted-foreground">{product.slug}</div>
            </div>
            <StatusBadge status={product.is_visible ? "visible" : "hidden"} />
          </div>
          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{product.description || "No description yet."}</p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Price</div>
              <div className="font-display text-2xl font-bold">{money(product.price)}</div>
            </div>
            <div className="flex gap-2">
              <button disabled={busy} onClick={startEditing} className="rounded-md border border-border bg-card p-2 transition hover:border-primary/50 hover:text-primary" title="Edit product">
                <Edit3 className="h-4 w-4" />
              </button>
              <button disabled={busy} onClick={toggleVisibility} className="rounded-md border border-border bg-card p-2 transition hover:border-primary/50 hover:text-primary" title="Toggle visibility">
                {product.is_visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button disabled={busy} onClick={remove} className="rounded-md border border-border bg-card p-2 transition hover:border-destructive/50 hover:text-destructive" title="Remove product">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </article>
  );
}

function Field({ label, value, onChange, type = "text", required }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 outline-none transition focus:border-primary" />
    </label>
  );
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
