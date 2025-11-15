import { supabase } from "@/integrations/supabase/client";

export interface PaymentItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: PaymentItem[];
  shippingAddress: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  orderId?: string;
  message?: string;
  error?: string;
}

export const initiateRazorpayPayment = async (
  paymentData: PaymentRequest
): Promise<PaymentResponse> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error('Please sign in to continue with payment');
    }

    // Get user email from session
    const userEmail = session.user.email || '';

    const { data, error } = await supabase.functions.invoke('gokwik-payment', {
      body: {
        orderId: crypto.randomUUID(),
        ...paymentData,
        customerEmail: userEmail, // Add email from session
      },
    });

    if (error) {
      console.error('Payment error:', error);
      throw error;
    }

    return data as PaymentResponse;
  } catch (error) {
    console.error('Error initiating payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed',
    };
  }
};

// Keep the old function for backward compatibility
export const initiateGokwikPayment = initiateRazorpayPayment;

export const getOrderHistory = async () => {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return orders;
  } catch (error) {
    console.error('Error fetching order history:', error);
    return [];
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('id', orderId)
      .single();

    if (error) throw error;
    
    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};
