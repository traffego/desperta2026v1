'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Senha incorreta.');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f4ec] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <span className="badge-tag text-xs mb-2">DESPERTA 2026</span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Painel Administrativo</h1>
          </Link>
          <p className="text-xs text-slate-500 mt-1">Acesso exclusivo para a coordenação do evento</p>
        </div>

        <div className="rounded-3xl border border-slate-300/80 bg-white p-6 sm:p-8 shadow-xl">
          {errorMsg && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha administrativa"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50/50 pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0047cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0047cc]/20 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] px-4 py-3 text-sm font-bold text-white shadow-md transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                'Acessando...'
              ) : (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← Voltar para a página de inscrição
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

