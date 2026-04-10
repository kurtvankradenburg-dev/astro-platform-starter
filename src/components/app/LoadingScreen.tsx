import React from 'react';
import { LeafIcon } from '../ui/Icons';

export default function LoadingScreen() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-[#0c1a0e] dark:via-[#0f1a12] dark:to-[#0c1a0e] flex items-center justify-center">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6 shadow-lg shadow-green-200 dark:shadow-green-900/30 leaf-animate">
                    <LeafIcon className="text-white" size={40} />
                </div>
                <div className="fade-in-delayed">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Eco City</h1>
                    <p className="text-gray-400 text-sm mb-6">Loading your community...</p>
                    <div className="loading-spinner mx-auto" />
                </div>
            </div>
        </div>
    );
}
