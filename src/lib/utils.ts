export function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : '';
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function cleanPhone(value: string): string {
  return value.replace(/\D/g, '');
}

export function buildWhatsAppLink(phone: string, text: string): string {
  const digits = cleanPhone(phone);
  // Ensure country code 55 if not already present or if local 10/11 digits
  const fullPhone = digits.startsWith('55') && digits.length >= 12 ? digits : `55${digits}`;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(text)}`;
}

export const EVENT_INFO = {
  nome: 'DESPERTA',
  tema: 'Lázaro, vem pra fora! (Jo 11,43)',
  data: '29 de Novembro',
  dataCurta: '29/11',
  horario: 'A partir das 07:30 (com a Santa Missa)',
  local: 'Paróquia São Francisco de Assis',
  endereco: 'Rua Tangará, 431 - Jd Alzira, Queimados - RJ',
  valor: 'R$ 5,00',
  valorNumerico: 5.0,
  pixKey: process.env.NEXT_PUBLIC_PIX_KEY || '10ba6099-17e3-4b0a-a53a-363e17bfe295',
  pixBeneficiario: 'Paróquia São Francisco de Assis / Desperta',
  comprovanteWhats: process.env.NEXT_PUBLIC_COMPROVANTE_WHATSAPP || '21971431212',
};

