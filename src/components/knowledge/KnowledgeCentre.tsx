import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { BookIcon, SearchIcon, BotIcon, SendIcon, MaximizeIcon, MinimizeIcon } from '../ui/Icons';

const articles = [
    { id: 1, title: 'Water Conservation at Home', category: 'Sustainability', content: 'Learn practical ways to reduce water usage in your household. South Africa faces significant water challenges, making conservation crucial for every community. Simple steps include fixing leaks promptly, using water-efficient fixtures, collecting rainwater, and reusing greywater for gardens.', image: 'https://images.unsplash.com/photo-1538300342682-cf57afb97285?w=400&h=200&fit=crop' },
    { id: 2, title: 'Solar Energy for Communities', category: 'Energy', content: 'Solar power is transforming South African communities. With abundant sunshine, solar panels can significantly reduce electricity costs and load shedding impact. Community solar projects allow shared benefits and lower costs. Many municipalities offer incentives for solar installation.', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=200&fit=crop' },
    { id: 3, title: 'Recycling Guide', category: 'Waste Management', content: 'A comprehensive guide to recycling in your community. Different materials require different recycling processes. Paper, glass, plastic, and metal can all be recycled. Many communities have dedicated recycling centres and collection schedules.', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=200&fit=crop' },
    { id: 4, title: 'Urban Gardens & Food Security', category: 'Food', content: 'Community gardens provide fresh produce, reduce food miles, and strengthen community bonds. Starting a garden requires planning for space, water access, and soil quality. Many South African communities have successfully implemented urban farming projects.', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop' },
    { id: 5, title: 'Public Transport & Mobility', category: 'Infrastructure', content: 'Efficient public transport reduces carbon emissions and improves accessibility. South African cities are investing in bus rapid transit, commuter rail upgrades, and cycling infrastructure. Understanding your local transport options helps reduce costs and environmental impact.', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop' },
    { id: 6, title: 'Community Safety Initiatives', category: 'Safety', content: 'Building safer communities through neighbourhood watches, improved lighting, and community policing forums. Reporting suspicious activity and supporting local safety structures helps create secure environments for all residents.', image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=200&fit=crop' },
];

const categories = ['All', 'Sustainability', 'Energy', 'Waste Management', 'Food', 'Infrastructure', 'Safety'];

export default function KnowledgeCentre() {
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null);
    const [showEcoAI, setShowEcoAI] = useState(false);
    const [ecoAIFullscreen, setEcoAIFullscreen] = useState(false);
    const [aiQuery, setAiQuery] = useState('');
    const [aiMessages, setAiMessages] = useState<{ role: string; content: string }[]>([]);
    const [aiLoading, setAiLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const filtered = articles.filter(a =>
        (selectedCategory === 'All' || a.category === selectedCategory) &&
        (search === '' || a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase()))
    );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [aiMessages]);

    const askEcoAI = async () => {
        if (!aiQuery.trim() || aiLoading) return;
        const q = aiQuery.trim();
        setAiMessages(prev => [...prev, { role: 'user', content: q }]);
        setAiQuery('');
        setAiLoading(true);

        try {
            const context = articles.map(a => `${a.title}: ${a.content}`).join('\n\n');
            const res = await fetch('/api/eco-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: q, context, town: user?.town }),
            });
            const data = await res.json();
            setAiMessages(prev => [...prev, { role: 'assistant', content: data.answer || 'I could not find a relevant answer. Please try rephrasing your question.' }]);
        } catch {
            setAiMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
        }
        setAiLoading(false);
    };

    const formatAIText = (text: string) => {
        const cleaned = text
            .replace(/^#{1,6}\s*/gm, '')
            .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
            .replace(/^[\-\*]\s+/gm, '')
            .replace(/^>\s*/gm, '')
            .replace(/`([^`]+)`/g, '$1');
        const paragraphs = cleaned.split(/\n\s*\n|\n(?=[A-Z])/).map(p => p.trim()).filter(Boolean);
        if (paragraphs.length <= 1) {
            const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
            return lines.map((line, i) => <p key={i} className="mb-1 last:mb-0">{line}</p>);
        }
        return paragraphs.map((para, i) => <p key={i} className="mb-1 last:mb-0">{para}</p>);
    };

    // Fullscreen Eco AI — split layout
    if (ecoAIFullscreen) {
        return (
            <div className="flex h-[calc(100vh-3.5rem)]">
                {/* Articles list — left panel */}
                <div className="w-64 shrink-0 border-r border-border bg-surface-card flex flex-col overflow-hidden">
                    <div className="p-3 border-b border-border">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Articles</p>
                        <div className="relative">
                            <SearchIcon size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="input !py-1.5 pl-8 text-xs" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-border">
                        {filtered.map(a => (
                            <button
                                key={a.id}
                                onClick={() => setSelectedArticle(a)}
                                className="w-full text-left p-3 hover:bg-surface-dark transition-colors"
                            >
                                <p className="text-xs font-semibold mb-0.5 truncate">{a.title}</p>
                                <span className="badge badge-primary text-[9px]">{a.category}</span>
                            </button>
                        ))}
                    </div>
                    <div className="p-3 border-t border-border">
                        <p className="text-[10px] text-text-muted text-center">Knowledge Centre by Kurt van Kradenburg, Anjanette Venter, Ninke Hough & Ryan Cronje</p>
                    </div>
                </div>

                {/* Eco AI — right panel */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="p-3 border-b border-border flex items-center gap-3 bg-surface-card">
                        <BotIcon size={20} className="text-primary" />
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold">Eco AI — Town Intelligence</h3>
                            <p className="text-xs text-text-muted">Ask about {user?.town}'s history, infrastructure, sustainability, and services</p>
                        </div>
                        <button
                            onClick={() => setEcoAIFullscreen(false)}
                            className="p-1.5 rounded-lg hover:bg-surface-dark text-text-muted hover:text-text transition-colors"
                            title="Exit fullscreen"
                        >
                            <MinimizeIcon size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {aiMessages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                    <BotIcon size={28} className="text-primary" />
                                </div>
                                <h2 className="text-lg font-bold mb-2">Ask Eco AI</h2>
                                <p className="text-sm text-text-light max-w-sm mb-6">Ask about {user?.town}'s history, water, energy, safety, services, and sustainability topics.</p>
                                <div className="grid grid-cols-2 gap-2 max-w-md">
                                    {[
                                        `Water situation in ${user?.town}`,
                                        'How to save electricity',
                                        'Recycling in my area',
                                        'Local sustainability tips',
                                    ].map(s => (
                                        <button key={s} onClick={() => setAiQuery(s)} className="text-xs text-left p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {aiMessages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-br-md' : 'bg-surface-card border border-border text-text rounded-bl-md'}`}>
                                    {msg.role === 'assistant' ? <div className="space-y-1">{formatAIText(msg.content)}</div> : msg.content}
                                </div>
                            </div>
                        ))}
                        {aiLoading && (
                            <div className="flex justify-start">
                                <div className="bg-surface-card border border-border px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t border-border bg-surface-card">
                        <div className="flex gap-2">
                            <input
                                value={aiQuery}
                                onChange={e => setAiQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && askEcoAI()}
                                placeholder={`Ask about ${user?.town} or sustainability...`}
                                className="input flex-1"
                            />
                            <button onClick={askEcoAI} disabled={aiLoading} className="btn btn-primary">
                                <SendIcon size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Article modal */}
                {selectedArticle && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedArticle(null)}>
                        <div className="bg-surface-card rounded-xl border border-border max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-40 object-cover rounded-t-xl" />
                            <div className="p-5">
                                <span className="badge badge-primary mb-2">{selectedArticle.category}</span>
                                <h2 className="text-lg font-bold mb-3">{selectedArticle.title}</h2>
                                <p className="text-sm text-text-light leading-relaxed">{selectedArticle.content}</p>
                                <button onClick={() => setSelectedArticle(null)} className="btn btn-outline w-full mt-4">Close</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Article detail view
    if (selectedArticle) {
        return (
            <div className="p-4 sm:p-6 max-w-4xl mx-auto">
                <button onClick={() => setSelectedArticle(null)} className="text-sm text-primary font-medium mb-4 hover:underline">&larr; Back to Articles</button>
                <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-48 sm:h-64 object-cover rounded-xl mb-6" />
                <span className="badge badge-primary mb-2">{selectedArticle.category}</span>
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">{selectedArticle.title}</h1>
                <div className="text-text-light leading-relaxed text-base">{selectedArticle.content}</div>
            </div>
        );
    }

    // Default view
    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Knowledge Centre</h1>
                    <p className="text-sm text-text-light mt-1">Learn about sustainability, services, and your community</p>
                </div>
                <button onClick={() => { setShowEcoAI(!showEcoAI); }} className="btn btn-primary gap-2">
                    <BotIcon size={16} />
                    <span className="hidden sm:inline">Ask Eco AI</span>
                </button>
            </div>

            {/* Eco AI Panel */}
            {showEcoAI && (
                <div className="card mb-6 border-primary/30">
                    <div className="flex items-center gap-2 mb-3">
                        <BotIcon size={20} className="text-primary" />
                        <h3 className="font-bold flex-1">Eco AI — Town Intelligence</h3>
                        <button
                            onClick={() => setEcoAIFullscreen(true)}
                            className="p-1.5 rounded-lg hover:bg-surface-dark text-text-muted hover:text-text transition-colors"
                            title="Open fullscreen"
                        >
                            <MaximizeIcon size={16} />
                        </button>
                    </div>
                    <p className="text-xs text-text-light mb-3">Ask about {user?.town}'s history, infrastructure, sustainability, services, or community issues.</p>
                    <div className="max-h-64 overflow-y-auto space-y-3 mb-3">
                        {aiMessages.length === 0 && (
                            <p className="text-sm text-text-muted text-center py-4">Ask any question about your town or sustainability topics.</p>
                        )}
                        {aiMessages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-surface-dark text-text'}`}>
                                    {msg.role === 'assistant' ? formatAIText(msg.content) : msg.content}
                                </div>
                            </div>
                        ))}
                        {aiLoading && (
                            <div className="flex justify-start">
                                <div className="bg-surface-dark px-3 py-2 rounded-xl text-sm text-text-muted">Thinking...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="flex gap-2">
                        <input
                            value={aiQuery}
                            onChange={e => setAiQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && askEcoAI()}
                            placeholder="Ask about water conservation, local services..."
                            className="input flex-1"
                        />
                        <button onClick={askEcoAI} disabled={aiLoading} className="btn btn-primary">
                            <SendIcon size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative mb-4">
                <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." className="input pl-10" />
            </div>

            {/* Categories */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-surface-dark text-text-light hover:bg-border'}`}
                    >{cat}</button>
                ))}
            </div>

            {/* Articles Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(article => (
                    <button key={article.id} onClick={() => setSelectedArticle(article)} className="card !p-0 overflow-hidden text-left hover:border-primary/30 transition-all cursor-pointer">
                        <img src={article.image} alt={article.title} className="w-full h-36 object-cover" />
                        <div className="p-4">
                            <span className="badge badge-primary text-[10px] mb-2">{article.category}</span>
                            <h3 className="font-semibold text-sm mb-1">{article.title}</h3>
                            <p className="text-xs text-text-light line-clamp-2">{article.content}</p>
                        </div>
                    </button>
                ))}
            </div>

            <p className="text-center text-xs text-text-muted mt-8 opacity-50">
                Knowledge Centre by Kurt van Kradenburg, Anjanette Venter, Ninke Hough & Ryan Cronje
            </p>
        </div>
    );
}
