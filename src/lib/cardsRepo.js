// 카드 데이터 계층.
// Supabase env 가 설정돼 있으면 DB(REST API)를, 아니면 로컬 시드 데이터를 사용합니다.
//
// 주의: 처음에는 @supabase/supabase-js 를 썼는데 새 publishable key 포맷과 결합되어
// 브라우저에서 Headers.set 시 ISO-8859-1 범위 밖 문자가 들어가는 TypeError가
// 재현되어 supabase-js 의존을 제거하고 PostgREST REST API 를 직접 호출합니다.
import { CARDS as LOCAL_CARDS } from "../data/cards";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const configured = Boolean(url && anonKey);

export const usingSupabase = () => configured;

const fromRow = (r) => ({
  id: r.id,
  name: r.name,
  type: r.type,
  status: r.status,
  targets: r.targets || [],
  targetText: r.target_text || "",
  fee: r.fee || "",
  feemin: r.fee_min ?? null,
  summary: r.summary || "",
  cats: r.cats || [],
  rawcats: r.raw_cats || [],
  body: r.body || "",
  mdfile: r.source_file || "",
  pdfUrl: r.pdf_url || "",
  holder: r.holder || "",
});

const toRow = (c) => ({
  name: c.name,
  type: c.type,
  status: c.status,
  targets: c.targets || [],
  target_text: c.targetText || "",
  fee: c.fee || "",
  fee_min: c.feemin ?? null,
  summary: c.summary || "",
  cats: c.cats || [],
  raw_cats: c.rawcats?.length ? c.rawcats : c.cats || [],
  body: c.body || "",
  source_file: c.mdfile || null,
  pdf_url: c.pdfUrl || null,
  holder: c.holder || null,
});

async function rest(path, { method = "GET", body, prefer } = {}) {
  if (!configured) throw new Error("Supabase 가 설정되지 않았습니다.");
  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    Accept: "application/json",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (prefer) headers["Prefer"] = prefer;
  const res = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function loadCards() {
  if (!configured) {
    return [...LOCAL_CARDS].sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }
  const data = await rest("cards?select=*&order=name.asc");
  return data.map(fromRow);
}

export async function createCard(card) {
  const rows = await rest("cards", {
    method: "POST",
    body: toRow(card),
    prefer: "return=representation",
  });
  return fromRow(rows[0]);
}

export async function updateCard(id, card) {
  const rows = await rest(`cards?id=eq.${id}`, {
    method: "PATCH",
    body: toRow(card),
    prefer: "return=representation",
  });
  return fromRow(rows[0]);
}

export async function setCardStatus(id, status) {
  const rows = await rest(`cards?id=eq.${id}`, {
    method: "PATCH",
    body: { status },
    prefer: "return=representation",
  });
  return fromRow(rows[0]);
}

export async function deleteCard(id) {
  await rest(`cards?id=eq.${id}`, { method: "DELETE" });
}
