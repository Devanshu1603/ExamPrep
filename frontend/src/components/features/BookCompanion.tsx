import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { BookOpen, Upload, FileText, ArrowRight } from 'lucide-react';

const BookCompanion: React.FC = () => {
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setBookFile(acceptedFiles[0]);
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookFile) return;
    
    setIsSubmitting(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsSubmitting(false);
      // In a real app, this would create a new chat with the book context
    }, 2000);
  };
  
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
      
      <form onSubmit={handleSubmit} className="card p-5">
        {!bookFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors
                      ${isDragActive
                        ? 'border-success-500 bg-success-50 dark:bg-success-950/30'
                        : 'border-neutral-300 dark:border-neutral-700 hover:border-success-400 dark:hover:border-success-600'
                      }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-center">
              <Upload className={`h-12 w-12 mb-4 ${isDragActive ? 'text-success-500' : 'text-neutral-400 dark:text-neutral-500'}`} />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop your book here' : 'Drag & drop your book here'}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">or</p>
              <button 
                type="button"
                className="btn-secondary"
              >
                Browse Files
              </button>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
                Supports PDF format (Max 50MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="flex items-center p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
              <FileText className="h-8 w-8 text-neutral-500 dark:text-neutral-400 mr-3" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{bookFile.name}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {(bookFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBookFile(null)}
                className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                Remove
              </button>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || !bookFile}
          className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg font-medium
                    transition-colors duration-200 ${
                      isSubmitting || !bookFile
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                        : 'bg-success-600 hover:bg-success-700 text-white'
                    }`}
        >
          {isSubmitting ? (
            <>
              <span className="animate-pulse">Processing...</span>
            </>
          ) : (
            <>
              <span>Start Book Chat</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BookCompanion;