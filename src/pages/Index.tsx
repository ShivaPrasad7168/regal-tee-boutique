import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ProductCollection } from "@/components/ProductCollection";
import { ShoppingCart, CartItem } from "@/components/ShoppingCart";
import SignupLoginPopup from "@/components/SignupLoginPopup";
import ReferralPaymentPopup from "@/components/ReferralPaymentPopup";
import { AboutSection } from "@/components/AboutSection";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { Product } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { SocialProofPopup } from "@/components/SocialProofPopup";
import { PromoBanner } from "@/components/PromoBanner";

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);

  const handleAddToCart = (product: Product) => {
    if (!signedIn) {
      setShowSignup(true);
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
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleUpdateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  // Intercept checkout if not signed in
  const handleProceedToCheckout = () => {
    if (!signedIn) {
      setShowSignup(true);
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSubmit = (referral: string, payment: string, advance?: number) => {
    setShowPayment(false);
    toast({
      title: "Order Placed",
      description:
        payment === "Cash on Delivery (COD)"
          ? `COD order placed. Advance paid: ₹${advance || 0}. Referral: ${referral || "None"}`
          : `Order placed with ${payment}. Referral: ${referral || "None"}`,
    });
    // Add order logic here
  };

  // Handle signup/login submit
  const handleSignupSubmit = (value: string) => {
    setSignedIn(true);
    setShowSignup(false);
    toast({
      title: "Signed in",
      description: `Welcome, ${value}!`,
    });
  };

  return (
    <div className="min-h-screen">
      <PromoBanner />
      <Navigation
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
      />

      <main>
        <Hero signedIn={signedIn} />
        <ProductCollection onAddToCart={handleAddToCart} />
        <AboutSection />
        <Newsletter />
      </main>

      <Footer />

      <ShoppingCart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />
  {/* Referral & Payment Popup */}
  <ReferralPaymentPopup open={showPayment} onClose={() => setShowPayment(false)} onSubmit={handlePaymentSubmit} />

      {/* Signup/Login Popup (global) */}
      <SignupLoginPopup open={showSignup} onClose={() => setShowSignup(false)} onSubmit={handleSignupSubmit} />

      <SocialProofPopup />
    </div>
  );
};

export default Index;
