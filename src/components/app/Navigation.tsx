import React, { useState, useEffect } from "react";
import DNALogo from "./DNALogo";

interface User {
    id: string;
    email: string;
    name: string;
    tier: "free" | "premium";
    messagesUsed: number;
    messagesResetAt: string;
}

interface NavProps {
    activePage?: string;
}

export default function Navigation({ activePage }: NavProps) {
    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("myogen_token");
        if (!token) return;
        fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => { if (data.user) setUser(data.user); })
            .catch(() => {});
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem("myogen_token");
        if (token) {
            await fetch("/api/auth/me", { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
        }
        localStorage.removeItem("myogen_token");
        window.location.href = "/";
    };

    const links = [
        { href: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { href: "/chat", label: "AI Chat", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
        { href: "/analyzer", label: "Analyzer", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
        { href: "/quiz", label: "Quiz", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
        { href: "/subscription", label: "Premium", icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
    ];

    return (
        <nav className="bg-black/80 backdrop-blur-xl border-b border-blue-500/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <a href={user ? "/dashboard" : "/"} className="nav-link flex items-center gap-2.5 no-underline">
                        <DNALogo size={28} />
                        <span className="text-white font-bold text-lg tracking-tight">MYOGEN</span>
                    </a>

                    {user && (
                        <div className="hidden md:flex items-center gap-1">
                            {links.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className={`nav-link flex items-center gap-2 px-3 py-2 rounded-lg text-sm no-underline transition-colors ${
                                        activePage === link.href
                                            ? "bg-blue-600/15 text-blue-400"
                                            : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                                    </svg>
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <span className={`hidden sm:inline-flex text-xs px-2.5 py-1 rounded-full ${user.tier === "premium" ? "bg-blue-500/15 text-blue-400 border border-blue-500/20" : "bg-gray-800 text-gray-500"}`}>
                                    {user.tier === "premium" ? "Premium" : "Free"}
                                </span>
                                <span className="hidden sm:inline text-sm text-gray-500">{user.name}</span>
                                <button onClick={handleLogout} className="text-gray-500 hover:text-white text-sm transition-colors cursor-pointer">
                                    Logout
                                </button>
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="md:hidden p-2 text-gray-500 hover:text-white cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <a href="/login" className="nav-link text-gray-400 hover:text-white text-sm no-underline transition-colors">Sign In</a>
                                <a href="/signup" className="nav-link btn btn-primary btn-sm no-underline">Sign Up</a>
                            </div>
                        )}
                    </div>
                </div>

                {user && menuOpen && (
                    <div className="md:hidden pb-4 border-t border-blue-500/10 mt-2 pt-2">
                        {links.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className={`nav-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline ${
                                    activePage === link.href
                                        ? "bg-blue-600/15 text-blue-400"
                                        : "text-gray-500 hover:text-gray-200"
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                                </svg>
                                {link.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
