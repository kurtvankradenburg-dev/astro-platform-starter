import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { BookIcon, SearchIcon, BotIcon, SendIcon, ChevronRightIcon } from '../ui/Icons';

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
    const [aiQuery, setAiQuery] = useState('');
    const [aiMessages, setAiMessages] = useState<{ role: string; content: string }[]>([]);
    const [aiLoading, setAiLoading] = useState(false);

    const filtered = articles.filter(a =>
        (selectedCategory === 'All' || a.category === selectedCategory) &&
        (search === '' || a.title.toLowerCase().includes(search.toLowerCase()) || a.content.toLowerCase().includes(search.toLowerCase()))
    );

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

    return (
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Knowledge Centre</h1>
                    <p className="text-sm text-text-light mt-1">Learn about sustainability, services, and your community</p>
                </div>
                <button onClick={() => setShowEcoAI(!showEcoAI)} className="btn btn-primary gap-2">
                    <BotIcon size={16} />
                    <span className="hidden sm:inline">Ask Eco AI</span>
                </button>
            </div>

            {/* Eco AI Panel */}
            {showEcoAI && (
                <div className="card mb-6 border-primary/30">
                    <div className="flex items-center gap-2 mb-3">
                        <BotIcon size={20} className="text-primary" />
                        <h3 className="font-bold">Eco AI — Town Intelligence</h3>
                    </div>
                    <p className="text-xs text-text-light mb-3">Ask about {user?.town}'s history, infrastructure, sustainability, services, or community issues.</p>
                    <div className="max-h-64 overflow-y-auto space-y-3 mb-3">
                        {aiMessages.length === 0 && (
                            <p className="text-sm text-text-muted text-center py-4">Ask any question about your town or sustainability topics.</p>
                        )}
                        {aiMessages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-text'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {aiLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 px-3 py-2 rounded-xl text-sm text-text-muted">Thinking...</div>
                            </div>
                        )}
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
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-text-light hover:bg-gray-200'}`}
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
        </div>
    );
}
