export type CalendarStyle = 'rice' | 'block';
export type SiteLanguage = 'pl' | 'en';

export type CalendarMonth = {
  year: number;
  month: number;
  label: string;
  shortLabel: string;
  days: number;
};

const MONTHS: Record<SiteLanguage, readonly string[]> = {
  pl: ['STYCZEŃ', 'LUTY', 'MARZEC', 'KWIECIEŃ', 'MAJ', 'CZERWIEC', 'LIPIEC', 'SIERPIEŃ', 'WRZESIEŃ', 'PAŹDZIERNIK', 'LISTOPAD', 'GRUDZIEŃ'],
  en: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
};

const SHORT_MONTHS: Record<SiteLanguage, readonly string[]> = {
  pl: ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU'],
  en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
};

export function parseMonth(value: string) {
  const parts = value.split('-');
  if (parts.length !== 2 || parts[0].length !== 4 || parts[1].length !== 2) {
    throw new Error('Invalid month format.');
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 0 || month > 11) {
    throw new Error('Invalid month.');
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

export function createMonths(start: string, end: string, language: SiteLanguage = 'pl'): CalendarMonth[] {
  const count = monthCount(start, end);
  if (count < 1 || count > 24) {
    throw new Error(language === 'pl' ? 'Zakres kalendarza musi obejmować od 1 do 24 miesięcy.' : 'The calendar range must cover 1 to 24 months.');
  }

  const from = parseMonth(start);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(from.year, from.month + index, 1));
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    return {
      year,
      month,
      label: MONTHS[language][month],
      shortLabel: SHORT_MONTHS[language][month],
      days: new Date(Date.UTC(year, month + 1, 0)).getUTCDate(),
    };
  });
}

export function calendarFileName(start: string, end: string, style: CalendarStyle, language: SiteLanguage) {
  const styleName = style === 'rice' ? (language === 'pl' ? 'ryz' : 'grain') : 'block';
  return 'the-awesome-calendar_' + language + '_' + start + '_' + end + '_' + styleName + '.pdf';
}

export function pageWord(count: number, language: SiteLanguage) {
  if (language === 'en') return count === 1 ? 'page' : 'pages';
  if (count === 1) return 'kartka';
  if (count > 1 && count < 5) return 'kartki';
  return 'kartek';
}
