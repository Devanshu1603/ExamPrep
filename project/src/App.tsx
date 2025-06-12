import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider, useChat } from './context/ChatContext';
import { FileProvider } from './context/FileContext';
import { useAuth } from './context/AuthContext';

import AuthPage from './components/auth/AuthPage';
import MainLayout from './components/layout/MainLayout';
import WelcomePanel from './components/welcome/WelcomePanel';
import ChatInterface from './components/chat/ChatInterface';
import YouTubeSummarizer from './components/features/YouTubeSummarizer';
import BookCompanion from './components/features/BookCompanion';

// Split out the logic that depends on ChatProvider into its own component
const ChatFeatureRouter: React.FC<{
  activeFeature: 'chat' | 'youtube' | 'book' | 'upload' | null;
  setActiveFeature: React.Dispatch<React.SetStateAction<'chat' | 'youtube' | 'book' | 'upload' | null>>;
}> = ({ activeFeature, setActiveFeature }) => {
  const { createNewSession, setActiveSession } = useChat();

  const handleStart = () => {
    const newSessionId = createNewSession();
    setActiveSession(newSessionId);
    setActiveFeature('chat');
  };

  const handleBookChatStart = () => {
    const newSessionId = createNewSession();
    setActiveSession(newSessionId);
    setActiveFeature('chat');
  };

  const renderFeature = () => {
    switch (activeFeature) {
      case 'chat':
        return <ChatInterface />;
      case 'youtube':
        return <YouTubeSummarizer />;
      case 'book':
        return <BookCompanion onStartChat={handleBookChatStart} />;
      case 'upload':
      default:
        return <WelcomePanel onStart={handleStart} />;
    }
  };

  return (
    <MainLayout onFeatureSelect={setActiveFeature}>
      {renderFeature()}
    </MainLayout>
  );
};

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeFeature, setActiveFeature] = React.useState<'chat' | 'youtube' | 'book' | 'upload' | null>('upload');

  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <ChatProvider>
      <FileProvider>
        <ChatFeatureRouter
          activeFeature={activeFeature}
          setActiveFeature={setActiveFeature}
        />
      </FileProvider>
    </ChatProvider>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
