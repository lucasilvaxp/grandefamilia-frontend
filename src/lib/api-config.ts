// API Configuration for FastAPI Backend Integration

// Change this to your FastAPI backend URL when deployed
export const FASTAPI_BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

// API endpoints
export const API_ENDPOINTS = {
  // Products
  products: '/api/products',
  productById: (id: string) => `/api/products/${id}`,
  
  // Categories
  categories: '/api/categories',
  categoryById: (id: string) => `/api/categories/${id}`,
  
  // Search & Filters
  search: '/api/products/search',
  filter: '/api/products/filter',
  
  // Cart (local storage for now)
  cart: '/api/cart',
} as const;

// Helper function to build query strings
export function buildQueryString(params: Record<string, any>): string {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => `${key}[]=${encodeURIComponent(v)}`).join('&');
      }
      return `${key}=${encodeURIComponent(value)}`;
    });
  
  return filtered.length > 0 ? `?${filtered.join('&')}` : '';
}
