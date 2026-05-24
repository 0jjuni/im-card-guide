import { X } from "lucide-react";
import { cn, typeBadge, statusBadge } from "../lib/format";

export const CardModal = ({ card, onClose }) => {
  if (!card) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-2xl w-full max-h-[88vh] flex flex-col rounded-md shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-4 border-b border-stone-200 flex-shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-sm border",
                  typeBadge(card.type)
                )}
              >
                {card.type}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-sm border",
                  statusBadge(card.status)
                )}
              >
                {card.status}
              </span>
              {card.targets.map((t) => (
                <span
                  key={t}
                  className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-sm"
                >
                  {t}
                </span>
              ))}
            </div>
            <h3 className="text-lg font-bold text-stone-900 leading-tight">
              {card.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-stone-100 rounded-sm flex-shrink-0 ml-2"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {card.status === "단종" && (
          <div className="px-5 py-2 bg-rose-50 border-b border-rose-100 flex-shrink-0">
            <p className="text-[12px] text-rose-700 font-medium">
              단종 카드입니다. 신규 발급은 불가하며, 기존 보유 고객 안내용으로만
              사용하세요.
            </p>
          </div>
        )}

        <div className="p-5 overflow-y-auto">
          <div
            className="md-body"
            dangerouslySetInnerHTML={{ __html: card.body }}
          />
        </div>

        <div className="px-5 py-2.5 border-t border-stone-100 flex-shrink-0">
          <p className="text-[10px] text-stone-400 leading-relaxed">
            iM뱅크 카드 상품설명서 기반 정리 자료입니다. 정확한 약관·조건은 원본
            상품설명서 및 약관을 따릅니다.
          </p>
        </div>
      </div>
    </div>
  );
};
