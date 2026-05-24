import { useState, useMemo, useEffect } from "react";
import { Menu, Search, Settings } from "lucide-react";
import { Brand } from "../components/Brand";
import { Sidebar } from "../components/Sidebar";
import { CardGrid } from "../components/CardGrid";
import { CardModal } from "../components/CardModal";
import { cn } from "../lib/format";

export const GuidePage = ({ cards }) => {
  const [query, setQuery] = useState("");
  const [targets, setTargets] = useState([]);
  const [types, setTypes] = useState([]);
  const [cats, setCats] = useState([]);
  const [showDiscontinued, setShowDiscontinued] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      if (!showDiscontinued && c.status === "단종") return false;
      if (targets.length && !targets.some((t) => c.targets.includes(t)))
        return false;
      if (types.length && !types.includes(c.type)) return false;
      if (cats.length && !cats.every((cat) => c.cats.includes(cat)))
        return false;
      if (q) {
        const hay = (
          c.name +
          " " +
          c.summary +
          " " +
          c.targetText +
          " " +
          c.rawcats.join(" ") +
          " " +
          c.cats.join(" ")
        ).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cards, query, targets, types, cats, showDiscontinued]);

  const openCard =
    openId != null ? cards.find((c) => c.id === openId) : null;

  const toggle = (setter) => (v) =>
    setter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  const reset = () => {
    setQuery("");
    setTargets([]);
    setTypes([]);
    setCats([]);
    setShowDiscontinued(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenId(null);
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openCard ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openCard]);

  const hasFilter =
    query.trim() ||
    targets.length ||
    types.length ||
    cats.length ||
    showDiscontinued;

  return (
    <div
      className="min-h-screen bg-stone-50 text-stone-900"
      style={{ fontFamily: "'Noto Sans KR','Pretendard',system-ui,sans-serif" }}
    >
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-stone-200 flex items-center gap-3 px-3 py-2">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-1.5 hover:bg-stone-100 rounded-sm"
          aria-label="메뉴 열기"
        >
          <Menu className="w-5 h-5 text-stone-700" />
        </button>
        <Brand />
      </header>

      <div className="md:flex">
        {drawerOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          className={cn(
            "bg-white border-r border-stone-200 flex flex-col",
            "md:w-64 md:sticky md:top-0 md:h-screen md:translate-x-0",
            "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-200 ease-out",
            drawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <Sidebar
            targets={targets}
            types={types}
            cats={cats}
            showDiscontinued={showDiscontinued}
            onToggleTarget={toggle(setTargets)}
            onToggleType={toggle(setTypes)}
            onToggleCat={toggle(setCats)}
            onToggleDiscontinued={() => setShowDiscontinued((v) => !v)}
            onReset={reset}
            onCloseDrawer={() => setDrawerOpen(false)}
          />
        </aside>

        <main className="flex-1 min-h-screen min-w-0">
          <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs uppercase tracking-widest text-im-700 font-semibold">
                    Card Guide
                  </span>
                  <span className="text-xs text-stone-400">
                    총 {cards.length}개 카드
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">
                  카드 찾기
                </h1>
                <p className="text-sm text-stone-600 mt-1">
                  발급 대상과 혜택으로 좁히거나, 카드명·혜택을 검색해 빠르게
                  안내하세요.
                </p>
              </div>
              <a
                href="#/admin"
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-im-700 border border-stone-200 hover:border-im-300 rounded-sm px-2 py-1.5 flex-shrink-0"
              >
                <Settings className="w-3.5 h-3.5" /> 카드 관리
              </a>
            </div>

            <div className="relative mb-3">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="카드명 또는 혜택 검색 (예: 주유, 카카오, 마일리지)"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-stone-300 rounded-md focus:outline-none focus:border-im-500 focus:ring-2 focus:ring-im-100"
              />
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-stone-600">
                <span className="font-bold text-stone-900">
                  {filtered.length}
                </span>
                개 카드
                {hasFilter && (
                  <span className="text-stone-400"> / 전체 {cards.length}개</span>
                )}
              </div>
              {hasFilter && (
                <button
                  onClick={reset}
                  className="text-xs text-im-700 hover:text-im-800 font-medium"
                >
                  필터 초기화
                </button>
              )}
            </div>

            <CardGrid cards={filtered} onOpen={setOpenId} />
          </div>
        </main>
      </div>

      <CardModal card={openCard} onClose={() => setOpenId(null)} />
    </div>
  );
};
