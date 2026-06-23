// ─── Categories ──────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
}

// ─── Products ────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category_id: string;
  is_active: boolean;
  is_featured: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  category?: Category;
  variants?: GemVariant[];
}

export interface GemVariant {
  id: string;
  product_id: string;
  sku: string;
  price: number;
  compare_at_price?: number;
  stock_qty: number;
  shape: string;
  carat_weight: number;
  length_mm?: number;
  width_mm?: number;
  depth_mm?: number;
  color: string;
  color_grade?: string;
  clarity?: string;
  treatment?: string;
  origin?: string;
  cut_grade?: string;
  is_active: boolean;
  created_at: string;
  images?: GemImage[];
  product?: Product;
}

export interface GemImage {
  id: string;
  variant_id: string;
  url: string;
  alt_text?: string;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

// ─── Users & Auth ────────────────────────────────────────────
export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  is_default: boolean;
  created_at: string;
}

// ─── Cart ────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  user_id?: string;
  session_id?: string;
  variant_id: string;
  quantity: number;
  created_at: string;
  variant?: GemVariant;
}

export interface CartStoreItem {
  variantId: string;
  quantity: number;
  variant: GemVariant;
}

// ─── Orders ──────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface ShippingAddressSnapshot {
  full_name: string;
  phone?: string;
  email?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  guest_email?: string;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  coupon_code?: string;
  shipping_cost: number;
  total: number;
  currency: string;
  payment_status: PaymentStatus;
  shipping_address: ShippingAddressSnapshot;
  tracking_url?: string;
  notes?: string;
  confirmed_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  profile?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id?: string;
  product_name: string;
  variant_sku: string;
  variant_snapshot: GemVariant;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  changed_by?: string;
  note?: string;
  created_at: string;
}

// ─── Wishlists ───────────────────────────────────────────────
export interface Wishlist {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

// ─── Reviews ─────────────────────────────────────────────────
export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title?: string;
  body?: string;
  status: "approved" | "pending" | "rejected";
  created_at: string;
  profile?: Profile;
}

// ─── Coupons ─────────────────────────────────────────────────
export interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "flat";
  discount_value: number;
  min_order_value: number;
  max_uses?: number;
  current_uses: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

// ─── Filters & Pagination ────────────────────────────────────
export interface ProductFilters {
  category?: string;
  shape?: string;
  carat_min?: number;
  carat_max?: number;
  price_min?: number;
  price_max?: number;
  color?: string;
  origin?: string;
  treatment?: string;
  sort?: "price_asc" | "price_desc" | "carat_asc" | "newest";
  page?: number;
  limit?: number;
  q?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Admin ───────────────────────────────────────────────────
export interface AdminStats {
  total_revenue: number;
  total_orders: number;
  pending_orders: number;
  total_products: number;
  total_customers: number;
}

// ─── Contact ─────────────────────────────────────────────────
export interface ContactFormData {
  full_name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactSubmission {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ─── Checkout ────────────────────────────────────────────────
export interface CheckoutFormData {
  email?: string;
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  notes?: string;
  coupon_code?: string;
}
