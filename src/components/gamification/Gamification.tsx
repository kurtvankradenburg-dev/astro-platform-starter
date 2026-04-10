import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { TrophyIcon, FlameIcon, StarIcon } from '../ui/Icons';

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

const medalBg = ['', 'bg-amber-400', 'bg-slate-400', 'bg-amber-700'];

const streakMilestones = [
    { days: 3, label: '3 Days', points: 50, emoji: '🔥' },
    { days: 7, label: '1 Week', points: 150, emoji: '⚡' },
    { days: 14, label: '2 Weeks', points: 300, emoji: '💎' },
    { days: 30, label: '1 Month', points: 500, emoji: '🏆' },
    { days: 60, label: '2 Months', points: 1000, emoji: '👑' },
];

export default function Gamification() {
    const { user } = useAuth();
    const [period, setPeriod] = useState<Period>('weekly');

    const streak = user?.streak || 0;

    // Find next milestone
    const nextMilestone = streakMilestones.find(m => streak < m.days);
    const prevMilestone = streakMilestones.filter(m => streak >= m.days).slice(-1)[0];

    const streakProgress = nextMilestone
        ? Math.round(((streak - (prevMilestone?.days || 0)) / (nextMilestone.days - (prevMilestone?.days || 0))) * 100)
        : 100;

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">Leaderboard & Rewards</h1>
            <p className="text-sm text-text-light mb-6">Earn points through reports, chat activity, and daily logins</p>

            {/* User Stats */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="relative flex items-start gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                        <TrophyIcon size={28} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-amber-100 text-sm">{user?.name}'s Stats</p>
                        <p className="text-3xl font-bold">{user?.points || 0} <span className="text-lg font-normal text-amber-200">points</span></p>
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                            <span className="flex items-center gap-1 text-sm"><FlameIcon size={14} />{streak} day streak</span>
                            {nextMilestone && (
                                <span className="text-sm text-amber-200">{nextMilestone.days - streak} days to {nextMilestone.emoji} {nextMilestone.label}</span>
                            )}
                        </div>
                        {/* Streak progress bar */}
                        {nextMilestone && (
                            <div className="mt-3">
                                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-white rounded-full transition-all"
                                        style={{ width: `${streakProgress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-amber-200 mt-1">
                                    <span>{prevMilestone?.days || 0}d</span>
                                    <span>{nextMilestone.days}d</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Streak Milestones */}
            <h2 className="text-lg font-bold mb-3">Streak Milestones</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                {streakMilestones.map(m => {
                    const earned = streak >= m.days;
                    const isCurrent = !earned && streak >= (streakMilestones[streakMilestones.indexOf(m) - 1]?.days || 0);
                    return (
                        <div key={m.days} className={`card !p-4 text-center relative ${earned ? 'border-primary/40 bg-primary/5' : isCurrent ? 'border-amber-300 dark:border-amber-600' : ''}`}>
                            {isCurrent && <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] bg-amber-400 text-white px-2 py-0.5 rounded-full font-bold whitespace-nowrap">NEXT</div>}
                            <p className="text-2xl mb-1">{m.emoji}</p>
                            <p className="text-sm font-bold">{m.label}</p>
                            <p className="text-xs text-text-muted">+{m.points} pts</p>
                            {earned ? (
                                <span className="badge badge-primary mt-2 text-[10px]">Earned!</span>
                            ) : (
                                <p className="text-[10px] text-text-muted mt-1">{m.days - streak} days left</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Points Guide */}
            <h2 className="text-lg font-bold mb-3">How to Earn Points</h2>
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {[
                    { action: 'Daily login', points: 5, emoji: '📅' },
                    { action: 'Submit a report', points: 10, emoji: '📋' },
                    { action: 'Report gets resolved', points: 25, emoji: '✅' },
                    { action: 'Send a chat message', points: 2, emoji: '💬' },
                    { action: 'Help someone in chat', points: 15, emoji: '🤝' },
                    { action: 'Attend community event', points: 50, emoji: '🎉' },
                ].map(item => (
                    <div key={item.action} className="card !p-3 flex items-center gap-3">
                        <span className="text-lg">{item.emoji}</span>
                        <span className="text-sm flex-1">{item.action}</span>
                        <span className="badge badge-accent font-bold">+{item.points}</span>
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

            <div className="card !p-0 mb-6">
                <div className="divide-y divide-border">
                    {leaderboardData.map(entry => {
                        const isMe = entry.name === user?.name;
                        return (
                            <div key={entry.rank} className={`flex items-center gap-3 p-3 ${isMe ? 'bg-primary/5' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${entry.rank <= 3 ? `${medalBg[entry.rank]} text-white` : 'bg-surface-dark text-text-light'}`}>
                                    {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${isMe ? 'text-primary' : ''}`}>{entry.name}{isMe ? ' (You)' : ''}</p>
                                    <p className="text-[10px] text-text-muted">{entry.reports} reports · {entry.chats} messages</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-amber-600">{entry.points}</p>
                                    <div className="flex items-center gap-0.5 text-[10px] text-text-muted justify-end">
                                        <FlameIcon size={10} className="text-orange-400" />
                                        {entry.streak}d
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <p className="text-center text-xs text-text-muted opacity-50">
                Gamification by Kurt van Kradenburg, Anjanette Venter, Ninke Hough & Ryan Cronje
            </p>
        </div>
    );
}
