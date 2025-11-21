import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { brands } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/brands/[id] - Get single brand
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const brand = await db.select().from(brands).where(eq(brands.id, parseInt(id))).limit(1);

    if (brand.length === 0) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(brand[0]);
  } catch (error) {
    console.error('GET /api/brands/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brand: ' + error },
      { status: 500 }
    );
  }
}

// PUT /api/brands/[id] - Update brand
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required', code: 'MISSING_REQUIRED_FIELDS' },
        { status: 400 }
      );
    }

    const updatedBrand = await db.update(brands)
      .set({
        name: name.trim(),
        slug: slug.trim(),
      })
      .where(eq(brands.id, parseInt(id)))
      .returning();

    if (updatedBrand.length === 0) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedBrand[0]);
  } catch (error) {
    console.error('PUT /api/brands/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update brand: ' + error },
      { status: 500 }
    );
  }
}

// DELETE /api/brands/[id] - Delete brand
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const deletedBrand = await db.delete(brands)
      .where(eq(brands.id, parseInt(id)))
      .returning();

    if (deletedBrand.length === 0) {
      return NextResponse.json(
        { error: 'Brand not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Brand deleted successfully',
      id: parseInt(id)
    });
  } catch (error) {
    console.error('DELETE /api/brands/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete brand: ' + error },
      { status: 500 }
    );
  }
}