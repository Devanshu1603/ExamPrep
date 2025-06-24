// BookCompanion.tsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { BookOpen, Upload, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { useFiles } from '../../context/FileContext';
import type { UploadedFile } from '../../types';

interface BookCompanionProps {
  onStartChat?: () => void;
}

const BookCompanion: React.FC<BookCompanionProps> = ({ onStartChat }) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addFile } = useFiles();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setError(null);

      const newFile: UploadedFile = {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: 'notes',
        size: file.size,
        progress: 0,
        file,
      };

      setUploadedFile(newFile);

      try {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;
          if (progress <= 80) {
            setUploadedFile(prev => prev ? { ...prev, progress } : null);
          }
        }, 200);

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:8000/upload/pdf/', {
          method: 'POST',
          body: formData,
        });

        clearInterval(interval);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        await response.json();

        const completedFile = {
          ...newFile,
          progress: 100,
        };

        setUploadedFile(completedFile);
        addFile(completedFile);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        setUploadedFile(null);
      }
    }
  }, [addFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  });

  const handleStartChat = () => {
    if (uploadedFile && uploadedFile.progress === 100) {
      if (onStartChat) onStartChat();
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
  };

  const formatSize = (bytes: number) =>
    (bytes / (1024 * 1024)).toFixed(2) + ' MB';

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 mb-4">
          <BookOpen className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">Book Companion</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Upload a textbook or study material to chat contextually about its contents.
        </p>
      </div>

      <div className="card p-5">
        {error && (
          <div className="mb-4 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-error-600 dark:text-error-400 mr-2" />
              <p className="text-sm text-error-700 dark:text-error-400">{error}</p>
            </div>
          </div>
        )}

        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors
              ${isDragActive
                ? 'border-success-500 bg-success-50 dark:bg-success-950/30'
                : 'border-neutral-300 dark:border-neutral-700 hover:border-success-400 dark:hover:border-success-600'}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-center">
              <Upload className={`h-12 w-12 mb-4 ${isDragActive ? 'text-success-500' : 'text-neutral-400 dark:text-neutral-500'}`} />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop your book here' : 'Drag & drop your book here'}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">or</p>
              <button type="button" className="btn-secondary">Browse Files</button>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
                Supports PDF format (Max 50MB)
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
                <FileText className="h-8 w-8 text-neutral-500 dark:text-neutral-400 mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{uploadedFile.name}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {formatSize(uploadedFile.size)}{' '}
                    {uploadedFile.progress === 100 && (
                      <span className="ml-2 text-success-600 dark:text-success-400">✓ Uploaded</span>
                    )}
                  </p>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-success-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadedFile.progress}%` }}
                    />
                  </div>
                </div>
                <button onClick={removeFile} className="ml-4 text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200">
                  Remove
                </button>
              </div>
            </div>

            <button
              onClick={handleStartChat}
              disabled={uploadedFile.progress < 100}
              className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg font-medium
                transition-colors duration-200 ${
                  uploadedFile.progress < 100
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                    : 'bg-success-600 hover:bg-success-700 text-white'
                }`}
            >
              <span>Start Book Chat</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookCompanion;
