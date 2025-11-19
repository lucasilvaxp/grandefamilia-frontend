import { NextRequest, NextResponse } from 'next/server';

// Mock admin credentials - In production, use FastAPI backend with proper JWT
const ADMIN_CREDENTIALS = {
  email: 'admin@grandefamilia.com',
  password: 'admin123',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      // Generate a mock JWT token (in production, this should come from FastAPI)
      const token = Buffer.from(JSON.stringify({
        email,
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      })).toString('base64');

      return NextResponse.json({
        success: true,
        token,
        user: { email },
      });
    }

    return NextResponse.json(
      { success: false, message: 'Credenciais inválidas' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Erro no servidor' },
      { status: 500 }
    );
  }
}
