/// <reference types="cypress" />

Cypress.Commands.add('waitForEditorJS', () => {
  cy.get('[data-cy="editorjs-content"]', { timeout: 10000 }).should('be.visible')
  cy.get('[data-cy="editorjs-content"]').should('not.be.disabled')
})
