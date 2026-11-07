import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isAdminAuthenticated } from '@/lib/auth';

// GET - Listar perguntas anônimas com filtros
export async function GET(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() || '';
  const sexo = searchParams.get('sexo')?.trim() || '';
  const status = searchParams.get('status')?.trim() || '';

  let query = supabase
    .from('desperta_perguntas_anonimas')
    .select('*')
    .order('created_at', { ascending: false });

  if (q) {
    query = query.ilike('pergunta', `%${q}%`);
  }

  if (sexo && sexo !== 'todos') {
    query = query.eq('sexo', sexo);
  }

  if (status && status !== 'todos') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar perguntas anônimas:', error);
    return NextResponse.json({ error: 'Erro ao buscar perguntas' }, { status: 500 });
  }

  return NextResponse.json({ perguntas: data || [] });
}

// PUT - Atualizar pergunta ou status
export async function PUT(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, pergunta, status, sexo, idade } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {};
    if (pergunta !== undefined) updatePayload.pergunta = pergunta.trim();
    if (status !== undefined) updatePayload.status = status;
    if (sexo !== undefined) updatePayload.sexo = sexo;
    if (idade !== undefined) updatePayload.idade = Number(idade);

    const { data, error } = await supabase
      .from('desperta_perguntas_anonimas')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar pergunta:', error);
      return NextResponse.json({ error: 'Erro ao atualizar dados' }, { status: 500 });
    }

    return NextResponse.json({ success: true, pergunta: data });
  } catch (err) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}

// DELETE - Excluir pergunta
export async function DELETE(req: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID da pergunta é obrigatório' }, { status: 400 });
    }

    const { error } = await supabase
      .from('desperta_perguntas_anonimas')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir pergunta:', error);
      return NextResponse.json({ error: 'Erro ao excluir pergunta' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Pergunta excluída' });
  } catch (err) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}

