import { useCart } from "@/contexts/CartContext";
import { useParams, useNavigate } from "react-router-dom";
import {
  ShoppingCart as ShoppingCartIcon,
  Heart,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Ruler,
  ShieldCheck,
  Truck,
  CreditCard,
  Minus,
  Plus,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Navigation } from "@/components/Navigation";
import { ShoppingCart } from "@/components/ShoppingCart";
import { SignupLoginPopup } from "@/components/SignupLoginPopup";
import { ReferralPaymentPopup } from "@/components/ReferralPaymentPopup";
import { Footer } from "@/components/Footer";
import { SizeGuide } from "@/components/SizeGuide";
import { ReviewsSection } from "@/components/ReviewsSection";
import type { Product } from "@/components/ProductCard";
import { useState, useEffect } from "react";
import { useWishlist } from "@/contexts/WishlistContext";
import { addRecentlyViewed } from "@/lib/recentlyViewed";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { supabase } from "@/integrations/supabase/client";

import { formatINR } from "@/lib/utils";

interface ProductDetailProps {
  user?: unknown;
  openAuthPopup?: () => void;
}

export const ProductDetail = ({ user, openAuthPopup }: ProductDetailProps) => {
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

  const productId = id;
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>();
  const [selectedSlide, setSelectedSlide] = useState(0);

  const isFavorite = product ? isInWishlist(product.id) : false;

  // Scroll to top on mount or product change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch product + related products and product images from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);

      // 1️⃣ Fetch main product
      const { data: productData, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId) // use corrected id type
        .single();

      if (error || !productData) {
        console.error("Error fetching product:", error);
        setProduct(null);
        setRelatedProducts([]);
        setProductImages([]);
        setLoading(false);
        return;
      }

      setProduct(productData as unknown as Product);

      // 2️⃣ Fetch related products by category
      if (productData.category) {
        const { data: related, error: relError } = await supabase
          .from("products")
          .select("*")
          .eq("category", productData.category)
          .neq("id", productData.id)
          .limit(4);

        if (relError) {
          console.error("Error fetching related products:", relError);
          setRelatedProducts([]);
        } else {
          setRelatedProducts((related ?? []) as unknown as Product[]);
        }
      } else {
        setRelatedProducts([]);
      }

      console.log("Fetching images for productId:", productId);
      // 3️⃣ Fetch product images from product_images table
      const { data: imageData, error: imageError } = await supabase
        .from("product_images")
        .select("url")
        .eq("product_id", productId)
        .order("position", { ascending: true });

      console.log("Image data fetched:", imageData);

      if (imageError) {
        console.error("Error fetching product images:", imageError);
        // Fallback to product.image_url if no images in product_images table
        setProductImages(productData.image_url ? [productData.image_url] : []);
      } else if (imageData && imageData.length > 0) {
        setProductImages(imageData.map((img) => img.url));
      } else {
        // Fallback to product.image_url if no images in product_images table
        setProductImages(productData.image_url ? [productData.image_url] : []);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Track recently viewed
  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
  }, [product]);

  // Sync carousel with selected slide
  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setSelectedSlide(carouselApi.selectedScrollSnap());
    onSelect();
    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") carouselApi?.scrollPrev();
      if (e.key === "ArrowRight") carouselApi?.scrollNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [carouselApi]);

  // Loading state
  if (loading) {
    return (
      <>
        <Navigation
          cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setCartOpen(true)}
          onLoginClick={() => setLoginOpen(true)}
        />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </>
    );
  }

  // Not found state
  if (!product) {
    return (
      <>
        <Navigation
          cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setCartOpen(true)}
          onLoginClick={() => setLoginOpen(true)}
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Product not found</h2>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </div>
      </>
    );
  }

  const sizes = ["S", "M", "L", "XL", "2XL"];
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const buyNowTotal = product.price * quantity;

  const bulletPoints = [
    "Fabric: Premium Poly-Cotton blend - soft, breathable & wrinkle resistant",
    "Design: Classic short-sleeve with spread collar for a relaxed style",
    "Fit: Regular fit for all-day comfort",
    "Style: Light green shade with a natural textured finish, ideal for casual wear",
    "Versatility: Perfect layering over a tee or buttoned up for a clean look",
    "Care: Easy machine wash, quick-dry fabric, retains shape after washes",
  ];

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
    if (isLoggedIn) {
      toast.success("Added to cart!");
    }
  };

  const handleBuyNow = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        toast.error("Please sign in to continue your purchase");
        if (openAuthPopup) {
          openAuthPopup();
        } else {
          setLoginOpen(true);
        }
        return;
      }

      setIsLoggedIn(true);
      setPaymentOpen(true);
    } catch (err) {
      console.error("Error in handleBuyNow:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleCheckout = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        toast.error("Please sign in to continue checkout");
        if (openAuthPopup) {
          openAuthPopup();
        } else {
          setLoginOpen(true);
        }
        return;
      }

      setIsLoggedIn(true);
      setCartOpen(false);
      setPaymentOpen(true);
    } catch (err) {
      console.error("Error in handleCheckout:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    toast.success("Removed from cart");
  };

  return (
    <>
      <Navigation
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setCartOpen(true)}
        onLoginClick={() => setLoginOpen(true)}
      />

      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mt-4 mb-6"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Product Image Carousel */}
            <div className="flex flex-col items-center justify-center">
              <Card className="overflow-hidden bg-secondary border-border/40 w-full">
                <div className="aspect-square relative flex items-center justify-center select-none">
                  {/* Prev Button */}
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-2 shadow hover:bg-background z-20"
                    onClick={() => carouselApi?.scrollPrev()}
                    aria-label="Previous image"
                    title="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* Main Image with Lightbox */}
                  <Dialog>
                    <Carousel
                      opts={{ loop: true }}
                      setApi={setCarouselApi}
                      className="w-full h-full"
                    >
                      <CarouselContent>
                        {productImages.map((img, idx) => (
                          <CarouselItem key={idx}>
                            <img
                              src={img}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg max-h-[32rem] md:max-h-[36rem] cursor-zoom-in"
                              draggable="false"
                              onClick={(e) => {
                                (
                                  e.currentTarget.nextElementSibling as HTMLElement | null
                                )?.dispatchEvent(
                                  new MouseEvent("click", { bubbles: true })
                                );
                              }}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                    <button
                      className="hidden"
                      aria-hidden="true"
                      aria-label="Open image lightbox"
                      title="Open image lightbox"
                      type="button"
                    />
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>{product.name}</DialogTitle>
                      </DialogHeader>
                      <div className="flex flex-col gap-4">
                        {productImages[selectedSlide] && (
                          <img
                            src={productImages[selectedSlide]}
                            alt={product.name}
                            className="w-full h-auto object-contain"
                          />
                        )}
                        <div className="flex gap-2 overflow-x-auto">
                          {productImages.map((img, idx) => (
                            <button
                              key={idx}
                              className={`h-16 w-16 rounded border ${
                                selectedSlide === idx ? "border-primary" : "border-border"
                              }`}
                              onClick={() => carouselApi?.scrollTo(idx)}
                            >
                              <img
                                src={img}
                                alt={`Image ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Next Button */}
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-2 shadow hover:bg-background z-20"
                    onClick={() => carouselApi?.scrollNext()}
                    aria-label="Next image"
                    title="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {product.isNew && (
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                      New
                    </Badge>
                  )}

                  {/* Indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                    {productImages.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        aria-label={`Slide ${idx + 1}`}
                        aria-current={selectedSlide === idx}
                        onClick={() => carouselApi?.scrollTo(idx)}
                        className={`h-2.5 w-2.5 rounded-full transition-all ${
                          selectedSlide === idx
                            ? "bg-white/90 w-6"
                            : "bg-white/50 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="flex justify-center gap-2 py-2">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      className={`h-12 w-12 rounded-lg border ${
                        selectedSlide === idx ? "border-primary" : "border-border"
                      } overflow-hidden focus:outline-none`}
                      onClick={() => carouselApi?.scrollTo(idx)}
                      aria-label={`Show image ${idx + 1}`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Product Details */}
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
                        {formatINR(
                          Math.round(product.price * (1 - product.discount / 100))
                        )}
                      </span>
                      <span className="text-xl text-muted-foreground line-through">
                        {formatINR(product.price)}
                      </span>
                      <Badge className="ml-2 bg-green-600 text-white">
                        {product.discount}% OFF
                      </Badge>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-primary">
                      {formatINR(product.price)}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  {typeof product.stock === "number" && (
                    product.stock > 0 ? (
                      <Badge
                        className={
                          product.stock <= 3
                            ? "bg-amber-600 text-white"
                            : "bg-emerald-600 text-white"
                        }
                      >
                        {product.stock <= 3
                          ? `Only ${product.stock} left`
                          : `In Stock (${product.stock})`}
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-500 text-white">Out of Stock</Badge>
                    )
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4" /> Secure checkout
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="h-4 w-4" /> Fast shipping
                    </span>
                    <span className="flex items-center gap-1">
                      <CreditCard className="h-4 w-4" /> Easy returns
                    </span>
                  </div>
                </div>

                {/* Rating + share */}
                <div className="flex items-center gap-2 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.round(product.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                  <button
                    className="ml-4 px-2 py-1 rounded bg-muted-foreground/10 text-muted-foreground hover:bg-muted-foreground/20"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href).catch(() => {
                        toast.error("Failed to copy product link to clipboard");
                      });
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
                  onClick={() => toggleWishlist(product)}
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
                    <li
                      key={index}
                      className="flex gap-3 text-sm text-foreground/90"
                    >
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
                  {product.description} Crafted from a premium poly-cotton blend
                  (65% polyester, 35% cotton) with a fabric weight of 180 GSM, this
                  garment offers superior comfort and durability. The regular fit
                  design ensures all-day wearability while maintaining a polished
                  appearance. Features include reinforced stitching, pre-shrunk
                  fabric, and colorfast dyes that resist fading. Perfect for both
                  casual and smart-casual occasions.
                </p>
              </div>
            </div>
          </div>

          {/* Recently Viewed */}
          <RecentlyViewed excludeId={product.id} />

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
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                >
                  <div className="aspect-square bg-secondary">
                    <img
                      src={relatedProduct.image_url}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">
                      {relatedProduct.name}
                    </p>
                    <p className="text-sm text-primary font-bold mt-1">
                      {formatINR(relatedProduct.price)}
                    </p>
                  </div>
                </Card>
              ))}
              {relatedProducts.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full">
                  No related products to show.
                </p>
              )}
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
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <SignupLoginPopup
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => setIsLoggedIn(true)}
      />

      <ReferralPaymentPopup
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        totalAmount={
          paymentOpen && cartItems.length === 0 ? buyNowTotal : totalAmount
        }
      />

      <SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
};
