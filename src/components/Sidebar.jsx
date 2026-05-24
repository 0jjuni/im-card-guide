import { X, RotateCcw } from "lucide-react";
import { Brand } from "./Brand";
import { CARD_TYPES, TARGET_TYPES, BENEFIT_CATEGORIES } from "../data/filters";
import { cn } from "../lib/format";

const FilterGroup = ({ label, children }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold mb-2">
      {label}
    </div>
    {children}
  </div>
);

export const Sidebar = ({
  targets,
  types,
  cats,
  showDiscontinued,
  onToggleTarget,
  onToggleType,
  onToggleCat,
  onToggleDiscontinued,
  onReset,
  onCloseDrawer,
}) => (
  <>
    <div className="p-4 border-b border-stone-200 flex items-center justify-between gap-2 flex-shrink-0">
      <Brand />
      <button
        onClick={onCloseDrawer}
        className="md:hidden p-1.5 hover:bg-stone-100 rounded-sm flex-shrink-0"
        aria-label="메뉴 닫기"
      >
        <X className="w-5 h-5 text-stone-600" />
      </button>
    </div>

    <div className="flex-1 overflow-y-auto p-4 space-y-5">
      <FilterGroup label="발급 대상">
        <div className="space-y-1">
          {TARGET_TYPES.map((t) => {
            const active = targets.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => onToggleTarget(t.id)}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 text-[13px] rounded-sm border transition-colors",
                  active
                    ? "bg-im-600 text-white border-im-600 font-semibold"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                )}
              >
                <span>{t.label}</span>
                <span className={active ? "text-im-100" : "text-stone-400"}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup label="카드 종류">
        <div className="space-y-1">
          {CARD_TYPES.map((t) => {
            const active = types.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => onToggleType(t.id)}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 text-[13px] rounded-sm border transition-colors",
                  active
                    ? "bg-stone-900 text-white border-stone-900 font-semibold"
                    : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                )}
              >
                <span>{t.label}</span>
                <span className={active ? "text-stone-300" : "text-stone-400"}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup label="혜택">
        <div className="flex flex-wrap gap-1.5">
          {BENEFIT_CATEGORIES.map((c) => {
            const active = cats.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => onToggleCat(c.name)}
                className={cn(
                  "px-2 py-1 text-[11px] rounded-sm border transition-colors",
                  active
                    ? "bg-im-500 text-white border-im-500 font-semibold"
                    : "bg-white text-stone-600 border-stone-200 hover:border-im-300"
                )}
              >
                {c.name}{" "}
                <span className={active ? "text-im-100" : "text-stone-400"}>
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-stone-400 mt-2 leading-relaxed">
          혜택을 여러 개 고르면 모두 포함하는 카드만 표시됩니다.
        </p>
      </FilterGroup>

      <FilterGroup label="판매 상태">
        <label className="flex items-center gap-2 px-2.5 py-1.5 text-[13px] text-stone-700 border border-stone-200 rounded-sm cursor-pointer hover:bg-stone-50">
          <input
            type="checkbox"
            checked={showDiscontinued}
            onChange={onToggleDiscontinued}
            className="accent-im-600"
          />
          단종 카드도 표시
        </label>
      </FilterGroup>
    </div>

    <div className="p-3 border-t border-stone-200 space-y-2 flex-shrink-0">
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[12px] text-stone-600 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-sm transition-colors"
      >
        <RotateCcw className="w-3 h-3" /> 필터 초기화
      </button>
      <div className="text-[9px] text-stone-400 text-center leading-relaxed px-1">
        iM뱅크 카드 상품설명서 기반 · 사내 참고용
      </div>
    </div>
  </>
);
