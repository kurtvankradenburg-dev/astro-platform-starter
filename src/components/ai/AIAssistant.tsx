import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { BotIcon, SendIcon, PlusIcon, ClockIcon, TrashIcon } from '../ui/Icons';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: string;
}

export default function AIAssistant() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>(() => {
        try {
            const stored = localStorage.getItem(`ecocity_ai_chats_${user?.id}`);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    });
    const [activeConvId, setActiveConvId] = useState<string | null>(null);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeConv = conversations.find(c => c.id === activeConvId);

    useEffect(() => {
        localStorage.setItem(`ecocity_ai_chats_${user?.id}`, JSON.stringify(conversations));
    }, [conversations, user?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConv?.messages]);

    const newConversation = () => {
        const conv: Conversation = {
            id: crypto.randomUUID(),
            title: 'New Chat',
            messages: [],
            createdAt: new Date().toISOString(),
        };
        setConversations(prev => [conv, ...prev]);
        setActiveConvId(conv.id);
        setShowHistory(false);
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const msg = input.trim();
        setInput('');

        let convId = activeConvId;
        if (!convId) {
            const conv: Conversation = {
                id: crypto.randomUUID(),
                title: msg.slice(0, 50),
                messages: [],
                createdAt: new Date().toISOString(),
            };
            setConversations(prev => [conv, ...prev]);
            convId = conv.id;
            setActiveConvId(conv.id);
        }

        const userMsg: Message = { role: 'user', content: msg, timestamp: new Date().toISOString() };

        setConversations(prev => prev.map(c => {
            if (c.id === convId) {
                const updated = { ...c, messages: [...c.messages, userMsg] };
                if (c.messages.length === 0) updated.title = msg.slice(0, 50);
                return updated;
            }
            return c;
        }));

        setLoading(true);
        try {
            const conv = conversations.find(c => c.id === convId);
            const history = conv?.messages?.slice(-6) || [];
            const res = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: msg, history }),
            });
            const data = await res.json();
            const assistantMsg: Message = { role: 'assistant', content: data.response || 'Sorry, I could not process that.', timestamp: new Date().toISOString() };
            setConversations(prev => prev.map(c => c.id === convId ? { ...c, messages: [...c.messages, assistantMsg] } : c));
        } catch {
            const errorMsg: Message = { role: 'assistant', content: 'Sorry, something went wrong. Please try again.', timestamp: new Date().toISOString() };
            setConversations(prev => prev.map(c => c.id === convId ? { ...c, messages: [...c.messages, errorMsg] } : c));
        }
        setLoading(false);
    };

    const deleteConversation = (id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConvId === id) setActiveConvId(null);
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="flex h-[calc(100vh-3.5rem)]">
            {/* Sidebar / History */}
            <div className={`${showHistory ? 'block' : 'hidden'} sm:block w-full sm:w-72 border-r border-border bg-white flex-col shrink-0 flex`}>
                <div className="p-3 border-b border-border">
                    <button onClick={newConversation} className="btn btn-primary w-full gap-2">
                        <PlusIcon size={16} />
                        New Chat
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <p className="text-sm text-text-muted text-center py-8">No conversations yet</p>
                    ) : (
                        <div className="divide-y divide-border">
                            {conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    className={`flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-50 ${activeConvId === conv.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                                >
                                    <div className="flex-1 min-w-0" onClick={() => { setActiveConvId(conv.id); setShowHistory(false); }}>
                                        <p className="text-sm font-medium truncate">{conv.title}</p>
                                        <p className="text-xs text-text-muted">{formatDate(conv.createdAt)} · {conv.messages.length} msgs</p>
                                    </div>
                                    <button onClick={() => deleteConversation(conv.id)} className="p-1 text-text-muted hover:text-red-500 shrink-0">
                                        <TrashIcon size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`${showHistory ? 'hidden sm:flex' : 'flex'} flex-1 flex-col min-w-0`}>
                {/* Chat header */}
                <div className="p-3 border-b border-border flex items-center gap-3 bg-white">
                    <button onClick={() => setShowHistory(!showHistory)} className="sm:hidden p-1.5 rounded-lg hover:bg-gray-100">
                        <ClockIcon size={18} />
                    </button>
                    <BotIcon size={20} className="text-primary" />
                    <div>
                        <h3 className="text-sm font-semibold">AI Assistant</h3>
                        <p className="text-xs text-text-muted">Powered by AI — ask anything</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {(!activeConv || activeConv.messages.length === 0) && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                                <BotIcon size={28} className="text-primary" />
                            </div>
                            <h2 className="text-lg font-bold mb-2">How can I help you?</h2>
                            <p className="text-sm text-text-light max-w-sm mb-6">I can help with anything — homework, coding, writing, research, general knowledge, and more.</p>
                            <div className="grid grid-cols-2 gap-2 max-w-sm">
                                {['Explain climate change', 'Help me study for exams', 'Write a short essay', 'Solve a math problem'].map(s => (
                                    <button key={s} onClick={() => { setInput(s); }} className="text-xs text-left p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeConv?.messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] sm:max-w-[70%] ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-border text-text'} px-4 py-3 rounded-2xl ${msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'} shadow-sm`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-text-muted'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-border px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-border bg-white">
                    <div className="flex gap-2 max-w-4xl mx-auto">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            placeholder="Type your message..."
                            className="input flex-1"
                            disabled={loading}
                        />
                        <button onClick={sendMessage} disabled={loading || !input.trim()} className="btn btn-primary">
                            <SendIcon size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
