import { ChevronRight, Check } from "lucide-react";
import { cn, typeBadge } from "../lib/format";

export const CardTile = ({
  card,
  onOpen,
  selected,
  onToggleSelect,
  canSelectMore,
}) => {
  const discontinued = card.status === "단종";
  const selectable = selected || canSelectMore;

  return (
    <div
      className={cn(
        "group w-full flex items-stretch hover:bg-im-50/60 transition-colors",
        discontinued && "opacity-70"
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (selectable) onToggleSelect(card.id);
        }}
        disabled={!selectable}
        aria-label={selected ? "비교 선택 해제" : "비교에 추가"}
        className={cn(
          "flex items-center justify-center w-10 flex-shrink-0 border-r border-stone-100",
          selectable
            ? "cursor-pointer hover:bg-im-100"
            : "cursor-not-allowed",
          selected && "bg-im-600 hover:bg-im-700"
        )}
      >
        <span
          className={cn(
            "w-4 h-4 rounded-sm border flex items-center justify-center transition-colors",
            selected
              ? "bg-white border-white"
              : selectable
              ? "border-stone-300 group-hover:border-im-400"
              : "border-stone-200"
          )}
        >
          {selected && <Check className="w-3 h-3 text-im-700" strokeWidth={3} />}
        </span>
      </button>

      <button
        type="button"
        onClick={() => onOpen(card.id)}
        className="flex-1 min-w-0 text-left px-4 py-3 flex items-center gap-3"
      >
        <span
          className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded-sm border flex-shrink-0 w-[52px] text-center",
            typeBadge(card.type)
          )}
        >
          {card.type.replace("카드", "")}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-stone-900 text-[14px] truncate">
              {card.name}
            </span>
            {discontinued && (
              <span className="text-[9px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1 py-0.5 rounded-sm flex-shrink-0">
                단종
              </span>
            )}
            {card.affiliated && (
              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1 py-0.5 rounded-sm flex-shrink-0">
                제휴
              </span>
            )}
          </div>
          <div className="text-[12px] text-stone-500 truncate mt-0.5">
            {card.summary || card.targetText}
          </div>
          {card.cats.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {card.cats.slice(0, 6).map((c) => (
                <span
                  key={c}
                  className="text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded-sm"
                >
                  {c}
                </span>
              ))}
              {card.cats.length > 6 && (
                <span className="text-[10px] text-stone-400 px-1 py-0.5">
                  +{card.cats.length - 6}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="hidden sm:flex flex-col items-end gap-1 flex-shrink-0 w-[150px]">
          <div className="flex flex-wrap justify-end gap-1">
            {card.targets.map((t) => (
              <span
                key={t}
                className="text-[10px] text-im-700 bg-im-50 border border-im-200 px-1.5 py-0.5 rounded-sm"
              >
                {t}
              </span>
            ))}
          </div>
          <div className="text-[11px] text-stone-400 truncate max-w-full">
            연회비 {card.fee}
          </div>
        </div>

        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-im-600 flex-shrink-0 transition-colors" />
      </button>
    </div>
  );
};
