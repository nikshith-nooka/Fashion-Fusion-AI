import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OutfitCard } from '../components/OutfitCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { generateOutfitsForMood, generateImageForOutfit } from '../services/geminiService';
import { useProfile } from '../contexts/ProfileContext';
import { useFeatureState } from '../contexts/FeatureStateContext';

const occasions = ["", "Casual Hangout", "Date Night", "Office / Professional", "Formal Event", "Creative / Artsy", "Workout / Fitness", "Cozy Day In"];

export const AIStylist: React.FC = () => {
    const { styleDNA, bodyProfile, gender, wardrobe, username } = useProfile();
    const { 
        stylistResult: outfit, 
        setStylistResult: setOutfit,
        isStylistLoading: isLoading,
        setIsStylistLoading: setIsLoading,
        stylistError: error,
        setStylistError: setError,
    } = useFeatureState();

    const [mood, setMood] = useState<string>('');
    const [occasion, setOccasion] = useState<string>('');
    const [useWardrobe, setUseWardrobe] = useState<boolean>(false);
    const [loadingText, setLoadingText] = useState<string>('');
    const [cooldown, setCooldown] = useState<number>(0);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const handleGenerate = useCallback(async () => {
        if (!mood.trim() && !occasion) {
            setError('Please describe your mood or select an occasion!');
            return;
        }

        console.log(`[MONITORING] AI Stylist: User '${username}' started generation. Mood: "${mood}", Occasion: "${occasion}", Use Wardrobe: ${useWardrobe}`);

        setIsLoading(true);
        setError(null);
        setOutfit(null); 

        try {
            setLoadingText('Generating your perfect look...');
            const outfitIdea = await generateOutfitsForMood(mood, occasion, gender, useWardrobe, wardrobe, styleDNA ?? undefined, bodyProfile ?? undefined);
            
            if (!outfitIdea) {
                throw new Error("The AI couldn't come up with an idea. Try a different prompt!");
            }
            
            console.log(`[MONITORING] AI Stylist: Successfully generated outfit "${outfitIdea.name}" for user '${username}'`);

            setLoadingText('Creating your moodboard...');
            const mainImageUrl = await generateImageForOutfit(outfitIdea.imagePrompt);
            
            setOutfit({ ...outfitIdea, imageUrl: mainImageUrl });

        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            console.error(`[MONITORING] AI Stylist: Error for user '${username}': ${errorMessage}`);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            setLoadingText('');
            setCooldown(30); // Start 30-second cooldown
        }
    }, [mood, occasion, gender, useWardrobe, wardrobe, styleDNA, bodyProfile, setIsLoading, setError, setOutfit, username]);
    
    const isFormDisabled = isLoading || cooldown > 0;

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
            <motion.div 
              className="w-full max-w-3xl bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-300 dark:border-white/10 p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
                <div className="text-center mb-8">
                    <h2 className="font-syne text-4xl font-bold tracking-tighter">AI Stylist</h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">Fuse your mood and occasion for a hyper-personalized look.</p>
                </div>
                <div className="space-y-6">
                    <textarea
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        placeholder="Describe your mood, vibe, or desired aesthetic..."
                        disabled={isFormDisabled}
                        className="w-full h-28 p-4 text-gray-900 dark:text-gray-100 bg-gray-200/50 dark:bg-black/20 border-2 border-gray-300 dark:border-white/10 rounded-lg resize-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all duration-300 disabled:opacity-50"
                        aria-label="Describe your mood"
                    />
                    <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        disabled={isFormDisabled}
                        className="w-full p-4 text-gray-900 dark:text-gray-100 bg-gray-200/50 dark:bg-black/20 border-2 border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-300 appearance-none disabled:opacity-50"
                        aria-label="Select an occasion"
                    >
                        {occasions.map(o => <option key={o} value={o} disabled={o === ''}>{o || 'Select an Occasion'}</option>)}
                    </select>

                    <div 
                      onClick={() => !isFormDisabled && setUseWardrobe(!useWardrobe)} 
                      className={`flex items-center justify-between p-4 rounded-lg transition-all ${isFormDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${useWardrobe ? 'bg-fuchsia-500/20 border-fuchsia-500' : 'bg-gray-200/50 dark:bg-black/20 border-gray-300 dark:border-white/10'} border-2`}
                    >
                      <span className="font-semibold">{useWardrobe ? "Using Your Wardrobe" : "Use My Digital Wardrobe"}</span>
                       <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${useWardrobe ? 'bg-fuchsia-600' : 'bg-gray-600'}`}>
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${useWardrobe ? 'translate-x-6' : ''}`} />
                       </div>
                    </div>
                    
                    <button onClick={handleGenerate} disabled={isFormDisabled} className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-transform duration-300 text-lg">
                        {isLoading ? 'Fusing...' : cooldown > 0 ? `Please wait (${cooldown}s)` : 'Generate Outfit'}
                    </button>
                </div>
            </motion.div>

            {isLoading && <LoadingSpinner text={loadingText} />}
            
            {error && (
              <motion.div 
                className="mt-12 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg max-w-2xl text-center"
                initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}
              >
                <h3 className="font-bold text-lg mb-2">Uh oh, a fashion faux pas!</h3>
                <p>{error}</p>
              </motion.div>
            )}

            {!isLoading && outfit && (
              <div className="mt-16 w-full max-w-lg">
                <h2 className="text-4xl font-bold text-center mb-8 font-syne tracking-tighter">Your AI-Curated Look</h2>
                <OutfitCard outfit={outfit} />
              </div>
            )}
        </div>
    );
};