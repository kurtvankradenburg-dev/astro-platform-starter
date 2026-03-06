import React, { useState, useEffect } from "react";

interface User {
    id: string;
    email: string;
    name: string;
    tier: "free" | "premium";
    messagesUsed: number;
    messagesResetAt: string;
    quizzesUsedToday: number;
    createdAt: string;
}

export default function DashboardApp() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("myogen_token");
        if (!token) { window.location.href = "/login"; return; }

        fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => {
                if (data.error) { window.location.href = "/login"; return; }
                setUser(data.user);
                setLoading(false);
            })
            .catch(() => { window.location.href = "/login"; });
    }, []);

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const messageLimit = user.tier === "premium" ? "Unlimited" : "15";
    const messagesLeft = user.tier === "premium" ? "Unlimited" : Math.max(0, 15 - user.messagesUsed);

    const features = [
        {
            title: "AI Chat",
            desc: "Ask science-based questions about exercise, biomechanics, and physiology",
            href: "/chat",
            icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
        },
        {
            title: "Physique Analyzer",
            desc: "Upload a photo for AI-powered physique analysis with scientific metrics",
            href: "/analyzer",
            icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
        },
        {
            title: "Science Quiz",
            desc: "Test your knowledge in anatomy, biomechanics, and exercise science",
            href: "/quiz",
            icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
            premium: true,
        },
        {
            title: "Premium",
            desc: "Unlock unlimited AI messages, full analysis, quizzes, and physique Q&A",
            href: "/subscription",
            icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    Welcome back, {user.name.split(" ")[0]}
                </h1>
                <p className="text-gray-500 mt-1">Your science-based training intelligence hub</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="card">
                    <div className="text-xs text-gray-600 uppercase tracking-wider">Tier</div>
                    <div className={`text-lg font-bold mt-1 ${user.tier === "premium" ? "text-blue-400" : "text-gray-400"}`}>
                        {user.tier === "premium" ? "Premium" : "Free"}
                    </div>
                </div>
                <div className="card">
                    <div className="text-xs text-gray-600 uppercase tracking-wider">AI Messages</div>
                    <div className="text-lg font-bold mt-1 text-blue-400">
                        {user.messagesUsed} / {messageLimit}
                    </div>
                </div>
                <div className="card">
                    <div className="text-xs text-gray-600 uppercase tracking-wider">Messages Left</div>
                    <div className="text-lg font-bold mt-1 text-green-400">{messagesLeft}</div>
                </div>
                <div className="card">
                    <div className="text-xs text-gray-600 uppercase tracking-wider">Quizzes Today</div>
                    <div className="text-lg font-bold mt-1 text-blue-300">
                        {user.tier === "premium" ? user.quizzesUsedToday : "Premium Only"}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((f) => (
                    <a
                        key={f.href}
                        href={f.href}
                        className="nav-link card-hover group flex items-start gap-4 no-underline"
                    >
                        <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                                    {f.title}
                                </h3>
                                {f.premium && user.tier === "free" && (
                                    <span className="badge-premium">Premium</span>
                                )}
                            </div>
                            <p className="text-gray-500 text-sm mt-1">{f.desc}</p>
                        </div>
                    </a>
                ))}
            </div>

            <div className="mt-8 p-4 bg-[#08080e] border border-blue-500/10 rounded-lg">
                <p className="text-xs text-gray-600 text-center">
                    Myogen is for educational purposes only. It does not provide medical diagnosis, prescription, or treatment.
                    Consult a qualified healthcare provider for personal health decisions.
                </p>
            </div>
        </div>
    );
}
