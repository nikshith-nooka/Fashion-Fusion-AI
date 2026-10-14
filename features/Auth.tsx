import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createUser, loginUser, signInWithGoogle } from '../services/dbService';
import { useTheme } from '../contexts/ThemeContext';

const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25c0 5.385 4.365 9.75 9.75 9.75 2.833 0 5.39-1.21 7.252-3.248z" /></svg>;
const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
        <path fill="#4285F4" d="M22.56,12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26,1.37-1.04,2.53-2.21,3.31v2.77h3.57c2.08-1.92,3.28-4.74,3.28-8.09Z"/>
        <path fill="#34A853" d="M12,23c2.97,0,5.46-.98,7.28-2.66l-3.57-2.77c-.98.66-2.23,1.06-3.71,1.06-2.86,0-5.29-1.93-6.16-4.53H2.18v2.84C3.99,20.53,7.7,23,12,23Z"/>
        <path fill="#FBBC05" d="M5.84,14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43,8.55,1,10.22,1,12s.43,3.45,1.18,4.93l3.66-2.84Z"/>
        <path fill="#EA4335" d="M12,5.38c1.62,0,3.06.56,4.21,1.64l3.15-3.15C17.45,1.92,14.97,1,12,1,7.7,1,3.99,3.47,2.18,7.07l3.66,2.84c.87-2.6,3.3-4.53,6.16-4.53Z"/>
    </svg>
);


export const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isLogin) {
                await loginUser(username, password);
                console.log(`[MONITORING] Auth: User '${username}' logged in.`);
            } else {
                await createUser(username, password);
                console.log(`[MONITORING] Auth: New user '${username}' signed up.`);
            }
        } catch (err: any) {
            let friendlyError = err.message;
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/api-key-not-valid') {
                friendlyError = "Invalid username or password. Please try again.";
            } else if (err.code === 'auth/email-already-in-use') {
                friendlyError = "A user with that username already exists. Please try logging in.";
            } else if (err.code === 'auth/weak-password') {
                friendlyError = "Password should be at least 6 characters.";
            }
            setError(friendlyError);
            console.error(`[MONITORING] Auth: Failed action for user '${username}'. Code: ${err.code || 'N/A'}. Message: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGoogleSignIn = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await signInWithGoogle();
        } catch (err: any) {
            let friendlyError = err.message || 'Failed to sign in with Google.';
            if (err.code === 'auth/operation-not-supported-in-this-environment') {
                friendlyError = 'Google Sign-In is not supported in this preview environment due to security restrictions. It will work correctly on a live website. Please use a username and password to continue.';
            }
            setError(friendlyError);
            console.error(`[MONITORING] Auth: Google sign-in failed. Code: ${err.code || 'N/A'}. Message: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center p-4 relative overflow-hidden">
             <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] dark:bg-black dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>
             <motion.div
                initial={{ filter: 'blur(100px)'}}
                animate={{ filter: 'blur(40px)'}}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                className="absolute top-1/2 left-1/2 h-96 w-96 bg-fuchsia-600/30 dark:bg-fuchsia-900/50 rounded-full"
             />
             <motion.div
                initial={{ filter: 'blur(100px)'}}
                animate={{ filter: 'blur(40px)'}}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 1 }}
                className="absolute top-1/3 right-1/4 h-80 w-80 bg-cyan-400/30 dark:bg-cyan-800/50 rounded-full"
             />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/60 dark:bg-black/20 backdrop-blur-2xl border border-gray-300 dark:border-white/10 p-8 rounded-2xl shadow-2xl relative"
            >
                <button 
                    onClick={toggleTheme} 
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-black/5 dark:bg-white/5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                >
                    {theme === 'light' ? <MoonIcon/> : <SunIcon/>}
                </button>
                <div className="text-center mb-8">
                    <h1 className="font-syne text-4xl font-extrabold tracking-tighter bg-gradient-to-r from-fuchsia-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                        Fashion Fusion
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{isLogin ? 'Welcome back!' : 'Create your profile.'}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-bold text-gray-500 dark:text-gray-400 block mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 text-gray-900 dark:text-gray-100 bg-gray-200/50 dark:bg-black/20 border-2 border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all duration-300"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-gray-500 dark:text-gray-400 block mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 text-gray-900 dark:text-gray-100 bg-gray-200/50 dark:bg-black/20 border-2 border-gray-300 dark:border-white/10 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition-all duration-300"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 dark:text-red-400 text-xs text-center pt-2">{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-semibold rounded-lg shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-300"
                    >
                        {isLoading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
                    </button>
                </form>
                 <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300 dark:border-white/10"></div>
                    <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500 text-xs">OR</span>
                    <div className="flex-grow border-t border-gray-300 dark:border-white/10"></div>
                </div>
                
                 <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center gap-2 border border-gray-300 dark:border-white/10"
                >
                    <GoogleIcon />
                    Sign in with Google
                </button>

                 <p className="text-center text-sm mt-6">
                    <span className="text-gray-500 dark:text-gray-400">{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
                    <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); }} className="font-semibold text-cyan-500 dark:text-cyan-400 hover:underline ml-2">
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
};