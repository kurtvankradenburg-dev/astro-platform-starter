import React, { useState, useEffect, useRef } from "react";
import CircularGauge from "./CircularGauge";

interface Score {
    score: number;
    analysis: string;
}

interface Analysis {
    scores: {
        muscleMass: Score;
        symmetry: Score;
        conditioning: Score;
        proportions: Score;
        posture: Score;
        aestheticBalance: Score;
        estimatedStrength: Score;
    };
    overallPotential: number;
    summary: string;
    recommendations: string[];
}

const SCORE_LABELS: Record<string, string> = {
    muscleMass: "Muscle Mass",
    symmetry: "Symmetry",
    conditioning: "Conditioning",
    proportions: "Proportions",
    posture: "Posture",
    aestheticBalance: "Aesthetic Balance",
    estimatedStrength: "Est. Strength",
};

export default function AnalyzerApp() {
    const [authLoading, setAuthLoading] = useState(true);
    const [userTier, setUserTier] = useState<"free" | "premium">("free");
    const [image, setImage] = useState<string | null>(null);
    const [consent, setConsent] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<Analysis | null>(null);
    const [error, setError] = useState("");
    const [question, setQuestion] = useState("");
    const [askingQuestion, setAskingQuestion] = useState(false);
    const [qaMessages, setQaMessages] = useState<{role: string; content: string}[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            setError("Image must be under 10MB");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setImage(reader.result as string);
        reader.readAsDataURL(file);
        setError("");
        setAnalysis(null);
        setQaMessages([]);
    };

    const handleAnalyze = async () => {
        if (!image || !consent) return;
        setAnalyzing(true);
        setError("");

        try {
            const token = localStorage.getItem("myogen_token");
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ image, consent: true }),
            });
            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                setAnalysis(data.analysis);
            }
        } catch {
            setError("Network error. Please try again.");
        }
        setAnalyzing(false);
    };

    const handleAskQuestion = async () => {
        if (!question.trim() || askingQuestion || userTier !== "premium") return;
        setAskingQuestion(true);
        const userQ = question.trim();
        setQuestion("");
        setQaMessages(prev => [...prev, { role: "user", content: userQ }]);

        try {
            const token = localStorage.getItem("myogen_token");
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    message: `Based on my physique analysis results (Overall: ${analysis?.overallPotential}/100, ${analysis?.summary}), ${userQ}`,
                    mode: "detailed",
                }),
            });
            const data = await res.json();
            if (data.response) {
                setQaMessages(prev => [...prev, { role: "assistant", content: data.response }]);
            } else {
                setQaMessages(prev => [...prev, { role: "assistant", content: data.error || "Unable to answer." }]);
            }
        } catch {
            setQaMessages(prev => [...prev, { role: "assistant", content: "Network error." }]);
        }
        setAskingQuestion(false);
    };

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const getOverallColor = (score: number) => {
        if (score >= 70) return "#22c55e";
        if (score >= 40) return "#00d4ff";
        return "#ef4444";
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Physique Analyzer</h1>
                <p className="text-gray-500 text-sm mt-1">AI-powered scientific physique analysis with evidence-based metrics</p>
            </div>

            {!analysis ? (
                <div className="card max-w-xl mx-auto">
                    <div className="space-y-5">
                        {/* Upload area */}
                        <div className="border-2 border-dashed border-blue-500/20 rounded-xl p-8 text-center hover:border-blue-500/40 transition-colors">
                            {image ? (
                                <div className="space-y-3">
                                    <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg object-contain" />
                                    <button onClick={() => { setImage(null); setConsent(false); }} className="text-sm text-gray-500 hover:text-red-400 cursor-pointer">
                                        Remove photo
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="cursor-pointer space-y-3"
                                >
                                    <svg className="w-12 h-12 text-blue-500/30 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-gray-300 font-medium">Upload a photo</p>
                                        <p className="text-gray-600 text-sm mt-1">JPG, PNG up to 10MB</p>
                                    </div>
                                </div>
                            )}
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </div>

                        {/* I Consent button/checkbox */}
                        {image && (
                            <button
                                onClick={() => setConsent(!consent)}
                                className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                                    consent
                                        ? "bg-blue-600/10 border-blue-500/30"
                                        : "bg-[#0a0a14] border-blue-500/10 hover:border-blue-500/20"
                                }`}
                            >
                                <div className={`w-5 h-5 mt-0.5 flex-shrink-0 rounded border transition-all flex items-center justify-center ${
                                    consent ? "bg-blue-600 border-blue-600" : "border-blue-500/30"
                                }`}>
                                    {consent && (
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <div className="text-left">
                                    <span className="text-white font-medium text-sm">I Consent</span>
                                    <p className="text-gray-500 text-xs mt-1">
                                        I consent to having this image analyzed by AI for educational purposes. The image will not be stored permanently.
                                    </p>
                                </div>
                            </button>
                        )}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleAnalyze}
                            disabled={!image || !consent || analyzing}
                            className="btn btn-primary w-full"
                        >
                            {analyzing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Analyzing...
                                </span>
                            ) : "Analyze Physique"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    {/* Overall Potential */}
                    <div className="card text-center">
                        <h2 className="text-lg font-semibold text-white mb-4">Overall Potential Score</h2>
                        <div className="relative w-40 h-40 mx-auto mb-4">
                            <svg width="160" height="160" className="transform -rotate-90">
                                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(0,212,255,0.1)" strokeWidth="10" />
                                <circle
                                    cx="80" cy="80" r="70" fill="none"
                                    stroke={getOverallColor(analysis.overallPotential)}
                                    strokeWidth="10" strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 70}
                                    strokeDashoffset={2 * Math.PI * 70 * (1 - analysis.overallPotential / 100)}
                                    style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold" style={{ color: getOverallColor(analysis.overallPotential) }}>
                                    {analysis.overallPotential}
                                </span>
                                <span className="text-sm text-gray-600">/ 100</span>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm max-w-lg mx-auto">{analysis.summary}</p>
                    </div>

                    {/* Category Scores */}
                    <div className="card">
                        <h2 className="text-lg font-semibold text-white mb-6">Category Scores</h2>
                        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                            {Object.entries(analysis.scores).map(([key, val]) => {
                                const isLocked = userTier === "free" && val.analysis === "Upgrade to Premium for detailed analysis";
                                return (
                                    <CircularGauge
                                        key={key}
                                        score={val.score}
                                        maxScore={10}
                                        label={SCORE_LABELS[key] || key}
                                        analysis={val.analysis}
                                        locked={isLocked}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Recommendations */}
                    {analysis.recommendations && analysis.recommendations.length > 0 && (
                        <div className="card">
                            <h2 className="text-lg font-semibold text-white mb-4">Recommendations</h2>
                            <ul className="space-y-2">
                                {analysis.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                        <span className="text-blue-400 mt-0.5">&#8226;</span>
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                            {userTier === "free" && (
                                <div className="mt-4 pt-4 border-t border-blue-500/10">
                                    <a href="/subscription" className="nav-link text-blue-400 text-sm hover:text-blue-300 no-underline">
                                        Upgrade to Premium for full detailed breakdown and all recommendations
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Premium: Ask Questions About Your Physique */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-4">
                            <h2 className="text-lg font-semibold text-white">Ask About Your Physique</h2>
                            <span className="badge-premium">Premium</span>
                        </div>
                        {userTier === "premium" ? (
                            <div className="space-y-4">
                                {qaMessages.length > 0 && (
                                    <div className="space-y-3 max-h-80 overflow-y-auto">
                                        {qaMessages.map((msg, i) => (
                                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                                <div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${
                                                    msg.role === "user"
                                                        ? "bg-blue-600 text-white rounded-br-md"
                                                        : "bg-[#0a0a14] text-gray-300 border border-blue-500/10 rounded-bl-md"
                                                }`}>
                                                    <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {askingQuestion && (
                                            <div className="flex justify-start">
                                                <div className="bg-[#0a0a14] border border-blue-500/10 rounded-xl rounded-bl-md px-4 py-3">
                                                    <div className="flex gap-1.5">
                                                        <div className="w-2 h-2 bg-blue-500/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                        <div className="w-2 h-2 bg-blue-500/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                        <div className="w-2 h-2 bg-blue-500/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <input
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                                        className="input flex-1"
                                        placeholder="Ask about your physique analysis..."
                                        disabled={askingQuestion}
                                    />
                                    <button
                                        onClick={handleAskQuestion}
                                        disabled={!question.trim() || askingQuestion}
                                        className="btn btn-primary px-4"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-xs text-gray-600">Ask follow-up questions about your analysis and get personalized biomechanics recommendations.</p>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-sm mb-4">Premium users can ask follow-up questions about their analysis and receive personalized biomechanics recommendations.</p>
                                <a href="/subscription" className="btn btn-outline no-underline nav-link">Upgrade to Premium — $14.99/mo</a>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 justify-center">
                        <button onClick={() => { setAnalysis(null); setImage(null); setConsent(false); setQaMessages([]); }} className="btn btn-outline">
                            Analyze Another Photo
                        </button>
                    </div>

                    <p className="text-xs text-gray-700 text-center">
                        This analysis is for educational purposes only. Results are AI-generated estimates and should not be used for medical decisions.
                    </p>
                </div>
            )}
        </div>
    );
}
