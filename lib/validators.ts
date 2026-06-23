import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email("Valid email required").optional().or(z.literal("")),
  full_name: z.string().min(2, "Full name is required"),
  phone: z.string().min(7, "Valid phone number required"),
  line1: z.string().min(5, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  zip: z.string().min(4, "ZIP code is required"),
  notes: z.string().optional(),
  coupon_code: z.string().optional(),
});

export const contactSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const profileSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  phone: z.string().optional(),
});

export const addressSchema = z.object({
  label: z.string().min(1, "Label is required"),
  full_name: z.string().min(2, "Full name is required"),
  phone: z.string().optional(),
  line1: z.string().min(5, "Address line 1 is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  country: z.string().min(2, "Country is required"),
  zip: z.string().min(4, "ZIP code is required"),
  is_default: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  category_id: z.string().uuid("Valid category required"),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

export const variantSchema = z.object({
  sku: z.string().min(2, "SKU is required"),
  price: z.number().positive("Price must be positive"),
  compare_at_price: z.number().positive().optional(),
  stock_qty: z.number().int().min(0, "Stock cannot be negative"),
  shape: z.string().min(1, "Shape is required"),
  carat_weight: z.number().positive("Carat weight must be positive"),
  length_mm: z.number().positive().optional(),
  width_mm: z.number().positive().optional(),
  depth_mm: z.number().positive().optional(),
  color: z.string().min(1, "Color is required"),
  color_grade: z.string().optional(),
  clarity: z.string().optional(),
  treatment: z.string().optional(),
  origin: z.string().optional(),
  cut_grade: z.string().optional(),
  is_active: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal("")),
  parent_id: z.string().uuid().optional().nullable(),
  sort_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

export const reviewSchema = z.object({
  product_id: z.string().uuid("Valid product required"),
  rating: z.number().int().min(1, "Rating must be 1-5").max(5, "Rating must be 1-5"),
  title: z.string().optional(),
  body: z.string().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(2, "Code is required").transform((v) => v.toUpperCase()),
  discount_type: z.enum(["percentage", "flat"]),
  discount_value: z.number().positive("Discount value must be positive"),
  min_order_value: z.number().min(0).optional(),
  max_uses: z.number().int().positive().optional().nullable(),
  is_active: z.boolean().optional(),
  expires_at: z.string().optional().nullable(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type VariantFormData = z.infer<typeof variantSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type CouponFormData = z.infer<typeof couponSchema>;
