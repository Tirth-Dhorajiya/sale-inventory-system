/* ================================================================
   Type definitions for the Sale Inventory System
   ================================================================ */

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  stockQuantity: number;
  createdAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
}

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: Pagination;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartData {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartResponse {
  success: boolean;
  message?: string;
  data: {
    cart: CartData;
  };
}

export interface PurchaseResult {
  product: string;
  quantityPurchased: number;
  totalPrice?: number;
  remainingStock: number;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  data: {
    purchase?: PurchaseResult;
    succeeded?: PurchaseResult[];
    failed?: { product: string; reason: string }[];
  };
}
