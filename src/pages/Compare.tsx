import { useCompare } from "@/contexts/CompareContext";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { formatINR } from "@/lib/utils";

const Compare = () => {
  const { compareIds, removeFromCompare, clearCompare } = useCompare();
  const { cartItems, setCartOpen } = useCart();
  const items = compareIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;

  return (
    <div className="min-h-screen bg-background">
      <Navigation cartItemsCount={cartItems.reduce((s, i) => s + i.quantity, 0)} onCartClick={() => setCartOpen(true)} />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Compare Products</h1>
          {items.length > 0 && (
            <Button variant="outline" onClick={clearCompare}>Clear</Button>
          )}
        </div>
        {items.length === 0 ? (
          <p className="text-muted-foreground">No products in compare.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((p) => (
              <Card key={(p as any).id} className="p-4">
                <div className="aspect-square bg-secondary rounded mb-3">
                  <img src={(p as any).image} alt={(p as any).name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold mb-1">{(p as any).name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{formatINR((p as any).price)}</p>
                <div className="text-sm">
                  <div>Rating: {(p as any).rating} ({(p as any).reviewCount})</div>
                  {(p as any).specs && (
                    <div className="mt-2">
                      {Object.entries((p as any).specs).map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4 text-muted-foreground">
                          <span>{k}</span>
                          <span className="text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => removeFromCompare((p as any).id)}>Remove</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Compare;


