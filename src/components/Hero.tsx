import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-tshirt.jpg";

export const Hero = () => {
  const scrollToCollection = () => {
    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Premium ONYXIA T-Shirt"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight">
            ONYXIA
          </h1>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold leading-tight">
            Luxury Redefined
          </h1>
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-gradient font-light">
            Premium T-Shirts
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Experience the perfect fusion of comfort and elegance with ONYXIA's
            exclusive collection. Each piece is crafted with meticulous attention
            to detail.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              variant="luxury"
              size="lg"
              onClick={scrollToCollection}
              className="shine-effect"
            >
              Explore Collection
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToCollection}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce"
        aria-label="Scroll to collection"
      >
        <ChevronDown className="h-8 w-8 text-primary" />
      </button>
    </section>
  );
};
