'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Users, HelpCircle, LogOut } from 'lucide-react';

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Erro no logout:', err);
    }
  };

  const isParticipantes = pathname === '/admin';
  const isPerguntas = pathname.startsWith('/admin/perguntas-desperta');

  return (
    <nav className="border-b border-slate-200 bg-white/95 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="badge-tag text-[10px]">ADMIN</span>
            <span className="text-base font-black text-slate-900 tracking-tight hidden sm:inline">
              DESPERTA 2026
            </span>
          </Link>

          {/* Nav Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isParticipantes
                  ? 'bg-white text-[#0047cc] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Inscrições</span>
            </Link>

            <Link
              href="/admin/perguntas-desperta/perguntas"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isPerguntas
                  ? 'bg-white text-[#0047cc] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Perguntas Anônimas</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

