import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import AnimatedLogo from "@/components/AnimatedLogo";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { CompareProvider } from "@/contexts/CompareContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ProductDetail } from "./pages/ProductDetail";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { FAQ } from "./pages/FAQ";
import { Shipping } from "./pages/Shipping";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";

import { useSupabaseUser } from "@/hooks/useSupabaseUser"; // ✅ Added
import { SignupLoginPopup } from "@/components/SignupLoginPopup"; // ✅ Added global popup

const queryClient = new QueryClient();

const App = () => {
  // -------------------------
  // Stable hook declarations
  // (Order must not change between renders)
  // -------------------------
  const [showIntro, setShowIntro] = useState(true);             // 1
  const [authPopupOpen, setAuthPopupOpen] = useState(false);    // 2
  // Call the auth hook AFTER the above useState hooks, always in same position
  const { user, loading } = useSupabaseUser();                  // 3

  // -------------------------
  // Helper: called after a successful sign in
  // -------------------------
  const handleAuthSuccess = () => {
    setAuthPopupOpen(false);
    // You can also trigger a redirect here if needed:
    // window.location.href = "/checkout";
  };

  // -------------------------
  // Important: we can early-return a loading UI,
  // but only after all hooks above are declared.
  // -------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  // -------------------------
  // Main render
  // -------------------------
  return (
    <>
      {/* Global sign-in popup controlled by App */}
      <SignupLoginPopup
        isOpen={authPopupOpen}
        onClose={() => setAuthPopupOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {showIntro ? (
        <AnimatedLogo onComplete={() => setShowIntro(false)} />
      ) : (
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <CartProvider>
                <WishlistProvider>
                  <CompareProvider>
                    <Routes>
                      {/* Pass user or openAuth prop if needed. Example below */}
                      <Route path="/" element={<Index user={user} openAuthPopup={() => setAuthPopupOpen(true)} />} />
                      <Route path="/product/:id" element={<ProductDetail user={user} openAuthPopup={() => setAuthPopupOpen(true)} />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/shipping" element={<Shipping />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/compare" element={<Compare />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </CompareProvider>
                </WishlistProvider>
              </CartProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      )}
    </>
  );
};

export default App;
