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

export interface PerguntaAnonima {
  id: string;
  sexo: string; // 'Feminino' | 'Masculino'
  idade: string; // ex: '18', '65+'
  pergunta: string;
  status: string; // 'pendente' | 'selecionada' | 'respondida'
  created_at: string;
}

export type NovaPerguntaInput = {
  sexo: string;
  idade: string;
  pergunta: string;
};
