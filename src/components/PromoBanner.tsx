import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const PromoBanner = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-primary via-yellow-400 to-primary text-primary-foreground py-3 px-4 relative">
      <div className="container mx-auto flex items-center justify-center gap-4 text-center">
        <p className="text-sm md:text-base font-semibold">
          🎉 Limited Time Offer: Get 20% OFF on your first purchase! Use code <span className="font-bold">FIRST20</span>
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 h-6 w-6 hover:bg-black/20"
          onClick={() => setVisible(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
