/// <reference types="cypress" />

describe('Dashboard', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/dashboard');
    });
  
    it('should display dashboard header', () => {
      cy.contains('Dashboard').should('be.visible');
      cy.contains('Welcome to WORKLOOP').should('be.visible');
    });
  
    it('should display stats cards', () => {
      cy.contains('Total Tasks').should('be.visible');
      cy.contains('Completed Tasks').should('be.visible');
      cy.contains('Monthly Income').should('be.visible');
      cy.contains('Monthly Expenses').should('be.visible');
    });
  
    it('should display quick actions', () => {
      cy.contains('Quick Actions').should('be.visible');
      cy.contains('Add Task').should('be.visible');
      cy.contains('Add Expense').should('be.visible');
      cy.contains('Add Income').should('be.visible');
      cy.contains('Add Note').should('be.visible');
    });
  
    it('should display recent activity section', () => {
      cy.contains('Recent Activity').should('be.visible');
    });
  
    it('should navigate to tasks from quick action', () => {
      cy.contains('button', 'Add Task').click();
      cy.url().should('include', '/tasks');
    });
  
    it('should navigate to finance from quick action', () => {
      cy.contains('button', 'Add Expense').click();
      cy.url().should('include', '/finance');
    });
  
    it('should navigate to notes from quick action', () => {
      cy.contains('button', 'Add Note').click();
      cy.url().should('include', '/notes');
    });
  
    it('should show notification bell', () => {
      cy.get('[class*="Bell"]').parent('button').should('be.visible');
    });
  
    it('should open notifications dropdown', () => {
      cy.get('[class*="Bell"]').parent('button').click();
      cy.contains('Notifications').should('be.visible');
    });
  
    it('should display user name in sidebar', () => {
      cy.contains('Welcome,').should('be.visible');
    });
  
    it('should be responsive on mobile', () => {
      cy.viewport('iphone-x');
      cy.contains('Dashboard').should('be.visible');
      cy.get('button[class*="Menu"]').should('be.visible');
    });
  });