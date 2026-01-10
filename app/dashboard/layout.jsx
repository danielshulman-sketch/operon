'use client';

import { useState, useEffect } from 'react';
import DashboardSidebar from '../components/DashboardSidebar';
import dynamic from 'next/dynamic';
import { Menu } from 'lucide-react';
import { WalkthroughProvider } from '../components/WalkthroughProvider';
import Walkthrough from '../components/Walkthrough';
import { walkthroughs } from '@/utils/walkthroughs';
import { useWalkthrough } from '../components/WalkthroughProvider';

const HelpCenterButton = dynamic(() => import('../components/HelpCenterButton'), {
    ssr: false,
});

function DashboardContent({ children, isSidebarOpen, setIsSidebarOpen }) {
    const { startWalkthrough, isWalkthroughCompleted } = useWalkthrough();

    useEffect(() => {
        // Check if this is the first time user is seeing the dashboard
        const needsIntro = localStorage.getItem('operon_needs_intro');
        const hasSeenIntro = localStorage.getItem('operon_has_seen_intro');

        if (!hasSeenIntro && needsIntro) {
            // Delay walkthrough start slightly to allow UI to render
            setTimeout(() => {
                startWalkthrough(walkthroughs.firstLogin);
            }, 500);
        }
    }, [startWalkthrough]);

    return (
        <>
            {isSidebarOpen && (
                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    aria-label="Close navigation"
                />
            )}
            <div className="lg:ml-64">
                <div className="lg:hidden px-6 pt-6">
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white"
                        aria-label="Open navigation"
                    >
                        <Menu className="h-4 w-4" />
                        Menu
                    </button>
                </div>
                <main className="min-h-screen px-6 lg:px-10 py-8">
                    {children}
                </main>
                <HelpCenterButton />
            </div>
            <Walkthrough />
        </>
    );
}

export default function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <WalkthroughProvider>
            <div className="min-h-screen bg-[#050c1b] text-white">
                <DashboardSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
                <DashboardContent
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                >
                    {children}
                </DashboardContent>
            </div>
        </WalkthroughProvider>
    );
}
