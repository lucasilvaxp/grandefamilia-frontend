import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/settings - Get settings (singleton, always id=1)
export async function GET() {
  try {
    let settingsData = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);

    // If settings don't exist, create default settings
    if (settingsData.length === 0) {
      const defaultSettings = await db.insert(settings).values({
        storeName: 'Loja A Grande Família',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).returning();

      settingsData = defaultSettings;
    }

    return NextResponse.json(settingsData[0]);
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar configurações: ' + error },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update settings (singleton, always id=1)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { logo, storeName, phone, email, address, instagramUrl, facebookUrl, whatsappNumber, businessHours } = body;

    // Check if settings exist
    const existingSettings = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);

    let updatedSettings;

    if (existingSettings.length === 0) {
      // Create if doesn't exist
      updatedSettings = await db.insert(settings).values({
        logo: logo || null,
        storeName: storeName || 'Loja A Grande Família',
        phone: phone || null,
        email: email || null,
        address: address || null,
        instagramUrl: instagramUrl || null,
        facebookUrl: facebookUrl || null,
        whatsappNumber: whatsappNumber || null,
        businessHours: businessHours || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).returning();
    } else {
      // Update existing
      updatedSettings = await db.update(settings)
        .set({
          logo: logo || null,
          storeName: storeName || 'Loja A Grande Família',
          phone: phone || null,
          email: email || null,
          address: address || null,
          instagramUrl: instagramUrl || null,
          facebookUrl: facebookUrl || null,
          whatsappNumber: whatsappNumber || null,
          businessHours: businessHours || null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(settings.id, 1))
        .returning();
    }

    return NextResponse.json(updatedSettings[0]);
  } catch (error) {
    console.error('PUT /api/settings error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar configurações: ' + error },
      { status: 500 }
    );
  }
}