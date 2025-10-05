export { supabase };
import { supabase } from './supabaseClient';
import type { Product } from '@/components/ProductCard';

// AUTHENTICATION
export async function signUp(email: string, password: string) {
  if (!supabase) throw new Error('Backend not configured');
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Backend not configured');
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  if (!supabase) throw new Error('Backend not configured');
  return supabase.auth.signOut();
}

export async function getUser() {
  if (!supabase) throw new Error('Backend not configured');
  return supabase.auth.getUser();
}

// DATABASE
export async function getProducts() {
  if (!supabase) throw new Error('Backend not configured');
  return supabase.from('products').select('*');
}

export async function addProduct(product: Product) {
  if (!supabase) throw new Error('Backend not configured');
  return supabase.from('products').insert([product]);
}

export async function updateProduct(id: number, updates: Partial<Product>) {
  if (!supabase) throw new Error('Backend not configured');
  return supabase.from('products').update(updates).eq('id', id);
}

export async function deleteProduct(id: number) {
  if (!supabase) throw new Error('Backend not configured');
  return supabase.from('products').delete().eq('id', id);
}

// STORAGE
export async function uploadFile(bucket: string, path: string, file: File) {
  if (!supabase) throw new Error('Backend not configured');
  return supabase.storage.from(bucket).upload(path, file);
}

export async function getPublicUrl(bucket: string, path: string) {
  if (!supabase) throw new Error('Backend not configured');
  return supabase.storage.from(bucket).getPublicUrl(path);
}
