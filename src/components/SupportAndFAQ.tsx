import React, { useState } from 'react';
import { FAQ_ITEMS, FAQItem } from '../data/supportData';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Mail,
  Send,
  CheckCircle2,
  Sparkles,
  MessageSquareText,
  ShieldCheck,
  Compass,
  Layers,
  PhoneCall,
  Clock
} from 'lucide-react';

interface SupportAndFAQProps {
  onBackToLive: () => void;
  onOpenChat: () => void;
  onOpenAuth: () => void;
}

export const SupportAndFAQ: React.FC<SupportAndFAQProps> = ({
  onBackToLive,
  onOpenChat,
  onOpenAuth
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Contact Ticket Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Dúvida sobre a Conta');
  const [message, setMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const categories = [
    { id: 'all', label: 'Todas as Perguntas', icon: HelpCircle },
    { id: 'discovery', label: 'Descoberta Visual', icon: Compass },
    { id: 'boards', label: 'Pastas & Ideias', icon: Layers },
    { id: 'account', label: 'Acesso & Conta', icon: ShieldCheck },
    { id: 'cro', label: 'Psicologia & CRO', icon: Sparkles },
    { id: 'privacy', label: 'Privacidade & Dados', icon: ShieldCheck }
  ];

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setTicketSubmitted(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-[#E60023] text-xs font-bold border border-rose-200">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Centro de Ajuda & Apoio ao Utilizador</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Como podemos ajudar hoje?
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Consulte as respostas frequentes sobre o Inspira, aprenda a salvar e organizar pastas ou entre em contacto com a nossa equipa de suporte dedicada.
            </p>

            {/* Search Input Bar */}
            <div className="relative max-w-xl mx-auto mt-6">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquise por palavras-chave (ex: pastas, continuar, recuperar, pins)..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#E60023] focus:bg-white transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-semibold"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-start sm:justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-[#E60023] text-white shadow-md'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-2">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Perguntas Frequentes (FAQ)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                A exibir {filteredFaqs.length} pergunta(s) encontrada(s)
              </p>
            </div>

            <button
              onClick={onOpenChat}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-xs"
            >
              <MessageSquareText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Perguntar ao Copilot</span>
            </button>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-600 font-semibold text-sm">
                Nenhuma resposta encontrada para "{searchQuery}".
              </p>
              <p className="text-xs text-slate-400">
                Tente outros termos ou fale diretamente com o Inspira Copilot no chat interativo.
              </p>
              <button
                onClick={onOpenChat}
                className="mt-2 px-4 py-2 rounded-full bg-[#E60023] text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Abrir Inspira Copilot</span>
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 bg-white hover:bg-slate-50/80 transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-slate-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-[#E60023]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed bg-white border-t border-slate-100 animate-fade-in">
                      <p className="mt-2">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Support Ticket Form & Quick Assist Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick Help Cards (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#E60023] flex items-center justify-center font-bold">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Assistente com IA em Tempo Real
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  O nosso Inspira Copilot está disponível 24/7 para responder a dúvidas e indicar ideias visuais.
                </p>
              </div>
              <button
                onClick={onOpenChat}
                className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <span>Falar com o Copilot Agora</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Tempo Médio de Resposta</h4>
                  <p className="text-[11px] text-slate-500">Menos de 2 horas em dias úteis</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">E-mail de Suporte</h4>
                  <p className="text-[11px] text-slate-500 font-mono">suporte@inspira.pt</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support Ticket Form (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E60023]">
                  Apoio ao Utilizador
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                  Envie uma mensagem à nossa equipa
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tem uma sugestão, dúvida técnica ou precisa de auxílio com a sua conta?
                </p>
              </div>

              {ticketSubmitted ? (
                <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 animate-fade-in">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-900">
                    Mensagem enviada com sucesso!
                  </h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Agradecemos o seu contacto. A nossa equipa de apoio de Lisboa analisará o seu pedido e responderá nas próximas horas.
                  </p>
                  <button
                    onClick={() => setTicketSubmitted(false)}
                    className="mt-3 text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
                  >
                    Enviar nova questão
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        O seu Nome *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Maria Silva"
                        required
                        className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        O seu E-mail *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ex: maria.silva@exemplo.pt"
                        required
                        className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Assunto
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023] bg-white"
                    >
                      <option value="Dúvida sobre a Conta">Dúvida sobre a Conta e Acesso</option>
                      <option value="Criação de Pastas e Pins">Criação de Pastas e Ideias</option>
                      <option value="Dúvida sobre Metodologia CRO">Dúvida sobre a Metodologia CRO / Fórmulas</option>
                      <option value="Sugestão de Nova Funcionalidade">Sugestão de Nova Funcionalidade</option>
                      <option value="Outro Assunto">Outro Assunto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mensagem detalhada *
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Descreva a sua dúvida, problema ou feedback..."
                      required
                      className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <span className="text-[11px] text-slate-400">
                      Os seus dados são protegidos segundo as normas europeias do RGPD.
                    </span>

                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#E60023] hover:bg-[#c9001f] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:scale-102 transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Enviar Pedido de Suporte</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
