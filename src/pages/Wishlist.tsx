import { useWishlist } from "@/contexts/WishlistContext";
import { ProductCard, Product } from "@/components/ProductCard";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

const Wishlist = () => {
  const { wishlistIds } = useWishlist();
  const { cartItems, setCartOpen, addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlistIds.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .in("id", wishlistIds);

        if (error) {
          console.error("Error fetching wishlist products:", error);
          setLoading(false);
          return;
        }

        const mapped: Product[] = (data || []).map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description ?? "",
          slug: row.slug ?? row.category ?? "",
          price: Number(row.price),
          image_url: row.image_url || "/products/placeholder.jpg",
          category: row.category || "",
          discount: row.discount ?? undefined,
          rating: row.rating ?? undefined,
          reviewCount: row.review_count ?? undefined,
          isNew: row.is_new ?? false,
          stock: row.stock ?? 0,
          specs: {},
        }));

        setWishlistProducts(mapped);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlistIds]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
      />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
        {loading ? (
          <p className="text-muted-foreground">Loading wishlist...</p>
        ) : wishlistProducts.length === 0 ? (
          <p className="text-muted-foreground">No items in your wishlist yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;


