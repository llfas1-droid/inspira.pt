import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Sparkles, FileText, ArrowRight } from 'lucide-react';

interface PedidoPropostaFormProps {
  onPropostaGerada?: (token: string) => void;
}

export const PedidoPropostaForm: React.FC<PedidoPropostaFormProps> = ({ onPropostaGerada }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [pedido, setPedido] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);
  const [propostaToken, setPropostaToken] = useState<string | null>(null);
  const [propostaNumero, setPropostaNumero] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setErrorMsg(null);

    // Validações no frontend
    const nomeTrim = nome.trim();
    const emailTrim = email.trim();
    const pedidoTrim = pedido.trim();

    if (!nomeTrim) {
      setErrorMsg('Por favor, indique o seu nome completo.');
      return;
    }
    if (nomeTrim.length < 2 || nomeTrim.length > 100) {
      setErrorMsg('O nome deve ter entre 2 e 100 caracteres.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrim || !emailRegex.test(emailTrim)) {
      setErrorMsg('Por favor, introduza um endereço de email com formato válido.');
      return;
    }
    if (emailTrim.length > 120) {
      setErrorMsg('O endereço de email é demasiado longo.');
      return;
    }

    if (!pedidoTrim) {
      setErrorMsg('Por favor, descreva o que pretende no campo de pedido.');
      return;
    }
    if (pedidoTrim.length < 10) {
      setErrorMsg('Por favor, elabore um pouco mais o seu pedido (mínimo 10 caracteres).');
      return;
    }
    if (pedidoTrim.length > 3000) {
      setErrorMsg('O texto do pedido excede o limite máximo de 3000 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: nomeTrim,
          email: emailTrim,
          pedido: pedidoTrim,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível registar o seu pedido.');
      }

      setSucesso(true);
      if (data.proposta?.token) {
        setPropostaToken(data.proposta.token);
        setPropostaNumero(data.proposta.numero);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro ao submeter o pedido. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setNome('');
    setEmail('');
    setPedido('');
    setSucesso(false);
    setPropostaToken(null);
    setPropostaNumero(null);
    setErrorMsg(null);
  };

  return (
    <section id="pedido-proposta" className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da Secção */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 text-[#E60023] text-xs font-bold border border-rose-200 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E60023]" />
            <span>Orçamentação Inteligente com IA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pedido de proposta
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Descreva o que procura para o seu projeto, espaço ou guarda-roupa. A nossa Inteligência Artificial analisa o seu pedido em segundos e gera uma proposta adaptada ao nosso catálogo.
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xl relative">
          {sucesso ? (
            <div className="py-8 px-4 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm animate-scaleIn">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  O seu pedido foi recebido com sucesso.
                </h3>
                <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
                  O seu pedido foi guardado na base de dados e processado pelo nosso sistema.
                  {propostaNumero ? (
                    <span className="block mt-2 font-semibold text-slate-800">
                      Referência da proposta gerada: <span className="text-[#E60023]">{propostaNumero}</span>
                    </span>
                  ) : null}
                </p>
              </div>

              {propostaToken && (
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 max-w-md mx-auto space-y-3">
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-900">
                    <FileText className="w-4 h-4 text-amber-700" />
                    <span>Proposta de Demonstração Disponível</span>
                  </div>
                  <p className="text-xs text-amber-800">
                    Aceda diretamente ao documento com o cálculo estruturado de preços:
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (onPropostaGerada) {
                        onPropostaGerada(propostaToken);
                      } else {
                        window.location.href = `/proposta/${propostaToken}`;
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-[#E60023] hover:bg-[#c9001f] text-white text-xs font-bold rounded-full shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <span>Consultar proposta gerada</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline"
                >
                  Submeter um novo pedido de teste
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{errorMsg}</div>
                </div>
              )}

              {/* Campo 1: Nome */}
              <div className="space-y-1.5">
                <label htmlFor="campo-nome" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Nome completo <span className="text-[#E60023]">*</span>
                </label>
                <input
                  id="campo-nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Ex: Maria João Silva"
                  maxLength={100}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E60023] focus:bg-white transition-all disabled:opacity-50"
                  required
                />
              </div>

              {/* Campo 2: Email */}
              <div className="space-y-1.5">
                <label htmlFor="campo-email" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Endereço de email <span className="text-[#E60023]">*</span>
                </label>
                <input
                  id="campo-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Ex: maria.silva@exemplo.pt"
                  maxLength={120}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E60023] focus:bg-white transition-all disabled:opacity-50"
                  required
                />
              </div>

              {/* Campo 3: Pedido */}
              <div className="space-y-1.5">
                <label htmlFor="campo-pedido" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  O seu pedido <span className="text-[#E60023]">*</span>
                </label>
                <textarea
                  id="campo-pedido"
                  rows={5}
                  value={pedido}
                  onChange={(e) => setPedido(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Descreva o que procura para o seu projeto, espaço ou estilo (ex: Gostaria de um moodboard de decoração para a minha sala e 2 horas de consultoria de estilo para a nova estação)..."
                  maxLength={3000}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E60023] focus:bg-white transition-all resize-y disabled:opacity-50 leading-relaxed"
                  required
                />
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span>Mínimo 10 caracteres</span>
                  <span>{pedido.length} / 3000 caracteres</span>
                </div>
              </div>

              {/* Nota sobre os dados */}
              <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                Os seus dados serão utilizados exclusivamente para analisar e responder ao seu pedido de proposta.
              </p>

              {/* Botão de Submissão com Proteção contra cliques múltiplos */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#E60023] hover:bg-[#c9001f] disabled:bg-slate-400 text-white font-extrabold text-sm rounded-full shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>A processar o pedido com Inteligência Artificial...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Pedir proposta</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
