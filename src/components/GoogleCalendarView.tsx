import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  X,
  MapPin,
  CalendarCheck,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';
import {
  fetchCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  CalendarEventItem,
  CreateEventInput,
} from '../lib/googleCalendar';
import {
  auth,
  googleSignIn,
  getAccessToken,
  setCachedAccessToken,
  logout,
  initAuth,
} from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface GoogleCalendarViewProps {
  onBackToHome?: () => void;
  prefillEvent?: {
    summary?: string;
    description?: string;
    attendeeEmail?: string;
  } | null;
  onClearPrefill?: () => void;
}

export const GoogleCalendarView: React.FC<GoogleCalendarViewProps> = ({
  onBackToHome,
  prefillEvent,
  onClearPrefill,
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);
  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modal / Form state for creating or editing
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields
  const [formSummary, setFormSummary] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formDate, setFormDate] = useState<string>('');
  const [formStartTime, setFormStartTime] = useState<string>('10:00');
  const [formEndTime, setFormEndTime] = useState<string>('11:00');
  const [formLocation, setFormLocation] = useState<string>('Google Meet');
  const [formAttendee, setFormAttendee] = useState<string>('');
  const [formMeetLink, setFormMeetLink] = useState<boolean>(true);

  // Mandatory Confirmation Dialog State for mutating or destructive operations
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionLabel: string;
    isDestructive: boolean;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    actionLabel: 'Confirmar',
    isDestructive: false,
    onConfirm: async () => {},
  });

  // Check auth state on load
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(auth.currentUser);
      }
    );

    // Also check if token is already cached in memory
    getAccessToken().then((token) => {
      if (token) setAccessToken(token);
    });

    return () => unsubscribe();
  }, []);

  // Pre-fill form if passed from external components (e.g. PropostaView)
  useEffect(() => {
    if (prefillEvent) {
      setFormSummary(prefillEvent.summary || 'Apresentação de Proposta Comercial');
      setFormDescription(prefillEvent.description || '');
      setFormAttendee(prefillEvent.attendeeEmail || '');
      // Set default tomorrow at 10:00
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormDate(tomorrow.toISOString().split('T')[0]);
      setIsFormOpen(true);
      if (onClearPrefill) onClearPrefill();
    }
  }, [prefillEvent, onClearPrefill]);

  // Load events once token is available
  useEffect(() => {
    if (accessToken) {
      loadEvents();
    }
  }, [accessToken]);

  const loadEvents = async () => {
    if (!accessToken) return;
    setIsLoadingEvents(true);
    setErrorMessage(null);
    try {
      const items = await fetchCalendarEvents(accessToken);
      setEvents(items);
    } catch (err: any) {
      console.error('Erro ao carregar eventos:', err);
      // If unauthorized or token expired, require sign-in again
      if (err.message && err.message.includes('401')) {
        setAccessToken(null);
        setCachedAccessToken(null);
      }
      setErrorMessage(
        err.message || 'Não foi possível carregar os eventos do Google Calendar.'
      );
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setErrorMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        setSuccessToast(`Conectado como ${res.user.displayName || res.user.email}!`);
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (err: any) {
      console.error('Falha no login com Google:', err);
      setErrorMessage(
        err.message ||
          'Falha ao autenticar com o Google. Por favor, verifique se permitiu as permissões de Calendário.'
      );
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setAccessToken(null);
    setEvents([]);
  };

  const resetForm = () => {
    setEditingEventId(null);
    setFormSummary('');
    setFormDescription('');
    setFormDate('');
    setFormStartTime('10:00');
    setFormEndTime('11:00');
    setFormLocation('Google Meet');
    setFormAttendee('');
    setFormMeetLink(true);
    setIsFormOpen(false);
  };

  const openNewEventForm = (presetType?: string) => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    setFormDate(today.toISOString().split('T')[0]);
    setFormStartTime('10:00');
    setFormEndTime('11:00');

    if (presetType === 'proposta') {
      setFormSummary('Apresentação & Alinhamento de Proposta Inspira');
      setFormDescription(
        'Sessão executiva para revisão das estimativas de alcance, pacotes criativos e alinhamento de cronograma.'
      );
    } else if (presetType === 'cro') {
      setFormSummary('Auditoria de Conversão & Teardown CRO');
      setFormDescription(
        'Análise da psicologia de conversão, pontos de fricção e táticas de retenção inspiradas no Inspira.'
      );
    } else {
      setFormSummary('Reunião de Alinhamento Inspira');
      setFormDescription('Reunião para discussão de objetivos e plano de ação.');
    }

    setEditingEventId(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (event: CalendarEventItem) => {
    setEditingEventId(event.id);
    setFormSummary(event.summary || '');
    setFormDescription(event.description || '');
    setFormLocation(event.location || '');

    if (event.attendees && event.attendees.length > 0) {
      setFormAttendee(event.attendees[0].email || '');
    } else {
      setFormAttendee('');
    }

    if (event.start?.dateTime) {
      const dt = new Date(event.start.dateTime);
      setFormDate(dt.toISOString().split('T')[0]);
      setFormStartTime(
        `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
      );
    }
    if (event.end?.dateTime) {
      const dt = new Date(event.end.dateTime);
      setFormEndTime(
        `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
      );
    }

    setIsFormOpen(true);
  };

  // Submit handler (creates or requests confirmation to update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setErrorMessage('Necessita de iniciar sessão com a sua conta Google.');
      return;
    }

    if (!formSummary.trim() || !formDate || !formStartTime || !formEndTime) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios (título, data e horário).');
      return;
    }

    const startDateTime = new Date(`${formDate}T${formStartTime}:00`).toISOString();
    const endDateTime = new Date(`${formDate}T${formEndTime}:00`).toISOString();

    const inputData: CreateEventInput = {
      summary: formSummary.trim(),
      description: formDescription.trim(),
      location: formLocation.trim(),
      startDateTime,
      endDateTime,
      attendeeEmail: formAttendee.trim() || undefined,
      createMeetLink: formMeetLink,
    };

    if (editingEventId) {
      // Mutating operation: MANDATORY confirmation dialog per workspace-integration skill
      setConfirmDialog({
        isOpen: true,
        title: 'Atualizar Evento no Google Calendar',
        message: `Tem a certeza que deseja atualizar as alterações no evento "${formSummary}" agendado para ${formDate}?`,
        actionLabel: 'Confirmar Atualização',
        isDestructive: false,
        onConfirm: async () => {
          setIsSubmitting(true);
          try {
            await updateCalendarEvent(accessToken, editingEventId, inputData);
            setSuccessToast('Evento atualizado com sucesso no Google Calendar!');
            resetForm();
            await loadEvents();
          } catch (err: any) {
            setErrorMessage(err.message || 'Falha ao atualizar evento.');
          } finally {
            setIsSubmitting(false);
          }
        },
      });
      return;
    }

    // Creating new event
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await createCalendarEvent(accessToken, inputData);
      setSuccessToast('Novo evento agendado com sucesso no Google Calendar!');
      resetForm();
      await loadEvents();
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao criar evento no Google Calendar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete event: MANDATORY confirmation dialog per workspace-integration skill
  const handleDeleteClick = (event: CalendarEventItem) => {
    if (!accessToken) return;

    setConfirmDialog({
      isOpen: true,
      title: 'Eliminar Evento do Google Calendar',
      message: `Tem a certeza que deseja remover permanentemente o evento "${event.summary || 'Sem Título'}" da sua agenda Google Calendar? Esta ação não pode ser desfeita.`,
      actionLabel: 'Eliminar Evento',
      isDestructive: true,
      onConfirm: async () => {
        setIsLoadingEvents(true);
        try {
          await deleteCalendarEvent(accessToken, event.id);
          setSuccessToast('Evento removido com sucesso do Google Calendar.');
          await loadEvents();
        } catch (err: any) {
          setErrorMessage(err.message || 'Falha ao eliminar o evento.');
        } finally {
          setIsLoadingEvents(false);
        }
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Google Calendar Integration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Agenda & Reuniões de Consultoria
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Agende sessões de apresentação de propostas, consultorias de CRO e alinhamentos de campanhas diretamente sincronizados com o seu Google Calendar pessoal ou profissional.
            </p>
          </div>

          {/* User Auth Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {currentUser && accessToken ? (
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Utilizador'}
                    className="w-11 h-11 rounded-full border-2 border-white/80 object-cover"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-lg">
                    {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{currentUser.displayName || 'Utilizador Conectado'}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-xs text-slate-300 truncate max-w-[200px]">
                    {currentUser.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
                  title="Terminar Sessão Google"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-slate-300 font-medium">
                  Conecte o seu Google Calendar para visualizar e criar agendamentos com permissão:
                </p>
                {/* Official Sign in with Google Button Styled as gsi-material-button */}
                <button
                  onClick={handleSignIn}
                  disabled={isAuthenticating}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold py-2.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-3 transition-all hover:scale-102 active:scale-98 border border-slate-200"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span>
                    {isAuthenticating
                      ? 'A conectar com o Google...'
                      : 'Iniciar sessão com o Google'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-900 text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Atenção: </span>
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 hover:bg-rose-100 rounded-lg text-rose-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Action Presets & Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
            Novo Agendamento Rápido:
          </span>
          <button
            onClick={() => openNewEventForm('proposta')}
            disabled={!accessToken}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-[#E60023] border border-rose-200 hover:bg-rose-100 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apresentar Proposta</span>
          </button>
          <button
            onClick={() => openNewEventForm('cro')}
            disabled={!accessToken}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Consultoria CRO</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadEvents}
            disabled={!accessToken || isLoadingEvents}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            title="Atualizar lista de eventos"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoadingEvents ? 'animate-spin' : ''}`}
            />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          <button
            onClick={() => openNewEventForm()}
            disabled={!accessToken}
            className="px-4 py-2 rounded-xl bg-[#E60023] hover:bg-[#c9001f] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Agendar Reunião</span>
          </button>
        </div>
      </div>

      {/* Main Content: Events List or Not Connected State */}
      {!accessToken ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-10 sm:p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 text-[#E60023] flex items-center justify-center mx-auto shadow-inner">
            <CalendarIcon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Conecte o seu Google Calendar
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Para ver as reuniões agendadas, convidar clientes para sessões de apresentação de propostas e gerir a sua disponibilidade em tempo real, inicie sessão com a sua conta Google com permissão.
          </p>
          <div className="pt-2">
            <button
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="inline-flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold py-3 px-6 rounded-2xl shadow-md border border-slate-200 transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>Continuar com o Google</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-[#E60023]" />
              <span>Eventos & Reuniões Agendadas ({events.length})</span>
            </h2>
            <span className="text-xs text-slate-500">
              Sincronizado diretamente com Google Calendar (primary)
            </span>
          </div>

          {isLoadingEvents ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <div className="w-10 h-10 border-4 border-[#E60023] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-500">
                A sincronizar eventos do Google Calendar...
              </p>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                Nenhum evento agendado para breve
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                A sua agenda Google não tem reuniões futuras registadas neste período. Clique em "Agendar Reunião" para marcar o primeiro alinhamento.
              </p>
              <button
                onClick={() => openNewEventForm()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E60023] text-white text-xs font-bold hover:bg-[#c9001f] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Marcar Reunião Agora</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => {
                const startRaw = event.start?.dateTime || event.start?.date;
                const endRaw = event.end?.dateTime || event.end?.date;
                const startDate = startRaw ? new Date(startRaw) : null;
                const endDate = endRaw ? new Date(endRaw) : null;

                const dateStr = startDate
                  ? startDate.toLocaleDateString('pt-PT', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Data a definir';

                const timeStr = startDate
                  ? `${String(startDate.getHours()).padStart(2, '0')}:${String(
                      startDate.getMinutes()
                    ).padStart(2, '0')} - ${
                      endDate
                        ? `${String(endDate.getHours()).padStart(2, '0')}:${String(
                            endDate.getMinutes()
                          ).padStart(2, '0')}`
                        : ''
                    }`
                  : 'Dia Inteiro';

                return (
                  <div
                    key={event.id}
                    className="bg-white border border-slate-200 hover:border-rose-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div className="space-y-3">
                      {/* Badge / Status */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {dateStr}
                        </span>
                        {event.hangoutLink && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <Video className="w-3 h-3 text-emerald-600" />
                            <span>Meet</span>
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-[#E60023] transition-colors">
                          {event.summary || '(Sem Título)'}
                        </h4>
                        {event.description && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>

                      {/* Details: Time & Location */}
                      <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{timeStr}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex items-center gap-2 text-slate-500">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">
                              {event.attendees.map((a) => a.email).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        {event.hangoutLink && (
                          <a
                            href={event.hangoutLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title="Entrar no Google Meet"
                          >
                            <Video className="w-4 h-4" />
                          </a>
                        )}
                        {event.htmlLink && (
                          <a
                            href={event.htmlLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                            title="Abrir no Google Calendar oficial"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditClick(event)}
                          className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                          title="Editar evento"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(event)}
                          className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Eliminar evento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal / Form: Create or Edit Event */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto border border-slate-100">
            <button
              onClick={resetForm}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E60023] uppercase tracking-wider">
                <CalendarIcon className="w-4 h-4" />
                <span>Google Calendar API</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingEventId
                  ? 'Editar Agendamento'
                  : 'Novo Agendamento no Google Calendar'}
              </h3>
              <p className="text-xs text-slate-500">
                Este evento será inserido no seu calendário com sincronização oficial e link de videoconferência.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título da Reunião / Assunto *
                </label>
                <input
                  type="text"
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Ex: Apresentação de Proposta Inspira #001"
                  required
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Data *
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Início *
                  </label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fim *
                  </label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Convidar Cliente / Email do Participante
                </label>
                <input
                  type="email"
                  value={formAttendee}
                  onChange={(e) => setFormAttendee(e.target.value)}
                  placeholder="cliente@empresa.pt"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Localização ou Sala
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Ex: Google Meet / Escritório Lisboa"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descrição & Pauta da Reunião
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Notas, tópicos a abordar e objetivos da sessão..."
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#E60023]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="meet-toggle"
                  checked={formMeetLink}
                  onChange={(e) => setFormMeetLink(e.target.checked)}
                  className="rounded text-[#E60023] focus:ring-[#E60023] w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="meet-toggle"
                  className="text-xs text-slate-700 font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Gerar link do Google Meet automaticamente</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#E60023] hover:bg-[#c9001f] text-white text-xs sm:text-sm font-bold shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CalendarCheck className="w-4 h-4" />
                  )}
                  <span>
                    {editingEventId ? 'Guardar Alterações' : 'Confirmar Agendamento'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog for Destructive / Mutating Operations */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 relative border border-slate-100 text-center space-y-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${
                confirmDialog.isDestructive
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {confirmDialog.isDestructive ? (
                <Trash2 className="w-7 h-7" />
              ) : (
                <AlertTriangle className="w-7 h-7" />
              )}
            </div>

            <h3 className="text-lg font-extrabold text-slate-900">
              {confirmDialog.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {confirmDialog.message}
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
                }
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={async () => {
                  const action = confirmDialog.onConfirm;
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
                  await action();
                }}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all ${
                  confirmDialog.isDestructive
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-[#E60023] hover:bg-[#c9001f]'
                }`}
              >
                {confirmDialog.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
