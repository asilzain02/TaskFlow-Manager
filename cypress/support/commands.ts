/// <reference types="cypress" />
import '@testing-library/cypress/add-commands';

// Custom command for login
Cypress.Commands.add('login', (email?: string, password?: string) => {
  const userEmail = email || Cypress.env('TEST_USER_EMAIL');
  const userPassword = password || Cypress.env('TEST_USER_PASSWORD');

  cy.visit('/login');
  cy.get('input[name="email"]').type(userEmail);
  cy.get('input[name="password"]').type(userPassword);
  cy.get('button[type="submit"]').click();
  
  // Wait for redirect to dashboard
  cy.url().should('include', '/dashboard');
  cy.contains('Dashboard').should('be.visible');
});

// Custom command for logout
Cypress.Commands.add('logout', () => {
  cy.contains('Sign Out').click();
  cy.url().should('include', '/login');
});

// Custom command to register a new user
Cypress.Commands.add('register', (email: string, password: string, fullName: string) => {
  cy.visit('/register');
  cy.get('input[name="fullName"]').type(fullName);
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  
  // Wait for registration to complete
  cy.url().should('include', '/dashboard', { timeout: 15000 });
});

// Custom command to create a task
Cypress.Commands.add('createTask', (task: {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: string;
}) => {
  cy.contains('button', 'Add Task').click();
  cy.get('input[name="title"]').type(task.title);
  
  if (task.description) {
    cy.get('textarea[name="description"]').type(task.description);
  }
  
  if (task.priority) {
    cy.get('select[name="priority"]').select(task.priority);
  }
  
  if (task.category) {
    cy.get('input[name="category"]').type(task.category);
  }
  
  if (task.dueDate) {
    cy.get('input[name="dueDate"]').type(task.dueDate);
  }
  
  cy.contains('button', 'Create Task').click();
  cy.contains(task.title).should('be.visible');
});

// Custom command to create a transaction
Cypress.Commands.add('createTransaction', (transaction: {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date?: string;
}) => {
  cy.contains('button', 'Add Transaction').click();
  
  // Select type
  cy.get(`input[value="${transaction.type}"]`).check();
  
  // Enter amount
  cy.get('input[name="amount"]').type(transaction.amount.toString());
  
  // Select category
  cy.get('select[name="category"]').select(transaction.category);
  
  if (transaction.description) {
    cy.get('input[name="description"]').type(transaction.description);
  }
  
  if (transaction.date) {
    cy.get('input[name="date"]').clear().type(transaction.date);
  }
  
  cy.contains('button', 'Add Transaction').click();
  cy.contains(transaction.category).should('be.visible');
});

// Custom command to create a note
Cypress.Commands.add('createNote', (note: {
  title: string;
  content?: string;
  category?: string;
  color?: string;
}) => {
  cy.contains('button', 'Add Note').click();
  cy.get('input[name="title"]').type(note.title);
  
  if (note.content) {
    cy.get('textarea[name="content"]').type(note.content);
  }
  
  if (note.category) {
    cy.get('input[name="category"]').type(note.category);
  }
  
  if (note.color) {
    cy.get(`button[title="${note.color}"]`).click();
  }
  
  cy.contains('button', 'Create Note').click();
  cy.contains(note.title).should('be.visible');
});

// Custom command to navigate to a page
Cypress.Commands.add('navigateTo', (page: string) => {
  cy.contains('a', page).click();
  cy.url().should('include', page.toLowerCase());
});

// Declare custom commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
      register(email: string, password: string, fullName: string): Chainable<void>;
      createTask(task: {
        title: string;
        description?: string;
        priority?: 'low' | 'medium' | 'high';
        category?: string;
        dueDate?: string;
      }): Chainable<void>;
      createTransaction(transaction: {
        type: 'income' | 'expense';
        amount: number;
        category: string;
        description?: string;
        date?: string;
      }): Chainable<void>;
      createNote(note: {
        title: string;
        content?: string;
        category?: string;
        color?: string;
      }): Chainable<void>;
      navigateTo(page: string): Chainable<void>;
    }
  }
}