import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { AdminDashboard } from '@/components/AdminDashboard';

export const metadata = {
  title: 'Painel Administrativo | DESPERTA',
};

async function AdminContent() {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    redirect('/admin/login');
  }

  return <AdminDashboard />;
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f4ec] flex items-center justify-center font-bold text-slate-500">
          Carregando painel...
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
