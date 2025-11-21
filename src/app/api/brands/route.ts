import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { brands } from '@/db/schema';

// GET /api/brands - List all brands
export async function GET() {
  try {
    const allBrands = await db.select().from(brands);
    return NextResponse.json(allBrands);
  } catch (error) {
    console.error('GET /api/brands error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands: ' + error },
      { status: 500 }
    );
  }
}

// POST /api/brands - Create new brand
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required', code: 'MISSING_REQUIRED_FIELDS' },
        { status: 400 }
      );
    }

    const newBrand = await db.insert(brands).values({
      name: name.trim(),
      slug: slug.trim(),
      createdAt: new Date().toISOString(),
    }).returning();

    return NextResponse.json(newBrand[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/brands error:', error);
    return NextResponse.json(
      { error: 'Failed to create brand: ' + error },
      { status: 500 }
    );
  }
}