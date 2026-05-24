import { useState, useEffect, useCallback } from "react";
import { loadCards } from "./lib/cardsRepo";
import { GuidePage } from "./pages/GuidePage";
import { AdminPage } from "./pages/AdminPage";

const Screen = ({ children }) => (
  <div
    className="min-h-screen bg-stone-50 flex items-center justify-center p-6"
    style={{ fontFamily: "'Noto Sans KR',system-ui,sans-serif" }}
  >
    <div className="text-center text-sm text-stone-500 leading-relaxed">
      {children}
    </div>
  </div>
);

export default function App() {
  const [cards, setCards] = useState(null);
  const [error, setError] = useState(null);
  const [hash, setHash] = useState(window.location.hash);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      setCards(await loadCards());
    } catch (e) {
      setError(e.message || String(e));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (error)
    return (
      <Screen>
        카드 데이터를 불러오지 못했습니다.
        <br />
        <span className="text-rose-600">{error}</span>
      </Screen>
    );
  if (!cards) return <Screen>카드 데이터를 불러오는 중…</Screen>;

  const isAdmin = hash.startsWith("#/admin");
  return isAdmin ? (
    <AdminPage cards={cards} onReload={refresh} />
  ) : (
    <GuidePage cards={cards} />
  );
}
