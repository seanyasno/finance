describe("Authentication Flow (Simple)", () => {
  beforeEach(() => {
    // Clear any existing auth state
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });

  it("should show login form", () => {
    cy.visit("/login");

    // Should show login form elements
    cy.get('[data-testid="email-input"]').should("be.visible");
    cy.get('[data-testid="password-input"]').should("be.visible");
    cy.get('[data-testid="login-button"]').should("be.visible");

    // Should show app title
    cy.contains("Poké Playbook").should("be.visible");
  });

  it("should show validation error for empty login", () => {
    cy.visit("/login");

    // Try to submit empty form
    cy.get('[data-testid="login-button"]').click();

    // Should stay on login page
    cy.url().should("include", "/login");
  });

  it("should show error for invalid credentials", () => {
    cy.visit("/login");

    // Fill with invalid credentials
    cy.get('[data-testid="email-input"]').type("invalid@example.com");
    cy.get('[data-testid="password-input"]').type("wrongpassword");
    cy.get('[data-testid="login-button"]').click();

    // Should show error message (may take a moment for API call)
    cy.get('[data-testid="error-message"]', { timeout: 10000 }).should(
      "be.visible",
    );
  });

  it("should navigate between login and register pages", () => {
    cy.visit("/login");

    // Should have link to register
    cy.contains("Sign up here").click();

    // Should navigate to register page
    cy.url().should("include", "/register");

    // Go back to homepage
    cy.visit("/");

    // Click login from homepage
    cy.contains("Login").click();
    cy.url().should("include", "/login");
  });
});
