export type ProductCategory = 'Saree' | 'Blouse Piece' | 'Saree + Blouse Combo';
export type BlouseStatus =
  | 'Blouse Included (Unstitched)'
  | 'Blouse Included (Stitched)'
  | 'Blouse Sold Separately'
  | 'Blouse Piece Only';
export type Occasion = 'Wedding' | 'Festive' | 'Party Wear' | 'Casual' | 'Office Wear';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  fabric: string;
  work: string;
  occasion: Occasion[];
  colors: string[];
  region: string;
  blouseStatus: BlouseStatus;
  blousePieceLength?: string;
  price: number;
  discountedPrice: number;
  discountPercent: number;
  stock: number;
  inStock: boolean;
  images: string[];
  sareeLength?: string;
  description: string;
  washCare: string;
  rating: number;
  reviewCount: number;
  deliveryEstimate: string;
  isNew?: boolean;
  isBestseller?: boolean;
  isSale?: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  photos?: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  savedForLater?: boolean;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export type OrderStatus =
  | 'Placed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  address: Address;
  paymentMethod: string;
  deliverySlot: string;
  subtotal: number;
  discount: number;
  couponDiscount?: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export type PaymentMethod = 'UPI' | 'Card' | 'Net Banking' | 'Wallet' | 'COD';

export interface ProductFilters {
  category?: string;
  fabric?: string[];
  color?: string[];
  occasion?: string[];
  priceMin?: number;
  priceMax?: number;
  blouseStatus?: string[];
  region?: string[];
  rating?: number;
  discount?: boolean;
  search?: string;
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'popularity' | 'rating';
}

export type Coupon = {
  id: string;
  code: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  min_order_value: number;
  valid_from: string;
  valid_to: string;
  active: boolean;
};
