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

export interface Profile {
  id: string;
  full_name: string;
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

export interface CartItem {
  id: string;
  user_id?: string;
  session_id?: string;
  variant_id: string;
  quantity: number;
  created_at: string;
  variant?: GemVariant;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface ShippingAddressSnapshot {
  full_name: string;
  phone?: string;
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
  status: OrderStatus;
  subtotal: number;
  shipping_cost: number;
  total: number;
  currency: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  payment_status: PaymentStatus;
  shipping_address: ShippingAddressSnapshot;
  notes?: string;
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

export interface CartStoreItem {
  variantId: string;
  quantity: number;
  variant: GemVariant;
}

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

export interface AdminStats {
  total_revenue: number;
  total_orders: number;
  pending_orders: number;
  total_products: number;
}

export interface ContactFormData {
  full_name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  key: string;
}

export interface CheckoutFormData {
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  notes?: string;
}
