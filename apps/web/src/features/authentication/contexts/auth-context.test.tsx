import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features";
import { useAuth } from "../hooks";
import { mockUser, mockAuthResponse } from "../../../test/mocks/data/auth.mock";
import { server } from "../../../test/mocks/server";
import { http, HttpResponse } from "msw";

// Test component that uses the auth context
const TestComponent = () => {
  const { user, loading, login, register, logout } = useAuth();

  return (
    <div>
      <div data-testid="loading">{loading ? "Loading" : "Not Loading"}</div>
      <div data-testid="user-email">{user?.email || "No User"}</div>
      <button
        data-testid="login-button"
        onClick={() =>
          login({ email: "test@example.com", password: "password" })
        }
      >
        Login
      </button>
      <button
        data-testid="register-button"
        onClick={() =>
          register({
            email: "new@example.com",
            password: "password",
            firstName: "John",
            lastName: "Doe",
          })
        }
      >
        Register
      </button>
      <button data-testid="logout-button" onClick={() => logout()}>
        Logout
      </button>
    </div>
  );
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithAuthProvider = (queryClient: QueryClient) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </QueryClientProvider>,
  );
};

describe("AuthProvider", () => {
  let queryClient: QueryClient;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Initial auth check", () => {
    it("should show loading state initially", async () => {
      renderWithAuthProvider(queryClient);

      expect(screen.getByTestId("loading")).toHaveTextContent("Loading");
    });

    it("should set user when auth check succeeds", async () => {
      server.use(
        http.get("http://localhost:3100/auth/me", () => {
          return HttpResponse.json({ user: mockUser }, { status: 200 });
        }),
      );

      renderWithAuthProvider(queryClient);

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("Not Loading");
      });

      expect(screen.getByTestId("user-email")).toHaveTextContent(
        mockUser.email,
      );
    });

    it("should handle auth check failure gracefully", async () => {
      server.use(
        http.get("http://localhost:3100/auth/me", () => {
          return HttpResponse.json(
            { message: "Unauthorized" },
            { status: 401 },
          );
        }),
      );

      renderWithAuthProvider(queryClient);

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("Not Loading");
      });

      expect(screen.getByTestId("user-email")).toHaveTextContent("No User");
    });
  });

  describe("Login flow", () => {
    it("should successfully login and set user", async () => {
      server.use(
        http.get("http://localhost:3100/auth/me", () => {
          return HttpResponse.json(
            { message: "Unauthorized" },
            { status: 401 },
          );
        }),
        http.post("http://localhost:3100/auth/login", () => {
          return HttpResponse.json(mockAuthResponse, { status: 200 });
        }),
      );

      renderWithAuthProvider(queryClient);

      // Wait for initial auth check to complete
      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("Not Loading");
      });

      // Initially no user
      expect(screen.getByTestId("user-email")).toHaveTextContent("No User");

      // Click login button
      await user.click(screen.getByTestId("login-button"));

      // Wait for login to complete and user to be set
      await waitFor(() => {
        expect(screen.getByTestId("user-email")).toHaveTextContent(
          mockUser.email,
        );
      });
    });

    it("should handle login failure", async () => {
      server.use(
        http.get("http://localhost:3100/auth/me", () => {
          return HttpResponse.json(
            { message: "Unauthorized" },
            { status: 401 },
          );
        }),
        http.post("http://localhost:3100/auth/login", () => {
          return HttpResponse.json(
            { message: "Invalid credentials" },
            { status: 401 },
          );
        }),
      );

      renderWithAuthProvider(queryClient);

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("Not Loading");
      });

      await user.click(screen.getByTestId("login-button"));

      // User should remain null after failed login
      await waitFor(
        () => {
          expect(screen.getByTestId("user-email")).toHaveTextContent("No User");
        },
        { timeout: 2000 },
      );
    });
  });

  describe("Register flow", () => {
    it("should successfully register and set user", async () => {
      server.use(
        http.get("http://localhost:3100/auth/me", () => {
          return HttpResponse.json(
            { message: "Unauthorized" },
            { status: 401 },
          );
        }),
        http.post("http://localhost:3100/auth/register", () => {
          return HttpResponse.json(mockAuthResponse, { status: 201 });
        }),
      );

      renderWithAuthProvider(queryClient);

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("Not Loading");
      });

      expect(screen.getByTestId("user-email")).toHaveTextContent("No User");

      await user.click(screen.getByTestId("register-button"));

      await waitFor(() => {
        expect(screen.getByTestId("user-email")).toHaveTextContent(
          mockUser.email,
        );
      });
    });

    it("should handle register failure", async () => {
      server.use(
        http.get("http://localhost:3100/auth/me", () => {
          return HttpResponse.json(
            { message: "Unauthorized" },
            { status: 401 },
          );
        }),
        http.post("http://localhost:3100/auth/register", () => {
          return HttpResponse.json(
            { message: "User already exists" },
            { status: 409 },
          );
        }),
      );

      renderWithAuthProvider(queryClient);

      await waitFor(() => {
        expect(screen.getByTestId("loading")).toHaveTextContent("Not Loading");
      });

      await user.click(screen.getByTestId("register-button"));

      await waitFor(
        () => {
          expect(screen.getByTestId("user-email")).toHaveTextContent("No User");
        },
        { timeout: 2000 },
      );
    });
  });

  describe("Logout flow", () => {
    it("should successfully logout and clear user", async () => {
      server.use(
        http.get("http://localhost:3100/auth/me", () => {
          return HttpResponse.json({ user: mockUser }, { status: 200 });
        }),
        http.post("http://localhost:3100/auth/logout", () => {
          return HttpResponse.json(
            { message: "Logged out successfully" },
            { status: 200 },
          );
        }),
      );

      renderWithAuthProvider(queryClient);

      // Wait for initial auth check and user to be set
      await waitFor(() => {
        expect(screen.getByTestId("user-email")).toHaveTextContent(
          mockUser.email,
        );
      });

      await user.click(screen.getByTestId("logout-button"));

      await waitFor(() => {
        expect(screen.getByTestId("user-email")).toHaveTextContent("No User");
      });
    });
  });

  describe("useAuth hook", () => {
    it("should throw error when used outside of AuthProvider", () => {
      const TestComponentWithoutProvider = () => {
        useAuth();
        return <div>Test</div>;
      };

      // Suppress console.error for this test since we're expecting an error
      const originalError = console.error;
      console.error = vi.fn();

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow("useAuth must be used within an AuthProvider");

      console.error = originalError;
    });
  });
});
