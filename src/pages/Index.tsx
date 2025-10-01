import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ProductCollection } from "@/components/ProductCollection";
import { ShoppingCart, CartItem } from "@/components/ShoppingCart";
import { AboutSection } from "@/components/AboutSection";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import { Product } from "@/components/ProductCard";
import { useToast } from "@/hooks/use-toast";
import { SocialProofPopup } from "@/components/SocialProofPopup";
import { PromoBanner } from "@/components/PromoBanner";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { SignupLoginPopup } from "@/components/SignupLoginPopup";
import { ReferralPaymentPopup } from "@/components/ReferralPaymentPopup";

const Index = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
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

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setLoginOpen(true);
      return;
    }
    setCartOpen(false);
    setPaymentOpen(true);
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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

  return (
    <div className="min-h-screen">
      <AnimatedLogo />
      <PromoBanner />
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
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <SignupLoginPopup
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
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
