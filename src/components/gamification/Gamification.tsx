import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { TrophyIcon, FlameIcon, StarIcon, UserIcon } from '../ui/Icons';

type Period = 'weekly' | 'monthly';

interface LeaderboardEntry {
    rank: number;
    name: string;
    town: string;
    points: number;
    streak: number;
    reports: number;
    chats: number;
}

const leaderboardData: LeaderboardEntry[] = [
    { rank: 1, name: 'Thabo Molefe', town: 'Johannesburg', points: 2450, streak: 14, reports: 23, chats: 156 },
    { rank: 2, name: 'Sarah Khumalo', town: 'Johannesburg', points: 2180, streak: 10, reports: 18, chats: 132 },
    { rank: 3, name: 'David Nkosi', town: 'Johannesburg', points: 1950, streak: 7, reports: 15, chats: 98 },
    { rank: 4, name: 'Linda Pillay', town: 'Johannesburg', points: 1720, streak: 12, reports: 12, chats: 89 },
    { rank: 5, name: 'Mike Roberts', town: 'Johannesburg', points: 1580, streak: 5, reports: 10, chats: 76 },
    { rank: 6, name: 'Zanele Dube', town: 'Johannesburg', points: 1340, streak: 8, reports: 9, chats: 64 },
    { rank: 7, name: 'James van Wyk', town: 'Johannesburg', points: 1120, streak: 3, reports: 7, chats: 52 },
    { rank: 8, name: 'Priya Singh', town: 'Johannesburg', points: 980, streak: 6, reports: 6, chats: 45 },
    { rank: 9, name: 'Chris Botha', town: 'Johannesburg', points: 850, streak: 4, reports: 5, chats: 38 },
    { rank: 10, name: 'Fatima Hassan', town: 'Johannesburg', points: 720, streak: 2, reports: 4, chats: 30 },
];

const medals = ['', 'bg-amber-400', 'bg-gray-300', 'bg-amber-600'];

export default function Gamification() {
    const { user } = useAuth();
    const [period, setPeriod] = useState<Period>('weekly');

    const streakRewards = [
        { days: 3, label: '3 Days', earned: (user?.streak || 0) >= 3, points: 50 },
        { days: 7, label: '1 Week', earned: (user?.streak || 0) >= 7, points: 150 },
        { days: 14, label: '2 Weeks', earned: (user?.streak || 0) >= 14, points: 300 },
        { days: 30, label: '1 Month', earned: (user?.streak || 0) >= 30, points: 500 },
    ];

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">Leaderboard & Rewards</h1>
            <p className="text-sm text-text-light mb-6">Earn points through reports, chat activity, and contributions</p>

            {/* User Stats */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="relative flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <TrophyIcon size={28} className="text-white" />
                    </div>
                    <div>
                        <p className="text-amber-100 text-sm">Your Stats</p>
                        <p className="text-3xl font-bold">{user?.points || 0} pts</p>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-sm"><FlameIcon size={14} />{user?.streak || 0} day streak</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Streaks */}
            <h2 className="text-lg font-bold mb-3">Streak Rewards</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {streakRewards.map(s => (
                    <div key={s.days} className={`card !p-4 text-center ${s.earned ? 'border-primary/30 bg-primary/5' : ''}`}>
                        <FlameIcon size={24} className={`mx-auto mb-2 ${s.earned ? 'text-orange-500' : 'text-text-muted'}`} />
                        <p className="text-sm font-bold">{s.label}</p>
                        <p className="text-xs text-text-muted">+{s.points} pts</p>
                        {s.earned && <span className="badge badge-primary mt-1 text-[10px]">Earned!</span>}
                    </div>
                ))}
            </div>

            {/* Points Guide */}
            <h2 className="text-lg font-bold mb-3">How to Earn Points</h2>
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {[
                    { action: 'Submit a report', points: 10 },
                    { action: 'Report gets resolved', points: 25 },
                    { action: 'Send a chat message', points: 2 },
                    { action: 'Daily login', points: 5 },
                    { action: 'Help someone in chat', points: 15 },
                    { action: 'Attend community event', points: 50 },
                ].map(item => (
                    <div key={item.action} className="card !p-3 flex items-center justify-between">
                        <span className="text-sm">{item.action}</span>
                        <span className="badge badge-accent">+{item.points}</span>
                    </div>
                ))}
            </div>

            {/* Leaderboard */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Town Leaderboard</h2>
                <div className="flex gap-1 bg-surface-dark rounded-lg p-0.5">
                    <button onClick={() => setPeriod('weekly')} className={`px-3 py-1 rounded-md text-xs font-medium ${period === 'weekly' ? 'bg-surface-card shadow text-text' : 'text-text-light'}`}>Weekly</button>
                    <button onClick={() => setPeriod('monthly')} className={`px-3 py-1 rounded-md text-xs font-medium ${period === 'monthly' ? 'bg-surface-card shadow text-text' : 'text-text-light'}`}>Monthly</button>
                </div>
            </div>

            <div className="card !p-0">
                <div className="divide-y divide-border">
                    {leaderboardData.map(entry => (
                        <div key={entry.rank} className={`flex items-center gap-3 p-3 ${entry.name === user?.name ? 'bg-primary/5' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${entry.rank <= 3 ? `${medals[entry.rank]} text-white` : 'bg-surface-dark text-text-light'}`}>
                                {entry.rank}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{entry.name}</p>
                                <p className="text-[10px] text-text-muted">{entry.reports} reports · {entry.chats} messages</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-sm font-bold text-amber-600">{entry.points}</p>
                                <div className="flex items-center gap-0.5 text-[10px] text-text-muted">
                                    <FlameIcon size={10} className="text-orange-400" />
                                    {entry.streak}d
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
