/// <reference types="cypress" />

describe('Notes Management', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/notes');
    });
  
    it('should display notes page', () => {
      cy.contains('Notes').should('be.visible');
      cy.contains('Capture ideas').should('be.visible');
    });
  
    it('should open note creation modal', () => {
      cy.contains('button', 'Add Note').click();
      cy.contains('Add New Note').should('be.visible');
      cy.get('input[name="title"]').should('be.visible');
      cy.get('textarea[name="content"]').should('be.visible');
    });
  
    it('should create a new note', () => {
      const noteTitle = `Test Note ${Date.now()}`;
      
      cy.createNote({
        title: noteTitle,
        content: 'This is a test note content',
        category: 'Personal'
      });
  
      cy.contains(noteTitle).should('be.visible');
      cy.contains('This is a test note content').should('be.visible');
    });
  
    it('should require title when creating note', () => {
      cy.contains('button', 'Add Note').click();
      cy.contains('button', 'Create Note').click();
      
      // Form should not submit without title
      cy.contains('Add New Note').should('be.visible');
    });
  
    it('should create note with different colors', () => {
      const noteTitle = `Blue Note ${Date.now()}`;
      
      cy.contains('button', 'Add Note').click();
      cy.get('input[name="title"]').type(noteTitle);
      cy.get('button[title="Blue"]').click();
      cy.contains('button', 'Create Note').click();
  
      // Note should exist and have blue color class
      cy.contains(noteTitle).parent().parent().should('have.class', 'bg-blue-100');
    });
  
    it('should pin and unpin a note', () => {
      const noteTitle = `Pin Test ${Date.now()}`;
      
      cy.createNote({
        title: noteTitle,
        content: 'Testing pin functionality'
      });
  
      // Pin the note
      cy.contains(noteTitle).parent().within(() => {
        cy.get('button[title*="Pin"]').click();
      });
  
      // Note should appear in pinned section
      cy.contains('Pinned Notes').should('be.visible');
      cy.contains(noteTitle).should('be.visible');
  
      // Unpin the note
      cy.contains(noteTitle).parent().within(() => {
        cy.get('button[title*="Unpin"]').click();
      });
  
      // Note should move back to regular section
      cy.contains('Other Notes').should('be.visible');
    });
  
    it('should edit an existing note', () => {
      const originalTitle = `Original Note ${Date.now()}`;
      const updatedTitle = `Updated Note ${Date.now()}`;
      
      cy.createNote({
        title: originalTitle,
        content: 'Original content'
      });
  
      // Click edit button
      cy.contains(originalTitle).parent().within(() => {
        cy.get('button[title="Edit note"]').click();
      });
  
      // Update note
      cy.get('input[name="title"]').clear().type(updatedTitle);
      cy.get('textarea[name="content"]').clear().type('Updated content');
      cy.contains('button', 'Update Note').click();
  
      // Verify updated note
      cy.contains(updatedTitle).should('be.visible');
      cy.contains('Updated content').should('be.visible');
      cy.contains(originalTitle).should('not.exist');
    });
  
    it('should delete a note', () => {
      const noteTitle = `Delete Note ${Date.now()}`;
      
      cy.createNote({
        title: noteTitle,
        content: 'This note will be deleted'
      });
  
      // Click delete button
      cy.contains(noteTitle).parent().within(() => {
        cy.get('button[title="Delete note"]').click();
      });
  
      // Confirm deletion
      cy.on('window:confirm', () => true);
  
      // Note should be removed
      cy.contains(noteTitle).should('not.exist');
    });
  
    it('should filter notes by category', () => {
      const workNote = `Work Note ${Date.now()}`;
      const personalNote = `Personal Note ${Date.now()}`;
      
      cy.createNote({
        title: workNote,
        category: 'Work'
      });
  
      cy.createNote({
        title: personalNote,
        category: 'Personal'
      });
  
      // Filter by Work
      cy.get('select[class*="border"]').first().select('Work');
      cy.contains(workNote).should('be.visible');
      cy.contains(personalNote).should('not.exist');
  
      // Filter by Personal
      cy.get('select[class*="border"]').first().select('Personal');
      cy.contains(personalNote).should('be.visible');
      cy.contains(workNote).should('not.exist');
    });
  
    it('should search notes', () => {
      const searchableNote = `Searchable Note ${Date.now()}`;
      const otherNote = `Other Note ${Date.now()}`;
      
      cy.createNote({
        title: searchableNote,
        content: 'Searchable content'
      });
  
      cy.createNote({
        title: otherNote,
        content: 'Different content'
      });
  
      // Search for specific note
      cy.get('input[placeholder*="Search"]').type('Searchable');
      cy.contains(searchableNote).should('be.visible');
      cy.contains(otherNote).should('not.exist');
    });
  
    it('should filter pinned notes only', () => {
      const pinnedNote = `Pinned Note ${Date.now()}`;
      const unpinnedNote = `Unpinned Note ${Date.now()}`;
      
      cy.createNote({
        title: pinnedNote,
        content: 'This will be pinned'
      });
  
      cy.createNote({
        title: unpinnedNote,
        content: 'This stays unpinned'
      });
  
      // Pin first note
      cy.contains(pinnedNote).parent().within(() => {
        cy.get('button[title*="Pin"]').click();
      });
  
      // Filter pinned only
      cy.contains('button', 'Pinned').click();
      cy.contains(pinnedNote).should('be.visible');
      cy.contains(unpinnedNote).should('not.exist');
    });
  
    it('should show note preview', () => {
      cy.createNote({
        title: 'Preview Note',
        content: 'This is preview content',
        category: 'Ideas'
      });
  
      cy.contains('Preview Note').parent().within(() => {
        cy.contains('Preview').should('exist');
      });
    });
  
    it('should cancel note creation', () => {
      cy.contains('button', 'Add Note').click();
      cy.get('input[name="title"]').type('Test Note');
      cy.contains('button', 'Cancel').click();
      
      // Modal should close
      cy.contains('Add New Note').should('not.exist');
    });
  
    it('should display note count', () => {
      cy.contains('Showing').should('be.visible');
      cy.contains('notes').should('be.visible');
    });
  });