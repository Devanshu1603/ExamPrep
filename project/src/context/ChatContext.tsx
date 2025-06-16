// src/context/ChatContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type { ChatSession, ChatMessage } from '../types';
import {
  collection,
  setDoc,
  doc,
  updateDoc,
  onSnapshot,
  arrayUnion,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';

interface ChatContextType {
  sessions: ChatSession[];
  activeSession: string | null;
  setActiveSession: (id: string | null) => void;
  createNewSession: () => Promise<string>;
  addMessageToSession: (sessionId: string, message: ChatMessage) => Promise<void>;
  updateSessionTitle: (sessionId: string, title: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
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

  // Fetch all sessions from Firestore
  useEffect(() => {
    const q = query(collection(db, 'sessions'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedSessions: ChatSession[] = [];
      querySnapshot.forEach((doc) => {
        loadedSessions.push(doc.data() as ChatSession);
      });
      setSessions(loadedSessions);
    });

    return () => unsubscribe();
  }, []);

  // Create a new session and store it in Firestore
  const createNewSession = async (): Promise<string> => {
    const id = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id,
      title: 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [],
    };

    await setDoc(doc(db, 'sessions', id), newSession);
    setActiveSession(id);
    return id;
  };

  // Add a message to a session
  const addMessageToSession = async (sessionId: string, message: ChatMessage) => {
    const sessionRef = doc(db, 'sessions', sessionId);
    await updateDoc(sessionRef, {
      messages: arrayUnion(message),
      updatedAt: Date.now(),
    });
  };

  // Update the session title
  const updateSessionTitle = async (sessionId: string, title: string) => {
    const sessionRef = doc(db, 'sessions', sessionId);
    await updateDoc(sessionRef, {
      title,
      updatedAt: Date.now(),
    });
  };

  // Delete a session
  const deleteSession = async (sessionId: string) => {
    await deleteDoc(doc(db, 'sessions', sessionId));
    if (activeSession === sessionId) {
      setActiveSession(null);
    }
  };

  // Get messages of a session (from local state)
  const getSessionMessages = (sessionId: string): ChatMessage[] => {
    const session = sessions.find((s) => s.id === sessionId);
    return session?.messages || [];
  };

  const value: ChatContextType = {
    sessions,
    activeSession,
    setActiveSession,
    createNewSession,
    addMessageToSession,
    updateSessionTitle,
    deleteSession,
    getSessionMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
