export interface ReviewAuditEntry {
  id: string;
  eventId: string;
  zoneId: string;
  actor: string;
  action: 'note-saved' | 'marked-reviewed';
  note: string;
  at: string;
}

const keyFor = (eventId: string, zoneId: string) => `disasterlens.review.${eventId}.${zoneId}`;

export function loadReviewAudit(eventId: string, zoneId: string): ReviewAuditEntry[] {
  try { const value = JSON.parse(localStorage.getItem(keyFor(eventId, zoneId)) ?? '[]'); return Array.isArray(value) ? value : []; } catch { return []; }
}

export function appendReviewAudit(entry: Omit<ReviewAuditEntry, 'id' | 'at'>): ReviewAuditEntry {
  const next = { ...entry, id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, at: new Date().toISOString() };
  const history = [...loadReviewAudit(entry.eventId, entry.zoneId), next];
  localStorage.setItem(keyFor(entry.eventId, entry.zoneId), JSON.stringify(history)); return next;
}
