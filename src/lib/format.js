export const cn = (...classes) => classes.filter(Boolean).join(" ");

// 카드 종류별 배지 색상 (Tailwind 클래스 — 문자열 전체가 스캔되어야 함)
export const TYPE_BADGE = {
  "신용카드": "bg-sky-50 text-sky-700 border-sky-200",
  "체크카드": "bg-im-50 text-im-700 border-im-200",
  "법인카드": "bg-violet-50 text-violet-700 border-violet-200",
  "기타": "bg-stone-100 text-stone-600 border-stone-200",
};
export const typeBadge = (type) => TYPE_BADGE[type] || TYPE_BADGE["기타"];

// 판매 상태 배지
export const STATUS_BADGE = {
  "판매중": "bg-im-50 text-im-700 border-im-200",
  "단종": "bg-rose-50 text-rose-600 border-rose-200",
};
export const statusBadge = (status) =>
  STATUS_BADGE[status] || STATUS_BADGE["판매중"];
