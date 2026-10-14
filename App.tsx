import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { getUserProfile } from './services/dbService';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './features/Dashboard';
import { AIStylist } from './features/AIStylist';
import { FusionBot } from './features/FusionBot';
import { TrendPulse } from './features/TrendPulse';
import { StyleQuiz } from './features/StyleQuiz';
import { DigitalWardrobe } from './features/DigitalWardrobe';
import { Profile } from './features/Profile';
import { FashionLibrary } from './features/FashionLibrary';
import { Auth } from './features/Auth';
import { AdminStats } from './features/AdminStats';
import { ProfileProvider } from './contexts/ProfileContext';
import { FeatureStateProvider } from './contexts/FeatureStateContext';
import { LoadingSpinner } from './components/LoadingSpinner';
import type { UserProfile } from './types';

export type View = 'dashboard' | 'stylist' | 'bot' | 'trends' | 'quiz' | 'wardrobe' | 'profile' | 'library' | 'admin';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        if (userProfile) {
            setCurrentUser(userProfile);
            setIsAdmin(userProfile.username.toLowerCase() === 'nikki');
        } else {
            setCurrentUser(null);
            setIsAdmin(false);
        }
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setIsAdmin(false);
    setActiveView('dashboard');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'stylist': return <AIStylist />;
      case 'bot': return <FusionBot />;
      case 'trends': return <TrendPulse />;
      case 'quiz': return <StyleQuiz setView={setActiveView} />;
      case 'wardrobe': return <DigitalWardrobe />;
      case 'profile': return <Profile />;
      case 'library': return <FashionLibrary />;
      case 'admin': return <AdminStats />;
      case 'dashboard':
      default:
        return <Dashboard setView={setActiveView} />;
    }
  };
  
  if (authLoading) {
      return (
          <div className="h-screen w-screen flex items-center justify-center">
              <LoadingSpinner text="Initializing Fashion Fusion..."/>
          </div>
      )
  }

  if (!currentUser) {
    return <Auth />;
  }

  return (
    <ProfileProvider userProfile={currentUser}>
      <FeatureStateProvider>
        <div className="flex h-screen w-screen text-gray-900 dark:text-gray-100">
          <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} isAdmin={isAdmin} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                <AnimatePresence mode="wait">
                     <motion.div
                        key={activeView}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                     >
                        {renderActiveView()}
                    </motion.div>
                </AnimatePresence>
            </main>
          </div>
        </div>
      </FeatureStateProvider>
    </ProfileProvider>
  );
};

export default App;