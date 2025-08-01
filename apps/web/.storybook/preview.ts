/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { Preview } from "@storybook/react-vite";
import React from "react";
import "../src/index.css";

// Global mocks for all stories
const globalThis = window as any;

// Mock @tanstack/react-router Link component
globalThis.__mockLink = ({
  to,
  children,
  className,
  activeProps,
  ...props
}: any) =>
  React.createElement(
    "a",
    {
      href: to,
      className,
      onClick: (e: Event) => {
        e.preventDefault();
        console.log("Navigate to:", to);
      },
      ...props,
    },
    children,
  );

// Mock @poke-playbook/libs isNotNullOrUndefined
globalThis.__mockIsNotNullOrUndefined = (value: any) => value != null;

// Mock useAuth hook with default values that can be overridden per story
globalThis.__mockUseAuth = () => ({
  user: null,
  loading: false,
  logout: async () => console.log("Logout clicked"),
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
