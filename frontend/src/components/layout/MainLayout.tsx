import React, { useState } from 'react';
import Header from './Header';
import Sidebar from '../sidebar/Sidebar';
import { Menu, X } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  onFeatureSelect: (feature: 'chat' | 'youtube' | 'book') => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onFeatureSelect }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed bottom-4 left-4 z-20 p-3 rounded-full bg-primary-600 text-white shadow-lg"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        
        {/* Sidebar */}
        <div
          className={`fixed md:relative z-10 w-72 h-[calc(100vh-57px)] transition-transform duration-300 transform 
                     ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          <Sidebar onFeatureSelect={onFeatureSelect} />
        </div>
        
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-neutral-900/30 backdrop-blur-sm z-[5] md:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;