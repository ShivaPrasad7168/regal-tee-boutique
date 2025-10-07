import { useCart } from "@/contexts/CartContext";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart as ShoppingCartIcon, Heart, Minus, Plus, ArrowLeft, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { ShoppingCart } from "@/components/ShoppingCart";
import { SignupLoginPopup } from "@/components/SignupLoginPopup";
import { Footer } from "@/components/Footer";
import { SizeGuide } from "@/components/SizeGuide";
import { ReviewsSection } from "@/components/ReviewsSection";
import { Product } from "@/components/ProductCard";
import { useState } from "react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import { useEffect } from "react";

// Mock product data - in a real app, this would come from a database
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Dragon Emblem Tee",
    description: "Premium tee with dragon emblem.",
    slug: "dragon-emblem-tee",
    price: 129,
    image: product1,
    images: [product1, product2],
    category: "Signature",
    isNew: true,
    rating: 4.8,
    reviewCount: 234,
  },
  {
    id: "2",
    name: "Classic White Premium",
    description: "Classic white premium tee.",
    slug: "classic-white-premium",
    price: 99,
    image: product2,
    images: [product2, product1],
    category: "Essential",
    rating: 4.6,
    reviewCount: 156,
    discount: 20,
  },
  {
    id: "3",
    name: "Charcoal Elite",
    description: "Charcoal elite edition tee.",
    slug: "charcoal-elite",
    price: 119,
    image: product3,
    images: [product3, product4],
    category: "Essential",
    isNew: true,
    rating: 4.9,
    reviewCount: 189,
  },
  {
    id: "4",
    name: "Navy Gold Edition",
    description: "Navy gold edition tee.",
    slug: "navy-gold-edition",
    price: 139,
    image: product4,
    images: [product4, product3],
    category: "Limited",
    rating: 5.0,
    reviewCount: 98,
  },
  {
    id: "5",
    name: "Phoenix Rise Tee",
    description: "Phoenix rise signature tee.",
    slug: "phoenix-rise-tee",
    price: 129,
    image: product1,
    images: [product1, product2],
    category: "Signature",
    rating: 4.7,
    reviewCount: 167,
    discount: 15,
  },
  {
    id: "6",
    name: "Midnight Black Pro",
    description: "Midnight black pro essential tee.",
    slug: "midnight-black-pro",
    price: 109,
    image: product3,
    images: [product3, product1],
    category: "Essential",
    rating: 4.5,
    reviewCount: 143,
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

  // Scroll to top on mount or product change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("green");
  const [isFavorite, setIsFavorite] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  // Use product.images for carousel
  const productImages = product?.images || [product?.image];
  // Keyboard navigation for slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setSliderIndex((sliderIndex - 1 + productImages.length) % productImages.length);
      if (e.key === "ArrowRight") setSliderIndex((sliderIndex + 1) % productImages.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sliderIndex, productImages.length]);

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
          className="mt-8 mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Modern Product Image Carousel */}
          <div className="flex flex-col items-center justify-center">
            <Card className="overflow-hidden bg-secondary border-border w-full">
              <div className="aspect-square relative flex items-center justify-center">
                {/* Prev Button */}
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-2 shadow hover:bg-background"
                  onClick={() => setSliderIndex((sliderIndex - 1 + productImages.length) % productImages.length)}
                  aria-label="Previous image"
                  title="Previous image"
                >
                  <Minus className="h-5 w-5" />
                </button>
                {/* Main Image */}
                <img
                  src={productImages[sliderIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg max-h-96 max-w-96 transition-all duration-300"
                  draggable="false"
                />
                {/* Next Button */}
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-2 shadow hover:bg-background"
                  onClick={() => setSliderIndex((sliderIndex + 1) % productImages.length)}
                  aria-label="Next image"
                  title="Next image"
                >
                  <Plus className="h-5 w-5" />
                </button>
                {product.isNew && (
                  <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                    New
                  </Badge>
                )}
              </div>
              {/* Thumbnails */}
              <div className="flex justify-center gap-2 py-2">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`h-12 w-12 rounded-lg border ${sliderIndex === idx ? 'border-primary' : 'border-border'} overflow-hidden focus:outline-none`}
                    onClick={() => setSliderIndex(idx)}
                    aria-label={`Show image ${idx + 1}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Product Details - left aligned, fills space */}
          <div className="space-y-6 text-left">
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
              <div className="flex items-center gap-4">
                {product.discount ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      RS. {Math.round(product.price * (1 - product.discount / 100))}.00
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      RS. {product.price}.00
                    </span>
                    <Badge className="ml-2 bg-green-600 text-white">{product.discount}% OFF</Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    RS. {product.price}.00
                  </span>
                )}
              </div>
              {/* Rating and reviews */}
              <div className="flex items-center gap-2 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < Math.round(product.rating) ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                ))}
                <span className="text-sm text-muted-foreground ml-2">{product.rating} ({product.reviewCount} reviews)</span>
                {/* Share button */}
                <button
                  className="ml-4 px-2 py-1 rounded bg-muted-foreground/10 text-muted-foreground hover:bg-muted-foreground/20"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Product link copied!");
                  }}
                  title="Share product"
                >
                  Share
                </button>
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Size:</label>
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-sm"
                  onClick={() => setSizeGuideOpen(true)}
                >
                  <Ruler className="h-4 w-4 mr-1" />
                  Size Guide
                </Button>
              </div>
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
                    title={color.name}
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
                {product.description} Crafted from a premium poly-cotton blend (65% polyester, 35% cotton) 
                with a fabric weight of 180 GSM, this garment offers superior comfort and durability. 
                The regular fit design ensures all-day wearability while maintaining a polished appearance. 
                Features include reinforced stitching, pre-shrunk fabric, and colorfast dyes that resist fading. 
                Perfect for both casual and smart-casual occasions.
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection
          productId={product.id}
          averageRating={product.rating}
          reviewCount={product.reviewCount}
        />

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

      <SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
};
