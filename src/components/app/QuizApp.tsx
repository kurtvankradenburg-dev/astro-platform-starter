import React, { useState, useEffect } from "react";

interface Question {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    topic: string;
}

const TOPICS = [
    { name: "Human Anatomy", desc: "Origins, insertions, fiber types", icon: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" },
    { name: "Muscle Physiology", desc: "Contraction, calcium, sliding filament", icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" },
    { name: "Biomechanics", desc: "Moment arms, torque, leverages", icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" },
    { name: "Exercise Science", desc: "Training principles & methodology", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
    { name: "Nervous System & MUR", desc: "Motor unit recruitment & rate coding", icon: "M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" },
    { name: "Recovery & Adaptation", desc: "Sleep, supercompensation, hormones", icon: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" },
];

export default function QuizApp() {
    const [authLoading, setAuthLoading] = useState(true);
    const [userTier, setUserTier] = useState<"free" | "premium">("free");
    const [question, setQuestion] = useState<Question | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [score, setScore] = useState({ correct: 0, total: 0 });
    const [error, setError] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("myogen_token");
        if (!token) { window.location.href = "/login"; return; }
        fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => {
                if (data.error) { window.location.href = "/login"; return; }
                setUserTier(data.user.tier);
                setAuthLoading(false);
            })
            .catch(() => { window.location.href = "/login"; });
    }, []);

    const fetchQuestion = async (topic?: string) => {
        setLoading(true);
        setError("");
        setSelectedAnswer(null);
        setShowExplanation(false);

        try {
            const token = localStorage.getItem("myogen_token");
            const res = await fetch("/api/quiz", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ topic: topic || selectedTopic, useAI: true }),
            });

            const data = await res.json();
            if (data.premiumRequired) {
                setError("Quizzes are available for Premium users only.");
                setLoading(false);
                return;
            }
            if (data.error) {
                setError(data.error);
                setLoading(false);
                return;
            }
            setQuestion(data.question);
        } catch {
            setError("Failed to load question.");
        }
        setLoading(false);
    };

    const handleAnswer = (index: number) => {
        if (selectedAnswer !== null || !question) return;
        setSelectedAnswer(index);
        setShowExplanation(true);
        setScore((prev) => ({
            correct: prev.correct + (index === question.correctIndex ? 1 : 0),
            total: prev.total + 1,
        }));
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    // Free users see quiz teaser with topics
    if (userTier === "free") {
        return (
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white mb-2">Science Quizzes</h1>
                    <p className="text-gray-500 text-sm">
                        Test your knowledge across 6 scientific domains. Available for Premium users.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {TOPICS.map((topic) => (
                        <div key={topic.name} className="card-hover cursor-default">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={topic.icon} />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-medium text-sm">{topic.name}</h3>
                                    <p className="text-gray-600 text-xs mt-0.5">{topic.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card text-center">
                    <div className="w-14 h-14 mx-auto mb-4 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                        <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-white mb-2">Unlock All Quizzes</h2>
                    <p className="text-gray-500 text-sm mb-4">
                        Get unlimited access to quizzes across all 6 scientific domains with detailed explanations.
                    </p>
                    <a href="/subscription" className="btn btn-primary no-underline nav-link">
                        Upgrade to Premium — $14.99/mo
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Science Quiz</h1>
                    <p className="text-gray-500 text-sm mt-1">Test your exercise science knowledge</p>
                </div>
                {score.total > 0 && (
                    <div className="text-right">
                        <div className="text-2xl font-bold text-white">{score.correct}/{score.total}</div>
                        <div className="text-xs text-gray-600">Score</div>
                    </div>
                )}
            </div>

            {!question && (
                <div className="space-y-4">
                    <h2 className="text-sm uppercase tracking-wider text-gray-600">Choose a Topic</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {TOPICS.map((topic) => (
                            <button
                                key={topic.name}
                                onClick={() => { setSelectedTopic(topic.name); fetchQuestion(topic.name); }}
                                className="card-hover text-left cursor-pointer"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={topic.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium text-sm">{topic.name}</h3>
                                        <p className="text-gray-600 text-xs mt-0.5">{topic.desc}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => fetchQuestion("")}
                        className="btn btn-primary w-full mt-4"
                    >
                        Random Topic
                    </button>
                </div>
            )}

            {loading && (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {question && !loading && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="badge-premium">{question.topic}</span>
                    </div>

                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-6">{question.question}</h2>

                        <div className="space-y-3">
                            {question.options.map((option, i) => {
                                let style = "border-blue-500/10 hover:border-blue-500/30 text-gray-300";
                                if (selectedAnswer !== null) {
                                    if (i === question.correctIndex) {
                                        style = "border-green-500 bg-green-500/10 text-green-300";
                                    } else if (i === selectedAnswer && i !== question.correctIndex) {
                                        style = "border-red-500 bg-red-500/10 text-red-300";
                                    } else {
                                        style = "border-blue-500/5 text-gray-600";
                                    }
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(i)}
                                        disabled={selectedAnswer !== null}
                                        className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer ${style}`}
                                    >
                                        <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {showExplanation && (
                        <div className="card bg-[#08080e] animate-fade-in">
                            <div className="flex items-center gap-2 mb-3">
                                {selectedAnswer === question.correctIndex ? (
                                    <span className="text-green-400 font-semibold text-sm">Correct!</span>
                                ) : (
                                    <span className="text-red-400 font-semibold text-sm">Incorrect</span>
                                )}
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">{question.explanation}</p>
                        </div>
                    )}

                    {showExplanation && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => fetchQuestion(selectedTopic)}
                                className="btn btn-primary flex-1"
                            >
                                Next Question
                            </button>
                            <button
                                onClick={() => { setQuestion(null); setSelectedTopic(""); }}
                                className="btn btn-outline"
                            >
                                Change Topic
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
