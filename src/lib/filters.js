// 필터 도메인 — 카드 배열에서 실시간으로 구성합니다.
// (자동 생성 파일이 아닌, 카드 데이터에서 계산되는 도우미)

export const HOLDERS = [
  { id: "개인", label: "개인 카드" },
  { id: "기업", label: "기업 카드" },
];

export const BRANDS = [
  { id: "BC국내전용", label: "BC 국내전용" },
  { id: "BC글로벌", label: "BC 글로벌" },
  { id: "VISA", label: "VISA" },
  { id: "MASTER", label: "MASTER" },
  { id: "UnionPay", label: "UnionPay" },
  { id: "JCB", label: "JCB" },
  { id: "AMEX", label: "AMEX" },
];

export const TYPES = [
  { id: "신용카드", label: "신용카드" },
  { id: "체크카드", label: "체크카드" },
  { id: "기타", label: "기타" },
];

// 연회비 구간 — fee_min(원) 기준. min 이상 max 미만.
export const FEE_BUCKETS = [
  { id: "free", label: "무료", min: 0, max: 1 },
  { id: "le10k", label: "1만원 이하", min: 1, max: 10001 },
  { id: "1to5", label: "1~5만원", min: 10001, max: 50001 },
  { id: "gt5", label: "5만원 초과", min: 50001, max: Infinity },
];

export function matchesHolder(card, selected) {
  if (!selected.length) return true;
  if (!card.holder) return false;
  const cardHolders = card.holder.split(",").map((s) => s.trim());
  return selected.some((s) => cardHolders.includes(s));
}

export function matchesBrands(card, selected) {
  if (!selected.length) return true;
  const cardBrands = card.brands || [];
  return selected.some((b) => cardBrands.includes(b));
}

export function matchesFee(card, selected) {
  if (!selected.length) return true;
  if (card.feemin == null) return false;
  return selected.some((bucketId) => {
    const b = FEE_BUCKETS.find((x) => x.id === bucketId);
    return b && card.feemin >= b.min && card.feemin < b.max;
  });
}

// 카드 배열로부터 각 필터 옵션의 count 를 계산
export function buildFilterCounts(cards) {
  const holders = {};
  const types = {};
  const fees = {};
  const cats = {};
  const brands = {};
  for (const c of cards) {
    if (c.status === "단종") continue; // 단종은 기본 숨김이므로 카운트에서 제외
    if (c.holder) {
      for (const h of c.holder.split(",").map((s) => s.trim())) {
        holders[h] = (holders[h] || 0) + 1;
      }
    }
    if (c.type) types[c.type] = (types[c.type] || 0) + 1;
    if (c.feemin != null) {
      for (const b of FEE_BUCKETS) {
        if (c.feemin >= b.min && c.feemin < b.max) {
          fees[b.id] = (fees[b.id] || 0) + 1;
          break;
        }
      }
    }
    for (const cat of c.cats || []) cats[cat] = (cats[cat] || 0) + 1;
    for (const br of c.brands || []) brands[br] = (brands[br] || 0) + 1;
  }
  return { holders, types, fees, cats, brands };
}

// 혜택 카테고리 목록 (카운트 내림차순)
export function listCats(cards) {
  const counts = buildFilterCounts(cards).cats;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}
