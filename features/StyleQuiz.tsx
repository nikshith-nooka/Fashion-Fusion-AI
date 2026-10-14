import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateStyleQuiz, analyzeQuizResults } from '../services/geminiService';
import { useProfile } from '../contexts/ProfileContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { QuizQuestion, StyleDNA } from '../types';
import type { View } from '../App';

export const StyleQuiz: React.FC<{ setView: (view: View) => void }> = ({ setView }) => {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { styleDNA, setStyleDNA, username } = useProfile();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const quizQuestions = await generateStyleQuiz();
                setQuestions(quizQuestions);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuiz();
    }, []);

    const handleAnswer = (questionId: number, answerValue: string) => {
        const newAnswers = { ...answers, [questionId]: answerValue };
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            handleAnalyze(newAnswers);
        }
    };

    const handleAnalyze = async (finalAnswers: Record<number, string>) => {
        setIsAnalyzing(true);
        setError(null);
        try {
            const result = await analyzeQuizResults(finalAnswers);
            console.log(`[MONITORING] Style Quiz: User '${username}' completed quiz. Resulting Style DNA: "${result.title}"`);
            setStyleDNA(result);
        } catch(e: any) {
            setError(e.message);
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    const resetQuiz = () => {
        setStyleDNA(null);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setIsLoading(true);
        generateStyleQuiz().then(q => {
            setQuestions(q);
            setIsLoading(false);
        });
    }

    if (isLoading) return <LoadingSpinner text="Crafting your style quiz..." />;
    if (error) return <div className="text-red-600 dark:text-red-400 text-center">{error}</div>;

    const currentQuestion = questions[currentQuestionIndex];
    const progress = (currentQuestionIndex / questions.length) * 100;

    if (isAnalyzing) return <LoadingSpinner text="Analyzing your Style DNA..." />;

    if (styleDNA) {
        return (
            <motion.div 
                className="w-full max-w-2xl mx-auto flex flex-col items-center text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                <h2 className="text-4xl font-bold font-syne tracking-tighter mb-4">Your Style DNA is...</h2>
                <div className="w-full bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-300 dark:border-white/10 p-8 rounded-2xl shadow-lg mt-4">
                    <h3 className="font-syne text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">{styleDNA.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mt-4">{styleDNA.summary}</p>
                    <div className="mt-6">
                        <h4 className="font-semibold text-cyan-600 dark:text-cyan-300 mb-2">Key Traits:</h4>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {styleDNA.traits.map(trait => <span key={trait} className="bg-black/5 text-gray-700 dark:bg-white/10 dark:text-gray-200 px-3 py-1 rounded-full text-sm">{trait}</span>)}
                        </div>
                    </div>
                    <div className="mt-6">
                        <h4 className="font-semibold text-cyan-600 dark:text-cyan-300 mb-2">{styleDNA.colorPalette.name}:</h4>
                        <div className="flex gap-2 justify-center mt-2">
                            {styleDNA.colorPalette.hexCodes.map(hex => <div key={hex} className="w-10 h-10 rounded-full" style={{backgroundColor: hex}}></div>)}
                        </div>
                    </div>
                </div>
                 <div className="flex gap-4 mt-8">
                    <button onClick={() => setView('stylist')} className="px-8 py-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition-transform">Get Styled</button>
                    <button onClick={resetQuiz} className="px-8 py-3 bg-gray-200 text-gray-800 dark:bg-white/10 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-white/20 transition-colors">Retake Quiz</button>
                </div>
            </motion.div>
        );
    }
    
    return (
        <div className="w-full max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold font-syne tracking-tighter text-center mb-8">Style DNA Quiz</h2>
            <div className="w-full bg-gray-200 dark:bg-white/5 h-2 rounded-full mb-8">
                <motion.div 
                    className="bg-gradient-to-r from-fuchsia-500 to-cyan-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                />
            </div>
             <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-300 dark:border-white/10 p-8 rounded-2xl"
                >
                    <h3 className="text-2xl font-semibold text-center h-16">{currentQuestion.question}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        {currentQuestion.answers.map(answer => (
                            <motion.button
                                key={answer.value}
                                onClick={() => handleAnswer(currentQuestion.id, answer.value)}
                                className="p-4 text-left bg-gray-200/70 dark:bg-white/5 rounded-lg border-2 border-transparent hover:border-cyan-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {answer.text}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};