import type { Meta, StoryObj } from "@storybook/react-vite";
import { PokemonCardSkeleton } from "./pokemon-card-skeleton";

const meta: Meta<typeof PokemonCardSkeleton> = {
  title: "Components/PokemonCardSkeleton",
  component: PokemonCardSkeleton,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Multiple: Story = {
  render: () => (
    <div className="p-8 bg-base-200 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <PokemonCardSkeleton />
        <PokemonCardSkeleton />
        <PokemonCardSkeleton />
        <PokemonCardSkeleton />
        <PokemonCardSkeleton />
        <PokemonCardSkeleton />
      </div>
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};
