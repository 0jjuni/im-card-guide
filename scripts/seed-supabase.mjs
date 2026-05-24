// 로컬 카드 데이터(src/data/cards.js)를 Supabase cards 테이블에 적재합니다.
// 실행 전: supabase/schema.sql 을 먼저 실행해 테이블을 만들어 두세요.
// 실행: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수 설정 후  npm run seed
import { createClient } from "@supabase/supabase-js";
import { CARDS } from "../src/data/cards.js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "환경변수 SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY 가 필요합니다.\n" +
      ".env 에 값을 넣고 다시 실행하세요."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

const rows = CARDS.map((c) => ({
  name: c.name,
  type: c.type,
  status: c.status || "판매중",
  targets: c.targets || [],
  target_text: c.targetText || "",
  fee: c.fee || "",
  fee_min: c.feemin ?? null,
  summary: c.summary || "",
  cats: c.cats || [],
  raw_cats: c.rawcats || [],
  body: c.body || "",
  source_file: c.mdfile || null,
}));

console.log(`${rows.length}개 카드를 Supabase 에 적재합니다...`);

// 100개씩 나눠 삽입
let inserted = 0;
for (let i = 0; i < rows.length; i += 100) {
  const chunk = rows.slice(i, i + 100);
  const { error } = await supabase.from("cards").insert(chunk);
  if (error) {
    console.error("삽입 실패:", error.message);
    process.exit(1);
  }
  inserted += chunk.length;
  console.log(`  ${inserted}/${rows.length}`);
}

console.log("시드 완료.");
