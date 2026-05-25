import { X, GitCompare } from "lucide-react";
import { cn } from "../lib/format";

export const CompareBar = ({
  cards,
  selectedIds,
  onRemove,
  onClear,
  onOpenCompare,
  maxSelect = 4,
}) => {
  if (!selectedIds.length) return null;
  const selected = selectedIds
    .map((id) => cards.find((c) => c.id === id))
    .filter(Boolean);
  const canCompare = selected.length >= 2;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-2.5 flex items-center gap-3">
        <div className="text-[12px] text-stone-500 flex-shrink-0">
          비교
          <span className="ml-1 font-bold text-im-700">
            {selected.length}
          </span>
          <span className="text-stone-300"> / {maxSelect}</span>
        </div>

        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto min-w-0">
          {selected.map((c) => (
            <span
              key={c.id}
              className="inline-flex items-center gap-1 pl-2 pr-1 py-1 text-[12px] bg-stone-100 border border-stone-200 rounded-sm whitespace-nowrap"
            >
              <span className="text-stone-700 max-w-[180px] truncate">
                {c.name}
              </span>
              <button
                onClick={() => onRemove(c.id)}
                className="p-0.5 hover:bg-stone-200 rounded-sm flex-shrink-0"
                aria-label={`${c.name} 비교에서 제거`}
              >
                <X className="w-3 h-3 text-stone-500" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onClear}
            className="text-[12px] text-stone-500 hover:text-stone-700 px-2 py-1"
          >
            전체 해제
          </button>
          <button
            onClick={onOpenCompare}
            disabled={!canCompare}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-semibold rounded-sm transition-colors",
              canCompare
                ? "bg-im-600 text-white hover:bg-im-700"
                : "bg-stone-100 text-stone-400 cursor-not-allowed"
            )}
          >
            <GitCompare className="w-3.5 h-3.5" />
            비교하기
          </button>
        </div>
      </div>
    </div>
  );
};
