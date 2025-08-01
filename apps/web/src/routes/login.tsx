import React, { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features";

const LoginComponent: React.FC = () => {
  useEffect(() => {
    document.title = "Login - Poke Playbook";

    const setMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    setMetaTag(
      "description",
      "Sign in to your Poke Playbook account to access your saved Pokémon teams, create new lineups, and manage your collection.",
    );
    setMetaTag(
      "keywords",
      "login, sign in, pokemon teams, account access, user authentication",
    );
    setMetaTag("robots", "noindex, nofollow");
  }, []);

  return <LoginPage />;
};

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});
