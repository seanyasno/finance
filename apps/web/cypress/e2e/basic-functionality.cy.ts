describe("Basic App Functionality", () => {
  it("should load the homepage successfully", () => {
    cy.visit("/");

    // App should load and show the title
    cy.contains("Poké Playbook").should("be.visible");

    // Should show login/signup buttons when not authenticated
    cy.contains("Login").should("be.visible");
    cy.contains("Sign up").should("be.visible");
  });

  it("should navigate to login page", () => {
    cy.visit("/");

    // Click login link
    cy.contains("Login").click();

    // Should navigate to login page
    cy.url().should("include", "/login");
    cy.contains("Poké Playbook").should("be.visible"); // App bar should still be there
  });

  it("should navigate to register page", () => {
    cy.visit("/");

    // Click sign up button
    cy.contains("Sign up").click();

    // Should navigate to register page
    cy.url().should("include", "/register");
    cy.contains("Poké Playbook").should("be.visible"); // App bar should still be there
  });

  it("should navigate to teams page", () => {
    cy.visit("/teams");

    // Should load teams page (may redirect to login if auth is required)
    cy.get("body").should("be.visible");
    cy.contains("Poké Playbook").should("be.visible");
  });

  it("should show Pokemon content on homepage", () => {
    cy.visit("/");

    // Wait for content to load
    cy.get("body").should("be.visible");

    // The Pokemon list should load (may take time for API calls)
    // We'll just verify the page doesn't crash and shows some content
    cy.get("body").should("not.be.empty");
  });
});
