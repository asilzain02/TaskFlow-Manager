/// <reference types="cypress" />

describe('Authentication Flow', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
    describe('User Registration', () => {
      it('should show registration form', () => {
        cy.visit('/register');
        cy.contains('Join WORKLOOP').should('be.visible');
        cy.get('input[name="fullName"]').should('be.visible');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('input[name="password"]').should('be.visible');
      });
  
      it('should register a new user successfully', () => {
        const timestamp = Date.now();
        const testEmail = `test${timestamp}@workloop.com`;
        const testPassword = 'Test@123456';
      });
    });
});