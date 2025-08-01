/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
// Mock for @tanstack/react-router
import React from "react";

export const Link = ({
  to,
  children,
  className,
  activeProps,
  ...props
}: any) => {
  return React.createElement(
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
};

export const useSearch = () => ({
  search: "",
  page: 1,
  types: [],
  games: [],
});

export const useNavigate = () => (_options: any) => {
  console.log("Navigate called with:", _options);
};
