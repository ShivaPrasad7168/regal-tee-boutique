import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Product } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";

interface WishlistContextType {
  wishlistIds: string[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Load wishlist from database
  const loadWishlistFromDatabase = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading wishlist:', error);
        return;
      }

      const ids = (data || []).map((item: any) => item.product_id);
      setWishlistIds(ids);
    } catch (error) {
      console.error('Error loading wishlist from database:', error);
    }
  };

  // Save wishlist item to database
  const saveWishlistItemToDatabase = async (userId: string, productId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: userId,
          product_id: productId,
        });

      if (error) {
        console.error('Error saving wishlist item:', error);
      }
    } catch (error) {
      console.error('Error saving wishlist item to database:', error);
    }
  };

  // Remove wishlist item from database
  const removeWishlistItemFromDatabase = async (userId: string, productId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing wishlist item:', error);
      }
    } catch (error) {
      console.error('Error removing wishlist item from database:', error);
    }
  };

  // Check authentication state
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        await loadWishlistFromDatabase(currentUser.id);
      }

      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (event === 'SIGNED_IN' && currentUser) {
          await loadWishlistFromDatabase(currentUser.id);
        } else if (event === 'SIGNED_OUT') {
          setWishlistIds([]);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const addToWishlist = async (product: Product) => {
    if (!user) return;

    setWishlistIds((prev) => (prev.includes(product.id) ? prev : [...prev, product.id]));

    // Save to database
    await saveWishlistItemToDatabase(user.id, product.id);
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    setWishlistIds((prev) => prev.filter((id) => id !== productId));

    // Remove from database
    await removeWishlistItemFromDatabase(user.id, productId);
  };

  const toggleWishlist = async (product: Product) => {
    if (!user) return;

    const isCurrentlyInWishlist = wishlistIds.includes(product.id);
    if (isCurrentlyInWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const value = useMemo(
    () => ({ wishlistIds, isInWishlist, toggleWishlist, addToWishlist, removeFromWishlist, loading }),
    [wishlistIds, loading]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};


