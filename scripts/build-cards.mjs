// content/cards/*.md → src/data/cards.js, src/data/filters.js 생성기
// 실행: npm run data
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MD_DIR = join(ROOT, "content", "cards");
const DATA_DIR = join(ROOT, "src", "data");

marked.setOptions({ gfm: true, breaks: false });

const CANON_RULES = [
  ["주유", ["주유"]],
  ["교통", ["교통", "버스", "지하철", "하이패스", "후불"]],
  ["카페", ["커피", "카페"]],
  ["외식·배달", ["외식", "배달", "음식", "맛집", "베이커리"]],
  ["편의점", ["편의점"]],
  ["쇼핑", ["쇼핑", "백화점", "마트", "홈쇼핑"]],
  ["영화·OTT", ["영화", "OTT", "스트리밍", "문화", "공연", "도서"]],
  ["레저", ["놀이공원", "레저", "워터파크", "테마파크"]],
  ["통신", ["통신"]],
  ["여행·항공", ["마일리지", "항공", "여행", "호텔", "공항", "렌터카", "면세"]],
  ["캐시백", ["캐시백"]],
  ["포인트", ["포인트", "적립"]],
  ["무이자할부", ["할부"]],
  ["골프·스포츠", ["골프", "스포츠"]],
  ["해외", ["해외"]],
  ["병원·펫", ["병원", "펫", "동물"]],
  ["교육", ["교육", "학자금", "등록금", "학교"]],
  ["보험", ["보험"]],
  ["법인·복지전용", ["법인", "복지", "클린", "연구비", "기업", "전용"]],
];

const BIZ_KW = ["soho", "소호", "biz", "비즈", "사업자", "소상공인", "자영업", "개인사업"];

function parseFront(text) {
  const m = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!m) return [{}, text];
  const d = {};
  for (const line of m[1].split(/\r?\n/)) {
    const i = line.indexOf(":");
    if (i > 0) d[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return [d, m[2]];
}

function normType(t) {
  if (!t) return "기타";
  if (t.includes("법인")) return "법인카드";
  if (t.trim().startsWith("체크")) return "체크카드";
  if (t.trim().startsWith("신용")) return "신용카드";
  return "기타";
}

function splitTags(s) {
  if (!s) return [];
  s = s.trim();
  if (s.startsWith("[")) s = s.slice(1);
  if (s.endsWith("]")) s = s.slice(0, -1);
  return s
    .split(",")
    .map((x) => x.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

function canonCats(raw) {
  return CANON_RULES.filter(([, kws]) =>
    raw.some((t) => kws.some((kw) => t.includes(kw)))
  ).map(([n]) => n);
}

function deriveTargets(name, type, targetText) {
  const s = (name + " " + targetText).toLowerCase();
  const out = new Set();
  if (type === "법인카드") {
    out.add("법인");
    if (BIZ_KW.some((k) => s.includes(k))) out.add("개인사업자");
  } else if (type === "신용카드" || type === "체크카드") {
    out.add("개인");
    if (BIZ_KW.some((k) => s.includes(k))) out.add("개인사업자");
  } else {
    out.add("개인");
  }
  return [...out].sort();
}

function feeNum(x) {
  const m = (x || "").match(/\d[\d,]*/);
  return m ? parseInt(m[0].replace(/,/g, ""), 10) : null;
}

const files = readdirSync(MD_DIR)
  .filter((f) => f.endsWith(".md"))
  .sort();

const cards = [];
for (const f of files) {
  const text = readFileSync(join(MD_DIR, f), "utf-8");
  const [fm, body] = parseFront(text);
  const name = fm["카드명"] || f.replace(/\.md$/, "");
  const type = normType(fm["카드종류"]);
  const rawcats = splitTags(fm["혜택카테고리"]);
  const targetText = fm["발급대상"] || "문서상 명시 없음";
  const body2 = body.replace(/^\s*#\s+.*?\r?\n/, "");
  const fd = feeNum(fm["연회비_국내전용"]);
  const fi = feeNum(fm["연회비_국내외겸용"]);
  const feeParts = [];
  if (fd != null) feeParts.push("국내전용 " + fd.toLocaleString("ko-KR") + "원");
  if (fi != null) feeParts.push("국내외겸용 " + fi.toLocaleString("ko-KR") + "원");
  const feemins = [fd, fi].filter((x) => x != null);
  cards.push({
    name,
    type,
    status: "판매중",
    targets: deriveTargets(name, type, targetText),
    targetText,
    fee: feeParts.length ? feeParts.join(" / ") : "문서 참조",
    feemin: feemins.length ? Math.min(...feemins) : null,
    summary: fm["대표혜택"] || "",
    cats: canonCats(rawcats),
    rawcats,
    mdfile: f,
    body: marked.parse(body2),
  });
}

cards.sort((a, b) => a.name.localeCompare(b.name, "ko"));
cards.forEach((c, i) => (c.id = i));

const count = (key) => {
  const d = {};
  for (const c of cards)
    for (const v of Array.isArray(c[key]) ? c[key] : [c[key]])
      d[v] = (d[v] || 0) + 1;
  return d;
};
const catCount = count("cats");
const typeCount = count("type");
const targetCount = count("targets");
const statusCount = count("status");

const catOrder = CANON_RULES.map(([n]) => n).filter((n) => catCount[n]);
const typeOrder = ["신용카드", "체크카드", "법인카드", "기타"].filter(
  (t) => typeCount[t]
);
const targetOrder = ["개인", "개인사업자", "법인"].filter((t) => targetCount[t]);

const HEADER =
  "// 자동 생성 — content/cards/*.md 기반. 재생성: npm run data\n\n";

writeFileSync(
  join(DATA_DIR, "cards.js"),
  HEADER + "export const CARDS = " + JSON.stringify(cards) + ";\n"
);

writeFileSync(
  join(DATA_DIR, "filters.js"),
  HEADER +
    "export const CARD_TYPES = " +
    JSON.stringify(
      typeOrder.map((t) => ({ id: t, label: t, count: typeCount[t] }))
    ) +
    ";\n\nexport const TARGET_TYPES = " +
    JSON.stringify(
      targetOrder.map((t) => ({ id: t, label: t, count: targetCount[t] }))
    ) +
    ";\n\nexport const BENEFIT_CATEGORIES = " +
    JSON.stringify(catOrder.map((n) => ({ name: n, count: catCount[n] }))) +
    ";\n\nexport const STATUSES = " +
    JSON.stringify(
      Object.keys(statusCount).map((s) => ({ id: s, count: statusCount[s] }))
    ) +
    ";\n"
);

console.log(
  "생성 완료: 카드 " +
    cards.length +
    "개 · 종류 " +
    typeOrder.length +
    " · 발급대상 " +
    targetOrder.length +
    " · 혜택 " +
    catOrder.length
);
