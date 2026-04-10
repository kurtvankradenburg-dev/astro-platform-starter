import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import type { Page } from './App';
import {
    HomeIcon, BookIcon, BotIcon, GraduationIcon, HeartIcon, StoreIcon,
    ChatIcon, FileIcon, AlertIcon, TrophyIcon, SettingsIcon, LogOutIcon,
    LeafIcon, ShieldIcon, InfoIcon, GlobeIcon, SunIcon, MoonIcon, BriefcaseIcon
} from '../ui/Icons';

interface SidebarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: React.FC<any>; section?: string }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { page: 'reports', label: 'Reports', icon: FileIcon },
    { page: 'alerts', label: 'Alerts', icon: AlertIcon },
    { page: 'knowledge', label: 'Knowledge Centre', icon: BookIcon, section: 'Intelligence' },
    { page: 'ai-assistant', label: 'AI Assistant', icon: BotIcon },
    { page: 'study', label: 'Study Hub', icon: GraduationIcon, section: 'Learning' },
    { page: 'community', label: 'Community Support', icon: HeartIcon, section: 'Community' },
    { page: 'jobs', label: 'Job Centre', icon: BriefcaseIcon },
    { page: 'directory', label: 'Local Services', icon: StoreIcon },
    { page: 'chat', label: 'Chat', icon: ChatIcon },
    { page: 'gamification', label: 'Leaderboard', icon: TrophyIcon, section: 'Engagement' },
    { page: 'settings', label: 'Settings', icon: SettingsIcon, section: 'Settings' },
    { page: 'about', label: 'About', icon: InfoIcon },
    { page: 'help', label: 'Help & Support', icon: GlobeIcon },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="w-64 h-full bg-sidebar flex flex-col">
            {/* Logo */}
            <div className="p-4 flex items-center gap-3 border-b border-white/10">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shrink-0">
                    <LeafIcon className="text-white" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-white font-bold text-base leading-tight">Eco City</h2>
                    <p className="text-gray-400 text-xs truncate">{user?.town}</p>
                </div>
                <button
                    onClick={toggleTheme}
                    className="p-1.5 rounded-lg hover:bg-sidebar-hover text-gray-400 hover:text-white transition-colors shrink-0"
                    title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                >
                    {theme === 'light' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-2 px-2">
                {navItems.map((item, i) => (
                    <React.Fragment key={item.page}>
                        {item.section && (
                            <div className="px-3 pt-4 pb-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                                {item.section}
                            </div>
                        )}
                        <button
                            onClick={() => onNavigate(item.page)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all mb-0.5 ${
                                currentPage === item.page
                                    ? 'bg-primary/20 text-primary font-medium'
                                    : 'text-sidebar-text hover:bg-sidebar-hover'
                            }`}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    </React.Fragment>
                ))}
            </nav>

            {/* User footer */}
            <div className="p-3 border-t border-white/10">
                <div className="flex items-center gap-3 mb-2 px-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{user?.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                </div>
                <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <LogOutIcon size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}
