const pad = (n: number) => String(n).padStart(2, '0');

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} às ${formatTime(iso)}`;
}

export function isPast(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

const decimal = (value: number, digits = 1) => value.toFixed(digits).replace('.', ',');

export const formatMs = (v: number) => `${decimal(v)} ms`;
export const spokenMs = (v: number) => `${decimal(v)} milissegundos`;
export const formatPct = (v: number) => `${decimal(v)}%`;
export const spokenPct = (v: number) => `${decimal(v)} por cento`;

export type PeriodId = 'madrugada' | 'manha' | 'tarde' | 'noite';

export const PERIOD_LABEL: Record<PeriodId, string> = {
  madrugada: 'Madrugada',
  manha: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite',
};

export function periodOf(iso: string): PeriodId {
  const h = new Date(iso).getHours();
  if (h < 6) return 'madrugada';
  if (h < 12) return 'manha';
  if (h < 18) return 'tarde';
  return 'noite';
}

export interface SlotGroup {
  key: string;
  label: string;
  slots: string[];
}

export function groupSlots(slots: string[]): SlotGroup[] {
  const sorted = [...slots].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  const groups: SlotGroup[] = [];
  for (const slot of sorted) {
    const key = `${formatDate(slot)}-${periodOf(slot)}`;
    let group = groups.find((g) => g.key === key);
    if (!group) {
      group = { key, label: `${PERIOD_LABEL[periodOf(slot)]} de ${formatShortDate(slot)}`, slots: [] };
      groups.push(group);
    }
    group.slots.push(slot);
  }
  return groups;
}

export function defaultSlot(slots: string[]): string | undefined {
  const sorted = [...slots].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  return sorted.find((s) => !isPast(s)) ?? sorted[sorted.length - 1];
}
