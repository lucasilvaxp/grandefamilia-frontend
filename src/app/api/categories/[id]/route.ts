import { NextRequest, NextResponse } from 'next/server';
import { FASTAPI_BASE_URL } from '@/lib/api-config';
import { mockStore } from '@/lib/mock-store';

// Check if we should use mock data
function shouldUseMockData() {
  return process.env.USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_FASTAPI_URL;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    
    console.log('[API Categories PUT] Request:', id, body);
    console.log('[API Categories PUT] Mock mode:', shouldUseMockData());
    
    // MOCK MODE: Use mock store with persistence
    if (shouldUseMockData()) {
      console.log('[API Categories PUT] Using MOCK store with persistence');
      
      // Validate required fields
      if (!body.name || !body.slug) {
        return NextResponse.json(
          { error: 'Nome e slug são obrigatórios' },
          { status: 400 }
        );
      }
      
      // Update in mock store
      const updatedCategory = mockStore.categories.update(id, {
        name: body.name,
        slug: body.slug,
        subcategories: body.subcategories || [],
        image: body.image || '',
      });
      
      if (!updatedCategory) {
        return NextResponse.json(
          { error: 'Categoria não encontrada' },
          { status: 404 }
        );
      }
      
      console.log('[API Categories PUT] Category updated in mock store');
      return NextResponse.json(updatedCategory);
    }

    // REAL MODE: Connect to FastAPI
    console.log('[API] Backend URL:', `${FASTAPI_BASE_URL}/api/categories/${id}`);

    const response = await fetch(`${FASTAPI_BASE_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('[API] Response status:', response.status);
    console.log('[API] Response content-type:', response.headers.get('content-type'));

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = 'Failed to update category';
      
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
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API] Error updating category:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Não foi possível conectar ao backend. Verifique se o FastAPI está rodando em ' + FASTAPI_BASE_URL },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('[API Categories DELETE] Request:', id);
    console.log('[API Categories DELETE] Mock mode:', shouldUseMockData());
    
    // MOCK MODE: Use mock store with persistence
    if (shouldUseMockData()) {
      console.log('[API Categories DELETE] Using MOCK store with persistence');
      
      // Delete from mock store
      const deleted = mockStore.categories.delete(id);
      
      if (!deleted) {
        return NextResponse.json(
          { error: 'Categoria não encontrada' },
          { status: 404 }
        );
      }
      
      console.log('[API Categories DELETE] Category deleted from mock store');
      return NextResponse.json({ 
        message: 'Category deleted successfully',
        _id: id 
      });
    }

    // REAL MODE: Connect to FastAPI
    console.log('[API] Backend URL:', `${FASTAPI_BASE_URL}/api/categories/${id}`);

    const response = await fetch(`${FASTAPI_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
    });

    console.log('[API] Response status:', response.status);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let errorMessage = 'Failed to delete category';
      
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
    return NextResponse.json(data);
  } catch (error) {
    console.error('[API] Error deleting category:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { error: 'Não foi possível conectar ao backend. Verifique se o FastAPI está rodando em ' + FASTAPI_BASE_URL },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
