/* eslint-disable @typescript-eslint/no-explicit-any, react-refresh/only-export-components */
// Mock for @/features

let mockAuthState: any = {
  user: null,
  loading: false,
  logout: async () => console.log("Logout clicked"),
};

export const useAuth = () => mockAuthState;

// Function to update mock state from stories
export const setMockAuthState = (newState: any) => {
  mockAuthState = { ...mockAuthState, ...newState };
};

// Mock PokemonSprites component
export const PokemonSprites = ({ pokemon }: { pokemon: any[] }) => (
  <div className="flex -space-x-2 overflow-hidden">
    {pokemon.slice(0, 6).map((p, index) => (
      <div
        key={index}
        className="w-10 h-10 bg-base-300 rounded-full flex items-center justify-center text-xs font-medium"
      >
        {p.pokemon_name?.[0]?.toUpperCase() || "P"}
      </div>
    ))}
    {Array.from({ length: 6 - pokemon.length }).map((_, index) => (
      <div
        key={`empty-${index}`}
        className="w-10 h-10 bg-base-200 rounded-full border-2 border-dashed border-base-300"
      />
    ))}
  </div>
);

// Mock TeamCardMenu component
export const TeamCardMenu = ({
  teamId,
  teamName,
}: {
  teamId: string;
  teamName: string;
}) => (
  <div className="dropdown dropdown-end">
    <button
      tabIndex={0}
      className="btn btn-ghost btn-sm"
      onClick={() => console.log("Menu clicked for team:", teamId, teamName)}
    >
      ⋯
    </button>
  </div>
);

// Mock LoginForm component
export const LoginForm = () => (
  <div className="h-full flex items-center justify-center bg-base-200">
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center justify-center mb-6">
          Welcome back to Pokédex (Mock)
        </h2>
        <p className="text-center">This is a mock component for Storybook</p>
      </div>
    </div>
  </div>
);

// Mock RegisterForm component
export const RegisterForm = () => (
  <div className="h-full flex items-center justify-center bg-base-200">
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center justify-center mb-6">
          Join the Pokédex (Mock)
        </h2>
        <p className="text-center">This is a mock component for Storybook</p>
      </div>
    </div>
  </div>
);

// Mock TeamCard component
export const TeamCard = ({ team }: { team: any }) => (
  <div className="block p-6 bg-base-100 border border-base-300 rounded-lg">
    <h3 className="text-lg font-medium text-base-content mb-3">
      {team?.name || "Mock Team"}
    </h3>
    <p className="text-sm text-base-content/70">
      This is a mock TeamCard component for Storybook
    </p>
  </div>
);
