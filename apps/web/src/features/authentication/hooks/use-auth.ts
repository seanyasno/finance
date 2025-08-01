import { createContext, useContext } from "react";
import { isNullOrUndefined } from "@poke-playbook/libs";
import type { AuthContextType } from "../../../types";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (isNullOrUndefined(context)) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
