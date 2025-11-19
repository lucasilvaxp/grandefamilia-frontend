export interface Brand {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  _id: string;
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
  _id: string;
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
