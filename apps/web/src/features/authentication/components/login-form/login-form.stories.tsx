import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoginForm } from "@/features";

// This story uses the REAL LoginForm component with mocked dependencies
// The mocks are handled via Vite aliases in main.ts

const meta: Meta<typeof LoginForm> = {
  title: "Features/Authentication/LoginForm",
  component: LoginForm,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "LoginForm component for user authentication. Uses the real LoginForm component with mocked dependencies.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {};

export const WithValidationErrors: Story = {};

export const WithAuthError: Story = {};
