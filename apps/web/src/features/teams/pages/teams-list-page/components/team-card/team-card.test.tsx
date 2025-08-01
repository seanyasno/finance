import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TeamCard } from "@/features";
import {
  mockTeam,
  createMockTeam,
} from "../../../../../../test/mocks/data/teams.mock";

// Mock the router Link component
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    className,
    to,
    params,
  }: {
    children: React.ReactNode;
    className?: string;
    to: string;
    params?: Record<string, string>;
  }) => (
    <a
      href={`${to.replace("$teamId", params?.teamId || "")}`}
      className={className}
      role="link"
    >
      {children}
    </a>
  ),
}));

// Mock the TeamCardMenu component directly
vi.mock("../team-card-menu", () => ({
  TeamCardMenu: ({
    teamId,
    teamName,
  }: {
    teamId: string;
    teamName: string;
  }) => (
    <div
      data-testid="team-card-menu"
      data-team-id={teamId}
      data-team-name={teamName}
    >
      <span>Menu</span>
    </div>
  ),
}));

// Mock the PokemonSprites component
vi.mock("../pokemon-sprites", () => ({
  PokemonSprites: ({
    pokemon,
  }: {
    pokemon: Array<{ pokemon_id: number; pokemon_name: string }>;
  }) => (
    <div data-testid="pokemon-sprites" data-pokemon-count={pokemon.length}>
      Pokemon Sprites
    </div>
  ),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderTeamCard = (team = mockTeam) => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <TeamCard team={team} />
    </QueryClientProvider>,
  );
};

describe("TeamCard", () => {
  describe("Team information display", () => {
    it("should render team name", () => {
      renderTeamCard();

      expect(screen.getByText(mockTeam.name)).toBeInTheDocument();
    });

    it("should render team description when provided", () => {
      const teamWithDescription = createMockTeam({
        description: "This is a test team description",
      });

      renderTeamCard(teamWithDescription);

      expect(
        screen.getByText("This is a test team description"),
      ).toBeInTheDocument();
    });

    it("should not render description element when description is null", () => {
      const teamWithoutDescription = createMockTeam({
        description: null,
      });

      renderTeamCard(teamWithoutDescription);

      expect(screen.queryByText(/description/)).not.toBeInTheDocument();
    });

    it("should not render description element when description is empty", () => {
      const teamWithEmptyDescription = createMockTeam({
        description: "",
      });

      renderTeamCard(teamWithEmptyDescription);

      // Should not render the description paragraph
      const paragraphs = screen.queryAllByText((content, element) => {
        return element?.tagName.toLowerCase() === "p" && content.includes("");
      });
      expect(paragraphs).toHaveLength(0);
    });

    it("should display pokemon count correctly", () => {
      const teamWithMultiplePokemon = createMockTeam({
        team_pokemon: [
          {
            id: "1",
            pokemon_id: 25,
            pokemon_name: "pikachu",
            nickname: "Sparky",
            position: 1,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            pokemon_id: 6,
            pokemon_name: "charizard",
            nickname: null,
            position: 2,
            created_at: new Date().toISOString(),
          },
        ],
      });

      renderTeamCard(teamWithMultiplePokemon);

      expect(screen.getByText("2 of 6 Pokémon")).toBeInTheDocument();
    });

    it("should display pokemon count as 0 when no pokemon", () => {
      const teamWithNoPokemon = createMockTeam({
        team_pokemon: [],
      });

      renderTeamCard(teamWithNoPokemon);

      expect(screen.getByText("0 of 6 Pokémon")).toBeInTheDocument();
    });

    it("should display pokemon count as 0 when team_pokemon is undefined", () => {
      const teamWithUndefinedPokemon = createMockTeam({
        team_pokemon: undefined,
      });

      renderTeamCard(teamWithUndefinedPokemon);

      expect(screen.getByText("0 of 6 Pokémon")).toBeInTheDocument();
    });

    it("should display formatted creation date", () => {
      const testDate = new Date("2024-01-15T10:30:00Z");
      const teamWithSpecificDate = createMockTeam({
        created_at: testDate.toISOString(),
      });

      renderTeamCard(teamWithSpecificDate);

      const expectedDate = testDate.toLocaleDateString();
      expect(screen.getByText(`Created ${expectedDate}`)).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("should render as a link to team detail page", () => {
      renderTeamCard();

      const link = screen.getByRole("link", {
        name: new RegExp(mockTeam.name),
      });
      expect(link).toHaveAttribute("href", `/teams/${mockTeam.id}`);
    });

    it("should have correct CSS classes for styling and hover effects", () => {
      renderTeamCard();

      const link = screen.getByRole("link", {
        name: new RegExp(mockTeam.name),
      });
      expect(link).toHaveClass(
        "block",
        "p-6",
        "bg-base-100",
        "border",
        "border-base-300",
        "rounded-lg",
        "hover:bg-base-200/30",
        "transition-colors",
        "group",
      );
    });
  });

  describe("Team card menu", () => {
    it("should render team card menu with correct props", () => {
      renderTeamCard();

      const menu = screen.getByTestId("team-card-menu");
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveAttribute("data-team-id", mockTeam.id);
      expect(menu).toHaveAttribute("data-team-name", mockTeam.name);
    });

    it("should prevent event propagation when clicking menu", async () => {
      renderTeamCard();

      const user = userEvent.setup();
      const menu = screen.getByTestId("team-card-menu");
      const menuContainer = menu.parentElement;

      // The menu container should have onClick handler that prevents default
      expect(menuContainer).toBeInTheDocument();

      // Clicking on menu should not navigate (this is handled by preventDefault in the onClick)
      await user.click(menu);

      // This test verifies the structure, the actual preventDefault behavior
      // would need integration testing with actual router
    });
  });

  describe("Pokemon sprites", () => {
    it("should render pokemon sprites component with correct data", () => {
      const teamWithPokemon = createMockTeam({
        team_pokemon: [
          {
            id: "1",
            pokemon_id: 25,
            pokemon_name: "pikachu",
            nickname: "Sparky",
            position: 1,
            created_at: new Date().toISOString(),
          },
        ],
      });

      renderTeamCard(teamWithPokemon);

      const pokemonSprites = screen.getByTestId("pokemon-sprites");
      expect(pokemonSprites).toBeInTheDocument();
      expect(pokemonSprites).toHaveAttribute("data-pokemon-count", "1");
    });

    it("should pass empty array to pokemon sprites when no pokemon", () => {
      const teamWithNoPokemon = createMockTeam({
        team_pokemon: [],
      });

      renderTeamCard(teamWithNoPokemon);

      const pokemonSprites = screen.getByTestId("pokemon-sprites");
      expect(pokemonSprites).toHaveAttribute("data-pokemon-count", "0");
    });

    it("should pass empty array to pokemon sprites when team_pokemon is undefined", () => {
      const teamWithUndefinedPokemon = createMockTeam({
        team_pokemon: undefined,
      });

      renderTeamCard(teamWithUndefinedPokemon);

      const pokemonSprites = screen.getByTestId("pokemon-sprites");
      expect(pokemonSprites).toHaveAttribute("data-pokemon-count", "0");
    });
  });

  describe("Layout and styling", () => {
    it("should have correct layout structure", () => {
      renderTeamCard();

      // Check header section with title and menu
      const header = screen.getByText(mockTeam.name).closest("div");
      expect(header).toHaveClass(
        "flex",
        "justify-between",
        "items-start",
        "mb-3",
      );

      // Check footer section with stats
      const footer = screen.getByText(/Created/).closest("div");
      expect(footer).toHaveClass(
        "flex",
        "justify-between",
        "items-center",
        "text-xs",
        "text-base-content/50",
        "mt-4",
        "pt-3",
        "border-t",
        "border-base-300",
      );
    });

    it("should apply correct text styling to team name", () => {
      renderTeamCard();

      const teamName = screen.getByText(mockTeam.name);
      expect(teamName).toHaveClass(
        "text-lg",
        "font-medium",
        "text-base-content",
        "group-hover:text-primary",
        "transition-colors",
        "line-clamp-1",
      );
    });

    it("should apply correct text styling to description", () => {
      const teamWithDescription = createMockTeam({
        description: "Test description",
      });

      renderTeamCard(teamWithDescription);

      const description = screen.getByText("Test description");
      expect(description).toHaveClass(
        "text-sm",
        "text-base-content/70",
        "mb-4",
        "line-clamp-2",
        "leading-relaxed",
      );
    });
  });

  describe("Edge cases", () => {
    it("should handle very long team names gracefully", () => {
      const teamWithLongName = createMockTeam({
        name: "This is a very long team name that should be truncated with ellipsis when it exceeds the container width",
      });

      renderTeamCard(teamWithLongName);

      const teamName = screen.getByText(teamWithLongName.name);
      expect(teamName).toHaveClass("line-clamp-1");
    });

    it("should handle very long descriptions gracefully", () => {
      const teamWithLongDescription = createMockTeam({
        description:
          "This is a very long description that should be truncated with ellipsis when it exceeds two lines in the container. It should handle multiple lines of text gracefully and maintain proper spacing.",
      });

      renderTeamCard(teamWithLongDescription);

      const description = screen.getByText(
        teamWithLongDescription.description!,
      );
      expect(description).toHaveClass("line-clamp-2");
    });

    it("should handle invalid dates gracefully", () => {
      const teamWithInvalidDate = createMockTeam({
        created_at: "invalid-date",
      });

      renderTeamCard(teamWithInvalidDate);

      // Should still render something for the date, even if invalid
      expect(screen.getByText(/Created/)).toBeInTheDocument();
    });
  });
});
