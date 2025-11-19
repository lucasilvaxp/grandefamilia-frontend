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

// POST /api/products - Create product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${FASTAPI_BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`FastAPI returned ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
