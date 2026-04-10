import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { FileIcon, PlusIcon, MapPinIcon, CheckIcon, ClockIcon, AlertIcon } from '../ui/Icons';

type ReportStatus = 'open' | 'in-progress' | 'resolved';
type ReportCategory = 'infrastructure' | 'environment' | 'safety' | 'services' | 'other';

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
}

const sampleReports: Report[] = [
    { id: '1', title: 'Pothole on Main Road', description: 'Large pothole causing danger to vehicles near the intersection of Main and 5th.', category: 'infrastructure', status: 'open', location: 'Main Road & 5th Ave', author: 'Thabo M.', createdAt: '2026-04-08T10:00:00Z', upvotes: 15 },
    { id: '2', title: 'Streetlight not working', description: 'Streetlight has been off for 2 weeks at Park Street. Area is very dark at night.', category: 'infrastructure', status: 'in-progress', location: 'Park Street', author: 'Sarah K.', createdAt: '2026-04-05T14:30:00Z', upvotes: 8 },
    { id: '3', title: 'Illegal dumping near river', description: 'People are dumping waste near the community river. Health hazard.', category: 'environment', status: 'open', location: 'Riverside Area', author: 'Mike R.', createdAt: '2026-04-07T09:15:00Z', upvotes: 23 },
    { id: '4', title: 'Water leak on Oak Avenue', description: 'Water pipe burst causing flooding. Needs urgent repair.', category: 'services', status: 'resolved', location: 'Oak Avenue', author: 'Linda P.', createdAt: '2026-04-02T16:00:00Z', upvotes: 31 },
    { id: '5', title: 'Broken fence at community park', description: 'The fence at the east entrance of the park has fallen down. Children can wander onto the road.', category: 'safety', status: 'open', location: 'Community Park', author: 'David N.', createdAt: '2026-04-09T11:00:00Z', upvotes: 12 },
];

const categoryLabels: Record<ReportCategory, string> = {
    infrastructure: 'Infrastructure',
    environment: 'Environment',
    safety: 'Safety',
    services: 'Services',
    other: 'Other',
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
    const [newReport, setNewReport] = useState({ title: '', description: '', category: 'infrastructure' as ReportCategory, location: '' });

    const filtered = reports.filter(r => filter === 'all' || r.status === filter);

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
        };
        setReports(prev => [report, ...prev]);
        setNewReport({ title: '', description: '', category: 'infrastructure', location: '' });
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

            {/* New Report Form */}
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
                            <input value={newReport.location} onChange={e => setNewReport(p => ({ ...p, location: e.target.value }))} placeholder="Location" className="input" />
                        </div>
                        <div className="flex gap-2">
                            <button onClick={submitReport} className="btn btn-primary">Submit Report</button>
                            <button onClick={() => setShowNew(false)} className="btn btn-outline">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {(['all', 'open', 'in-progress', 'resolved'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-text-light hover:bg-gray-200'}`}
                    >{f === 'all' ? 'All' : statusConfig[f].label} ({f === 'all' ? reports.length : reports.filter(r => r.status === f).length})</button>
                ))}
            </div>

            {/* Reports List */}
            <div className="space-y-3">
                {filtered.map(report => {
                    const sc = statusConfig[report.status];
                    return (
                        <div key={report.id} className="card">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h3 className="font-semibold text-sm">{report.title}</h3>
                                        <span className={`badge ${sc.color}`}>{sc.label}</span>
                                        <span className="badge badge-secondary">{categoryLabels[report.category]}</span>
                                    </div>
                                    <p className="text-xs text-text-light">{report.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                                        <span className="flex items-center gap-1"><MapPinIcon size={12} />{report.location}</span>
                                        <span>By {report.author}</span>
                                        <span>{new Date(report.createdAt).toLocaleDateString('en-ZA')}</span>
                                    </div>
                                </div>
                                <button onClick={() => upvote(report.id)} className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-gray-50 shrink-0">
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
