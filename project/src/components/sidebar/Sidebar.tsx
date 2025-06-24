import React, { useState } from 'react';
import { PlusCircle, ChevronDown, Youtube, BookOpen, HelpCircle, MessageSquare, Upload } from 'lucide-react';
import ChatHistoryItem from './ChatHistoryItem';
import { useChat } from '../../context/ChatContext';

interface SidebarProps {
  onFeatureSelect: (feature: 'chat' | 'youtube' | 'book' | 'upload' | 'faq') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onFeatureSelect }) => {
  const { sessions, activeSession, setActiveSession, updateSessionTitle, deleteSession } = useChat();
  const [isChatHistoryOpen, setChatHistoryOpen] = useState(true);
  const [isToolsOpen, setToolsOpen] = useState(true);
  
  const handleNewChat = () => {
    // Reset active session and go to upload interface
    setActiveSession(null);
    onFeatureSelect('upload');
  };
  
  const handleRenameSession = (id: string) => {
    const newTitle = prompt('Enter new chat name:');
    if (newTitle) {
      updateSessionTitle(id, newTitle);
    }
  };
  
  const handleDeleteSession = (id: string) => {
    if (confirm('Are you sure you want to delete this chat?')) {
      deleteSession(id);
    }
  };
  
  return (
    <div className="h-full bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
      <div className="p-3">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-primary-600 hover:bg-primary-700 
                   text-white rounded-lg transition-colors duration-200"
        >
          <PlusCircle className="h-5 w-5" />
          <span>New Chat</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-4">
          <button
            onClick={() => setChatHistoryOpen(!isChatHistoryOpen)}
            className="flex items-center justify-between w-full px-2 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>Chat History</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isChatHistoryOpen ? '' : 'transform -rotate-90'}`} />
          </button>
          
          {isChatHistoryOpen && (
            <div className="mt-2">
              {sessions.length === 0 ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 px-3 py-2">
                  No chat history yet
                </p>
              ) : (
                sessions.map((session) => (
                  <ChatHistoryItem
                    key={session.id}
                    session={session}
                    isActive={session.id === activeSession}
                    onSelect={() => {
                      setActiveSession(session.id);
                      onFeatureSelect('chat');
                    }}
                    onRename={handleRenameSession}
                    onDelete={handleDeleteSession}
                  />
                ))
              )}
            </div>
          )}
        </div>
        
        <div>
          <button
            onClick={() => setToolsOpen(!isToolsOpen)}
            className="flex items-center justify-between w-full px-2 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            <span>Tools</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isToolsOpen ? '' : 'transform -rotate-90'}`} />
          </button>
          
          {isToolsOpen && (
            <div className="mt-2 space-y-1">
              <button 
                onClick={() => onFeatureSelect('upload')}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Upload className="h-4 w-4 text-primary-500" />
                <span>Upload Materials</span>
              </button>
              
              <button 
                onClick={() => onFeatureSelect('youtube')}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Youtube className="h-4 w-4 text-error-500" />
                <span>YouTube Summarizer</span>
              </button>
              
              <button 
                onClick={() => onFeatureSelect('book')}
                className="flex items-center space-x-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <BookOpen className="h-4 w-4 text-success-500" />
                <span>Book Companion</span>
              </button>
              
              <button
              onClick={() => onFeatureSelect('faq')}
               className="flex items-center space-x-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <HelpCircle className="h-4 w-4 text-warning-500" />
                <span>FAQ & Help</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
        <div className="px-3 py-2 text-xs text-neutral-500 dark:text-neutral-400">
          <p>ExamPrepAI v0.1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;