import React, { useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import {
  Pedido,
  Proposta,
  CatalogoItem,
  EstadoPedido,
  EstadoNotificacao,
  ConfigStatus,
} from '../types/proposta';
import { formatEuro, formatDateTimePt, formatDatePt } from '../lib/formatters';
import {
  ShieldAlert,
  ShieldCheck,
  LogIn,
  LogOut,
  RefreshCw,
  Mail,
  Send,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Tag,
  Plus,
  Edit2,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  X,
  FileText,
  Layers,
  ShoppingBag,
  HelpCircle,
  Copy,
  Check,
  Calendar,
} from 'lucide-react';

interface AdminAreaProps {
  onBackToHome: () => void;
  onOpenProposta: (token: string) => void;
  onOpenCalendar?: (prefill?: {
    summary: string;
    description: string;
    attendeeEmail: string;
  }) => void;
}

export const AdminArea: React.FC<AdminAreaProps> = ({
  onBackToHome,
  onOpenProposta,
  onOpenCalendar,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'pedidos' | 'catalogo' | 'config'>('pedidos');
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [propostas, setPropostas] = useState<Record<string, Proposta>>({});
  const [catalogo, setCatalogo] = useState<CatalogoItem[]>([]);
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);

  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Selected Pedido for detail inspection / resolution
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  // Manual resolution state
  const [isResolving, setIsResolving] = useState(false);
  const [selectedItemsResolution, setSelectedItemsResolution] = useState<
    Array<{ catalogoId: string; quantidade: number }>
  >([]);

  // Catalog item editing/creation modal
  const [editingItem, setEditingItem] = useState<CatalogoItem | null>(null);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [itemForm, setItemForm] = useState({
    nome: '',
    descricao: '',
    unidade: 'pacote' as 'unidade' | 'hora' | 'pacote',
    preco_euros: '100',
    condicoes: '',
    ambito_limitacoes: '',
    ativo: true,
  });

  const [copiedUid, setCopiedUid] = useState(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        checkAuthorization(currentUser);
      } else {
        setIsAuthorized(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const checkAuthorization = async (currentUser: FirebaseUser) => {
    try {
      const idToken = await currentUser.getIdToken();
      const res = await fetch('/api/admin/check-auth', {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await res.json();

      if (res.ok && data.authorized) {
        setIsAuthorized(true);
        loadAdminData(idToken);
      } else {
        setIsAuthorized(false);
        setAuthError(data.error || 'Acesso não autorizado como administrador.');
      }
    } catch (err: any) {
      setIsAuthorized(false);
      setAuthError(err.message || 'Erro ao verificar autorização administrativa.');
    }
  };

  const loadAdminData = async (token?: string) => {
    setLoadingData(true);
    setDataError(null);
    try {
      const idToken = token || (user ? await user.getIdToken() : '');
      const headers = { Authorization: `Bearer ${idToken}` };

      // 1. Fetch Pedidos & Propostas
      const resPedidos = await fetch('/api/admin/pedidos', { headers });
      const dataPedidos = await resPedidos.json();
      if (!resPedidos.ok) throw new Error(dataPedidos.error);
      setPedidos(dataPedidos.pedidos || []);
      setPropostas(dataPedidos.propostas || {});

      // 2. Fetch Catalogo
      const resCat = await fetch('/api/catalogo');
      const dataCat = await resCat.json();
      if (resCat.ok) setCatalogo(dataCat.catalogo || []);

      // 3. Fetch Config Status
      const resConf = await fetch('/api/admin/config-status', { headers });
      const dataConf = await resConf.json();
      if (resConf.ok) setConfigStatus(dataConf);
    } catch (err: any) {
      setDataError(err.message || 'Erro ao carregar dados administrativos.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setAuthError(err.message || 'Erro ao efetuar login com Google.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthorized(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Re-run AI analysis on order
  const handleReprocessarPedido = async (pedidoId: string) => {
    if (!user) return;
    try {
      setActionSuccess(null);
      setDataError(null);
      const idToken = await user.getIdToken();
      const res = await fetch(`/api/admin/pedidos/${pedidoId}/reprocessar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionSuccess(`Análise IA recalculada com sucesso para o pedido.`);
      loadAdminData(idToken);
      if (selectedPedido && selectedPedido.id === pedidoId) {
        setSelectedPedido(data.pedido);
      }
    } catch (err: any) {
      setDataError(err.message || 'Erro ao reprocessar pedido.');
    }
  };

  // Resend notification email to student
  const handleReenviarNotificacao = async (propostaId: string) => {
    if (!user) return;
    try {
      setActionSuccess(null);
      setDataError(null);
      const idToken = await user.getIdToken();
      const res = await fetch(`/api/admin/propostas/${propostaId}/reenviar-email`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionSuccess(`Notificação Resend reenviada com sucesso.`);
      loadAdminData(idToken);
    } catch (err: any) {
      setDataError(err.message || 'Erro ao reenviar notificação.');
    }
  };

  // Manual resolution of review requests
  const handleStartResolving = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setIsResolving(true);
    // Initialize with identified items if available
    if (pedido.interpretacao_ia?.itens) {
      setSelectedItemsResolution(
        pedido.interpretacao_ia.itens.map((it) => ({
          catalogoId: it.catalogoId,
          quantidade: it.quantidade || 1,
        }))
      );
    } else {
      setSelectedItemsResolution([]);
    }
  };

  const handleSaveResolution = async () => {
    if (!user || !selectedPedido) return;
    if (selectedItemsResolution.length === 0) {
      alert('Selecione pelo menos um item do catálogo para a proposta.');
      return;
    }

    try {
      setActionSuccess(null);
      setDataError(null);
      const idToken = await user.getIdToken();
      const res = await fetch(`/api/admin/pedidos/${selectedPedido.id}/aprovar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          itens: selectedItemsResolution,
          resumo: selectedPedido.interpretacao_ia?.resumo || 'Proposta comercial estruturada e aprovada.',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionSuccess('Proposta calculada e aprovada com sucesso!');
      setIsResolving(false);
      loadAdminData(idToken);
      setSelectedPedido(data.pedido);
    } catch (err: any) {
      setDataError(err.message || 'Erro ao aprovar proposta.');
    }
  };

  // Catalog item creation/edit
  const handleOpenEditItem = (item: CatalogoItem) => {
    setEditingItem(item);
    setIsCreatingItem(false);
    setItemForm({
      nome: item.nome,
      descricao: item.descricao,
      unidade: item.unidade,
      preco_euros: (item.preco_unitario_centimos / 100).toString(),
      condicoes: item.condicoes || '',
      ambito_limitacoes: item.ambito_limitacoes || '',
      ativo: item.ativo,
    });
  };

  const handleOpenCreateItem = () => {
    setEditingItem(null);
    setIsCreatingItem(true);
    setItemForm({
      nome: '',
      descricao: '',
      unidade: 'pacote',
      preco_euros: '100',
      condicoes: 'Demonstração',
      ambito_limitacoes: 'Válido para 1 serviço.',
      ativo: true,
    });
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const precoCentimos = Math.round(parseFloat(itemForm.preco_euros.replace(',', '.')) * 100);
    if (isNaN(precoCentimos) || precoCentimos <= 0) {
      alert('Introduza um preço válido em euros.');
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const url = isCreatingItem
        ? '/api/admin/catalogo'
        : `/api/admin/catalogo/${editingItem?.id}`;
      const method = isCreatingItem ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          ...itemForm,
          preco_unitario_centimos: precoCentimos,
          moeda: 'EUR',
          ficticio: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActionSuccess(isCreatingItem ? 'Item criado no catálogo!' : 'Item atualizado com sucesso!');
      setEditingItem(null);
      setIsCreatingItem(false);
      loadAdminData(idToken);
    } catch (err: any) {
      alert(err.message || 'Erro ao guardar item no catálogo.');
    }
  };

  const handleToggleItemAtivo = async (item: CatalogoItem) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const res = await fetch(`/api/admin/catalogo/${item.id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ ativo: !item.ativo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      loadAdminData(idToken);
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar estado do item.');
    }
  };

  const copyUidToClipboard = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  // Filter pedidos
  const filteredPedidos = pedidos.filter((p) => {
    if (filterEstado === 'todos') return true;
    return p.estado === filterEstado;
  });

  // State badge styling
  const renderEstadoBadge = (estado: EstadoPedido) => {
    switch (estado) {
      case 'proposta_criada':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Proposta criada</span>
          </span>
        );
      case 'necessita_revisao':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shrink-0">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            <span>Necessita de revisão</span>
          </span>
        );
      case 'em_analise':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3 text-blue-600" />
            <span>Em análise</span>
          </span>
        );
      case 'erro':
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1 shrink-0">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>Erro</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1 shrink-0">
            <span>Recebido</span>
          </span>
        );
    }
  };

  const renderNotificacaoBadge = (estado?: EstadoNotificacao) => {
    switch (estado) {
      case 'aceite_pelo_servico':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Aceite pelo serviço
          </span>
        );
      case 'falhou':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            Falhou
          </span>
        );
      case 'nao_configurado':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Não configurado
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
            Por enviar
          </span>
        );
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg text-center max-w-sm w-full space-y-4">
          <div className="w-8 h-8 border-3 border-[#E60023]/20 border-t-[#E60023] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700">A verificar credenciais...</p>
        </div>
      </div>
    );
  }

  // Not logged in or not authorized
  if (!user || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-100 py-12 px-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl max-w-lg w-full space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
            <ShieldAlert className="w-7 h-7 text-rose-400" />
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Área Privada de Administração
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Acesso restrito através de Firebase Authentication com conta Google autorizada.
            </p>
          </div>

          {authError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Acesso negado</span>
              </p>
              <p>{authError}</p>
            </div>
          )}

          {!user ? (
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-full shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-rose-400" />
              <span>Iniciar sessão com Google</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <p className="font-bold">Sessão iniciada como:</p>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200 font-mono text-[11px] break-all select-all flex items-center justify-between gap-2">
                  <span>{user.email} (UID: {user.uid})</span>
                  <button
                    onClick={copyUidToClipboard}
                    className="p-1 hover:bg-amber-100 rounded text-amber-800 shrink-0"
                    title="Copiar UID"
                  >
                    {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Para autorizar este utilizador como administrador, adicione a variável <code>ADMIN_UID="{user.uid}"</code> no painel de Secrets ou no ficheiro de ambiente.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => checkAuthorization(user)}
                  className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Verificar autorização novamente</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-all"
                >
                  Sair
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              onClick={onBackToHome}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 hover:underline"
            >
              ← Voltar à página inicial do Inspira
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header do Administrador */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E60023] to-[#ff4d6d] flex items-center justify-center text-white font-black text-lg shadow-sm shrink-0">
              I
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Painel de Administração
                </h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Administrador Autorizado</span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Sessão ativa: <strong>{user.email}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => loadAdminData()}
              disabled={loadingData}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-colors flex items-center gap-1.5"
              title="Recarregar dados"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>Atualizar</span>
            </button>
            <button
              onClick={onBackToHome}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-colors"
            >
              Ver Inspira
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-full border border-rose-200 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Banner Didático Obrigatório */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 p-4 rounded-2xl bg-white shadow-xs flex items-center gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-900 font-medium">
            <strong>Modo de aula:</strong> as notificações são enviadas apenas para o email do aluno. Os clientes não recebem emails.
          </p>
        </div>

        {/* Feedback Messages */}
        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:underline">
              Fechar
            </button>
          </div>
        )}

        {dataError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{dataError}</span>
            </div>
            <button onClick={() => setDataError(null)} className="text-rose-700 hover:underline">
              Fechar
            </button>
          </div>
        )}

        {/* Tabs de Navegação */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'pedidos'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Pedidos & Propostas ({pedidos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('catalogo')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'catalogo'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Catálogo Comercial ({catalogo.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'config'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Estado da Configuração</span>
          </button>
        </div>

        {/* TAB 1: PEDIDOS E PROPOSTAS */}
        {activeTab === 'pedidos' && (
          <div className="space-y-4">
            {/* Filtros de Estado */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'todos', label: 'Todos os pedidos' },
                { id: 'recebido', label: 'Recebido' },
                { id: 'em_analise', label: 'Em análise' },
                { id: 'necessita_revisao', label: 'Necessita de revisão' },
                { id: 'proposta_criada', label: 'Proposta criada' },
                { id: 'erro', label: 'Erro' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterEstado(f.id)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-colors ${
                    filterEstado === f.id
                      ? 'bg-[#E60023] text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Lista de Pedidos */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {filteredPedidos.length === 0 ? (
                <div className="py-16 px-4 text-center space-y-3">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="font-extrabold text-slate-800 text-base">Nenhum pedido encontrado</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Submeta um novo formulário na landing page para testar a interpretação automática com IA e geração de propostas.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3.5 px-4">Data</th>
                        <th className="py-3.5 px-4">Cliente</th>
                        <th className="py-3.5 px-4">Resumo do Pedido</th>
                        <th className="py-3.5 px-4">Estado</th>
                        <th className="py-3.5 px-4">Valor Proposta</th>
                        <th className="py-3.5 px-4">Notificação ao Aluno</th>
                        <th className="py-3.5 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      {filteredPedidos.map((pedido) => {
                        const proposta = pedido.proposta_id ? propostas[pedido.proposta_id] : null;
                        return (
                          <tr key={pedido.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                              {formatDateTimePt(pedido.data_criacao)}
                            </td>
                            <td className="py-3.5 px-4 space-y-0.5">
                              <p className="font-extrabold text-slate-900">{pedido.nome}</p>
                              <p className="text-[11px] text-slate-500">{pedido.email}</p>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs truncate font-medium text-slate-700">
                              {pedido.interpretacao_ia?.resumo || pedido.texto_original}
                            </td>
                            <td className="py-3.5 px-4">
                              {renderEstadoBadge(pedido.estado)}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              {proposta ? formatEuro(proposta.total_centimos) : '—'}
                            </td>
                            <td className="py-3.5 px-4 space-y-1">
                              {proposta ? (
                                <>
                                  {renderNotificacaoBadge(proposta.estado_notificacao)}
                                  {proposta.estado_notificacao === 'falhou' && (
                                    <button
                                      onClick={() => handleReenviarNotificacao(proposta.id)}
                                      className="block text-[10px] text-[#E60023] font-bold hover:underline"
                                    >
                                      Reenviar email
                                    </button>
                                  )}
                                </>
                              ) : (
                                <span className="text-slate-400 text-[11px]">—</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => setSelectedPedido(pedido)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-full transition-colors inline-flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Ver detalhes</span>
                              </button>

                              {onOpenCalendar && (
                                <button
                                  onClick={() =>
                                    onOpenCalendar({
                                      summary: `Reunião com ${pedido.nome}`,
                                      description: `Alinhamento sobre pedido de proposta:\n\n${pedido.texto_original}`,
                                      attendeeEmail: pedido.email,
                                    })
                                  }
                                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-[#E60023] border border-rose-200 font-bold rounded-full transition-colors inline-flex items-center gap-1"
                                  title="Agendar reunião no Google Calendar"
                                >
                                  <Calendar className="w-3 h-3" />
                                  <span>Agendar</span>
                                </button>
                              )}

                              {proposta?.token && (
                                <button
                                  onClick={() => onOpenProposta(proposta.token)}
                                  className="px-3 py-1.5 bg-[#E60023] hover:bg-[#c9001f] text-white font-bold rounded-full transition-colors inline-flex items-center gap-1"
                                >
                                  <span>Proposta</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CATÁLOGO COMERCIAL */}
        {activeTab === 'catalogo' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Catálogo de Produtos & Serviços</h2>
                <p className="text-xs text-slate-500">
                  Fonte de verdade comercial e preçário utilizado nos cálculos automáticos da proposta.
                </p>
              </div>
              <button
                onClick={handleOpenCreateItem}
                className="px-4 py-2 bg-[#E60023] hover:bg-[#c9001f] text-white text-xs font-bold rounded-full shadow-sm transition-all flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Produto/Serviço</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catalogo.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl p-5 border transition-all space-y-4 relative ${
                    item.ativo ? 'border-slate-200 shadow-sm' : 'border-slate-200 bg-slate-50 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      ID: {item.id}
                    </span>
                    <button
                      onClick={() => handleToggleItemAtivo(item)}
                      className="text-xs font-bold flex items-center gap-1 hover:underline"
                    >
                      {item.ativo ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-emerald-600" />
                          <span className="text-emerald-700">Ativo</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-500">Inativo</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-sm">{item.nome}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{item.descricao}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                      Preço / {item.unidade}:
                    </span>
                    <span className="font-black text-slate-900 text-base">
                      {formatEuro(item.preco_unitario_centimos)}
                    </span>
                  </div>

                  {item.condicoes && (
                    <p className="text-[11px] text-slate-500 italic bg-amber-50/60 p-2 rounded-xl border border-amber-100">
                      {item.condicoes}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">
                      {item.ficticio ? 'Preço de demonstração' : 'Preço real'}
                    </span>
                    <button
                      onClick={() => handleOpenEditItem(item)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1 font-bold"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ESTADO DA CONFIGURAÇÃO */}
        {activeTab === 'config' && configStatus && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Configuração das Variáveis de Ambiente</h2>
              <p className="text-xs text-slate-500">
                Verificação em tempo real da ligação às APIs e chaves configuradas nos Secrets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-800">GEMINI_API_KEY</span>
                  {configStatus.hasGeminiKey ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Configurada
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                      Em falta
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Modelo ativo: <strong>{configStatus.geminiModel}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-800">RESEND_API_KEY</span>
                  {configStatus.hasResendKey ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Configurada
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Não configurada
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Remetente fixo: <code>onboarding@resend.dev</code>
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-800">EMAIL_ALUNO</span>
                  {configStatus.emailAluno ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {configStatus.emailAluno}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      Em falta
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Deve coincidir com a conta Resend do aluno para notificações no plano gratuito.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-800">APP_BASE_URL</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Ativa
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono break-all">
                  {configStatus.appBaseUrl}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MODAL / DRAWER: DETALHE DO PEDIDO & RESOLUÇÃO */}
        {selectedPedido && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
              {/* Modal Header */}
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block">ID: {selectedPedido.id}</span>
                  <h3 className="text-lg font-black tracking-tight">{selectedPedido.nome}</h3>
                  <p className="text-xs text-slate-400">{selectedPedido.email}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPedido(null);
                    setIsResolving(false);
                  }}
                  className="p-2 text-slate-400 hover:text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1">
                {/* Texto Original */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Texto Original Submetido pelo Cliente
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                    {selectedPedido.texto_original}
                  </div>
                </div>

                {/* Interpretação Estruturada IA */}
                {selectedPedido.interpretacao_ia && (
                  <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                      <Sparkles className="w-4 h-4 text-[#E60023]" />
                      <span>Interpretação Estruturada do Gemini</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <strong className="text-slate-700">Resumo:</strong>{' '}
                        <span className="text-slate-800">{selectedPedido.interpretacao_ia.resumo}</span>
                      </div>

                      {selectedPedido.interpretacao_ia.prazoPedido && (
                        <div>
                          <strong className="text-slate-700">Prazo pretendido:</strong>{' '}
                          <span className="text-slate-800">{selectedPedido.interpretacao_ia.prazoPedido}</span>
                        </div>
                      )}

                      {/* Itens e Evidências */}
                      <div>
                        <strong className="text-slate-700 block mb-1">Itens identificados e evidências:</strong>
                        <div className="space-y-1.5">
                          {selectedPedido.interpretacao_ia.itens.map((it, idx) => {
                            const cat = catalogo.find((c) => c.id === it.catalogoId);
                            return (
                              <div
                                key={idx}
                                className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] space-y-1"
                              >
                                <div className="flex justify-between font-bold text-slate-900">
                                  <span>{cat?.nome || it.catalogoId}</span>
                                  <span>Qtd: {it.quantidade !== null ? it.quantidade : 'Indeterminada'}</span>
                                </div>
                                <p className="text-slate-500 italic">
                                  «{it.evidencia}»
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Informações em Falta */}
                      {selectedPedido.interpretacao_ia.informacaoEmFalta?.length > 0 && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                          <strong className="block text-[11px]">Questões por esclarecer:</strong>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                            {selectedPedido.interpretacao_ia.informacaoEmFalta.map((q, i) => (
                              <li key={i}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Motivo de Revisão */}
                      {selectedPedido.interpretacao_ia.motivoRevisao && (
                        <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-900 space-y-1">
                          <strong className="block text-[11px]">Motivo de revisão:</strong>
                          <p className="text-[11px]">{selectedPedido.interpretacao_ia.motivoRevisao}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Bloco de Resolução Manual para pedidos em revisão */}
                {isResolving ? (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                        Definir Itens e Quantidades do Catálogo
                      </h4>
                      <button
                        onClick={() => setIsResolving(false)}
                        className="text-xs text-amber-800 underline font-semibold"
                      >
                        Cancelar
                      </button>
                    </div>

                    <div className="space-y-2">
                      {catalogo
                        .filter((c) => c.ativo)
                        .map((cat) => {
                          const existing = selectedItemsResolution.find((s) => s.catalogoId === cat.id);
                          const isChecked = !!existing;

                          return (
                            <div
                              key={cat.id}
                              className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedItemsResolution([
                                        ...selectedItemsResolution,
                                        { catalogoId: cat.id, quantidade: 1 },
                                      ]);
                                    } else {
                                      setSelectedItemsResolution(
                                        selectedItemsResolution.filter((s) => s.catalogoId !== cat.id)
                                      );
                                    }
                                  }}
                                  className="w-4 h-4 text-[#E60023] rounded"
                                />
                                <div>
                                  <p className="font-bold text-slate-900">{cat.nome}</p>
                                  <p className="text-[10px] text-slate-500">
                                    {formatEuro(cat.preco_unitario_centimos)} / {cat.unidade}
                                  </p>
                                </div>
                              </div>

                              {isChecked && (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[11px] text-slate-500">Qtd:</span>
                                  <input
                                    type="number"
                                    min={1}
                                    max={99}
                                    value={existing.quantidade}
                                    onChange={(e) => {
                                      const val = Math.max(1, parseInt(e.target.value) || 1);
                                      setSelectedItemsResolution(
                                        selectedItemsResolution.map((s) =>
                                          s.catalogoId === cat.id ? { ...s, quantidade: val } : s
                                        )
                                      );
                                    }}
                                    className="w-14 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-center font-bold"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    <button
                      onClick={handleSaveResolution}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full shadow-sm transition-all"
                    >
                      Aprovar e Calcular Proposta
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                    {selectedPedido.estado === 'necessita_revisao' && (
                      <button
                        onClick={() => handleStartResolving(selectedPedido)}
                        className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-full transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Resolver e Calcular Proposta</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleReprocessarPedido(selectedPedido.id)}
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Repetir Análise IA</span>
                    </button>

                    {selectedPedido.proposta_id && propostas[selectedPedido.proposta_id] && (
                      <button
                        onClick={() => onOpenProposta(propostas[selectedPedido.proposta_id!].token)}
                        className="py-2.5 px-4 bg-[#E60023] hover:bg-[#c9001f] text-white font-bold text-xs rounded-full transition-all flex items-center gap-1.5"
                      >
                        <span>Abrir Proposta Oficial</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {onOpenCalendar && (
                      <button
                        onClick={() => {
                          const prop = selectedPedido.proposta_id ? propostas[selectedPedido.proposta_id] : null;
                          onOpenCalendar({
                            summary: prop ? `Apresentação Proposta ${prop.numero}` : `Reunião com ${selectedPedido.nome}`,
                            description: `Reunião com o cliente ${selectedPedido.nome} (${selectedPedido.email}).\n\nDetalhes do pedido:\n${selectedPedido.texto_original}`,
                            attendeeEmail: selectedPedido.email,
                          });
                        }}
                        className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-[#E60023] border border-rose-200 font-bold text-xs rounded-full transition-all flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Agendar no Google Calendar</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CRIAR / EDITAR ITEM DO CATÁLOGO */}
        {(editingItem || isCreatingItem) && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 my-8">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-slate-900">
                  {isCreatingItem ? 'Adicionar Produto ou Serviço' : 'Editar Item do Catálogo'}
                </h3>
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setIsCreatingItem(false);
                  }}
                  className="p-1 text-slate-400 hover:text-slate-800 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nome do Produto ou Serviço</label>
                  <input
                    type="text"
                    required
                    value={itemForm.nome}
                    onChange={(e) => setItemForm({ ...itemForm, nome: e.target.value })}
                    placeholder="Ex: Consultoria de Decoração"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Descrição</label>
                  <textarea
                    rows={3}
                    required
                    value={itemForm.descricao}
                    onChange={(e) => setItemForm({ ...itemForm, descricao: e.target.value })}
                    placeholder="Descrição detalhada do âmbito..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Unidade de Venda</label>
                    <select
                      value={itemForm.unidade}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          unidade: e.target.value as 'unidade' | 'hora' | 'pacote',
                        })
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl capitalize"
                    >
                      <option value="pacote">Pacote</option>
                      <option value="hora">Hora</option>
                      <option value="unidade">Unidade</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Preço em Euros (€)</label>
                    <input
                      type="text"
                      required
                      value={itemForm.preco_euros}
                      onChange={(e) => setItemForm({ ...itemForm, preco_euros: e.target.value })}
                      placeholder="180"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Condições & Entrega</label>
                  <input
                    type="text"
                    value={itemForm.condicoes}
                    onChange={(e) => setItemForm({ ...itemForm, condicoes: e.target.value })}
                    placeholder="Ex: Inclui 1 revisão digital"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Âmbito & Limitações</label>
                  <input
                    type="text"
                    value={itemForm.ambito_limitacoes}
                    onChange={(e) => setItemForm({ ...itemForm, ambito_limitacoes: e.target.value })}
                    placeholder="Ex: Válido para 1 divisão"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="item-ativo-check"
                    checked={itemForm.ativo}
                    onChange={(e) => setItemForm({ ...itemForm, ativo: e.target.checked })}
                    className="w-4 h-4 text-[#E60023] rounded"
                  />
                  <label htmlFor="item-ativo-check" className="font-bold text-slate-700">
                    Item ativo para novas propostas
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#E60023] hover:bg-[#c9001f] text-white font-extrabold rounded-full transition-all"
                  >
                    Guardar no Catálogo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(null);
                      setIsCreatingItem(false);
                    }}
                    className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
