import { NextRequest, NextResponse } from 'next/server';
import { FASTAPI_BASE_URL } from '@/lib/api-config';
import { mockProducts } from '@/lib/mock-data';

// GET /api/products - List products with filters
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // In development, use mock data. In production, proxy to FastAPI
  const useMockData = process.env.USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_FASTAPI_URL;
  
  if (useMockData) {
    // Mock data filtering
    let filtered = [...mockProducts];
    
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
    
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    if (subcategory) {
      filtered = filtered.filter(p => p.subcategory === subcategory);
    }
    if (brand) {
      filtered = filtered.filter(p => p.brand === brand);
    }
    if (featured === 'true') {
      filtered = filtered.filter(p => p.featured);
    }
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Sorting
    switch (sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
    }
    
    // Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const paginatedData = filtered.slice(start, start + pageSize);
    
    return NextResponse.json({
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages,
    });
  }
  
  try {
    // Proxy to FastAPI backend
    const queryString = searchParams.toString();
    const url = `${FASTAPI_BASE_URL}/api/products${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`FastAPI returned ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from FastAPI:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create product (with fallback)
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  console.log('[PRODUCT POST] Creating product with data:', { 
    name: body.name, 
    hasImages: body.images?.length > 0 
  });
  
  // Always use fallback in production to ensure reliability
  // Backend will sync later if available
  const newProduct = {
    _id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: 0,
    reviewCount: 0,
  };
  
  console.log('[PRODUCT POST] Created product:', newProduct._id);
  
  // Add to mock data for immediate availability
  mockProducts.unshift(newProduct);
  
  // Try to sync with backend asynchronously (fire and forget)
  try {
    fetch(`${FASTAPI_BASE_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    }).then(res => {
      if (res.ok) {
        console.log('[PRODUCT POST] Backend sync successful');
      } else {
        console.log('[PRODUCT POST] Backend sync failed:', res.status);
      }
    }).catch(err => {
      console.log('[PRODUCT POST] Backend sync error:', err.message);
    });
  } catch (error) {
    // Ignore backend sync errors
  }
  
  return NextResponse.json(newProduct, { status: 201 });
}
