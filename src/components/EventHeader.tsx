import React from 'react';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import Image from 'next/image';

export function EventHeader() {
  return (
    <header className="relative overflow-hidden pt-6 pb-4 px-4 text-center">
      {/* Top Organization Badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-700 uppercase tracking-wider mb-5">
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
          <span className="text-blue-700 font-extrabold">RCC</span>
          <span className="text-slate-400">•</span>
          <span>Diocese de Nova Iguaçu</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200/80 shadow-xs">
          <span>Paróquia São Francisco de Assis</span>
          <span className="text-slate-400">•</span>
          <span className="text-amber-600">Queimados</span>
        </div>
      </div>

      {/* Main Title Group inspired by poster brushwork */}
      <div className="relative inline-block max-w-xl mx-auto my-2">
        {/* Crown doodle (SVG) */}
        <div className="absolute -top-6 left-2 sm:-top-7 sm:left-6 text-amber-500 transform -rotate-12 select-none pointer-events-none">
          <svg
            className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm fill-amber-400 stroke-amber-500"
            viewBox="0 0 24 24"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
          </svg>
        </div>

        {/* Cross doodles */}
        <span className="absolute -top-1 right-2 sm:right-6 text-xl font-black text-slate-800 rotate-12 select-none">
          ✕
        </span>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase leading-[0.95]">
          DESPERTA
        </h1>

        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-1.5 flex-wrap">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0047cc] italic tracking-tight font-serif">
            TU QUE
          </span>
          <span className="brush-stroke-yellow text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tight px-3 py-0.5">
            DORMES
          </span>
        </div>

        {/* Theme badge */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="badge-tag text-xs font-black">TEMA:</span>
          <p className="text-sm sm:text-base font-bold text-[#0047cc] italic">
            LÁZARO, VEM PRA FORA! <span className="text-xs text-slate-600 font-normal">(JO 11, 43)</span>
          </p>
        </div>

        {/* Subtitle quote callout */}
        <div className="mt-3 inline-block rounded-xl bg-blue-900/90 text-white px-4 py-2 text-xs sm:text-sm font-semibold shadow-md transform rotate-[-0.5deg]">
          <span>&ldquo;Jesus ainda hoje te chama pelo nome. </span>
          <strong className="text-amber-300 font-extrabold uppercase">Vem pra fora!&rdquo;</strong>
        </div>
      </div>

      {/* Event Details Grid (Cards) */}
      <div className="max-w-2xl mx-auto mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-left">
        {/* Dia */}
        <div className="rounded-xl border border-slate-200/90 bg-white/90 p-3 shadow-xs flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-600 block uppercase">Dia</span>
            <span className="text-sm font-black text-slate-900">29/11</span>
          </div>
        </div>

        {/* Horário */}
        <div className="rounded-xl border border-slate-200/90 bg-white/90 p-3 shadow-xs flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-600 block uppercase">Início</span>
            <span className="text-xs font-bold text-slate-900 leading-tight block">
              07:30 <span className="text-[10px] font-normal text-slate-600 block">Com a Missa</span>
            </span>
          </div>
        </div>

        {/* Local */}
        <div className="rounded-xl border border-slate-200/90 bg-white/90 p-3 shadow-xs flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-600 block uppercase">Local</span>
            <span className="text-xs font-bold text-slate-900 leading-tight block truncate">
              São Francisco
              <span className="text-[10px] font-normal text-slate-600 block truncate">Queimados</span>
            </span>
          </div>
        </div>

        {/* Inscrição */}
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50/80 p-3 shadow-xs flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold">
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-800 block uppercase">Inscrição</span>
            <span className="text-sm font-black text-amber-700">R$ 5,00</span>
          </div>
        </div>
      </div>
    </header>
  );
}

