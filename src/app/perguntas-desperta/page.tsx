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

// Gera idades de 12 a 64, terminando em '65+'
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
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#a1a1aa', '#52525b'],
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
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black pb-16 pt-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-300 mb-4">
              <Lock className="h-3 w-3 text-white" />
              DESPERTA 2026 • ESPAÇO CONFIDENCIAL
            </span>
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Caixa de Perguntas Anônimas
          </h1>

          <p className="mt-2 text-sm sm:text-base font-normal text-zinc-400">
            Dúvidas sobre Sexualidade, Afetividade e Vida Relacional.
          </p>
        </div>

        {/* Card Destaque: Anonimato + Psicóloga e Padre */}
        <div className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-zinc-800/80 pb-4 mb-4">
            <div className="h-9 w-9 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block">
                Sigilo Absoluto
              </span>
              <h2 className="text-sm font-bold text-white">100% Anônimo, Seguro e Confidencial</h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Durante o encontro, teremos um momento dedicado onde{' '}
            <strong className="text-white font-bold">uma Psicóloga e um Padre</strong> responderão
            juntos e aleatoriamente às perguntas enviadas neste canal. Nenhum dado pessoal é coletado.
          </p>

          {/* Grid dos Dois Profissionais (Monocromático Moderno) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {/* Psicóloga */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-6 w-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-black text-white">
                  Ψ
                </span>
                <h3 className="text-xs font-black uppercase text-white tracking-wider">
                  A Psicóloga
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-snug">
                Acolhimento emocional, saúde mental, autoconhecimento e relacionamentos saudáveis.
              </p>
            </div>

            {/* Padre */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-6 w-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-black text-white">
                  †
                </span>
                <h3 className="text-xs font-black uppercase text-white tracking-wider">
                  O Padre
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-snug">
                Orientação espiritual, fé, discernimento e a visão cristã do amor e da moral.
              </p>
            </div>
          </div>

          {/* Garantias de Sigilo */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Sem coleta de nome ou contato
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Sem rastreamento de IP ou dispositivo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Sorteio aleatório no palco
            </span>
          </div>
        </div>

        {/* TELA DE SUCESSO OU FORMULÁRIO */}
        {enviadoSucesso ? (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 border border-zinc-700 text-white mb-4 shadow-inner">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-zinc-900 border border-zinc-700 text-zinc-300 mb-2">
              Pergunta Registrada no Sigilo
            </span>

            <h3 className="text-2xl font-black text-white tracking-tight mt-1">
              Sua dúvida foi enviada com sucesso!
            </h3>

            <p className="mt-2 text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Obrigado pela sua confiança. A psicóloga e o padre farão a leitura e responderão às
              questões selecionadas durante o encontro.
            </p>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleNovaPergunta}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-200 text-black px-5 py-2.5 text-xs font-bold transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Fazer outra pergunta
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 px-5 py-2.5 text-xs font-bold text-zinc-300 transition-colors"
              >
                Voltar ao início
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl">
            {errorMsg && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-zinc-700 bg-zinc-900 p-3.5 text-xs font-semibold text-zinc-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-white mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Sexo (Apenas Feminino e Masculino) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Qual é o seu sexo? <span className="text-zinc-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {OPCOES_SEXO.map((item) => {
                    const isSelected = sexo === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSexo(item)}
                        className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'border-white bg-white text-black shadow-md'
                            : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700 hover:text-white'
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
                  className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5"
                >
                  Sua Idade <span className="text-zinc-500">*</span>
                </label>
                <select
                  id="idade"
                  required
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                  className="w-full sm:w-60 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-white focus:outline-none transition-all font-medium cursor-pointer"
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
                    className="block text-xs font-bold uppercase tracking-wider text-zinc-300"
                  >
                    Sua Pergunta ou Desabafo <span className="text-zinc-500">*</span>
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
                  placeholder="Escreva com total liberdade. Dúvidas sobre sexualidade, relacionamentos, culpa, namoro, castidade, sentimentos, corpo ou vivência cristã..."
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none transition-all font-medium resize-y"
                />
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-zinc-200 active:scale-[0.99] px-6 py-3.5 text-base font-black text-black shadow-xl transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-black" viewBox="0 0 24 24">
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
