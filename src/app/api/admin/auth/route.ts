import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_CONFIG, getAdminPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const correctPassword = getAdminPassword();

    if (!password || password.trim() !== correctPassword) {
      return NextResponse.json(
        { error: 'Senha incorreta. Tente novamente.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true, message: 'Autenticado com sucesso' });

    response.cookies.set({
      name: ADMIN_COOKIE_CONFIG.name,
      value: ADMIN_COOKIE_CONFIG.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao processar autenticação' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logout efetuado' });
  response.cookies.delete(ADMIN_COOKIE_CONFIG.name);
  return response;
}

