import React from 'react';
import Link from 'next/link';
import { EventHeader } from '@/components/EventHeader';
import { RegistrationForm } from '@/components/RegistrationForm';
import { MapPin } from 'lucide-react';
import { EVENT_INFO } from '@/lib/utils';

export default function HomePage() {
  return (
    <main className="min-h-screen pb-16 pt-2 bg-[#f7f4ec] text-slate-900 selection:bg-amber-300 selection:text-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Cabeçalho Visual com Estética do Cartaz */}
        <EventHeader />

        {/* Seção Central de Inscrição */}
        <div className="mt-6">
          <RegistrationForm />
        </div>

        {/* Cartaz e Detalhes da Paróquia */}
        <div className="max-w-xl mx-auto mt-10 rounded-3xl border border-slate-300/80 bg-white/80 p-5 shadow-sm text-center">
          <div className="flex items-center justify-center gap-2 mb-2 text-slate-700">
            <MapPin className="h-4 w-4 text-amber-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Onde vai acontecer?</h4>
          </div>
          <p className="text-sm font-extrabold text-slate-900">{EVENT_INFO.local}</p>
          <p className="text-xs text-slate-600 mt-0.5">{EVENT_INFO.endereco}</p>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Paróquia São Francisco de Assis • RCC</span>
            <Link
              href="/admin/login"
              className="font-semibold text-slate-400 hover:text-slate-700 transition-colors"
            >
              Área Administrativa
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
