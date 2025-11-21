import { NextRequest, NextResponse } from 'next/server';
import { FASTAPI_BASE_URL } from '@/lib/api-config';
import { mockStore } from '@/lib/mock-store';

// Check if we should use mock data
function shouldUseMockData() {
  return process.env.USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_FASTAPI_URL;
}

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  if (shouldUseMockData()) {
    const categories = mockStore.categories.getAll();
    console.log('[API Categories GET] Returning mock categories:', categories.length);
    return NextResponse.json(categories);
  }
  
  try {
    const response = await fetch(`${FASTAPI_BASE_URL}/api/categories`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error(`FastAPI returned ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[API Categories POST] Request:', body);
    console.log('[API Categories POST] Mock mode:', shouldUseMockData());
    
    // MOCK MODE: Use mock store with persistence
    if (shouldUseMockData()) {
      console.log('[API Categories POST] Using MOCK store with persistence');
      
      // Validate required fields
      if (!body.name || !body.slug) {
        return NextResponse.json(
          { error: 'Nome e slug são obrigatórios' },
          { status: 400 }
        );
      }
      
      // Create in mock store
      const newCategory = mockStore.categories.create({
        name: body.name,
        slug: body.slug,
        subcategories: body.subcategories || [],
        image: body.image || '',
      });
      
      console.log('[API Categories POST] Category created in mock store');
      return NextResponse.json(newCategory, { status: 201 });
    }
    
    // REAL MODE: Connect to FastAPI
    console.log('[API] Backend URL:', `${FASTAPI_BASE_URL}/api/categories`);
    
    const response = await fetch(`${FASTAPI_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('[API] Response status:', response.status);
    console.log('[API] Response content-type:', response.headers.get('content-type'));

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = 'Failed to create category';
      
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json();
        errorMessage = error.detail || error.message || errorMessage;
      } else {
        const text = await response.text();
        console.error('[API] Non-JSON error response:', text.substring(0, 200));
        
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          errorMessage = 'Backend não está respondendo. Verifique se o FastAPI está rodando.';
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[API] Error creating category:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Não foi possível conectar ao backend. Verifique se o FastAPI está rodando em ' + FASTAPI_BASE_URL },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
