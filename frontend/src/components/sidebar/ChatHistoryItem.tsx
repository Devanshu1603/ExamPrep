import React from 'react';
import { MessageSquare, Trash2, Edit } from 'lucide-react';
import type { ChatSession } from '../../types';

interface ChatHistoryItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  session,
  isActive,
  onSelect,
  onRename,
  onDelete,
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };
  
  return (
    <div
      className={`group px-3 py-2 rounded-lg cursor-pointer transition-colors mb-1
                ${isActive 
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-900 dark:text-primary-100' 
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
      onClick={() => onSelect(session.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <MessageSquare className="h-4 w-4 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{session.title}</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {formatDate(session.createdAt)} • {session.messages.length} messages
            </p>
          </div>
        </div>
        
        <div className={`flex space-x-1 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRename(session.id);
            }}
            className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
            aria-label="Rename"
          >
            <Edit className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(session.id);
            }}
            className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700"
            aria-label="Delete"
          >
            <Trash2 className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryItem;