'use client';

import React, { useState } from 'react';
import { Copy, Check, Send, AlertCircle, Sparkles } from 'lucide-react';
import { EVENT_INFO, buildWhatsAppLink } from '@/lib/utils';

interface PixSectionProps {
  participanteNome?: string;
  variant?: 'card' | 'embedded';
}

export function PixSection({ participanteNome, variant = 'card' }: PixSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EVENT_INFO.pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const whatsappMessage = participanteNome
    ? `Olá! Meu nome é ${participanteNome} e acabei de me inscrever no evento DESPERTA. Segue o comprovante do Pix de R$ 5,00!`
    : `Olá! Estou enviando o comprovante do Pix de R$ 5,00 para a inscrição do evento DESPERTA.`;

  const whatsappUrl = buildWhatsAppLink(EVENT_INFO.comprovanteWhats, whatsappMessage);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 border-amber-300/80 bg-gradient-to-b from-amber-50 to-orange-50/60 p-5 md:p-6 shadow-md ${
        variant === 'card' ? 'mt-6' : ''
      }`}
    >
      {/* Decorative tag */}
      <div className="flex items-center justify-between gap-2 border-b border-amber-200 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-xs shadow-sm">
            PIX
          </span>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            Pagamento da Inscrição
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold uppercase text-slate-500 block">Valor</span>
          <span className="text-xl md:text-2xl font-black text-amber-600 tracking-tight">
            R$ 5,00
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Chave Pix Box */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
            Chave Pix (Aleatória)
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-white/90 p-2.5 shadow-inner">
            <span className="flex-1 font-mono text-xs md:text-sm text-slate-800 break-all select-all font-semibold">
              {EVENT_INFO.pixKey}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className={`shrink-0 flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm hover:shadow'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copiar Chave
                </>
              )}
            </button>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="rounded-lg bg-amber-100/60 p-3 text-xs text-slate-700 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">Importante:</p>
            <p>
              Após realizar o Pix de <strong>R$ 5,00</strong>, envie o comprovante para o número{' '}
              <strong>(21) 97143-1212</strong> para confirmar sua vaga.
            </p>
          </div>
        </div>

        {/* Botão de Enviar Comprovante */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] px-4 py-3 text-center text-sm font-bold text-white shadow-md transition-all"
        >
          <Send className="h-4 w-4" />
          Enviar Comprovante no WhatsApp
        </a>
      </div>
    </div>
  );
}

