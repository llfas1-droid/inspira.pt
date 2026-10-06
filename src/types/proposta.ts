export type UnidadeVenda = 'unidade' | 'hora' | 'pacote';

export interface CatalogoItem {
  id: string;
  nome: string;
  descricao: string;
  unidade: UnidadeVenda;
  preco_unitario_centimos: number; // Em cêntimos (ex: 18000 = 180,00 €)
  moeda: 'EUR';
  ativo: boolean;
  condicoes: string;
  ambito_limitacoes: string;
  ficticio: boolean;
  criado_em: string;
  atualizado_em: string;
}

export type EstadoPedido =
  | 'recebido'
  | 'em_analise'
  | 'necessita_revisao'
  | 'proposta_criada'
  | 'erro';

export interface ItemInterpretadoIA {
  catalogoId: string;
  quantidade: number | null;
  evidencia: string;
}

export interface InterpretacaoIA {
  resumo: string;
  itens: ItemInterpretadoIA[];
  prazoPedido: string | null;
  informacaoEmFalta: string[];
  necessitaRevisao: boolean;
  motivoRevisao: string | null;
}

export interface Pedido {
  id: string;
  nome: string;
  email: string;
  texto_original: string;
  data_criacao: string;
  data_atualizacao: string;
  estado: EstadoPedido;
  interpretacao_ia?: InterpretacaoIA | null;
  informacao_em_falta?: string[];
  motivo_revisao?: string | null;
  proposta_id?: string | null;
  erros_processamento?: string | null;
}

export type EstadoNotificacao =
  | 'por_enviar'
  | 'aceite_pelo_servico'
  | 'falhou'
  | 'nao_configurado';

export interface ItemPropostaCalculado {
  catalogo_id: string;
  nome: string;
  descricao: string;
  unidade: UnidadeVenda;
  quantidade: number;
  preco_unitario_centimos: number;
  subtotal_centimos: number;
  condicoes?: string;
}

export interface Proposta {
  id: string;
  numero: string; // Ex: PROP-2026-001
  pedido_id: string;
  data_criacao: string;
  data_validade: string; // 15 dias
  resumo_ambito: string;
  itens: ItemPropostaCalculado[];
  subtotal_centimos: number;
  total_centimos: number; // Total sem IVA
  condicoes: string;
  token: string; // Token longo não previsível
  link_acesso: string;
  estado_notificacao: EstadoNotificacao;
  resend_id?: string | null;
  data_tentativa_envio?: string | null;
  erro_envio?: string | null;
  ficticio: boolean;
}

export interface PublicPropostaView {
  id: string;
  numero: string;
  data_criacao: string;
  data_validade: string;
  resumo_ambito: string;
  itens: ItemPropostaCalculado[];
  total_centimos: number;
  condicoes: string;
  token: string;
  ficticio: boolean;
  negocio: {
    nome: string;
    email: string;
    localizacao: string;
  };
}

export interface ConfigStatus {
  hasGeminiKey: boolean;
  geminiModel: string;
  hasResendKey: boolean;
  emailAluno: string | null;
  hasAdminUid: boolean;
  adminUid: string | null;
  appBaseUrl: string;
}
