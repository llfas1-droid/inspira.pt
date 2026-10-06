/**
 * Serviço de Integração com Google Calendar API v3
 * Execução client-side autorizada com Access Token obtido via Firebase Google Auth
 */

export interface CalendarEventItem {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  htmlLink?: string;
  hangoutLink?: string;
  status?: string;
}

export interface CreateEventInput {
  summary: string;
  description?: string;
  location?: string;
  startDateTime: string; // ISO string
  endDateTime: string;   // ISO string
  attendeeEmail?: string;
  createMeetLink?: boolean;
}

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

/**
 * Lista eventos do Google Calendar primário
 */
export async function fetchCalendarEvents(
  accessToken: string,
  timeMin?: string,
  maxResults = 25
): Promise<CalendarEventItem[]> {
  const minTime = timeMin || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const url = `${CALENDAR_API_BASE}/calendars/primary/events?timeMin=${encodeURIComponent(
    minTime
  )}&singleEvents=true&orderBy=startTime&maxResults=${maxResults}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Erro ao consultar eventos do Google Calendar (${response.status})`
    );
  }

  const data = await response.json();
  return (data.items || []) as CalendarEventItem[];
}

/**
 * Cria um novo evento no Google Calendar
 */
export async function createCalendarEvent(
  accessToken: string,
  input: CreateEventInput
): Promise<CalendarEventItem> {
  const url = `${CALENDAR_API_BASE}/calendars/primary/events?conferenceDataVersion=1`;

  const attendees = input.attendeeEmail
    ? [{ email: input.attendeeEmail }]
    : [];

  const body: any = {
    summary: input.summary,
    description: input.description,
    location: input.location,
    start: {
      dateTime: input.startDateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Lisbon',
    },
    end: {
      dateTime: input.endDateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Lisbon',
    },
    attendees,
    reminders: {
      useDefault: true,
    },
  };

  if (input.createMeetLink) {
    body.conferenceData = {
      createRequest: {
        requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Erro ao criar evento no Google Calendar (${response.status})`
    );
  }

  return (await response.json()) as CalendarEventItem;
}

/**
 * Atualiza um evento existente no Google Calendar
 */
export async function updateCalendarEvent(
  accessToken: string,
  eventId: string,
  input: CreateEventInput
): Promise<CalendarEventItem> {
  const url = `${CALENDAR_API_BASE}/calendars/primary/events/${encodeURIComponent(eventId)}`;

  const attendees = input.attendeeEmail
    ? [{ email: input.attendeeEmail }]
    : [];

  const body: any = {
    summary: input.summary,
    description: input.description,
    location: input.location,
    start: {
      dateTime: input.startDateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Lisbon',
    },
    end: {
      dateTime: input.endDateTime,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Lisbon',
    },
    attendees,
  };

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Erro ao atualizar evento no Google Calendar (${response.status})`
    );
  }

  return (await response.json()) as CalendarEventItem;
}

/**
 * Remove um evento do Google Calendar
 */
export async function deleteCalendarEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  const url = `${CALENDAR_API_BASE}/calendars/primary/events/${encodeURIComponent(eventId)}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 204) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Erro ao eliminar evento do Google Calendar (${response.status})`
    );
  }
}
