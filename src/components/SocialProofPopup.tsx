import { useEffect, useState } from "react";
import { ShoppingBag, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Notification {
  id: number;
  type: "purchase" | "trending";
  product: string;
  count?: number;
  time: string;
}

const notifications: Notification[] = [
  { id: 1, type: "purchase", product: "Dragon Emblem Tee", count: 15, time: "2 minutes ago" },
  { id: 2, type: "trending", product: "Phoenix Rise Tee", time: "Just now" },
  { id: 3, type: "purchase", product: "Navy Gold Edition", count: 8, time: "5 minutes ago" },
  { id: 4, type: "trending", product: "Classic White Premium", time: "1 minute ago" },
];

export const SocialProofPopup = () => {
  const [visible, setVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  useEffect(() => {
    let index = 0;
    const showNotification = () => {
      setCurrentNotification(notifications[index]);
      setVisible(true);
      
      setTimeout(() => {
        setVisible(false);
      }, 4000);

      index = (index + 1) % notifications.length;
    };

    showNotification();
    const interval = setInterval(showNotification, 8000);

    return () => clearInterval(interval);
  }, []);

  if (!currentNotification) return null;

  return (
    <Card
      className={`fixed bottom-6 left-6 z-50 max-w-sm p-4 border-border bg-card shadow-xl transition-all duration-500 ${
        visible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {currentNotification.type === "purchase" ? (
            <ShoppingBag className="h-5 w-5 text-primary" />
          ) : (
            <TrendingUp className="h-5 w-5 text-primary" />
          )}
        </div>
        <div className="flex-1">
          {currentNotification.type === "purchase" ? (
            <>
              <p className="font-semibold text-sm">
                {currentNotification.count} people bought
              </p>
              <p className="text-sm text-muted-foreground">
                {currentNotification.product}
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-sm">Trending Now</p>
              <p className="text-sm text-muted-foreground">
                {currentNotification.product}
              </p>
            </>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {currentNotification.time}
          </p>
        </div>
      </div>
    </Card>
  );
};
