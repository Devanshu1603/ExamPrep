import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import type { ChatMessage as ChatMessageType } from '../../types';

const EXAMPLE_PROMPTS = [
  "📚 Summarize the syllabus and highlight key topics",
  "📝 What are the most important topics from previous year papers?",
  "🎯 Based on the pattern, what topics might come in this year's exam?",
  "📊 Create a study plan based on the syllabus",
  "❓ Generate practice questions from important topics"
];

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  const handleSendMessage = async (content: string) => {
  const userMessage: ChatMessageType = {
    id: `user-${Date.now()}`,
    content,
    role: 'user',
    timestamp: Date.now(),
  };

  setMessages(prev => [...prev, userMessage]);
  setIsTyping(true);

  try {
    const response = await fetch('http://127.0.0.1:8000/query/pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: content }),
    });

    const data = await response.json();

    const botMessage: ChatMessageType = {
      id: `assistant-${Date.now()}`,
      content: data.response || "Sorry, I couldn't find an answer.",
      role: 'assistant',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, botMessage]);
  } catch (error) {
    console.error("Error fetching answer:", error);
    const errorMsg: ChatMessageType = {
      id: `assistant-${Date.now()}`,
      content: "⚠️ Failed to get a response. Please try again later.",
      role: 'assistant',
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, errorMsg]);
  } finally {
    setIsTyping(false);
  }
};

  
  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };
  
//   const generateResponse = (userMessage: string): string => {
//     const lowerCaseMessage = userMessage.toLowerCase();
    
//     if (lowerCaseMessage.includes('syllabus')) {
//       return `
// ## Syllabus Analysis

// Here's a breakdown of your course syllabus:

// 1. **Core Topics**
//    - Data Structures and Algorithms
//    - Database Management Systems
//    - Operating Systems
//    - Computer Networks

// 2. **Important Concepts**
//    - Time and Space Complexity
//    - SQL and Normalization
//    - Process Management
//    - TCP/IP Protocol Suite

// 3. **Practical Components**
//    - Programming Labs
//    - Database Design Project
//    - Network Configuration

// Would you like me to:
// - Generate practice questions for any topic?
// - Create a study schedule?
// - Explain any concept in detail?
// `;
//     }
    
//     if (lowerCaseMessage.includes('previous year') || lowerCaseMessage.includes('pyq')) {
//       return `
// ## Previous Year Paper Analysis

// Based on the last 3 years' papers:

// **Frequently Asked Topics:**
// - Binary Trees & Graph Algorithms (15-20 marks)
// - Database Normalization (10-15 marks)
// - Operating System Scheduling (10 marks)
// - Network Protocols (10 marks)

// **Question Pattern:**
// - 40% Theory Questions
// - 35% Numerical Problems
// - 25% Design/Implementation

// **Recommendations:**
// 1. Focus on tree and graph problems
// 2. Practice database design scenarios
// 3. Understand OS concepts practically

// Would you like sample questions from any of these topics?
// `;
//     }
    
//     if (lowerCaseMessage.includes('this year')) {
//       return `
// ## Predicted Important Topics

// Based on pattern analysis and current trends:

// 1. **High Probability Topics**
//    - Advanced Data Structures
//    - Cloud Computing Concepts
//    - Microservices Architecture
//    - Machine Learning Basics

// 2. **Focus Areas**
//    - System Design Questions
//    - Performance Optimization
//    - Security Principles
//    - Modern Development Practices

// 3. **Preparation Strategy**
//    - Solve complex DS problems
//    - Study distributed systems
//    - Practice system design
//    - Review latest technologies

// Would you like:
// - Practice questions for these topics?
// - Detailed study material?
// - Mock test papers?
// `;
//     }
    
//     return `I've analyzed your materials. How can I help you with:

// * Understanding specific topics
// * Creating practice questions
// * Making study schedules
// * Comparing related concepts
// * Solving example problems`;
//   };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">Ready to help with your exam prep!</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                Ask me anything about your syllabus, previous year papers, or study materials.
              </p>
              
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