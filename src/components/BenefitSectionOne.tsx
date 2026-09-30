import React, { useState } from 'react';
import { Bookmark, FolderPlus, Check, Sparkles, Folder, ArrowRight } from 'lucide-react';
import { HERO_CATEGORIES } from '../data/teardownData';
import { PinItem } from '../types';

interface BenefitSectionOneProps {
  onSelectPin: (pin: PinItem) => void;
  onOpenAuth: () => void;
  croInspectorMode: boolean;
}

interface Board {
  id: string;
  name: string;
  count: number;
  coverImage: string;
  tag: string;
  pins: PinItem[];
}

export const BenefitSectionOne: React.FC<BenefitSectionOneProps> = ({
  onSelectPin,
  onOpenAuth,
  croInspectorMode
}) => {
  const initialBoards: Board[] = [
    {
      id: 'b1',
      name: 'Jantares de Sexta-Feira',
      count: 24,
      coverImage: '/src/assets/images/pinterest_dinner_pasta_1790688471965.jpg',
      tag: 'Gastronomia',
      pins: HERO_CATEGORIES[0].pins
    },
    {
      id: 'b2',
      name: 'Casa dos Sonhos: Sala & Luz',
      count: 48,
      coverImage: '/src/assets/images/pinterest_home_decor_1790688484395.jpg',
      tag: 'Decoração',
      pins: HERO_CATEGORIES[1].pins
    },
    {
      id: 'b3',
      name: 'Guarda-Roupa Cápsula Outono',
      count: 36,
      coverImage: '/src/assets/images/pinterest_autumn_outfit_1790688498462.jpg',
      tag: 'Moda',
      pins: HERO_CATEGORIES[2].pins
    },
    {
      id: 'b4',
      name: 'Oficina & Cerâmica Manual',
      count: 19,
      coverImage: '/src/assets/images/pinterest_diy_craft_1790688510397.jpg',
      tag: 'Bricolage',
      pins: HERO_CATEGORIES[3].pins
    }
  ];

  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [activeBoardId, setActiveBoardId] = useState<string>('b1');
  const [newBoardName, setNewBoardName] = useState<string>('');
  const [isCreatingBoard, setIsCreatingBoard] = useState<boolean>(false);

  const selectedBoard = boards.find((b) => b.id === activeBoardId) || boards[0];

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    const newBoard: Board = {
      id: `b-${Date.now()}`,
      name: newBoardName.trim(),
      count: 1,
      coverImage: selectedBoard.coverImage,
      tag: 'Personalizada',
      pins: [selectedBoard.pins[0]]
    };
    setBoards([newBoard, ...boards]);
    setActiveBoardId(newBoard.id);
    setNewBoardName('');
    setIsCreatingBoard(false);
  };

  return (
    <section id="section-benefit-1" className="py-24 bg-[#E8F7F7] relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CRO Inspector Badge */}
        {croInspectorMode && (
          <div className="max-w-xl mx-auto mb-6 p-3 bg-white/90 border border-emerald-300 rounded-2xl text-xs shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gatilho Psicológico: Loss Aversion & Endowment Effect</span>
            </div>
            <p className="text-emerald-800">
              O texto <em>"para voltar a vê-las mais tarde"</em> resolve a ansiedade de perder links ou esquecer ideias salvas aleatoriamente no telemóvel.
            </p>
          </div>
        )}

        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#094B4D] tracking-tight leading-tight">
            Guarde as ideias de que gosta.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#0F7173] font-medium max-w-2xl mx-auto">
            Colecione as suas imagens favoritas para voltar a vê-las mais tarde.
          </p>
        </div>

        {/* Interactive Board Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Board Navigation & Organizer */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#0F7173]/20">
              <span className="text-xs font-bold uppercase tracking-wider text-[#094B4D]">
                Suas Pastas Salvas (Simulação)
              </span>
              <button
                onClick={() => setIsCreatingBoard(!isCreatingBoard)}
                className="text-xs font-semibold text-[#094B4D] hover:text-[#0F7173] flex items-center gap-1 bg-white/80 px-2.5 py-1 rounded-full shadow-xs"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>{isCreatingBoard ? 'Fechar' : 'Nova Pasta'}</span>
              </button>
            </div>

            {/* Inline Board Creator */}
            {isCreatingBoard && (
              <form onSubmit={handleCreateBoard} className="bg-white p-3 rounded-2xl shadow-sm border border-emerald-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome da nova pasta:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    placeholder="ex: Viagem a Sintra, Jardim de Ervas..."
                    className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F7173]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#094B4D] text-white text-xs font-bold rounded-lg hover:bg-[#0F7173] whitespace-nowrap"
                  >
                    Criar
                  </button>
                </div>
              </form>
            )}

            {/* Board List */}
            <div className="space-y-2.5">
              {boards.map((board) => {
                const isActive = board.id === activeBoardId;
                return (
                  <button
                    key={board.id}
                    onClick={() => setActiveBoardId(board.id)}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-white shadow-md ring-2 ring-[#0F7173]'
                        : 'bg-white/60 hover:bg-white/90 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-200 shrink-0">
                        <img
                          src={board.coverImage}
                          alt={board.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                          {board.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{board.tag}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{board.count} ideias</span>
                        </div>
                      </div>
                    </div>

                    <div className={`p-1.5 rounded-full ${isActive ? 'bg-[#0F7173] text-white' : 'text-slate-400'}`}>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenAuth}
                className="w-full py-3 bg-[#E60023] hover:bg-[#c9001f] text-white text-xs sm:text-sm font-bold rounded-full shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2"
              >
                <Bookmark className="w-4 h-4 fill-current" />
                <span>Explorar e Guardar Ideias no Inspira</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Preview of the Selected Board */}
          <div className="lg:col-span-7">
            <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Pasta Ativa
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {selectedBoard.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-600">
                    {selectedBoard.count} Ideias Colecionadas
                  </span>
                </div>
              </div>

              {/* Grid of Pins in this board */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedBoard.pins.slice(0, 3).map((pin, i) => (
                  <div
                    key={pin.id + i}
                    onClick={() => onSelectPin(pin)}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[3/4] bg-slate-100 hover:shadow-lg transition-all"
                  >
                    <img
                      src={pin.imageUrl}
                      alt={pin.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-2.5 text-white">
                      <p className="text-xs font-semibold line-clamp-2 leading-tight">
                        {pin.title}
                      </p>
                      <span className="text-[10px] text-white/80 mt-1">
                        {pin.author}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Micro-callout within board preview */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Criada para inspirar o seu próximo projeto pessoal</span>
                <button
                  onClick={onOpenAuth}
                  className="font-bold text-[#E60023] hover:underline"
                >
                  Sincronizar pasta →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
