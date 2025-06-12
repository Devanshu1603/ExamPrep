export type FileType = 'syllabus' | 'pyq' | 'notes';

export interface UploadedFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  progress: number;
  file: File;
  fileId?: string; // Backend file ID
  preview?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  userId?: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

export interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';