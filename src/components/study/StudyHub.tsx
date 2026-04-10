import React, { useState, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { GraduationIcon, UploadIcon, BookIcon, FileIcon, SearchIcon, FilterIcon, DownloadIcon, PlusIcon, SendIcon, RefreshIcon, TrashIcon, CheckIcon, XIcon, LinkIcon, ChatIcon, UserIcon, ImageIcon, BarChartIcon, FlameIcon } from '../ui/Icons';

type Tab = 'upload' | 'flashcards' | 'papers' | 'classroom' | 'performance';

interface FlashCard {
    id: string;
    front: string;
    back: string;
    flipped: boolean;
}

interface ClassItem {
    id: string;
    name: string;
    code: string;
    teacher: string;
    students: number;
    notes: string[];
    links: string[];
}

interface StudySession {
    date: string;
    minutes: number;
    topic: string;
}

const pastPapers = [
    { id: 1, subject: 'Mathematics', grade: 'Grade 12', year: '2024', term: 'November', type: 'Paper 1' },
    { id: 2, subject: 'Mathematics', grade: 'Grade 12', year: '2024', term: 'November', type: 'Paper 2' },
    { id: 3, subject: 'Physical Sciences', grade: 'Grade 12', year: '2024', term: 'November', type: 'Paper 1' },
    { id: 4, subject: 'Physical Sciences', grade: 'Grade 12', year: '2024', term: 'November', type: 'Paper 2' },
    { id: 5, subject: 'Life Sciences', grade: 'Grade 12', year: '2024', term: 'November', type: 'Paper 1' },
    { id: 6, subject: 'English', grade: 'Grade 12', year: '2024', term: 'November', type: 'Paper 1' },
    { id: 7, subject: 'Mathematics', grade: 'Grade 11', year: '2024', term: 'June', type: 'Paper 1' },
    { id: 8, subject: 'Physical Sciences', grade: 'Grade 11', year: '2024', term: 'June', type: 'Paper 1' },
    { id: 9, subject: 'Accounting', grade: 'Grade 12', year: '2024', term: 'November', type: 'Paper 1' },
    { id: 10, subject: 'Geography', grade: 'Grade 12', year: '2024', term: 'November', type: 'Paper 1' },
];

const subjects = ['All', 'Mathematics', 'Physical Sciences', 'Life Sciences', 'English', 'Accounting', 'Geography'];
const grades = ['All', 'Grade 10', 'Grade 11', 'Grade 12'];

const mockStudySessions: StudySession[] = [
    { date: '2026-04-10', minutes: 45, topic: 'Mathematics' },
    { date: '2026-04-09', minutes: 60, topic: 'Physical Sciences' },
    { date: '2026-04-08', minutes: 30, topic: 'English' },
    { date: '2026-04-07', minutes: 90, topic: 'Mathematics' },
    { date: '2026-04-06', minutes: 0, topic: '' },
    { date: '2026-04-05', minutes: 50, topic: 'Life Sciences' },
    { date: '2026-04-04', minutes: 75, topic: 'Physical Sciences' },
    { date: '2026-04-03', minutes: 40, topic: 'Mathematics' },
    { date: '2026-04-02', minutes: 55, topic: 'Geography' },
    { date: '2026-04-01', minutes: 35, topic: 'Accounting' },
];

export default function StudyHub() {
    const { user } = useAuth();

    const formatAIText = (text: string) => {
        const cleaned = text
            .replace(/^#{1,6}\s*/gm, '')
            .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
            .replace(/^[\-\*]\s+/gm, '')
            .replace(/^>\s*/gm, '')
            .replace(/`([^`]+)`/g, '$1');
        const paragraphs = cleaned.split(/\n\s*\n|\n(?=[A-Z])/).map((p: string) => p.trim()).filter(Boolean);
        if (paragraphs.length <= 1) {
            const lines = cleaned.split('\n').map((l: string) => l.trim()).filter(Boolean);
            return lines.map((line: string, i: number) => <p key={i}>{line}</p>);
        }
        return paragraphs.map((para: string, i: number) => <p key={i}>{para}</p>);
    };

    const [activeTab, setActiveTab] = useState<Tab>('upload');
    const [uploadText, setUploadText] = useState('');
    const [summary, setSummary] = useState('');
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [explainText, setExplainText] = useState('');
    const [explainResult, setExplainResult] = useState('');
    const [askQuestion, setAskQuestion] = useState('');
    const [askAnswer, setAskAnswer] = useState('');
    const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
    const [fcLoading, setFcLoading] = useState(false);
    const [subjectFilter, setSubjectFilter] = useState('All');
    const [gradeFilter, setGradeFilter] = useState('All');
    const [classrooms, setClassrooms] = useState<ClassItem[]>([
        { id: '1', name: 'Physical Sciences 12A', code: 'PHY12A', teacher: 'Mr. Nkosi', students: 32, notes: ['Newton\'s Laws Summary', 'Electrostatics Notes'], links: [] },
        { id: '2', name: 'Mathematics 12B', code: 'MAT12B', teacher: 'Mrs. Dlamini', students: 28, notes: ['Calculus Intro', 'Trigonometry Review'], links: [] },
    ]);
    const [joinCode, setJoinCode] = useState('');
    const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
    const [newClassName, setNewClassName] = useState('');
    const [showCreateClass, setShowCreateClass] = useState(false);
    const [newDiscussion, setNewDiscussion] = useState('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [imageAnalysis, setImageAnalysis] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [perfPeriod, setPerfPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

    const tabs: { key: Tab; label: string; icon: React.FC<any> }[] = [
        { key: 'upload', label: 'Upload & Analyze', icon: UploadIcon },
        { key: 'flashcards', label: 'Flashcards', icon: BookIcon },
        { key: 'papers', label: 'Past Papers', icon: FileIcon },
        { key: 'classroom', label: 'Classroom', icon: GraduationIcon },
        { key: 'performance', label: 'Performance', icon: BarChartIcon },
    ];

    const handleSummarize = async () => {
        if (!uploadText.trim()) return;
        setSummaryLoading(true);
        try {
            const res = await fetch('/api/study-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'summarize', text: uploadText }),
            });
            const data = await res.json();
            setSummary(data.result || 'Could not generate summary.');
        } catch { setSummary('Error generating summary. Please try again.'); }
        setSummaryLoading(false);
    };

    const handleExplain = async () => {
        if (!explainText.trim()) return;
        setSummaryLoading(true);
        try {
            const res = await fetch('/api/study-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'explain', text: explainText }),
            });
            const data = await res.json();
            setExplainResult(data.result || 'Could not explain.');
        } catch { setExplainResult('Error. Please try again.'); }
        setSummaryLoading(false);
    };

    const handleAsk = async () => {
        if (!askQuestion.trim() || !uploadText.trim()) return;
        setSummaryLoading(true);
        try {
            const res = await fetch('/api/study-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'ask', text: uploadText, question: askQuestion }),
            });
            const data = await res.json();
            setAskAnswer(data.result || 'Could not answer.');
        } catch { setAskAnswer('Error. Please try again.'); }
        setSummaryLoading(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setUploadedImage(ev.target?.result as string);
                setImageAnalysis('Image uploaded successfully. You can now use the text extraction and analysis tools. For best results, also paste any visible text from the image into the notes area above so the AI can analyze it.');
            };
            reader.readAsDataURL(file);
        }
    };

    const generateFlashcards = async () => {
        if (!uploadText.trim()) return;
        setFcLoading(true);
        try {
            const res = await fetch('/api/study-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'flashcards', text: uploadText }),
            });
            const data = await res.json();
            if (data.cards && Array.isArray(data.cards)) {
                setFlashcards(data.cards.map((c: any, i: number) => ({ id: String(i), front: c.front, back: c.back, flipped: false })));
            }
        } catch { setFlashcards([{ id: '1', front: 'Error generating cards', back: 'Please try again with your notes', flipped: false }]); }
        setFcLoading(false);
    };

    const flipCard = (id: string) => {
        setFlashcards(prev => prev.map(c => c.id === id ? { ...c, flipped: !c.flipped } : c));
    };

    const filteredPapers = pastPapers.filter(p =>
        (subjectFilter === 'All' || p.subject === subjectFilter) &&
        (gradeFilter === 'All' || p.grade === gradeFilter)
    );

    const createClass = () => {
        if (!newClassName.trim()) return;
        const code = newClassName.slice(0, 3).toUpperCase() + Math.floor(100 + Math.random() * 900);
        const cls: ClassItem = { id: crypto.randomUUID(), name: newClassName, code, teacher: user?.name || 'Teacher', students: 1, notes: [], links: [] };
        setClassrooms(prev => [...prev, cls]);
        setNewClassName('');
        setShowCreateClass(false);
    };

    const joinClass = () => {
        if (!joinCode.trim()) return;
        const cls = classrooms.find(c => c.code.toLowerCase() === joinCode.toLowerCase());
        if (cls) {
            setSelectedClass(cls);
            setJoinCode('');
        }
    };

    // Performance calculations
    const totalMinutes = mockStudySessions.reduce((sum, s) => sum + s.minutes, 0);
    const activeDays = mockStudySessions.filter(s => s.minutes > 0).length;
    const currentStreak = (() => {
        let streak = 0;
        for (const s of mockStudySessions) {
            if (s.minutes > 0) streak++;
            else break;
        }
        return streak;
    })();
    const avgMinutes = activeDays > 0 ? Math.round(totalMinutes / activeDays) : 0;
    const maxBarHeight = Math.max(...mockStudySessions.map(s => s.minutes), 1);

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">Study Hub</h1>
            <p className="text-sm text-text-light mb-6">Upload notes, generate flashcards, access past papers, and track progress</p>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-surface-dark rounded-lg p-1 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-surface-card shadow text-text' : 'text-text-light'}`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Upload & Analyze */}
            {activeTab === 'upload' && (
                <div className="space-y-4">
                    <div className="card">
                        <h3 className="font-bold mb-3">Paste Your Notes</h3>
                        <textarea
                            value={uploadText}
                            onChange={e => setUploadText(e.target.value)}
                            placeholder="Paste your study notes, text from a PDF, or any content you want to analyze..."
                            className="input min-h-[160px] resize-y"
                        />

                        {/* Image upload */}
                        <div className="mt-3">
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            {uploadedImage ? (
                                <div className="flex items-start gap-3">
                                    <div className="relative">
                                        <img src={uploadedImage} alt="Uploaded notes" className="h-28 rounded-lg object-cover" />
                                        <button onClick={() => { setUploadedImage(null); setImageAnalysis(''); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="absolute -top-2 -right-2 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center">
                                            <XIcon size={12} />
                                        </button>
                                    </div>
                                    {imageAnalysis && <p className="text-xs text-text-light flex-1">{imageAnalysis}</p>}
                                </div>
                            ) : (
                                <button onClick={() => fileInputRef.current?.click()} className="btn btn-outline btn-sm gap-1">
                                    <ImageIcon size={14} />
                                    Upload Image of Notes
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2 mt-3 flex-wrap">
                            <button onClick={handleSummarize} disabled={summaryLoading || !uploadText.trim()} className="btn btn-primary">
                                {summaryLoading ? 'Processing...' : 'Summarize'}
                            </button>
                            <button onClick={generateFlashcards} disabled={fcLoading || !uploadText.trim()} className="btn btn-secondary">
                                Generate Flashcards
                            </button>
                        </div>
                    </div>
                    {summary && (
                        <div className="card border-primary/30">
                            <h3 className="font-bold mb-2">Summary</h3>
                            <div className="text-sm text-text-light space-y-2">{formatAIText(summary)}</div>
                        </div>
                    )}
                    <div className="card">
                        <h3 className="font-bold mb-3">Explain This</h3>
                        <input value={explainText} onChange={e => setExplainText(e.target.value)} placeholder="Paste a concept or term to explain..." className="input mb-2" />
                        <button onClick={handleExplain} disabled={summaryLoading || !explainText.trim()} className="btn btn-outline btn-sm">Explain</button>
                        {explainResult && <div className="text-sm text-text-light mt-3 space-y-2">{formatAIText(explainResult)}</div>}
                    </div>
                    <div className="card">
                        <h3 className="font-bold mb-3">Ask Questions About Your Content</h3>
                        <input value={askQuestion} onChange={e => setAskQuestion(e.target.value)} placeholder="Ask a question about your uploaded notes..." className="input mb-2" />
                        <button onClick={handleAsk} disabled={summaryLoading || !askQuestion.trim() || !uploadText.trim()} className="btn btn-outline btn-sm">Ask</button>
                        {askAnswer && <div className="text-sm text-text-light mt-3 space-y-2">{formatAIText(askAnswer)}</div>}
                    </div>
                </div>
            )}

            {/* Flashcards */}
            {activeTab === 'flashcards' && (
                <div>
                    {flashcards.length === 0 ? (
                        <div className="card text-center py-12">
                            <BookIcon size={40} className="mx-auto text-text-muted mb-4" />
                            <h3 className="font-bold mb-2">No Flashcards Yet</h3>
                            <p className="text-sm text-text-light mb-4">Paste your notes in the "Upload & Analyze" tab and click "Generate Flashcards".</p>
                            <button onClick={() => setActiveTab('upload')} className="btn btn-primary">Go to Upload</button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {flashcards.map(card => (
                                <button key={card.id} onClick={() => flipCard(card.id)} className="card min-h-[140px] flex items-center justify-center text-center cursor-pointer hover:border-primary/30 transition-all">
                                    <div>
                                        <span className="badge badge-primary text-[10px] mb-2">{card.flipped ? 'Answer' : 'Question'}</span>
                                        <p className="text-sm font-medium">{card.flipped ? card.back : card.front}</p>
                                        <p className="text-xs text-text-muted mt-2">Click to flip</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Past Papers */}
            {activeTab === 'papers' && (
                <div>
                    <div className="flex gap-3 mb-4 flex-wrap">
                        <select value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)} className="input w-auto">
                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)} className="input w-auto">
                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div className="card !p-0 divide-y divide-border">
                        {filteredPapers.map(paper => (
                            <div key={paper.id} className="flex items-center justify-between p-4">
                                <div>
                                    <p className="text-sm font-medium">{paper.subject} — {paper.type}</p>
                                    <p className="text-xs text-text-light">{paper.grade} · {paper.term} {paper.year}</p>
                                </div>
                                <button className="btn btn-outline btn-sm gap-1">
                                    <DownloadIcon size={14} />
                                    View
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Performance */}
            {activeTab === 'performance' && (
                <div className="space-y-4">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="card !p-4 text-center">
                            <FlameIcon size={24} className="mx-auto text-orange-500 mb-1" />
                            <p className="text-2xl font-bold">{currentStreak}</p>
                            <p className="text-xs text-text-light">Day Streak</p>
                        </div>
                        <div className="card !p-4 text-center">
                            <BarChartIcon size={24} className="mx-auto text-blue-500 mb-1" />
                            <p className="text-2xl font-bold">{Math.round(totalMinutes / 60)}h</p>
                            <p className="text-xs text-text-light">Total Study Time</p>
                        </div>
                        <div className="card !p-4 text-center">
                            <CheckIcon size={24} className="mx-auto text-green-500 mb-1" />
                            <p className="text-2xl font-bold">{activeDays}/{mockStudySessions.length}</p>
                            <p className="text-xs text-text-light">Active Days</p>
                        </div>
                        <div className="card !p-4 text-center">
                            <GraduationIcon size={24} className="mx-auto text-purple-500 mb-1" />
                            <p className="text-2xl font-bold">{avgMinutes}m</p>
                            <p className="text-xs text-text-light">Avg per Session</p>
                        </div>
                    </div>

                    {/* Period toggle */}
                    <div className="flex gap-1 bg-surface-dark rounded-lg p-1 w-fit">
                        {(['daily', 'weekly', 'monthly'] as const).map(p => (
                            <button key={p} onClick={() => setPerfPeriod(p)} className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${perfPeriod === p ? 'bg-surface-card shadow text-text' : 'text-text-light'}`}>{p}</button>
                        ))}
                    </div>

                    {/* Study Chart */}
                    <div className="card">
                        <h3 className="font-bold mb-4">Study Activity</h3>
                        <div className="flex items-end gap-2 h-40">
                            {mockStudySessions.slice(0, perfPeriod === 'daily' ? 7 : perfPeriod === 'weekly' ? 7 : 10).reverse().map((session, i) => {
                                const height = maxBarHeight > 0 ? (session.minutes / maxBarHeight) * 100 : 0;
                                const dayLabel = new Date(session.date).toLocaleDateString('en-ZA', { weekday: 'short' });
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-[10px] text-text-muted">{session.minutes}m</span>
                                        <div className="w-full bg-surface-dark rounded-t-sm relative" style={{ height: '120px' }}>
                                            <div
                                                className={`absolute bottom-0 w-full rounded-t-sm transition-all ${session.minutes > 0 ? 'bg-primary' : 'bg-border'}`}
                                                style={{ height: `${Math.max(height, 3)}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-text-muted">{dayLabel}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recent Sessions */}
                    <div className="card">
                        <h3 className="font-bold mb-3">Recent Sessions</h3>
                        <div className="space-y-2">
                            {mockStudySessions.filter(s => s.minutes > 0).slice(0, 5).map((s, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                    <div>
                                        <p className="text-sm font-medium">{s.topic}</p>
                                        <p className="text-xs text-text-muted">{new Date(s.date).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'short' })}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-primary">{s.minutes} min</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Classroom */}
            {activeTab === 'classroom' && (
                <div>
                    {selectedClass ? (
                        <div>
                            <button onClick={() => setSelectedClass(null)} className="text-sm text-primary font-medium mb-4 hover:underline">&larr; Back to Classes</button>
                            <div className="card mb-4">
                                <h2 className="text-xl font-bold">{selectedClass.name}</h2>
                                <p className="text-sm text-text-light">Code: <span className="font-mono font-bold text-primary">{selectedClass.code}</span> · Teacher: {selectedClass.teacher} · {selectedClass.students} students</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="card">
                                    <h3 className="font-bold mb-3">Shared Notes</h3>
                                    {selectedClass.notes.map((note, i) => (
                                        <div key={i} className="flex items-center gap-2 py-2 border-b border-border last:border-0">
                                            <FileIcon size={14} className="text-text-muted" />
                                            <span className="text-sm">{note}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="card">
                                    <h3 className="font-bold mb-3">Meeting Links</h3>
                                    {selectedClass.links.length === 0 ? (
                                        <p className="text-sm text-text-muted">No meeting links shared yet</p>
                                    ) : (
                                        selectedClass.links.map((link, i) => (
                                            <div key={i} className="flex items-center gap-2 py-2">
                                                <LinkIcon size={14} className="text-primary" />
                                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary truncate">{link}</a>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="card mt-4">
                                <h3 className="font-bold mb-3">Discussion</h3>
                                <div className="space-y-3 mb-3">
                                    {[
                                        { user: 'Thabo', msg: 'Can someone share their notes on momentum?', time: '2h ago' },
                                        { user: 'Sarah', msg: 'Check the shared notes, I uploaded them yesterday', time: '1h ago' },
                                    ].map((d, i) => (
                                        <div key={i} className="bg-surface-dark rounded-lg p-3">
                                            <div className="flex items-center gap-2 mb-1">
                                                <UserIcon size={12} className="text-text-muted" />
                                                <span className="text-xs font-medium">{d.user}</span>
                                                <span className="text-xs text-text-muted">{d.time}</span>
                                            </div>
                                            <p className="text-sm">{d.msg}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input value={newDiscussion} onChange={e => setNewDiscussion(e.target.value)} placeholder="Write a message..." className="input flex-1" />
                                    <button className="btn btn-primary"><SendIcon size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex gap-2 mb-4 flex-wrap">
                                <input value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="Enter class code to join..." className="input w-auto flex-1" />
                                <button onClick={joinClass} className="btn btn-primary">Join Class</button>
                                <button onClick={() => setShowCreateClass(true)} className="btn btn-outline gap-1">
                                    <PlusIcon size={14} />
                                    Create Class
                                </button>
                            </div>
                            {showCreateClass && (
                                <div className="card mb-4 border-primary/30">
                                    <h3 className="font-bold mb-3">Create a New Class</h3>
                                    <input value={newClassName} onChange={e => setNewClassName(e.target.value)} placeholder="Class name (e.g. Physical Sciences 12A)" className="input mb-3" />
                                    <div className="flex gap-2">
                                        <button onClick={createClass} className="btn btn-primary">Create</button>
                                        <button onClick={() => setShowCreateClass(false)} className="btn btn-outline">Cancel</button>
                                    </div>
                                </div>
                            )}
                            <div className="grid sm:grid-cols-2 gap-4">
                                {classrooms.map(cls => (
                                    <button key={cls.id} onClick={() => setSelectedClass(cls)} className="card text-left hover:border-primary/30 cursor-pointer">
                                        <h3 className="font-bold text-sm">{cls.name}</h3>
                                        <p className="text-xs text-text-light mt-1">Code: <span className="font-mono text-primary">{cls.code}</span></p>
                                        <p className="text-xs text-text-muted mt-1">Teacher: {cls.teacher} · {cls.students} students</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
