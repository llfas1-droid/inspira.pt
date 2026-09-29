import React, { useState } from 'react';
import { X, Check, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCroNotes, setShowCroNotes] = useState<boolean>(true);
  const [successMode, setSuccessMode] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSimulatedSubmit = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMode(true);
      setTimeout(() => {
        onLoginSuccess(email || `${provider.toLowerCase()}@utilizador.pt`);
        onClose();
        setSuccessMode(false);
      }, 1500);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center overflow-hidden border border-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {successMode ? (
          <div className="py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Bem-vindo(a) ao Inspiria!
            </h3>
            <p className="text-xs text-slate-500">
              Conta conectada com sucesso. A carregar o seu feed personalizado...
            </p>
          </div>
        ) : (
          <>
            {/* Inspiria Logo */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E60023] to-[#ff4d6d] flex items-center justify-center text-white font-black text-2xl mx-auto shadow-md mb-4">
              I
            </div>

            {/* Presumptive Close Headline */}
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Bem-vindo(a) ao Inspiria
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Encontre novas ideias para experimentar.
            </p>

            {/* CRO Micro-Copy Highlight Banner */}
            {showCroNotes && (
              <div className="my-4 p-3 bg-rose-50/90 border border-rose-200 rounded-xl text-left text-xs text-rose-900">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#E60023]" />
                  <span>Psicologia do "Continuar" vs "Registe-se"</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  "Continuar" transmite que você já começou a explorar e só falta 1 passo para destravar as ideias. "Registe-se" gera fricção mental de formulário.
                </p>
              </div>
            )}

            {/* Form & SSO Actions */}
            <div className="mt-5 space-y-3">
              {/* Google SSO */}
              <button
                onClick={() => handleSimulatedSubmit('Google')}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold flex items-center justify-center gap-3 transition-all hover:shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continuar com o Google</span>
              </button>

              {/* Facebook SSO */}
              <button
                onClick={() => handleSimulatedSubmit('Facebook')}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-3 transition-all hover:shadow-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Continuar com o Facebook</span>
              </button>

              {/* Or separator */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-semibold uppercase">ou</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Email Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSimulatedSubmit('Email');
                }}
                className="space-y-2 text-left"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="O seu e-mail"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Palavra-passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crie uma palavra-passe"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#E60023] hover:bg-[#c9001f] text-white text-xs sm:text-sm font-bold rounded-full shadow-md transition-all mt-2"
                >
                  {isLoading ? 'A processar...' : 'Continuar'}
                </button>
              </form>
            </div>

            {/* Legal / Micro-copy Disclaimer */}
            <p className="mt-4 text-[10px] text-slate-400 leading-tight">
              Ao continuar, aceita os Termos de Serviço do Inspiria e confirma que leu a nossa Política de Privacidade.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
