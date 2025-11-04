import React, { useState, useEffect } from 'react';
import { X, Save, Palette } from 'lucide-react';
import { Note } from '../../types';
import { useNotifications } from '../../contexts/NotificationContext';

interface NoteFormProps {
  note?: Note | null;
  onSave: (noteData: Partial<Note>) => void;
  onCancel: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ note, onSave, onCancel }) => {
  const { addNotification } = useNotifications();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState<Note['color']>('yellow');

  const colors: { value: Note['color']; label: string; class: string }[] = [
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-200 border-yellow-300' },
    { value: 'blue', label: 'Blue', class: 'bg-blue-200 border-blue-300' },
    { value: 'green', label: 'Green', class: 'bg-green-200 border-green-300' },
    { value: 'pink', label: 'Pink', class: 'bg-pink-200 border-pink-300' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-200 border-purple-300' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-200 border-orange-300' },
  ];

  const commonCategories = [
    'Personal',
    'Work',
    'Ideas',
    'Shopping',
    'Travel',
    'Health',
    'Finance',
    'Learning',
    'Projects',
    'Reminders',
  ];

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content || '');
      setCategory(note.category || '');
      setColor(note.color);
    }
  }, [note]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add notification for note creation/update
    if (!note) {
      addNotification({
        title: 'Note Created',
        message: `Successfully created note: ${title}`,
        type: 'success',
        actionUrl: '/notes'
      });
    } else {
      addNotification({
        title: 'Note Updated',
        message: `Successfully updated note: ${title}`,
        type: 'success',
        actionUrl: '/notes'
      });
    }
    
    onSave({
      title,
      content: content || undefined,
      category: category || undefined,
      color,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {note ? 'Edit Note' : 'Add New Note'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter note title"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Write your note content here..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  list="categories"
                  className="block w-full rounded-md border-gray-300 border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Personal, Work, Ideas"
                />
                <datalist id="categories">
                  {commonCategories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Palette className="inline h-4 w-4 mr-1" />
                Color
              </label>
              <div className="flex space-x-2">
                {colors.map((colorOption) => (
                  <button
                    key={colorOption.value}
                    type="button"
                    onClick={() => setColor(colorOption.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      colorOption.class
                    } ${
                      color === colorOption.value
                        ? 'ring-2 ring-blue-500 ring-offset-2'
                        : 'hover:scale-110'
                    }`}
                    title={colorOption.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className={`p-4 rounded-lg border-2 ${colors.find(c => c.value === color)?.class}`}>
              <h4 className="font-semibold text-gray-900 mb-2">
                {title || 'Note Title'}
              </h4>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {content || 'Note content will appear here...'}
              </p>
              {category && (
                <div className="mt-2 text-xs text-gray-600">
                  Category: {category}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{note ? 'Update' : 'Create'} Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;