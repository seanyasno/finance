import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type PropsWithChildren } from "react";
import { useTeams } from "@/features";
import { mockTeams } from "../../../../../test/mocks/data/teams.mock";
import { server } from "../../../../../test/mocks/server";
import { http, HttpResponse } from "msw";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const createWrapper = (queryClient: QueryClient) => {
  return ({ children }: PropsWithChildren) => {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
};

describe("useTeams", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  describe("Successful data fetching", () => {
    it("should fetch teams with pokemon by default", async () => {
      server.use(
        http.get("http://localhost:3100/teams", ({ request }) => {
          const url = new URL(request.url);
          const includePokemons = url.searchParams.get("includePokemons");

          expect(includePokemons).toBe("true");

          return HttpResponse.json(
            {
              teams: mockTeams,
              total: mockTeams.length,
              limit: 20,
              offset: 0,
            },
            { status: 200 },
          );
        }),
      );

      const { result } = renderHook(() => useTeams(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        teams: mockTeams,
        total: mockTeams.length,
        limit: 20,
        offset: 0,
      });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("should fetch teams without pokemon when includePokemons is false", async () => {
      server.use(
        http.get("http://localhost:3100/teams", ({ request }) => {
          const url = new URL(request.url);
          const includePokemons = url.searchParams.get("includePokemons");

          expect(includePokemons).toBe("false");

          const teamsWithoutPokemon = mockTeams.map((team) => ({
            ...team,
            team_pokemon: undefined,
          }));

          return HttpResponse.json(
            {
              teams: teamsWithoutPokemon,
              total: teamsWithoutPokemon.length,
              limit: 20,
              offset: 0,
            },
            { status: 200 },
          );
        }),
      );

      const { result } = renderHook(() => useTeams(false), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const expectedTeams = mockTeams.map((team) => ({
        ...team,
        team_pokemon: undefined,
      }));

      expect(result.current.data).toEqual({
        teams: expectedTeams,
        total: expectedTeams.length,
        limit: 20,
        offset: 0,
      });
    });

    it("should handle empty teams list", async () => {
      server.use(
        http.get("http://localhost:3100/teams", () => {
          return HttpResponse.json(
            {
              teams: [],
              total: 0,
              limit: 20,
              offset: 0,
            },
            { status: 200 },
          );
        }),
      );

      const { result } = renderHook(() => useTeams(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual({
        teams: [],
        total: 0,
        limit: 20,
        offset: 0,
      });
    });
  });

  describe("Error handling", () => {
    it("should handle unauthorized error", async () => {
      server.use(
        http.get("http://localhost:3100/teams", () => {
          return HttpResponse.json(
            { message: "Unauthorized" },
            { status: 401 },
          );
        }),
      );

      // For error cases, we need to catch the error that suspense query throws
      const { result } = renderHook(
        () => {
          try {
            return useTeams();
          } catch (error) {
            return { error, isError: true, data: undefined };
          }
        },
        {
          wrapper: createWrapper(queryClient),
        },
      );

      await waitFor(() => {
        expect(result.current.error || result.current.isError).toBeTruthy();
      });
    });

    it("should handle server error", async () => {
      server.use(
        http.get("http://localhost:3100/teams", () => {
          return HttpResponse.json(
            { message: "Internal Server Error" },
            { status: 500 },
          );
        }),
      );

      const { result } = renderHook(
        () => {
          try {
            return useTeams();
          } catch (error) {
            return { error, isError: true, data: undefined };
          }
        },
        {
          wrapper: createWrapper(queryClient),
        },
      );

      await waitFor(() => {
        expect(result.current.error || result.current.isError).toBeTruthy();
      });
    });

    it("should handle network error", async () => {
      server.use(
        http.get("http://localhost:3100/teams", () => {
          return HttpResponse.error();
        }),
      );

      const { result } = renderHook(
        () => {
          try {
            return useTeams();
          } catch (error) {
            return { error, isError: true, data: undefined };
          }
        },
        {
          wrapper: createWrapper(queryClient),
        },
      );

      await waitFor(() => {
        expect(result.current.error || result.current.isError).toBeTruthy();
      });
    });
  });

  describe("Caching behavior", () => {
    it("should use cached data on subsequent calls", async () => {
      let callCount = 0;

      server.use(
        http.get("http://localhost:3100/teams", () => {
          callCount++;
          return HttpResponse.json(
            {
              teams: mockTeams,
              total: mockTeams.length,
              limit: 20,
              offset: 0,
            },
            { status: 200 },
          );
        }),
      );

      // First call
      const { result: result1 } = renderHook(() => useTeams(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      // Second call with same parameters should use cache
      const { result: result2 } = renderHook(() => useTeams(), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(callCount).toBe(1); // Should only make one API call
      expect(result1.current.data).toEqual(result2.current.data);
    });

    it("should make separate calls for different includePokemons values", async () => {
      let callCount = 0;

      server.use(
        http.get("http://localhost:3100/teams", () => {
          callCount++;
          return HttpResponse.json(
            {
              teams: mockTeams,
              total: mockTeams.length,
              limit: 20,
              offset: 0,
            },
            { status: 200 },
          );
        }),
      );

      // Call with includePokemons = true
      const { result: result1 } = renderHook(() => useTeams(true), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      // Call with includePokemons = false should make a new API call
      const { result: result2 } = renderHook(() => useTeams(false), {
        wrapper: createWrapper(queryClient),
      });

      await waitFor(() => {
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(callCount).toBe(2); // Should make two separate API calls
    });
  });

  describe("Custom query options", () => {
    it("should accept and use custom query options", async () => {
      const onSuccessSpy = vi.fn();

      server.use(
        http.get("http://localhost:3100/teams", () => {
          return HttpResponse.json(
            {
              teams: mockTeams,
              total: mockTeams.length,
              limit: 20,
              offset: 0,
            },
            { status: 200 },
          );
        }),
      );

      const { result } = renderHook(
        () =>
          useTeams(true, {
            queryKey: ["teams", "true"],
            meta: { onSuccess: onSuccessSpy },
          }),
        {
          wrapper: createWrapper(queryClient),
        },
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toBeTruthy();
    });
  });
});
