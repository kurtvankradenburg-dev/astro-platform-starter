import React, { useState, useMemo } from 'react';
import { useAuth, TOWNS } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { SettingsIcon, BellIcon, UserIcon, MapPinIcon, ShieldIcon, SunIcon, MoonIcon, SearchIcon } from '../ui/Icons';

export default function SettingsPage() {
    const { user, updateUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [name, setName] = useState(user?.name || '');
    const [town, setTown] = useState(user?.town || 'Johannesburg');
    const [townSearch, setTownSearch] = useState('');
    const [showTownDropdown, setShowTownDropdown] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled || false);
    const [saved, setSaved] = useState(false);

    const filteredTowns = useMemo(() => {
        if (!townSearch) return TOWNS.slice(0, 8);
        return TOWNS.filter(t => t.toLowerCase().includes(townSearch.toLowerCase())).slice(0, 8);
    }, [townSearch]);

    const handleSave = () => {
        updateUser({ name, town, notificationsEnabled });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setNotificationsEnabled(true);
                updateUser({ notificationsEnabled: true });
            } else {
                setNotificationsEnabled(false);
                updateUser({ notificationsEnabled: false });
                alert('Notifications denied. You will not receive town alerts. You can enable them in your browser settings.');
            }
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            {/* Profile */}
            <div className="card mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <UserIcon size={18} className="text-text-muted" />
                    <h3 className="font-bold">Profile</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-light mb-1">Full Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-light mb-1">Email</label>
                        <input value={user?.email || ''} disabled className="input opacity-60" />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-text-light mb-1">Town</label>
                        <div className="relative">
                            <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input
                                type="text"
                                value={townSearch || town}
                                onChange={e => { setTownSearch(e.target.value); setShowTownDropdown(true); }}
                                onFocus={() => setShowTownDropdown(true)}
                                className="input pl-10"
                                placeholder="Search for your town..."
                            />
                        </div>
                        {showTownDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-surface-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {filteredTowns.map(t => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => { setTown(t); setTownSearch(''); setShowTownDropdown(false); }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        {t}
                                    </button>
                                ))}
                                {filteredTowns.length === 0 && townSearch && (
                                    <button
                                        type="button"
                                        onClick={() => { setTown(townSearch); setShowTownDropdown(false); setTownSearch(''); }}
                                        className="w-full text-left px-4 py-2 text-sm text-primary font-medium hover:bg-primary/10"
                                    >
                                        + Create "{townSearch}" as your town
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Appearance */}
            <div className="card mb-4">
                <div className="flex items-center gap-2 mb-4">
                    {theme === 'light' ? <SunIcon size={18} className="text-text-muted" /> : <MoonIcon size={18} className="text-text-muted" />}
                    <h3 className="font-bold">Appearance</h3>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Dark Mode</p>
                        <p className="text-xs text-text-light">Switch between light and dark themes</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                </div>
            </div>

            {/* Notifications */}
            <div className="card mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <BellIcon size={18} className="text-text-muted" />
                    <h3 className="font-bold">Notifications</h3>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Push Notifications</p>
                        <p className="text-xs text-text-light">Receive alerts for your town</p>
                    </div>
                    <button
                        onClick={requestNotificationPermission}
                        className={`relative w-12 h-6 rounded-full transition-colors ${notificationsEnabled ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                </div>
            </div>

            {/* Account */}
            <div className="card mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <ShieldIcon size={18} className="text-text-muted" />
                    <h3 className="font-bold">Account</h3>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-text-light">Member since</span><span>{user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-ZA') : 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-text-light">Role</span><span className="capitalize">{user?.role}</span></div>
                    <div className="flex justify-between"><span className="text-text-light">Points</span><span>{user?.points}</span></div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button onClick={handleSave} className="btn btn-primary flex-1">
                    {saved ? 'Saved!' : 'Save Changes'}
                </button>
                <button onClick={logout} className="btn btn-danger">Sign Out</button>
            </div>
        </div>
    );
}
