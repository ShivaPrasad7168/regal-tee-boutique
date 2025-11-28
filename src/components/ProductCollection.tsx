import { useEffect, useMemo, useState } from "react";
import { ProductCard, Product } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // 👈 create this file as shown

interface ProductCollectionProps {
  onAddToCart: (product: Product) => void;
}

// Shape of a row in your `products` table
type DbProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  discount: number | null;
  rating: number | null;
  review_count: number | null;
  is_new: boolean | null;
  stock: number | null;
  slug?: string | null;
};

export const ProductCollection = ({ onAddToCart }: ProductCollectionProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<string>("featured");

  const categories = ["signature", "essential", "limited"];
  const maxPrice = 5000;

  // 🟢 Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      // Fetch products with their first image from product_images table
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`
          *,
          product_images(url, position)
        `)
        .order("created_at", { ascending: false });

      console.log("PRODUCTS DATA =>", productsData);
      console.log("PRODUCTS ERROR =>", productsError);

      if (productsError) {
        console.error("Error loading products:", productsError);
        setLoading(false);
        return;
      }

      const mapped: Product[] = (productsData as any[]).map((row) => {
        // Get the first image from product_images, or fallback to products.image_url
        const firstImage = row.product_images?.[0]?.url || row.image_url || "/products/placeholder.jpg";

        return {
          id: row.id,
          name: row.name,
          description: row.description ?? "",
          // if you add a slug column later, use that. for now fallback to category
          slug: row.slug ?? row.category ?? "",
          price: Number(row.price),
          // Use the first image from product_images table for homepage display
          image_url: firstImage,
          category: row.category || "",
          discount: row.discount ?? undefined,
          rating: row.rating ?? undefined,
          reviewCount: row.review_count ?? undefined,
          isNew: row.is_new ?? false,
          stock: row.stock ?? 0,
          specs: {}, // extend later if you store specs in DB
        };
      });

      setProducts(mapped);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setSortBy("featured");
    setQuery("");
  };

  const activeFiltersCount =
    selectedCategories.length +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter((p) =>
        selectedCategories.includes(p.category?.toLowerCase() || "")
      );
    }

    // Filter by search query
    if (query.trim()) {
      result = result.filter((p) =>
        `${p.name} ${p.description} ${p.slug}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    }

    // Filter by price range
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
      // "featured" – keep DB order
    }

    return result;
  }, [products, selectedCategories, query, priceRange, sortBy]);

  return (
    <section id="collection" className="py-20 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Our Collection
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover timeless pieces crafted with precision and passion
          </p>
        </div>

        {/* Modern Search and Filter Bar */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <Input
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 bg-card border-border"
              />
            </div>

            {/* Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 px-6 gap-2 bg-card border-border hover:bg-accent relative"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-primary-foreground">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 bg-card border-border z-50"
                align="end"
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-lg">Filters</h4>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8 text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={
                            selectedCategories.includes(category)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer capitalize px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => toggleCategory(category)}
                        >
                          {category}
                          {selectedCategories.includes(category) && (
                            <X className="ml-1 h-3 w-3" />
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium">Price Range</label>
                    <div className="px-2">
                      <Slider
                        min={0}
                        max={maxPrice}
                        step={100}
                        value={priceRange}
                        onValueChange={(value) =>
                          setPriceRange(value as [number, number])
                        }
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Sort By</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: "featured", label: "Featured" },
                        { value: "price-low", label: "Price: Low" },
                        { value: "price-high", label: "Price: High" },
                        { value: "name", label: "Name" },
                      ].map((option) => (
                        <Badge
                          key={option.value}
                          variant={
                            sortBy === option.value ? "default" : "outline"
                          }
                          className="cursor-pointer justify-center py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => setSortBy(option.value)}
                        >
                          {option.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {selectedCategories.map((category) => (
                <Badge
                  key={category}
                  variant="secondary"
                  className="capitalize gap-1 cursor-pointer"
                  onClick={() => toggleCategory(category)}
                >
                  {category}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                <Badge variant="secondary" className="gap-1">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            Loading products...
          </div>
        ) : (
          <>
            <div className="product-grid mb-12">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}

              {!filteredProducts.length && (
                <p className="text-center text-muted-foreground col-span-full">
                  No products found.
                </p>
              )}
            </div>

            {/* Load More – hook up pagination later if you want */}
            <div className="text-center">
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};
