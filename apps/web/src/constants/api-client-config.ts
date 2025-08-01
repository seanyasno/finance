import { AuthenticationApi, TeamsApi } from "@poke-playbook/api-client";
import { apiConfig } from "./api-client.ts";

export const authApi = new AuthenticationApi(apiConfig);
export const teamsApi = new TeamsApi(apiConfig);
