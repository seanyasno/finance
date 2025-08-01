// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom commands for authentication
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login");
  cy.waitForPageLoad();

  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();

  // Wait for successful login
  cy.url().should("not.include", "/login");
});

Cypress.Commands.add(
  "register",
  (email: string, password: string, confirmPassword?: string) => {
    cy.visit("/register");
    cy.waitForPageLoad();

    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="confirm-password-input"]').type(
      confirmPassword || password,
    );
    cy.get('[data-testid="register-button"]').click();

    // Wait for successful registration
    cy.url().should("not.include", "/register");
  },
);

Cypress.Commands.add("logout", () => {
  // Click user menu or logout button
  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-button"]').click();

  // Wait for logout to complete
  cy.url().should("include", "/login");
});

Cypress.Commands.add("waitForPageLoad", () => {
  // Wait for the page to be fully loaded
  cy.get("body").should("be.visible");
  // Wait for the app title to appear (indicating the app is loaded)
  cy.contains("Poké Playbook").should("be.visible");
  // Give a small buffer for any async operations
  cy.wait(500);
});
