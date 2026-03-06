import React, { useState, useEffect } from "react";

interface User {
    id: string;
    email: string;
    name: string;
    tier: "free" | "premium";
    premiumExpiresAt: string | null;
    messagesUsed: number;
}

export default function SubscriptionApp() {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("myogen_token");
        if (!token) { window.location.href = "/login"; return; }
        fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => {
                if (data.error) { window.location.href = "/login"; return; }
                setUser(data.user);
                setAuthLoading(false);
            })
            .catch(() => { window.location.href = "/login"; });
    }, []);

    useEffect(() => {
        if (!user || user.tier === "premium") return;
        const script = document.createElement("script");
        script.src = "https://www.paypal.com/sdk/js?client-id=BAArpDS4sDJse2jW27NyDQZq73pqLH_p3WSXi7BQ19FGXdJtVfpCbepNOD-iJLiKPJgOwUwDwEVw1rQ5II&components=hosted-buttons&disable-funding=venmo&currency=USD";
        script.crossOrigin = "anonymous";
        script.async = true;
        script.onload = () => {
            if ((window as any).paypal) {
                (window as any).paypal.HostedButtons({
                    hostedButtonId: "Q45AE7P7J6CWJ",
                }).render("#paypal-container-Q45AE7P7J6CWJ");
            }
        };
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, [user]);

    if (authLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const freeFeatures = [
        "15 AI messages per month",
        "Partial physique analysis",
        "Basic category ratings",
        "Core scientific explanations",
    ];

    const premiumFeatures = [
        "Unlimited AI messages",
        "Full detailed physique analysis",
        "All 7 category scores with analysis",
        "Advanced biomechanics explanations",
        "Unlimited science quizzes",
        "Ask questions about your physique",
        "Detailed structural breakdowns",
        "Priority AI response quality",
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {user.tier === "premium" ? "Your Premium Plan" : "Upgrade to Premium"}
                </h1>
                <p className="text-gray-500 mt-2">
                    {user.tier === "premium"
                        ? "You have full access to all Myogen features"
                        : "Unlock the full power of science-based fitness analysis"}
                </p>
            </div>

            {user.tier === "premium" ? (
                <div className="card max-w-lg mx-auto text-center">
                    <div className="w-16 h-16 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Premium Active</h2>
                    {user.premiumExpiresAt && (
                        <p className="text-gray-500 text-sm mb-6">
                            Renews: {new Date(user.premiumExpiresAt).toLocaleDateString()}
                        </p>
                    )}
                    <ul className="text-left space-y-2 mb-6">
                        {premiumFeatures.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                                <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {f}
                            </li>
                        ))}
                    </ul>
                    <a href="/dashboard" className="btn btn-primary no-underline nav-link">Go to Dashboard</a>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="card">
                        <div className="mb-4">
                            <span className="badge-free">Free</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">Free Tier</h2>
                        <p className="text-3xl font-bold text-white mb-5">$0 <span className="text-sm font-normal text-gray-600">/month</span></p>
                        <ul className="space-y-2 mb-6">
                            {freeFeatures.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                                    <svg className="w-4 h-4 text-gray-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <div className="text-xs text-gray-700">Current plan</div>
                    </div>

                    <div className="card border-blue-500/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                            RECOMMENDED
                        </div>
                        <div className="mb-4">
                            <span className="badge-premium">Premium</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">Premium Tier</h2>
                        <p className="text-3xl font-bold text-white mb-5">
                            $14.99 <span className="text-sm font-normal text-gray-500">/month</span>
                        </p>
                        <ul className="space-y-2 mb-6">
                            {premiumFeatures.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                                    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <div id="paypal-container-Q45AE7P7J6CWJ" className="mb-4"></div>

                        <div className="text-center">
                            <div className="bg-[#08080e] border border-neon/20 rounded-lg px-4 py-3">
                                <p className="text-xs text-gray-400">
                                    Complete payment through PayPal above. Your premium access will be activated automatically once payment is confirmed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8 p-4 bg-[#08080e] border border-blue-500/10 rounded-lg text-center">
                <p className="text-xs text-gray-600">
                    Subscription renews monthly at $14.99. Cancel anytime. All features are for educational purposes only.
                </p>
            </div>
        </div>
    );
}
