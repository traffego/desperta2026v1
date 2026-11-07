import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { AdminPerguntas } from '@/components/AdminPerguntas';

export const metadata = {
  title: 'Perguntas Anônimas | DESPERTA 2026',
};

async function AdminPerguntasContent() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect('/admin/login');
  }

  return <AdminPerguntas />;
}

export default function AdminPerguntasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f4ec] flex items-center justify-center font-bold text-slate-500">
          Carregando perguntas anônimas...
        </div>
      }
    >
      <AdminPerguntasContent />
    </Suspense>
  );
}

