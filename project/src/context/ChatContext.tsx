import React, { createContext, useContext, useState } from 'react';
import type { ChatSession, ChatMessage } from '../types';

interface ChatContextType {
  sessions: ChatSession[];
  activeSession: string | null;
  setActiveSession: (id: string | null) => void;
  createNewSession: () => string;
  addMessageToSession: (sessionId: string, message: ChatMessage) => void;
  updateSessionTitle: (sessionId: string, title: string) => void;
  deleteSession: (sessionId: string) => void;
  getSessionMessages: (sessionId: string) => ChatMessage[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);

  const createNewSession = (): string => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };

    setSessions(prev => [newSession, ...prev]);
    return newSession.id;
  };

  const addMessageToSession = (sessionId: string, message: ChatMessage) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [...session.messages, message],
          updatedAt: Date.now()
        };
      }
      return session;
    }));
  };

  const updateSessionTitle = (sessionId: string, title: string) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          title,
          updatedAt: Date.now()
        };
      }
      return session;
    }));
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    if (activeSession === sessionId) {
      setActiveSession(null);
    }
  };

  const getSessionMessages = (sessionId: string): ChatMessage[] => {
    const session = sessions.find(s => s.id === sessionId);
    return session?.messages || [];
  };

  const value = {
    sessions,
    activeSession,
    setActiveSession,
    createNewSession,
    addMessageToSession,
    updateSessionTitle,
    deleteSession,
    getSessionMessages
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};