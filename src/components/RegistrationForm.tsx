'use client';

import React, { useState } from 'react';
import { User, Phone, Sparkles, CheckCircle, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatWhatsApp, cleanPhone } from '@/lib/utils';
import { PixSection } from './PixSection';
import { Participante } from '@/types';

export function RegistrationForm() {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [idade, setIdade] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [inscricaoConcluida, setInscricaoConcluida] = useState<Participante | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setWhatsapp(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validações locais
    if (!nome.trim() || nome.trim().length < 3) {
      setErrorMsg('Por favor, informe seu nome completo.');
      return;
    }

    const cleanNum = cleanPhone(whatsapp);
    if (cleanNum.length < 10) {
      setErrorMsg('Por favor, digite um WhatsApp válido com DDD (ex: 21 99999-8888).');
      return;
    }

    const ageNum = parseInt(idade, 10);
    if (!idade || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setErrorMsg('Por favor, informe uma idade válida.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/participantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          whatsapp: cleanNum,
          idade: ageNum,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao realizar inscrição. Tente novamente.');
      }

      setInscricaoConcluida(data.participante);

      // Disparar confetes festivos
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0047cc', '#f59e0b', '#10b981'],
        });
      } catch (e) {
        // Ignora caso falhe no browser
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado ao registrar inscrição.');
    } finally {
      setLoading(false);
    }
  };

  const handleNovaInscricao = () => {
    setNome('');
    setWhatsapp('');
    setIdade('');
    setInscricaoConcluida(null);
    setErrorMsg(null);
  };

  // Se a inscrição já foi confirmada, exibe a tela de sucesso
  if (inscricaoConcluida) {
    return (
      <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="rounded-3xl border-2 border-emerald-400 bg-white p-6 sm:p-8 text-center shadow-xl">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner">
            <CheckCircle className="h-10 w-10" />
          </div>

          <span className="badge-tag bg-emerald-600 text-white text-xs mb-2">
            Inscrição Realizada!
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Glória a Deus, {inscricaoConcluida.nome.split(' ')[0]}!
          </h2>

          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            Sua vaga no <strong>DESPERTA</strong> está pré-reservada. Agora falta apenas a etapa final:
            efetuar o Pix de <strong>R$ 5,00</strong> e enviar o comprovante.
          </p>

          {/* Dados cadastrados */}
          <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left text-xs sm:text-sm text-slate-700 space-y-1.5">
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span className="text-slate-500 font-medium">Nome Completo:</span>
              <span className="font-bold text-slate-900">{inscricaoConcluida.nome}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5 pt-1">
              <span className="text-slate-500 font-medium">WhatsApp:</span>
              <span className="font-bold text-slate-900">{formatWhatsApp(inscricaoConcluida.whatsapp)}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500 font-medium">Idade:</span>
              <span className="font-bold text-slate-900">{inscricaoConcluida.idade} anos</span>
            </div>
          </div>

          {/* Pix e envio do comprovante */}
          <div className="mt-6 text-left">
            <PixSection participanteNome={inscricaoConcluida.nome} variant="embedded" />
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleNovaInscricao}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Fazer outra inscrição
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Formulário Principal */}
      <div className="rounded-3xl border-2 border-slate-200/90 bg-white/95 p-6 sm:p-8 shadow-xl backdrop-blur-xs">
        <div className="mb-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Faça sua Inscrição
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Preencha seus dados abaixo para garantir o seu lugar no Desperta.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nome Completo <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                id="nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Gabriel da Silva"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0047cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047cc]/20 transition-all font-medium"
              />
            </div>
          </div>

          {/* Whats & Idade Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Whats */}
            <div>
              <label htmlFor="whatsapp" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                WhatsApp <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="whatsapp"
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={handlePhoneChange}
                  placeholder="(21) 99999-8888"
                  maxLength={15}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0047cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047cc]/20 transition-all font-medium"
                />
              </div>
            </div>

            {/* Idade */}
            <div>
              <label htmlFor="idade" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Idade <span className="text-rose-500">*</span>
              </label>
              <input
                id="idade"
                type="number"
                required
                min={1}
                max={120}
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                placeholder="Ex: 22"
                className="w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0047cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047cc]/20 transition-all font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0047cc] to-[#1e40af] hover:from-[#003bb5] hover:to-[#172554] active:scale-[0.99] px-6 py-3.5 text-base font-black text-white shadow-lg shadow-blue-900/20 transition-all disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Confirmando inscrição...
              </span>
            ) : (
              <>
                <span>GARANTIR MINHA VAGA</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        {/* Informações Pix abaixo do formulário */}
        <PixSection />
      </div>
    </div>
  );
}

