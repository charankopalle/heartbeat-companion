// Local persistence of vitals events and alerts (no backend required).

export interface HistoryEvent {
  id: string;
  ts: number;
  type: "vitals" | "alert" | "info";
  title: string;
  bpm: number | null;
  level: "normal" | "medium" | "high";
}

const KEY = "cardioband.history.v1";
const MAX = 200;

export function loadHistory(): HistoryEvent[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function pushHistory(ev: Omit<HistoryEvent, "id">) {
  const list = loadHistory();
  list.unshift({ ...ev, id: crypto.randomUUID() });
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
}

export function clearHistory() { localStorage.removeItem(KEY); }
