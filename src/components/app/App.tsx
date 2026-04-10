import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from '../auth/AuthContext';
import { ThemeProvider } from '../theme/ThemeContext';
import AuthScreen from '../auth/AuthScreen';
import Sidebar from './Sidebar';
import LoadingScreen from './LoadingScreen';
import Dashboard from '../dashboard/Dashboard';
import { MenuIcon, XIcon } from '../ui/Icons';

const KnowledgeCentre = lazy(() => import('../knowledge/KnowledgeCentre'));
const AIAssistant = lazy(() => import('../ai/AIAssistant'));
const StudyHub = lazy(() => import('../study/StudyHub'));
const CommunitySupport = lazy(() => import('../community/CommunitySupport'));
const BusinessDirectory = lazy(() => import('../directory/BusinessDirectory'));
const ChatSystem = lazy(() => import('../chat/ChatSystem'));
const Reports = lazy(() => import('../reports/Reports'));
const Alerts = lazy(() => import('../alerts/Alerts'));
const JobCentre = lazy(() => import('../jobs/JobCentre'));
const Gamification = lazy(() => import('../gamification/Gamification'));
const SettingsPage = lazy(() => import('../settings/SettingsPage'));
const LegalPages = lazy(() => import('../legal/LegalPages'));

export type Page = 'dashboard' | 'knowledge' | 'ai-assistant' | 'study' | 'community' | 'directory' | 'chat' | 'reports' | 'alerts' | 'jobs' | 'gamification' | 'settings' | 'terms' | 'privacy' | 'help' | 'about' | 'features';

function PageLoader() {
    return (
        <div className="flex items-center justify-center h-64">
            <div className="loading-spinner" />
        </div>
    );
}

function AppContent() {
    const { user, loading } = useAuth();
    const [appReady, setAppReady] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAppReady(true), 800);
        return () => clearTimeout(timer);
    }, []);

    if (!appReady) return <LoadingScreen />;
    if (loading) return <LoadingScreen />;
    if (!user) return <AuthScreen />;

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
            case 'knowledge': return <Suspense fallback={<PageLoader />}><KnowledgeCentre /></Suspense>;
            case 'ai-assistant': return <Suspense fallback={<PageLoader />}><AIAssistant /></Suspense>;
            case 'study': return <Suspense fallback={<PageLoader />}><StudyHub /></Suspense>;
            case 'community': return <Suspense fallback={<PageLoader />}><CommunitySupport /></Suspense>;
            case 'directory': return <Suspense fallback={<PageLoader />}><BusinessDirectory /></Suspense>;
            case 'chat': return <Suspense fallback={<PageLoader />}><ChatSystem /></Suspense>;
            case 'reports': return <Suspense fallback={<PageLoader />}><Reports /></Suspense>;
            case 'alerts': return <Suspense fallback={<PageLoader />}><Alerts /></Suspense>;
            case 'jobs': return <Suspense fallback={<PageLoader />}><JobCentre /></Suspense>;
            case 'gamification': return <Suspense fallback={<PageLoader />}><Gamification /></Suspense>;
            case 'settings': return <Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>;
            case 'terms': case 'privacy': case 'help': case 'about': case 'features':
                return <Suspense fallback={<PageLoader />}><LegalPages page={currentPage} /></Suspense>;
            default: return <Dashboard onNavigate={setCurrentPage} />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-bg">
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            <div className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <Sidebar currentPage={currentPage} onNavigate={(page) => { setCurrentPage(page); setSidebarOpen(false); }} />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-14 bg-surface-card border-b border-border flex items-center px-4 gap-3 shrink-0">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 rounded-lg hover:bg-surface-dark">
                        {sidebarOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
                    </button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-text-light hidden sm:block">{user.town}</span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    <div className="fade-in">
                        {renderPage()}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ThemeProvider>
    );
}
