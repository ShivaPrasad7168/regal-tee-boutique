import { useState, useEffect } from "react";
import { ShoppingCart, Heart, Star, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export interface Product {
  id: string; // uuid
  name: string;
  description: string;
  slug: string;
  price: number;
  image: string; // local image path
  category?: string;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("onyxia_wishlist") || "[]");
    setIsFavorite(wishlist.includes(product.id));
  }, [product.id]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("onyxia_wishlist") || "[]");
    let newWishlist;
    if (wishlist.includes(product.id)) {
  newWishlist = wishlist.filter((id: string) => id !== product.id);
    } else {
      newWishlist = [...wishlist, product.id];
    }
    localStorage.setItem("onyxia_wishlist", JSON.stringify(newWishlist));
    setIsFavorite(!isFavorite);
  };

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
          <div className="absolute top-4 left-4 flex gap-2">
            {product.isNew && (
              <Badge className="bg-primary text-primary-foreground">
                New
              </Badge>
            )}
            {product.discount && (
              <Badge className="bg-destructive text-destructive-foreground">
                -{product.discount}%
              </Badge>
            )}
          </div>

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
              onClick={toggleWishlist}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="bg-background/90 hover:bg-background"
                >
                  <Ruler className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Size Guide</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Choose your perfect fit based on your measurements:</p>
                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    <div className="font-semibold">Size</div>
                    <div className="font-semibold">Chest</div>
                    <div className="font-semibold">Length</div>
                    <div className="font-semibold">Shoulders</div>
                    <div>S</div><div>36-38"</div><div>27"</div><div>17"</div>
                    <div>M</div><div>38-40"</div><div>28"</div><div>18"</div>
                    <div>L</div><div>40-42"</div><div>29"</div><div>19"</div>
                    <div>XL</div><div>42-44"</div><div>30"</div><div>20"</div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  {product.slug}
              </p>
              <h3 className="font-semibold text-lg mt-1">{product.name}</h3>
              {(product.rating || product.reviewCount) && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating || 0)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount || 0})
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex flex-col">
              {product.discount ? (
                <>
                  <span className="text-sm text-muted-foreground line-through">
                    ${product.price}
                  </span>
                  <span className="text-2xl font-bold text-gradient">
                    ${Math.round(product.price * (1 - product.discount / 100))}
                  </span>
                    <span className="ml-2 text-xs text-primary">-{product.discount}%</span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gradient">
                  ${product.price}
                </span>
              )}
            </div>
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
