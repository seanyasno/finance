import { http, HttpResponse } from "msw";
import { mockAuthResponse, mockUser } from "../data/auth.mock";

const API_BASE_URL = "http://localhost:3100";

export const authHandlers = [
  // Login
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === "test@example.com" && body.password === "password") {
      return HttpResponse.json(mockAuthResponse, { status: 200 });
    }

    return HttpResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  }),

  // Register
  http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === "existing@example.com") {
      return HttpResponse.json(
        { message: "User already exists" },
        { status: 409 },
      );
    }

    return HttpResponse.json(mockAuthResponse, { status: 201 });
  }),

  // Get current user
  http.get(`${API_BASE_URL}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return HttpResponse.json({ user: mockUser }, { status: 200 });
  }),

  // Logout
  http.post(`${API_BASE_URL}/auth/logout`, () => {
    return HttpResponse.json(
      { message: "Logged out successfully" },
      { status: 200 },
    );
  }),
];
