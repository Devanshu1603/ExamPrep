import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage: React.FC = () => {
  const { signInWithGoogle, error, clearError } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-4"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full">
              <BrainCircuit className="h-12 w-12 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3">Welcome to ExamPrepAI</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Sign in to access your personal AI exam preparation assistant
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-start">
              <div className="flex-grow">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white dark:bg-neutral-700 
                     text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-600 rounded-lg 
                     hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors duration-200"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;