import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/categories - List all categories
export async function GET() {
  try {
    const allCategories = await db.select().from(categories);
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories: ' + error },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, subcategories, image } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Nome e slug são obrigatórios', code: 'MISSING_REQUIRED_FIELDS' },
        { status: 400 }
      );
    }

    const newCategory = await db.insert(categories).values({
      name: name.trim(),
      slug: slug.trim(),
      subcategories: subcategories || [],
      image: image || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json(
      { error: 'Failed to create category: ' + error },
      { status: 500 }
    );
  }
}