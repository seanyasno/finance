type PokemonVersionToggleProps = {
  isShiny: boolean;
  onToggle: (isShiny: boolean) => void;
};

export function PokemonVersionToggle({
  isShiny,
  onToggle,
}: PokemonVersionToggleProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Versions</h3>
      <div className="join">
        <button
          onClick={() => onToggle(false)}
          className={`btn join-item ${!isShiny ? "btn-active" : ""}`}
        >
          Normal
        </button>
        <button
          onClick={() => onToggle(true)}
          className={`btn join-item ${isShiny ? "btn-active" : ""}`}
        >
          Shiny
        </button>
      </div>
    </div>
  );
} 