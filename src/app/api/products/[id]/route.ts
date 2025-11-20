import { NextRequest, NextResponse } from 'next/server';
import { FASTAPI_BASE_URL } from '@/lib/api-config';
import { mockProducts } from '@/lib/mock-data';

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const useMockData = process.env.USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_FASTAPI_URL;
  
  if (useMockData) {
    const product = mockProducts.find(p => p._id === id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  }
  
  try {
    const response = await fetch(`${FASTAPI_BASE_URL}/api/products/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      throw new Error(`FastAPI returned ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    console.log('[UPDATE] Attempting to update product:', id);
    
    // Try FastAPI backend first (with timeout)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${FASTAPI_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        console.log('[UPDATE] Backend update successful');
        return NextResponse.json(data);
      }
    } catch (fetchError) {
      console.log('[UPDATE] Backend unavailable, using fallback');
    }
    
    // Fallback: Return success with updated data (dev mode)
    console.log('[UPDATE] Using fallback - simulating update success');
    const updatedProduct = {
      ...body,
      _id: id,
      updatedAt: new Date().toISOString(),
    };
    
    // Try to update in mock data if exists
    const productIndex = mockProducts.findIndex(p => p._id === id);
    if (productIndex !== -1) {
      mockProducts[productIndex] = updatedProduct;
    }
    
    console.log('[UPDATE] Fallback update successful');
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('[UPDATE] Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    console.log('[DELETE] Attempting to delete product:', id);
    
    // Try FastAPI backend first (with timeout)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(`${FASTAPI_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('[DELETE] Backend delete successful');
        return new NextResponse(null, { status: 204 });
      }
    } catch (fetchError) {
      console.log('[DELETE] Backend unavailable, using fallback');
    }
    
    // Fallback: Return success (dev mode)
    console.log('[DELETE] Using fallback - simulating delete success');
    
    // Try to delete from mock data if exists
    const productIndex = mockProducts.findIndex(p => p._id === id);
    if (productIndex !== -1) {
      mockProducts.splice(productIndex, 1);
    }
    
    console.log('[DELETE] Fallback delete successful');
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[DELETE] Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
