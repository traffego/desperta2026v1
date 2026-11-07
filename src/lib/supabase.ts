import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wqnqauuweuizvpdylrxc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxbnFhdXV3ZXVpenZwZHlscnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM5ODYyNzQsImV4cCI6MjEwOTU2MjI3NH0.yICjrn3CMIPSO1iS7sCCHtrEF3pTpr9CAQb7jFcTWcE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
