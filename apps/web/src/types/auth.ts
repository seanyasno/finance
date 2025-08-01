import { type AuthResponseDtoUserUser } from "@poke-playbook/api-client";

export type AuthError = {
  message: string;
};

export type AuthContextType = {
  user: AuthResponseDtoUserUser | null;
  loading: boolean;
  login: (props: {
    email: string;
    password: string;
  }) => Promise<{ error?: { message: string } | null }>;
  register: (props: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<{ error?: { message: string } | null }>;
  logout: () => Promise<{ error?: { message: string } | null }>;
};
