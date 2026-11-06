import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'desperta_admin_session';
const SESSION_TOKEN = 'auth_session_desperta_2026_granted';

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'Desperta2026444#';
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return session?.value === SESSION_TOKEN;
}

export const ADMIN_COOKIE_CONFIG = {
  name: ADMIN_COOKIE_NAME,
  token: SESSION_TOKEN,
};
