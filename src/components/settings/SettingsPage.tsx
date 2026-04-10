import React, { useState, useMemo } from 'react';
import { useAuth, TOWNS } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import { SettingsIcon, BellIcon, UserIcon, MapPinIcon, ShieldIcon, SunIcon, MoonIcon, SearchIcon, FlameIcon, TrophyIcon, BotIcon } from '../ui/Icons';

export default function SettingsPage() {
    const { user, updateUser, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [name, setName] = useState(user?.name || '');
    const [town, setTown] = useState(user?.town || 'Johannesburg');
    const [townSearch, setTownSearch] = useState('');
    const [showTownDropdown, setShowTownDropdown] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled || false);
    const [notificationLevel, setNotificationLevel] = useState(user?.notificationLevel || 'all');
    const [showOnLeaderboard, setShowOnLeaderboard] = useState(user?.showOnLeaderboard !== false);
    const [language, setLanguage] = useState(user?.language || 'en');
    const [aiTone, setAiTone] = useState(user?.aiTone || 'helpful');
    const [saved, setSaved] = useState(false);

    const filteredTowns = useMemo(() => {
        if (!townSearch) return TOWNS.slice(0, 8);
        return TOWNS.filter(t => t.toLowerCase().includes(townSearch.toLowerCase())).slice(0, 8);
    }, [townSearch]);

    const handleSave = () => {
        updateUser({ name, town, notificationsEnabled, notificationLevel: notificationLevel as any, showOnLeaderboard, language, aiTone });
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
            }
        }
    };

    const Section = ({ icon: Icon, title, children }: { icon: React.FC<any>; title: string; children: React.ReactNode }) => (
        <div className="card mb-4">
            <div className="flex items-center gap-2 mb-4">
                <Icon size={18} className="text-text-muted" />
                <h3 className="font-bold">{title}</h3>
            </div>
            {children}
        </div>
    );

    const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
        <button
            onClick={onChange}
            className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-border'}`}
        >
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`} />
        </button>
    );

    return (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            {/* Profile */}
            <Section icon={UserIcon} title="Profile">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-light mb-1">Full Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="input" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-light mb-1">Email</label>
                        <input value={user?.email || ''} disabled className="input opacity-60 cursor-not-allowed" />
                        <p className="text-xs text-text-muted mt-1">Email cannot be changed</p>
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-text-light mb-1">Town / City</label>
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
                                    >{t}</button>
                                ))}
                                {filteredTowns.length === 0 && townSearch && (
                                    <button
                                        type="button"
                                        onClick={() => { setTown(townSearch); setShowTownDropdown(false); setTownSearch(''); }}
                                        className="w-full text-left px-4 py-2 text-sm text-primary font-medium hover:bg-primary/10"
                                    >+ Use "{townSearch}" as your town</button>
                                )}
                            </div>
                        )}
                        {town && !showTownDropdown && (
                            <p className="text-xs text-primary mt-1 font-medium flex items-center gap-1"><MapPinIcon size={10} /> {town}</p>
                        )}
                    </div>
                </div>
            </Section>

            {/* Appearance */}
            <Section icon={theme === 'light' ? SunIcon : MoonIcon} title="Appearance">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Dark Mode</p>
                            <p className="text-xs text-text-light">Switch between light and dark themes</p>
                        </div>
                        <Toggle checked={theme === 'dark'} onChange={toggleTheme} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Language</label>
                        <select value={language} onChange={e => setLanguage(e.target.value)} className="input">
                            <option value="en">English</option>
                            <option value="af">Afrikaans</option>
                            <option value="zu">isiZulu</option>
                            <option value="xh">isiXhosa</option>
                            <option value="st">Sesotho</option>
                        </select>
                        <p className="text-xs text-text-muted mt-1">Language support coming soon</p>
                    </div>
                </div>
            </Section>

            {/* AI Preferences */}
            <Section icon={BotIcon} title="AI Assistant">
                <div>
                    <label className="block text-sm font-medium mb-2">Default AI Tone</label>
                    <select value={aiTone} onChange={e => setAiTone(e.target.value)} className="input">
                        <option value="helpful">Helpful — Clear and balanced</option>
                        <option value="formal">Formal — Professional and structured</option>
                        <option value="casual">Casual — Friendly and relaxed</option>
                        <option value="educational">Educational — Teaching-focused</option>
                        <option value="creative">Creative — Imaginative and engaging</option>
                    </select>
                    <p className="text-xs text-text-muted mt-1">This sets the default tone for the AI Assistant. You can change it per session.</p>
                </div>
            </Section>

            {/* Notifications */}
            <Section icon={BellIcon} title="Notifications">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Push Notifications</p>
                            <p className="text-xs text-text-light">Receive alerts for your town</p>
                        </div>
                        <Toggle checked={notificationsEnabled} onChange={requestNotificationPermission} />
                    </div>
                    {notificationsEnabled && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Alert Level</label>
                            <select value={notificationLevel} onChange={e => setNotificationLevel(e.target.value)} className="input">
                                <option value="all">All alerts (info, warnings, critical)</option>
                                <option value="critical">Critical and emergencies only</option>
                                <option value="none">None (do not notify)</option>
                            </select>
                        </div>
                    )}
                </div>
            </Section>

            {/* Privacy */}
            <Section icon={ShieldIcon} title="Privacy">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Show on Leaderboard</p>
                        <p className="text-xs text-text-light">Allow your name to appear in the town leaderboard</p>
                    </div>
                    <Toggle checked={showOnLeaderboard} onChange={() => setShowOnLeaderboard(!showOnLeaderboard)} />
                </div>
            </Section>

            {/* Account Stats */}
            <Section icon={TrophyIcon} title="Account">
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-text-light">Member since</span><span className="font-medium">{user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-text-light">Role</span><span className="font-medium capitalize">{user?.role || 'citizen'}</span></div>
                    <div className="flex justify-between"><span className="text-text-light">Points earned</span><span className="font-medium text-amber-600">{user?.points || 0} pts</span></div>
                    <div className="flex justify-between">
                        <span className="text-text-light">Current streak</span>
                        <span className="font-medium flex items-center gap-1">
                            <FlameIcon size={14} className="text-orange-500" />
                            {user?.streak || 0} days
                        </span>
                    </div>
                    <div className="flex justify-between"><span className="text-text-light">Town</span><span className="font-medium flex items-center gap-1"><MapPinIcon size={12} className="text-primary" />{user?.town}</span></div>
                    <div className="flex justify-between"><span className="text-text-light">User ID</span><span className="font-mono text-[10px] text-text-muted truncate max-w-[180px]">{user?.id}</span></div>
                </div>
            </Section>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
                <button onClick={handleSave} className={`btn flex-1 ${saved ? 'btn-outline border-primary text-primary' : 'btn-primary'}`}>
                    {saved ? '✓ Saved!' : 'Save Changes'}
                </button>
                <button onClick={logout} className="btn btn-danger">Sign Out</button>
            </div>

            <p className="text-center text-xs text-text-light opacity-60">
                Eco City by Kurt van Kradenburg, Anjanette Venter, Ninke Hough & Ryan Cronje
            </p>
            <p className="text-center text-xs text-text-muted opacity-40 mt-1">v0.1.0 · support@ecocity.co.za</p>
        </div>
    );
}
