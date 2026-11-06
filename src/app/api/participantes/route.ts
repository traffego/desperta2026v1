import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cleanPhone } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, whatsapp, idade, observacoes } = body;

    // Validações
    if (!nome || typeof nome !== 'string' || nome.trim().length < 3) {
      return NextResponse.json(
        { error: 'Por favor, informe o seu nome completo (ao menos 3 caracteres).' },
        { status: 400 }
      );
    }

    const cleanedPhone = cleanPhone(whatsapp || '');
    if (cleanedPhone.length < 10 || cleanedPhone.length > 11) {
      return NextResponse.json(
        { error: 'Por favor, informe um WhatsApp válido com DDD (ex: 21999998888).' },
        { status: 400 }
      );
    }

    const parsedAge = Number(idade);
    if (!idade || isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
      return NextResponse.json(
        { error: 'Por favor, informe uma idade válida.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('desperta_participantes')
      .insert([
        {
          nome: nome.trim(),
          whatsapp: cleanedPhone,
          idade: parsedAge,
          observacoes: observacoes ? observacoes.trim() : null,
          status_pagamento: 'pendente',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao cadastrar participante:', error);
      return NextResponse.json(
        { error: 'Não foi possível salvar a inscrição. Tente novamente em instantes.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, participante: data }, { status: 201 });
  } catch (err) {
    console.error('Erro no endpoint de inscrição:', err);
    return NextResponse.json(
      { error: 'Ocorreu um erro inesperado no servidor.' },
      { status: 500 }
    );
  }
}

