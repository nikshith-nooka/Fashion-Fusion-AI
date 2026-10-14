import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getFashionTrends } from '../services/geminiService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useFeatureState } from '../contexts/FeatureStateContext';
import { useProfile } from '../contexts/ProfileContext';
import type { TrendSource } from '../types';

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br />');
    return <div className="prose dark:prose-invert prose-lg max-w-none text-gray-600 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
};

export const TrendPulse: React.FC = () => {
    const { username } = useProfile();
    const { 
        trendsResult: trends, 
        setTrendsResult: setTrends,
        isTrendsLoading: isLoading,
        setIsTrendsLoading: setIsLoading,
        trendsError: error,
        setTrendsError: setError,
    } = useFeatureState();


    const handleAnalyze = async () => {
        setIsLoading(true);
        setError(null);
        setTrends(null);
        console.log(`[MONITORING] Trend Pulse: User '${username}' started trend analysis.`);
        try {
            const response = await getFashionTrends();
            const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
            const sources = groundingMetadata?.groundingChunks
                ?.map(chunk => chunk.web)
                .filter(web => web && web.uri && web.title) as TrendSource[] || [];

            const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

            setTrends({
                text: response.text,
                sources: uniqueSources,
            });
            console.log(`[MONITORING] Trend Pulse: Successfully fetched trends for user '${username}'.`);
        } catch (e: any) {
            setError(e.message || "Failed to fetch trends.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center">
            <h2 className="text-4xl font-bold font-syne tracking-tighter mb-2">Trend Pulse</h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">Tap into the zeitgeist. Get real-time fashion trends analyzed by AI.</p>
            
            <button onClick={handleAnalyze} disabled={isLoading} className="px-12 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-transform duration-300 text-lg">
                {isLoading ? 'Analyzing...' : 'Analyze Latest Trends'}
            </button>
            
            {isLoading && <LoadingSpinner text="Scanning the style-sphere..." />}
            
            {error && (
              <div className="mt-12 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg max-w-2xl text-center">
                <h3 className="font-bold text-lg mb-2">Error Fetching Trends</h3>
                <p>{error}</p>
              </div>
            )}

            {trends && !isLoading && (
                <motion.div 
                    className="mt-12 w-full text-left bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-300 dark:border-white/10 p-8 rounded-2xl shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <SimpleMarkdown text={trends.text} />

                    {trends.sources.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10">
                            <h3 className="text-xl font-semibold text-cyan-600 dark:text-cyan-300 mb-4">Sources</h3>
                            <ul className="space-y-2">
                                {trends.sources.map((source, index) => (
                                    <li key={index} className="truncate">
                                        <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-cyan-700 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-200 hover:underline transition-colors duration-200 text-sm">
                                            {source.title || source.uri}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};