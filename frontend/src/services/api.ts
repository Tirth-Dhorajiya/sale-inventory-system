import axios from "axios";
import type {
  AuthResponse,
  ProductsResponse,
  CartResponse,
  PurchaseResponse,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

// Auth
export const authAPI = {
  signup: (name: string, email: string, password: string) =>
    api.post<AuthResponse>("/auth/signup", { name, email, password }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login", { email, password }),
};

// Products
export const productAPI = {
  getAll: (params?: { search?: string; category?: string; page?: number }) =>
    api.get<ProductsResponse>("/products", { params }),

  create: (data: {
    name: string;
    price: number;
    category: string;
    stockQuantity: number;
  }) => api.post("/products", data),
};

// Cart
export const cartAPI = {
  get: () => api.get<CartResponse>("/cart"),

  addItem: (productId: string, quantity: number = 1) =>
    api.post<CartResponse>("/cart", { productId, quantity }),
};

// Purchase
export const purchaseAPI = {
  buyProduct: (productId: string, quantity: number = 1) =>
    api.post<PurchaseResponse>("/purchase", { productId, quantity }),

  buyCart: () => api.post<PurchaseResponse>("/purchase", { fromCart: true }),
};

export default api;
