// Types matching MongoDB schema for Fashion Catalog

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand: string;
  sizes: string[];
  colors: Color[];
  images: string[];
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
}

export interface Color {
  name: string;
  hex: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  subcategories: string[];
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: Color;
}

export interface FilterOptions {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  search?: string;
  featured?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
