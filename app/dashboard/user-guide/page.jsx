'use client';

import { useState } from 'react';
import Image from 'next/image';
import { guideData } from './data';
import { BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function UserGuidePage() {
    const [activeTab, setActiveTab] = useState('start');

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <BookOpen className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                        User Guide
                    </h1>
                    <p className="text-white/60 mt-1">
                        Complete documentation for using the Operon platform
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {guideData.tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="grid gap-12">
                {guideData.sections[activeTab].map((section, idx) => (
                    <section
                        key={idx}
                        className="group bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-colors"
                    >
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-semibold text-white mb-3 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm border border-white/10">
                                            {idx + 1}
                                        </span>
                                        {section.title}
                                    </h2>
                                    <p className="text-lg text-white/70 leading-relaxed">
                                        {section.description}
                                    </p>
                                </div>

                                <ul className="space-y-4">
                                    {section.steps.map((step, sIdx) => {
                                        // Simple markdown parsing for bold text
                                        const parts = step.split(/(\*\*.*?\*\*)/g);
                                        return (
                                            <li key={sIdx} className="flex gap-3 text-white/80">
                                                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                                <span className="leading-relaxed">
                                                    {parts.map((part, pIdx) => {
                                                        if (part.startsWith('**') && part.endsWith('**')) {
                                                            return <strong key={pIdx} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
                                                        }
                                                        return part;
                                                    })}
                                                </span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {section.image && (
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40 group-hover:scale-[1.02] transition-transform duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                                    <Image
                                        src={section.image}
                                        alt={section.title}
                                        width={800}
                                        height={600}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </section>
                ))}
            </div>

            {/* Footer */}
            <div className="pt-12 border-t border-white/10 text-center text-white/40 text-sm">
                <p>Still need help? Use the AI assistant in the bottom right corner.</p>
            </div>
        </div>
    );
}
