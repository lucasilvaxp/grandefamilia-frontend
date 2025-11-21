import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/products/[id] - Get single product
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

    const product = await db.select().from(products).where(eq(products.id, parseInt(id))).limit(1);

    if (product.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Convert price to number
    const formattedProduct = {
      ...product[0],
      price: parseFloat(product[0].price),
      originalPrice: product[0].originalPrice ? parseFloat(product[0].originalPrice) : null,
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product: ' + error },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product
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

    const { name, description, price, images, category, subcategory, brand, stock, featured, sizes, colors, tags, originalPrice } = body;

    const updatedProduct = await db.update(products)
      .set({
        name: name ? name.trim() : undefined,
        description: description !== undefined ? description : undefined,
        price: price ? price.toString() : undefined,
        images: images !== undefined ? images : undefined,
        category: category ? category.trim() : undefined,
        subcategory: subcategory !== undefined ? subcategory : undefined,
        brand: brand ? brand.trim() : undefined,
        stock: stock !== undefined ? stock : undefined,
        featured: featured !== undefined ? featured : undefined,
        sizes: sizes !== undefined ? sizes : undefined,
        colors: colors !== undefined ? colors : undefined,
        tags: tags !== undefined ? tags : undefined,
        originalPrice: originalPrice !== undefined ? (originalPrice ? originalPrice.toString() : null) : undefined,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (updatedProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Convert price to number
    const formattedProduct = {
      ...updatedProduct[0],
      price: parseFloat(updatedProduct[0].price),
      originalPrice: updatedProduct[0].originalPrice ? parseFloat(updatedProduct[0].originalPrice) : null,
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update product: ' + error },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product
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

    const deletedProduct = await db.delete(products)
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (deletedProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Product deleted successfully',
      id: parseInt(id)
    });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product: ' + error },
      { status: 500 }
    );
  }
}
