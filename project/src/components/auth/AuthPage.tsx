import React from 'react';
import { BrainCircuit } from 'lucide-react';
import GoogleLoginButton from './GoogleLoginButton';
import { motion } from 'framer-motion';

const AuthPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <BrainCircuit className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">
              ExamPrep<span className="text-primary-600 dark:text-primary-500">AI</span>
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Your Personal Exam Preparation Companion
            </p>
          </div>

          <GoogleLoginButton />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;