import React, { createContext, useContext, useState } from 'react';
import type { UploadedFile } from '../types';

interface FileContextType {
  uploadedFiles: UploadedFile[];
  addFile: (file: UploadedFile) => void;
  removeFile: (id: string) => void;
  getFileById: (id: string) => UploadedFile | undefined;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFiles = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const addFile = (file: UploadedFile) => {
    setUploadedFiles(prev => {
      // Replace file if same type already exists
      const filtered = prev.filter(f => f.type !== file.type);
      return [...filtered, file];
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const getFileById = (id: string) => {
    return uploadedFiles.find(f => f.id === id);
  };

  return (
    <FileContext.Provider value={{ uploadedFiles, addFile, removeFile, getFileById }}>
      {children}
    </FileContext.Provider>
  );
};