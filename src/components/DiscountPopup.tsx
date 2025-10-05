import { useState, useEffect } from "react";
import { X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import product1 from "@/assets/product-1.jpg";

export const DiscountPopup = () => {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenPopup = sessionStorage.getItem("discount_popup_seen");
      if (!hasSeenPopup) {
        setVisible(true);
        sessionStorage.setItem("discount_popup_seen", "true");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("GET1FREE");
    setCopied(true);
    toast({
      title: "Code copied!",
      description: "Discount code copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={() => setVisible(false)}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full border border-border pointer-events-auto animate-scale-in">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-muted"
            onClick={() => setVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Content */}
          <div className="p-8 text-center space-y-6">
            {/* Image */}
            <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden border-2 border-primary/20">
              <img 
                src={product1}
                alt="Special Offer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gradient">
                BUY 2 GET 1 FREE
              </h2>
              <p className="text-sm text-muted-foreground">
                Add 3 items to cart & apply code below to get 1 free
              </p>
            </div>

            {/* Coupon Code */}
            <div className="relative">
              <div className="bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 rounded-lg p-4 border-2 border-dashed border-primary/50">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-bold text-primary font-mono tracking-wider">
                    GET1FREE
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              {/* Ticket notches */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border-r-2 border-primary/50" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-background border-l-2 border-primary/50" />
            </div>

            {/* CTA Button */}
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={() => setVisible(false)}
            >
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
