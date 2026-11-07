'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  HelpCircle,
  Copy,
  Check,
  Search,
  Trash2,
  Edit3,
  RefreshCw,
  Star,
  CheckCircle,
  Clock,
  Filter,
  X,
  Sparkles,
  Download
} from 'lucide-react';
import { PerguntaAnonima } from '@/types';
import { AdminNavbar } from './AdminNavbar';

export function AdminPerguntas() {
  const router = useRouter();
  const [perguntas, setPerguntas] = useState<PerguntaAnonima[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroSexo, setFiltroSexo] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  // Modais
  const [perguntaEditando, setPerguntaEditando] = useState<PerguntaAnonima | null>(null);
  const [perguntaExcluindo, setPerguntaExcluindo] = useState<PerguntaAnonima | null>(null);

  // Form states de edição
  const [editTexto, setEditTexto] = useState('');
  const [editSexo, setEditSexo] = useState('');
  const [editIdade, setEditIdade] = useState('');
  const [editStatus, setEditStatus] = useState('pendente');
  const [editLoading, setEditLoading] = useState(false);

  // Carregar dados
  const carregarPerguntas = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/admin/perguntas');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setPerguntas(data.perguntas || []);
    } catch (err) {
      console.error('Erro ao buscar perguntas:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarPerguntas();
  }, []);

  // Filtragem
  const perguntasFiltradas = useMemo(() => {
    return perguntas.filter((p) => {
      const matchText = p.pergunta.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSexo = filtroSexo === 'todos' || p.sexo === filtroSexo;
      const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus;
      return matchText && matchSexo && matchStatus;
    });
  }, [perguntas, searchTerm, filtroSexo, filtroStatus]);

  // Contadores
  const totalGeral = perguntas.length;
  const totalSelecionadas = perguntas.filter((p) => p.status === 'selecionada').length;
  const totalRespondidas = perguntas.filter((p) => p.status === 'respondida').length;

  // Copiar todas as perguntas formatadas
  const handleCopiarTodas = async () => {
    if (perguntasFiltradas.length === 0) return;

    const textoFormatado = [
      `=== PERGUNTAS DESPERTA 2026 (PSICÓLOGA & PADRE) ===`,
      `Total: ${perguntasFiltradas.length} pergunta(s)`,
      `Gerado em: ${new Date().toLocaleString('pt-BR')}`,
      `--------------------------------------------------------\n`,
      ...perguntasFiltradas.map((p, index) => {
        return `${index + 1}. [${p.sexo}, ${p.idade} anos] (Status: ${p.status.toUpperCase()})\n"${p.pergunta}"\n`;
      }),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(textoFormatado);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 3000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  // Alternar Status rápido
  const handleToggleStatus = async (p: PerguntaAnonima, novoStatus: string) => {
    try {
      await fetch('/api/admin/perguntas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: p.id, status: novoStatus }),
      });
      setPerguntas((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, status: novoStatus } : item))
      );
    } catch (err) {
      console.error('Erro ao alternar status:', err);
    }
  };

  // Abrir Modal Editar
  const abrirModalEditar = (p: PerguntaAnonima) => {
    setPerguntaEditando(p);
    setEditTexto(p.pergunta);
    setEditSexo(p.sexo);
    setEditIdade(p.idade.toString());
    setEditStatus(p.status);
  };

  // Salvar Edição
  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!perguntaEditando) return;

    setEditLoading(true);
    try {
      const res = await fetch('/api/admin/perguntas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: perguntaEditando.id,
          pergunta: editTexto.trim(),
          sexo: editSexo,
          idade: parseInt(editIdade, 10),
          status: editStatus,
        }),
      });

      if (!res.ok) throw new Error('Erro ao salvar');

      setPerguntaEditando(null);
      carregarPerguntas(true);
    } catch (err) {
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  // Excluir Pergunta
  const handleConfirmarExclusao = async () => {
    if (!perguntaExcluindo) return;
    try {
      await fetch(`/api/admin/perguntas?id=${perguntaExcluindo.id}`, {
        method: 'DELETE',
      });
      setPerguntaExcluindo(null);
      carregarPerguntas(true);
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ec] pb-16">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-blue-100 text-[#0047cc] flex items-center justify-center font-bold">
              <HelpCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total de Perguntas
              </span>
              <span className="text-2xl font-black text-slate-900">{totalGeral}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Selecionadas para o Evento
              </span>
              <span className="text-2xl font-black text-amber-600">{totalSelecionadas}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Já Respondidas
              </span>
              <span className="text-2xl font-black text-emerald-700">{totalRespondidas}</span>
            </div>
          </div>
        </div>

        {/* Action Toolbar: Search, Filters, Copy All */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[240px]">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar palavras na pergunta..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0047cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047cc]/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Filter Sexo */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-500 uppercase">Sexo:</span>
            <select
              value={filtroSexo}
              onChange={(e) => setFiltroSexo(e.target.value)}
              className="rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs font-bold text-slate-700 focus:border-[#0047cc] focus:outline-none"
            >
              <option value="todos">Todos os sexos</option>
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro / Prefiro não dizer">Outro</option>
            </select>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold text-slate-500 uppercase">Status:</span>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="rounded-xl border border-slate-300 bg-slate-50/50 px-3 py-2 text-xs font-bold text-slate-700 focus:border-[#0047cc] focus:outline-none"
            >
              <option value="todos">Todos os status</option>
              <option value="pendente">Pendente</option>
              <option value="selecionada">Selecionada</option>
              <option value="respondida">Respondida</option>
            </select>
          </div>

          {/* Copiar Todas as Perguntas */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopiarTodas}
              title="Copiar todas as perguntas visíveis formatadas para a psicóloga"
              className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                copiedAll
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {copiedAll ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copiar Todas ({perguntasFiltradas.length})</span>
                </>
              )}
            </button>

            <button
              onClick={() => carregarPerguntas(true)}
              title="Atualizar"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Lista de Perguntas (Cards) */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-[#0047cc]" />
            <p className="text-sm font-medium">Carregando perguntas anônimas...</p>
          </div>
        ) : perguntasFiltradas.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-700">Nenhuma pergunta encontrada</h3>
            <p className="text-xs text-slate-400 mt-1">
              {searchTerm || filtroSexo !== 'todos' || filtroStatus !== 'todos'
                ? 'Tente ajustar os filtros acima.'
                : 'As perguntas enviadas pelos jovens na rota /perguntas-desperta aparecerão aqui.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {perguntasFiltradas.map((p, index) => {
              const isSelecionada = p.status === 'selecionada';
              const isRespondida = p.status === 'respondida';

              return (
                <div
                  key={p.id}
                  className={`rounded-2xl border bg-white p-5 shadow-xs transition-all flex flex-col justify-between ${
                    isSelecionada
                      ? 'border-amber-400 ring-2 ring-amber-400/20'
                      : isRespondida
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    {/* Header do Card */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-white font-mono text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-[#0047cc]">
                          {p.sexo}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                          {p.idade} anos
                        </span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isRespondida
                            ? 'bg-emerald-100 text-emerald-800'
                            : isSelecionada
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>

                    {/* Texto da Pergunta */}
                    <p className="text-sm sm:text-base font-semibold text-slate-900 whitespace-pre-wrap leading-relaxed">
                      &ldquo;{p.pergunta}&rdquo;
                    </p>
                  </div>

                  {/* Footer com Data e Ações */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">
                      {new Date(p.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Botão Selecionar / Desmarcar */}
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleStatus(p, isSelecionada ? 'pendente' : 'selecionada')
                        }
                        title={
                          isSelecionada
                            ? 'Remover da lista de selecionadas'
                            : 'Selecionar pergunta para o evento'
                        }
                        className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                          isSelecionada
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800'
                        }`}
                      >
                        <Star className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">
                          {isSelecionada ? 'Selecionada' : 'Selecionar'}
                        </span>
                      </button>

                      {/* Botão Marcar como Respondida */}
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleStatus(p, isRespondida ? 'pendente' : 'respondida')
                        }
                        title={isRespondida ? 'Marcar como pendente' : 'Marcar como respondida'}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isRespondida
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                        }`}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                      </button>

                      {/* Botão Editar */}
                      <button
                        type="button"
                        onClick={() => abrirModalEditar(p)}
                        title="Editar pergunta"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>

                      {/* Botão Excluir */}
                      <button
                        type="button"
                        onClick={() => setPerguntaExcluindo(p)}
                        title="Excluir pergunta"
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* MODAL EDITAR PERGUNTA */}
      {perguntaEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-slate-900">Editar Pergunta</h3>
              <button
                onClick={() => setPerguntaEditando(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarEdicao} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Sexo
                  </label>
                  <select
                    value={editSexo}
                    onChange={(e) => setEditSexo(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900 bg-white focus:border-[#0047cc] focus:outline-none"
                  >
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro / Prefiro não dizer">Outro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Idade
                  </label>
                  <input
                    type="number"
                    value={editIdade}
                    onChange={(e) => setEditIdade(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-[#0047cc] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-bold text-slate-900 bg-white focus:border-[#0047cc] focus:outline-none"
                >
                  <option value="pendente">Pendente</option>
                  <option value="selecionada">Selecionada para a Psicóloga</option>
                  <option value="respondida">Respondida no Evento</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Texto da Pergunta
                </label>
                <textarea
                  rows={5}
                  value={editTexto}
                  onChange={(e) => setEditTexto(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 focus:border-[#0047cc] focus:outline-none resize-y"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPerguntaEditando(null)}
                  className="flex-1 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 rounded-xl bg-[#0047cc] hover:bg-[#003bb5] text-white py-2.5 text-xs font-bold transition-all cursor-pointer disabled:opacity-60"
                >
                  {editLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EXCLUSÃO DE PERGUNTA */}
      {perguntaExcluindo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-center">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">Excluir Pergunta?</h3>
            <p className="text-xs text-slate-600 mt-2 line-clamp-3 italic">
              &ldquo;{perguntaExcluindo.pergunta}&rdquo;
            </p>

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={() => setPerguntaExcluindo(null)}
                className="flex-1 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarExclusao}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white py-2.5 text-xs font-bold shadow-xs cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

