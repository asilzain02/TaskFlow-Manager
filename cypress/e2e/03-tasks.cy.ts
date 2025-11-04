/// <reference types="cypress" />

describe('Tasks Management', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/tasks');
    });
  
    it('should display tasks page', () => {
      cy.contains('Tasks').should('be.visible');
      cy.contains('Organize your work').should('be.visible');
    });
  
    it('should display add task button', () => {
      cy.contains('button', 'Add Task').should('be.visible');
    });
  
    it('should open task creation modal', () => {
      cy.contains('button', 'Add Task').click();
      cy.contains('Add New Task').should('be.visible');
      cy.get('input[name="title"]').should('be.visible');
    });
  
    it('should create a new task', () => {
      const taskTitle = `Test Task ${Date.now()}`;
      
      cy.createTask({
        title: taskTitle,
        description: 'This is a test task description',
        priority: 'high',
        category: 'Work',
        dueDate: '2025-12-31'
      });
  
      cy.contains(taskTitle).should('be.visible');
      cy.contains('Work').should('be.visible');
    });
  
    it('should require title when creating task', () => {
      cy.contains('button', 'Add Task').click();
      cy.contains('button', 'Create Task').click();
      
      // Form should not submit without title
      cy.contains('Add New Task').should('be.visible');
    });
  
    it('should mark task as complete', () => {
      const taskTitle = `Complete Task ${Date.now()}`;
      
      cy.createTask({
        title: taskTitle,
        priority: 'medium'
      });
  
      // Find and click the checkbox for the task
      cy.contains(taskTitle).parent().parent().within(() => {
        cy.get('button').first().click();
      });
  
      // Task should be marked as completed
      cy.contains(taskTitle).should('have.class', 'line-through');
    });
  
    it('should edit an existing task', () => {
      const originalTitle = `Original Task ${Date.now()}`;
      const updatedTitle = `Updated Task ${Date.now()}`;
      
      cy.createTask({
        title: originalTitle,
        priority: 'low'
      });
  
      // Click edit button
      cy.contains(originalTitle).parent().parent().within(() => {
        cy.get('button[class*="Edit"]').parent().click();
      });
  
      // Update task
      cy.get('input[name="title"]').clear().type(updatedTitle);
      cy.contains('button', 'Update Task').click();
  
      // Verify updated task
      cy.contains(updatedTitle).should('be.visible');
      cy.contains(originalTitle).should('not.exist');
    });
  
    it('should delete a task', () => {
      const taskTitle = `Delete Task ${Date.now()}`;
      
      cy.createTask({
        title: taskTitle,
        priority: 'medium'
      });
  
      // Click delete button
      cy.contains(taskTitle).parent().parent().within(() => {
        cy.get('button[class*="Trash"]').parent().click();
      });
  
      // Confirm deletion
      cy.on('window:confirm', () => true);
  
      // Task should be removed
      cy.contains(taskTitle).should('not.exist');
    });
  
    it('should filter tasks by status', () => {
      const completedTask = `Completed Task ${Date.now()}`;
      const pendingTask = `Pending Task ${Date.now()}`;
      
      cy.createTask({ title: completedTask, priority: 'high' });
      cy.createTask({ title: pendingTask, priority: 'low' });
  
      // Mark first task as complete
      cy.contains(completedTask).parent().parent().within(() => {
        cy.get('button').first().click();
      });
  
      // Filter by completed
      cy.get('select').first().select('Completed');
      cy.contains(completedTask).should('be.visible');
      cy.contains(pendingTask).should('not.exist');
  
      // Filter by pending
      cy.get('select').first().select('Pending');
      cy.contains(pendingTask).should('be.visible');
      cy.contains(completedTask).should('not.exist');
    });
  
    it('should filter tasks by priority', () => {
      const highPriorityTask = `High Priority ${Date.now()}`;
      const lowPriorityTask = `Low Priority ${Date.now()}`;
      
      cy.createTask({ title: highPriorityTask, priority: 'high' });
      cy.createTask({ title: lowPriorityTask, priority: 'low' });
  
      // Filter by high priority
      cy.get('select').eq(1).select('High');
      cy.contains(highPriorityTask).should('be.visible');
      cy.contains(lowPriorityTask).should('not.exist');
  
      // Filter by low priority
      cy.get('select').eq(1).select('Low');
      cy.contains(lowPriorityTask).should('be.visible');
      cy.contains(highPriorityTask).should('not.exist');
    });
  
    it('should search tasks', () => {
      const searchableTask = `Searchable Task ${Date.now()}`;
      const otherTask = `Other Task ${Date.now()}`;
      
      cy.createTask({ title: searchableTask, priority: 'medium' });
      cy.createTask({ title: otherTask, priority: 'low' });
  
      // Search for specific task
      cy.get('input[placeholder*="Search"]').type('Searchable');
      cy.contains(searchableTask).should('be.visible');
      cy.contains(otherTask).should('not.exist');
    });
  
    it('should cancel task creation', () => {
      cy.contains('button', 'Add Task').click();
      cy.get('input[name="title"]').type('Test Task');
      cy.contains('button', 'Cancel').click();
      
      // Modal should close
      cy.contains('Add New Task').should('not.exist');
    });
  
    it('should show validation for priority levels', () => {
      cy.createTask({
        title: 'High Priority Task',
        priority: 'high'
      });
  
      cy.contains('High Priority Task').parent().parent().within(() => {
        cy.contains('high').should('exist');
      });
    });
  });