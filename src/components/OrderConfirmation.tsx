import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/components/ProductCard";

interface OrderConfirmationProps {
  cartItems: Product[];
  totalAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  email: string;
  phone: string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  cartItems,
  totalAmount,
  onClose,
  onSuccess,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    email: '',
    phone: '',
  });

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Save order to database
      const { error: orderError } = await supabase.from('orders').insert({
        user_id: user.id,
        payment_gateway: 'manual', // Since you'll handle payment manually on Shiprocket website
        payment_id: `ORDER_${Date.now()}_${user.id.slice(0, 8)}`,
        shipping_address: shippingAddress,
        status: 'pending', // Order is pending manual processing on Shiprocket
        total_amount: totalAmount,
      });

      if (orderError) throw orderError;

      // Clear cart items from database
      const productIds = cartItems.map(item => item.id);
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .in('product_id', productIds);

      toast({
        title: "Order placed successfully!",
        description: "Your order has been saved. Please complete payment and shipping on the Shiprocket website.",
      });

      onSuccess();
    } catch (error) {
      console.error('Order creation failed:', error);
      toast({
        title: "Failed to place order",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={shippingAddress.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={shippingAddress.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={shippingAddress.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="address2">Address 2</Label>
            <Input
              id="address2"
              value={shippingAddress.address2}
              onChange={(e) => handleInputChange('address2', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={shippingAddress.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={shippingAddress.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={shippingAddress.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={shippingAddress.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={shippingAddress.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={shippingAddress.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-semibold flex justify-between">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your order will be saved in our system. You will need to manually create the shipment and process payment on the Shiprocket website using the order details provided.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmation;
