// In-memory mock data store for development
import { Category } from '@/types/product';
import { mockCategories } from './mock-data';

// Initialize with mock data
let categoriesStore: Category[] = [...mockCategories];

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
};
