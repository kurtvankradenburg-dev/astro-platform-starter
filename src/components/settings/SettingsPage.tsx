import React, { useState } from 'react';
import { useAuth, TOWNS } from '../auth/AuthContext';
import { SettingsIcon, BellIcon, UserIcon, MapPinIcon, ShieldIcon } from '../ui/Icons';

export default function SettingsPage() {
    const { user, updateUser, logout } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [town, setTown] = useState(user?.town || 'Johannesburg');
    const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled || false);
    const [saved, setSaved] = useState(false);

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
                        <input value={user?.email || ''} disabled className="input bg-gray-50" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-light mb-1">Town</label>
                        <select value={town} onChange={e => setTown(e.target.value)} className="input">
                            {TOWNS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
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
