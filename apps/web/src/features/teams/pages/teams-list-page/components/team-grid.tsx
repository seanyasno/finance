import type { Team } from "@/features";
import { TeamCard } from "./team-card";

type TeamGridProps = {
  teams: Team[];
};

export const TeamGrid: React.FC<TeamGridProps> = ({ teams }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
};
