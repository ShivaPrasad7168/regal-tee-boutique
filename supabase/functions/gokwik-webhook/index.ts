import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const webhookData = await req.json();
    
    console.log('Gokwik webhook received:', webhookData);

    // Verify webhook signature for security (Razorpay)
    const signature = req.headers.get('X-Razorpay-Signature');
    const RAZORPAY_WEBHOOK_SECRET = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');

    if (RAZORPAY_WEBHOOK_SECRET && signature) {
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(webhookData));
      const keyData = encoder.encode(RAZORPAY_WEBHOOK_SECRET);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, data);
      const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      if (signature !== `sha256=${expectedSignature}`) {
        throw new Error('Invalid webhook signature');
      }
    }

    const { order_id, payment_status, payment_id, razorpay_payment_id } = webhookData;

    if (!order_id) {
      throw new Error('Missing order_id in webhook');
    }

    // Update order status based on webhook
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        payment_status: payment_status,
        payment_id: payment_id,
        status: payment_status === 'success' ? 'confirmed' : 'failed',
      })
      .eq('id', order_id);

    if (updateError) {
      console.error('Error updating order:', updateError);
      throw updateError;
    }

    console.log('Order updated successfully:', order_id);

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
