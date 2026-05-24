import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { BENEFIT_CATEGORIES } from "../../data/filters";
import { cn } from "../../lib/format";

const TYPES = ["신용카드", "체크카드", "법인카드", "기타"];
const STATUSES = ["판매중", "단종"];
const TARGETS = ["개인", "개인사업자", "법인"];

const Field = ({ label, children, hint }) => (
  <label className="block">
    <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
      {label}
    </span>
    {hint && <span className="text-[10px] text-stone-400 ml-1.5">{hint}</span>}
    <div className="mt-1">{children}</div>
  </label>
);

const inputCls =
  "w-full px-2.5 py-1.5 text-[13px] bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-im-500 focus:ring-2 focus:ring-im-100";

export const CardForm = ({ card, onSave, onCancel, onDelete, saving }) => {
  const isEdit = Boolean(card);
  const [f, setF] = useState(() => ({
    name: card?.name || "",
    type: card?.type || "신용카드",
    status: card?.status || "판매중",
    targets: card?.targets?.length ? card.targets : ["개인"],
    targetText: card?.targetText || "",
    fee: card?.fee || "",
    summary: card?.summary || "",
    cats: card?.cats || [],
    body: card?.body || "",
  }));

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const toggleArr = (k, v) =>
    setF((p) => ({
      ...p,
      [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v],
    }));

  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim()) return;
    onSave({
      ...card,
      ...f,
      name: f.name.trim(),
      rawcats: f.cats,
      feemin: card?.feemin ?? null,
      mdfile: card?.mdfile ?? null,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-2xl w-full max-h-[90vh] flex flex-col rounded-md shadow-2xl border border-stone-200"
      >
        <div className="flex items-center justify-between p-4 border-b border-stone-200 flex-shrink-0">
          <h3 className="text-base font-bold text-stone-900">
            {isEdit ? "카드 수정" : "새 카드 추가"}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 hover:bg-stone-100 rounded-sm"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5">
          <Field label="카드명">
            <input
              className={inputCls}
              value={f.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="예: iM K-패스 카드"
              required
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="카드 종류">
              <select
                className={inputCls}
                value={f.type}
                onChange={(e) => set("type", e.target.value)}
              >
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="판매 상태">
              <select
                className={inputCls}
                value={f.status}
                onChange={(e) => set("status", e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="발급 대상" hint="해당하는 것 모두 선택">
            <div className="flex gap-1.5">
              {TARGETS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => toggleArr("targets", t)}
                  className={cn(
                    "px-2.5 py-1 text-[12px] rounded-sm border transition-colors",
                    f.targets.includes(t)
                      ? "bg-im-600 text-white border-im-600 font-semibold"
                      : "bg-white text-stone-600 border-stone-300 hover:bg-stone-50"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </Field>

          <Field label="발급 대상 상세" hint="원문 그대로 (선택)">
            <input
              className={inputCls}
              value={f.targetText}
              onChange={(e) => set("targetText", e.target.value)}
              placeholder="예: 만 19세 이상 개인"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="연회비">
              <input
                className={inputCls}
                value={f.fee}
                onChange={(e) => set("fee", e.target.value)}
                placeholder="예: 국내전용 5,000원"
              />
            </Field>
            <Field label="대표 혜택">
              <input
                className={inputCls}
                value={f.summary}
                onChange={(e) => set("summary", e.target.value)}
                placeholder="예: 대중교통 10% 청구할인"
              />
            </Field>
          </div>

          <Field label="혜택 카테고리" hint="필터에 사용됨">
            <div className="flex flex-wrap gap-1.5">
              {BENEFIT_CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.name}
                  onClick={() => toggleArr("cats", c.name)}
                  className={cn(
                    "px-2 py-1 text-[11px] rounded-sm border transition-colors",
                    f.cats.includes(c.name)
                      ? "bg-im-500 text-white border-im-500 font-semibold"
                      : "bg-white text-stone-600 border-stone-300 hover:border-im-300"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </Field>

          <Field label="카드 상세 내용" hint="HTML — 표·목록 등">
            <textarea
              className={cn(inputCls, "font-mono text-[12px] leading-relaxed")}
              rows={8}
              value={f.body}
              onChange={(e) => set("body", e.target.value)}
              placeholder="<h2>주요 혜택</h2> ..."
            />
          </Field>
        </div>

        <div className="flex items-center justify-between gap-2 p-4 border-t border-stone-200 flex-shrink-0">
          <div>
            {isEdit && (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-1 text-[12px] text-rose-600 hover:text-rose-700 px-2 py-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> 삭제
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 text-[13px] text-stone-600 border border-stone-300 rounded-sm hover:bg-stone-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 text-[13px] font-semibold text-white bg-im-600 hover:bg-im-700 rounded-sm disabled:opacity-50"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
