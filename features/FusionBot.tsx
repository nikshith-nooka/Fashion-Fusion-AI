import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { startChat, sendMessageStream } from '../services/geminiService';
import { useProfile } from '../contexts/ProfileContext';
import type { ChatMessage } from '../types';
import type { Chat } from '@google/genai';

export const FusionBot: React.FC = () => {
    const { username } = useProfile();
    const [chatInstance, setChatInstance] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const chat = startChat();
        setChatInstance(chat);
        setMessages([{
            id: 'initial',
            role: 'model',
            content: "Hey! I'm FusionBot. 🔥 Ask me for fashion advice, what to wear for an occasion, or if a certain color combination works. Let's talk style!"
        }]);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading || !chatInstance) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        console.log(`[MONITORING] FusionBot: User '${username}' sent message: "${currentInput}"`);
        setInput('');
        setIsLoading(true);

        const modelMessageId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: modelMessageId, role: 'model', content: '' }]);

        try {
            const stream = await sendMessageStream(chatInstance, currentInput);
            let text = '';
            for await (const chunk of stream) {
                text += chunk.text;
                setMessages(prev => prev.map(msg =>
                    msg.id === modelMessageId ? { ...msg, content: text + '...' } : msg
                ));
            }
             setMessages(prev => prev.map(msg =>
                    msg.id === modelMessageId ? { ...msg, content: text } : msg
            ));
        } catch (error) {
            console.error(error);
            setMessages(prev => prev.map(msg =>
                msg.id === modelMessageId ? { ...msg, content: 'Oops! My circuits are crossed. Please try again.' } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col h-[80vh] bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-300 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-white/10 text-center">
                <h2 className="text-xl font-syne font-bold">FusionBot AI Stylist</h2>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <motion.div 
                        key={msg.id} 
                        className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index < 2 ? 0.1 * index : 0 }}
                    >
                        {msg.role === 'model' && <div className="w-10 h-10 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 flex-shrink-0 self-start"></div>}
                        <div className={`max-w-lg p-3 px-4 rounded-2xl shadow-md ${msg.role === 'user' ? 'bg-fuchsia-600 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 dark:bg-gray-700/50 dark:text-gray-200 rounded-bl-none'}`}>
                           <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content || '...'}</p>
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/10">
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a fashion question..."
                        disabled={isLoading}
                        rows={1}
                        className="w-full p-3 pr-28 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-black/20 border-2 border-gray-300 dark:border-white/10 rounded-full resize-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all duration-300"
                    />
                    <button onClick={handleSend} disabled={isLoading || !input.trim()} className="absolute top-1/2 right-2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-transform duration-300">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};