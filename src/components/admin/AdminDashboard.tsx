import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatINR } from "@/lib/utils";

type DbProduct = {
  id: string;
  name: string;
  description: string | null;
  slug: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  discount: number | null;
  rating: number | null;
  review_count: number | null;
  is_new: boolean | null;
  stock: number | null;
  specs: any | null;
};

const emptyForm = {
  id: "",
  name: "",
  description: "",
  slug: "",
  price: "",
  image_url: "",
  category: "Signature",
  stock: "",
  discount: "",
};

export const AdminDashboard = () => {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setProducts(data as DbProduct[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const startEdit = (p: DbProduct) => {
    setEditingId(p.id);
    setForm({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      slug: p.slug ?? "",
      price: String(p.price),
      image_url: p.image_url ?? "",
      category: p.category ?? "Signature",
      stock: String(p.stock ?? 0),
      discount: p.discount != null ? String(p.discount) : "",
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      slug: form.slug,
      price: Number(form.price),
      image_url: form.image_url,
      category: form.category,
      stock: Number(form.stock),
      discount: form.discount ? Number(form.discount) : null,
      is_new: false,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingId));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }

    if (error) {
      console.error("Save error", error);
      alert("Error saving product: " + error.message);
    } else {
      setOpen(false);
      await loadProducts();
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      console.error(error);
      alert("Error deleting product: " + error.message);
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin – Products</h1>
            <p className="text-muted-foreground">
              Manage your Onyxia collection: add, edit, and delete products.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={startAdd}>+ Add Product</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Product" : "Add Product"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSave} className="space-y-4">
                <Input
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <Textarea
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="slug"
                  placeholder="Slug (e.g. dragon-emblem-tee)"
                  value={form.slug}
                  onChange={handleChange}
                />
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="image_url"
                  placeholder="Image URL (e.g. /products/product-1.jpg)"
                  value={form.image_url}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="category"
                  placeholder="Category (Signature / Essential / Limited)"
                  value={form.category}
                  onChange={handleChange}
                />
                <Input
                  name="stock"
                  type="number"
                  placeholder="Stock quantity"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="discount"
                  type="number"
                  placeholder="Discount % (optional)"
                  value={form.discount}
                  onChange={handleChange}
                />

                <Button type="submit" disabled={saving} className="w-full">
                  {saving
                    ? editingId
                      ? "Saving..."
                      : "Adding..."
                    : editingId
                    ? "Save Changes"
                    : "Add Product"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex justify-between">
            <span className="font-medium">All Products</span>
            <span className="text-sm text-muted-foreground">
              {products.length} items
            </span>
          </div>

          {loading ? (
            <div className="py-10 text-center text-muted-foreground">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              No products yet. Click &quot;Add Product&quot; to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="text-left">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Price</th>
                    <th className="px-4 py-2">Stock</th>
                    <th className="px-4 py-2">Discount</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="px-4 py-2">{p.name}</td>
                      <td className="px-4 py-2">{p.category}</td>
                      <td className="px-4 py-2">
                        {formatINR(Number(p.price))}
                      </td>
                      <td className="px-4 py-2">{p.stock ?? 0}</td>
                      <td className="px-4 py-2">
                        {p.discount ? `${p.discount}%` : "-"}
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(p)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
