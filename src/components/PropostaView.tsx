import React, { useEffect, useState } from 'react';
import { PublicPropostaView } from '../types/proposta';
import { formatEuro, formatDatePt } from '../lib/formatters';
import {
  FileText,
  Calendar,
  Clock,
  ShieldCheck,
  Building,
  Mail,
  MapPin,
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface PropostaViewProps {
  token: string;
  onBackToHome: () => void;
  onScheduleMeeting?: (prefill: {
    summary: string;
    description: string;
    attendeeEmail: string;
  }) => void;
}

export const PropostaView: React.FC<PropostaViewProps> = ({
  token,
  onBackToHome,
  onScheduleMeeting,
}) => {
  const [proposta, setProposta] = useState<PublicPropostaView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add noindex tag to protect proposal privacy
    let metaTag = document.querySelector('meta[name="robots"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'robots');
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', 'noindex, nofollow');

    const fetchProposta = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/propostas/${encodeURIComponent(token)}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Proposta não encontrada ou expirada.');
        }

        setProposta(data.proposta);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar proposta.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProposta();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg text-center max-w-md w-full space-y-4">
          <div className="w-10 h-10 border-3 border-[#E60023]/20 border-t-[#E60023] rounded-full animate-spin mx-auto" />
          <h3 className="font-extrabold text-slate-900 text-lg">A carregar proposta...</h3>
          <p className="text-xs text-slate-500">A consultar o documento oficial no servidor.</p>
        </div>
      </div>
    );
  }

  if (error || !proposta) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center max-w-md w-full space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-xl">Proposta não encontrada</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {error || 'O link de acesso à proposta é inválido ou a proposta expirou.'}
            </p>
          </div>
          <button
            onClick={onBackToHome}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à página principal</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Barra Superior de Navegação */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Inspira</span>
          </button>

          <div className="flex items-center gap-2">
            {onScheduleMeeting && (
              <button
                onClick={() =>
                  onScheduleMeeting({
                    summary: `Apresentação da Proposta ${proposta.numero}`,
                    description: `Reunião para alinhamento e apresentação detalhada da proposta comercial ${proposta.numero}.\n\nÂmbito:\n${proposta.resumo_ambito}`,
                    attendeeEmail: '',
                  })
                }
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#E60023] hover:bg-[#c9001f] px-4 py-2 rounded-full shadow-sm transition-all hover:scale-102"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Agendar no Google Calendar</span>
              </button>
            )}

            <span className="text-[11px] font-semibold text-slate-500 bg-slate-200/80 px-3 py-1 rounded-full">
              Documento Oficial de Orçamento
            </span>
          </div>
        </div>

        {/* Card Principal da Proposta */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          {/* Header da Proposta */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-10 border-b border-slate-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E60023] to-[#ff4d6d] flex items-center justify-center text-white font-black text-2xl shadow-md shrink-0">
                  I
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight">Inspira</h1>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">pt</span>
                  </div>
                  <p className="text-xs text-slate-300">Descoberta Visual & Curadoria Profissional</p>
                </div>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full text-slate-200 border border-white/20">
                  Proposta Comercial
                </span>
                <p className="text-xl sm:text-2xl font-black text-rose-400 tracking-tight font-mono">
                  {proposta.numero}
                </p>
              </div>
            </div>

            {/* Metadados: Data e Validade */}
            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  <strong>Data de emissão:</strong> {formatDatePt(proposta.data_criacao)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Validade da proposta:</strong> {formatDatePt(proposta.data_validade)} (15 dias)
                </span>
              </div>
            </div>
          </div>

          {/* Aviso de Preços Fictícios (Demonstração de Exercício de Aprendizagem) */}
          {proposta.ficticio && (
            <div className="bg-amber-50 px-6 py-3 border-b border-amber-200 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Nota de Demonstração:</strong> Esta proposta foi gerada para efeitos didáticos com valores fictícios de referência do catálogo comercial.
              </span>
            </div>
          )}

          {/* Corpo do Documento */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* Resumo do Âmbito */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Resumo do Âmbito dos Serviços
              </h2>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed font-medium">
                {proposta.resumo_ambito}
              </div>
            </div>

            {/* Tabela de Itens */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Especificação de Itens & Preçário
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Item / Serviço</th>
                      <th className="py-3.5 px-4 text-center">Unidade</th>
                      <th className="py-3.5 px-4 text-center">Qtd.</th>
                      <th className="py-3.5 px-4 text-right">Preço Unitário</th>
                      <th className="py-3.5 px-4 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {proposta.itens.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3.5 px-4 space-y-1">
                          <p className="font-extrabold text-slate-900 text-[13px]">{item.nome}</p>
                          <p className="text-slate-500 text-[11px] leading-relaxed">{item.descricao}</p>
                          {item.condicoes && (
                            <p className="text-[10px] text-slate-400 italic">Condição: {item.condicoes}</p>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center font-medium capitalize text-slate-600">
                          {item.unidade}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-900 text-sm">
                          {item.quantidade}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-slate-600">
                          {formatEuro(item.preco_unitario_centimos)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900 text-sm">
                          {formatEuro(item.subtotal_centimos)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total em Destaque */}
            <div className="flex flex-col sm:flex-row items-end justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Condições Fiscais
                </span>
                <p className="text-xs text-slate-300">
                  Preços discriminados em euros (€) com base nas tabelas em vigor.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Total sem IVA
                </span>
                <span className="text-3xl sm:text-4xl font-black text-rose-400 tracking-tight">
                  {formatEuro(proposta.total_centimos)}
                </span>
              </div>
            </div>

            {/* Agendamento Google Calendar Callout */}
            {onScheduleMeeting && (
              <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#E60023]" />
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Reunião de Alinhamento & Apresentação
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 max-w-xl">
                    Agende uma sessão por videoconferência (Google Meet) para esclarecer dúvidas sobre os itens orçamentados, prazos de entrega e estratégia de lançamento.
                  </p>
                </div>
                <button
                  onClick={() =>
                    onScheduleMeeting({
                      summary: `Apresentação da Proposta ${proposta.numero}`,
                      description: `Reunião para alinhamento e apresentação da proposta comercial ${proposta.numero}.\n\nÂmbito:\n${proposta.resumo_ambito}`,
                      attendeeEmail: '',
                    })
                  }
                  className="shrink-0 px-4 py-2.5 rounded-xl bg-[#E60023] hover:bg-[#c9001f] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-102"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Agendar no Google Calendar</span>
                </button>
              </div>
            )}

            {/* Condições Gerais */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Condições de Prestação de Serviço
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                {proposta.condicoes ||
                  'Proposta válida por 15 dias a contar da data de emissão. O início dos trabalhos fica condicionado à aceitação formal e disponibilização dos elementos necessários por parte do cliente.'}
              </p>
            </div>

            {/* Contactos da Empresa */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#E60023]" />
                <span className="font-semibold text-slate-800">{proposta.negocio.nome}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E60023]" />
                <span>{proposta.negocio.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E60023]" />
                <span>{proposta.negocio.localizacao}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
