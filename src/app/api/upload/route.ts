import { NextRequest, NextResponse } from 'next/server';

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma imagem enviada' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    // Convert each file to base64 and send to FastAPI
    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: `Arquivo ${file.name} excede 5MB` },
          { status: 400 }
        );
      }

      // Convert to base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;

      // Send to FastAPI backend
      const response = await fetch(`${FASTAPI_URL}/api/upload`, {
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

      if (!response.ok) {
        throw new Error('Erro ao fazer upload no backend');
      }

      const result = await response.json();
      uploadedUrls.push(result.url);
    }

    return NextResponse.json({
      urls: uploadedUrls,
      message: `${uploadedUrls.length} imagem(ns) enviada(s) com sucesso!`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar upload' },
      { status: 500 }
    );
  }
}
