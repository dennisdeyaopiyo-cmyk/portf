import React from 'react';
import { motion } from 'motion/react';
import { Bot, Sparkles } from 'lucide-react';

interface FloatingAiButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const FloatingAiButton: React.FC<FloatingAiButtonProps> = ({ isOpen, onClick }) => {
  if (isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: [0, -7, 0] // Slower, gentle floating movement
      }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{
        y: {
          duration: 4.8, // Reduced speed - slow & smooth floating
          repeat: Infinity,
          ease: "easeInOut"
        },
        duration: 0.4
      }}
      className="fixed bottom-6 right-6 z-[60] pointer-events-auto"
    >
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.94 }}
        title="Chat with Dennis's AI Assistant"
        className="relative group flex items-center space-x-3 px-5 py-3.5 rounded-full bg-slate-950/95 border-2 border-cyan-400 text-white font-extrabold shadow-[0_0_30px_rgba(6,182,212,0.45)] hover:shadow-[0_0_45px_rgba(6,182,212,0.8)] hover:border-cyan-300 transition-all duration-300 cursor-pointer backdrop-blur-xl"
      >
        {/* Slow ambient outer aura pulse */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-40 blur-md group-hover:opacity-75 transition-opacity pointer-events-none animate-pulse" />

        {/* Neural AI Icon with slow spinning gradient ring */}
        <div className="relative w-7 h-7 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-[1.5px] animate-[spin_8s_linear_infinite]">
            <div className="w-full h-full bg-slate-950 rounded-full" />
          </div>
          <Bot className="w-4 h-4 text-cyan-300 relative z-10 group-hover:scale-110 transition-transform duration-300" />
        </div>

        {/* Label & Active Beacon */}
        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-1.5">
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-cyan-200 transition-colors">
              Ask Dennis AI
            </span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
          </div>
          
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              Online • MMUST Assistant
            </span>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
};
