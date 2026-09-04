export type CalendarStyle = 'rice' | 'block';

export type CalendarMonth = {
  year: number;
  month: number;
  label: string;
  shortLabel: string;
  days: number;
};

export const MONTHS = [
  'STYCZEŃ', 'LUTY', 'MARZEC', 'KWIECIEŃ', 'MAJ', 'CZERWIEC',
  'LIPIEC', 'SIERPIEŃ', 'WRZESIEŃ', 'PAŹDZIERNIK', 'LISTOPAD', 'GRUDZIEŃ',
] as const;

export const SHORT_MONTHS = [
  'STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE',
  'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU',
] as const;

export function parseMonth(value: string) {
  const parts = value.split('-');
  if (parts.length !== 2 || parts[0].length !== 4 || parts[1].length !== 2) {
    throw new Error('Nieprawidłowy format miesiąca.');
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 0 || month > 11) {
    throw new Error('Nieprawidłowy miesiąc.');
  }
  return { year, month };
}

export function monthCount(start: string, end: string) {
  try {
    const from = parseMonth(start);
    const to = parseMonth(end);
    return (to.year - from.year) * 12 + to.month - from.month + 1;
  } catch {
    return 0;
  }
}

export function addMonths(value: string, amount: number) {
  const { year, month } = parseMonth(value);
  const date = new Date(Date.UTC(year, month + amount, 1));
  return String(date.getUTCFullYear()) + '-' + String(date.getUTCMonth() + 1).padStart(2, '0');
}

export function currentMonthValue() {
  const now = new Date();
  return String(now.getFullYear()) + '-' + String(now.getMonth() + 1).padStart(2, '0');
}

export function createMonths(start: string, end: string): CalendarMonth[] {
  const count = monthCount(start, end);
  if (count < 1 || count > 24) {
    throw new Error('Zakres kalendarza musi obejmować od 1 do 24 miesięcy.');
  }

  const from = parseMonth(start);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(from.year, from.month + index, 1));
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    return {
      year,
      month,
      label: MONTHS[month],
      shortLabel: SHORT_MONTHS[month],
      days: new Date(Date.UTC(year, month + 1, 0)).getUTCDate(),
    };
  });
}

export function calendarFileName(start: string, end: string, style: CalendarStyle) {
  return 'the-awesome-calendar_' + start + '_' + end + '_' + (style === 'rice' ? 'ryz' : 'blok') + '.pdf';
}

export function pageWord(count: number) {
  if (count === 1) return 'kartka';
  if (count > 1 && count < 5) return 'kartki';
  return 'kartek';
}
