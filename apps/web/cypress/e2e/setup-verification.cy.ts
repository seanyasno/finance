describe("Setup Verification", () => {
  it("should verify basic app functionality", () => {
    cy.visit("/");

    // Should load the application
    cy.get("body").should("be.visible");

    // Should have the app title
    cy.contains("Poké Playbook").should("be.visible");

    // Should have login and signup links when not authenticated
    cy.contains("Login").should("be.visible");
    cy.contains("Sign up").should("be.visible");
  });

  it("should handle 404 pages gracefully", () => {
    cy.visit("/non-existent-page", { failOnStatusCode: false });

    // Should show page content or redirect
    cy.get("body").should("be.visible");

    // The app should handle this gracefully (either 404 or redirect)
    cy.url().then((url) => {
      // Either stays on non-existent page with error handling
      // or redirects to a valid page
      expect(url).to.match(/localhost:5173/);
    });
  });

  it("should have working navigation links", () => {
    cy.visit("/");

    // Test common navigation links that exist in the app
    const commonRoutes = ["/", "/teams", "/login", "/register"];

    commonRoutes.forEach((route) => {
      cy.visit(route, { failOnStatusCode: false });
      cy.get("body").should("be.visible");
      cy.contains("Poké Playbook").should("be.visible"); // App title should always be there
    });
  });

  it("should show content on homepage", () => {
    cy.visit("/");

    // Should show the app content
    cy.get("body").should("be.visible");

    // Should have the main app structure
    cy.contains("Poké Playbook").should("be.visible");

    // May show loading state or content - just verify it doesn't crash
    cy.wait(1000); // Give time for any async loading
    cy.get("body").should("not.be.empty");
  });
});
