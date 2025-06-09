import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import WelcomePanel from './components/welcome/WelcomePanel';
import ChatInterface from './components/chat/ChatInterface';
import LoginPage from './components/auth/LoginPage';
import { useAuth } from './context/AuthContext';
import YouTubeSummarizer from './components/features/YouTubeSummarizer';
import BookCompanion from './components/features/BookCompanion';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = React.useState(true);
  const [activeFeature, setActiveFeature] = React.useState<'chat' | 'youtube' | 'book' | null>(null);

  const handleStart = () => {
    setShowWelcome(false);
    setActiveFeature('chat');
  };

  const handleFeatureSelect = (feature: 'chat' | 'youtube' | 'book') => {
    setActiveFeature(feature);
    setShowWelcome(false);
  };

  const renderFeature = () => {
    switch (activeFeature) {
      case 'chat':
        return <ChatInterface />;
      case 'youtube':
        return <YouTubeSummarizer />;
      case 'book':
        return <BookCompanion />;
      default:
        return null;
    }
  };

  if (!user) {
    return <LoginPage />;
  }

  return (
    <MainLayout onFeatureSelect={handleFeatureSelect}>
      {showWelcome ? (
        <WelcomePanel onStart={handleStart} />
      ) : (
        renderFeature()
      )}
    </MainLayout>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;