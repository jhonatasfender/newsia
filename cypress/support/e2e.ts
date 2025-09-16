/// <reference types="cypress" />
import "./commands";

Cypress.on("uncaught:exception", () => {
  return false;
});

beforeEach(() => {
  cy.intercept("POST", "**/auth/v1/token*").as("authRequest");
  cy.intercept("POST", "**/rest/v1/articles*").as("createArticle");
  cy.intercept("PATCH", "**/rest/v1/articles*").as("updateArticle");
  cy.intercept("DELETE", "**/rest/v1/articles*").as("deleteArticle");
});
