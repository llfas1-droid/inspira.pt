import React, { useState, useEffect } from 'react';
import { HERO_CATEGORIES } from '../data/teardownData';
import { DynamicCategory, PinItem } from '../types';
import { Bookmark, Sparkles, ChevronDown, Eye, Info, Check } from 'lucide-react';

interface DynamicHeroProps {
  onSelectPin: (pin: PinItem) => void;
  onOpenAuth: () => void;
  croInspectorMode: boolean;
}

export const DynamicHero: React.FC<DynamicHeroProps> = ({
  onSelectPin,
  onOpenAuth,
  croInspectorMode
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [customPhrase, setCustomPhrase] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [savedPins, setSavedPins] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeCategory: DynamicCategory = HERO_CATEGORIES[currentIdx];

  // Auto-cycle categories every 5 seconds unless user is interacting with custom input
  useEffect(() => {
    if (isCustomMode) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % HERO_CATEGORIES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isCustomMode]);

  const handleSavePin = (e: React.MouseEvent, pin: PinItem) => {
    e.stopPropagation();
    const newSet = new Set(savedPins);
    if (newSet.has(pin.id)) {
      newSet.delete(pin.id);
    } else {
      newSet.add(pin.id);
      setToastMessage(`"${pin.title.slice(0, 32)}..." guardado!`);
      setTimeout(() => setToastMessage(null), 3500);
      // Trigger conversion wall prompt
      setTimeout(() => {
        onOpenAuth();
      }, 700);
    }
    setSavedPins(newSet);
  };

  const currentDisplayPhrase = isCustomMode && customPhrase.trim()
    ? customPhrase
    : activeCategory.phrase;

  return (
    <section className="relative pt-8 pb-16 overflow-hidden bg-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Dynamic Headline */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-8 relative">
        {croInspectorMode && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/90 text-amber-900 text-xs font-semibold rounded-full mb-3 border border-amber-300">
            <Info className="w-3.5 h-3.5 text-amber-700" />
            <span>CRO Insight: Dynamic Keyword Insertion Formula</span>
          </div>
        )}

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          <span>Encontre a sua próxima</span>
          <br />
          <span
            className="transition-colors duration-500 inline-block font-extrabold pb-1"
            style={{ color: isCustomMode ? '#E60023' : activeCategory.color }}
          >
            {currentDisplayPhrase}
          </span>
        </h1>

        <p className="mt-3 text-slate-500 text-sm sm:text-base max-w-xl mx-auto font-normal">
          Milhões de ideias visuais para inspirar a sua rotina, o seu lar e o seu estilo.
        </p>

        {/* Dynamic Category Dots & Selector */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {HERO_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => {
                setIsCustomMode(false);
                setCurrentIdx(idx);
              }}
              className={`transition-all rounded-full ${
                !isCustomMode && currentIdx === idx
                  ? 'w-8 h-3.5 shadow-sm'
                  : 'w-3.5 h-3.5 opacity-40 hover:opacity-80'
              }`}
              style={{
                backgroundColor: !isCustomMode && currentIdx === idx ? cat.color : '#94a3b8'
              }}
              title={cat.phrase}
              aria-label={`Selecionar ${cat.phrase}`}
            />
          ))}

          {/* Custom formula tester button */}
          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className={`text-xs px-3 py-1 rounded-full border transition-all ml-2 font-medium ${
              isCustomMode
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isCustomMode ? 'Modo Normal' : 'Testar Minha Frase'}
          </button>
        </div>

        {/* Interactive Formula Playground when toggled */}
        {isCustomMode && (
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto text-left shadow-sm">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Simulador de Desejo de Nicho (Fórmula Pinterest):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPhrase}
                onChange={(e) => setCustomPhrase(e.target.value)}
                placeholder="ex: viagem aos Açores, bolo de aniversário..."
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E60023]"
              />
              <button
                onClick={() => setCustomPhrase('')}
                className="text-xs px-2 py-1 text-slate-500 hover:text-slate-800"
              >
                Limpar
              </button>
            </div>
          </div>
        )}

        {/* CRO Inspector Annotation Overlay for Hero */}
        {croInspectorMode && (
          <div className="mt-5 p-4 bg-amber-50/90 border border-amber-200 rounded-2xl text-left text-xs max-w-2xl mx-auto shadow-sm">
            <div className="flex items-center gap-2 font-bold text-amber-950 mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Diagnóstico de Copywriting & Psicologia (Seção 1)</span>
            </div>
            <p className="text-amber-900 mb-2">
              <strong>Future Pacing:</strong> O uso de <em>"próxima"</em> cria o pressuposto subconsciente de que a descoberta é um fluxo contínuo na vida do utilizador.
            </p>
            <p className="text-amber-900 mb-1">
              <strong>Inserção Dinâmica:</strong> Em vez de dizer <em>"O motor de busca visual"</em> (centrado na empresa), o Pinterest diz <em>"A sua próxima refeição/decoração"</em> (centrado 100% no leitor).
            </p>
          </div>
        )}
      </div>

      {/* Masonry Pin Wall (5 Columns) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 items-start">
          {/* Column 1 */}
          <div className="space-y-4 animate-float-up">
            <PinCard
              pin={activeCategory.pins[0]}
              onSelect={() => onSelectPin(activeCategory.pins[0])}
              onSave={(e) => handleSavePin(e, activeCategory.pins[0])}
              isSaved={savedPins.has(activeCategory.pins[0].id)}
            />
            <PinCard
              pin={activeCategory.pins[1]}
              onSelect={() => onSelectPin(activeCategory.pins[1])}
              onSave={(e) => handleSavePin(e, activeCategory.pins[1])}
              isSaved={savedPins.has(activeCategory.pins[1].id)}
            />
          </div>

          {/* Column 2 */}
          <div className="space-y-4 animate-float-down pt-6">
            <PinCard
              pin={activeCategory.pins[2]}
              onSelect={() => onSelectPin(activeCategory.pins[2])}
              onSave={(e) => handleSavePin(e, activeCategory.pins[2])}
              isSaved={savedPins.has(activeCategory.pins[2].id)}
            />
            <PinCard
              pin={activeCategory.pins[3]}
              onSelect={() => onSelectPin(activeCategory.pins[3])}
              onSave={(e) => handleSavePin(e, activeCategory.pins[3])}
              isSaved={savedPins.has(activeCategory.pins[3].id)}
            />
          </div>

          {/* Column 3 (Focal Center) */}
          <div className="space-y-4 animate-float-up pt-2">
            <PinCard
              pin={activeCategory.pins[4]}
              onSelect={() => onSelectPin(activeCategory.pins[4])}
              onSave={(e) => handleSavePin(e, activeCategory.pins[4])}
              isSaved={savedPins.has(activeCategory.pins[4].id)}
              isMarquee
            />
            <PinCard
              pin={activeCategory.pins[0]}
              onSelect={() => onSelectPin(activeCategory.pins[0])}
              onSave={(e) => handleSavePin(e, activeCategory.pins[0])}
              isSaved={savedPins.has(activeCategory.pins[0].id)}
            />
          </div>

          {/* Column 4 */}
          <div className="space-y-4 animate-float-down pt-8 hidden sm:block">
            <PinCard
              pin={activeCategory.pins[1]}
              onSelect={() => onSelectPin(activeCategory.pins[1])}
              onSave={(e) => handleSavePin(e, activeCategory.pins[1])}
              isSaved={savedPins.has(activeCategory.pins[1].id)}
            />
            <PinCard
              pin={activeCategory.pins[2]}
              onSelect={() => onSelectPin(activeCategory.pins[2])}
              onSave={(e) => handleSavePin(e, activeCategory.pins[2])}
              isSaved={savedPins.has(activeCategory.pins[2].id)}
            />
          </div>

          {/* Column 5 */}
          <div className="space-y-4 animate-float-up pt-4 hidden md:block">
            <PinCard
              pin={activeCategory.pins[3]}
              onSelect={() => onSelectPin(activeCategory.pins[3])}
              onSave={(e) => handleSavePin(e, activeCategory.pins[3])}
              isSaved={savedPins.has(activeCategory.pins[3].id)}
            />
            <PinCard
              pin={activeCategory.pins[4]}
              onSelect={() => onSelectPin(activeCategory.pins[4])}
              onSave={(e) => handleSavePin(e, activeCategory.pins[4])}
              isSaved={savedPins.has(activeCategory.pins[4].id)}
            />
          </div>
        </div>

        {/* Zeigarnik Effect Indicator & Subtle Scroll Prompt */}
        <div className="mt-12 text-center relative">
          {croInspectorMode && (
            <div className="inline-block p-2 px-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded-full shadow-sm mb-3">
              <span className="font-bold">Efeito Zeigarnik (Linha de Corte da Dobra):</span> Imagens cortadas abaixo compelem o leitor a rolar a página.
            </div>
          )}

          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => {
                const el = document.getElementById('section-benefit-1');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-3 rounded-full bg-white hover:bg-slate-100 text-slate-700 shadow-md border border-slate-200 transition-all hover:scale-105"
              aria-label="Rolar para baixo"
            >
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </button>
            <span className="text-xs text-slate-400 mt-2 font-medium">Veja como funciona</span>
          </div>
        </div>
      </div>
    </section>
  );
};

interface PinCardProps {
  pin: PinItem;
  onSelect: () => void;
  onSave: (e: React.MouseEvent) => void;
  isSaved?: boolean;
  isMarquee?: boolean;
}

const PinCard: React.FC<PinCardProps> = ({
  pin,
  onSelect,
  onSave,
  isSaved,
  isMarquee
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative rounded-2xl overflow-hidden bg-slate-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isMarquee ? 'ring-2 ring-slate-900/10' : ''
      }`}
    >
      {/* Pin Image with Fallback */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-200">
        <img
          src={pin.imageUrl}
          alt={pin.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Styled graceful CSS fallback
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Hover Overlay with Action Buttons */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
          <div className="flex justify-end">
            <button
              onClick={onSave}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                isSaved
                  ? 'bg-slate-900 text-white'
                  : 'bg-[#E60023] hover:bg-[#b0001a] text-white hover:scale-105'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
            </button>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2 text-slate-900 text-xs shadow-sm">
            <p className="font-semibold line-clamp-1">{pin.title}</p>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
              <span>{pin.author}</span>
              <span className="font-mono">{pin.savesCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
