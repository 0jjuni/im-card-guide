import { ChevronRight } from "lucide-react";
import { cn, typeBadge } from "../lib/format";

// 결과 리스트의 카드 한 줄 (행)
export const CardTile = ({ card, onOpen }) => {
  const discontinued = card.status === "단종";
  return (
    <button
      onClick={() => onOpen(card.id)}
      className={cn(
        "group w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-im-50/60 transition-colors",
        discontinued && "opacity-70"
      )}
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
  );
};
