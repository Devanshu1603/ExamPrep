import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { useFiles } from '../../context/FileContext';
import { useChat } from '../../context/ChatContext';
import type { ChatMessage as ChatMessageType } from '../../types';

const EXAMPLE_PROMPTS = [
  "📚 Summarize the syllabus and highlight key topics",
  "📝 What are the most important topics from previous year papers?",
  "🎯 Based on the pattern, what topics might come in this year's exam?",
  "📊 Create a study plan based on the syllabus",
  "❓ Generate practice questions from important topics"
];

const ChatInterface: React.FC = () => {
  const [isTyping, setIsTyping] = useState(false);
  const { uploadedFiles } = useFiles();
  const { activeSession, getSessionMessages, addMessageToSession } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messages = activeSession ? getSessionMessages(activeSession) : [];
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  const handleSendMessage = async (content: string) => {
    if (!activeSession) return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      content,
      role: 'user',
      timestamp: Date.now(),
    };
    
    addMessageToSession(activeSession, userMessage);
    setIsTyping(true);
    
    try {
      const response = await fetch('http://13.60.137.213:8000/query/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: content }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const botMessage: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        content: data.response || data.answer || 'No response received',
        role: 'assistant',
        timestamp: Date.now(),
      };
      
      addMessageToSession(activeSession, botMessage);
    } catch (error) {
      console.error('Error querying:', error);
      
      const errorMessage: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        content: 'Sorry, I encountered an error processing your request. Please make sure the backend server is running.',
        role: 'assistant',
        timestamp: Date.now(),
      };
      
      addMessageToSession(activeSession, errorMessage);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  if (!activeSession) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Chat Selected</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Click "New Chat" to start a new conversation or select an existing chat from the sidebar.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">Ready to help with your exam prep!</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                {uploadedFiles.length > 0 
                  ? `I've analyzed your uploaded files (${uploadedFiles.map(f => f.name).join(', ')}). Ask me anything about your study materials!`
                  : 'Ask me anything about your studies or upload some files to get personalized assistance.'
                }
              </p>
              
              {uploadedFiles.length > 0 && (
                <div className="grid gap-3">
                  {EXAMPLE_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(prompt)}
                      className="p-4 text-left rounded-lg border border-neutral-200 dark:border-neutral-700 
                               hover:border-primary-500 dark:hover:border-primary-500 hover:bg-primary-50 
                               dark:hover:bg-primary-900/20 transition-colors duration-200"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatInterface;