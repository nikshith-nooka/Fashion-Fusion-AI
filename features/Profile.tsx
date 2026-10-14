import React from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '../contexts/ProfileContext';
import type { BodyProfile, UserProfile } from '../types';

const bodyTypes: BodyProfile["bodyType"][] = ['Hourglass', 'Pear', 'Apple', 'Rectangle', 'Inverted Triangle'];
const genders: UserProfile["gender"][] = ['Female', 'Male', 'Other'];

export const Profile: React.FC = () => {
    const { username, styleDNA, bodyProfile, setBodyProfile, gender, setGender } = useProfile();
    
    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="text-center">
                <h2 className="text-4xl font-bold font-syne tracking-tighter mb-2">My Profile</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                    {username ? `${username}'s` : `Your`} fashion identity. Keep it updated for the best recommendations.
                </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-300 dark:border-white/10 p-8 rounded-2xl shadow-lg"
                >
                    <h3 className="text-2xl font-bold font-syne tracking-tight mb-4 text-cyan-600 dark:text-cyan-300">My Style DNA</h3>
                    {styleDNA ? (
                        <div>
                           <h3 className="font-syne text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">{styleDNA.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 mt-4">{styleDNA.summary}</p>
                            <div className="mt-6">
                                <h4 className="font-semibold text-cyan-600 dark:text-cyan-300 mb-2">Key Traits:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {styleDNA.traits.map(trait => <span key={trait} className="bg-black/5 text-gray-700 dark:bg-white/10 dark:text-gray-200 px-3 py-1 rounded-full text-sm">{trait}</span>)}
                                </div>
                            </div>
                            <div className="mt-6">
                                <h4 className="font-semibold text-cyan-600 dark:text-cyan-300 mb-2">{styleDNA.colorPalette.name}:</h4>
                                <div className="flex gap-2 mt-2">
                                    {styleDNA.colorPalette.hexCodes.map(hex => <div key={hex} className="w-10 h-10 rounded-full border-2 border-white/10" style={{backgroundColor: hex}}></div>)}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400">You haven't completed the Style DNA quiz yet. Go to the quiz to discover your unique style!</p>
                    )}
                </motion.div>
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{delay: 0.1}}
                    className="space-y-8"
                 >
                    <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-300 dark:border-white/10 p-8 rounded-2xl shadow-lg">
                        <h3 className="text-2xl font-bold font-syne tracking-tight mb-4 text-cyan-600 dark:text-cyan-300">Gender Identity</h3>
                         <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Help us tailor styles for you.</p>
                         <div className="grid grid-cols-3 gap-3">
                            {genders.map(g => (
                                <button
                                    key={g}
                                    onClick={() => setGender(g)}
                                    className={`p-3 text-center rounded-lg border-2 transition-all duration-200 ${gender === g ? 'bg-fuchsia-500/30 border-fuchsia-500 font-bold' : 'bg-gray-200/70 dark:bg-white/5 border-transparent hover:border-cyan-400'}`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-300 dark:border-white/10 p-8 rounded-2xl shadow-lg">
                        <h3 className="text-2xl font-bold font-syne tracking-tight mb-4 text-cyan-600 dark:text-cyan-300">Body-Aware Fit</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Select the body type that best represents you for more flattering recommendations.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {bodyTypes.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setBodyProfile({ bodyType: type })}
                                    className={`p-3 text-center rounded-lg border-2 transition-all duration-200 ${bodyProfile.bodyType === type ? 'bg-fuchsia-500/30 border-fuchsia-500 font-bold' : 'bg-gray-200/70 dark:bg-white/5 border-transparent hover:border-cyan-400'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};