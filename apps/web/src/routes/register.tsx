import React, { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/features";

const RegisterComponent: React.FC = () => {
  useEffect(() => {
    document.title = "Register - Poke Playbook";

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
      "Create your free Poke Playbook account to start building and saving your custom Pokémon teams. Join the community of Pokémon trainers today!",
    );
    setMetaTag(
      "keywords",
      "register, sign up, create account, pokemon teams, free account, pokemon trainer",
    );
    setMetaTag("robots", "noindex, nofollow");
  }, []);

  return <RegisterPage />;
};

export const Route = createFileRoute("/register")({
  component: RegisterComponent,
});
