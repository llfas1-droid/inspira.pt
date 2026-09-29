/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PinterestHeader } from './components/PinterestHeader';
import { DynamicHero } from './components/DynamicHero';
import { BenefitSectionOne } from './components/BenefitSectionOne';
import { BenefitSectionTwo } from './components/BenefitSectionTwo';
import { AuthModal } from './components/AuthModal';
import { PinDetailModal } from './components/PinDetailModal';
import { TeardownInspector } from './components/TeardownInspector';
import { SupportAndFAQ } from './components/SupportAndFAQ';
import { PinterestFooter } from './components/PinterestFooter';
import { InspiriaChatbot } from './components/InspiriaChatbot';
import { PinItem } from './types';
import { SlidersHorizontal, MessageSquareText } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'live' | 'teardown' | 'support'>('live');
  const [croInspectorMode, setCroInspectorMode] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [selectedPin, setSelectedPin] = useState<PinItem | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasTriggeredScrollWall, setHasTriggeredScrollWall] = useState<boolean>(false);

  // Scroll listener to simulate Inspiria's "Scroll-to-Wall" acquisition trigger
  useEffect(() => {
    if (activeView !== 'live' || hasTriggeredScrollWall || userEmail) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;

      // Trigger the auth modal when user scrolls through ~90% of screen height
      if (scrollPos > windowHeight * 0.9 && !hasTriggeredScrollWall) {
        setHasTriggeredScrollWall(true);
        setAuthModalOpen(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeView, hasTriggeredScrollWall, userEmail]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Top Header */}
      <PinterestHeader
        activeView={activeView}
        setActiveView={setActiveView}
        croInspectorMode={croInspectorMode}
        setCroInspectorMode={setCroInspectorMode}
        onOpenAuth={() => setAuthModalOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'live' && (
          <>
            {/* Live Landing Page Sections */}
            <DynamicHero
              onSelectPin={(pin) => setSelectedPin(pin)}
              onOpenAuth={() => setAuthModalOpen(true)}
              croInspectorMode={croInspectorMode}
            />

            <BenefitSectionOne
              onSelectPin={(pin) => setSelectedPin(pin)}
              onOpenAuth={() => setAuthModalOpen(true)}
              croInspectorMode={croInspectorMode}
            />

            <BenefitSectionTwo
              onSelectPin={(pin) => setSelectedPin(pin)}
              onOpenAuth={() => setAuthModalOpen(true)}
              croInspectorMode={croInspectorMode}
            />

            {/* Bottom Sticky Acquisition Bar on Scroll */}
            <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 shadow-lg transition-all">
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#E60023] to-[#ff4d6d] flex items-center justify-center text-white font-black text-sm shrink-0">
                    I
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span className="font-extrabold text-slate-900 block sm:inline">
                      Bem-vindo(a) ao Inspiria.{' '}
                    </span>
                    <span className="text-slate-500">
                      Encontre novas ideias para experimentar.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="hidden sm:flex text-xs font-bold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors items-center gap-1.5"
                  >
                    <MessageSquareText className="w-3.5 h-3.5 text-[#E60023]" />
                    <span>Inspiria Copilot</span>
                  </button>
                  <button
                    onClick={() => setActiveView('support')}
                    className="hidden lg:flex text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    Suporte & FAQ
                  </button>
                  <button
                    onClick={() => setActiveView('teardown')}
                    className="hidden md:flex text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    Ver Teardown CRO
                  </button>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="text-xs sm:text-sm font-bold text-white bg-[#E60023] hover:bg-[#c9001f] px-5 py-2.5 rounded-full shadow-md transition-all hover:scale-102"
                  >
                    Continuar com o Google
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeView === 'teardown' && (
          <TeardownInspector
            onBackToLive={() => setActiveView('live')}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}

        {activeView === 'support' && (
          <SupportAndFAQ
            onBackToLive={() => setActiveView('live')}
            onOpenChat={() => setIsChatOpen(true)}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Pin Detail Inspection Modal */}
      <PinDetailModal
        pin={selectedPin}
        onClose={() => setSelectedPin(null)}
        onOpenAuth={() => {
          setSelectedPin(null);
          setAuthModalOpen(true);
        }}
        croInspectorMode={croInspectorMode}
      />

      {/* Acquisition Wall Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(email) => {
          setUserEmail(email);
        }}
      />

      {/* Inspiria Intelligent Copilot Chatbot */}
      <InspiriaChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Floating Bottom Quick Action Pills */}
      <div className="fixed bottom-16 right-4 sm:bottom-20 sm:right-6 z-40 flex flex-col items-end gap-2.5">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="px-4 py-2.5 rounded-full shadow-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 border border-slate-700 transition-all hover:scale-105 active:scale-95"
        >
          <MessageSquareText className="w-4 h-4 text-rose-400" />
          <span>{isChatOpen ? 'Minimizar Chat' : 'Inspiria Copilot'}</span>
        </button>

        {activeView === 'live' && (
          <button
            onClick={() => setCroInspectorMode(!croInspectorMode)}
            className={`px-4 py-2 rounded-full shadow-md text-xs font-bold flex items-center gap-2 border transition-all ${
              croInspectorMode
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-300 ring-2 ring-amber-400/30'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-950" />
            <span>{croInspectorMode ? 'Raio-X CRO Ligado' : 'Ligar Raio-X CRO'}</span>
          </button>
        )}
      </div>

      {/* Global Footer */}
      <PinterestFooter
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenTeardown={() => {
          setActiveView('teardown');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupport={() => {
          setActiveView('support');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
