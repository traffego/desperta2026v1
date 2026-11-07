'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const OPCOES_SEXO = ['Feminino', 'Masculino'];

// Idades de 12 a 64, finalizando em '65+'
const OPCOES_IDADE = [
  ...Array.from({ length: 53 }, (_, i) => (i + 12).toString()),
  '65+',
];

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
      setErrorMsg('Por favor, selecione seu sexo (Feminino ou Masculino).');
      return;
    }

    if (!idade) {
      setErrorMsg('Por favor, selecione sua idade.');
      return;
    }

    if (!pergunta.trim() || pergunta.trim().length < 5) {
      setErrorMsg('Por favor, escreva a sua dúvida ou pergunta (mínimo de 5 caracteres).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/perguntas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sexo,
          idade,
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
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#a1a1aa', '#71717a'],
        });
      } catch (err) {
        // Ignora caso restrito
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
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black pb-20 pt-10 relative">
      {/* Luz sutil no topo para profundidade moderna */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-72 pointer-events-none opacity-40 blur-3xl -z-10"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(255, 255, 255, 0.15), transparent 70%)',
        }}
      />

      <div className="max-w-xl mx-auto px-4 sm:px-6">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase bg-white/5 border border-white/10 text-zinc-300 mb-3">
            <Lock className="h-3 w-3 text-zinc-400" />
            <span>DESPERTA 2026 • ESPAÇO CONFIDENCIAL</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Perguntas Anônimas
          </h1>

          <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 font-normal">
            Dúvidas sinceras sobre Sexualidade, Afetividade e Relacionamentos.
          </p>
        </div>

        {/* Card Destaque: A Psicóloga e o Padre */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl p-5 sm:p-6 shadow-2xl">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/5 mb-3.5">
            <ShieldCheck className="h-4 w-4 text-zinc-400" />
            <span className="text-xs font-semibold tracking-wide text-zinc-200">
              100% Anônimo, Seguro e Confidencial
            </span>
          </div>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Durante o encontro, teremos um momento dedicado onde{' '}
            <strong className="text-zinc-200 font-semibold">uma Psicóloga e um Padre</strong>{' '}
            responderão juntos e aleatoriamente às dúvidas enviadas. Nenhum dado pessoal é registrado.
          </p>

          {/* Grid dos Dois Profissionais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
            {/* Psicóloga */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-5 w-5 rounded-md bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                  Ψ
                </span>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  A Psicóloga
                </h2>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Acolhimento emocional, saúde mental, autoconhecimento e relacionamentos saudáveis.
              </p>
            </div>

            {/* Padre */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="h-5 w-5 rounded-md bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
                  †
                </span>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                  O Padre
                </h2>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Orientação espiritual, discernimento, fé e a visão cristã do amor e da moral.
              </p>
            </div>
          </div>
        </div>

        {/* TELA DE SUCESSO OU FORMULÁRIO */}
        {enviadoSucesso ? (
          <div className="rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl p-8 sm:p-10 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Ícone Minimalista Centralizado */}
            <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white shadow-inner">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            {/* Badge Centralizado */}
            <div className="mb-3">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/5 border border-white/10 text-zinc-300">
                Pergunta Registrada no Sigilo
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Sua dúvida foi enviada com sucesso!
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Obrigado pela sua confiança. A psicóloga e o padre farão a leitura e responderão às
              questões selecionadas durante o encontro.
            </p>

            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleNovaPergunta}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-200 text-black px-5 py-2.5 text-xs font-bold transition-all cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Fazer outra pergunta</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            {errorMsg && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-white/20 bg-zinc-900 p-3.5 text-xs text-zinc-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-white mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Sexo (Apenas Feminino e Masculino) */}
              <div>
                <label className="block text-xs font-semibold tracking-wide text-zinc-300 mb-2">
                  Qual é o seu sexo? <span className="text-zinc-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {OPCOES_SEXO.map((item) => {
                    const isSelected = sexo === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSexo(item)}
                        className={`py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'border-white bg-white text-black font-bold shadow-md'
                            : 'border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Idade (Select até 65+) */}
              <div>
                <label
                  htmlFor="idade"
                  className="block text-xs font-semibold tracking-wide text-zinc-300 mb-1.5"
                >
                  Sua Idade <span className="text-zinc-500">*</span>
                </label>
                <select
                  id="idade"
                  required
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  className="w-full sm:w-56 rounded-xl border border-white/10 bg-zinc-900 px-3.5 py-2.5 text-xs sm:text-sm text-white focus:border-white/30 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled className="bg-zinc-900 text-zinc-500">
                    Selecione sua idade...
                  </option>
                  {OPCOES_IDADE.map((opcao) => (
                    <option key={opcao} value={opcao} className="bg-zinc-900 text-white">
                      {opcao.includes('+') ? `${opcao} anos` : `${opcao} anos`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pergunta */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="pergunta"
                    className="block text-xs font-semibold tracking-wide text-zinc-300"
                  >
                    Sua Pergunta ou Desabafo <span className="text-zinc-500">*</span>
                  </label>
                  <span className="text-[11px] text-zinc-500">{pergunta.length} / 1000</span>
                </div>
                <textarea
                  id="pergunta"
                  required
                  rows={5}
                  maxLength={1000}
                  value={pergunta}
                  onChange={(e) => setPergunta(e.target.value)}
                  placeholder="Escreva livremente sua dúvida sobre relacionamentos, sentimentos, corpo, culpa, namoro, castidade ou vivência da fé..."
                  className="w-full rounded-xl border border-white/10 bg-zinc-900/80 p-3.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:border-white/30 focus:outline-none transition-all resize-y"
                />
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-200 active:scale-[0.99] px-5 py-3 text-xs sm:text-sm font-bold text-black shadow-lg transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24">
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
                    Enviando anonimamente...
                  </span>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    <span>ENVIAR PERGUNTA 100% ANÔNIMA</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
