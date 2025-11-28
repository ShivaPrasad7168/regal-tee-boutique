import { supabase } from "@/integrations/supabase/client";

export interface ShiprocketCredentials {
  email: string;
  password: string;
}

export interface ShiprocketAuthResponse {
  token: string;
  expires_in: number;
}

export interface ShiprocketOrder {
  order_id: string;
  order_date: string;
  pickup_location: string;
  channel_id: string;
  comment: string;
  reseller_name?: string;
  company_name?: string;
  billing_customer_name: string;
  billing_last_name: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  shipping_is_billing: boolean;
  shipping_customer_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_address_2?: string;
  shipping_city: string;
  shipping_pincode: string;
  shipping_country: string;
  shipping_state: string;
  shipping_email: string;
  shipping_phone: string;
  order_items: ShiprocketOrderItem[];
  payment_method: string;
  shipping_charges: number;
  giftwrap_charges?: number;
  transaction_charges?: number;
  total_discount?: number;
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number;
}

export interface ShiprocketOrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  discount?: number;
  tax?: number;
  hsn?: number;
}

export interface ShiprocketOrderResponse {
  order_id: number;
  channel_order_id: string;
  shipment_id?: number;
  status: string;
  status_code: number;
  onboarding_completed_now: boolean;
  awb_code?: string;
  courier_company_id?: number;
  courier_name?: string;
}

class ShiprocketService {
  private baseUrl = 'https://apiv2.shiprocket.in/v1/external';
  private token: string | null = null;
  private tokenExpiry: number | null = null;

  // Authenticate with Shiprocket
  async authenticate(credentials: ShiprocketCredentials): Promise<ShiprocketAuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`Shiprocket auth failed: ${response.statusText}`);
      }

      const data: ShiprocketAuthResponse = await response.json();
      this.token = data.token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);

      return data;
    } catch (error) {
      console.error('Shiprocket authentication error:', error);
      throw error;
    }
  }

  // Check if token is valid
  private isTokenValid(): boolean {
    return this.token && this.tokenExpiry && Date.now() < this.tokenExpiry;
  }

  // Get valid token
  private async getToken(): Promise<string> {
    if (!this.isTokenValid()) {
      // Try to get credentials from environment or database
      const credentials = await this.getCredentials();
      await this.authenticate(credentials);
    }
    return this.token!;
  }

  // Get credentials from Supabase (you should store these securely)
  private async getCredentials(): Promise<ShiprocketCredentials> {
    // In production, store these in environment variables or secure storage
    // For now, using placeholder - you need to set these up
    const email = process.env.REACT_APP_SHIPROCKET_EMAIL || 'your-email@example.com';
    const password = process.env.REACT_APP_SHIPROCKET_PASSWORD || 'your-password';

    return { email, password };
  }

  // Create order in Shiprocket
  async createOrder(orderData: ShiprocketOrder): Promise<ShiprocketOrderResponse> {
    try {
      const token = await this.getToken();

      const response = await fetch(`${this.baseUrl}/orders/create/adhoc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Shiprocket order creation failed: ${errorData.message || response.statusText}`);
      }

      const data: ShiprocketOrderResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Shiprocket order creation error:', error);
      throw error;
    }
  }

  // Get order details
  async getOrder(orderId: number): Promise<any> {
    try {
      const token = await this.getToken();

      const response = await fetch(`${this.baseUrl}/orders/show/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get order: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  }

  // Get available pickup locations
  async getPickupLocations(): Promise<any[]> {
    try {
      const token = await this.getToken();

      const response = await fetch(`${this.baseUrl}/settings/company/pickup`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get pickup locations: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Get pickup locations error:', error);
      throw error;
    }
  }

  // Get available couriers
  async getCouriers(): Promise<any[]> {
    try {
      const token = await this.getToken();

      const response = await fetch(`${this.baseUrl}/courier/serviceability`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get couriers: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Get couriers error:', error);
      throw error;
    }
  }

  // Generate AWB (Air Way Bill)
  async generateAWB(shipmentId: number, courierId: number): Promise<any> {
    try {
      const token = await this.getToken();

      const response = await fetch(`${this.baseUrl}/courier/assign/awb`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipment_id: shipmentId,
          courier_id: courierId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate AWB: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Generate AWB error:', error);
      throw error;
    }
  }

  // Request pickup
  async requestPickup(shipmentId: number): Promise<any> {
    try {
      const token = await this.getToken();

      const response = await fetch(`${this.baseUrl}/courier/generate/pickup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          shipment_id: shipmentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to request pickup: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Request pickup error:', error);
      throw error;
    }
  }
}

export const shiprocketService = new ShiprocketService();
