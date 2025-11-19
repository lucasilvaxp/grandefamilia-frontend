import { NextRequest, NextResponse } from 'next/server';

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
        // Convert to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        console.log('[UPLOAD] Converted to base64, size:', dataUrl.length);

        // Try to use FastAPI backend for validation, but fallback to direct storage
        let finalUrl = dataUrl;

        try {
          const backendResponse = await fetch(`${FASTAPI_URL}/api/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              filename: file.name,
              content_type: file.type,
              data: dataUrl,
            }),
          });

          if (backendResponse.ok) {
            const result = await backendResponse.json();
            finalUrl = result.url;
            console.log('[UPLOAD] Backend validation successful');
          } else {
            console.warn('[UPLOAD] Backend validation failed, using direct storage');
            // Fallback: use dataUrl directly
          }
        } catch (backendError) {
          console.warn('[UPLOAD] Backend unavailable, using direct storage:', backendError);
          // Fallback: use dataUrl directly
        }

        uploadedUrls.push(finalUrl);
      } catch (conversionError) {
        console.error('[UPLOAD] Conversion error:', conversionError);
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
