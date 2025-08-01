import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useCreateTeam } from "./use-create-team";
import { createMockTeam } from "../../../../../test/mocks/data/teams.mock";
import { server } from "../../../../../test/mocks/server";
import { http, HttpResponse } from "msw";

// Mock the router navigation
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
};

describe("useCreateTeam", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    mockNavigate.mockClear();
    vi.clearAllMocks();
  });

  describe("Successful team creation", () => {
    it("should successfully create a team and navigate to team page", async () => {
      const newTeam = createMockTeam({
        id: "new-team-id",
        name: "Test Team",
        description: "Test Description",
      });

      server.use(
        http.post("http://localhost:3100/teams", async ({ request }) => {
          const body = await request.json();
          expect(body).toEqual({
            name: "Test Team",
            description: "Test Description",
            pokemon: [],
          });

          return HttpResponse.json(newTeam, { status: 201 });
        }),
      );

      const { result } = renderHook(() => useCreateTeam(), {
        wrapper: createWrapper(queryClient),
      });

      const createTeamData = {
        name: "Test Team",
        description: "Test Description",
        pokemon: [],
      };

      result.current.mutate(createTeamData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(newTeam);
      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/teams/$teamId",
        params: { teamId: newTeam.id },
      });
    });

    it("should invalidate teams query after successful creation", async () => {
      const newTeam = createMockTeam({
        id: "new-team-id",
        name: "Test Team",
      });

      server.use(
        http.post("http://localhost:3100/teams", () => {
          return HttpResponse.json(newTeam, { status: 201 });
        }),
      );

      const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCreateTeam(), {
        wrapper: createWrapper(queryClient),
      });

      const createTeamData = {
        name: "Test Team",
        description: "Test Description",
        pokemon: [],
      };

      result.current.mutate(createTeamData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["teams"],
      });
    });

    it("should create a team with pokemon", async () => {
      const teamWithPokemon = createMockTeam({
        id: "team-with-pokemon",
        name: "Pokemon Team",
        team_pokemon: [
          {
            id: "team-pokemon-1",
            pokemon_id: 25,
            pokemon_name: "pikachu",
            nickname: "Sparky",
            position: 1,
            created_at: new Date().toISOString(),
          },
        ],
      });

      server.use(
        http.post("http://localhost:3100/teams", async ({ request }) => {
          const body = (await request.json()) as {
            name: string;
            description: string;
            pokemon: Array<{
              pokemon_id: number;
              pokemon_name: string;
              nickname: string;
              position: number;
            }>;
          };
          expect(body.pokemon).toHaveLength(1);
          expect(body.pokemon[0]).toEqual({
            pokemon_id: 25,
            pokemon_name: "pikachu",
            nickname: "Sparky",
            position: 1,
          });

          return HttpResponse.json(teamWithPokemon, { status: 201 });
        }),
      );

      const { result } = renderHook(() => useCreateTeam(), {
        wrapper: createWrapper(queryClient),
      });

      const createTeamData = {
        name: "Pokemon Team",
        description: "Team with Pokemon",
        pokemon: [
          {
            pokemon_id: 25,
            pokemon_name: "pikachu",
            nickname: "Sparky",
            position: 1,
          },
        ],
      };

      result.current.mutate(createTeamData);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(teamWithPokemon);
    });
  });

  describe("Error handling", () => {
    it("should handle validation errors from server", async () => {
      server.use(
        http.post("http://localhost:3100/teams", () => {
          return HttpResponse.json(
            { message: "Team name is required" },
            { status: 400 },
          );
        }),
      );

      const { result } = renderHook(() => useCreateTeam(), {
        wrapper: createWrapper(queryClient),
      });

      const createTeamData = {
        name: "",
        description: "Invalid team",
        pokemon: [],
      };

      result.current.mutate(createTeamData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeTruthy();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should handle unauthorized error", async () => {
      server.use(
        http.post("http://localhost:3100/teams", () => {
          return HttpResponse.json(
            { message: "Unauthorized" },
            { status: 401 },
          );
        }),
      );

      const { result } = renderHook(() => useCreateTeam(), {
        wrapper: createWrapper(queryClient),
      });

      const createTeamData = {
        name: "Test Team",
        description: "Test Description",
        pokemon: [],
      };

      result.current.mutate(createTeamData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should handle server error", async () => {
      server.use(
        http.post("http://localhost:3100/teams", () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      const { result } = renderHook(() => useCreateTeam(), {
        wrapper: createWrapper(queryClient),
      });

      const createTeamData = {
        name: "Test Team",
        description: "Test Description",
        pokemon: [],
      };

      result.current.mutate(createTeamData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should handle missing data in response", async () => {
      server.use(
        http.post("http://localhost:3100/teams", () => {
          return HttpResponse.json(null, { status: 201 });
        }),
      );

      const { result } = renderHook(() => useCreateTeam(), {
        wrapper: createWrapper(queryClient),
      });

      const createTeamData = {
        name: "Test Team",
        description: "Test Description",
        pokemon: [],
      };

      result.current.mutate(createTeamData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(
        new Error("Failed to create team: No data returned from server"),
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it("should handle network error", async () => {
      server.use(
        http.post("http://localhost:3100/teams", () => {
          return HttpResponse.error();
        }),
      );

      const { result } = renderHook(() => useCreateTeam(), {
        wrapper: createWrapper(queryClient),
      });

      const createTeamData = {
        name: "Test Team",
        description: "Test Description",
        pokemon: [],
      };

      result.current.mutate(createTeamData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Loading states", () => {
    it("should show loading state during mutation", async () => {
      server.use(
        http.post("http://localhost:3100/teams", async () => {
          // Add delay to test loading state
          await new Promise((resolve) => setTimeout(resolve, 100));
          return HttpResponse.json(createMockTeam(), { status: 201 });
        }),
      );

      const { result } = renderHook(() => useCreateTeam(), {
        wrapper: createWrapper(queryClient),
      });

      expect(result.current.isPending).toBe(false);

      const createTeamData = {
        name: "Test Team",
        description: "Test Description",
        pokemon: [],
      };

      result.current.mutate(createTeamData);

      // Should show loading state immediately or very soon after
      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
    });
  });

  describe("Input validation", () => {
    it("should validate input data with schema", async () => {
      const { result } = renderHook(() => useCreateTeam(), {
        wrapper: createWrapper(queryClient),
      });

      // Invalid data that should fail schema validation
      const invalidData = {
        name: "", // Empty name should fail validation
        pokemon: [
          {
            pokemon_id: "invalid" as unknown as number, // Should be number but passing string to test validation
            pokemon_name: "pikachu",
            position: 1,
          },
        ],
      };

      result.current.mutate(invalidData);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeTruthy();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
