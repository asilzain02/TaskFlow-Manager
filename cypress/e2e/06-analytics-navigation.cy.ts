/// <reference types="cypress" />

describe('Analytics and Navigation', () => {
    beforeEach(() => {
      cy.login();
    });
  
    describe('Analytics Page', () => {
      beforeEach(() => {
        cy.visit('/analytics');
      });
  
      it('should display analytics page', () => {
        cy.contains('Analytics').should('be.visible');
        cy.contains('Insights into your productivity').should('be.visible');
      });
  
      it('should display time range selector', () => {
        cy.contains('button', 'Week').should('be.visible');
        cy.contains('button', 'Month').should('be.visible');
        cy.contains('button', 'Year').should('be.visible');
      });
  
      it('should display summary cards', () => {
        cy.contains('Total Income').should('be.visible');
        cy.contains('Total Expenses').should('be.visible');
        cy.contains('Net Balance').should('be.visible');
      });
  
      it('should switch time ranges', () => {
        cy.contains('button', 'Week').click();
        cy.contains('button', 'Week').should('have.class', 'bg-blue-600');
  
        cy.contains('button', 'Month').click();
        cy.contains('button', 'Month').should('have.class', 'bg-blue-600');
  
        cy.contains('button', 'Year').click();
        cy.contains('button', 'Year').should('have.class', 'bg-blue-600');
      });
  
      it('should display charts', () => {
        cy.contains('Expenses by Category').should('be.visible');
        cy.contains('Income by Source').should('be.visible');
      });
    });
  
    describe('Profile Page', () => {
      beforeEach(() => {
        cy.visit('/profile');
      });
  
      it('should display profile page', () => {
        cy.contains('Profile').should('be.visible');
        cy.contains('Manage your account settings').should('be.visible');
      });
  
      it('should display profile information', () => {
        cy.contains('Profile Information').should('be.visible');
        cy.get('input[name="fullName"]').should('be.visible');
        cy.get('input[name="email"]').should('be.visible');
      });
  
      it('should enable edit mode', () => {
        cy.contains('button', 'Edit Profile').click();
        cy.get('input[name="fullName"]').should('not.be.disabled');
      });
  
      it('should update profile name', () => {
        cy.contains('button', 'Edit Profile').click();
        cy.get('input[name="fullName"]').clear().type('Updated User Name');
        cy.contains('button', 'Save Changes').click();
        
        // Should show success message
        cy.contains('successfully', { matchCase: false }).should('be.visible');
      });
  
      it('should cancel profile edit', () => {
        cy.contains('button', 'Edit Profile').click();
        cy.get('input[name="fullName"]').clear().type('New Name');
        cy.contains('button', 'Cancel').click();
        
        // Input should be disabled again
        cy.get('input[name="fullName"]').should('be.disabled');
      });
  
      it('should display password change section', () => {
        cy.contains('Change Password').should('be.visible');
        cy.get('input[name="currentPassword"]').should('be.visible');
        cy.get('input[name="newPassword"]').should('be.visible');
        cy.get('input[name="confirmPassword"]').should('be.visible');
      });
    });
  
    describe('Settings Page', () => {
      beforeEach(() => {
        cy.visit('/settings');
      });
  
      it('should display settings page', () => {
        cy.contains('Settings').should('be.visible');
        cy.contains('Customize your WORKLOOP experience').should('be.visible');
      });
  
      it('should display notification settings', () => {
        cy.contains('Notifications').should('be.visible');
        cy.contains('Email Notifications').should('be.visible');
        cy.contains('Push Notifications').should('be.visible');
        cy.contains('Task Reminders').should('be.visible');
        cy.contains('Financial Alerts').should('be.visible');
      });
  
      it('should display appearance settings', () => {
        cy.contains('Appearance').should('be.visible');
        cy.contains('Dark Mode').should('be.visible');
        cy.contains('Language').should('be.visible');
        cy.contains('Timezone').should('be.visible');
      });
  
      it('should display privacy settings', () => {
        cy.contains('Privacy & Security').should('be.visible');
        cy.contains('Public Profile').should('be.visible');
        cy.contains('Data Sharing').should('be.visible');
        cy.contains('Analytics').should('be.visible');
      });
  
      it('should toggle settings', () => {
        // Find first toggle and click it
        cy.get('input[type="checkbox"]').first().then($checkbox => {
          const wasChecked = $checkbox.is(':checked');
          cy.wrap($checkbox).parent().click();
          
          // Verify state changed
          cy.get('input[type="checkbox"]').first().should(
            wasChecked ? 'not.be.checked' : 'be.checked'
          );
        });
      });
    });
  
    describe('Navigation', () => {
      it('should navigate through all pages using sidebar', () => {
        cy.visit('/dashboard');
  
        // Navigate to Tasks
        cy.contains('a', 'Tasks').click();
        cy.url().should('include', '/tasks');
  
        // Navigate to Finance
        cy.contains('a', 'Finance').click();
        cy.url().should('include', '/finance');
  
        // Navigate to Analytics
        cy.contains('a', 'Analytics').click();
        cy.url().should('include', '/analytics');
  
        // Navigate to Notes
        cy.contains('a', 'Notes').click();
        cy.url().should('include', '/notes');
  
        // Navigate to Profile
        cy.contains('a', 'Profile').click();
        cy.url().should('include', '/profile');
  
        // Navigate to Settings
        cy.contains('a', 'Settings').click();
        cy.url().should('include', '/settings');
  
        // Navigate back to Dashboard
        cy.contains('a', 'Dashboard').click();
        cy.url().should('include', '/dashboard');
      });
  
      it('should highlight active page in sidebar', () => {
        cy.visit('/tasks');
        cy.contains('a', 'Tasks').should('have.class', 'bg-blue-600');
  
        cy.visit('/finance');
        cy.contains('a', 'Finance').should('have.class', 'bg-blue-600');
      });
  
      it('should work on mobile navigation', () => {
        cy.viewport('iphone-x');
        cy.visit('/dashboard');
  
        // Open mobile menu
        cy.get('button[class*="Menu"]').click();
  
        // Navigate to tasks
        cy.contains('a', 'Tasks').click();
        cy.url().should('include', '/tasks');
      });
  
      it('should persist user session across navigation', () => {
        cy.visit('/dashboard');
        cy.visit('/tasks');
        cy.visit('/finance');
        
        // Should still be logged in
        cy.url().should('not.include', '/login');
        cy.contains('Dashboard').should('exist');
      });
    });
  });