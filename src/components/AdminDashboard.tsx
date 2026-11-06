'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Search,
  UserPlus,
  Trash2,
  Edit,
  MessageCircle,
  LogOut,
  RefreshCw,
  X,
  Check,
  Calendar,
  AlertCircle,
  ChevronDown,
  DollarSign,
  Phone,
  FileSpreadsheet
} from 'lucide-react';
import { Participante } from '@/types';
import { formatWhatsApp, cleanPhone, buildWhatsAppLink } from '@/lib/utils';

export function AdminDashboard() {
  const router = useRouter();
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modais de manutenção
  const [modalAdicionar, setModalAdicionar] = useState(false);
  const [participanteEditando, setParticipanteEditando] = useState<Participante | null>(null);
  const [participanteExcluindo, setParticipanteExcluindo] = useState<Participante | null>(null);

  // Form states para Adicionar/Editar
  const [formNome, setFormNome] = useState('');
  const [formWhatsApp, setFormWhatsApp] = useState('');
  const [formIdade, setFormIdade] = useState('');
  const [formStatus, setFormStatus] = useState('pendente');
  const [formObs, setFormObs] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Carregar dados
  const carregarParticipantes = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch('/api/admin/participantes');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setParticipantes(data.participantes || []);
    } catch (err) {
      console.error('Erro ao buscar inscritos:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarParticipantes();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Erro no logout:', err);
    }
  };

  // Filtro de busca
  const participantesFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return participantes;
    const term = searchTerm.toLowerCase();
    const cleanTerm = cleanPhone(term);

    return participantes.filter((p) => {
      const matchNome = p.nome.toLowerCase().includes(term);
      const matchWhats = cleanPhone(p.whatsapp).includes(cleanTerm);
      return matchNome || matchWhats;
    });
  }, [participantes, searchTerm]);

  // Contadores
  const totalInscritos = participantes.length;
  const totalPagos = participantes.filter((p) => p.status_pagamento === 'pago').length;
  const totalArrecadado = totalPagos * 5;

  // Abrir Modal Adicionar
  const abrirModalAdicionar = () => {
    setFormNome('');
    setFormWhatsApp('');
    setFormIdade('');
    setFormStatus('pendente');
    setFormObs('');
    setFormError(null);
    setModalAdicionar(true);
  };

  // Abrir Modal Editar
  const abrirModalEditar = (p: Participante) => {
    setParticipanteEditando(p);
    setFormNome(p.nome);
    setFormWhatsApp(formatWhatsApp(p.whatsapp));
    setFormIdade(p.idade.toString());
    setFormStatus(p.status_pagamento || 'pendente');
    setFormObs(p.observacoes || '');
    setFormError(null);
  };

  // Salvar Novo Participante
  const handleSalvarNovo = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formNome.trim() || formNome.trim().length < 3) {
      setFormError('Informe o nome completo.');
      return;
    }
    const cleanNum = cleanPhone(formWhatsApp);
    if (cleanNum.length < 10) {
      setFormError('Informe um WhatsApp válido.');
      return;
    }
    const age = parseInt(formIdade, 10);
    if (isNaN(age) || age < 1) {
      setFormError('Informe uma idade válida.');
      return;
    }

    setFormLoading(true);
    try {
      const res = await fetch('/api/admin/participantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formNome.trim(),
          whatsapp: cleanNum,
          idade: age,
          status_pagamento: formStatus,
          observacoes: formObs,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar.');

      setModalAdicionar(false);
      carregarParticipantes(true);
    } catch (err: any) {
      setFormError(err.message || 'Erro ao salvar.');
    } finally {
      setFormLoading(false);
    }
  };

  // Salvar Edição
  const handleSalvarEdicao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!participanteEditando) return;
    setFormError(null);

    const cleanNum = cleanPhone(formWhatsApp);
    const age = parseInt(formIdade, 10);

    setFormLoading(true);
    try {
      const res = await fetch('/api/admin/participantes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: participanteEditando.id,
          nome: formNome.trim(),
          whatsapp: cleanNum,
          idade: age,
          status_pagamento: formStatus,
          observacoes: formObs,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar.');

      setParticipanteEditando(null);
      carregarParticipantes(true);
    } catch (err: any) {
      setFormError(err.message || 'Erro ao atualizar.');
    } finally {
      setFormLoading(false);
    }
  };

  // Alternar Status de Pagamento Rápido
  const alternarStatusPagamento = async (p: Participante) => {
    const novoStatus = p.status_pagamento === 'pago' ? 'pendente' : 'pago';
    try {
      await fetch('/api/admin/participantes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: p.id,
          status_pagamento: novoStatus,
        }),
      });
      setParticipantes((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, status_pagamento: novoStatus } : item))
      );
    } catch (err) {
      console.error('Erro ao alternar status:', err);
    }
  };

  // Excluir Participante
  const handleConfirmarExclusao = async () => {
    if (!participanteExcluindo) return;
    try {
      await fetch(`/api/admin/participantes?id=${participanteExcluindo.id}`, {
        method: 'DELETE',
      });
      setParticipanteExcluindo(null);
      carregarParticipantes(true);
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4ec] pb-16">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 bg-white/95 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="badge-tag text-[10px]">ADMIN</span>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-tight">
                DESPERTA 2026
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">Gestão de Participantes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => carregarParticipantes(true)}
              title="Atualizar lista"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-blue-100 text-[#0047cc] flex items-center justify-center font-bold">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total de Inscritos
              </span>
              <span className="text-2xl font-black text-slate-900">{totalInscritos}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Pagamentos Confirmados
              </span>
              <span className="text-2xl font-black text-emerald-700">{totalPagos}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Total Confirmado (R$ 5/un)
              </span>
              <span className="text-2xl font-black text-slate-900">R$ {totalArrecadado},00</span>
            </div>
          </div>
        </div>

        {/* Toolbar: Search & Add button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
          <div className="relative w-full sm:w-96">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou WhatsApp..."
              className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0047cc] focus:outline-none focus:ring-2 focus:ring-[#0047cc]/20 shadow-xs"
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

          <button
            onClick={abrirModalAdicionar}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#0047cc] hover:bg-[#003bb5] text-white px-4 py-2.5 text-sm font-bold shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Adicionar Participante</span>
          </button>
        </div>

        {/* Table / List View */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-[#0047cc]" />
              <p className="text-sm font-medium">Carregando participantes...</p>
            </div>
          ) : participantesFiltrados.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-700">Nenhum participante encontrado</h3>
              <p className="text-xs text-slate-400 mt-1">
                {searchTerm ? 'Tente buscar com outro termo.' : 'Cadastre o primeiro participante no formulário.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3.5">Nome</th>
                    <th className="px-4 py-3.5">WhatsApp</th>
                    <th className="px-4 py-3.5">Idade</th>
                    <th className="px-4 py-3.5">Pagamento</th>
                    <th className="px-4 py-3.5">Data Inscrição</th>
                    <th className="px-4 py-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {participantesFiltrados.map((p) => {
                    const whatsMessage = `Olá ${p.nome}! Aqui é da coordenação do evento DESPERTA (Paróquia São Francisco de Assis). Tudo bem com você?`;
                    const whatsUrl = buildWhatsAppLink(p.whatsapp, whatsMessage);
                    const isPago = p.status_pagamento === 'pago';

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Nome */}
                        <td className="px-4 py-3.5 font-bold text-slate-900">
                          {p.nome}
                          {p.observacoes && (
                            <span className="block text-[11px] font-normal text-slate-500 italic mt-0.5">
                              Obs: {p.observacoes}
                            </span>
                          )}
                        </td>

                        {/* WhatsApp */}
                        <td className="px-4 py-3.5 font-mono text-xs text-slate-800">
                          {formatWhatsApp(p.whatsapp)}
                        </td>

                        {/* Idade */}
                        <td className="px-4 py-3.5 text-slate-700">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                            {p.idade} anos
                          </span>
                        </td>

                        {/* Pagamento Toggle */}
                        <td className="px-4 py-3.5">
                          <button
                            type="button"
                            onClick={() => alternarStatusPagamento(p)}
                            title="Clique para alternar o status do pagamento"
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                              isPago
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${isPago ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                            {isPago ? 'Pago' : 'Pendente'}
                          </button>
                        </td>

                        {/* Data */}
                        <td className="px-4 py-3.5 text-xs text-slate-500">
                          {new Date(p.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>

                        {/* Ações */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Botão Mandar WhatsApp */}
                            <a
                              href={whatsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Abrir WhatsApp para este participante"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
                            >
                              <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="hidden md:inline">WhatsApp</span>
                            </a>

                            {/* Botão Editar */}
                            <button
                              type="button"
                              onClick={() => abrirModalEditar(p)}
                              title="Editar dados"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                            </button>

                            {/* Botão Excluir */}
                            <button
                              type="button"
                              onClick={() => setParticipanteExcluindo(p)}
                              title="Excluir participante"
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* MODAL ADICIONAR PARTICIPANTE */}
      {modalAdicionar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-slate-900">Novo Participante</h3>
              <button
                onClick={() => setModalAdicionar(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleSalvarNovo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Nome do participante"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-[#0047cc] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formWhatsApp}
                    onChange={(e) => setFormWhatsApp(formatWhatsApp(e.target.value))}
                    placeholder="(21) 99999-8888"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-[#0047cc] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Idade *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={formIdade}
                    onChange={(e) => setFormIdade(e.target.value)}
                    placeholder="Ex: 20"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-[#0047cc] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Status do Pagamento
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-[#0047cc] focus:outline-none bg-white"
                >
                  <option value="pendente">Pendente (Aguardando Pix)</option>
                  <option value="pago">Pago (Confirmado)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Observações (opcional)
                </label>
                <input
                  type="text"
                  value={formObs}
                  onChange={(e) => setFormObs(e.target.value)}
                  placeholder="Ex: Pagou em dinheiro, parente de fulano, etc."
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-[#0047cc] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalAdicionar(false)}
                  className="flex-1 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 rounded-xl bg-[#0047cc] hover:bg-[#003bb5] text-white py-2.5 text-xs font-bold transition-all cursor-pointer disabled:opacity-60"
                >
                  {formLoading ? 'Salvando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR PARTICIPANTE */}
      {participanteEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-black text-slate-900">Editar Participante</h3>
              <button
                onClick={() => setParticipanteEditando(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleSalvarEdicao} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-[#0047cc] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formWhatsApp}
                    onChange={(e) => setFormWhatsApp(formatWhatsApp(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-[#0047cc] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Idade *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={formIdade}
                    onChange={(e) => setFormIdade(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-[#0047cc] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Status do Pagamento
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-[#0047cc] focus:outline-none bg-white"
                >
                  <option value="pendente">Pendente (Aguardando Pix)</option>
                  <option value="pago">Pago (Confirmado)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Observações
                </label>
                <input
                  type="text"
                  value={formObs}
                  onChange={(e) => setFormObs(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 focus:border-[#0047cc] focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setParticipanteEditando(null)}
                  className="flex-1 rounded-xl border border-slate-300 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 rounded-xl bg-[#0047cc] hover:bg-[#003bb5] text-white py-2.5 text-xs font-bold transition-all cursor-pointer disabled:opacity-60"
                >
                  {formLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAÇÃO DE EXCLUSÃO */}
      {participanteExcluindo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-center">
            <div className="h-12 w-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">Excluir Participante?</h3>
            <p className="text-xs text-slate-600 mt-2">
              Você tem certeza que deseja remover <strong>{participanteExcluindo.nome}</strong>? Essa ação não pode ser desfeita.
            </p>

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={() => setParticipanteExcluindo(null)}
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

