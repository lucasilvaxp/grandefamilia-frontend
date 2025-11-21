import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

// Categories table
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  subcategories: text('subcategories', { mode: 'json' }).$type<string[]>().notNull().default([]),
  image: text('image'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Brands table
export const brands = sqliteTable('brands', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),
  createdAt: text('created_at').notNull(),
});

// Settings table (singleton - always id=1)
export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  logo: text('logo'),
  storeName: text('store_name').notNull().default('Loja A Grande Família'),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  instagramUrl: text('instagram_url'),
  facebookUrl: text('facebook_url'),
  whatsappNumber: text('whatsapp_number'),
  businessHours: text('business_hours', { mode: 'json' }),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Products table
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  price: text('price').notNull(), // Store as text to preserve decimal precision
  images: text('images', { mode: 'json' }).$type<string[]>().notNull().default([]),
  category: text('category').notNull(),
  subcategory: text('subcategory'),
  brand: text('brand').notNull(),
  stock: integer('stock').notNull().default(0),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});