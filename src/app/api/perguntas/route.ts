import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sexo, idade, pergunta } = body;

    // Validações
    if (!sexo || typeof sexo !== 'string' || !sexo.trim()) {
      return NextResponse.json(
        { error: 'Por favor, selecione o sexo.' },
        { status: 400 }
      );
    }

    const parsedAge = Number(idade);
    if (!idade || isNaN(parsedAge) || parsedAge < 5 || parsedAge > 120) {
      return NextResponse.json(
        { error: 'Por favor, informe uma idade válida.' },
        { status: 400 }
      );
    }

    if (!pergunta || typeof pergunta !== 'string' || pergunta.trim().length < 5) {
      return NextResponse.json(
        { error: 'Por favor, digite a sua pergunta (mínimo de 5 caracteres).' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('desperta_perguntas_anonimas')
      .insert([
        {
          sexo: sexo.trim(),
          idade: parsedAge,
          pergunta: pergunta.trim(),
          status: 'pendente',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar pergunta anônima:', error);
      return NextResponse.json(
        { error: 'Não foi possível enviar a pergunta. Tente novamente.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (err) {
    console.error('Erro no endpoint de perguntas:', err);
    return NextResponse.json(
      { error: 'Erro inesperado ao processar a pergunta.' },
      { status: 500 }
    );
  }
}

