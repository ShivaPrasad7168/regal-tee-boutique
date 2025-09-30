import { useState } from "react";
import { ProductCard, Product } from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

const products: Product[] = [
  {
    id: 1,
    name: "Dragon Emblem Tee",
    price: 129,
    image: product1,
    category: "Signature",
    isNew: true,
  },
  {
    id: 2,
    name: "Classic White Premium",
    price: 99,
    image: product2,
    category: "Essential",
  },
  {
    id: 3,
    name: "Charcoal Elite",
    price: 119,
    image: product3,
    category: "Essential",
    isNew: true,
  },
  {
    id: 4,
    name: "Navy Gold Edition",
    price: 139,
    image: product4,
    category: "Limited",
  },
  {
    id: 5,
    name: "Phoenix Rise Tee",
    price: 129,
    image: product1,
    category: "Signature",
  },
  {
    id: 6,
    name: "Midnight Black Pro",
    price: 109,
    image: product3,
    category: "Essential",
  },
];

interface ProductCollectionProps {
  onAddToCart: (product: Product) => void;
}

export const ProductCollection = ({ onAddToCart }: ProductCollectionProps) => {
  const [filter, setFilter] = useState<string>("all");

  const categories = ["all", "signature", "essential", "limited"];
  
  const filteredProducts =
    filter === "all"
      ? products
      : products.filter(
          (p) => p.category.toLowerCase() === filter.toLowerCase()
        );

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

        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={setFilter} className="mb-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 bg-card">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>
      </div>
    </section>
  );
};
