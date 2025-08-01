import type { Meta, StoryObj } from "@storybook/react-vite";
import { RegisterForm } from "@/features";

// This story uses the REAL RegisterForm component with mocked dependencies
// The mocks are handled via Vite aliases in main.ts

const meta: Meta<typeof RegisterForm> = {
  title: "Features/Authentication/RegisterForm",
  component: RegisterForm,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "RegisterForm component for user registration. Uses the real RegisterForm component with mocked dependencies.",
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

export const Success: Story = {};
