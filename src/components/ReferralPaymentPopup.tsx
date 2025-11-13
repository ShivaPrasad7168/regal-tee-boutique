import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Smartphone, CreditCard, Banknote, QrCode, Package, MapPin, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

export const ReferralPaymentPopup = ({ isOpen, onClose, totalAmount }: PaymentPopupProps) => {
  const [selectedMethod, setSelectedMethod] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const { toast } = useToast();
  
  // Delivery details
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (isOpen) {
      loadUserProfile();
    }
  }, [isOpen]);

  const loadUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      setDeliveryDetails({
        ...deliveryDetails,
        name: profile.name || "",
        phone: profile.phone || "",
      });
    }
  };

  const paymentMethods = [
    { id: "upi", name: "UPI", icon: QrCode, color: "text-green-500" },
    { id: "card", name: "Debit/Credit Cards", icon: CreditCard, color: "text-blue-500" },
    { id: "netbanking", name: "Netbanking", icon: Banknote, color: "text-purple-500" },
    { id: "wallet", name: "Wallets", icon: Wallet, color: "text-cyan-500" },
    { id: "cod", name: "Partial Cash on Delivery", icon: Package, color: "text-orange-500" },
  ];

  const handlePayment = () => {
    // Validate delivery details
    if (!deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.address || 
        !deliveryDetails.city || !deliveryDetails.state || !deliveryDetails.pincode) {
      toast({
        title: "Delivery details required",
        description: "Please fill in all delivery details",
        variant: "destructive",
      });
      return;
    }

    if (selectedMethod === "cod") {
      const advance = parseFloat(advanceAmount);
      if (!advance || advance < 49) {
        toast({
          title: "Advance payment required",
          description: "Please enter an advance amount of at least ₹49",
          variant: "destructive",
        });
        return;
      }
    }

    toast({
      title: "Order confirmed! 🎉",
      description: `Your payment via ${paymentMethods.find(m => m.id === selectedMethod)?.name} has been processed.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] border-border bg-card flex flex-col overflow-hidden p-8">
        <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-1 pr-2">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">DELIVERY DETAILS</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Order Summary */}
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold">Order Summary</p>
                  <p className="text-sm text-muted-foreground">1 Item</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground line-through">₹{Math.round(totalAmount * 1.5)}</p>
                <p className="text-xl font-bold text-green-600">₹{totalAmount}</p>
                <p className="text-xs text-green-600">₹{Math.round(totalAmount * 0.5)} saved so far</p>
              </div>
            </div>
          </div>

          {/* Delivery Details Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5" />
              <h3 className="font-semibold">Deliver To</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={deliveryDetails.name}
                  onChange={(e) => setDeliveryDetails({ ...deliveryDetails, name: e.target.value })}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={deliveryDetails.phone}
                  onChange={(e) => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })}
                  placeholder="10 digit mobile number"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Address *</Label>
              <Textarea
                id="address"
                value={deliveryDetails.address}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, address: e.target.value })}
                placeholder="House No., Building Name, Street, Area"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={deliveryDetails.city}
                  onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={deliveryDetails.state}
                  onChange={(e) => setDeliveryDetails({ ...deliveryDetails, state: e.target.value })}
                  placeholder="State"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={deliveryDetails.pincode}
                onChange={(e) => setDeliveryDetails({ ...deliveryDetails, pincode: e.target.value })}
                placeholder="6 digit pincode"
                maxLength={6}
              />
            </div>

            <div className="text-xs text-muted-foreground">
              <p>Standard: ₹99</p>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="space-y-2">
            <h3 className="font-semibold">OFFERS & REWARDS</h3>
            <Input placeholder="Enter coupon code" />
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h3 className="font-semibold">Payment Options</h3>
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded text-sm text-green-700 dark:text-green-400">
              Get 20% off on Prepaid Orders
            </div>
            
            <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <Label
                    key={method.id}
                    htmlFor={method.id}
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={method.id} id={method.id} />
                      <method.icon className={`h-5 w-5 ${method.color}`} />
                      <span className="font-medium">{method.name}</span>
                    </div>
                    <div className="text-right">
                      {method.id === "cod" ? (
                        <span className="text-sm text-muted-foreground">₹49</span>
                      ) : (
                        <>
                          <span className="text-sm text-green-600 font-semibold">Get 10% discount</span>
                          <p className="text-xs text-muted-foreground">₹{Math.round(totalAmount * 0.9)}</p>
                        </>
                      )}
                    </div>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Cash on Delivery Advance */}
          {selectedMethod === "cod" && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
                <p className="text-sm">
                  <span className="font-semibold">Pay ₹49.00 now, Rest on delivery</span>
                  <br />
                  <span className="text-xs text-muted-foreground">Amount Non-Refundable</span>
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 border-t">
            <Button 
              onClick={handlePayment} 
              size="lg" 
              className="w-full bg-black text-white hover:bg-black/90"
            >
              {selectedMethod === "cod" 
                ? `Pay ₹49` 
                : `Pay ₹${Math.round(totalAmount * 0.9)}`}
            </Button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <img src="https://www.gokwik.co/assets/images/logo.png" alt="GoKwik" className="h-6" />
              <span>Powered by GoKwik</span>
            </div>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};