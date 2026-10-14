import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text }) => {
  return (
    <div className="flex flex-col justify-center items-center gap-4 py-8">
      <div className="relative flex justify-center items-center w-20 h-20">
        <div className="absolute h-8 w-8 rounded-full bg-cyan-400 animate-orbit" style={{ animationDelay: '0s' }}></div>
        <div className="absolute h-8 w-8 rounded-full bg-fuchsia-500 animate-orbit" style={{ animationDelay: '0.5s' }}></div>
        <div className="w-12 h-12 border-2 border-dashed rounded-full animate-spin border-gray-500/20 dark:border-white/20" style={{ animationDuration: '4s' }}></div>
      </div>
      {text && <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 animate-pulse">{text}</p>}
      <style>{`
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(35px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(35px) rotate(-360deg); }
        }
      `}</style>
    </div>
  );
};