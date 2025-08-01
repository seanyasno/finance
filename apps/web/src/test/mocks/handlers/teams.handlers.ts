import { http, HttpResponse } from "msw";
import { mockTeams, createMockTeam } from "../data/teams.mock";
import type { TeamPokemon } from "../../../features/teams/types";

const API_BASE_URL = "http://localhost:3100";

export const teamsHandlers = [
  // Get teams
  http.get(`${API_BASE_URL}/teams`, ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const teams = mockTeams.slice(offset, offset + limit);

    return HttpResponse.json(
      {
        teams,
        total: mockTeams.length,
        limit,
        offset,
      },
      { status: 200 },
    );
  }),

  // Get team by ID
  http.get(`${API_BASE_URL}/teams/:id`, ({ params, request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const team = mockTeams.find((t) => t.id === params.id);
    if (!team) {
      return HttpResponse.json({ message: "Team not found" }, { status: 404 });
    }

    return HttpResponse.json(team, { status: 200 });
  }),

  // Create team
  http.post(`${API_BASE_URL}/teams`, async ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name: string;
      description?: string;
      team_pokemon?: TeamPokemon[];
    };

    // Validate request
    if (!body.name) {
      return HttpResponse.json(
        { message: "Team name is required" },
        { status: 400 },
      );
    }

    if (body.team_pokemon && body.team_pokemon.length > 6) {
      return HttpResponse.json(
        { message: "Team cannot have more than 6 Pokemon" },
        { status: 400 },
      );
    }

    const newTeam = createMockTeam({
      id: `team-${Date.now()}`,
      name: body.name,
      description: body.description,
      team_pokemon: body.team_pokemon || [],
    });

    return HttpResponse.json(newTeam, { status: 201 });
  }),

  // Update team
  http.put(`${API_BASE_URL}/teams/:id`, async ({ params, request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const team = mockTeams.find((t) => t.id === params.id);
    if (!team) {
      return HttpResponse.json({ message: "Team not found" }, { status: 404 });
    }

    const body = (await request.json()) as {
      name: string;
      description?: string;
      team_pokemon?: TeamPokemon[];
    };
    const updatedTeam = { ...team, ...body, updated_at: new Date() };

    return HttpResponse.json(updatedTeam, { status: 200 });
  }),

  // Delete team
  http.delete(`${API_BASE_URL}/teams/:id`, ({ params, request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const team = mockTeams.find((t) => t.id === params.id);
    if (!team) {
      return HttpResponse.json({ message: "Team not found" }, { status: 404 });
    }

    return HttpResponse.json(
      { message: "Team deleted successfully" },
      { status: 200 },
    );
  }),
];
