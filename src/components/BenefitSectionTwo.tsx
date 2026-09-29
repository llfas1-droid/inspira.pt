import React, { useState } from 'react';
import { Eye, Hammer, Sparkles, ShoppingBag, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { PinItem } from '../types';

interface BenefitSectionTwoProps {
  onSelectPin: (pin: PinItem) => void;
  onOpenAuth: () => void;
  croInspectorMode: boolean;
}

interface ActionStage {
  id: string;
  verb: string;
  verbEn: string;
  icon: React.ElementType;
  headline: string;
  description: string;
  exampleAction: string;
  conversionRole: string;
  tagColor: string;
}

export const BenefitSectionTwo: React.FC<BenefitSectionTwoProps> = ({
  onSelectPin,
  onOpenAuth,
  croInspectorMode
}) => {
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);

  const stages: ActionStage[] = [
    {
      id: 'veja',
      verb: 'Veja',
      verbEn: 'See it',
      icon: Eye,
      headline: '1. Descoberta e Inspiração Visual Pura',
      description: 'Navegue por um feed visual infinito sem ruído de notícias ou dramas sociais. O foco é 100% no que agrada ao seu olhar.',
      exampleAction: 'Descobre uma massa artesanal fumegante ou um sofá de linho em tons neutros.',
      conversionRole: 'Topo de Funil (Atenção & Desejo Estético)',
      tagColor: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 'faca',
      verb: 'Faça',
      verbEn: 'Make it',
      icon: Hammer,
      headline: '2. Receitas Passo a Passo & Projetos DIY',
      description: 'O Inspiria não guarda apenas fotos bonitas: cada item conecta-se à receita exata, ao molde do vestido ou à lista de ferramentas.',
      exampleAction: 'Acessa a lista de ingredientes (farinha tipo 00, ovos caipiras, manjericão fresco) e modo de preparo.',
      conversionRole: 'Meio de Funil (Consideração Prática)',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'experimente',
      verb: 'Experimente',
      verbEn: 'Try it',
      icon: Sparkles,
      headline: '3. Aplicação na Sua Vida Real',
      description: 'Incentivo à experimentação caseira: partilhe a foto da sua criação, adicione notas pessoais e valide o resultado.',
      exampleAction: 'Cozinha a receita para os amigos no sábado e adiciona a sua foto com avaliação de 5 estrelas.',
      conversionRole: 'Fidelização & Hábito Comportamental',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'compre',
      verb: 'Compre',
      verbEn: 'Buy it',
      icon: ShoppingBag,
      headline: '4. Comércio Curado Sem Fricção',
      description: 'Compre os produtos diretamente dos criadores e lojas parceiras. A compra surge como o desfecho natural da inspiração.',
      exampleAction: 'Adquire a máquina de massas italiana e azeite trufado recomendados na receita.',
      conversionRole: 'Fundo de Funil & Social Commerce',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  ];

  const currentStage = stages[activeStageIdx];

  return (
    <section className="py-24 bg-[#FEF5EE] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CRO Inspector Badge */}
        {croInspectorMode && (
          <div className="max-w-xl mx-auto mb-6 p-3 bg-white/95 border border-amber-300 rounded-2xl text-xs shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-amber-950 mb-1">
              <Info className="w-3.5 h-3.5 text-amber-700" />
              <span>Diagnóstico de Copy: Clímax Tetrádico Imperativo</span>
            </div>
            <p className="text-amber-900">
              A cadência <em>"Veja, faça, experimente, compre"</em> é uma progressão de 4 verbos no imperativo que converte curiosidade passiva em intenção comercial concreta.
            </p>
          </div>
        )}

        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#7E3B09] tracking-tight leading-tight">
            Veja, faça, experimente, compre.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#B85D19] font-medium max-w-2xl mx-auto">
            As melhores ideias da internet estão no Inspiria.
          </p>
        </div>

        {/* 4 Interactive Verb Selector Buttons */}
        <div className="max-w-2xl mx-auto flex items-center justify-center gap-2 sm:gap-3 p-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-amber-200 shadow-sm mb-12">
          {stages.map((stg, idx) => {
            const Icon = stg.icon;
            const isActive = activeStageIdx === idx;
            return (
              <button
                key={stg.id}
                onClick={() => setActiveStageIdx(idx)}
                className={`flex-1 py-2.5 px-3 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  isActive
                    ? 'bg-[#B85D19] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{stg.verb}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Action Stage Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Visual simulation of this action stage */}
            <div className="md:col-span-6 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-inner relative">
                <img
                  src={
                    activeStageIdx === 0
                      ? '/src/assets/images/pinterest_dinner_pasta_1790688471965.jpg'
                      : activeStageIdx === 1
                      ? '/src/assets/images/pinterest_home_decor_1790688484395.jpg'
                      : activeStageIdx === 2
                      ? '/src/assets/images/pinterest_diy_craft_1790688510397.jpg'
                      : '/src/assets/images/pinterest_autumn_outfit_1790688498462.jpg'
                  }
                  alt={currentStage.headline}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Simulated Floating Tooltip */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-[11px] mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Etapa ativa: {currentStage.verb} ({currentStage.verbEn})</span>
                  </div>
                  <p className="text-slate-800 font-semibold">{currentStage.exampleAction}</p>
                </div>
              </div>
            </div>

            {/* Stage Explanation & Copywriting Teardown */}
            <div className="md:col-span-6 space-y-4">
              <div className="inline-block">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${currentStage.tagColor}`}>
                  {currentStage.conversionRole}
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 leading-snug">
                {currentStage.headline}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {currentStage.description}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    if (activeStageIdx < stages.length - 1) {
                      setActiveStageIdx(activeStageIdx + 1);
                    } else {
                      onOpenAuth();
                    }
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <span>
                    {activeStageIdx < stages.length - 1
                      ? `Avançar para "${stages[activeStageIdx + 1].verb}"`
                      : 'Experimentar Agora'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2.5 bg-[#E60023] hover:bg-[#c9001f] text-white rounded-full text-xs font-bold transition-all"
                >
                  Criar conta grátis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
