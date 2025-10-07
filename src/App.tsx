import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import AnimatedLogo from "@/components/AnimatedLogo";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ProductDetail } from "./pages/ProductDetail";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { FAQ } from "./pages/FAQ";
import { Shipping } from "./pages/Shipping";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  return (
    <>
      {showIntro && (
        <AnimatedLogo onComplete={() => setShowIntro(false)} />
      )}
      {!showIntro && (
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <CartProvider>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </CartProvider>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      )}
    </>
  );
};

export default App;
