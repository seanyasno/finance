import { Configuration } from "@poke-playbook/api-client";

export const apiConfig = new Configuration({
  basePath: import.meta.env.VITE_API_URL || "http://localhost:3100",
  baseOptions: {
    withCredentials: true,
  },
});
