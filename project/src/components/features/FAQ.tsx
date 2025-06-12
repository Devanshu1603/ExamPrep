import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div className="border-b border-neutral-200 dark:border-neutral-800 last:border-0">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full py-4 text-left font-medium"
      >
        <span>{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-neutral-500 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-neutral-600 dark:text-neutral-400">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openItem, setOpenItem] = React.useState<number | null>(0);
  
  const faqItems = [
    {
      question: "What can ExamPrepAI help me with?",
      answer: "ExamPrepAI can assist with understanding complex topics, creating custom practice questions, analyzing your syllabus, summarizing study materials, generating flashcards, and providing exam strategies tailored to your specific courses."
    },
    {
      question: "How do I upload my study materials?",
      answer: "You can upload PDFs of your syllabus, previous year question papers, and study notes through the upload section on the home page. The AI will analyze these documents to provide personalized assistance."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, all uploaded documents and conversations are encrypted and used only to provide you with personalized assistance. Your data is not shared with third parties and you can delete your data at any time."
    },
    {
      question: "Can I ask follow-up questions?",
      answer: "Absolutely! The chat interface is designed for back-and-forth conversation. You can ask follow-up questions, request clarification, or take the conversation in a new direction at any time."
    },
    {
      question: "How accurate is the information provided?",
      answer: "ExamPrepAI provides information based on your uploaded materials and general knowledge. While it strives for accuracy, it's always good practice to verify important information with your official course materials or instructors."
    }
  ];
  
  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };
  
  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Get answers to common questions about ExamPrepAI.
        </p>
      </div>
      
      <div className="card p-5">
        {faqItems.map((item, index) => (
          <FAQItem
            key={index}
            question={item.question}
            answer={item.answer}
            isOpen={openItem === index}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FAQ;