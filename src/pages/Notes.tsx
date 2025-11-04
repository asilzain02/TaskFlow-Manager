import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, StickyNote, Pin, PinOff } from 'lucide-react';
import Header from '../components/Layout/Header';
import NoteCard from '../components/Notes/NoteCard';
import NoteForm from '../components/Notes/NoteForm';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Note } from '../types';

const Notes: React.FC = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user?.id)
        .order('pinned', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async (noteData: Partial<Note>) => {
    try {
      if (editingNote) {
        // Update existing note
        const { error } = await supabase
          .from('notes')
          .update({
            ...noteData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingNote.id);

        if (error) throw error;
      } else {
        // Create new note
        const { error } = await supabase
          .from('notes')
          .insert({
            ...noteData,
            user_id: user?.id,
            pinned: false,
          });

        if (error) throw error;
      }

      fetchNotes();
      setShowForm(false);
      setEditingNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      const note = notes.find(n => n.id === id);
      if (!note) return;

      const { error } = await supabase
        .from('notes')
        .update({
          pinned: !note.pinned,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      fetchNotes();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const categories = Array.from(new Set(notes.map(n => n.category).filter(Boolean)));

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || note.category === filterCategory;
    const matchesPinned = !showPinnedOnly || note.pinned;

    return matchesSearch && matchesCategory && matchesPinned;
  });

  const pinnedNotes = filteredNotes.filter(note => note.pinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.pinned);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Notes" subtitle="Capture ideas and streamline your workflow" />
      
      <div className="p-4 sm:p-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4" />
            <span>Add Note</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded px-2 sm:px-3 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setShowPinnedOnly(!showPinnedOnly)}
            className={`flex items-center space-x-1 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm transition-colors ${
              showPinnedOnly
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
            }`}
          >
            <Pin className="h-3 w-3" />
            <span className="hidden sm:inline">Pinned Only</span>
            <span className="sm:hidden">Pinned</span>
          </button>
          
          <span className="text-xs text-gray-500 ml-auto hidden sm:inline">
            Showing {filteredNotes.length} of {notes.length} notes
          </span>
        </div>

        {/* Notes Grid */}
        <div className="space-y-6">
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && !showPinnedOnly && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Pin className="h-5 w-5 mr-2 text-blue-600" />
                Pinned Notes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={(note) => {
                      setEditingNote(note);
                      setShowForm(true);
                    }}
                    onDelete={handleDeleteNote}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Notes */}
          {unpinnedNotes.length > 0 && !showPinnedOnly && (
            <div>
              {pinnedNotes.length > 0 && (
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Other Notes</h3>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {unpinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={(note) => {
                      setEditingNote(note);
                      setShowForm(true);
                    }}
                    onDelete={handleDeleteNote}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Show all filtered notes when pinned only is active */}
          {showPinnedOnly && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={(note) => {
                    setEditingNote(note);
                    setShowForm(true);
                  }}
                  onDelete={handleDeleteNote}
                  onTogglePin={handleTogglePin}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredNotes.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
              <div className="text-gray-400 mb-4">
                <StickyNote className="h-8 w-8 sm:h-12 sm:w-12 mx-auto" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No notes found</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4">
                {searchTerm || filterCategory !== 'all' || showPinnedOnly
                  ? 'Try adjusting your search or filters'
                  : 'Start capturing your thoughts and ideas'}
              </p>
              {!searchTerm && filterCategory === 'all' && !showPinnedOnly && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create Your First Note
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Note Form Modal */}
      {showForm && (
        <NoteForm
          note={editingNote}
          onSave={handleSaveNote}
          onCancel={() => {
            setShowForm(false);
            setEditingNote(null);
          }}
        />
      )}
    </div>
  );
};

export default Notes;