import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ReferralPaymentPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (referral: string, payment: string, advance?: number) => void;
}

const paymentOptions = [
  "PhonePe",
  "Google Pay",
  "Paytm",
  "UPI",
  "Cash on Delivery (COD)",
];

const ReferralPaymentPopup: React.FC<ReferralPaymentPopupProps> = ({ open, onClose, onSubmit }) => {
  const [referral, setReferral] = useState("");
  const [payment, setPayment] = useState("");
  const [advance, setAdvance] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payment) {
      setError("Please select a payment option.");
      return;
    }
    if (payment === "Cash on Delivery (COD)" && (!advance || isNaN(Number(advance)) || Number(advance) < 1)) {
      setError("Please pay a small advance for COD.");
      return;
    }
    setError("");
    onSubmit(referral, payment, payment === "Cash on Delivery (COD)" ? Number(advance) : undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Referral Code (optional)"
            value={referral}
            onChange={e => setReferral(e.target.value)}
          />
          <div className="space-y-2">
            <div className="font-semibold">Select Payment Option:</div>
            {paymentOptions.map(opt => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value={opt}
                  checked={payment === opt}
                  onChange={() => setPayment(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
          {payment === "Cash on Delivery (COD)" && (
            <Input
              type="number"
              min={1}
              placeholder="Advance Amount (₹)"
              value={advance}
              onChange={e => setAdvance(e.target.value)}
              required
            />
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" variant="luxury" className="w-full">Pay & Place Order</Button>
            <Button type="button" variant="outline" className="w-full mt-2" onClick={onClose}>Cancel</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralPaymentPopup;
