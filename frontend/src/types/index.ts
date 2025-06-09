export type FileType = 'syllabus' | 'pyq' | 'notes';

export interface UploadedFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  progress: number;
  file: File;
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