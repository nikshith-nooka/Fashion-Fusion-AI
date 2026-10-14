import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../contexts/ProfileContext';
import { analyzeClothingImage } from '../services/geminiService';
import type { WardrobeItem } from '../types';

const WardrobeItemCard: React.FC<{ item: WardrobeItem, onRemove: (id: string) => void }> = ({ item, onRemove }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-300 dark:border-white/10 rounded-2xl overflow-hidden group relative"
        >
            <img src={item.imageUrl} alt={item.name} className="w-full h-56 object-cover" />
            <div className="p-4">
                <h4 className="font-bold truncate text-gray-900 dark:text-white">{item.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
            </div>
            <button onClick={() => onRemove(item.id)} className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">&times;</button>
        </motion.div>
    );
};

export const DigitalWardrobe: React.FC = () => {
    const { wardrobe, username, addWardrobeItem, removeWardrobeItem } = useProfile();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        try {
            // First, analyze the image with Gemini to get metadata
            const itemData = await analyzeClothingImage(file);
            console.log(`[MONITORING] Wardrobe: User '${username}' is adding item '${itemData.name}' (Category: ${itemData.category})`);
            
            // Then, pass the metadata and the original file to the context function
            // which will handle the upload to storage and update of the firestore doc
            await addWardrobeItem(itemData, file);

        } catch (e: any) {
            setError(e.message || 'Failed to analyze image.');
        } finally {
            setIsLoading(false);
            // Reset file input
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };
    
    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="text-center">
                <h2 className="text-4xl font-bold font-syne tracking-tighter mb-2">Digital Wardrobe</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Scan your closet. Build your digital collection.</p>
            </div>
            
            <div className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-300 dark:border-white/10 p-6 rounded-2xl shadow-lg flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-300">You have {wardrobe.length} item(s) in your wardrobe.</p>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-transform"
                >
                    {isLoading ? "Analyzing..." : "Add Item"}
                </button>
            </div>

            {error && <p className="text-red-600 dark:text-red-400 text-center mt-4">{error}</p>}
            
            <AnimatePresence>
                {wardrobe.length > 0 ? (
                    <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-8">
                        {wardrobe.map(item => (
                            <WardrobeItemCard key={item.id} item={item} onRemove={removeWardrobeItem} />
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-20">
                         <div className="w-24 h-24 mx-auto text-gray-400 dark:text-gray-600">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                        </div>
                        <p className="text-gray-500 mt-4">Your wardrobe is empty. Add your first item!</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};