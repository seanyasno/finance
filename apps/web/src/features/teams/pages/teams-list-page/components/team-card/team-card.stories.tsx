import type { Meta, StoryObj } from "@storybook/react-vite";
import { TeamCard } from "@/features";

// This story uses the REAL TeamCard component with mocked dependencies
// The mocks are handled via Vite aliases in main.ts

const meta: Meta<typeof TeamCard> = {
  title: "Features/Teams/TeamCard",
  component: TeamCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "TeamCard component for displaying team information. Uses the real TeamCard component with mocked dependencies.",
      },
    },
  },
  argTypes: {
    team: {
      control: "object",
      description: "Team object to display",
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8 bg-base-200 min-h-screen">
        <div className="max-w-sm mx-auto">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const EmptyTeam: Story = {
  args: {
    team: {
      id: "1",
      name: "My First Team",
      description: "A team for beginners exploring the Pokémon world",
      user_id: "user-1",
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
      team_pokemon: [],
    },
  },
};

export const PartialTeam: Story = {
  args: {
    team: {
      id: "2",
      name: "Electric Squad",
      description:
        "A powerful team focused on Electric-type Pokémon with high speed and special attack stats",
      user_id: "user-1",
      created_at: "2024-01-10T08:15:00Z",
      updated_at: "2024-01-12T14:22:00Z",
      team_pokemon: [
        {
          id: "tp-1",
          pokemon_id: 25,
          pokemon_name: "pikachu",
          nickname: "Sparky",
          position: 1,
          created_at: "2024-01-10T08:15:00Z",
        },
        {
          id: "tp-2",
          pokemon_id: 26,
          pokemon_name: "raichu",
          nickname: null,
          position: 2,
          created_at: "2024-01-10T08:16:00Z",
        },
        {
          id: "tp-3",
          pokemon_id: 135,
          pokemon_name: "jolteon",
          nickname: "Lightning",
          position: 3,
          created_at: "2024-01-10T08:17:00Z",
        },
      ],
    },
  },
};

export const FullTeam: Story = {
  args: {
    team: {
      id: "3",
      name: "Champion Squad",
      description:
        "My ultimate team for challenging the Elite Four and Pokemon League Champions",
      user_id: "user-1",
      created_at: "2024-01-05T12:00:00Z",
      updated_at: "2024-01-14T16:45:00Z",
      team_pokemon: [
        {
          id: "tp-4",
          pokemon_id: 6,
          pokemon_name: "charizard",
          nickname: "Blaze",
          position: 1,
          created_at: "2024-01-05T12:00:00Z",
        },
        {
          id: "tp-5",
          pokemon_id: 9,
          pokemon_name: "blastoise",
          nickname: "Aqua",
          position: 2,
          created_at: "2024-01-05T12:01:00Z",
        },
        {
          id: "tp-6",
          pokemon_id: 3,
          pokemon_name: "venusaur",
          nickname: "Forest",
          position: 3,
          created_at: "2024-01-05T12:02:00Z",
        },
        {
          id: "tp-7",
          pokemon_id: 25,
          pokemon_name: "pikachu",
          nickname: "Thunder",
          position: 4,
          created_at: "2024-01-05T12:03:00Z",
        },
        {
          id: "tp-8",
          pokemon_id: 143,
          pokemon_name: "snorlax",
          nickname: "Tank",
          position: 5,
          created_at: "2024-01-05T12:04:00Z",
        },
        {
          id: "tp-9",
          pokemon_id: 150,
          pokemon_name: "mewtwo",
          nickname: "Psychic",
          position: 6,
          created_at: "2024-01-05T12:05:00Z",
        },
      ],
    },
  },
};

export const LongTeamName: Story = {
  args: {
    team: {
      id: "4",
      name: "Super Ultra Legendary Mega Evolution Championship Team",
      description: null,
      user_id: "user-1",
      created_at: "2024-01-20T14:30:00Z",
      updated_at: "2024-01-20T14:30:00Z",
      team_pokemon: [
        {
          id: "tp-10",
          pokemon_id: 149,
          pokemon_name: "dragonite",
          nickname: "Dragon",
          position: 1,
          created_at: "2024-01-20T14:30:00Z",
        },
      ],
    },
  },
};
