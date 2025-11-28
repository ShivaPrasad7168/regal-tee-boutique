import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Product } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  cartOpen: boolean;
  setCartOpen: (value: boolean) => void;
  loginOpen: boolean;
  setLoginOpen: (value: boolean) => void;
  user: any;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load cart items from database
  const loadCartFromDatabase = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          quantity,
          products (
            id,
            name,
            description,
            slug,
            price,
            image_url,
            category,
            stock
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error loading cart:', error);
        return;
      }

      const cartItems: CartItem[] = (data || []).map((item: any) => ({
        id: item.products.id,
        name: item.products.name,
        description: item.products.description || '',
        slug: item.products.slug || '',
        price: Number(item.products.price),
        image_url: item.products.image_url || '',
        category: item.products.category || '',
        quantity: item.quantity,
        stock: item.products.stock || 0,
      }));

      setCartItems(cartItems);
    } catch (error) {
      console.error('Error loading cart from database:', error);
    }
  };

  // Save cart item to database
  const saveCartItemToDatabase = async (userId: string, productId: string, quantity: number) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: userId,
          product_id: productId,
          quantity: quantity,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error saving cart item:', error);
      }
    } catch (error) {
      console.error('Error saving cart item to database:', error);
    }
  };

  // Remove cart item from database
  const removeCartItemFromDatabase = async (userId: string, productId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);

      if (error) {
        console.error('Error removing cart item:', error);
      }
    } catch (error) {
      console.error('Error removing cart item from database:', error);
    }
  };

  // Check authentication state on mount and listen for changes
  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);

      if (currentUser) {
        await loadCartFromDatabase(currentUser.id);
      }

      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        setIsLoggedIn(!!currentUser);

        if (event === 'SIGNED_IN' && currentUser) {
          await loadCartFromDatabase(currentUser.id);
        } else if (event === 'SIGNED_OUT') {
          setCartItems([]);
        }

        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const addToCart = (product: Product) => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      removeItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        isLoggedIn,
        setIsLoggedIn,
        cartOpen,
        setCartOpen,
        loginOpen,
        setLoginOpen,
        user,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
