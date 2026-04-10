import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { GraduationIcon, UploadIcon, BookIcon, FileIcon, SearchIcon, FilterIcon, DownloadIcon, PlusIcon, SendIcon, RefreshIcon, TrashIcon, CheckIcon, XIcon, LinkIcon, ChatIcon, UserIcon } from '../ui/Icons';

type Tab = 'upload' | 'flashcards' | 'papers' | 'classroom';

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

export default function StudyHub() {
    const { user } = useAuth();
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
        { id: '1', name: 'Physical Sciences 12A', code: 'PHY12A', teacher: 'Mr. Nkosi', students: 32, notes: ['Newton\'s Laws Summary', 'Electrostatics Notes'], links: ['https://meet.google.com/abc-defg-hij'] },
        { id: '2', name: 'Mathematics 12B', code: 'MAT12B', teacher: 'Mrs. Dlamini', students: 28, notes: ['Calculus Intro', 'Trigonometry Review'], links: [] },
    ]);
    const [joinCode, setJoinCode] = useState('');
    const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
    const [newClassName, setNewClassName] = useState('');
    const [showCreateClass, setShowCreateClass] = useState(false);
    const [newDiscussion, setNewDiscussion] = useState('');

    const tabs: { key: Tab; label: string; icon: React.FC<any> }[] = [
        { key: 'upload', label: 'Upload & Analyze', icon: UploadIcon },
        { key: 'flashcards', label: 'Flashcards', icon: BookIcon },
        { key: 'papers', label: 'Past Papers', icon: FileIcon },
        { key: 'classroom', label: 'Classroom', icon: GraduationIcon },
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

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-1">Study Hub</h1>
            <p className="text-sm text-text-light mb-6">Upload notes, generate flashcards, access past papers, and join classrooms</p>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-white shadow text-text' : 'text-text-light'}`}
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
                            <p className="text-sm text-text-light whitespace-pre-wrap">{summary}</p>
                        </div>
                    )}
                    <div className="card">
                        <h3 className="font-bold mb-3">Explain This</h3>
                        <input value={explainText} onChange={e => setExplainText(e.target.value)} placeholder="Paste a concept or term to explain..." className="input mb-2" />
                        <button onClick={handleExplain} disabled={summaryLoading || !explainText.trim()} className="btn btn-outline btn-sm">Explain</button>
                        {explainResult && <p className="text-sm text-text-light mt-3 whitespace-pre-wrap">{explainResult}</p>}
                    </div>
                    <div className="card">
                        <h3 className="font-bold mb-3">Ask Questions About Your Content</h3>
                        <input value={askQuestion} onChange={e => setAskQuestion(e.target.value)} placeholder="Ask a question about your uploaded notes..." className="input mb-2" />
                        <button onClick={handleAsk} disabled={summaryLoading || !askQuestion.trim() || !uploadText.trim()} className="btn btn-outline btn-sm">Ask</button>
                        {askAnswer && <p className="text-sm text-text-light mt-3 whitespace-pre-wrap">{askAnswer}</p>}
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
                                        <div key={i} className="bg-gray-50 rounded-lg p-3">
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
