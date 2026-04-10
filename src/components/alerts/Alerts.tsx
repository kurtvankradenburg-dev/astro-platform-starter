import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { AlertIcon, BellIcon, CheckIcon, MapPinIcon } from '../ui/Icons';

type AlertType = 'critical' | 'warning' | 'info';

interface Alert {
    id: string;
    title: string;
    description: string;
    type: AlertType;
    town: string;
    createdAt: string;
    read: boolean;
}

const sampleAlerts: Alert[] = [
    { id: '1', title: 'Water outage reported in your area', description: 'Johannesburg Water has reported a pipe burst on Main Road. Water supply may be interrupted for 6-8 hours. Please store water.', type: 'critical', town: 'Johannesburg', createdAt: '2026-04-10T06:00:00Z', read: false },
    { id: '2', title: 'Load shedding Stage 2 from 4pm', description: 'Eskom has announced Stage 2 load shedding starting at 4pm today. Check your area schedule for specific times.', type: 'warning', town: 'Johannesburg', createdAt: '2026-04-10T08:30:00Z', read: false },
    { id: '3', title: 'Community cleanup drive this Saturday', description: 'Join us for a community cleanup at the Community Park from 8am-12pm. Refreshments provided. Bring gloves!', type: 'info', town: 'Johannesburg', createdAt: '2026-04-09T10:00:00Z', read: true },
    { id: '4', title: 'Road closure: N1 southbound', description: 'The N1 southbound between Buccleuch and Midrand will be closed this weekend for maintenance. Use alternative routes.', type: 'warning', town: 'Johannesburg', createdAt: '2026-04-08T15:00:00Z', read: true },
    { id: '5', title: 'New recycling centre opened', description: 'A new recycling centre has opened at 45 Green St, Centurion. Open Mon-Sat 7am-5pm. Glass, plastic, paper, and metal accepted.', type: 'info', town: 'Centurion', createdAt: '2026-04-07T09:00:00Z', read: true },
    { id: '6', title: 'Severe weather warning', description: 'SA Weather Service warns of heavy thunderstorms expected this afternoon. Possible hail in some areas. Stay indoors if possible.', type: 'critical', town: 'Johannesburg', createdAt: '2026-04-06T11:00:00Z', read: true },
];

const typeConfig: Record<AlertType, { label: string; bg: string; border: string; icon: string }> = {
    critical: { label: 'Critical', bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500' },
    warning: { label: 'Warning', bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500' },
    info: { label: 'Info', bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500' },
};

export default function Alerts() {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState<Alert[]>(sampleAlerts);
    const [filter, setFilter] = useState<AlertType | 'all'>('all');

    const townAlerts = alerts.filter(a => a.town === user?.town || a.town === 'All');
    const filtered = townAlerts.filter(a => filter === 'all' || a.type === filter);
    const unreadCount = townAlerts.filter(a => !a.read).length;

    const markRead = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    };

    const markAllRead = () => {
        setAlerts(prev => prev.map(a => ({ ...a, read: true })));
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
                {unreadCount > 0 && (
                    <button onClick={markAllRead} className="btn btn-outline btn-sm gap-1">
                        <CheckIcon size={14} />
                        Mark all read
                    </button>
                )}
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {(['all', 'critical', 'warning', 'info'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-text-light hover:bg-gray-200'}`}
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
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-semibold text-sm">{alert.title}</h3>
                                            {!alert.read && <span className="w-2 h-2 bg-primary rounded-full" />}
                                        </div>
                                        <p className="text-xs text-text-light">{alert.description}</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                                            <span className="flex items-center gap-1"><MapPinIcon size={12} />{alert.town}</span>
                                            <span>{new Date(alert.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
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
