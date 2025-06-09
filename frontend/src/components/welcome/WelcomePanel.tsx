import React, { useState } from 'react';
import { BrainCircuit, ArrowRight } from 'lucide-react';
import FileUpload from './FileUpload';
import { motion } from 'framer-motion';
import type { UploadedFile } from '../../types';

interface WelcomePanelProps {
  onStart: () => void;
}

const WelcomePanel: React.FC<WelcomePanelProps> = ({ onStart }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFiles(prev => {
      // Replace file if same type already exists
      const filtered = prev.filter(f => f.type !== file.type);
      return [...filtered, file];
    });
  };
  
  const allFilesUploaded = uploadedFiles.length >= 1;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto pt-8 pb-16 px-4"
    >
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full">
            <BrainCircuit className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-3">Your Personal AI Exam Prep Companion</h1>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Upload your learning materials to get started. ExamPrepAI will analyze your content 
          and help you prepare for your exams with personalized assistance.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <FileUpload 
          type="syllabus"
          title="Upload Syllabus"
          description="Add your course syllabus to help AI understand what you're studying."
          onFileUpload={handleFileUpload}
        />
        <FileUpload 
          type="pyq"
          title="Upload Previous Year Papers"
          description="Add past exam papers for pattern analysis and focused prep."
          onFileUpload={handleFileUpload}
        />
        <FileUpload 
          type="notes"
          title="Upload Study Material"
          description="Add your notes or textbooks for AI to understand your content."
          onFileUpload={handleFileUpload}
        />
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onStart}
          disabled={!allFilesUploaded}
          className={`flex items-center space-x-2 py-3 px-6 rounded-xl font-medium text-lg transition-all duration-200
                    ${allFilesUploaded
                      ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                    }`}
        >
          <span>Start Chatting</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      
      {!allFilesUploaded && (
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-4">
          Upload at least one file to get started
        </p>
      )}
    </motion.div>
  );
};

export default WelcomePanel;