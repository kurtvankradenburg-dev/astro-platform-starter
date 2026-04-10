import React, { useState } from 'react';
import { useAuth, TOWNS } from './AuthContext';
import { LeafIcon } from '../ui/Icons';

export default function AuthScreen() {
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [town, setTown] = useState('Johannesburg');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                if (!name.trim()) { setError('Please enter your name'); setLoading(false); return; }
                await signup(email, password, name, town);
            }
        } catch (err: any) {
            setError(err?.message || 'Something went wrong');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8 fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg shadow-green-200">
                        <LeafIcon className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Eco City</h1>
                    <p className="text-gray-500 mt-2">Smart sustainable communities</p>
                </div>

                <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                        >Sign In</button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
                        >Sign Up</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input" placeholder="John Doe" required={!isLogin} />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" required minLength={6} />
                        </div>
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Your Town</label>
                                <select value={town} onChange={e => setTown(e.target.value)} className="input">
                                    {TOWNS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        )}
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button type="submit" disabled={loading} className="btn btn-primary w-full">
                            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
