import React, { useState, useEffect, useRef } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

const PRELOADED_QUESTIONS = [
    { category: "Biomechanics", questions: [
        "What makes the low-to-high cable fly effective for upper pec development?",
        "Why are overhead triceps extensions superior for the long head?",
        "How do moment arms affect exercise selection for the lateral deltoid?",
        "Explain the biomechanical advantage of the Romanian deadlift for hamstring development.",
    ]},
    { category: "Motor Units", questions: [
        "Explain Henneman's Size Principle and its practical training implications.",
        "How does rate coding contribute to force production?",
        "What is the bilateral deficit and why does it occur?",
        "How do motor unit recruitment patterns differ between heavy and light loads?",
    ]},
    { category: "Muscle Physiology", questions: [
        "Describe the role of calcium ions in muscle contraction.",
        "What determines muscle fiber type (Type I vs Type II)?",
        "Explain the sliding filament theory of muscle contraction.",
        "What are the three primary mechanisms of muscle hypertrophy?",
    ]},
    { category: "Recovery", questions: [
        "Why is 2-3 minutes of rest recommended between heavy compound sets?",
        "How does sleep affect growth hormone secretion and recovery?",
        "What is the repeated bout effect and why does it matter?",
        "Explain the role of cortisol in exercise recovery.",
    ]},
];

export default function ChatApp() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"short" | "detailed">("detailed");
    const [showQuestions, setShowQuestions] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);
    const [limitInfo, setLimitInfo] = useState<{ used: number; limit: number } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem("myogen_token");
        if (!token) { window.location.href = "/login"; return; }
        fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => {
                if (data.error) { window.location.href = "/login"; return; }
                setAuthLoading(false);
            })
            .catch(() => { window.location.href = "/login"; });
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading) return;

        const userMsg: Message = { role: "user", content: text.trim() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setShowQuestions(false);
        setLoading(true);

        try {
            const token = localStorage.getItem("myogen_token");
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ message: text.trim(), mode }),
            });

            const data = await res.json();

            if (data.limitReached) {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: "You've reached your monthly message limit (15 messages). Upgrade to Premium for unlimited AI conversations." },
                ]);
            } else if (data.error) {
                setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${data.error}` }]);
            } else {
                setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
                if (data.messagesUsed !== undefined) {
                    setLimitInfo({ used: data.messagesUsed, limit: data.messagesLimit });
                }
            }
        } catch {
            setMessages((prev) => [...prev, { role: "assistant", content: "Network error. Please try again." }]);
        }

        setLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-bold text-white">AI Chat</h1>
                    <p className="text-xs text-gray-600">Science-based exercise physiology assistant</p>
                </div>
                <div className="flex items-center gap-3">
                    {limitInfo && limitInfo.limit > 0 && (
                        <span className="text-xs text-gray-600">{limitInfo.used}/{limitInfo.limit} messages</span>
                    )}
                    <div className="flex bg-[#0a0a14] border border-blue-500/10 rounded-lg p-0.5">
                        <button
                            onClick={() => setMode("short")}
                            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${mode === "short" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-300"}`}
                        >
                            Short
                        </button>
                        <button
                            onClick={() => setMode("detailed")}
                            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${mode === "detailed" ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-300"}`}
                        >
                            Detailed
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin">
                {messages.length === 0 && showQuestions && (
                    <div className="space-y-6">
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-white mb-1">Ask Myogen AI</h2>
                            <p className="text-sm text-gray-500">Evidence-based answers on biomechanics, physiology, and exercise science</p>
                        </div>

                        {PRELOADED_QUESTIONS.map((cat) => (
                            <div key={cat.category}>
                                <h3 className="text-xs uppercase tracking-wider text-gray-600 mb-2 px-1">{cat.category}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {cat.questions.map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => sendMessage(q)}
                                            className="text-left text-sm text-gray-400 bg-[#0a0a14] hover:bg-[#0e0e1a] border border-blue-500/10 hover:border-blue-500/20 rounded-lg px-3 py-2.5 transition-colors cursor-pointer"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-md"
                                    : "bg-[#0a0a14] text-gray-300 rounded-bl-md border border-blue-500/10"
                            }`}
                        >
                            <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-[#0a0a14] text-gray-500 rounded-2xl rounded-bl-md px-4 py-3 border border-blue-500/10">
                            <div className="flex gap-1.5">
                                <div className="w-2 h-2 bg-blue-500/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 bg-blue-500/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 bg-blue-500/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="input flex-1"
                    placeholder="Ask about biomechanics, physiology, exercise science..."
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="btn btn-primary px-6"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    );
}
