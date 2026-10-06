/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PinterestHeader } from './components/PinterestHeader';
import { DynamicHero } from './components/DynamicHero';
import { BenefitSectionOne } from './components/BenefitSectionOne';
import { BenefitSectionTwo } from './components/BenefitSectionTwo';
import { PedidoPropostaForm } from './components/PedidoPropostaForm';
import { PropostaView } from './components/PropostaView';
import { AdminArea } from './components/AdminArea';
import { GoogleCalendarView } from './components/GoogleCalendarView';
import { AuthModal } from './components/AuthModal';
import { PinDetailModal } from './components/PinDetailModal';
import { TeardownInspector } from './components/TeardownInspector';
import { SupportAndFAQ } from './components/SupportAndFAQ';
import { PinterestFooter } from './components/PinterestFooter';
import { InspiriaChatbot } from './components/InspiriaChatbot';
import { PinItem } from './types';
import { SlidersHorizontal, MessageSquareText, FileText, Send } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<
    'live' | 'teardown' | 'support' | 'admin' | 'proposta' | 'calendar'
  >('live');
  const [croInspectorMode, setCroInspectorMode] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [selectedPin, setSelectedPin] = useState<PinItem | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [hasTriggeredScrollWall, setHasTriggeredScrollWall] = useState<boolean>(false);
  const [currentProposalToken, setCurrentProposalToken] = useState<string | null>(null);
  const [prefillCalendarEvent, setPrefillCalendarEvent] = useState<{
    summary?: string;
    description?: string;
    attendeeEmail?: string;
  } | null>(null);

  // Check initial path on load (/proposta/[token], /admin, /calendario)
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/proposta/')) {
      const token = path.replace('/proposta/', '').trim();
      if (token) {
        setCurrentProposalToken(token);
        setActiveView('proposta');
      }
    } else if (path === '/admin') {
      setActiveView('admin');
    } else if (path === '/calendario' || path === '/calendar') {
      setActiveView('calendar');
    }

    const handlePopState = () => {
      const curPath = window.location.pathname;
      if (curPath.startsWith('/proposta/')) {
        const token = curPath.replace('/proposta/', '').trim();
        setCurrentProposalToken(token);
        setActiveView('proposta');
      } else if (curPath === '/admin') {
        setActiveView('admin');
      } else if (curPath === '/calendario' || curPath === '/calendar') {
        setActiveView('calendar');
      } else {
        setActiveView('live');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll listener to simulate Inspiria's "Scroll-to-Wall" acquisition trigger
  useEffect(() => {
    if (activeView !== 'live' || hasTriggeredScrollWall || userEmail) return;

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollPos > windowHeight * 1.5 && !hasTriggeredScrollWall) {
        setHasTriggeredScrollWall(true);
        setAuthModalOpen(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeView, hasTriggeredScrollWall, userEmail]);

  const scrollToPropostaForm = () => {
    const el = document.getElementById('pedido-proposta');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenProposta = (token: string) => {
    setCurrentProposalToken(token);
    setActiveView('proposta');
    window.history.pushState({}, '', `/proposta/${token}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setActiveView('live');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCalendar = (prefill?: {
    summary?: string;
    description?: string;
    attendeeEmail?: string;
  }) => {
    setPrefillCalendarEvent(prefill || null);
    setActiveView('calendar');
    window.history.pushState({}, '', '/calendario');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Top Header (shown on main views) */}
      {activeView !== 'proposta' && (
        <PinterestHeader
          activeView={activeView}
          setActiveView={(view) => {
            setActiveView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            if (view === 'admin') {
              window.history.pushState({}, '', '/admin');
            } else if (view === 'calendar') {
              window.history.pushState({}, '', '/calendario');
            } else if (view === 'teardown') {
              window.history.pushState({}, '', '/teardown');
            } else if (view === 'support') {
              window.history.pushState({}, '', '/suporte');
            } else if (view === 'live') {
              window.history.pushState({}, '', '/');
            }
          }}
          croInspectorMode={croInspectorMode}
          setCroInspectorMode={setCroInspectorMode}
          onOpenAuth={() => setAuthModalOpen(true)}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          isChatOpen={isChatOpen}
          onScrollToPropostaForm={scrollToPropostaForm}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          {activeView === 'live' && (
            <motion.div
              key="live"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
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

              {/* SEÇÃO PRINCIPAL: Pedido de Proposta com Inteligência Artificial */}
              <PedidoPropostaForm onPropostaGerada={handleOpenProposta} />

              {/* Bottom Sticky Acquisition Bar on Scroll */}
              <div className="sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 shadow-lg transition-all">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#E60023] to-[#ff4d6d] flex items-center justify-center text-white font-black text-sm shrink-0">
                      I
                    </div>
                    <div className="text-xs sm:text-sm">
                      <span className="font-extrabold text-slate-900 block sm:inline">
                        Precisa de uma proposta personalizada?{' '}
                      </span>
                      <span className="text-slate-500">
                        Orçamentos inteligentes com base no catálogo oficial.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActiveView('admin')}
                      className="hidden lg:flex text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                      Área Admin
                    </button>
                    <button
                      onClick={scrollToPropostaForm}
                      className="text-xs sm:text-sm font-bold text-white bg-[#E60023] hover:bg-[#c9001f] px-5 py-2.5 rounded-full shadow-md transition-all hover:scale-102 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Pedir Proposta</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* View: Individual Proposal Page */}
          {activeView === 'proposta' && currentProposalToken && (
            <motion.div
              key={`proposta-${currentProposalToken}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <PropostaView
                token={currentProposalToken}
                onBackToHome={handleBackToHome}
                onScheduleMeeting={handleOpenCalendar}
              />
            </motion.div>
          )}

          {/* View: Google Calendar Management */}
          {activeView === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <GoogleCalendarView
                onBackToHome={handleBackToHome}
                prefillEvent={prefillCalendarEvent}
                onClearPrefill={() => setPrefillCalendarEvent(null)}
              />
            </motion.div>
          )}

          {/* View: Protected Admin Area */}
          {activeView === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <AdminArea
                onBackToHome={handleBackToHome}
                onOpenProposta={handleOpenProposta}
                onOpenCalendar={handleOpenCalendar}
              />
            </motion.div>
          )}

          {activeView === 'teardown' && (
            <motion.div
              key="teardown"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <TeardownInspector
                onBackToLive={handleBackToHome}
                onOpenChat={() => setIsChatOpen(true)}
              />
            </motion.div>
          )}

          {activeView === 'support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <SupportAndFAQ
                onBackToLive={handleBackToHome}
                onOpenChat={() => setIsChatOpen(true)}
                onOpenAuth={() => setAuthModalOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
      {activeView === 'live' && (
        <div className="fixed bottom-16 right-4 sm:bottom-20 sm:right-6 z-40 flex flex-col items-end gap-2.5">
          <button
            onClick={scrollToPropostaForm}
            className="px-4 py-2.5 rounded-full shadow-xl bg-[#E60023] hover:bg-[#c9001f] text-white text-xs font-bold flex items-center gap-2 border border-rose-300 transition-all hover:scale-105 active:scale-95"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Pedir Proposta</span>
          </button>

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
        </div>
      )}

      {/* Global Footer (shown on main views) */}
      {activeView !== 'proposta' && (
        <PinterestFooter
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenTeardown={() => {
            setActiveView('teardown');
            window.history.pushState({}, '', '/teardown');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSupport={() => {
            setActiveView('support');
            window.history.pushState({}, '', '/suporte');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
