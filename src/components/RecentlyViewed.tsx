import { Card } from "@/components/ui/card";
import { getRecentlyViewed } from "@/lib/recentlyViewed";
import { products } from "@/lib/products";
import { useNavigate } from "react-router-dom";
import { formatINR } from "@/lib/utils";

export const RecentlyViewed = ({ excludeId }: { excludeId?: string }) => {
  const navigate = useNavigate();
  const ids = getRecentlyViewed().filter((id) => id !== excludeId).slice(0, 8);
  if (ids.length === 0) return null;
  const items = ids.map((id) => products.find((p) => p.id === id)).filter(Boolean);

  return (
    <div className="mt-16 pt-12 border-t border-border">
      <h2 className="text-2xl font-bold mb-8">RECENTLY VIEWED</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <Card
            key={(p as any).id}
            className="overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
            onClick={() => navigate(`/product/${(p as any).id}`)}
          >
            <div className="aspect-square bg-secondary">
              <img src={(p as any).image} alt={(p as any).name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium truncate">{(p as any).name}</p>
              <p className="text-sm text-primary font-bold mt-1">{formatINR((p as any).price)}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};


