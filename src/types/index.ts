export interface Participante {
  id: string;
  nome: string;
  whatsapp: string;
  idade: number;
  status_pagamento: string;
  observacoes?: string | null;
  created_at: string;
}

export type NovoParticipanteInput = {
  nome: string;
  whatsapp: string;
  idade: number;
  observacoes?: string;
};

