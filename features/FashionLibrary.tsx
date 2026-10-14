import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getFashionStyleInfo } from '../services/geminiService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useProfile } from '../contexts/ProfileContext';
import type { FashionStyleInfo, FashionStyleItem, TrendSource } from '../types';

const ItemCard: React.FC<{item: FashionStyleItem}> = ({ item }) => {
  return (
    <div className="bg-gray-200/50 dark:bg-black/30 rounded-lg border border-gray-300 dark:border-white/10 p-3 flex justify-between items-center gap-4">
        <div className="flex-grow min-w-0">
            <h5 className="font-semibold text-gray-900 dark:text-white truncate text-sm">{item.name}</h5>
            <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{item.description}</p>
        </div>
        <a 
            href={item.purchaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-3 py-1 text-xs font-bold text-black bg-cyan-300 rounded-full hover:bg-cyan-200 transition-colors"
        >
            Buy Now
        </a>
    </div>
  )
}

const Sources: React.FC<{ sources: TrendSource[] }> = ({ sources }) => {
  if (sources.length === 0) return null;
  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
      <h3 className="text-xl font-semibold text-cyan-600 dark:text-cyan-300 mb-4">Sources</h3>
      <ul className="space-y-2">
        {sources.map((source, index) => (
          <li key={index} className="truncate">
            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-cyan-700 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-200 hover:underline transition-colors duration-200 text-sm">
              {source.title || source.uri}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};


export const FashionLibrary: React.FC = () => {
    const { username } = useProfile();
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<FashionStyleInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) {
            setError('Please enter a fashion style to search for.');
            return;
        }
        console.log(`[MONITORING] Fashion Library: User '${username}' searched for: "${query}"`);
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const info = await getFashionStyleInfo(query);
            setResult(info);
            console.log(`[MONITORING] Fashion Library: Successfully found info for "${info.styleName}" for user '${username}'`);
        } catch (e: any) {
            setError(e.message || 'Failed to fetch style information.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            <div className="text-center w-full">
                <h2 className="text-4xl font-bold font-syne tracking-tighter mb-2">Fashion Library</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Explore the world of fashion. From 'Gorpcore' to 'Grandmillennial'.</p>
                <div className="relative max-w-2xl mx-auto">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., 'Y2K', 'Cottagecore', 'Bollywood Chic'..."
                        disabled={isLoading}
                        className="w-full p-4 pr-32 text-gray-900 dark:text-gray-100 bg-white/80 dark:bg-black/30 border-2 border-gray-300 dark:border-white/10 rounded-full focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all"
                    />
                    <button onClick={handleSearch} disabled={isLoading} className="absolute top-1/2 right-2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 disabled:opacity-50 transition-transform">
                        {isLoading ? '...' : 'Search'}
                    </button>
                </div>
            </div>

            {isLoading && <LoadingSpinner text={`Researching ${query}...`} />}
            
            {error && (
              <div className="mt-12 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg max-w-2xl text-center">
                <h3 className="font-bold text-lg mb-2">Research Failed</h3>
                <p>{error}</p>
              </div>
            )}

            {result && !isLoading && (
                <motion.div 
                    className="mt-12 w-full text-left bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-300 dark:border-white/10 p-8 rounded-2xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="font-syne text-4xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent mb-4">{result.styleName}</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{result.description}</p>

                    <div className="mt-8">
                         <h3 className="text-xl font-semibold text-cyan-600 dark:text-cyan-300 mb-4">Key Elements</h3>
                         <div className="flex flex-wrap gap-2">
                            {result.keyElements.map(trait => <span key={trait} className="bg-black/5 text-gray-700 dark:bg-white/10 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">{trait}</span>)}
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                        <h3 className="text-xl font-semibold text-cyan-600 dark:text-cyan-300 mb-4">Get The "{result.shoppableLook.lookName}" Look</h3>
                        <div className="space-y-3">
                            {result.shoppableLook.items.map((item, index) => (
                              <ItemCard key={index} item={item} />
                            ))}
                        </div>
                    </div>
                    
                    <Sources sources={result.sources} />
                </motion.div>
            )}
        </div>
    );
};