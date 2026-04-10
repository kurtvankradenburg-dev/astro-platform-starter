import React from 'react';
import type { Page } from '../app/App';
import { ShieldIcon, InfoIcon, GlobeIcon, LeafIcon, BookIcon, HeartIcon, BotIcon, FileIcon, AlertIcon, GraduationIcon, ChatIcon, TrophyIcon } from '../ui/Icons';

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
                    <p className="text-green-100 max-w-2xl">Eco City is a smart civic platform designed to connect communities with their local services, promote sustainability, and empower citizens to actively participate in building greener, safer towns across South Africa.</p>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
                <div className="card">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3">
                        <LeafIcon size={20} className="text-green-600" />
                    </div>
                    <h3 className="font-bold mb-2">Our Mission</h3>
                    <p className="text-sm text-text-light">To create technology that helps every South African community become more connected, sustainable, and responsive to the needs of its residents. We believe that informed citizens build stronger communities.</p>
                </div>
                <div className="card">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3">
                        <GlobeIcon size={20} className="text-blue-600" />
                    </div>
                    <h3 className="font-bold mb-2">Our Vision</h3>
                    <p className="text-sm text-text-light">A future where every town has the tools to manage resources efficiently, respond to crises quickly, and give every citizen a voice in local governance and environmental stewardship.</p>
                </div>
                <div className="card">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-3">
                        <InfoIcon size={20} className="text-purple-600" />
                    </div>
                    <h3 className="font-bold mb-2">How It Works</h3>
                    <p className="text-sm text-text-light">Citizens sign up for their town, submit reports, receive alerts, access community resources, and contribute to the collective improvement of their area — all from one platform.</p>
                </div>
                <div className="card">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-3">
                        <BotIcon size={20} className="text-amber-600" />
                    </div>
                    <h3 className="font-bold mb-2">Built With</h3>
                    <p className="text-sm text-text-light">Eco City uses modern web technology including AI-powered assistants, real-time communication, and progressive web app features to deliver a fast, reliable experience on any device.</p>
                </div>
            </div>

            <div className="card mt-8">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <HeartIcon size={20} className="text-green-600" />
                    </div>
                    <div>
                        <h3 className="font-bold">The Team</h3>
                        <p className="text-xs text-text-light">The people behind Eco City</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {['Kurt van Kradenburg', 'Anjanette Venter', 'Ninke Hough', 'Ryan Cronje'].map(name => (
                        <div key={name} className="text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm">
                                {name.split(' ')[0][0]}{name.split(' ').slice(-1)[0][0]}
                            </div>
                            <p className="text-sm font-medium">{name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function HelpPage() {
    const faqs = [
        { q: 'How do I submit a report?', a: 'Navigate to the Reports section from the sidebar, click "New Report", fill in the details including a photo if needed, select a category, and submit. Your report will be visible to the community and local authorities.' },
        { q: 'How do I change my town?', a: 'Go to Settings and search for your new town in the town search field. This will update your alerts, community feed, and all town-specific features.' },
        { q: 'How do push notifications work?', a: 'Enable notifications in Settings. You will receive alerts when important updates happen in your town, like water outages or safety warnings. Notifications are permission-based and can be toggled off at any time.' },
        { q: 'How does the AI Assistant work?', a: 'The AI Assistant can help with general questions, homework, writing, and more. It is a full conversational AI built right into Eco City. Eco AI in the Knowledge Centre specifically answers town-related questions.' },
        { q: 'How do I earn points?', a: 'You earn points by submitting reports, participating in chat, maintaining daily login streaks, and attending community events. Points contribute to your town leaderboard ranking.' },
        { q: 'How do I switch between dark and light mode?', a: 'You can toggle dark mode in the Settings page under Appearance, or use the moon/sun icon in the sidebar header. Your preference is saved automatically.' },
        { q: 'Is my data secure?', a: 'Yes. We use industry-standard encryption and authentication. Your data is stored securely and never shared with third parties without consent.' },
        { q: 'Can I use Eco City offline?', a: 'Eco City has basic offline support as a Progressive Web App. You can install it on your home screen and access cached content when offline.' },
    ];

    return (
        <div className="fade-in">
            <h1 className="text-2xl font-bold mb-1">Help & Support</h1>
            <p className="text-sm text-text-light mb-6">Frequently asked questions and support resources</p>

            <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=250&fit=crop" alt="Community support" className="w-full h-40 object-cover rounded-xl mb-6" loading="lazy" />

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
                <p className="text-sm text-text-light">Contact us at support@ecocity.co.za or use the Chat feature to ask the community. Our support team responds within 24 hours on weekdays.</p>
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
                <p><strong className="text-text">1. Acceptance of Terms</strong><br/>By accessing or using Eco City, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform. These terms apply to all users of the platform, including contributors, viewers, and administrators.</p>
                <p><strong className="text-text">2. User Accounts</strong><br/>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration. Each user may only maintain one active account.</p>
                <p><strong className="text-text">3. Acceptable Use</strong><br/>You agree not to use Eco City to post harmful, misleading, or illegal content. The platform is for community benefit — abuse will result in account suspension. Users must respect other community members and engage constructively.</p>
                <p><strong className="text-text">4. Content</strong><br/>User-submitted content (reports, chat messages, images, etc.) remains the property of the user but is licensed to Eco City for platform operation purposes. By uploading images, you confirm you have the right to share them.</p>
                <p><strong className="text-text">5. AI Services</strong><br/>AI features are provided for informational and educational purposes. Responses are generated by AI models and should not be considered professional advice. AI-generated content may not always be accurate.</p>
                <p><strong className="text-text">6. Privacy</strong><br/>Your privacy is important to us. Please review our Privacy Policy for details on how we collect, use, and protect your information. Location data is only collected with your explicit permission.</p>
                <p><strong className="text-text">7. Notifications</strong><br/>Push notifications are permission-based and can be disabled at any time through Settings. By enabling notifications, you agree to receive town-specific alerts and important platform updates.</p>
                <p><strong className="text-text">8. Limitation of Liability</strong><br/>Eco City is provided "as is" without warranties. We are not liable for any damages arising from use of the platform. Emergency information should be verified with official sources.</p>
                <p><strong className="text-text">9. Changes</strong><br/>We may update these terms from time to time. Continued use constitutes acceptance of changes. Users will be notified of significant changes through the platform.</p>
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
                <p><strong className="text-text">Information We Collect</strong><br/>We collect your name, email, town, and usage data when you register and use Eco City. Reports, chat messages, and uploaded images are also stored. Location data is only collected when you explicitly grant permission.</p>
                <p><strong className="text-text">How We Use Your Information</strong><br/>Your information is used to provide personalized services, deliver town-specific alerts, improve the platform experience, and generate aggregated community insights.</p>
                <p><strong className="text-text">Data Storage</strong><br/>Data is stored securely using industry-standard practices. We use encrypted connections and secure authentication. Images are stored securely and accessible only to authorized users.</p>
                <p><strong className="text-text">AI Data Usage</strong><br/>Content sent to AI features is processed to generate responses and is not stored permanently. Your conversations with AI are kept locally on your device and are not used for training purposes.</p>
                <p><strong className="text-text">Sharing</strong><br/>We do not sell or share your personal information with third parties except where required by law or for essential platform operations.</p>
                <p><strong className="text-text">Cookies</strong><br/>We use essential cookies for authentication, session management, and theme preferences. No tracking cookies are used.</p>
                <p><strong className="text-text">Your Rights</strong><br/>You have the right to access, update, or delete your personal data through the Settings page or by contacting support. You can export your data at any time.</p>
                <p><strong className="text-text">Contact</strong><br/>For privacy-related inquiries, contact us at privacy@ecocity.co.za. We respond to all privacy requests within 30 days.</p>
            </div>
        </div>
    );
}

function FeaturesPage() {
    const features = [
        { title: 'Smart Dashboard', desc: 'Real-time overview of your town with stats, events, and quick actions. Personalized to your community.', icon: LeafIcon, color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
        { title: 'AI-Powered Intelligence', desc: 'Dual AI system — town-specific Eco AI and a general-purpose AI assistant for any question.', icon: BotIcon, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
        { title: 'Reports & Alerts', desc: 'Submit community reports with photos and location. Receive town-specific alerts with urgency levels.', icon: FileIcon, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
        { title: 'Study Hub', desc: 'Upload notes, generate flashcards, access past papers, track study performance, and join classrooms.', icon: GraduationIcon, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' },
        { title: 'Community Support', desc: 'Find free food, aid locations, local deals, and emergency services across South African towns.', icon: HeartIcon, color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600' },
        { title: 'Local Services', desc: 'Search and find trusted businesses and services in your area with ratings and contact details.', icon: BookIcon, color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' },
        { title: 'Community Chat', desc: 'Channel-based messaging with the community — General, Alerts, Jobs, and Help channels.', icon: ChatIcon, color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600' },
        { title: 'Gamification', desc: 'Earn points, maintain streaks, and compete on town leaderboards. Rewards for active participation.', icon: TrophyIcon, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' },
    ];

    return (
        <div className="fade-in">
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="relative">
                    <h1 className="text-3xl font-bold text-white mb-3">Features Overview</h1>
                    <p className="text-green-100 max-w-2xl">Everything Eco City has to offer — from AI-powered intelligence to community support and educational tools.</p>
                </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
                {features.map(f => (
                    <div key={f.title} className="card">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${f.color}`}>
                            <f.icon size={20} />
                        </div>
                        <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                        <p className="text-xs text-text-light">{f.desc}</p>
                    </div>
                ))}
            </div>
            <p className="text-center text-xs text-text-light mt-8 opacity-50">
                Built by Kurt van Kradenburg, Anjanette Venter, Ninke Hough & Ryan Cronje
            </p>
        </div>
    );
}
