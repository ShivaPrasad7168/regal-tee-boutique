import { useCart } from "@/contexts/CartContext";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart as ShoppingCartIcon, Heart, Minus, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { ShoppingCart } from "@/components/ShoppingCart";
import { SignupLoginPopup } from "@/components/SignupLoginPopup";
import { Footer } from "@/components/Footer";
import { Product } from "@/components/ProductCard";
import { useState } from "react";

// Mock product data - in a real app, this would come from a database
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    description: "Elevate your casual wardrobe with this premium cotton t-shirt",
    slug: "essential-tee",
    price: 89,
    image: "/src/assets/product-1.jpg",
    category: "Gentle Trends",
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
  },
  {
    id: "2",
    name: "Classic Polo Shirt",
    description: "Timeless elegance meets modern comfort",
    slug: "classic-polo",
    price: 129,
    image: "/src/assets/product-2.jpg",
    category: "Luxuria",
    rating: 4.9,
    reviewCount: 89,
  },
];

export const ProductDetail = () => {
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
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find((p) => p.id === id);
  
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("green");
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const sizes = ["S", "M", "L", "XL", "2XL"];
  const colors = [
    { name: "green", value: "bg-green-500" },
    { name: "blue", value: "bg-blue-500" },
    { name: "black", value: "bg-black" },
  ];

  const handleAddToCart = () => {
    addToCart(product);
    if (isLoggedIn) {
      toast.success("Added to cart!");
    }
  };

  const handleBuyNow = () => {
    addToCart(product);
    if (isLoggedIn) {
      toast.success("Proceeding to checkout...");
      navigate("/");
      setTimeout(() => setCartOpen(true), 500);
    }
  };

  const bulletPoints = [
    "Fabric: Premium Poly-Cotton blend - soft, breathable & wrinkle resistant",
    "Design: Classic short-sleeve with spread collar for a relaxed style",
    "Fit: Regular fit for all-day comfort",
    "Style: Light green shade with a natural textured finish, ideal for casual wear",
    "Versatility: Perfect layering over a tee or buttoned up for a clean look",
    "Care: Easy machine wash, quick-dry fabric, retains shape after washes",
  ];

  return (
    <>
      <Navigation
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
      />
      
      <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden bg-secondary border-border">
              <div className="aspect-square relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.isNew && (
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    New
                  </Badge>
                )}
              </div>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  RS. {product.price}.00
                </span>
                {product.discount && (
                  <span className="text-xl text-muted-foreground line-through">
                    RS. {Math.round(product.price * 1.5)}.00
                  </span>
                )}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Size:</label>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    className="w-12 h-12"
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Color:</label>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    className={`w-10 h-10 rounded-full ${color.value} border-2 ${
                      selectedColor === color.name
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border"
                    }`}
                    onClick={() => setSelectedColor(color.name)}
                  />
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                className="w-full h-12 text-base"
                variant="outline"
                onClick={handleAddToCart}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                ADD TO CART
              </Button>
              <Button
                className="w-full h-12 text-base bg-black text-white hover:bg-black/90"
                onClick={handleBuyNow}
              >
                BUY NOW
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${
                    isFavorite ? "fill-primary text-primary" : ""
                  }`}
                />
                {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
              </Button>
            </div>

            {/* Bullet Points */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">BULLET POINTS</h3>
              <ul className="space-y-3">
                {bulletPoints.map((point, index) => (
                  <li key={index} className="flex gap-3 text-sm text-foreground/90">
                    <span className="text-primary mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">DESCRIPTION</h3>
              <p className="text-sm text-foreground/90 leading-relaxed">
                Refresh your wardrobe with this <strong>light green poly-cotton casual
                shirt</strong> designed for modern men. Crafted from a soft and durable
                poly-cotton blend, this shirt offers the perfect balance of comfort,
                breathability, and easy maintenance. Its short sleeves and regular fit
                make it ideal for warm weather, while the subtle textured fabric adds a
                touch of sophistication.
              </p>
              <p className="text-sm text-foreground/90 leading-relaxed mt-4">
                Whether layered over a plain tee or styled solo, this shirt transitions
                seamlessly from casual outings to relaxed evenings. Pair it with jeans,
                chinos, or shorts for an effortlessly stylish look. A must-have staple
                that combines everyday ease with smart casual charm.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 pt-12 border-t border-border">
          <h2 className="text-2xl font-bold mb-8">RELATED PRODUCTS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockProducts.slice(0, 4).map((relatedProduct) => (
              <Card
                key={relatedProduct.id}
                className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <div className="aspect-square bg-secondary">
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">
                    {relatedProduct.name}
                  </p>
                  <p className="text-sm text-primary font-bold mt-1">
                    RS. {relatedProduct.price}.00
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      </div>

      <Footer />

      <ShoppingCart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={() => {
          setCartOpen(false);
          navigate("/");
        }}
      />

      <SignupLoginPopup
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => setIsLoggedIn(true)}
      />
    </>
  );
};
