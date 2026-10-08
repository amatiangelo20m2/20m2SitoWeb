/**
 * Calendario serate 20m2 · ottobre 2026 – aprile 2027.
 * Fonte: "Calendario_20m2_Ottobre_2026_Aprile_2027" (PDF).
 *
 * Una riga per data: [data, Monopoli, Cisternino].
 *  - "Karaoke"        → serata karaoke
 *  - "Da definire"    → cover band non ancora comunicata
 *  - "Nessun evento"  → locale senza serata
 *  - qualsiasi altro nome → cover band (es. "Vasco Rossi")
 * Le date in SPECIAL_NIGHTS hanno un titolo speciale (es. Festa della Donna).
 *
 * Per aggiornare il calendario basta modificare questa tabella.
 */
export const SCHEDULE: ReadonlyArray<readonly [date: string, monopoli: string, cisternino: string]> = [
  ['2026-10-12', 'Karaoke', 'Tiziano Ferro'],
  ['2026-10-15', 'Vasco Rossi', 'Karaoke'],
  ['2026-10-19', 'Karaoke', 'Gigi'],
  ['2026-10-22', 'Marco Mengoni', 'Karaoke'],
  ['2026-10-26', 'Karaoke', '883'],
  ['2026-10-29', 'Tiziano Ferro', 'Karaoke'],
  ['2026-11-02', 'Karaoke', 'Da definire'],
  ['2026-11-05', 'Negramaro', 'Karaoke'],
  ['2026-11-09', 'Karaoke', 'Vasco Rossi'],
  ['2026-11-12', '883', 'Karaoke'],
  ['2026-11-16', 'Karaoke', 'Eros'],
  ['2026-11-19', 'Modà', 'Karaoke'],
  ['2026-11-23', 'Karaoke', 'Negramaro'],
  ['2026-11-26', 'Cremonini', 'Karaoke'],
  ['2026-11-30', 'Karaoke', 'Biagio'],
  ['2026-12-03', 'Eros', 'Karaoke'],
  ['2026-12-07', 'Karaoke', 'Da definire'],
  ['2026-12-10', 'Gigi', 'Karaoke'],
  ['2026-12-14', 'Karaoke', 'Cremonini'],
  ['2026-12-17', 'Biagio', 'Karaoke'],
  ['2026-12-21', 'Karaoke', 'Da definire'],
  ['2026-12-24', 'Nessun evento', 'Nessun evento'],
  ['2026-12-28', 'Karaoke', 'Da definire'],
  ['2026-12-31', 'Nessun evento', 'Nessun evento'],
  ['2027-01-04', 'Nessun evento', 'Nessun evento'],
  ['2027-01-07', 'Nessun evento', 'Nessun evento'],
  ['2027-01-11', 'Karaoke', 'Eros'],
  ['2027-01-14', 'Tiziano Ferro', 'Karaoke'],
  ['2027-01-18', 'Karaoke', 'Negramaro'],
  ['2027-01-21', 'Biagio', 'Karaoke'],
  ['2027-01-25', 'Karaoke', 'Tiziano Ferro'],
  ['2027-01-28', 'Negramaro', 'Karaoke'],
  ['2027-02-01', 'Karaoke', 'Biagio'],
  ['2027-02-04', 'Eros', 'Karaoke'],
  ['2027-02-08', 'Karaoke', 'Gigi'],
  ['2027-02-11', 'Vasco Rossi', 'Karaoke'],
  ['2027-02-15', 'Karaoke', '883'],
  ['2027-02-18', 'Gigi', 'Karaoke'],
  ['2027-02-22', 'Karaoke', 'Vasco Rossi'],
  ['2027-02-25', 'Cremonini', 'Karaoke'],
  ['2027-03-01', 'Karaoke', 'Eros'],
  ['2027-03-04', 'Tiziano Ferro', 'Karaoke'],
  ['2027-03-08', 'Eros', 'Tiziano Ferro'],
  ['2027-03-11', 'Marco Mengoni', 'Karaoke'],
  ['2027-03-15', 'Karaoke', 'Biagio'],
  ['2027-03-18', 'Negramaro', 'Karaoke'],
  ['2027-03-22', 'Karaoke', 'Tiziano Ferro'],
  ['2027-03-25', 'Modà', 'Karaoke'],
  ['2027-03-29', 'Nessun evento', 'Nessun evento'],
  ['2027-04-01', '883', 'Karaoke'],
  ['2027-04-05', 'Karaoke', 'Gigi'],
  ['2027-04-08', 'Vasco Rossi', 'Karaoke'],
  ['2027-04-12', 'Karaoke', 'Negramaro'],
  ['2027-04-15', 'Tiziano Ferro', 'Karaoke'],
  ['2027-04-19', 'Karaoke', 'Vasco Rossi'],
  ['2027-04-22', 'Gigi', 'Karaoke'],
  ['2027-04-26', 'Karaoke', 'Tiziano Ferro'],
  ['2027-04-29', 'Modà', 'Karaoke'],
];

export const SPECIAL_NIGHTS: Readonly<Record<string, string>> = {
  '2027-03-08': 'Festa della Donna',
};

export type EventType = 'coverband' | 'karaoke' | 'festa';
export type Venue = 'cisternino' | 'monopoli';
export interface ClubEvent {
  id: string;
  date: string;
  title: string;
  /** Nome della cover band (es. "Vasco Rossi"); vuoto per karaoke e band da annunciare. */
  artist: string;
  type: EventType;
  venue: Venue;
  description: string;
}

export const EVENT_TYPES: ReadonlyArray<{ id: EventType; label: string; icon: string; color: string }> = [
  { id: 'coverband', label: 'Cover band', icon: 'guitar', color: '#eab26a' },
  { id: 'karaoke', label: 'Karaoke', icon: 'mic', color: '#68c3ca' },
  { id: 'festa', label: 'Serata speciale', icon: 'music', color: '#e58fae' },
];

function toEvent(date: string, venue: Venue, entry: string): ClubEvent | null {
  const value = entry.trim();
  if (!value || value === 'Nessun evento') return null;
  const id = `${date}-${venue}`;
  const special = SPECIAL_NIGHTS[date];
  if (value === 'Karaoke') {
    return { id, date, venue, type: 'karaoke', artist: '', title: special ? `${special} · Karaoke` : 'Karaoke',
      description: 'Scegli la tua canzone e prendi il microfono: al 20m2 il ritornello lo cantiamo tutti insieme.' };
  }
  if (value === 'Da definire') {
    return { id, date, venue, type: special ? 'festa' : 'coverband', artist: '', title: special ? `${special} · Cover band` : 'Cover band da annunciare',
      description: 'Serata live con cover band: il nome sarà annunciato a breve.' };
  }
  if (special) {
    return { id, date, venue, type: 'festa', artist: value, title: `${special} · ${value}`,
      description: `${special} al 20m2 con la cover band ${value}: una serata speciale, tutta da cantare.` };
  }
  return { id, date, venue, type: 'coverband', artist: value, title: value,
    description: `Cover band ${value}: i grandi successi suonati dal vivo, da cantare insieme dal primo all’ultimo brano.` };
}

export const EVENTS: ReadonlyArray<ClubEvent> = SCHEDULE.flatMap(([date, monopoli, cisternino]) =>
  [toEvent(date, 'monopoli', monopoli), toEvent(date, 'cisternino', cisternino)].filter((e): e is ClubEvent => e !== null),
);

/** Primo e ultimo mese con serate in calendario (formato YYYY-MM). */
export const SEASON = { first: SCHEDULE[0][0].slice(0, 7), last: SCHEDULE[SCHEDULE.length - 1][0].slice(0, 7) };

export function monthDays(year: number, month: number) {
  const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const length = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return Array.from({ length: Math.ceil((offset + length) / 7) * 7 }, (_, i) => {
    const d = new Date(Date.UTC(year, month, i - offset + 1));
    return { date: d.toISOString().slice(0, 10), day: d.getUTCDate(), inside: d.getUTCMonth() === month };
  });
}

export function monthEvents(month: string): ClubEvent[] {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return [];
  return EVENTS.filter((e) => e.date.startsWith(month + '-'));
}

export function filterEvents(events: ClubEvent[], venue = 'all', type = 'all', query = '') {
  const text = query.trim().toLocaleLowerCase('it-IT');
  return events.filter(
    (e) =>
      (venue === 'all' || e.venue === venue) &&
      (type === 'all' || e.type === type) &&
      `${e.title} ${e.artist} ${e.venue} ${e.description}`.toLocaleLowerCase('it-IT').includes(text),
  );
}

export function findEvent(id: string): ClubEvent | undefined {
  return EVENTS.find((e) => e.id === id);
}

export function dateLabel(date: string) {
  return new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(date + 'T12:00:00Z'),
  );
}

export function isFutureDate(date: string, today: string) {
  return date > today;
}

/** L'orario non è indicato nel calendario: l'evento viene aggiunto a Google Calendar come "tutto il giorno". */
export function googleCalendarUrl(event: ClubEvent, venue: { name: string; address: string }) {
  const start = event.date.replace(/-/g, '');
  const next = new Date(event.date + 'T12:00:00Z');
  next.setUTCDate(next.getUTCDate() + 1);
  const end = next.toISOString().slice(0, 10).replace(/-/g, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `20m2 ${venue.name} · ${event.title}`,
    dates: `${start}/${end}`,
    ctz: 'Europe/Rome',
    location: `20m2 ${venue.name}, ${venue.address}`,
    details: `${event.description}\n\nhttps://20m2official.it/calendar?month=${event.date.slice(0, 7)}&event=${encodeURIComponent(event.id)}`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
