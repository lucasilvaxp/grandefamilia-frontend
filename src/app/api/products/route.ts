import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

// GET /api/products - List products with filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');
    
    // Build where conditions
    const conditions = [];
    
    if (category) {
      conditions.push(eq(products.category, category));
    }
    if (subcategory) {
      conditions.push(eq(products.subcategory, subcategory));
    }
    if (brand) {
      conditions.push(eq(products.brand, brand));
    }
    if (featured === 'true') {
      conditions.push(eq(products.featured, true));
    }
    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.description, `%${search}%`)
        )
      );
    }
    
    // Build base query
    let query = db.select().from(products);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    switch (sort) {
      case 'price_asc':
        query = query.orderBy(asc(products.price));
        break;
      case 'price_desc':
        query = query.orderBy(desc(products.price));
        break;
      case 'newest':
        query = query.orderBy(desc(products.createdAt));
        break;
      default:
        query = query.orderBy(desc(products.createdAt));
    }
    
    // Get all results first for total count
    const allResults = await query;
    const total = allResults.length;
    
    // Apply pagination
    const offset = (page - 1) * pageSize;
    const paginatedResults = allResults.slice(offset, offset + pageSize);
    
    // Filter by price range (since SQLite stores price as text)
    let filtered = paginatedResults;
    if (minPrice || maxPrice) {
      filtered = paginatedResults.filter(p => {
        const price = parseFloat(p.price);
        if (minPrice && price < parseFloat(minPrice)) return false;
        if (maxPrice && price > parseFloat(maxPrice)) return false;
        return true;
      });
    }
    
    // Convert price from string to number for all products
    const formattedData = filtered.map(product => ({
      ...product,
      price: parseFloat(product.price),
    }));
    
    return NextResponse.json({
      data: formattedData,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products: ' + error },
      { status: 500 }
    );
  }
}

// POST /api/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, images, category, subcategory, brand, stock, featured } = body;

    // Validate required fields
    if (!name || !price || !category || !brand) {
      return NextResponse.json(
        { error: 'Name, price, category, and brand are required', code: 'MISSING_REQUIRED_FIELDS' },
        { status: 400 }
      );
    }

    const newProduct = await db.insert(products).values({
      name: name.trim(),
      description: description || null,
      price: price.toString(),
      images: images || [],
      category: category.trim(),
      subcategory: subcategory || null,
      brand: brand.trim(),
      stock: stock !== undefined ? stock : 0,
      featured: featured !== undefined ? featured : false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();

    // Convert price to number before returning
    const formattedProduct = {
      ...newProduct[0],
      price: parseFloat(newProduct[0].price),
    };

    return NextResponse.json(formattedProduct, { status: 201 });
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json(
      { error: 'Failed to create product: ' + error },
      { status: 500 }
    );
  }
}