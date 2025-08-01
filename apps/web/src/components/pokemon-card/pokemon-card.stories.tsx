import { type Meta, type StoryObj } from "@storybook/react-vite";
import { PokemonCard } from "@/components";
import { setMockPokemonData } from "../../../.storybook/mocks/hooks";

// This story uses the REAL PokemonCard component with mocked dependencies
// The mocks are handled via Vite aliases in main.ts

const meta: Meta<typeof PokemonCard> = {
  title: "Components/PokemonCard",
  component: PokemonCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "PokemonCard component with 3D effects and hover animations. Uses the real PokemonCard component with mocked dependencies.",
      },
    },
  },
  argTypes: {
    pokemonName: {
      control: "text",
      description: "Name of the Pokemon to display",
    },
  },
  decorators: [
    (Story) => (
      <div className="flex justify-center items-center min-h-screen bg-base-200 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Pikachu: Story = {
  args: {
    pokemonName: "pikachu",
  },
  decorators: [
    (Story) => {
      setMockPokemonData({
        id: 25,
        name: "pikachu",
        sprites: {
          other: {
            "official-artwork": {
              front_default:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
            },
          },
        },
        types: [
          {
            type: {
              name: "electric",
            },
          },
        ],
      });
      return <Story />;
    },
  ],
};

export const Charizard: Story = {
  args: {
    pokemonName: "charizard",
  },
  decorators: [
    (Story) => {
      setMockPokemonData({
        id: 6,
        name: "charizard",
        sprites: {
          other: {
            "official-artwork": {
              front_default:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
            },
          },
        },
        types: [
          {
            type: {
              name: "fire",
            },
          },
          {
            type: {
              name: "flying",
            },
          },
        ],
      });
      return <Story />;
    },
  ],
};

export const Blastoise: Story = {
  args: {
    pokemonName: "blastoise",
  },
  decorators: [
    (Story) => {
      setMockPokemonData({
        id: 9,
        name: "blastoise",
        sprites: {
          other: {
            "official-artwork": {
              front_default:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
            },
          },
        },
        types: [
          {
            type: {
              name: "water",
            },
          },
        ],
      });
      return <Story />;
    },
  ],
};

export const Venusaur: Story = {
  args: {
    pokemonName: "venusaur",
  },
  decorators: [
    (Story) => {
      setMockPokemonData({
        id: 3,
        name: "venusaur",
        sprites: {
          other: {
            "official-artwork": {
              front_default:
                "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
            },
          },
        },
        types: [
          {
            type: {
              name: "grass",
            },
          },
          {
            type: {
              name: "poison",
            },
          },
        ],
      });
      return <Story />;
    },
  ],
};
