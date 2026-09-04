export type CalendarStyle = 'rice' | 'block';
export type SiteLanguage = 'pl' | 'en';

export type CalendarDay = {
  iso: string;
  year: number;
  month: number;
  day: number;
  weekday: number;
  weekdayLabel: string;
  monthLabel: string;
  isoWeek: number;
  isWeekend: boolean;
  startsMonth: boolean;
  startsYear: boolean;
};

const DAY_MS = 86_400_000;
export const MAX_RANGE_YEARS = 70;

const MONTHS: Record<SiteLanguage, readonly string[]> = {
  pl: ['STYCZEŃ', 'LUTY', 'MARZEC', 'KWIECIEŃ', 'MAJ', 'CZERWIEC', 'LIPIEC', 'SIERPIEŃ', 'WRZESIEŃ', 'PAŹDZIERNIK', 'LISTOPAD', 'GRUDZIEŃ'],
  en: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
};

const WEEKDAYS: Record<SiteLanguage, readonly string[]> = {
  pl: ['N', 'P', 'W', 'Ś', 'C', 'P', 'S'],
  en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
};

function utcDate(year: number, month: number, day: number) {
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month, day);
  return date;
}

export function parseDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error('Invalid date format.');

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  if (year < 1900 || year > 9999 || month < 0 || month > 11 || day < 1 || day > 31) {
    throw new Error('Invalid date.');
  }

  const date = utcDate(year, month, day);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) {
    throw new Error('Invalid date.');
  }
  return date;
}

export function dateValue(date: Date) {
  return [
    String(date.getUTCFullYear()).padStart(4, '0'),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

export function currentDateValue() {
  const now = new Date();
  return [
    String(now.getFullYear()).padStart(4, '0'),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
}

export function addDaysValue(value: string, amount: number) {
  const date = parseDate(value);
  date.setUTCDate(date.getUTCDate() + amount);
  return dateValue(date);
}

export function addYearsValue(value: string, amount: number) {
  const source = parseDate(value);
  const date = utcDate(source.getUTCFullYear() + amount, source.getUTCMonth(), source.getUTCDate());
  return dateValue(date);
}

export function defaultEndDateValue(start: string) {
  return addDaysValue(addYearsValue(start, 1), -1);
}

export function maxEndDateValue(start: string) {
  try {
    return addDaysValue(addYearsValue(start, MAX_RANGE_YEARS), -1);
  } catch {
    return '9999-12-31';
  }
}

export function dayCount(start: string, end: string) {
  try {
    const from = parseDate(start);
    const to = parseDate(end);
    if (to < from) return 0;
    return Math.floor((to.getTime() - from.getTime()) / DAY_MS) + 1;
  } catch {
    return 0;
  }
}

export function rangeUnits(start: string, end: string) {
  const days = dayCount(start, end);
  if (days === 0) return { days: 0, months: 0, years: 0 };

  const from = parseDate(start);
  const inclusiveEnd = parseDate(end);
  const exclusiveEnd = new Date(inclusiveEnd.getTime() + DAY_MS);
  let months = (exclusiveEnd.getUTCFullYear() - from.getUTCFullYear()) * 12
    + exclusiveEnd.getUTCMonth() - from.getUTCMonth();
  if (exclusiveEnd.getUTCDate() < from.getUTCDate()) months -= 1;
  months = Math.max(0, months);
  return { days, months, years: Math.floor(months / 12) };
}

export function rangeComment(units: { days: number; years: number }, language: SiteLanguage) {
  const polishByDay: Record<number, string> = {
    1: 'Szykują się grube plany, widzę.',
    2: 'Nie w jeden dzień Rzym zbudowano, huh?',
    3: 'Trzy zawsze perfekcyjne!',
    4: 'Nic ciekawego nie wymyśliliśmy dla 4 dni.',
    5: 'Piąteczka!',
    6: 'Szósteczka!',
    7: 'Wygląda jak co najmniej dwa dni weekendu 🙌',
    8: 'Kontynuuj...',
  };
  const englishByDay: Record<number, string> = {
    1: 'Big plans ahead, I see.',
    2: 'Rome was not built in a day, huh?',
    3: 'Three is always perfect!',
    4: 'We came up with nothing interesting for 4 days.',
    5: 'High five!',
    6: 'A neat six!',
    7: 'Looks like at least two weekend days 🙌',
    8: 'Keep going...',
  };
  if (units.days >= 1 && units.days <= 8) {
    return language === 'pl' ? polishByDay[units.days] : englishByDay[units.days];
  }

  if (units.years >= 70) return language === 'pl' ? 'Masz nas. To koniec.' : 'You got us. This is the end.';
  if (units.years >= 60) return language === 'pl' ? 'Plany na pół życia!' : 'Plans for half a lifetime!';
  if (units.years >= 30) return language === 'pl' ? 'Sprawdzasz nasze granice, nie? 😏' : 'Testing our limits, are you? 😏';
  if (units.years >= 20) return language === 'pl' ? 'Wylądujemy już na Marsie?' : 'Will we have landed on Mars by then?';
  if (units.years >= 10) {
    return language === 'pl'
      ? 'Przeciętny czas życia ptasznika to 10–20 lat (samce żyją wyraźnie krócej).'
      : 'A tarantula typically lives 10–20 years (males live noticeably shorter lives).';
  }
  if (units.years >= 5) {
    return language === 'pl'
      ? 'Idę o zakład, że nie masz takiej ściany, żeby to powiesić.'
      : 'I bet you do not have a wall long enough for this.';
  }
  if (units.years >= 2) return language === 'pl' ? 'Skok w przyszłość?' : 'A leap into the future?';
  return '';
}

function lastDayOfFebruary(year: number) {
  return utcDate(year, 2, 0).getUTCDate();
}

function nextSeason(
  reference: Date,
  label: string,
  startMonth: number,
  startDay: number,
  endMonth: number,
  endDay: number,
) {
  let year = reference.getUTCFullYear();
  let start = utcDate(year, startMonth, startDay);
  let end = utcDate(year, endMonth, endDay);
  if (reference > end) {
    year += 1;
    start = utcDate(year, startMonth, startDay);
    end = utcDate(year, endMonth, endDay);
  }
  return { label: `${label} ${year}`, start: dateValue(start), end: dateValue(end) };
}

export function polishRangePresets(referenceValue: string) {
  const reference = parseDate(referenceValue);
  let holidayYear = reference.getUTCFullYear();
  if (reference > utcDate(holidayYear, 7, 31)) holidayYear += 1;
  const holidayStart = utcDate(holidayYear, 5, 21);
  holidayStart.setUTCDate(holidayStart.getUTCDate() + (6 - holidayStart.getUTCDay() + 7) % 7);

  let winterStartYear = reference.getUTCFullYear();
  if (reference.getUTCMonth() <= 1) winterStartYear -= 1;
  let winterEndYear = winterStartYear + 1;
  let winterEnd = utcDate(winterEndYear, 1, lastDayOfFebruary(winterEndYear));
  if (reference > winterEnd) {
    winterStartYear += 1;
    winterEndYear += 1;
    winterEnd = utcDate(winterEndYear, 1, lastDayOfFebruary(winterEndYear));
  }

  const nextYear = reference.getUTCFullYear() + 1;
  return [
    {
      label: 'Rok od teraz 🗓️',
      start: referenceValue,
      end: defaultEndDateValue(referenceValue),
    },
    {
      label: `${nextYear} rok 🔮`,
      start: dateValue(utcDate(nextYear, 0, 1)),
      end: dateValue(utcDate(nextYear, 11, 31)),
    },
    {
      label: `Wakacje ${holidayYear} 🏖️`,
      start: dateValue(holidayStart),
      end: dateValue(utcDate(holidayYear, 7, 31)),
    },
    nextSeason(reference, 'Wiosna 🌱', 2, 1, 4, 31),
    nextSeason(reference, 'Lato ☀️', 5, 1, 7, 31),
    nextSeason(reference, 'Jesień 🍂', 8, 1, 10, 30),
    {
      label: `Zima ${winterStartYear}/${String(winterEndYear).slice(-2)} ❄️`,
      start: dateValue(utcDate(winterStartYear, 11, 1)),
      end: dateValue(winterEnd),
    },
    { label: 'Zaskocz mnie 🎲', random: true as const },
  ];
}

export function randomCalendarRange(referenceValue: string) {
  const durations = [7, 14, 21, 30, 60, 90, 180, 365];
  const startOffset = Math.floor(Math.random() * 366);
  const duration = durations[Math.floor(Math.random() * durations.length)];
  const start = addDaysValue(referenceValue, startOffset);
  return { start, end: addDaysValue(start, duration - 1) };
}

export function rangeIsValid(start: string, end: string) {
  try {
    const from = parseDate(start);
    const to = parseDate(end);
    const exclusiveLimit = parseDate(addYearsValue(start, MAX_RANGE_YEARS));
    return to >= from && to < exclusiveLimit;
  } catch {
    return false;
  }
}

function isoWeekNumber(date: Date) {
  const thursday = new Date(date.getTime());
  thursday.setUTCDate(thursday.getUTCDate() + 4 - (thursday.getUTCDay() || 7));
  const yearStart = utcDate(thursday.getUTCFullYear(), 0, 1);
  return Math.ceil(((thursday.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7);
}

export function createDays(start: string, end: string, language: SiteLanguage): CalendarDay[] {
  if (!rangeIsValid(start, end)) {
    throw new Error(rangeError(language));
  }

  const count = dayCount(start, end);
  const from = parseDate(start);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(from.getTime() + index * DAY_MS);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const weekday = date.getUTCDay();
    return {
      iso: dateValue(date),
      year,
      month,
      day,
      weekday,
      weekdayLabel: WEEKDAYS[language][weekday],
      monthLabel: MONTHS[language][month],
      isoWeek: isoWeekNumber(date),
      isWeekend: weekday === 0 || weekday === 6,
      startsMonth: index === 0 || day === 1,
      startsYear: index === 0 || (month === 0 && day === 1),
    };
  });
}

export function calendarFileName(start: string, end: string, style: CalendarStyle, language: SiteLanguage, extension = 'pdf') {
  const styleName = style === 'rice' ? (language === 'pl' ? 'ryz' : 'grain') : 'block';
  return 'the-awesome-calendar_' + language + '_' + start + '_' + end + '_' + styleName + '.' + extension;
}

export function rangeError(language: SiteLanguage) {
  return language === 'pl'
    ? 'Ten zakres nie przejdzie. Spróbuj inaczej.'
    : 'That range will not work. Try another one.';
}

export function dayWord(count: number, language: SiteLanguage) {
  if (language === 'en') return count === 1 ? 'day' : 'days';
  if (count === 1) return 'dzień';
  return 'dni';
}

export function monthWord(count: number, language: SiteLanguage) {
  if (language === 'en') return count === 1 ? 'month' : 'months';
  const lastTwo = count % 100;
  const last = count % 10;
  if (count === 1) return 'miesiąc';
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'miesiące';
  return 'miesięcy';
}

export function yearWord(count: number, language: SiteLanguage) {
  if (language === 'en') return count === 1 ? 'year' : 'years';
  const lastTwo = count % 100;
  const last = count % 10;
  if (count === 1) return 'rok';
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'lata';
  return 'lat';
}

export function pageWord(count: number, language: SiteLanguage) {
  if (language === 'en') return count === 1 ? 'page' : 'pages';
  if (count === 1) return 'kartka';
  if (count > 1 && count < 5) return 'kartki';
  return 'kartek';
}
