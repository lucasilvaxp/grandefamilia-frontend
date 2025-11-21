export interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  createdAt: string;
}

export interface Banner {
  id: number;
  title: string;
  description?: string;
  image: string;
  link?: string;
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  id: number;
  storeName: string;
  storeDescription?: string;
  logo?: string;
  whatsappNumber?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  address?: string;
  updatedAt: string;
}