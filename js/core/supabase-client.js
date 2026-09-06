import { CONFIG } from './config.js';
const { createClient } = window.supabase;

export const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
});

console.log('[Fendyx] ✅ Supabase conectado');
window.supabaseClient = supabase;
