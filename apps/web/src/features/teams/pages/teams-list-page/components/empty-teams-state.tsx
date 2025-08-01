import { Link } from "@tanstack/react-router";
import { IoPeople } from "react-icons/io5";

export const EmptyTeamsState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-8">
        <IoPeople className="w-16 h-16 text-base-content/20" />
      </div>

      <h2 className="text-2xl font-medium mb-3 text-base-content/80">
        No teams yet
      </h2>
      <p className="text-base-content/60 mb-8 max-w-md leading-relaxed">
        Start building your dream Pokémon teams! Create your first team to begin
        your journey.
      </p>

      <Link to="/teams/new" className="btn btn-primary">
        Create your first team
      </Link>
    </div>
  );
};
