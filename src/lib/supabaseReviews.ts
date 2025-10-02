import { supabase } from './supabaseClient';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export async function addReview(product_id: string, user_id: string, rating: number, comment: string) {
  return supabase.from('reviews').insert([{ product_id, user_id, rating, comment }]);
}

export async function getReviews(product_id: string) {
  return supabase.from('reviews').select('*').eq('product_id', product_id);
}
