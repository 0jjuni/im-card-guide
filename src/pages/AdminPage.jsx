import { useState, useMemo } from "react";
import { Plus, ArrowLeft, AlertTriangle, Pencil, Search } from "lucide-react";
import { Brand } from "../components/Brand";
import { CardForm } from "../components/admin/CardForm";
import {
  usingSupabase,
  createCard,
  updateCard,
  setCardStatus,
  deleteCard,
} from "../lib/cardsRepo";
import { cn, typeBadge, statusBadge } from "../lib/format";

export const AdminPage = ({ cards, onReload }) => {
  const dbReady = usingSupabase();
  const [editing, setEditing] = useState(null); // null | "new" | card객체
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? cards.filter((c) => c.name.toLowerCase().includes(q))
      : cards;
  }, [cards, query]);

  const handleSave = async (card) => {
    setSaving(true);
    setError(null);
    try {
      if (editing !== "new" && card.id != null) {
        await updateCard(card.id, card);
      } else {
        await createCard(card);
      }
      await onReload();
      setEditing(null);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editing || editing === "new") return;
    if (!window.confirm(`'${editing.name}' 카드를 삭제할까요? 되돌릴 수 없습니다.`))
      return;
    setSaving(true);
    setError(null);
    try {
      await deleteCard(editing.id);
      await onReload();
      setEditing(null);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (card) => {
    setError(null);
    try {
      await setCardStatus(card.id, card.status === "판매중" ? "단종" : "판매중");
      await onReload();
    } catch (e) {
      setError(e.message || String(e));
    }
  };

  return (
    <div
      className="min-h-screen bg-stone-50 text-stone-900"
      style={{ fontFamily: "'Noto Sans KR','Pretendard',system-ui,sans-serif" }}
    >
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Brand subtitle="카드 관리 · 카드사업부" />
        </div>
        <a
          href="#/"
          className="flex items-center gap-1 text-xs text-stone-500 hover:text-im-700 border border-stone-200 hover:border-im-300 rounded-sm px-2 py-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> 카드 찾기
        </a>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-im-700 font-semibold">
              Admin
            </span>
            <h1 className="text-2xl font-bold tracking-tight">카드 관리</h1>
            <p className="text-sm text-stone-600 mt-1">
              새 카드 등록, 내용 수정, 단종 처리를 합니다. 총 {cards.length}개.
            </p>
          </div>
          <button
            onClick={() => dbReady && setEditing("new")}
            disabled={!dbReady}
            className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold text-white bg-im-600 hover:bg-im-700 rounded-sm disabled:opacity-40 flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> 새 카드
          </button>
        </div>

        {!dbReady && (
          <div className="mb-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-md p-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-[12px] text-amber-800 leading-relaxed">
              <strong>Supabase 미연결 — 읽기 전용 상태입니다.</strong> 카드 추가·수정·
              단종 처리는 <code>.env</code> 에 Supabase 정보를 설정한 뒤 가능합니다.
              (설정 방법은 README · CLAUDE.md 참고)
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 rounded-md p-3 text-[12px] text-rose-700">
            오류: {error}
          </div>
        )}

        <div className="relative mb-3">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="카드명 검색"
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:border-im-500 focus:ring-2 focus:ring-im-100"
          />
        </div>

        <div className="text-xs text-stone-500 mb-2">{list.length}개 표시</div>

        <div className="bg-white border border-stone-200 rounded-md divide-y divide-stone-100">
          {list.map((c) => (
            <div
              key={c.id}
              className="px-3 py-2.5 flex items-center gap-3 hover:bg-stone-50/60"
            >
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-sm border flex-shrink-0 w-[52px] text-center",
                  typeBadge(c.type)
                )}
              >
                {c.type.replace("카드", "")}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-stone-900 truncate">
                  {c.name}
                </div>
                <div className="text-[11px] text-stone-400 truncate">
                  {c.targets.join(" · ")}
                  {c.summary ? ` · ${c.summary}` : ""}
                </div>
              </div>
              <button
                onClick={() => dbReady && handleToggle(c)}
                disabled={!dbReady}
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-sm border flex-shrink-0",
                  statusBadge(c.status),
                  dbReady && "hover:opacity-80",
                  !dbReady && "cursor-default"
                )}
                title={dbReady ? "클릭해 상태 전환" : ""}
              >
                {c.status}
              </button>
              <button
                onClick={() => dbReady && setEditing(c)}
                disabled={!dbReady}
                className="p-1.5 text-stone-400 hover:text-im-700 hover:bg-stone-100 rounded-sm flex-shrink-0 disabled:opacity-30"
                aria-label="수정"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {!list.length && (
            <div className="p-8 text-center text-sm text-stone-400">
              표시할 카드가 없습니다.
            </div>
          )}
        </div>
      </div>

      {editing && (
        <CardForm
          card={editing === "new" ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          onDelete={handleDelete}
          saving={saving}
        />
      )}
    </div>
  );
};
