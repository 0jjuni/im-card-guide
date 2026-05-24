import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 환경변수가 없으면 null — 이 경우 앱은 로컬 데이터(src/data/cards.js)로 동작합니다.
// Auth/Realtime 비활성화: 이 앱은 카드 read/write 만 사용하며, 자동 초기화된 Auth
// 스토리지 어댑터가 브라우저 locale 등 비-ASCII 값을 헤더에 넣어 fetch가 실패하는
// 케이스(Failed to execute 'set' on 'Headers': non ISO-8859-1)를 회피합니다.
export const supabase = url && anonKey
  ? createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

export const isSupabaseConfigured = () => Boolean(supabase);
