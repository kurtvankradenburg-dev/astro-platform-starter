import React, { useState, useMemo } from 'react';
import { useAuth, TOWNS } from './AuthContext';
import { LeafIcon, EyeIcon, EyeOffIcon, SearchIcon } from '../ui/Icons';

export default function AuthScreen() {
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [town, setTown] = useState('');
    const [townSearch, setTownSearch] = useState('');
    const [showTownDropdown, setShowTownDropdown] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState<'terms' | 'privacy' | null>(null);

    const filteredTowns = useMemo(() => {
        if (!townSearch) return TOWNS.slice(0, 10);
        return TOWNS.filter(t => t.toLowerCase().includes(townSearch.toLowerCase())).slice(0, 10);
    }, [townSearch]);

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isPasswordValid = password.length >= 6;
    const isSignupValid = isEmailValid && isPasswordValid && name.trim().length > 0 && town.length > 0 && agreedToTerms;
    const isLoginValid = isEmailValid && isPasswordValid;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                if (!name.trim()) { setError('Please enter your name'); setLoading(false); return; }
                if (!town) { setError('Please select your town'); setLoading(false); return; }
                await signup(email, password, name, town);
            }
        } catch (err: any) {
            setError(err?.message || 'Something went wrong');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-[#0c1a0e] dark:via-[#0f1a12] dark:to-[#0c1a0e] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg shadow-green-200 dark:shadow-green-900/30">
                        <LeafIcon className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Eco City</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Smart sustainable communities</p>
                </div>

                <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex mb-6 bg-surface-dark rounded-lg p-1">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-surface-card shadow text-text' : 'text-text-light'}`}
                        >Sign In</button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-surface-card shadow text-text' : 'text-text-light'}`}
                        >Sign Up</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" placeholder="John Doe" required={!isLogin} />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="input pr-10"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                                >
                                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                </button>
                            </div>
                        </div>
                        {!isLogin && (
                            <>
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Your Town</label>
                                    <div className="relative">
                                        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                        <input
                                            type="text"
                                            value={townSearch || town}
                                            onChange={e => { setTownSearch(e.target.value); setTown(''); setShowTownDropdown(true); }}
                                            onFocus={() => setShowTownDropdown(true)}
                                            className="input pl-10"
                                            placeholder="Search for your town..."
                                        />
                                    </div>
                                    {showTownDropdown && (
                                        <div className="absolute z-10 w-full mt-1 bg-surface-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                            {filteredTowns.map(t => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => { setTown(t); setTownSearch(''); setShowTownDropdown(false); }}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors"
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                            {filteredTowns.length === 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => { setTown(townSearch); setShowTownDropdown(false); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-primary font-medium hover:bg-primary/10"
                                                >
                                                    + Create "{townSearch}" as your town
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    {town && <p className="text-xs text-primary mt-1 font-medium">Selected: {town}</p>}
                                </div>

                                <label className="flex items-start gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={e => setAgreedToTerms(e.target.checked)}
                                        className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary"
                                    />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        I agree to the{' '}
                                        <button type="button" onClick={() => setShowTermsModal('terms')} className="text-primary hover:underline">Terms & Conditions</button>
                                        {' '}and{' '}
                                        <button type="button" onClick={() => setShowTermsModal('privacy')} className="text-primary hover:underline">Privacy Policy</button>
                                    </span>
                                </label>
                            </>
                        )}
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading || (isLogin ? !isLoginValid : !isSignupValid)}
                            className={`btn w-full transition-all ${
                                (isLogin ? isLoginValid : isSignupValid) && !loading
                                    ? 'btn-primary'
                                    : 'bg-border text-text-muted cursor-not-allowed hover:transform-none hover:shadow-none'
                            }`}
                        >
                            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>

            {/* Terms/Privacy Modal */}
            {showTermsModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTermsModal(null)}>
                    <div className="bg-surface-card rounded-xl border border-border max-w-lg w-full max-h-[70vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
                        {showTermsModal === 'terms' ? (
                            <>
                                <h2 className="text-lg font-bold mb-4">Terms & Conditions</h2>
                                <div className="text-sm text-text-light space-y-3 leading-relaxed">
                                    <p>By accessing or using Eco City, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform.</p>
                                    <p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration.</p>
                                    <p>You agree not to use Eco City to post harmful, misleading, or illegal content. The platform is for community benefit and abuse will result in account suspension.</p>
                                    <p>User-submitted content (reports, chat messages, etc.) remains the property of the user but is licensed to Eco City for platform operation purposes.</p>
                                    <p>AI features are provided for informational and educational purposes. Responses are generated by AI models and should not be considered professional advice.</p>
                                    <p>Your privacy is important to us. Please review our Privacy Policy for details on how we collect, use, and protect your information.</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold mb-4">Privacy Policy</h2>
                                <div className="text-sm text-text-light space-y-3 leading-relaxed">
                                    <p>We collect your name, email, town, and usage data when you register and use Eco City. Reports and chat messages are also stored.</p>
                                    <p>Your information is used to provide personalized services, deliver town-specific alerts, and improve the platform experience.</p>
                                    <p>Data is stored securely using industry-standard practices. We use encrypted connections and secure authentication.</p>
                                    <p>We do not sell or share your personal information with third parties except where required by law or for essential platform operations.</p>
                                    <p>You have the right to access, update, or delete your personal data through the Settings page or by contacting support.</p>
                                </div>
                            </>
                        )}
                        <button onClick={() => setShowTermsModal(null)} className="btn btn-primary w-full mt-4">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
