// In-memory mock data store for development
import { Category } from '@/types/product';
import { Brand } from '@/types/admin';
import { StoreSettings } from '@/types/settings';
import { mockCategories } from './mock-data';

// Initialize with mock data
let categoriesStore: Category[] = [...mockCategories];

// Initialize brands mock data
let brandsStore: Brand[] = [
  {
    _id: '1',
    name: 'Nike',
    description: 'Marca esportiva mundial',
    logo: '',
  },
  {
    _id: '2',
    name: 'Adidas',
    description: 'Marca alemã de vestuário esportivo',
    logo: '',
  },
  {
    _id: '3',
    name: 'Puma',
    description: 'Marca de roupas e acessórios esportivos',
    logo: '',
  },
];

// Initialize settings mock data
let settingsStore: StoreSettings = {
  _id: '1',
  type: 'store_settings',
  storeName: 'Loja A Grande Família',
  logo: '/logo-grande-familia.png',
  whatsappNumber: '5593991084582',
  whatsappMessage: 'Olá! Gostaria de saber mais sobre os produtos.',
  instagram: 'https://instagram.com/lojagrandefamilia',
  facebook: 'https://facebook.com/lojagrandefamilia',
  email: 'contato@lojagrandefamilia.com',
  address: 'Av. Tancredo Neves, 2035, Santarém, PA',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockStore = {
  // Categories
  categories: {
    getAll: (): Category[] => {
      return [...categoriesStore];
    },
    
    getById: (id: string): Category | undefined => {
      return categoriesStore.find(cat => cat._id === id);
    },
    
    create: (data: Omit<Category, '_id'>): Category => {
      const newCategory: Category = {
        ...data,
        _id: Date.now().toString(),
        subcategories: data.subcategories || [],
      };
      categoriesStore.push(newCategory);
      console.log('[MockStore] Category created:', newCategory);
      console.log('[MockStore] Total categories:', categoriesStore.length);
      return newCategory;
    },
    
    update: (id: string, data: Partial<Category>): Category | null => {
      const index = categoriesStore.findIndex(cat => cat._id === id);
      if (index === -1) {
        console.log('[MockStore] Category not found for update:', id);
        return null;
      }
      
      categoriesStore[index] = {
        ...categoriesStore[index],
        ...data,
        _id: id, // Preserve original ID
      };
      
      console.log('[MockStore] Category updated:', categoriesStore[index]);
      console.log('[MockStore] Total categories:', categoriesStore.length);
      return categoriesStore[index];
    },
    
    delete: (id: string): boolean => {
      const index = categoriesStore.findIndex(cat => cat._id === id);
      if (index === -1) {
        console.log('[MockStore] Category not found for deletion:', id);
        return false;
      }
      
      categoriesStore.splice(index, 1);
      console.log('[MockStore] Category deleted:', id);
      console.log('[MockStore] Total categories:', categoriesStore.length);
      return true;
    },
    
    reset: (): void => {
      categoriesStore = [...mockCategories];
      console.log('[MockStore] Categories reset to initial mock data');
    },
  },

  // Brands
  brands: {
    getAll: (): Brand[] => {
      console.log('[MockStore] Getting all brands, count:', brandsStore.length);
      return [...brandsStore];
    },
    
    getById: (id: string): Brand | undefined => {
      return brandsStore.find(brand => brand._id === id);
    },
    
    create: (data: Omit<Brand, '_id'>): Brand => {
      const newBrand: Brand = {
        ...data,
        _id: Date.now().toString(),
      };
      brandsStore.push(newBrand);
      console.log('[MockStore] Brand created:', newBrand);
      console.log('[MockStore] Total brands:', brandsStore.length);
      return newBrand;
    },
    
    update: (id: string, data: Partial<Brand>): Brand | null => {
      const index = brandsStore.findIndex(brand => brand._id === id);
      if (index === -1) {
        console.log('[MockStore] Brand not found for update:', id);
        return null;
      }
      
      brandsStore[index] = {
        ...brandsStore[index],
        ...data,
        _id: id, // Preserve original ID
      };
      
      console.log('[MockStore] Brand updated:', brandsStore[index]);
      return brandsStore[index];
    },
    
    delete: (id: string): boolean => {
      const index = brandsStore.findIndex(brand => brand._id === id);
      if (index === -1) {
        console.log('[MockStore] Brand not found for deletion:', id);
        return false;
      }
      
      brandsStore.splice(index, 1);
      console.log('[MockStore] Brand deleted:', id);
      console.log('[MockStore] Total brands:', brandsStore.length);
      return true;
    },
  },

  // Settings
  settings: {
    get: (): StoreSettings => {
      console.log('[MockStore] Getting store settings');
      return { ...settingsStore };
    },
    
    update: (data: Partial<StoreSettings>): StoreSettings => {
      settingsStore = {
        ...settingsStore,
        ...data,
        _id: settingsStore._id, // Preserve original ID
        type: 'store_settings', // Preserve type
        updatedAt: new Date().toISOString(),
      };
      console.log('[MockStore] Settings updated:', settingsStore);
      return { ...settingsStore };
    },
  },
};
