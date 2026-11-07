'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Heart,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  HelpCircle
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
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0047cc', '#f59e0b', '#ec4899'],
        });
      } catch (err) {
        // Ignora caso de browser restrito
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
    <main className="min-h-screen pb-16 pt-6 bg-[#f7f4ec] text-slate-900 selection:bg-amber-300 selection:text-slate-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Top Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block hover:opacity-85 transition-opacity">
            <span className="badge-tag text-[11px] mb-2">DESPERTA 2026</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight mt-1">
            Espaço de Escuta Anônima
          </h1>

          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-sm sm:text-base font-bold text-[#0047cc] italic">
              Sexualidade & Afetividade
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              Momento com a Psicóloga
            </span>
          </div>
        </div>

        {/* Banner Explicativo da Psicóloga / Anonimato */}
        <div className="mb-6 rounded-3xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-50 via-white to-orange-50/70 p-5 sm:p-6 shadow-md">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                100% Anônimo, Seguro e Confidencial
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
                Durante o encontro <strong>DESPERTA</strong>, teremos a presença de uma <strong>psicóloga</strong> que responderá de forma <strong>aleatória e totalmente anônima</strong> às perguntas e dúvidas sobre <em>afetividade, relacionamentos, corpo e sexualidade</em> enviadas aqui.
              </p>
              <p className="mt-2 text-xs font-semibold text-amber-900 bg-amber-100/70 inline-block px-2.5 py-1 rounded-lg">
                🔒 Não coletamos nome, telefone ou nenhum dado de identificação. Sinta-se livre para perguntar!
              </p>
            </div>
          </div>
        </div>

        {/* TELA DE SUCESSO OU FORMULÁRIO */}
        {enviadoSucesso ? (
          <div className="rounded-3xl border-2 border-emerald-400 bg-white p-6 sm:p-8 text-center shadow-xl animate-in fade-in zoom-in-95 duration-300">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <span className="badge-tag bg-emerald-600 text-white text-xs mb-2">
              Pergunta Enviada!
            </span>

            <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Sua dúvida está guardada com segurança!
            </h3>

            <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
              Muito obrigado por compartilhar. Sua pergunta poderá ser sorteada e respondida com todo o carinho e acolhimento pela nossa psicóloga durante o evento.
            </p>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleNovaPergunta}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0047cc] hover:bg-[#003bb5] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Fazer outra pergunta
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 transition-colors"
              >
                Voltar à página de inscrições
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-slate-200/90 bg-white/95 p-6 sm:p-8 shadow-xl">
            {errorMsg && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Sexo */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Qual é o seu sexo? <span className="text-rose-500">*</span>
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
                            ? 'border-[#0047cc] bg-[#0047cc] text-white shadow-md shadow-blue-900/20'
                            : 'border-slate-300 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
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
                <label htmlFor="idade" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Sua Idade <span className="text-rose-500">*</span>
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
                  className="w-full sm:w-48 rounded-xl border border-slate-300 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0047cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047cc]/20 transition-all font-medium"
                />
              </div>

              {/* Pergunta */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="pergunta" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Sua Pergunta ou Dúvida <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] font-semibold text-slate-400">
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
                  placeholder="Escreva livremente aqui o que você gostaria de perguntar ou desabafar sobre relacionamentos, sentimentos, sexualidade, dúvidas sobre a fé e o corpo..."
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50/50 p-4 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0047cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047cc]/20 transition-all font-medium resize-y"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0047cc] to-[#1e40af] hover:from-[#003bb5] hover:to-[#172554] active:scale-[0.99] px-6 py-3.5 text-base font-black text-white shadow-lg shadow-blue-900/20 transition-all disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Enviando anonimamente...
                  </span>
                ) : (
                  <>
                    <span>ENVIAR PERGUNTA ANONIMAMENTE</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Link href="/" className="hover:text-slate-800 transition-colors">
                ← Voltar para inscrição
              </Link>
              <span>Paróquia São Francisco de Assis</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

