import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { ChatIcon, SendIcon, HashIcon, ImageIcon, UserIcon } from '../ui/Icons';

interface ChatMessage {
    id: string;
    user: string;
    userId: string;
    content: string;
    timestamp: string;
    channel: string;
    replyTo?: string;
    image?: string;
}

const CHANNELS = [
    { id: 'general', name: 'General', desc: 'General community chat' },
    { id: 'alerts', name: 'Alerts', desc: 'Town alerts & warnings' },
    { id: 'jobs', name: 'Jobs', desc: 'Job listings & opportunities' },
    { id: 'help', name: 'Help', desc: 'Ask for help from the community' },
];

const PROFANITY_LIST = ['damn', 'hell', 'crap'];

function filterProfanity(text: string): string {
    let filtered = text;
    PROFANITY_LIST.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        filtered = filtered.replace(regex, '*'.repeat(word.length));
    });
    return filtered;
}

const sampleMessages: ChatMessage[] = [
    { id: '1', user: 'Thabo M.', userId: 'u1', content: 'Good morning everyone! Has anyone heard about the water situation today?', timestamp: new Date(Date.now() - 3600000).toISOString(), channel: 'general' },
    { id: '2', user: 'Sarah K.', userId: 'u2', content: 'Morning! Water is running fine in my area. Sandton side.', timestamp: new Date(Date.now() - 3000000).toISOString(), channel: 'general' },
    { id: '3', user: 'Admin', userId: 'admin', content: 'Water restored in all affected areas as of 8am this morning.', timestamp: new Date(Date.now() - 2400000).toISOString(), channel: 'alerts' },
    { id: '4', user: 'Mike R.', userId: 'u3', content: 'Anyone know a good electrician in Centurion? Need urgent work done.', timestamp: new Date(Date.now() - 1800000).toISOString(), channel: 'help' },
    { id: '5', user: 'Linda P.', userId: 'u4', content: 'Shoprite is hiring cashiers! Apply at the Midrand branch.', timestamp: new Date(Date.now() - 1200000).toISOString(), channel: 'jobs' },
];

export default function ChatSystem() {
    const { user } = useAuth();
    const [activeChannel, setActiveChannel] = useState('general');
    const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);
    const [input, setInput] = useState('');
    const [showChannels, setShowChannels] = useState(false);
    const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, activeChannel]);

    const channelMessages = messages.filter(m => m.channel === activeChannel);

    const sendMessage = () => {
        if (!input.trim() || !user) return;
        const filtered = filterProfanity(input.trim());
        const msg: ChatMessage = {
            id: crypto.randomUUID(),
            user: user.name,
            userId: user.id,
            content: filtered,
            timestamp: new Date().toISOString(),
            channel: activeChannel,
            replyTo: replyTo?.id,
        };
        setMessages(prev => [...prev, msg]);
        setInput('');
        setReplyTo(null);
    };

    const formatTime = (iso: string) => {
        return new Date(iso).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
    };

    const activeChannelInfo = CHANNELS.find(c => c.id === activeChannel);

    return (
        <div className="flex h-[calc(100vh-3.5rem)]">
            {/* Channel sidebar */}
            <div className={`${showChannels ? 'block' : 'hidden'} sm:block w-full sm:w-56 border-r border-border bg-surface-card flex-col shrink-0 flex`}>
                <div className="p-4 border-b border-border">
                    <h3 className="font-bold text-sm">Channels</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {CHANNELS.map(ch => (
                        <button
                            key={ch.id}
                            onClick={() => { setActiveChannel(ch.id); setShowChannels(false); }}
                            className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-surface-dark transition-colors ${activeChannel === ch.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                        >
                            <HashIcon size={14} className="text-text-muted shrink-0" />
                            <div>
                                <p className={`text-sm ${activeChannel === ch.id ? 'font-semibold text-primary' : ''}`}>{ch.name}</p>
                                <p className="text-[10px] text-text-muted">{ch.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat area */}
            <div className={`${showChannels ? 'hidden sm:flex' : 'flex'} flex-1 flex-col min-w-0`}>
                {/* Header */}
                <div className="p-3 border-b border-border flex items-center gap-3 bg-surface-card">
                    <button onClick={() => setShowChannels(!showChannels)} className="sm:hidden p-1.5 rounded-lg hover:bg-surface-dark">
                        <HashIcon size={18} />
                    </button>
                    <HashIcon size={18} className="text-text-muted hidden sm:block" />
                    <div>
                        <h3 className="text-sm font-semibold">{activeChannelInfo?.name}</h3>
                        <p className="text-xs text-text-muted">{activeChannelInfo?.desc}</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {channelMessages.map(msg => {
                        const isOwn = msg.userId === user?.id;
                        const replyMsg = msg.replyTo ? messages.find(m => m.id === msg.replyTo) : null;
                        return (
                            <div key={msg.id} className={`group ${isOwn ? 'ml-auto' : ''} max-w-[85%] sm:max-w-[70%]`}>
                                {replyMsg && (
                                    <div className="text-[10px] text-text-muted mb-1 pl-3 border-l-2 border-border">
                                        Replying to {replyMsg.user}: {replyMsg.content.slice(0, 50)}...
                                    </div>
                                )}
                                <div className={`${isOwn ? 'bg-primary text-white' : 'bg-surface-card border border-border'} px-4 py-2.5 rounded-2xl ${isOwn ? 'rounded-br-md' : 'rounded-bl-md'} shadow-sm`}>
                                    {!isOwn && (
                                        <p className="text-xs font-semibold mb-1" style={{ color: isOwn ? 'white' : stringToColor(msg.user) }}>{msg.user}</p>
                                    )}
                                    <p className="text-sm">{msg.content}</p>
                                    <p className={`text-[10px] mt-1 ${isOwn ? 'text-white/60' : 'text-text-muted'}`}>{formatTime(msg.timestamp)}</p>
                                </div>
                                {!isOwn && (
                                    <button onClick={() => setReplyTo(msg)} className="text-[10px] text-text-muted hover:text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Reply
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Reply indicator */}
                {replyTo && (
                    <div className="px-4 py-2 bg-surface-dark border-t border-border flex items-center gap-2">
                        <span className="text-xs text-text-light flex-1">Replying to <strong>{replyTo.user}</strong></span>
                        <button onClick={() => setReplyTo(null)} className="text-xs text-text-muted hover:text-red-500">Cancel</button>
                    </div>
                )}

                {/* Input */}
                <div className="p-3 border-t border-border bg-surface-card">
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                            placeholder={`Message #${activeChannelInfo?.name}...`}
                            className="input flex-1"
                        />
                        <button onClick={sendMessage} disabled={!input.trim()} className="btn btn-primary">
                            <SendIcon size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#e11d48', '#7c3aed', '#0891b2', '#059669', '#d97706', '#dc2626', '#2563eb', '#9333ea'];
    return colors[Math.abs(hash) % colors.length];
}
