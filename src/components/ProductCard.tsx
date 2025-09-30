import { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card
      className="group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
          
          {/* Badges */}
          {product.isNew && (
            <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
              New
            </Badge>
          )}

          {/* Quick Actions */}
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-2 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button
              size="icon"
              variant="outline"
              className="bg-background/90 hover:bg-background"
              onClick={() => onAddToCart(product)}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className={`bg-background/90 hover:bg-background ${
                isFavorite ? "text-primary" : ""
              }`}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                {product.category}
              </p>
              <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-bold text-gradient">
              ${product.price}
            </span>
            <Button
              variant="default"
              size="sm"
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
