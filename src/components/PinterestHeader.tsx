import React from 'react';
import {
  Sparkles,
  SlidersHorizontal,
  Layers,
  MessageSquareText,
  HelpCircle,
  ShieldAlert,
  Send,
  Calendar,
} from 'lucide-react';

interface PinterestHeaderProps {
  activeView: 'live' | 'teardown' | 'support' | 'admin' | 'proposta' | 'calendar';
  setActiveView: (
    view: 'live' | 'teardown' | 'support' | 'admin' | 'proposta' | 'calendar'
  ) => void;
  croInspectorMode: boolean;
  setCroInspectorMode: (enabled: boolean) => void;
  onOpenAuth: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  onScrollToPropostaForm: () => void;
}

export const PinterestHeader: React.FC<PinterestHeaderProps> = ({
  activeView,
  setActiveView,
  croInspectorMode,
  setCroInspectorMode,
  onOpenAuth,
  onToggleChat,
  isChatOpen,
  onScrollToPropostaForm,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Brand & Regional Label */}
        <div className="flex items-center gap-6 shrink-0">
          <div
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => setActiveView('live')}
          >
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#E60023] to-[#ff4d6d] flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              I
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-[#E60023]">
                Inspira
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                pt
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold text-slate-700">
            <button
              onClick={() => setActiveView('live')}
              className={`hover:text-[#E60023] transition-colors py-1 ${
                activeView === 'live' ? 'text-[#E60023] border-b-2 border-[#E60023]' : ''
              }`}
            >
              Página Inspira
            </button>
            <button
              onClick={() => {
                setActiveView('live');
                setTimeout(onScrollToPropostaForm, 100);
              }}
              className="hover:text-[#E60023] transition-colors py-1 text-slate-700 font-semibold"
            >
              Pedir Proposta
            </button>
            <button
              onClick={() => setActiveView('teardown')}
              className={`hover:text-[#E60023] transition-colors py-1 ${
                activeView === 'teardown' ? 'text-[#E60023] border-b-2 border-[#E60023]' : ''
              }`}
            >
              Auditoria CRO
            </button>
            <button
              onClick={() => setActiveView('support')}
              className={`hover:text-[#E60023] transition-colors py-1 flex items-center gap-1.5 ${
                activeView === 'support' ? 'text-[#E60023] border-b-2 border-[#E60023]' : ''
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Suporte & FAQ</span>
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`hover:text-[#E60023] transition-colors py-1 flex items-center gap-1.5 ${
                activeView === 'calendar' ? 'text-[#E60023] border-b-2 border-[#E60023]' : ''
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendário</span>
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`hover:text-[#E60023] transition-colors py-1 flex items-center gap-1.5 ${
                activeView === 'admin' ? 'text-[#E60023] border-b-2 border-[#E60023]' : ''
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Administração</span>
            </button>
          </nav>
        </div>

        {/* Zone 2: Mode Selector Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-full text-xs font-semibold">
            <button
              onClick={() => setActiveView('live')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeView === 'live'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Página</span>
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeView === 'calendar'
                  ? 'bg-white text-[#E60023] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Agenda</span>
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                activeView === 'admin'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Admin</span>
            </button>
          </div>

          {activeView === 'live' && (
            <button
              onClick={() => setCroInspectorMode(!croInspectorMode)}
              className={`hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                croInspectorMode
                  ? 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-400/20'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
              <span>{croInspectorMode ? 'Raio-X CRO Ativo' : 'Ativar Raio-X'}</span>
            </button>
          )}

          {/* Quick proposal jump button */}
          <button
            onClick={() => {
              if (activeView !== 'live') setActiveView('live');
              setTimeout(onScrollToPropostaForm, 100);
            }}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-rose-50 text-[#E60023] border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            <Send className="w-3 h-3" />
            <span>Pedir Proposta</span>
          </button>
        </div>

        {/* Zone 3: Primary Actions (Entrar / Criar conta) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAuth}
            className="text-xs sm:text-sm font-bold text-slate-800 hover:text-slate-900 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors hidden sm:block"
          >
            Entrar
          </button>
          <button
            onClick={() => {
              if (activeView !== 'live') setActiveView('live');
              setTimeout(onScrollToPropostaForm, 100);
            }}
            className="text-xs sm:text-sm font-bold text-white bg-[#E60023] hover:bg-[#c9001f] px-3.5 sm:px-4 py-2 rounded-full shadow-sm transition-all hover:scale-102 active:scale-98"
          >
            Pedir Proposta
          </button>
        </div>
      </div>
    </header>
  );
};
