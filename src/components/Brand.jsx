import { CreditCard } from "lucide-react";

export const Brand = ({ subtitle = "영업점 카드 추천 전용" }) => (
  <div className="flex items-center gap-2.5">
    <div className="relative w-9 h-9 flex-shrink-0">
      <div className="absolute inset-0 bg-gradient-to-br from-im-300 to-im-500 rounded-md transform rotate-3" />
      <div className="absolute inset-0 bg-gradient-to-br from-im-400 to-im-600 rounded-md flex items-center justify-center shadow-sm">
        <CreditCard className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>
    </div>
    <div className="min-w-0">
      <div className="text-[13px] font-black text-stone-900 leading-tight">
        iM뱅크 카드 가이드
      </div>
      <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
        {subtitle}
      </div>
    </div>
  </div>
);
