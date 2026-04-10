import React from 'react';
import { useAuth } from '../auth/AuthContext';
import type { Page } from '../app/App';
import {
    FileIcon, AlertIcon, BookIcon, BotIcon, GraduationIcon, HeartIcon,
    StoreIcon, ChatIcon, TrophyIcon, FlameIcon, LeafIcon, MapPinIcon
} from '../ui/Icons';

interface DashboardProps {
    onNavigate: (page: Page) => void;
}

const quickActions: { page: Page; label: string; desc: string; icon: React.FC<any>; color: string }[] = [
    { page: 'reports', label: 'Reports', desc: 'Submit & view reports', icon: FileIcon, color: 'bg-blue-500' },
    { page: 'alerts', label: 'Alerts', desc: 'Town notifications', icon: AlertIcon, color: 'bg-red-500' },
    { page: 'knowledge', label: 'Knowledge Centre', desc: 'Learn & ask Eco AI', icon: BookIcon, color: 'bg-emerald-500' },
    { page: 'ai-assistant', label: 'AI Assistant', desc: 'Chat with AI', icon: BotIcon, color: 'bg-purple-500' },
    { page: 'study', label: 'Study Hub', desc: 'Notes & past papers', icon: GraduationIcon, color: 'bg-amber-500' },
    { page: 'community', label: 'Community', desc: 'Aid & local deals', icon: HeartIcon, color: 'bg-pink-500' },
    { page: 'directory', label: 'Local Services', desc: 'Find businesses', icon: StoreIcon, color: 'bg-indigo-500' },
    { page: 'chat', label: 'Chat', desc: 'Community chat', icon: ChatIcon, color: 'bg-teal-500' },
];

const townBanners: Record<string, string> = {
    'Johannesburg': 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=800&h=300&fit=crop',
    'Cape Town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=300&fit=crop',
    'Durban': 'https://images.unsplash.com/photo-1588001832198-c15cff59b078?w=800&h=300&fit=crop',
    'Pretoria': 'https://images.unsplash.com/photo-1624880732477-24a3e4099e0c?w=800&h=300&fit=crop',
    'default': 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=800&h=300&fit=crop',
};

export default function Dashboard({ onNavigate }: DashboardProps) {
    const { user } = useAuth();
    const bannerUrl = townBanners[user?.town || ''] || townBanners['default'];

    const stats = [
        { label: 'Reports Filed', value: '12', icon: FileIcon, color: 'text-blue-500' },
        { label: 'Points Earned', value: user?.points || 0, icon: TrophyIcon, color: 'text-amber-500' },
        { label: 'Day Streak', value: user?.streak || 0, icon: FlameIcon, color: 'text-orange-500' },
        { label: 'Eco Score', value: 'A+', icon: LeafIcon, color: 'text-green-500' },
    ];

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            {/* Welcome Banner with Town Image */}
            <div className="rounded-2xl mb-6 relative overflow-hidden">
                <img src={bannerUrl} alt={user?.town} className="w-full h-48 sm:h-56 object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-green-300 text-sm mb-2">
                        <MapPinIcon size={14} />
                        <span>{user?.town}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                    <p className="text-gray-300 text-sm sm:text-base max-w-lg">Your community dashboard — stay informed, contribute, and make your town greener.</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="card !p-4 flex items-center gap-3">
                        <div className={`${stat.color} shrink-0`}>
                            <stat.icon size={22} />
                        </div>
                        <div>
                            <p className="text-xl font-bold">{stat.value}</p>
                            <p className="text-xs text-text-light">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {quickActions.map(action => (
                    <button
                        key={action.page}
                        onClick={() => onNavigate(action.page)}
                        className="card !p-4 text-left hover:border-primary/30 transition-all group cursor-pointer"
                    >
                        <div className={`${action.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                            <action.icon size={20} className="text-white" />
                        </div>
                        <p className="font-semibold text-sm">{action.label}</p>
                        <p className="text-xs text-text-light mt-0.5">{action.desc}</p>
                    </button>
                ))}
            </div>

            {/* Recent Activity */}
            <h2 className="text-lg font-bold mb-3">Recent Activity</h2>
            <div className="card !p-0 divide-y divide-border mb-6">
                {[
                    { text: 'Water outage reported in your area', time: '2 hours ago', type: 'alert' },
                    { text: 'New sustainability article published', time: '5 hours ago', type: 'knowledge' },
                    { text: 'Community cleanup drive this Saturday', time: '1 day ago', type: 'event' },
                    { text: 'New recycling centre opened nearby', time: '2 days ago', type: 'news' },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-4">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${item.type === 'alert' ? 'bg-red-500' : item.type === 'knowledge' ? 'bg-blue-500' : item.type === 'event' ? 'bg-green-500' : 'bg-amber-500'}`} />
                        <p className="text-sm flex-1">{item.text}</p>
                        <span className="text-xs text-text-muted whitespace-nowrap">{item.time}</span>
                    </div>
                ))}
            </div>

            {/* Town Info */}
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="card">
                    <h3 className="font-bold text-base mb-3">Town Overview</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-text-light">Population</span><span className="font-medium">~1.2M</span></div>
                        <div className="flex justify-between"><span className="text-text-light">Active Citizens</span><span className="font-medium">3,847</span></div>
                        <div className="flex justify-between"><span className="text-text-light">Open Reports</span><span className="font-medium">23</span></div>
                        <div className="flex justify-between"><span className="text-text-light">Air Quality</span><span className="font-medium text-green-600">Good</span></div>
                    </div>
                </div>
                <div className="card">
                    <h3 className="font-bold text-base mb-3">Upcoming Events</h3>
                    <div className="space-y-3">
                        {[
                            { name: 'Community Cleanup', date: 'Sat, 12 Apr', color: 'bg-green-500' },
                            { name: 'Town Hall Meeting', date: 'Wed, 16 Apr', color: 'bg-blue-500' },
                            { name: 'Tree Planting Drive', date: 'Sat, 19 Apr', color: 'bg-emerald-500' },
                        ].map(e => (
                            <div key={e.name} className="flex items-center gap-3">
                                <div className={`w-1 h-8 rounded-full ${e.color}`} />
                                <div>
                                    <p className="text-sm font-medium">{e.name}</p>
                                    <p className="text-xs text-text-muted">{e.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
