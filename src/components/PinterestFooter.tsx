import React from 'react';

interface PinterestFooterProps {
  onOpenAuth: () => void;
  onOpenTeardown: () => void;
  onOpenSupport: () => void;
}

export const PinterestFooter: React.FC<PinterestFooterProps> = ({
  onOpenAuth,
  onOpenTeardown,
  onOpenSupport,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-12 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Region */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-2xl bg-gradient-to-tr from-[#E60023] to-[#ff4d6d] flex items-center justify-center text-white font-extrabold text-xs">
            I
          </div>
          <span className="font-bold text-slate-900">Inspiria Portugal</span>
          <span className="text-slate-300">·</span>
          <span>pt.inspiria.com</span>
        </div>

        {/* Quiet Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-600 font-medium">
          <button onClick={onOpenSupport} className="hover:text-[#E60023] transition-colors font-bold text-slate-800">
            Suporte & FAQ
          </button>
          <button onClick={onOpenTeardown} className="hover:text-slate-900 transition-colors">
            Relatório de Copywriting & CRO
          </button>
          <button onClick={onOpenAuth} className="hover:text-slate-900 transition-colors">
            Termos de Serviço
          </button>
          <button onClick={onOpenAuth} className="hover:text-slate-900 transition-colors">
            Política de Privacidade
          </button>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="text-slate-400 text-[11px] text-center md:text-right">
          © {new Date().getFullYear()} Inspiria · Estudo de Caso CRO, Descoberta Visual & Apoio ao Utilizador
        </div>
      </div>
    </footer>
  );
};
