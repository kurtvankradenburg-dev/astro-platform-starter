import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../auth/AuthContext';
import AuthScreen from '../auth/AuthScreen';
import Sidebar from './Sidebar';
import LoadingScreen from './LoadingScreen';
import Dashboard from '../dashboard/Dashboard';
import KnowledgeCentre from '../knowledge/KnowledgeCentre';
import AIAssistant from '../ai/AIAssistant';
import StudyHub from '../study/StudyHub';
import CommunitySupport from '../community/CommunitySupport';
import BusinessDirectory from '../directory/BusinessDirectory';
import ChatSystem from '../chat/ChatSystem';
import Reports from '../reports/Reports';
import Alerts from '../alerts/Alerts';
import Gamification from '../gamification/Gamification';
import SettingsPage from '../settings/SettingsPage';
import LegalPages from '../legal/LegalPages';
import { MenuIcon, XIcon } from '../ui/Icons';

export type Page = 'dashboard' | 'knowledge' | 'ai-assistant' | 'study' | 'community' | 'directory' | 'chat' | 'reports' | 'alerts' | 'gamification' | 'settings' | 'terms' | 'privacy' | 'help' | 'about' | 'features';

function AppContent() {
    const { user, loading } = useAuth();
    const [appReady, setAppReady] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAppReady(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    if (!appReady) return <LoadingScreen />;
    if (loading) return <LoadingScreen />;
    if (!user) return <AuthScreen />;

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
            case 'knowledge': return <KnowledgeCentre />;
            case 'ai-assistant': return <AIAssistant />;
            case 'study': return <StudyHub />;
            case 'community': return <CommunitySupport />;
            case 'directory': return <BusinessDirectory />;
            case 'chat': return <ChatSystem />;
            case 'reports': return <Reports />;
            case 'alerts': return <Alerts />;
            case 'gamification': return <Gamification />;
            case 'settings': return <SettingsPage />;
            case 'terms': case 'privacy': case 'help': case 'about': case 'features':
                return <LegalPages page={currentPage} />;
            default: return <Dashboard onNavigate={setCurrentPage} />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-bg">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <div className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <Sidebar currentPage={currentPage} onNavigate={(page) => { setCurrentPage(page); setSidebarOpen(false); }} />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="h-14 bg-white border-b border-border flex items-center px-4 gap-3 shrink-0">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100">
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

                {/* Page content */}
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
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
