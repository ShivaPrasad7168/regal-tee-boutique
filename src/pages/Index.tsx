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
import { DiscountPopup } from "@/components/DiscountPopup";
import { useState } from "react";

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

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }
    setCartOpen(false);
    setPaymentOpen(true);
  };

  const handleAddToCart = (product: any) => {
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
        onCartClick={() => setCartOpen(true)}
      />
      
      <main>
        <Hero />
        <ProductCollection onAddToCart={handleAddToCart} />
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
      <DiscountPopup />
    </div>
  );
};

export default Index;
