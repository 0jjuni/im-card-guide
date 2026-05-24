// 카드 데이터 계층.
// Supabase 가 설정돼 있으면 DB 를, 아니면 로컬 시드 데이터(src/data/cards.js)를 사용합니다.
import { supabase } from "./supabase";
import { CARDS as LOCAL_CARDS } from "../data/cards";

export const usingSupabase = () => Boolean(supabase);

// Supabase row -> 앱 카드 객체
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
});

// 앱 카드 객체 -> Supabase row
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
});

export async function loadCards() {
  if (!supabase) {
    return [...LOCAL_CARDS].sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data.map(fromRow);
}

export async function createCard(card) {
  if (!supabase) throw new Error("Supabase 가 설정되지 않았습니다.");
  const { data, error } = await supabase
    .from("cards")
    .insert(toRow(card))
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateCard(id, card) {
  if (!supabase) throw new Error("Supabase 가 설정되지 않았습니다.");
  const { data, error } = await supabase
    .from("cards")
    .update(toRow(card))
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function setCardStatus(id, status) {
  if (!supabase) throw new Error("Supabase 가 설정되지 않았습니다.");
  const { data, error } = await supabase
    .from("cards")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function deleteCard(id) {
  if (!supabase) throw new Error("Supabase 가 설정되지 않았습니다.");
  const { error } = await supabase.from("cards").delete().eq("id", id);
  if (error) throw error;
}
