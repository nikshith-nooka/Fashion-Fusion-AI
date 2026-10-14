import React from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '../contexts/ProfileContext';
import type { View } from '../App';

const FeatureCard: React.FC<{
  title: string;
  description: string;
  buttonText: string;
  icon: JSX.Element;
  onClick: () => void;
  className?: string;
}> = ({ title, description, buttonText, icon, onClick, className }) => {
  return (
    <motion.div 
      className={`bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-300 dark:border-white/10 p-6 rounded-2xl flex flex-col items-start shadow-lg hover:border-gray-400 dark:hover:border-white/20 transition-colors duration-300 ${className}`}
      whileHover={{ y: -5 }}
    >
      <div className="w-12 h-12 bg-black/5 dark:bg-white/10 rounded-lg flex items-center justify-center mb-4 text-cyan-500 dark:text-cyan-300">{icon}</div>
      <h3 className="font-syne text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 flex-grow mb-6 mt-2 text-sm">{description}</p>
      <button
        onClick={onClick}
        className="mt-auto w-full px-6 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
      >
        {buttonText}
      </button>
    </motion.div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const { styleDNA, username } = useProfile();
  
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  const title = "Fashion Fusion";

  return (
    <div className="w-full max-w-7xl mx-auto">
      <motion.h1 
        className="font-syne text-5xl md:text-7xl font-extrabold tracking-tighter text-center"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        {title.split("").map((char, index) => (
          <motion.span 
            key={index} 
            variants={letterVariants} 
            className="bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent"
            style={{display: 'inline-block'}}
           >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h1>
      
      <motion.p 
        className="text-center text-lg text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.5, duration: 0.5}}
      >
        Welcome back, {username}.
        {styleDNA ? ` Your Style DNA is ` : ' Discover your unique style. '}
        {styleDNA && <span className="font-bold text-fuchsia-500 dark:text-fuchsia-400">{styleDNA.title}.</span>}
      </motion.p>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
              delayChildren: 0.7,
            },
          },
        }}
      >
        <FeatureCard
          title="AI Stylist"
          description="Fuse your mood, occasion, and personal style. Get hyper-personalized outfits curated by our advanced AI."
          buttonText="Get Styled"
          icon={<StylistIcon />}
          onClick={() => setView('stylist')}
        />
        <FeatureCard
          title="Style DNA Quiz"
          description={styleDNA ? "You've found your Style DNA! Want to take the quiz again?" : "Take our fun, psychology-backed quiz to discover your unique fashion personality and unlock deeper personalization."}
          buttonText={styleDNA ? "Retake Quiz" : "Find My DNA"}
          icon={<QuizIcon />}
          onClick={() => setView('quiz')}
          className="lg:col-span-2"
        />
        <FeatureCard
          title="Digital Wardrobe"
          description="Scan your closet by uploading photos of your clothes. Let our AI categorize everything and help you build outfits with what you already own."
          buttonText="Open Wardrobe"
          icon={<WardrobeIcon />}
          onClick={() => setView('wardrobe')}
        />
        <FeatureCard
          title="FusionBot AI"
          description="Chat with our witty AI stylist for real-time fashion advice, outfit roasting, and answers to all your style questions."
          buttonText="Chat Now"
          icon={<BotIcon />}
          onClick={() => setView('bot')}
        />
        <FeatureCard
          title="Trend Pulse"
          description="Tap into the zeitgeist. Get real-time fashion trends analyzed by AI, with sources from across the web."
          buttonText="See Trends"
          icon={<TrendsIcon />}
          onClick={() => setView('trends')}
        />
      </motion.div>
    </div>
  );
};

interface DashboardProps {
  setView: (view: View) => void;
}

const StylistIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.47 2.118v-.09a2.25 2.25 0 012.25-2.25c1.155 0 2.166-.564 2.78-1.375a3 3 0 005.058-1.81zM15.22 6.375a3 3 0 00-5.78-1.128 2.25 2.25 0 01-2.47-2.118v.09a2.25 2.25 0 012.25 2.25c1.155 0 2.166-.564 2.78 1.375a3 3 0 005.058 1.81z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21.628 15.75a3 3 0 00-5.78-1.128 2.25 2.25 0 01-2.47-2.118v.09a2.25 2.25 0 012.25 2.25c1.155 0 2.166-.564 2.78 1.375a3 3 0 005.058 1.81z" /></svg>;
const QuizIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>;
const WardrobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
const BotIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5l.415-.207a.75.75 0 011.085.67V10.5m0 0h6m-6 0a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V7.5a.75.75 0 00-.75-.75h-4.5A.75.75 0 0010.5 7.5v3z" /><path strokeLinecap="round" strokeLinejoin="round"d="M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" /></svg>;
const TrendsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>;