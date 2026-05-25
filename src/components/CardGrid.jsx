import { CardTile } from "./CardTile";

export const CardGrid = ({
  cards,
  onOpen,
  selectedIds = [],
  onToggleSelect,
  maxSelect = 4,
}) => {
  if (!cards.length) {
    return (
      <div className="bg-white border border-stone-200 rounded-md p-12 text-center">
        <div className="text-sm text-stone-500">조건에 맞는 카드가 없습니다.</div>
        <div className="text-xs text-stone-400 mt-1">
          검색어나 혜택 조건을 줄여 보세요.
        </div>
      </div>
    );
  }

  const canSelectMore = selectedIds.length < maxSelect;

  return (
    <div className="bg-white border border-stone-200 rounded-md divide-y divide-stone-100 overflow-hidden">
      {cards.map((c) => (
        <CardTile
          key={c.id}
          card={c}
          onOpen={onOpen}
          selected={selectedIds.includes(c.id)}
          onToggleSelect={onToggleSelect}
          canSelectMore={canSelectMore}
        />
      ))}
    </div>
  );
};
