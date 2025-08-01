import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppBar } from "./app-bar";
import { setMockAuthState } from "../../../.storybook/mocks/features";

// This story uses the REAL AppBar component with mocked dependencies
// The mocks are handled via Vite aliases in main.ts

const meta: Meta<typeof AppBar> = {
  title: "Components/AppBar",
  component: AppBar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "AppBar component with navigation and authentication. Uses the real AppBar component with mocked dependencies.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  decorators: [
    (Story) => {
      setMockAuthState({ user: null, loading: false });
      return <Story />;
    },
  ],
};

export const Loading: Story = {
  decorators: [
    (Story) => {
      setMockAuthState({ user: null, loading: true });
      return <Story />;
    },
  ],
};

export const LoggedIn: Story = {
  decorators: [
    (Story) => {
      setMockAuthState({
        user: { id: "1", email: "user@example.com" },
        loading: false,
      });
      return <Story />;
    },
  ],
};
