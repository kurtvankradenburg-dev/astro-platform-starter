import React, { useState, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { AlertIcon, BellIcon, CheckIcon, MapPinIcon, PlusIcon, XIcon, CameraIcon } from '../ui/Icons';

type AlertType = 'critical' | 'warning' | 'info';
type AlertCategory = 'water' | 'electricity' | 'safety' | 'weather' | 'traffic' | 'community' | 'other';

interface Alert {
    id: string;
    title: string;
    description: string;
    type: AlertType;
    category: AlertCategory;
    town: string;
    createdAt: string;
    read: boolean;
    author?: string;
    imageUrl?: string;
}

const categoryLabels: Record<AlertCategory, string> = {
    water: 'Water', electricity: 'Electricity', safety: 'Safety',
    weather: 'Weather', traffic: 'Traffic', community: 'Community', other: 'Other',
};

const sampleAlerts: Alert[] = [
    { id: '1', title: 'Water outage reported in your area', description: 'Johannesburg Water has reported a pipe burst on Main Road. Water supply may be interrupted for 6-8 hours. Please store water for essential use.', type: 'critical', category: 'water', town: 'Johannesburg', createdAt: '2026-04-10T06:00:00Z', read: false, imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=400&h=200&fit=crop' },
    { id: '2', title: 'Load shedding Stage 2 from 4pm', description: 'Eskom has announced Stage 2 load shedding starting at 4pm today. Check your area schedule for specific times and plan accordingly.', type: 'warning', category: 'electricity', town: 'Johannesburg', createdAt: '2026-04-10T08:30:00Z', read: false },
    { id: '3', title: 'Community cleanup drive this Saturday', description: 'Join us for a community cleanup at the Community Park from 8am-12pm. Refreshments provided. Bring gloves and comfortable shoes!', type: 'info', category: 'community', town: 'Johannesburg', createdAt: '2026-04-09T10:00:00Z', read: true },
    { id: '4', title: 'Road closure: N1 southbound', description: 'The N1 southbound between Buccleuch and Midrand will be closed this weekend for maintenance. Use alternative routes and plan extra travel time.', type: 'warning', category: 'traffic', town: 'Johannesburg', createdAt: '2026-04-08T15:00:00Z', read: true },
    { id: '5', title: 'New recycling centre opened', description: 'A new recycling centre has opened at 45 Green St, Centurion. Open Mon-Sat 7am-5pm. Glass, plastic, paper, and metal accepted.', type: 'info', category: 'community', town: 'Centurion', createdAt: '2026-04-07T09:00:00Z', read: true },
    { id: '6', title: 'Severe weather warning', description: 'SA Weather Service warns of heavy thunderstorms expected this afternoon. Possible hail in some areas. Stay indoors if possible and secure loose items outdoors.', type: 'critical', category: 'weather', town: 'Johannesburg', createdAt: '2026-04-06T11:00:00Z', read: true, imageUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=400&h=200&fit=crop' },
];

const typeConfig: Record<AlertType, { label: string; bg: string; border: string; icon: string }> = {
    critical: { label: 'Critical', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', icon: 'text-red-500' },
    warning: { label: 'Warning', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', icon: 'text-amber-500' },
    info: { label: 'Info', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', icon: 'text-blue-500' },
};

export default function Alerts() {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState<Alert[]>(sampleAlerts);
    const [filter, setFilter] = useState<AlertType | 'all'>('all');
    const [showNew, setShowNew] = useState(false);
    const [newAlert, setNewAlert] = useState({ title: '', description: '', type: 'warning' as AlertType, category: 'other' as AlertCategory });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const townAlerts = alerts.filter(a => a.town === user?.town || a.town === 'All');
    const filtered = townAlerts.filter(a => filter === 'all' || a.type === filter);
    const unreadCount = townAlerts.filter(a => !a.read).length;

    const markRead = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    };

    const markAllRead = () => {
        setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const submitAlert = () => {
        if (!newAlert.title.trim() || !newAlert.description.trim()) return;
        const alert: Alert = {
            id: crypto.randomUUID(),
            title: newAlert.title,
            description: newAlert.description,
            type: newAlert.type,
            category: newAlert.category,
            town: user?.town || 'All',
            createdAt: new Date().toISOString(),
            read: false,
            author: user?.name || 'Anonymous',
            imageUrl: imagePreview || undefined,
        };
        setAlerts(prev => [alert, ...prev]);
        setNewAlert({ title: '', description: '', type: 'warning', category: 'other' });
        setImagePreview(null);
        setShowNew(false);

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Eco City Alert: ${alert.title}`, { body: alert.description.slice(0, 100), icon: '/favicon.svg' });
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Alerts</h1>
                    <p className="text-sm text-text-light mt-1">
                        Town-specific notifications for {user?.town}
                        {unreadCount > 0 && <span className="ml-2 badge badge-danger">{unreadCount} new</span>}
                    </p>
                </div>
                <div className="flex gap-2">
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} className="btn btn-outline btn-sm gap-1">
                            <CheckIcon size={14} />
                            Mark all read
                        </button>
                    )}
                    <button onClick={() => setShowNew(true)} className="btn btn-primary btn-sm gap-1">
                        <PlusIcon size={14} />
                        <span className="hidden sm:inline">Create Alert</span>
                    </button>
                </div>
            </div>

            {/* Create Alert Form */}
            {showNew && (
                <div className="card mb-6 border-primary/30">
                    <h3 className="font-bold mb-3">Create a New Alert</h3>
                    <div className="space-y-3">
                        <input value={newAlert.title} onChange={e => setNewAlert(p => ({ ...p, title: e.target.value }))} placeholder="Alert title" className="input" />
                        <textarea value={newAlert.description} onChange={e => setNewAlert(p => ({ ...p, description: e.target.value }))} placeholder="Describe the alert..." className="input min-h-[80px] resize-y" />
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-text-light mb-1">Urgency Level</label>
                                <select value={newAlert.type} onChange={e => setNewAlert(p => ({ ...p, type: e.target.value as AlertType }))} className="input">
                                    <option value="critical">Critical</option>
                                    <option value="warning">Warning</option>
                                    <option value="info">Info</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-text-light mb-1">Category</label>
                                <select value={newAlert.category} onChange={e => setNewAlert(p => ({ ...p, category: e.target.value as AlertCategory }))} className="input">
                                    {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            {imagePreview ? (
                                <div className="relative inline-block">
                                    <img src={imagePreview} alt="Preview" className="h-24 rounded-lg object-cover" />
                                    <button onClick={() => { setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute -top-2 -right-2 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center">
                                        <XIcon size={12} />
                                    </button>
                                </div>
                            ) : (
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="btn btn-outline btn-sm gap-1">
                                    <CameraIcon size={14} />
                                    Attach Photo
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={submitAlert} className="btn btn-primary">Create Alert</button>
                            <button onClick={() => { setShowNew(false); setImagePreview(null); }} className="btn btn-outline">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {(['all', 'critical', 'warning', 'info'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === f ? 'bg-primary text-white' : 'bg-surface-dark text-text-light hover:bg-border'}`}
                    >{f === 'all' ? 'All' : typeConfig[f].label}</button>
                ))}
            </div>

            {/* Alerts */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="card text-center py-12">
                        <BellIcon size={40} className="mx-auto text-text-muted mb-4" />
                        <h3 className="font-bold mb-2">No alerts</h3>
                        <p className="text-sm text-text-light">No alerts matching your filter for {user?.town}.</p>
                    </div>
                ) : (
                    filtered.map(alert => {
                        const tc = typeConfig[alert.type];
                        return (
                            <div
                                key={alert.id}
                                onClick={() => markRead(alert.id)}
                                className={`card !border ${tc.border} ${tc.bg} cursor-pointer ${!alert.read ? 'ring-2 ring-primary/20' : ''}`}
                            >
                                <div className="flex items-start gap-3">
                                    <AlertIcon size={20} className={`${tc.icon} shrink-0 mt-0.5`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-semibold text-sm">{alert.title}</h3>
                                            {!alert.read && <span className="w-2 h-2 bg-primary rounded-full" />}
                                            <span className="badge badge-secondary text-[10px]">{categoryLabels[alert.category]}</span>
                                        </div>
                                        <p className="text-xs text-text-light">{alert.description}</p>
                                        {alert.imageUrl && (
                                            <img src={alert.imageUrl} alt="" className="mt-2 rounded-lg w-full max-w-sm h-32 object-cover" loading="lazy" />
                                        )}
                                        <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                                            <span className="flex items-center gap-1"><MapPinIcon size={12} />{alert.town}</span>
                                            <span>{new Date(alert.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                            {alert.author && <span>By {alert.author}</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
