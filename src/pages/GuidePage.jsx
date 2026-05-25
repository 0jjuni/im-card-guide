import { useState, useMemo, useEffect } from "react";
import { Search, Settings } from "lucide-react";
import { Brand } from "../components/Brand";
import { FilterBar } from "../components/FilterBar";
import { CardGrid } from "../components/CardGrid";
import { CardModal } from "../components/CardModal";
import { CompareBar } from "../components/CompareBar";
import { CompareModal } from "../components/CompareModal";
import { cn } from "../lib/format";
import {
  matchesHolder,
  matchesFee,
  matchesBrands,
  matchesSpend,
  buildFilterCounts,
  listCats,
} from "../lib/filters";

export const GuidePage = ({ cards }) => {
  const [query, setQuery] = useState("");
  const [holders, setHolders] = useState([]);
  const [types, setTypes] = useState([]);
  const [fees, setFees] = useState([]);
  const [brands, setBrands] = useState([]);
  const [cats, setCats] = useState([]);
  const [spend, setSpend] = useState(null);
  const [showDiscontinued, setShowDiscontinued] = useState(false);
  const [mode, setMode] = useState("general"); // 'general' | 'affiliated'
  const [openId, setOpenId] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const MAX_COMPARE = 4;

  // 현재 모드에 해당하는 카드 풀 (general / affiliated)
  const modePool = useMemo(
    () => cards.filter((c) => (mode === "affiliated" ? c.affiliated : !c.affiliated)),
    [cards, mode]
  );

  const counts = useMemo(
    () => buildFilterCounts(modePool, { showDiscontinued, showAffiliated: true }),
    [modePool, showDiscontinued]
  );
  const catList = useMemo(
    () => listCats(modePool, { showDiscontinued, showAffiliated: true }),
    [modePool, showDiscontinued]
  );

  const generalTotal = useMemo(
    () => cards.filter((c) => !c.affiliated && c.status !== "단종").length,
    [cards]
  );
  const affiliatedTotal = useMemo(
    () => cards.filter((c) => c.affiliated && c.status !== "단종").length,
    [cards]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return modePool.filter((c) => {
      if (!showDiscontinued && c.status === "단종") return false;
      if (!matchesHolder(c, holders)) return false;
      if (types.length && !types.includes(c.type)) return false;
      if (!matchesFee(c, fees)) return false;
      if (!matchesBrands(c, brands)) return false;
      if (!matchesSpend(c, spend)) return false;
      if (cats.length && !cats.every((cat) => c.cats.includes(cat))) return false;
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
  }, [modePool, query, holders, types, fees, brands, cats, spend, showDiscontinued]);

  const openCard =
    openId != null ? cards.find((c) => c.id === openId) : null;

  const toggle = (setter) => (v) =>
    setter((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  const reset = () => {
    setQuery("");
    setHolders([]);
    setTypes([]);
    setFees([]);
    setBrands([]);
    setCats([]);
    setSpend(null);
    setShowDiscontinued(false);
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };
  const compareCards = compareIds
    .map((id) => cards.find((c) => c.id === id))
    .filter(Boolean);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenId(null);
        setCompareOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = openCard || compareOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openCard, compareOpen]);

  const hasFilter =
    query.trim() ||
    holders.length ||
    types.length ||
    fees.length ||
    brands.length ||
    cats.length ||
    spend ||
    showDiscontinued;

  return (
    <div
      className="min-h-screen bg-stone-50 text-stone-900"
      style={{ fontFamily: "'Noto Sans KR','Pretendard',system-ui,sans-serif" }}
    >
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-2.5 flex items-center justify-between gap-3">
          <Brand />
          <a
            href="#/admin"
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-im-700 border border-stone-200 hover:border-im-300 rounded-sm px-2 py-1.5"
          >
            <Settings className="w-3.5 h-3.5" /> 카드 관리
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-4 md:py-6">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs uppercase tracking-widest text-im-700 font-semibold">
                Card Guide
              </span>
              <span className="text-xs text-stone-400">
                총 {cards.length}개 카드
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-stone-900 tracking-tight">
              카드 찾기
            </h1>
          </div>
        </div>

        <div className="mb-3 inline-flex bg-white border border-stone-200 rounded-md p-0.5">
          {[
            { id: "general", label: "일반 카드", count: generalTotal },
            { id: "affiliated", label: "기관·제휴 카드", count: affiliatedTotal },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setMode(t.id);
                // 모드 전환 시 필터 초기화 — 두 카드 풀이 달라서 필터 카운트도 달라짐
                setHolders([]);
                setTypes([]);
                setFees([]);
                setBrands([]);
                setCats([]);
                setSpend(null);
              }}
              className={cn(
                "px-3.5 py-1.5 text-[13px] rounded-sm font-semibold transition-colors",
                mode === t.id
                  ? "bg-im-600 text-white"
                  : "text-stone-600 hover:text-stone-900"
              )}
            >
              {t.label}
              <span
                className={cn(
                  "ml-1.5 text-[11px] font-normal",
                  mode === t.id ? "text-im-100" : "text-stone-400"
                )}
              >
                {t.count}
              </span>
            </button>
          ))}
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

        <div className="mb-3">
          <FilterBar
            holders={holders}
            types={types}
            fees={fees}
            brands={brands}
            cats={cats}
            spend={spend}
            showDiscontinued={showDiscontinued}
            counts={counts}
            catList={catList}
            onToggleHolder={toggle(setHolders)}
            onToggleType={toggle(setTypes)}
            onToggleFee={toggle(setFees)}
            onToggleBrand={toggle(setBrands)}
            onToggleCat={toggle(setCats)}
            onSetSpend={setSpend}
            onToggleDiscontinued={() => setShowDiscontinued((v) => !v)}
            onReset={reset}
            hasFilter={hasFilter}
          />
        </div>

        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-sm text-stone-600">
            <span className="font-bold text-stone-900">{filtered.length}</span>
            개 카드
            {hasFilter && (
              <span className="text-stone-400"> / 전체 {cards.length}개</span>
            )}
          </div>
        </div>

        <CardGrid
          cards={filtered}
          onOpen={setOpenId}
          selectedIds={compareIds}
          onToggleSelect={toggleCompare}
          maxSelect={MAX_COMPARE}
        />

        {compareIds.length > 0 && <div className="h-16" aria-hidden="true" />}
      </main>

      <CompareBar
        cards={cards}
        selectedIds={compareIds}
        onRemove={toggleCompare}
        onClear={() => setCompareIds([])}
        onOpenCompare={() => setCompareOpen(true)}
        maxSelect={MAX_COMPARE}
      />

      <CardModal card={openCard} onClose={() => setOpenId(null)} />
      {compareOpen && (
        <CompareModal
          cards={compareCards}
          onClose={() => setCompareOpen(false)}
          onRemove={toggleCompare}
        />
      )}
    </div>
  );
};
