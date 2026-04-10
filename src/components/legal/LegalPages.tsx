import React from 'react';
import type { Page } from '../app/App';
import { ShieldIcon, InfoIcon, GlobeIcon, LeafIcon, BookIcon } from '../ui/Icons';

interface LegalPagesProps {
    page: Page;
}

export default function LegalPages({ page }: LegalPagesProps) {
    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
            {page === 'terms' && <TermsPage />}
            {page === 'privacy' && <PrivacyPage />}
            {page === 'help' && <HelpPage />}
            {page === 'about' && <AboutPage />}
            {page === 'features' && <FeaturesPage />}
        </div>
    );
}

function AboutPage() {
    return (
        <div className="fade-in">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="relative">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                        <LeafIcon size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-3">About Eco City</h1>
                    <p className="text-green-100 max-w-2xl">Eco City is a smart civic platform designed to connect communities with their local services, promote sustainability, and empower citizens to actively participate in building greener, safer towns.</p>
                </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="font-bold mb-2">Our Mission</h3>
                    <p className="text-sm text-text-light">To create technology that helps every South African community become more connected, sustainable, and responsive to the needs of its residents.</p>
                </div>
                <div className="card">
                    <h3 className="font-bold mb-2">Our Vision</h3>
                    <p className="text-sm text-text-light">A future where every town has the tools to manage resources efficiently, respond to crises quickly, and give every citizen a voice in local governance.</p>
                </div>
                <div className="card">
                    <h3 className="font-bold mb-2">How It Works</h3>
                    <p className="text-sm text-text-light">Citizens sign up for their town, submit reports, receive alerts, access community resources, and contribute to the collective improvement of their area — all from one platform.</p>
                </div>
                <div className="card">
                    <h3 className="font-bold mb-2">Built With</h3>
                    <p className="text-sm text-text-light">Eco City uses modern web technology including AI-powered assistants, real-time communication, and progressive web app features to deliver a fast, reliable experience on any device.</p>
                </div>
            </div>
        </div>
    );
}

function HelpPage() {
    const faqs = [
        { q: 'How do I submit a report?', a: 'Navigate to the Reports section from the sidebar, click "New Report", fill in the details, and submit. Your report will be visible to the community and local authorities.' },
        { q: 'How do I change my town?', a: 'Go to Settings and select a new town from the dropdown. This will update your alerts and community feed.' },
        { q: 'How do push notifications work?', a: 'Enable notifications in Settings. You\'ll receive alerts when important updates happen in your town, like water outages or safety warnings.' },
        { q: 'How does the AI Assistant work?', a: 'The AI Assistant can help with general questions, homework, writing, and more. It\'s a full conversational AI built right into Eco City.' },
        { q: 'How do I earn points?', a: 'You earn points by submitting reports, participating in chat, maintaining daily login streaks, and attending community events.' },
        { q: 'Is my data secure?', a: 'Yes. We use industry-standard encryption and authentication. Your data is stored securely and never shared with third parties without consent.' },
        { q: 'Can I use Eco City offline?', a: 'Eco City has basic offline support as a Progressive Web App. You can install it on your home screen and access cached content when offline.' },
    ];

    return (
        <div className="fade-in">
            <h1 className="text-2xl font-bold mb-1">Help & Support</h1>
            <p className="text-sm text-text-light mb-6">Frequently asked questions and support resources</p>
            <div className="space-y-3">
                {faqs.map((faq, i) => (
                    <details key={i} className="card group">
                        <summary className="font-semibold text-sm cursor-pointer list-none flex items-center justify-between">
                            {faq.q}
                            <span className="text-text-muted group-open:rotate-180 transition-transform">&#9662;</span>
                        </summary>
                        <p className="text-sm text-text-light mt-3">{faq.a}</p>
                    </details>
                ))}
            </div>
            <div className="card mt-6">
                <h3 className="font-bold mb-2">Still need help?</h3>
                <p className="text-sm text-text-light">Contact us at support@ecocity.co.za or use the Chat feature to ask the community.</p>
            </div>
        </div>
    );
}

function TermsPage() {
    return (
        <div className="fade-in">
            <h1 className="text-2xl font-bold mb-1">Terms & Conditions</h1>
            <p className="text-sm text-text-light mb-6">Last updated: April 2026</p>
            <div className="card space-y-4 text-sm text-text-light leading-relaxed">
                <p><strong className="text-text">1. Acceptance of Terms</strong><br/>By accessing or using Eco City, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use the platform.</p>
                <p><strong className="text-text">2. User Accounts</strong><br/>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration.</p>
                <p><strong className="text-text">3. Acceptable Use</strong><br/>You agree not to use Eco City to post harmful, misleading, or illegal content. The platform is for community benefit — abuse will result in account suspension.</p>
                <p><strong className="text-text">4. Content</strong><br/>User-submitted content (reports, chat messages, etc.) remains the property of the user but is licensed to Eco City for platform operation purposes.</p>
                <p><strong className="text-text">5. AI Services</strong><br/>AI features are provided for informational and educational purposes. Responses are generated by AI models and should not be considered professional advice.</p>
                <p><strong className="text-text">6. Privacy</strong><br/>Your privacy is important to us. Please review our Privacy Policy for details on how we collect, use, and protect your information.</p>
                <p><strong className="text-text">7. Limitation of Liability</strong><br/>Eco City is provided "as is" without warranties. We are not liable for any damages arising from use of the platform.</p>
                <p><strong className="text-text">8. Changes</strong><br/>We may update these terms from time to time. Continued use constitutes acceptance of changes.</p>
            </div>
        </div>
    );
}

function PrivacyPage() {
    return (
        <div className="fade-in">
            <h1 className="text-2xl font-bold mb-1">Privacy Policy</h1>
            <p className="text-sm text-text-light mb-6">Last updated: April 2026</p>
            <div className="card space-y-4 text-sm text-text-light leading-relaxed">
                <p><strong className="text-text">Information We Collect</strong><br/>We collect your name, email, town, and usage data when you register and use Eco City. Reports and chat messages are also stored.</p>
                <p><strong className="text-text">How We Use Your Information</strong><br/>Your information is used to provide personalized services, deliver town-specific alerts, and improve the platform experience.</p>
                <p><strong className="text-text">Data Storage</strong><br/>Data is stored securely using industry-standard practices. We use encrypted connections and secure authentication.</p>
                <p><strong className="text-text">Sharing</strong><br/>We do not sell or share your personal information with third parties except where required by law or for essential platform operations.</p>
                <p><strong className="text-text">Cookies</strong><br/>We use essential cookies for authentication and session management. No tracking cookies are used.</p>
                <p><strong className="text-text">Your Rights</strong><br/>You have the right to access, update, or delete your personal data through the Settings page or by contacting support.</p>
                <p><strong className="text-text">Contact</strong><br/>For privacy-related inquiries, contact us at privacy@ecocity.co.za.</p>
            </div>
        </div>
    );
}

function FeaturesPage() {
    const features = [
        { title: 'Smart Dashboard', desc: 'Real-time overview of your town with stats, events, and quick actions.' },
        { title: 'AI-Powered Intelligence', desc: 'Dual AI system — town-specific Eco AI and a general-purpose AI assistant.' },
        { title: 'Reports & Alerts', desc: 'Submit and track community reports. Receive town-specific notifications.' },
        { title: 'Study Hub', desc: 'Upload notes, generate flashcards, access past papers, and join virtual classrooms.' },
        { title: 'Community Support', desc: 'Find free food, aid locations, local deals, and emergency services.' },
        { title: 'Local Services Directory', desc: 'Search and find trusted businesses and services in your area.' },
        { title: 'Community Chat', desc: 'Channel-based messaging with the community — General, Alerts, Jobs, Help.' },
        { title: 'Gamification', desc: 'Earn points, maintain streaks, and compete on town leaderboards.' },
    ];

    return (
        <div className="fade-in">
            <h1 className="text-2xl font-bold mb-1">Features Overview</h1>
            <p className="text-sm text-text-light mb-6">Everything Eco City has to offer</p>
            <div className="grid sm:grid-cols-2 gap-4">
                {features.map(f => (
                    <div key={f.title} className="card">
                        <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                        <p className="text-xs text-text-light">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
