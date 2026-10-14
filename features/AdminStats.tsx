import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllUsers } from '../services/dbService';
import { useProfile } from '../contexts/ProfileContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import type { UserProfile } from '../types';

export const AdminStats: React.FC = () => {
    const { username: adminUsername } = useProfile();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const allUsers = await getAllUsers();
                // Filter out the current admin user from the list
                const otherUsers = allUsers.filter(user => user.username.toLowerCase() !== adminUsername.toLowerCase());
                setUsers(otherUsers);
            } catch (e: any) {
                setError(e.message || 'Failed to load user data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [adminUsername]);

    if (isLoading) {
        return <LoadingSpinner text="Fetching User Data..." />;
    }

    if (error) {
        return (
            <div className="text-red-600 dark:text-red-400 text-center p-8 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <h3 className="font-bold">Error</h3>
                <p>{error}</p>
            </div>
        );
    }
    
    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="text-center">
                <h2 className="text-4xl font-bold font-syne tracking-tighter mb-2">Admin Dashboard</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
                    Overview of all registered users.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/60 dark:bg-black/20 backdrop-blur-xl border border-gray-300 dark:border-white/10 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg"
            >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-white/10">
                    <h3 className="text-xl font-bold font-syne tracking-tight text-cyan-600 dark:text-cyan-300">Registered Users</h3>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">{users.length}</span>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-white/10">
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Username</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Style DNA</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Gender</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">Body Type</th>
                                <th className="p-3 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase text-center">Wardrobe Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? users.map((user, index) => (
                                <motion.tr
                                    key={user.username}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-gray-200/50 dark:border-white/5"
                                >
                                    <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{user.username}</td>
                                    <td className="p-3 text-gray-600 dark:text-gray-400">{user.styleDNA?.title || 'Not set'}</td>
                                    <td className="p-3 text-gray-600 dark:text-gray-400">{user.gender || 'Not set'}</td>
                                    <td className="p-3 text-gray-600 dark:text-gray-400">{user.bodyProfile?.bodyType || 'Not set'}</td>
                                    <td className="p-3 text-gray-600 dark:text-gray-400 text-center font-semibold text-lg">{user.wardrobe.length}</td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center text-gray-500 dark:text-gray-400 py-8">
                                        No other users have registered yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </motion.div>
        </div>
    );
};