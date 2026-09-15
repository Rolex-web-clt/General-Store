/**
 * Centralized API Service
 * Handles HTTP requests with cookie credentials and token headers.
 */

const BASE_URL = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Includes HTTP-only cookies
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: { name: string; email: string; password: string; phone?: string }) =>
    request<{ success: boolean; token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () =>
    request<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    }),

  getMe: () =>
    request<{ success: boolean; user: any }>('/auth/me'),

  updateProfile: (profileData: any) =>
    request<{ success: boolean; user: any; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  changePassword: (passwords: { currentPassword: string; newPassword: string }) =>
    request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    }),

  // Products
  getProducts: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const qs = query.toString();
    return request<{
      success: boolean;
      products: any[];
      total: number;
      page: number;
      totalPages: number;
      hasMore: boolean;
    }>(`/products${qs ? `?${qs}` : ''}`);
  },

  getProductById: (id: string) =>
    request<{ success: boolean; product: any; related: any[] }>(`/products/${id}`),

  getSuggestions: (q: string) =>
    request<{ success: boolean; suggestions: any[] }>(`/products/suggestions?q=${encodeURIComponent(q)}`),

  getBrands: () =>
    request<{ success: boolean; brands: string[] }>('/products/brands'),

  createProduct: (product: any) =>
    request<{ success: boolean; product: any; message: string }>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  updateProduct: (id: string, product: any) =>
    request<{ success: boolean; product: any; message: string }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),

  deleteProduct: (id: string) =>
    request<{ success: boolean; message: string }>(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Categories
  getCategories: () =>
    request<{ success: boolean; categories: any[] }>('/categories'),

  createCategory: (category: any) =>
    request<{ success: boolean; category: any; message: string }>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    }),

  updateCategory: (id: string, category: any) =>
    request<{ success: boolean; category: any; message: string }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    }),

  deleteCategory: (id: string) =>
    request<{ success: boolean; message: string }>(`/categories/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  createOrder: (orderData: any) =>
    request<{ success: boolean; order: any; message: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  getMyOrders: () =>
    request<{ success: boolean; orders: any[] }>('/orders/my-orders'),

  getOrderById: (id: string) =>
    request<{ success: boolean; order: any }>(`/orders/${id}`),

  cancelOrder: (id: string) =>
    request<{ success: boolean; order: any; message: string }>(`/orders/${id}/cancel`, {
      method: 'PUT',
    }),

  getAllOrders: (params: { status?: string; search?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    return request<{ success: boolean; orders: any[]; total: number }>(`/orders${qs ? `?${qs}` : ''}`);
  },

  updateOrderStatus: (id: string, status: string, note?: string) =>
    request<{ success: boolean; order: any; message: string }>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    }),

  // Reviews
  getReviewsByProduct: (productId: string) =>
    request<{ success: boolean; reviews: any[] }>(`/reviews/${productId}`),

  addReview: (productId: string, review: { rating: number; comment: string; userName?: string }) =>
    request<{ success: boolean; review: any; message: string }>(`/reviews/${productId}`, {
      method: 'POST',
      body: JSON.stringify(review),
    }),

  // Store & Offers
  getStoreInfo: () =>
    request<{ success: boolean; store: any }>('/store/info'),

  getActiveOffers: () =>
    request<{ success: boolean; offers: any[] }>('/store/active-offers'),

  // Admin
  getAdminMetrics: () =>
    request<{ success: boolean; metrics: any }>('/admin/metrics'),

  getAdminCustomers: (search?: string) =>
    request<{ success: boolean; customers: any[] }>(`/admin/customers${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  toggleCustomerStatus: (id: string, isActive?: boolean) =>
    request<{ success: boolean; customer: any; message: string }>(`/admin/customers/${id}/toggle-status`, {
      method: 'PUT',
      body: isActive !== undefined ? JSON.stringify({ isActive }) : undefined,
    }),

  getOffers: () =>
    request<{ success: boolean; offers: any[] }>('/admin/offers'),

  getAdminOffers: () =>
    request<{ success: boolean; offers: any[] }>('/admin/offers'),

  createOffer: (offer: any) =>
    request<{ success: boolean; offer: any; message: string }>('/admin/offers', {
      method: 'POST',
      body: JSON.stringify(offer),
    }),

  updateOffer: (id: string, offer: any) =>
    request<{ success: boolean; offer: any; message: string }>(`/admin/offers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(offer),
    }),

  deleteOffer: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/offers/${id}`, {
      method: 'DELETE',
    }),

  uploadImage: (payload: { imageUrl?: string; image?: string }) =>
    request<{ success: boolean; url: string; message: string }>('/admin/upload', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
