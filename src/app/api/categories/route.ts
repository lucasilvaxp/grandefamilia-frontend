import { NextRequest, NextResponse } from 'next/server';
import { FASTAPI_BASE_URL } from '@/lib/api-config';
import { mockCategories } from '@/lib/mock-data';

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  const useMockData = process.env.USE_MOCK_DATA === 'true' || !process.env.NEXT_PUBLIC_FASTAPI_URL;
  
  if (useMockData) {
    return NextResponse.json(mockCategories);
  }
  
  try {
    const response = await fetch(`${FASTAPI_BASE_URL}/api/categories`);
    
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
