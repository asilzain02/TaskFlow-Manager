/// <reference types="cypress" />

describe('Finance Management', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/finance');
    });
  
    it('should display finance page', () => {
      cy.contains('Finance').should('be.visible');
      cy.contains('Master your financial workflow').should('be.visible');
    });
  
    it('should display monthly stats cards', () => {
      cy.contains('Monthly Income').should('be.visible');
      cy.contains('Monthly Expenses').should('be.visible');
      cy.contains('Monthly Balance').should('be.visible');
      cy.contains('Transactions').should('be.visible');
    });
  
    it('should open transaction creation modal', () => {
      cy.contains('button', 'Add Transaction').click();
      cy.contains('Add New Transaction').should('be.visible');
      cy.get('input[value="income"]').should('exist');
      cy.get('input[value="expense"]').should('exist');
    });
  
    it('should create an income transaction', () => {
      cy.createTransaction({
        type: 'income',
        amount: 5000,
        category: 'Salary',
        description: 'Monthly salary payment'
      });
  
      cy.contains('Salary').should('be.visible');
      cy.contains('5,000').should('be.visible');
    });
  
    it('should create an expense transaction', () => {
      cy.createTransaction({
        type: 'expense',
        amount: 2500,
        category: 'Food & Dining',
        description: 'Grocery shopping'
      });
  
      cy.contains('Food & Dining').should('be.visible');
      cy.contains('2,500').should('be.visible');
    });
  
    it('should require amount and category', () => {
      cy.contains('button', 'Add Transaction').click();
      cy.contains('button', 'Add Transaction').last().click();
      
      // Form should not submit without required fields
      cy.contains('Add New Transaction').should('be.visible');
    });
  
    it('should edit a transaction', () => {
      cy.createTransaction({
        type: 'expense',
        amount: 1000,
        category: 'Shopping'
      });
  
      // Click edit button
      cy.contains('Shopping').parent().parent().within(() => {
        cy.get('button[class*="Edit"]').parent().click();
      });
  
      // Update amount
      cy.get('input[name="amount"]').clear().type('1500');
      cy.contains('button', 'Update Transaction').click();
  
      // Verify updated transaction
      cy.contains('1,500').should('be.visible');
    });
  
    it('should delete a transaction', () => {
      cy.createTransaction({
        type: 'income',
        amount: 3000,
        category: 'Freelance'
      });
  
      // Click delete button
      cy.contains('Freelance').parent().parent().within(() => {
        cy.get('button[class*="Trash"]').parent().click();
      });
  
      // Confirm deletion
      cy.on('window:confirm', () => true);
  
      // Transaction should be removed
      cy.wait(1000);
      cy.contains('Freelance').should('not.exist');
    });
  
    it('should filter transactions by type', () => {
      cy.createTransaction({
        type: 'income',
        amount: 4000,
        category: 'Salary'
      });
  
      cy.createTransaction({
        type: 'expense',
        amount: 1500,
        category: 'Bills & Utilities'
      });
  
      // Filter by income
      cy.get('select[class*="border"]').first().select('Income');
      cy.contains('Salary').should('be.visible');
      cy.contains('Bills & Utilities').should('not.exist');
  
      // Filter by expenses
      cy.get('select[class*="border"]').first().select('Expenses');
      cy.contains('Bills & Utilities').should('be.visible');
      cy.contains('Salary').should('not.exist');
    });
  
    it('should search transactions', () => {
      cy.createTransaction({
        type: 'expense',
        amount: 800,
        category: 'Entertainment',
        description: 'Movie tickets'
      });
  
      cy.createTransaction({
        type: 'expense',
        amount: 1200,
        category: 'Transportation'
      });
  
      // Search for specific transaction
      cy.get('input[placeholder*="Search"]').type('Entertainment');
      cy.contains('Entertainment').should('be.visible');
      cy.contains('Transportation').should('not.exist');
    });
  
    it('should display currency in rupees', () => {
      cy.createTransaction({
        type: 'income',
        amount: 10000,
        category: 'Bonus'
      });
  
      cy.contains('10,000').should('be.visible');
    });
  
    it('should cancel transaction creation', () => {
      cy.contains('button', 'Add Transaction').click();
      cy.get('input[name="amount"]').type('1000');
      cy.contains('button', 'Cancel').click();
      
      // Modal should close
      cy.contains('Add New Transaction').should('not.exist');
    });
  
    it('should validate amount is positive', () => {
      cy.contains('button', 'Add Transaction').click();
      cy.get('input[name="amount"]').type('-100');
      cy.get('select[name="category"]').select('Shopping');
      
      // Negative amounts should not be accepted
      cy.get('input[name="amount"]').should('have.attr', 'min', '0');
    });
  
    it('should show transaction count', () => {
      cy.contains('Showing').should('be.visible');
      cy.contains('transactions').should('be.visible');
    });
  });