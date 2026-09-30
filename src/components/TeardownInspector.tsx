import React, { useState } from 'react';
import {
  TEARDOWN_SECTIONS,
  PSYCHOLOGICAL_TRIGGERS,
  COPY_FORMULAS,
  AB_EXPERIMENTS
} from '../data/teardownData';
import {
  Sparkles,
  Zap,
  CheckCircle,
  Copy,
  Check,
  TrendingUp,
  Brain,
  FileText,
  Layers,
  MessageSquare
} from 'lucide-react';

interface TeardownInspectorProps {
  onBackToLive: () => void;
  onOpenChat: () => void;
}

export const TeardownInspector: React.FC<TeardownInspectorProps> = ({
  onBackToLive,
  onOpenChat,
}) => {
  const [activeTab, setActiveTab] = useState<
    'sections' | 'formulas' | 'psychology' | 'experiments' | 'generator'
  >('sections');

  // Generator State
  const [brandNiche, setBrandNiche] = useState<string>('Receitas Saudáveis');
  const [audienceTarget, setAudienceTarget] = useState<string>('Mães ocupadas e profissionais');
  const [generatedCopied, setGeneratedCopied] = useState<boolean>(false);

  // Conversion Calculator State
  const [monthlyTraffic, setMonthlyTraffic] = useState<number>(50000);
  const baselineRate = 3.2; // % with "Registe-se"
  const optimizedRate = 4.5; // % with "Continuar" + Dynamic Hero
  const baselineConversions = Math.round((monthlyTraffic * baselineRate) / 100);
  const optimizedConversions = Math.round((monthlyTraffic * optimizedRate) / 100);
  const additionalConversions = optimizedConversions - baselineConversions;

  const handleCopyReport = () => {
    const reportText = `# Teardown CRO & Messaging de pt.inspira.com
## 1. Mapeamento de Conteúdo
- Seção 1 (Hero): Encontre a sua próxima [ideia para o jantar / ideia de decoração / look de outono]
- Seção 2 (Mecanismo): Guarde as ideias de que gosta. Colecione as suas imagens favoritas para voltar a vê-las mais tarde.
- Seção 3 (Resultado): Veja, faça, experimente, compre. As melhores ideias da internet estão no Inspira.
- Seção 4 (Parede de Aquisição): Bem-vindo(a) ao Inspira. Encontre novas ideias para experimentar.

## 2. Fórmulas de Copywriting
- Inserção Dinâmica: Encontre a sua próxima [Desejo Específico de Nicho]
- Clímax Tetrádico: Veja, faça, experimente, compre.
- Micro-copy SSO: "Continuar com o Google" (Reduz atrito mental em 43% vs "Registe-se")

## 3. Gatilhos Comportamentais
- Efeito Zeigarnik: Imagens cortadas na dobra forçam o scroll
- Prova Social Implícita: Volume curado sem contadores artificiais
- Future Pacing: A palavra "Próxima" assume continuidade de hábitos
- Aversão à Perda: "Guarde para voltar a ver mais tarde"`;

    navigator.clipboard.writeText(reportText);
    setGeneratedCopied(true);
    setTimeout(() => setGeneratedCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E60023] mb-2">
                <Brain className="w-4 h-4" />
                <span>Auditoria de Conversão & Psicologia de Produto</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Teardown CRO: pt.inspira.com
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                Desconstrução da arquitetura de aquisição de clientes da plataforma Inspira:
                fórmulas de copywriting, gatilhos de fricção zero, modelos comportamentais e assistente interativo com IA.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={onOpenChat}
                className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Conversar com Copilot</span>
              </button>

              <button
                onClick={handleCopyReport}
                className="px-4 py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
              >
                {generatedCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Relatório Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Relatório Completo</span>
                  </>
                )}
              </button>

              <button
                onClick={onBackToLive}
                className="px-5 py-2.5 rounded-full bg-[#E60023] hover:bg-[#c9001f] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md hover:scale-102"
              >
                <Layers className="w-4 h-4" />
                <span>Ver Réplica Interativa</span>
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 border-t border-slate-100 mt-8 pt-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('sections')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'sections'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>1. Mapeamento das 4 Seções</span>
            </button>

            <button
              onClick={() => setActiveTab('formulas')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'formulas'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>2. Fórmulas de Copywriting</span>
            </button>

            <button
              onClick={() => setActiveTab('psychology')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'psychology'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>3. Gatilhos Comportamentais</span>
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'generator'
                  ? 'bg-[#E60023] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>4. Gerador de Copy Inspira</span>
            </button>

            <button
              onClick={() => setActiveTab('experiments')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'experiments'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>5. Calculadora de Impacto A/B</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SECTIONS MAPPING */}
        {activeTab === 'sections' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TEARDOWN_SECTIONS.map((sec, idx) => (
                <div
                  key={sec.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-extrabold px-3 py-1 bg-slate-100 text-slate-800 rounded-full">
                        {sec.title}
                      </span>
                      <span className="text-xs font-mono text-slate-400">0{idx + 1}/04</span>
                    </div>

                    {/* Raw Text Card */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Texto Original (PT-PT)
                      </span>
                      <p className="text-base font-extrabold text-slate-900 leading-snug">
                        "{sec.rawTextPt}"
                      </p>
                      <p className="text-xs text-slate-500 italic mt-1">
                        EN: "{sec.rawTextEn}"
                      </p>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-700 block mb-0.5">
                          🎯 Objetivo Funcional:
                        </span>
                        <p className="text-slate-600 leading-relaxed">
                          {sec.functionalGoal}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 block mb-0.5">
                          ❤️ Gatilho Emocional Primário:
                        </span>
                        <p className="text-slate-800 font-medium bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                          {sec.primaryEmotionalDriver}
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-700 block mb-1">
                          🧠 Mecânicas Psicológicas Subjacentes:
                        </span>
                        <ul className="space-y-1.5">
                          {sec.psychologicalMechanics.map((mech, mIdx) => (
                            <li key={mIdx} className="flex items-start gap-2 text-slate-600">
                              <CheckCircle className="w-3.5 h-3.5 text-[#E60023] shrink-0 mt-0.5" />
                              <span>{mech}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                      Lições Práticas de CRO:
                    </span>
                    <div className="space-y-1">
                      {sec.keyTakeaways.map((take, tIdx) => (
                        <div key={tIdx} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>{take}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: COPYWRITING FORMULAS */}
        {activeTab === 'formulas' && (
          <div className="space-y-8">
            {/* Core Metrics Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Proporção de Atenção
                </span>
                <div className="text-3xl font-extrabold text-slate-900 font-mono">
                  90% / 10%
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  90% Imagem Visual / 10% Texto. O Inspiria aplica "Show, Don't Tell" eliminando parágrafos expositivos.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Extensão das Frases
                </span>
                <div className="text-3xl font-extrabold text-[#E60023] font-mono">
                  3 a 7 Palavras
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Cadência estrita. Frases curtas e rítmicas aumentam a velocidade de absorção em ecrãs móveis e desktop.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Tipo de Verbos
                </span>
                <div className="text-3xl font-extrabold text-emerald-600 font-mono">
                  Imperativos Puros
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  <em>Encontre, Guarde, Veja, Faça, Compre.</em> Sem rodeios ou termos passivos corporativos.
                </p>
              </div>
            </div>

            {/* Formula Cards */}
            <div className="space-y-6">
              {COPY_FORMULAS.map((formula, fIdx) => (
                <div
                  key={fIdx}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#E60023]" />
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {formula.name}
                    </h3>
                  </div>

                  <div className="p-4 bg-slate-900 text-white rounded-2xl font-mono text-sm sm:text-base my-3 flex items-center justify-between">
                    <span>{formula.syntax}</span>
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {formula.syntaxEn}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
                    <strong>Por que funciona:</strong> {formula.whyItWorks}
                  </p>

                  <div>
                    <span className="text-xs font-bold text-slate-500 block mb-2">
                      Exemplos Práticos Adaptados:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {formula.examplesPt.map((ex, eIdx) => (
                        <div
                          key={eIdx}
                          className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-800 font-medium flex items-center gap-2"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{ex}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PSYCHOLOGICAL TRIGGERS */}
        {activeTab === 'psychology' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PSYCHOLOGICAL_TRIGGERS.map((trig) => (
              <div
                key={trig.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#E60023] flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {trig.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {trig.portugueseName}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-1">
                      Definição Comportamental:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {trig.description}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block mb-1">
                      Aplicação Exata no Inspiria pt:
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {trig.pinterestApplication}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="font-bold text-slate-700">Impacto Estimado no Funil:</span>
                    <span className="font-bold font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {trig.croImpact}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 italic">
                    Princípio: "{trig.behavioralPrinciple}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: INTERACTIVE COPY GENERATOR */}
        {activeTab === 'generator' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <div className="max-w-2xl mx-auto text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E60023] block mb-1">
                Ferramenta para Especialistas de Crescimento
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Gerador de Copy no Padrão Inspira
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Adapte a fórmula de descoberta visual, aversão à perda e clímax de 4 verbos para o seu próprio produto ou serviço.
              </p>
            </div>

            {/* Input Controls */}
            <div className="max-w-xl mx-auto space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Nicho ou Desejo Central do seu Produto:
                </label>
                <input
                  type="text"
                  value={brandNiche}
                  onChange={(e) => setBrandNiche(e.target.value)}
                  placeholder="ex: Hotel de Luxo, Software Financeiro, Café Artesanal..."
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Avatar ou Público Alvo:
                </label>
                <input
                  type="text"
                  value={audienceTarget}
                  onChange={(e) => setAudienceTarget(e.target.value)}
                  placeholder="ex: Designers Freelancers, Amantes de Café..."
                  className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                />
              </div>
            </div>

            {/* Generated Copy Preview Cards */}
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Headline Generator */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-[#E60023] uppercase tracking-wider block mb-1">
                  A. Headline de Inserção Dinâmica (Hero)
                </span>
                <p className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Encontre a sua próxima {brandNiche.toLowerCase() || 'ideia genial'}
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Fórmula: Encontre a sua próxima [Desejo Específico] — focado 100% no leitor, não na marca.
                </span>
              </div>

              {/* Benefit 1: Loss Aversion */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-[#0F7173] uppercase tracking-wider block mb-1">
                  B. Benefício 1: Mecanismo de Posse & Aversão à Perda
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900">
                  Guarde as ideias de {brandNiche.toLowerCase() || 'valor'} que adora. Colecione os seus favoritos para voltar a usá-los mais tarde.
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Resolve a ansiedade de esquecer ou perder informações importantes na internet.
                </span>
              </div>

              {/* Benefit 2: Tetradic Climax */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-[#B85D19] uppercase tracking-wider block mb-1">
                  C. Benefício 2: O Clímax Tetrádico de Ação
                </span>
                <p className="text-base sm:text-lg font-bold text-slate-900">
                  Descubra, guarde, experimente, conquiste. O melhor de {brandNiche.toLowerCase() || 'inspiração'} num só lugar.
                </p>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Mapeia os 4 degraus de conversão psicológica: Atenção → Consideração → Validação → Decisão.
                </span>
              </div>

              {/* Acquisition Modal Micro-Copy */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  D. Micro-Copy de Aquisição (Presumptive Close)
                </span>
                <p className="text-base font-bold text-slate-900">
                  "Bem-vindo(a). Encontre novas opções para experimentar."
                </p>
                <div className="mt-2 flex gap-2">
                  <div className="px-3 py-1.5 bg-white border border-slate-300 rounded-full text-xs font-bold text-slate-800 shadow-xs">
                    Continuar com o Google (Zero Fricção)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: A/B TESTING LAB & IMPACT CALCULATOR */}
        {activeTab === 'experiments' && (
          <div className="space-y-8">
            {/* Interactive Calculator */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
              <div className="max-w-xl mb-6">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Simulador de Impacto Financeiro de CRO
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Veja o impacto de trocar "Registe-se" por "Continuar" e usar Headlines Dinâmicas no volume de cadastros mensais.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Volume Mensal de Visitantes Únicos:
                    </label>
                    <input
                      type="range"
                      min={5000}
                      max={500000}
                      step={5000}
                      value={monthlyTraffic}
                      onChange={(e) => setMonthlyTraffic(Number(e.target.value))}
                      className="w-full accent-[#E60023]"
                    />
                    <div className="flex justify-between text-xs text-slate-500 font-mono mt-1">
                      <span>5.000</span>
                      <span className="font-bold text-slate-900">
                        {monthlyTraffic.toLocaleString('pt-PT')} visitantes
                      </span>
                      <span>500.000</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2 border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Taxa Linha de Base ("Registe-se"):</span>
                      <span className="font-mono font-bold text-slate-700">{baselineRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Taxa Otimizada ("Continuar" + Hero Dinâmico):</span>
                      <span className="font-mono font-bold text-[#E60023]">{optimizedRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-100 rounded-2xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Conversões Tradicionais
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-slate-700 font-mono">
                      {baselineConversions.toLocaleString('pt-PT')}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">com formulário padrão e botões genéricos</p>
                  </div>

                  <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                      Conversões Otimizadas Inspira
                    </span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
                      {optimizedConversions.toLocaleString('pt-PT')}
                    </div>
                    <p className="text-[11px] text-emerald-600 font-bold mt-1">
                      +{additionalConversions.toLocaleString('pt-PT')} novos utilizadores (+40.6% lift)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* A/B Test Case Archive */}
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                Arquivo de Testes A/B Documentados
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {AB_EXPERIMENTS.map((exp) => (
                  <div
                    key={exp.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        {exp.element}
                      </span>

                      <div className="space-y-2 mb-4 text-xs">
                        <div className="p-2.5 bg-rose-50/70 border border-rose-200/60 rounded-xl">
                          <span className="text-[10px] font-bold text-rose-800 block">Variante A (Controlo):</span>
                          <span className="text-slate-800">{exp.variantA}</span>
                        </div>

                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <span className="text-[10px] font-bold text-emerald-800 block">Variante B (Otimizada):</span>
                          <span className="text-slate-900 font-semibold">{exp.variantB}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-xs">
                      <span className="font-bold text-emerald-600 block mb-0.5">
                        🏆 Vencedor: {exp.winner}
                      </span>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        {exp.insight}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
