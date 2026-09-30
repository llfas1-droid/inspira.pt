import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Minimize2,
  Maximize2,
  Info
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  toolCallExecuted?: {
    name: string;
    args: { data_hora: string; nome: string; email: string };
    result: {
      success: boolean;
      message: string;
      reuniao?: any;
      erro?: string;
      cal_link?: string;
    };
  };
}

interface InspiriaChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

export const InspiriaChatbot: React.FC<InspiriaChatbotProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      content:
        'Olá! Sou a Assistente Virtual de Agendamentos da Luisa Lins. Para qual dia e hora gostaria de marcar a sua reunião?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Quero agendar uma reunião amanhã às 15h',
    'Prefiro marcar por conta própria',
    'Quinta-feira às 10h da manhã',
  ];

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      if (data.reply) {
        const botMsg: ChatMessage = {
          id: `b-${Date.now()}`,
          role: 'model',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolCallExecuted: data.toolCallExecuted,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || 'Falha ao processar agendamento.');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content:
          'Se preferir marcar diretamente com a Luisa Lins, pode utilizar a agenda oficial aqui: https://cal.com/luisa-lins-qrhlyj/agendamentos',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden ${
        isExpanded
          ? 'inset-4 sm:inset-10'
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[440px] h-[600px] max-h-[88vh]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#E60023] flex items-center justify-center text-white font-extrabold shadow-md shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm tracking-tight">Luisa Lins · Agendamentos</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Assistente Virtual
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Marcação direta & integração oficial Cal.com
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isExpanded ? 'Minimizar' : 'Expandir'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Official Booking Banner Info */}
      <div className="bg-amber-50 px-3.5 py-2 border-b border-amber-200 flex items-center justify-between text-[11px] text-amber-900">
        <div className="flex items-center gap-1.5 font-medium truncate">
          <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>Fuso horário: Lisboa / Portugal (GMT+1)</span>
        </div>
        <a
          href="https://cal.com/luisa-lins-qrhlyj/agendamentos"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#E60023] hover:underline flex items-center gap-1 shrink-0 ml-2"
        >
          <span>Link Cal.com</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className={`flex gap-2.5 max-w-[90%] ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-[#E60023] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#E60023] text-white rounded-tr-xs'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      isUser ? 'text-white/70' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Tool Execution Card Details if `marcar_reuniao` was executed */}
              {msg.toolCallExecuted && (
                <div className="mt-2.5 ml-9 max-w-[85%] p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-xs">
                  <div className="flex items-center gap-2 mb-1.5 font-bold">
                    {msg.toolCallExecuted.result.success ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-900">Ferramenta: marcar_reuniao [SUCESSO]</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span className="text-rose-900">Ferramenta: marcar_reuniao [INDISPONÍVEL]</span>
                      </>
                    )}
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 font-mono">
                    <p>• Data/Hora: {msg.toolCallExecuted.args.data_hora}</p>
                    <p>• Cliente: {msg.toolCallExecuted.args.nome}</p>
                    <p>• Email: {msg.toolCallExecuted.args.email}</p>
                  </div>

                  {msg.toolCallExecuted.result.cal_link && (
                    <a
                      href={msg.toolCallExecuted.result.cal_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#E60023] hover:underline"
                    >
                      <span>Abrir agenda completa no Cal.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs py-2">
            <div className="w-7 h-7 rounded-xl bg-[#E60023]/20 text-[#E60023] flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span className="italic font-medium">A verificar agenda com Luisa Lins...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="whitespace-nowrap px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escreva a data, hora, nome ou email..."
          className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E60023] focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-9 h-9 rounded-full bg-[#E60023] hover:bg-[#c9001f] disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 shadow-sm"
          aria-label="Enviar mensagem"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
