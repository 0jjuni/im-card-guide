import { RotateCcw, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/format";
import { HOLDERS, TYPES, FEE_BUCKETS, BRANDS } from "../lib/filters";

const Chip = ({ active, onClick, children, accent = "im" }) => {
  const palette =
    accent === "stone"
      ? active
        ? "bg-stone-900 text-white border-stone-900"
        : "bg-white text-stone-700 border-stone-300 hover:border-stone-400"
      : active
      ? "bg-im-600 text-white border-im-600"
      : "bg-white text-stone-700 border-stone-300 hover:border-im-400";
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 text-[12px] rounded-full border transition-colors whitespace-nowrap",
        palette,
        active && "font-semibold"
      )}
    >
      {children}
    </button>
  );
};

const Group = ({ label, children }) => (
  <div className="flex items-center gap-2 flex-wrap min-w-0">
    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-bold flex-shrink-0">
      {label}
    </span>
    <div className="flex items-center gap-1.5 flex-wrap">{children}</div>
  </div>
);

export const FilterBar = ({
  holders,
  types,
  fees,
  brands,
  cats,
  showDiscontinued,
  counts,
  catList,
  onToggleHolder,
  onToggleType,
  onToggleFee,
  onToggleBrand,
  onToggleCat,
  onToggleDiscontinued,
  onReset,
  hasFilter,
}) => {
  const [catOpen, setCatOpen] = useState(false);
  const topCats = catList.slice(0, 8);
  const moreCats = catList.slice(8);

  return (
    <div className="bg-white border border-stone-200 rounded-md p-3 space-y-2.5">
      <div className="flex flex-wrap items-start gap-x-5 gap-y-2.5">
        <Group label="발급대상">
          {HOLDERS.map((h) => (
            <Chip
              key={h.id}
              active={holders.includes(h.id)}
              onClick={() => onToggleHolder(h.id)}
            >
              {h.label}
              <span
                className={cn(
                  "text-[10px]",
                  holders.includes(h.id) ? "text-im-100" : "text-stone-400"
                )}
              >
                {counts.holders[h.id] || 0}
              </span>
            </Chip>
          ))}
        </Group>

        <Group label="종류">
          {TYPES.map((t) => (
            <Chip
              key={t.id}
              accent="stone"
              active={types.includes(t.id)}
              onClick={() => onToggleType(t.id)}
            >
              {t.label}
              <span
                className={cn(
                  "text-[10px]",
                  types.includes(t.id) ? "text-stone-300" : "text-stone-400"
                )}
              >
                {counts.types[t.id] || 0}
              </span>
            </Chip>
          ))}
        </Group>

        <Group label="연회비">
          {FEE_BUCKETS.map((b) => (
            <Chip
              key={b.id}
              active={fees.includes(b.id)}
              onClick={() => onToggleFee(b.id)}
            >
              {b.label}
              <span
                className={cn(
                  "text-[10px]",
                  fees.includes(b.id) ? "text-im-100" : "text-stone-400"
                )}
              >
                {counts.fees[b.id] || 0}
              </span>
            </Chip>
          ))}
        </Group>

        <Group label="브랜드">
          {BRANDS.filter((b) => (counts.brands[b.id] || 0) > 0).map((b) => (
            <Chip
              key={b.id}
              active={brands.includes(b.id)}
              onClick={() => onToggleBrand(b.id)}
            >
              {b.label}
              <span
                className={cn(
                  "text-[10px]",
                  brands.includes(b.id) ? "text-im-100" : "text-stone-400"
                )}
              >
                {counts.brands[b.id] || 0}
              </span>
            </Chip>
          ))}
        </Group>
      </div>

      <div className="border-t border-stone-100 pt-2.5 flex items-start gap-x-5 gap-y-2 flex-wrap">
        <Group label="혜택">
          {topCats.map((c) => (
            <Chip
              key={c.name}
              active={cats.includes(c.name)}
              onClick={() => onToggleCat(c.name)}
            >
              {c.name}
              <span
                className={cn(
                  "text-[10px]",
                  cats.includes(c.name) ? "text-im-100" : "text-stone-400"
                )}
              >
                {c.count}
              </span>
            </Chip>
          ))}
          {moreCats.length > 0 && (
            <button
              onClick={() => setCatOpen((v) => !v)}
              className="inline-flex items-center gap-0.5 px-2 py-1 text-[11px] text-stone-500 hover:text-im-700 rounded-full border border-stone-200 hover:border-im-300 transition-colors"
            >
              {catOpen ? "접기" : `+ ${moreCats.length}개 더`}
              <ChevronDown
                className={cn(
                  "w-3 h-3 transition-transform",
                  catOpen && "rotate-180"
                )}
              />
            </button>
          )}
        </Group>
      </div>

      {catOpen && moreCats.length > 0 && (
        <div className="border-t border-stone-100 pt-2.5 flex flex-wrap gap-1.5">
          {moreCats.map((c) => (
            <Chip
              key={c.name}
              active={cats.includes(c.name)}
              onClick={() => onToggleCat(c.name)}
            >
              {c.name}
              <span
                className={cn(
                  "text-[10px]",
                  cats.includes(c.name) ? "text-im-100" : "text-stone-400"
                )}
              >
                {c.count}
              </span>
            </Chip>
          ))}
        </div>
      )}

      <div className="border-t border-stone-100 pt-2 flex items-center justify-between flex-wrap gap-2">
        <label className="inline-flex items-center gap-1.5 text-[12px] text-stone-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showDiscontinued}
            onChange={onToggleDiscontinued}
            className="accent-im-600"
          />
          단종 카드도 표시
        </label>
        {hasFilter && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-[12px] text-stone-500 hover:text-im-700"
          >
            <RotateCcw className="w-3 h-3" /> 필터 초기화
          </button>
        )}
      </div>
    </div>
  );
};
