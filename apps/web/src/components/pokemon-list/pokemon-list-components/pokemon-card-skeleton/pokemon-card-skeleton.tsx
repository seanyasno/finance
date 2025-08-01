export const PokemonCardSkeleton: React.FC = () => (
  <div className="w-80 h-96 bg-base-200 rounded-2xl animate-pulse">
    <div className="h-48 bg-base-300 rounded-t-2xl"></div>
    <div className="p-6">
      <div className="h-6 bg-base-300 rounded w-3/4 mb-4"></div>
      <div className="flex gap-2">
        <div className="h-6 bg-base-300 rounded w-16"></div>
        <div className="h-6 bg-base-300 rounded w-16"></div>
      </div>
    </div>
  </div>
);
