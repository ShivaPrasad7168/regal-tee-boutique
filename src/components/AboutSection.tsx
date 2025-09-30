import { Award, Shield, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const AboutSection = () => {
  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "Crafted from the finest materials for unmatched comfort and durability",
    },
    {
      icon: Sparkles,
      title: "Exclusive Designs",
      description: "Limited edition pieces that set you apart from the crowd",
    },
    {
      icon: Shield,
      title: "Guaranteed Authenticity",
      description: "Every piece comes with a certificate of authenticity",
    },
    {
      icon: TrendingUp,
      title: "Timeless Style",
      description: "Fashion that transcends trends and stands the test of time",
    },
  ];

  return (
    <section id="about" className="py-20 px-4 bg-card/30">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              The ONYXIA Story
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Born from a passion for excellence, ONYXIA represents the pinnacle
              of luxury streetwear. Each piece in our collection is a testament
              to meticulous craftsmanship and timeless design.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that true luxury lies not just in the materials we use,
              but in the story each garment tells. Every ONYXIA piece is designed
              to empower you, to make you feel confident, and to express your
              unique style.
            </p>
            <div className="pt-4">
              <div className="flex items-center gap-8">
                <div>
                  <div className="text-4xl font-bold text-gradient">10K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gradient">500+</div>
                  <div className="text-sm text-muted-foreground">Exclusive Designs</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gradient">15+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <CardContent className="p-6 space-y-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
