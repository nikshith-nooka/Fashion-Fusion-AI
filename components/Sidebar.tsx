import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import type { View } from '../App';

const NavItem: React.FC<{
  view: View;
  label: string;
  icon: JSX.Element;
  activeView: View;
  setActiveView: (view: View) => void;
  isExpanded: boolean;
}> = ({ view, label, icon, activeView, setActiveView, isExpanded }) => {
  const isActive = activeView === view;
  return (
    <li
      onClick={() => setActiveView(view)}
      className="flex items-center w-full cursor-pointer group"
    >
      <div className="relative w-full">
        {isActive && (
          <motion.div
            layoutId="active-nav-glow"
            className="absolute -inset-2 rounded-xl bg-fuchsia-500/30 blur-lg"
          />
        )}
        <div className={`relative flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 ${isActive ? 'bg-black/10 dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
          <div className={`w-6 h-6 transition-colors duration-200 ${isActive ? 'text-fuchsia-500 dark:text-fuchsia-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
            {icon}
          </div>
          <motion.span
            animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-semibold text-gray-700 dark:text-gray-200 overflow-hidden whitespace-nowrap"
          >
            {label}
          </motion.span>
        </div>
      </div>
    </li>
  );
};

export const Sidebar: React.FC<{ activeView: View; setActiveView: (view: View) => void; onLogout: () => void; isAdmin: boolean; }> = ({ activeView, setActiveView, onLogout, isAdmin }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      animate={{ width: isExpanded ? 240 : 80 }}
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
      className="flex flex-col flex-shrink-0 h-full bg-white/50 dark:bg-black/30 backdrop-blur-xl border-r border-gray-200 dark:border-white/10 p-4"
    >
      <div className="flex items-center justify-center h-16 mb-8">
         <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-cyan-400 rounded-lg"/>
      </div>
      <ul className="space-y-3 flex-grow">
        <NavItem isExpanded={isExpanded} view="dashboard" label="Dashboard" icon={<DashboardIcon />} activeView={activeView} setActiveView={setActiveView} />
        <NavItem isExpanded={isExpanded} view="stylist" label="AI Stylist" icon={<StylistIcon />} activeView={activeView} setActiveView={setActiveView} />
        <NavItem isExpanded={isExpanded} view="library" label="Fashion Library" icon={<LibraryIcon />} activeView={activeView} setActiveView={setActiveView} />
        <NavItem isExpanded={isExpanded} view="bot" label="FusionBot" icon={<BotIcon />} activeView={activeView} setActiveView={setActiveView} />
        <NavItem isExpanded={isExpanded} view="trends" label="Trend Pulse" icon={<TrendsIcon />} activeView={activeView} setActiveView={setActiveView} />
        <NavItem isExpanded={isExpanded} view="wardrobe" label="Digital Wardrobe" icon={<WardrobeIcon />} activeView={activeView} setActiveView={setActiveView} />
        <NavItem isExpanded={isExpanded} view="profile" label="My Profile" icon={<ProfileIcon />} activeView={activeView} setActiveView={setActiveView} />
      </ul>
      <div className="mt-auto space-y-2">
         {isAdmin && <NavItem isExpanded={isExpanded} view="admin" label="Admin Stats" icon={<AdminIcon />} activeView={activeView} setActiveView={setActiveView} />}
        <li
            onClick={toggleTheme}
            className="flex items-center w-full cursor-pointer group"
          >
            <div className={`relative flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 w-full`}>
              <div className={`w-6 h-6 transition-colors duration-200 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white`}>
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </div>
              <motion.span
                animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-semibold text-gray-700 dark:text-gray-200 overflow-hidden whitespace-nowrap"
              >
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </motion.span>
            </div>
          </li>
         <li
            onClick={onLogout}
            className="flex items-center w-full cursor-pointer group"
          >
            <div className={`relative flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 w-full`}>
              <div className={`w-6 h-6 transition-colors duration-200 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white`}>
                <LogoutIcon />
              </div>
              <motion.span
                animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-semibold text-gray-700 dark:text-gray-200 overflow-hidden whitespace-nowrap"
              >
                Logout
              </motion.span>
            </div>
          </li>
      </div>
    </motion.nav>
  );
};

// Icon Components
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>;
const StylistIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.47 2.118v-.09a2.25 2.25 0 012.25-2.25c1.155 0 2.166-.564 2.78-1.375a3 3 0 005.058-1.81zM15.22 6.375a3 3 0 00-5.78-1.128 2.25 2.25 0 01-2.47-2.118v.09a2.25 2.25 0 012.25 2.25c1.155 0 2.166-.564 2.78 1.375a3 3 0 005.058 1.81z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21.628 15.75a3 3 0 00-5.78-1.128 2.25 2.25 0 01-2.47-2.118v.09a2.25 2.25 0 012.25 2.25c1.155 0 2.166-.564 2.78 1.375a3 3 0 005.058 1.81z" /></svg>;
const LibraryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const BotIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5l.415-.207a.75.75 0 011.085.67V10.5m0 0h6m-6 0a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V7.5a.75.75 0 00-.75-.75h-4.5A.75.75 0 0010.5 7.5v3z" /><path strokeLinecap="round" strokeLinejoin="round"d="M3.75 12a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" /></svg>;
const TrendsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>;
const WardrobeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>;
const ProfileIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const AdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.227l1.267-.633c.24-.12.506-.12.746 0l1.267.633c.55.22.992.67.922 1.227l-.363 2.177c.375.145.724.34.994.577l1.932-1.018c.45-.236.974-.03 1.213.388l.972 1.684c.24.418.04.95-.388 1.213l-1.932 1.018a6.626 6.626 0 010 1.154l1.932 1.018c.428.223.628.755.388 1.213l-.972 1.684c-.24.418-.763.624-1.213.388l-1.932-1.018a6.626 6.626 0 01-1.572-.793l-.363 2.177c-.09.542-.56 1.007-1.11 1.227l-1.267.633c-.24.12-.506-.12-.746 0l-1.267-.633c-.55-.22-.992-.67-.922-1.227l.363-2.177a6.626 6.626 0 01-1.572-.793l-1.932 1.018c-.45.236-.974.03-1.213-.388l-.972-1.684c-.24-.418-.04-.95.388-1.213l1.932-1.018a6.626 6.626 0 010-1.154L2.83 8.84c-.428-.223-.628-.755-.388-1.213l.972-1.684c.24-.418.763-.624 1.213.388l1.932 1.018c.375-.145.724.34.994-.577l.363-2.177z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25c0 5.385 4.365 9.75 9.75 9.75 2.833 0 5.39-1.21 7.252-3.248z" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>;