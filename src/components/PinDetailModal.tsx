import React, { useState } from 'react';
import { PinItem } from '../types';
import { X, Bookmark, Share2, Sparkles } from 'lucide-react';

interface PinDetailModalProps {
  pin: PinItem | null;
  onClose: () => void;
  onOpenAuth: () => void;
  croInspectorMode: boolean;
}

export const PinDetailModal: React.FC<PinDetailModalProps> = ({
  pin,
  onClose,
  onOpenAuth,
  croInspectorMode
}) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  if (!pin) return null;

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      setTimeout(() => {
        onOpenAuth();
      }, 600);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-sm transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pin Image */}
        <div className="md:w-1/2 bg-slate-900 flex items-center justify-center relative overflow-hidden">
          <img
            src={pin.imageUrl}
            alt={pin.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover max-h-[450px] md:max-h-none"
          />
        </div>

        {/* Pin Details & Actions */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Top Bar on Pin Card */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 rounded-full border transition-all ${
                    isLiked
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Gostar"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  title="Partilhar"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleSave}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                  isSaved
                    ? 'bg-slate-900 text-white'
                    : 'bg-[#E60023] hover:bg-[#b0001a] text-white hover:scale-102'
                }`}
              >
                <Bookmark className="w-4 h-4 fill-current" />
                <span>{isSaved ? 'Guardado na sua pasta' : 'Guardar Ideia'}</span>
              </button>
            </div>

            {/* Pin Title & Author */}
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
              {pin.title}
            </h2>

            <div className="mt-4 flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">
                {pin.author.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{pin.author}</p>
                <p className="text-[11px] text-slate-500 font-mono">
                  {pin.savesCount} pessoas guardaram esta ideia
                </p>
              </div>
            </div>

            {/* Tags & Context */}
            <div className="mt-4 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Categoria
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-slate-700 font-medium">#{pin.tag}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-700 font-medium">#InspiraçãoPortugal</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-700 font-medium">#Inspira</span>
              </div>
            </div>

            {/* CRO Inspector Callout */}
            {croInspectorMode && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <span className="font-bold">Gatilho de Conversão:</span> O botão "Guardar" é a ação de menor atrito para converter um visitante desconhecido num utilizador registado através do Endowment Effect.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Quer ver mais ideias como esta?
            </span>
            <button
              onClick={onOpenAuth}
              className="text-xs font-bold text-[#E60023] hover:underline"
            >
              Criar conta grátis →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
