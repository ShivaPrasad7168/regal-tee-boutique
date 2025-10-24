import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Smartphone, CreditCard, Banknote, QrCode, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

export const ReferralPaymentPopup = ({ isOpen, onClose, totalAmount }: PaymentPopupProps) => {
  const [selectedMethod, setSelectedMethod] = useState("phonepe");
  const [upiId, setUpiId] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const { toast } = useToast();

  const paymentMethods = [
    { id: "phonepe", name: "PhonePe", icon: Smartphone, color: "text-purple-500" },
    { id: "googlepay", name: "Google Pay", icon: Smartphone, color: "text-blue-500" },
    { id: "paytm", name: "Paytm", icon: Smartphone, color: "text-cyan-500" },
    { id: "upi", name: "Other UPI", icon: QrCode, color: "text-green-500" },
    { id: "cod", name: "Cash on Delivery", icon: Package, color: "text-orange-500" },
  ];

  const handlePayment = () => {
    if (selectedMethod === "cod") {
      const advance = parseFloat(advanceAmount);
      if (!advance || advance < 100) {
        toast({
          title: "Advance payment required",
          description: "Please enter an advance amount of at least ₹100",
          variant: "destructive",
        });
        return;
      }
    }

    if (selectedMethod === "upi" && !upiId) {
      toast({
        title: "UPI ID required",
        description: "Please enter your UPI ID to proceed",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order confirmed! 🎉",
      description: `Your payment via ${paymentMethods.find(m => m.id === selectedMethod)?.name} has been processed.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] border-primary/20 bg-card shadow-[0_0_50px_rgba(255,204,0,0.15)] flex flex-col overflow-hidden">
        <div className="overflow-y-auto scrollbar-hide flex-1 pr-2">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient">Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method to finalize your order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="p-4 bg-secondary/50 rounded-lg border border-border">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold text-gradient">₹{totalAmount}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <Label
                  key={method.id}
                  htmlFor={method.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <method.icon className={`h-6 w-6 ${method.color}`} />
                  <span className="flex-1 font-medium">{method.name}</span>
                  {method.id === "cod" && (
                    <span className="text-xs text-muted-foreground">Advance required</span>
                  )}
                </Label>
              ))}
            </div>
          </RadioGroup>

          {/* UPI ID Input */}
          {selectedMethod === "upi" && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="upi-id">Enter UPI ID</Label>
              <Input
                id="upi-id"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="border-primary/30"
              />
            </div>
          )}

          {/* Cash on Delivery Advance */}
          {selectedMethod === "cod" && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-sm text-foreground/90">
                  <span className="font-semibold">💡 Why advance payment?</span>
                  <br />
                  A small advance helps us confirm your order and ensures your favorite items are reserved just for you!
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="advance">Advance Amount (Minimum ₹100)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">₹</span>
                  <Input
                    id="advance"
                    type="number"
                    placeholder="100"
                    value={advanceAmount}
                    onChange={(e) => setAdvanceAmount(e.target.value)}
                    className="pl-8 border-primary/30"
                    min="100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <CreditCard className="h-5 w-5 text-primary mt-0.5" />
            <p className="text-sm text-foreground/80">
              Your payment is secure and encrypted. We support all major UPI apps and payment methods.
            </p>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handlePayment} 
            variant="luxury" 
            size="lg" 
            className="w-full"
          >
            {selectedMethod === "cod" 
              ? `Pay Advance ₹${advanceAmount || 0}` 
              : `Pay ₹${totalAmount}`}
          </Button>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};