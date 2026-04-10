import React, { useState, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { FileIcon, PlusIcon, MapPinIcon, CheckIcon, ClockIcon, AlertIcon, ImageIcon, XIcon, CameraIcon } from '../ui/Icons';

type ReportStatus = 'open' | 'in-progress' | 'resolved';
type ReportCategory = 'potholes' | 'water-outages' | 'electrical' | 'loose-cables' | 'waste' | 'infrastructure' | 'environment' | 'safety' | 'other';

interface Report {
    id: string;
    title: string;
    description: string;
    category: ReportCategory;
    status: ReportStatus;
    location: string;
    author: string;
    createdAt: string;
    upvotes: number;
    imageUrl?: string;
}

const sampleReports: Report[] = [
    { id: '1', title: 'Pothole on Main Road', description: 'Large pothole causing danger to vehicles near the intersection of Main and 5th. Multiple cars have been damaged over the past week and residents are concerned about safety.', category: 'potholes', status: 'open', location: 'Main Road & 5th Ave, Johannesburg', author: 'Thabo M.', createdAt: '2026-04-08T10:00:00Z', upvotes: 15, imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&h=250&fit=crop' },
    { id: '2', title: 'Streetlight not working', description: 'Streetlight has been off for 2 weeks at Park Street. The area is very dark at night and residents feel unsafe walking in the area after sundown.', category: 'electrical', status: 'in-progress', location: 'Park Street, Sandton', author: 'Sarah K.', createdAt: '2026-04-05T14:30:00Z', upvotes: 8, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=250&fit=crop' },
    { id: '3', title: 'Illegal dumping near river', description: 'People are dumping waste near the community river creating a major health hazard. The waste includes plastic bags, food waste, and construction rubble.', category: 'waste', status: 'open', location: 'Riverside Area, Centurion', author: 'Mike R.', createdAt: '2026-04-07T09:15:00Z', upvotes: 23, imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=250&fit=crop' },
    { id: '4', title: 'Water pipe burst on Oak Avenue', description: 'Water pipe burst causing flooding on the street and nearby properties. Needs urgent repair from the municipal water department.', category: 'water-outages', status: 'resolved', location: 'Oak Avenue, Pretoria', author: 'Linda P.', createdAt: '2026-04-02T16:00:00Z', upvotes: 31, imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&h=250&fit=crop' },
    { id: '5', title: 'Loose cables hanging over sidewalk', description: 'Telecommunication cables have come loose and are hanging low over the sidewalk. Risk of electrocution or injury to pedestrians.', category: 'loose-cables', status: 'open', location: 'Church Street, Midrand', author: 'David N.', createdAt: '2026-04-09T11:00:00Z', upvotes: 12, imageUrl: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&h=250&fit=crop' },
    { id: '6', title: 'Water outage in Sector 12', description: 'No water supply since early morning. Residents have not been informed about the cause or expected restoration time.', category: 'water-outages', status: 'open', location: 'Sector 12, Soweto', author: 'Nomsa D.', createdAt: '2026-04-10T06:00:00Z', upvotes: 45, imageUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=250&fit=crop' },
];

const categoryLabels: Record<ReportCategory, string> = {
    potholes: 'Potholes',
    'water-outages': 'Water Outages',
    electrical: 'Electrical Issues',
    'loose-cables': 'Loose Cables',
    waste: 'Waste Issues',
    infrastructure: 'Infrastructure',
    environment: 'Environment',
    safety: 'Safety',
    other: 'Other',
};

const categoryColors: Record<ReportCategory, string> = {
    potholes: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'water-outages': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    electrical: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'loose-cables': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    waste: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    infrastructure: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    environment: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    safety: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    other: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

const statusConfig: Record<ReportStatus, { label: string; color: string; icon: React.FC<any> }> = {
    'open': { label: 'Open', color: 'badge-danger', icon: AlertIcon },
    'in-progress': { label: 'In Progress', color: 'badge-accent', icon: ClockIcon },
    'resolved': { label: 'Resolved', color: 'badge-primary', icon: CheckIcon },
};

export default function Reports() {
    const { user } = useAuth();
    const [reports, setReports] = useState<Report[]>(sampleReports);
    const [showNew, setShowNew] = useState(false);
    const [filter, setFilter] = useState<ReportStatus | 'all'>('all');
    const [categoryFilter, setCategoryFilter] = useState<ReportCategory | 'all'>('all');
    const [newReport, setNewReport] = useState({ title: '', description: '', category: 'potholes' as ReportCategory, location: '' });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [detectingLocation, setDetectingLocation] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filtered = reports.filter(r =>
        (filter === 'all' || r.status === filter) &&
        (categoryFilter === 'all' || r.category === categoryFilter)
    );

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }
        setDetectingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setNewReport(p => ({ ...p, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (${user?.town || 'Unknown'})` }));
                setDetectingLocation(false);
            },
            () => {
                setNewReport(p => ({ ...p, location: user?.town || '' }));
                setDetectingLocation(false);
            },
            { timeout: 5000 }
        );
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const submitReport = () => {
        if (!newReport.title.trim() || !newReport.description.trim()) return;
        const report: Report = {
            id: crypto.randomUUID(),
            title: newReport.title,
            description: newReport.description,
            category: newReport.category,
            status: 'open',
            location: newReport.location || user?.town || 'Unknown',
            author: user?.name || 'Anonymous',
            createdAt: new Date().toISOString(),
            upvotes: 0,
            imageUrl: imagePreview || undefined,
        };
        setReports(prev => [report, ...prev]);
        setNewReport({ title: '', description: '', category: 'potholes', location: '' });
        setImagePreview(null);
        setShowNew(false);
    };

    const upvote = (id: string) => {
        setReports(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
    };

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Reports</h1>
                    <p className="text-sm text-text-light mt-1">Report issues and track community concerns</p>
                </div>
                <button onClick={() => setShowNew(true)} className="btn btn-primary gap-1">
                    <PlusIcon size={16} />
                    <span className="hidden sm:inline">New Report</span>
                </button>
            </div>

            {showNew && (
                <div className="card mb-6 border-primary/30">
                    <h3 className="font-bold mb-3">Submit a Report</h3>
                    <div className="space-y-3">
                        <input value={newReport.title} onChange={e => setNewReport(p => ({ ...p, title: e.target.value }))} placeholder="Report title" className="input" />
                        <textarea value={newReport.description} onChange={e => setNewReport(p => ({ ...p, description: e.target.value }))} placeholder="Describe the issue in detail..." className="input min-h-[100px] resize-y" />
                        <div className="grid sm:grid-cols-2 gap-3">
                            <select value={newReport.category} onChange={e => setNewReport(p => ({ ...p, category: e.target.value as ReportCategory }))} className="input">
                                {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                            <div className="flex gap-2">
                                <input value={newReport.location} onChange={e => setNewReport(p => ({ ...p, location: e.target.value }))} placeholder="Location / Address" className="input flex-1" />
                                <button type="button" onClick={detectLocation} disabled={detectingLocation} className="btn btn-outline btn-sm shrink-0" title="Detect my location">
                                    <MapPinIcon size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Image upload */}
                        <div>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            {imagePreview ? (
                                <div className="relative inline-block">
                                    <img src={imagePreview} alt="Preview" className="h-32 rounded-lg object-cover" />
                                    <button onClick={() => { setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute -top-2 -right-2 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center text-xs">
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
                            <button onClick={submitReport} className="btn btn-primary">Submit Report</button>
                            <button onClick={() => { setShowNew(false); setImagePreview(null); }} className="btn btn-outline">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                {(['all', 'open', 'in-progress', 'resolved'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === f ? 'bg-primary text-white' : 'bg-surface-dark text-text-light hover:bg-border'}`}
                    >{f === 'all' ? 'All' : statusConfig[f].label} ({f === 'all' ? reports.length : reports.filter(r => r.status === f).length})</button>
                ))}
            </div>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {(['all', ...Object.keys(categoryLabels)] as const).map(c => (
                    <button
                        key={c}
                        onClick={() => setCategoryFilter(c as ReportCategory | 'all')}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${categoryFilter === c ? 'bg-primary text-white' : 'bg-surface-dark text-text-light hover:bg-border'}`}
                    >{c === 'all' ? 'All Categories' : categoryLabels[c as ReportCategory]}</button>
                ))}
            </div>

            <div className="space-y-3">
                {filtered.map(report => {
                    const sc = statusConfig[report.status];
                    return (
                        <div key={report.id} className="card">
                            <div className="flex items-start gap-4">
                                {report.imageUrl && (
                                    <img src={report.imageUrl} alt="" className="w-24 h-20 rounded-lg object-cover shrink-0 hidden sm:block" loading="lazy" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h3 className="font-semibold text-sm">{report.title}</h3>
                                        <span className={`badge ${sc.color}`}>{sc.label}</span>
                                        <span className={`badge ${categoryColors[report.category]}`}>{categoryLabels[report.category]}</span>
                                    </div>
                                    <p className="text-xs text-text-light line-clamp-2">{report.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                                        <span className="flex items-center gap-1"><MapPinIcon size={12} />{report.location}</span>
                                        <span>By {report.author}</span>
                                        <span>{new Date(report.createdAt).toLocaleDateString('en-ZA')}</span>
                                    </div>
                                </div>
                                <button onClick={() => upvote(report.id)} className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-surface-dark shrink-0">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted"><polyline points="18 15 12 9 6 15"/></svg>
                                    <span className="text-xs font-bold">{report.upvotes}</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
