import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 환경변수가 없으면 null — 이 경우 앱은 로컬 데이터(src/data/cards.js)로 동작합니다.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const isSupabaseConfigured = () => Boolean(supabase);
