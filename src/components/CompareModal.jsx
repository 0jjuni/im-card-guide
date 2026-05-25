import { X, Download } from "lucide-react";
import { cn, typeBadge, statusBadge } from "../lib/format";

const Row = ({ label, children }) => (
  <tr className="border-t border-stone-100">
    <th className="text-left text-[11px] uppercase tracking-wider text-stone-500 font-bold align-top py-3 pr-3 w-[100px] sticky left-0 bg-white">
      {label}
    </th>
    {children}
  </tr>
);

export const CompareModal = ({ cards, onClose, onRemove }) => {
  if (!cards.length) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-stretch md:items-center justify-center p-2 md:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-6xl max-h-full flex flex-col rounded-md shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-stone-200 flex-shrink-0">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              카드 비교 ({cards.length}장)
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              항목별 차이를 한눈에 비교하세요. 상단의 × 로 카드를 빼고 다른
              카드를 추가할 수 있습니다.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-100 rounded-sm flex-shrink-0"
            aria-label="비교 닫기"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="w-[100px] sticky left-0 bg-white z-10"></th>
                {cards.map((c) => (
                  <th
                    key={c.id}
                    className="text-left p-3 align-top min-w-[220px] border-l border-stone-100"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 mb-1 flex-wrap">
                          <span
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0.5 rounded-sm border",
                              typeBadge(c.type)
                            )}
                          >
                            {c.type}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0.5 rounded-sm border",
                              statusBadge(c.status)
                            )}
                          >
                            {c.status}
                          </span>
                        </div>
                        <div className="font-bold text-stone-900 text-[13px] leading-tight">
                          {c.name}
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove(c.id)}
                        className="p-0.5 hover:bg-stone-100 rounded-sm flex-shrink-0"
                        aria-label="비교에서 제거"
                      >
                        <X className="w-3.5 h-3.5 text-stone-400" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="발급대상">
                {cards.map((c) => (
                  <td
                    key={c.id}
                    className="p-3 align-top border-l border-stone-100 text-[12px] text-stone-700"
                  >
                    {c.holder || "-"}
                    {c.targetText && (
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {c.targetText}
                      </div>
                    )}
                  </td>
                ))}
              </Row>
              <Row label="연회비">
                {cards.map((c) => (
                  <td
                    key={c.id}
                    className="p-3 align-top border-l border-stone-100 text-[12px] text-stone-700 whitespace-pre-wrap"
                  >
                    {c.fee || "-"}
                  </td>
                ))}
              </Row>
              <Row label="브랜드">
                {cards.map((c) => (
                  <td
                    key={c.id}
                    className="p-3 align-top border-l border-stone-100"
                  >
                    {c.brands && c.brands.length ? (
                      <div className="flex flex-wrap gap-1">
                        {c.brands.map((b) => (
                          <span
                            key={b}
                            className="text-[10px] text-stone-700 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded-sm"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[12px] text-stone-400">-</span>
                    )}
                  </td>
                ))}
              </Row>
              <Row label="대표혜택">
                {cards.map((c) => (
                  <td
                    key={c.id}
                    className="p-3 align-top border-l border-stone-100 text-[12px] text-stone-700 leading-relaxed"
                  >
                    {c.summary || "-"}
                  </td>
                ))}
              </Row>
              <Row label="혜택 카테고리">
                {cards.map((c) => (
                  <td
                    key={c.id}
                    className="p-3 align-top border-l border-stone-100"
                  >
                    {c.cats && c.cats.length ? (
                      <div className="flex flex-wrap gap-1">
                        {c.cats.map((cat) => (
                          <span
                            key={cat}
                            className="text-[10px] text-im-700 bg-im-50 border border-im-200 px-1.5 py-0.5 rounded-sm"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[12px] text-stone-400">-</span>
                    )}
                  </td>
                ))}
              </Row>
              <Row label="상품설명서">
                {cards.map((c) => (
                  <td
                    key={c.id}
                    className="p-3 align-top border-l border-stone-100"
                  >
                    {c.pdfUrl ? (
                      <a
                        href={c.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] font-medium text-im-700 hover:text-im-800 hover:underline"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </a>
                    ) : (
                      <span className="text-[12px] text-stone-400">-</span>
                    )}
                  </td>
                ))}
              </Row>
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-stone-100 flex-shrink-0">
          <p className="text-[10px] text-stone-400 leading-relaxed">
            iM뱅크 카드 상품설명서 기반 정리 자료입니다. 정확한 약관·조건은 원본
            상품설명서를 따릅니다.
          </p>
        </div>
      </div>
    </div>
  );
};
