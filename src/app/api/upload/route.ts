import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, isSupabaseConfigured } from '@/lib/supabase';

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    console.log('[UPLOAD] Received files:', files.length);

    if (!files || files.length === 0) {
      console.error('[UPLOAD] No files received');
      return NextResponse.json(
        { error: 'Nenhuma imagem enviada' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    // Check if Supabase is configured (only at runtime, not build time)
    const hasSupabase = isSupabaseConfigured();

    // Process each file
    for (const file of files) {
      console.log('[UPLOAD] Processing file:', file.name, file.type, file.size);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error('[UPLOAD] Invalid file type:', file.type);
        return NextResponse.json(
          { error: `Arquivo ${file.name} não é uma imagem` },
          { status: 400 }
        );
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        console.error('[UPLOAD] File too large:', file.size);
        return NextResponse.json(
          { error: `Arquivo ${file.name} excede 5MB` },
          { status: 400 }
        );
      }

      try {
        let finalUrl: string;

        // Use Supabase Storage if configured (for production)
        if (hasSupabase) {
          console.log('[UPLOAD] Using Supabase Storage');
          finalUrl = await uploadImage(file);
          console.log('[UPLOAD] Supabase upload successful:', finalUrl);
        } else {
          // Fallback to base64 for local development
          console.log('[UPLOAD] Using base64 fallback (local development)');
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const base64 = buffer.toString('base64');
          finalUrl = `data:${file.type};base64,${base64}`;
        }

        uploadedUrls.push(finalUrl);
      } catch (conversionError) {
        console.error('[UPLOAD] Upload error:', conversionError);
        return NextResponse.json(
          { error: `Erro ao processar ${file.name}` },
          { status: 500 }
        );
      }
    }

    console.log('[UPLOAD] Success! Uploaded', uploadedUrls.length, 'images');

    return NextResponse.json({
      urls: uploadedUrls,
      message: `${uploadedUrls.length} imagem(ns) enviada(s) com sucesso!`,
    });
  } catch (error) {
    console.error('[UPLOAD] Fatal error:', error);
    return NextResponse.json(
      { 
        error: 'Erro ao processar upload',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
