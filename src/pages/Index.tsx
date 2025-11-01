import { useCart } from "@/contexts/CartContext";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ProductCollection } from "@/components/ProductCollection";
import { ShoppingCart } from "@/components/ShoppingCart";
import { AboutSection } from "@/components/AboutSection";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { SocialProofPopup } from "@/components/SocialProofPopup";
import AnimatedLogo from "@/components/AnimatedLogo";
import { SignupLoginPopup } from "@/components/SignupLoginPopup";
import { ReferralPaymentPopup } from "@/components/ReferralPaymentPopup";

import { useState } from "react";
import { useWishlist } from "@/contexts/WishlistContext";
import { Product } from "@/components/ProductCard";
import { RecentlyViewed } from "@/components/RecentlyViewed";

const Index = () => {
  const {
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
  } = useCart();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const { toast } = useToast();
  const { wishlistIds } = useWishlist();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }
    setCartOpen(false);
    setPaymentOpen(true);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    if (isLoggedIn) {
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen">
  {/* AnimatedLogo removed: now only shown in App.tsx for intro animation */}
      <Navigation
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onCartClick={() => setCartOpen(true)}
      />
      
      <main>
        <Hero />
        <ProductCollection onAddToCart={handleAddToCart} />
        <RecentlyViewed />
        {wishlistIds.length > 0 && (
          <section className="py-12 px-4">
            <div className="container mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Your Wishlist</h3>
              <p className="text-muted-foreground mb-6">Saved items across sessions. Come back anytime.</p>
              <div className="flex flex-wrap gap-2">
                {wishlistIds.map((id) => (
                  <span key={id} className="text-sm px-3 py-1 rounded-full bg-secondary">
                    #{id}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}
        <AboutSection />
        <Newsletter />
      </main>

      <Footer />

      <ShoppingCart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <SignupLoginPopup
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => setIsLoggedIn(true)}
      />

      <ReferralPaymentPopup
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        totalAmount={totalAmount}
      />

      <SocialProofPopup />
      
    </div>
  );
};

export default Index;
