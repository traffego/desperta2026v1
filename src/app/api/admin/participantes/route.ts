import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';
import { cleanPhone } from '@/lib/utils';

// GET - Listar participantes com busca opcional
export async function GET(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() || '';

  let query = supabase
    .from('desperta_participantes')
    .select('*')
    .order('created_at', { ascending: false });

  if (q) {
    // Busca por nome ou whats
    query = query.or(`nome.ilike.%${q}%,whatsapp.ilike.%${cleanPhone(q)}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar participantes:', error);
    return NextResponse.json({ error: 'Erro ao buscar participantes' }, { status: 500 });
  }

  return NextResponse.json({ participantes: data || [] });
}

// POST - Adicionar participante via painel admin
export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { nome, whatsapp, idade, status_pagamento, observacoes } = body;

    if (!nome || !whatsapp || !idade) {
      return NextResponse.json(
        { error: 'Nome, WhatsApp e Idade são obrigatórios.' },
        { status: 400 }
      );
    }

    const cleanedPhone = cleanPhone(whatsapp);
    const parsedAge = Number(idade);

    const { data, error } = await supabase
      .from('desperta_participantes')
      .insert([
        {
          nome: nome.trim(),
          whatsapp: cleanedPhone,
          idade: parsedAge,
          status_pagamento: status_pagamento || 'pendente',
          observacoes: observacoes?.trim() || null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao inserir participante via admin:', error);
      return NextResponse.json({ error: 'Erro ao salvar no banco' }, { status: 500 });
    }

    return NextResponse.json({ success: true, participante: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}

// PUT - Atualizar participante
export async function PUT(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, nome, whatsapp, idade, status_pagamento, observacoes } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório para atualização' }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {};
    if (nome) updatePayload.nome = nome.trim();
    if (whatsapp) updatePayload.whatsapp = cleanPhone(whatsapp);
    if (idade !== undefined) updatePayload.idade = Number(idade);
    if (status_pagamento) updatePayload.status_pagamento = status_pagamento;
    if (observacoes !== undefined) updatePayload.observacoes = observacoes ? observacoes.trim() : null;

    const { data, error } = await supabase
      .from('desperta_participantes')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar participante:', error);
      return NextResponse.json({ error: 'Erro ao atualizar dados' }, { status: 500 });
    }

    return NextResponse.json({ success: true, participante: data });
  } catch (err) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}

// DELETE - Excluir participante
export async function DELETE(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do participante é obrigatório' }, { status: 400 });
    }

    const { error } = await supabase
      .from('desperta_participantes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir participante:', error);
      return NextResponse.json({ error: 'Erro ao excluir' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Participante excluído' });
  } catch (err) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
