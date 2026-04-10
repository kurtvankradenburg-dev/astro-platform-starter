import React from 'react';
import { LeafIcon } from '../ui/Icons';

export default function LoadingScreen() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
            <div className="text-center" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-6 shadow-lg shadow-green-200" style={{ animation: 'pulse 2s infinite' }}>
                    <LeafIcon className="text-white" size={40} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Eco City</h1>
                <p className="text-gray-400 text-sm mb-6">Loading your community...</p>
                <div className="loading-spinner mx-auto" />
            </div>
            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
            `}</style>
        </div>
    );
}
