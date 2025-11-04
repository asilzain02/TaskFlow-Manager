import React from 'react';
import { Edit, Trash2, Pin, PinOff, Tag, Calendar } from 'lucide-react';
import { Note } from '../../types';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onTogglePin }) => {
  const colorClasses = {
    yellow: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200',
    blue: 'bg-blue-100 border-blue-300 hover:bg-blue-200',
    green: 'bg-green-100 border-green-300 hover:bg-green-200',
    pink: 'bg-pink-100 border-pink-300 hover:bg-pink-200',
    purple: 'bg-purple-100 border-purple-300 hover:bg-purple-200',
    orange: 'bg-orange-100 border-orange-300 hover:bg-orange-200',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer relative ${
      colorClasses[note.color]
    }`}>
      {/* Pin indicator */}
      {note.pinned && (
        <div className="absolute top-2 right-2">
          <Pin className="h-4 w-4 text-gray-600 fill-current" />
        </div>
      )}

      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2 pr-6">
            {note.title}
          </h3>
          {note.content && (
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
              {note.content}
            </p>
          )}
        </div>

        {/* Category and Date */}
        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
          <div className="flex items-center space-x-3">
            {note.category && (
              <div className="flex items-center space-x-1">
                <Tag className="h-3 w-3" />
                <span>{note.category}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(note.updated_at || note.created_at)}</span>
            </div>
          </div>
          <span className="text-gray-500">
            {formatTime(note.updated_at || note.created_at)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-300">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(note.id);
              }}
              className={`p-1 rounded transition-colors ${
                note.pinned
                  ? 'text-blue-600 hover:text-blue-800'
                  : 'text-gray-400 hover:text-blue-600'
              }`}
              title={note.pinned ? 'Unpin note' : 'Pin note'}
            >
              {note.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Edit note"
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;