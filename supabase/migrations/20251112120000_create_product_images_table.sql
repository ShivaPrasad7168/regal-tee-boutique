-- Migration to create product_images table to support multiple images per product

CREATE TABLE public.product_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id),
  CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products (id) ON DELETE CASCADE
);

CREATE INDEX idx_product_images_product_id ON public.product_images (product_id);
