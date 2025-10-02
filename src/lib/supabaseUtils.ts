export { supabase };
import { supabase } from './supabaseClient';
import type { Product } from '@/components/ProductCard';

// AUTHENTICATION
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getUser() {
  return supabase.auth.getUser();
}

// DATABASE
export async function getProducts() {
  return supabase.from('products').select('*');
}

export async function addProduct(product: Product) {
  return supabase.from('products').insert([product]);
}

export async function updateProduct(id: number, updates: Partial<Product>) {
  return supabase.from('products').update(updates).eq('id', id);
}

export async function deleteProduct(id: number) {
  return supabase.from('products').delete().eq('id', id);
}

// STORAGE
export async function uploadFile(bucket: string, path: string, file: File) {
  return supabase.storage.from(bucket).upload(path, file);
}

export async function getPublicUrl(bucket: string, path: string) {
  return supabase.storage.from(bucket).getPublicUrl(path);
}
