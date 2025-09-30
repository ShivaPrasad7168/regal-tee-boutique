import { Facebook, Instagram, Twitter, Youtube, Lock, CreditCard } from "lucide-react";
import logo from "@/assets/onyxia-logo.png";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  const footerLinks = {
    Shop: ["All Products", "New Arrivals", "Best Sellers", "Limited Edition"],
    Support: ["Contact Us", "FAQs", "Size Guide", "Shipping Info"],
    Company: ["About Us", "Careers", "Privacy Policy", "Terms of Service"],
  };

  return (
    <footer id="contact" className="bg-card/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <img src={logo} alt="ONYXIA Logo" className="h-16 w-auto" />
            <p className="text-muted-foreground max-w-sm">
              Elevating everyday style with premium quality and timeless designs.
              Experience luxury that speaks for itself.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 ONYXIA Luxury Fashion. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 text-primary" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Multiple Payment Options</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
