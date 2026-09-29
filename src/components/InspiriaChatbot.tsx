import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquareText,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Lightbulb,
  Maximize2,
  Minimize2,
  ChevronRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface InspiriaChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

export const InspiriaChatbot: React.FC<InspiriaChatbotProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      content:
        'Olá! Eu sou o Inspiria Copilot. Posso ajudar você a encontrar ideias práticas (receitas, decoração, estilo de vida) ou analisar a psicologia e fórmulas de conversão (CRO) da nossa página inicial. O que você gostaria de explorar hoje?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Como funciona a fórmula "Veja, faça, experimente, compre"?',
    'Dê-me 3 ideias rápidas de jantar prático',
    'O que é o Efeito Zeigarnik nos pins cortados?',
    'Por que "Continuar" converte mais do que "Registe-se"?',
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
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || 'Falha ao obter resposta');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content:
          'No Inspiria, cada elemento visual é desenhado para acelerar a ação. Para perguntas aprofundadas, experimente uma das perguntas rápidas abaixo ou teste a criação de pastas interativas.',
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
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[420px] h-[580px] max-h-[85vh]'
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#E60023] flex items-center justify-center text-white font-extrabold shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm tracking-tight">Inspiria Copilot</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Ideias criativas, estilo de vida & Psicologia CRO
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

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-[#E60023] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-[#E60023] text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
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
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-slate-400 text-xs py-2">
            <div className="w-7 h-7 rounded-xl bg-[#E60023]/20 text-[#E60023] flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span className="italic font-medium">Inspiria Copilot está a pensar...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-1" />
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-full transition-colors shrink-0"
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
          placeholder="Pergunte sobre ideias, receitas ou psicologia CRO..."
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
