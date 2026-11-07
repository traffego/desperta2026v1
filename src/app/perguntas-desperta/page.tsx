'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  HeartHandshake,
  Cross
} from 'lucide-react';
import confetti from 'canvas-confetti';

const OPCOES_SEXO = ['Feminino', 'Masculino', 'Outro / Prefiro não dizer'];

export default function PerguntasDespertaPage() {
  const [sexo, setSexo] = useState('');
  const [idade, setIdade] = useState('');
  const [pergunta, setPergunta] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [enviadoSucesso, setEnviadoSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!sexo) {
      setErrorMsg('Por favor, selecione seu sexo.');
      return;
    }

    const ageNum = parseInt(idade, 10);
    if (!idade || isNaN(ageNum) || ageNum < 5 || ageNum > 120) {
      setErrorMsg('Por favor, informe uma idade válida.');
      return;
    }

    if (!pergunta.trim() || pergunta.trim().length < 5) {
      setErrorMsg('Por favor, escreva a sua dúvida ou pergunta (ao menos 5 caracteres).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/perguntas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sexo,
          idade: ageNum,
          pergunta: pergunta.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar pergunta. Tente novamente.');
      }

      setEnviadoSucesso(true);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#f59e0b', '#10b981'],
        });
      } catch (err) {
        // Ignora em caso de browser restrito
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleNovaPergunta = () => {
    setPergunta('');
    setEnviadoSucesso(false);
    setErrorMsg(null);
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-amber-400 selection:text-black pb-16 pt-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-blue-950/30 via-indigo-950/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-60 right-10 w-72 h-72 bg-amber-500/5 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header Superior */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-zinc-800/80 border border-zinc-700/80 text-amber-400 mb-3 shadow-inner">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              DESPERTA 2026 • ESPAÇO CONFIDENCIAL
            </span>
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Caixa de Perguntas Anônimas
          </h1>

          <p className="mt-2 text-sm sm:text-base font-medium text-zinc-400">
            Dúvidas sinceras sobre <span className="text-blue-400 font-bold">Sexualidade</span>,{' '}
            <span className="text-amber-300 font-bold">Afetividade</span> e Vida Relacional.
          </p>
        </div>

        {/* Card Destaque: A Psicóloga e o Padre */}
        <div className="mb-6 rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/90 to-zinc-950 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle top indicator */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                  Segurança Máxima
                </span>
                <span className="text-sm font-bold text-white">100% Anônimo & Sem Julgamentos</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-700/60">
              Urna Digital
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Durante o encontro, teremos um momento muito aguardado onde{' '}
            <strong className="text-white font-extrabold">uma Psicóloga e um Padre</strong> responderão
            juntos e aleatoriamente às dúvidas enviadas nesta caixa.
          </p>

          {/* Grid dos dois profissionais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {/* Psicóloga */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-3.5 flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold shadow-sm">
                🧠
              </div>
              <div>
                <h2 className="text-xs font-black uppercase text-blue-400 tracking-wider">
                  A Psicóloga
                </h2>
                <p className="text-xs text-zinc-300 mt-0.5 leading-snug">
                  Acolhimento emocional, saúde mental, autoconhecimento e relacionamentos saudáveis.
                </p>
              </div>
            </div>

            {/* Padre */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3.5 flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-sm">
                ✝️
              </div>
              <div>
                <h2 className="text-xs font-black uppercase text-amber-400 tracking-wider">
                  O Padre
                </h2>
                <p className="text-xs text-zinc-300 mt-0.5 leading-snug">
                  Orientação espiritual, discernimento, fé e a visão do amor cristão e dos sacramentos.
                </p>
              </div>
            </div>
          </div>

          {/* Garantias de sigilo */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Nenhum dado pessoal registrado
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Sem rastreamento de IP
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Sorteio anônimo no palco
            </span>
          </div>
        </div>

        {/* TELA DE SUCESSO OU FORMULÁRIO */}
        {enviadoSucesso ? (
          <div className="rounded-3xl border border-emerald-500/50 bg-zinc-900/90 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-4 shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-2">
              Pergunta Registrada no Sigilo
            </span>

            <h3 className="text-2xl font-black text-white tracking-tight mt-1">
              Sua dúvida está guardada com segurança!
            </h3>

            <p className="mt-2 text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
              Obrigado pela sua coragem e confiança. A psicóloga e o padre farão a leitura e
              responderão às questões com todo o carinho e respeito durante o encontro.
            </p>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleNovaPergunta}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Fazer outra pergunta
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-300 transition-colors"
              >
                Voltar à página de inscrições
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            {errorMsg && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3.5 text-xs font-semibold text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Sexo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Qual é o seu sexo? <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {OPCOES_SEXO.map((item) => {
                    const isSelected = sexo === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSexo(item)}
                        className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/20'
                            : 'border-zinc-800 bg-zinc-950/80 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Idade */}
              <div>
                <label
                  htmlFor="idade"
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
                >
                  Sua Idade <span className="text-rose-400">*</span>
                </label>
                <input
                  id="idade"
                  type="number"
                  required
                  min={10}
                  max={120}
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  placeholder="Ex: 18"
                  className="w-full sm:w-48 rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium"
                />
              </div>

              {/* Pergunta */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="pergunta"
                    className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                  >
                    Sua Pergunta ou Desabafo <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-zinc-500">
                    {pergunta.length} / 1000 caracteres
                  </span>
                </div>
                <textarea
                  id="pergunta"
                  required
                  rows={5}
                  maxLength={1000}
                  value={pergunta}
                  onChange={(e) => setPergunta(e.target.value)}
                  placeholder="Escreva com total liberdade. Dúvidas sobre sexualidade, relacionamentos, pornografia, sentimentos, culpa, namoro, castidade, vocação, corpo..."
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm text-white placeholder-zinc-500 focus:border-blue-500 focus:bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-medium resize-y"
                />
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] px-6 py-3.5 text-base font-black text-white shadow-xl shadow-blue-600/25 transition-all disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Gravando na urna anônima...
                  </span>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>ENVIAR PERGUNTA 100% ANÔNIMA</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <Link href="/" className="hover:text-zinc-300 transition-colors">
                ← Voltar para inscrição no evento
              </Link>
              <span>Paróquia São Francisco de Assis</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
