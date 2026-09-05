export type CalendarStyle = 'rice' | 'block';
export type CalendarFormat = 'standard' | 'tall' | 'big';
export type SiteLanguage = 'pl' | 'en';

export type CalendarRangePreset = {
  end: string;
  group: 'calendar' | 'duration' | 'quick';
  label: string;
  start: string;
} | {
  group: 'random';
  label: string;
  random: true;
};

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

export function addMonthsValue(value: string, amount: number) {
  const source = parseDate(value);
  const targetMonthIndex = source.getUTCMonth() + amount;
  const targetYear = source.getUTCFullYear() + Math.floor(targetMonthIndex / 12);
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12;
  const lastTargetDay = utcDate(targetYear, targetMonth + 1, 0).getUTCDate();
  return dateValue(utcDate(targetYear, targetMonth, Math.min(source.getUTCDate(), lastTargetDay)));
}

export function addYearsValue(value: string, amount: number) {
  return addMonthsValue(value, amount * 12);
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
  if (days === 0) {
    return { days: 0, months: 0, remainingDays: 0, remainingMonths: 0, years: 0 };
  }

  const from = parseDate(start);
  const inclusiveEnd = parseDate(end);
  const exclusiveEnd = new Date(inclusiveEnd.getTime() + DAY_MS);
  let years = exclusiveEnd.getUTCFullYear() - from.getUTCFullYear();
  let yearAnchorValue = addYearsValue(start, years);
  if (parseDate(yearAnchorValue) > exclusiveEnd) {
    years -= 1;
    yearAnchorValue = addYearsValue(start, years);
  }

  const yearAnchor = parseDate(yearAnchorValue);
  let remainingMonths = (exclusiveEnd.getUTCFullYear() - yearAnchor.getUTCFullYear()) * 12
    + exclusiveEnd.getUTCMonth() - yearAnchor.getUTCMonth();
  let monthAnchorValue = addMonthsValue(yearAnchorValue, remainingMonths);
  if (parseDate(monthAnchorValue) > exclusiveEnd) {
    remainingMonths -= 1;
    monthAnchorValue = addMonthsValue(yearAnchorValue, remainingMonths);
  }

  const monthAnchor = parseDate(monthAnchorValue);
  const remainingDays = Math.max(0, Math.floor((exclusiveEnd.getTime() - monthAnchor.getTime()) / DAY_MS));
  return {
    days,
    months: years * 12 + remainingMonths,
    remainingDays,
    remainingMonths,
    years,
  };
}

type RangeCommentCopy = string | readonly string[];

function pickRangeComment(copy: RangeCommentCopy | undefined) {
  if (!copy) return '';
  if (typeof copy === 'string') return copy;
  return copy[Math.floor(Math.random() * copy.length)] ?? '';
}

export function rangeComment(units: { days: number; months: number; years: number }, language: SiteLanguage) {
  const polishByDay: Record<number, RangeCommentCopy> = {
    1: 'Szykują się grube plany, widzę.',
    2: 'Nie w jeden dzień Rzym zbudowano, huh?',
    3: 'Trzy zawsze perfekcyjne!',
    4: 'Nic ciekawego nie wymyśliliśmy dla 4 dni.',
    5: 'Piąteczka!',
    6: 'Szósteczka!',
    7: 'Wygląda jak co najmniej dwa dni weekendu 🙌',
    8: 'Kontynuuj...',
    10: 'Nadal możesz odliczać na palcach.',
    11: 'W 1752 roku Brytyjczycy wykreślili z kalendarza 11 dni.',
    12: 'Tuzin dni!',
    14: [
      'Po angielsku to „fortnight”. Niby brzmi jak gra, a jest jednostką czasu.',
      'Yeah - cztery dni weekendu!',
    ],
    15: 'Pół miesiąca, jeśli miesiąc zechce współpracować.',
    16: 'Sweeeet sixteen!',
    21: 'Podobno tyle wystarczy na nawyk. Podobno.',
    24: 'Idealne na kalendarz adwentowy! Zmieścisz czekoladę w te okienka?',
    25: 'Ćwierć setki. Mały jubileusz dużego planu.',
    27: 'Księżyc zdąży mniej więcej okrążyć Ziemię.',
    28: [
      'Równe cztery tygodnie. Podejrzanie schludnie.',
      'Idealny czas na luty.',
    ],
    29: 'Idealny czas na luty.',
    31: 'Miesiąc w wersji XL.',
    40: 'Od czterdziestu dni wzięła nazwę kwarantanna. Miłego planowania.',
    41: 'Czterdzieści nie wystarczyło. Szanujemy rozmach.',
    42: 'Czyżby ten czas miał dać Ci odpowiedź na wielkie pytanie o życie, wszechświat i całą resztę?',
    43: 'Sens życia plus jeden dzień buforu.',
    66: 'Route 66, tylko bez samochodu i z większą liczbą kartek.',
    67: 'eghm.',
    69: '😶',
    80: 'W sam raz na podróż dookoła świata. Teoretycznie.',
    90: 'Kwartał. Korporacja właśnie zainteresowała się Twoimi KPI.',
    100: 'STO DNI! 🎂',
    180: 'Pół roku po zaokrągleniu przez optymistę.',
    182: 'Prawie pół roku. Jeszcze nie otwieraj szampana.',
    183: 'Już ponad pół roku. Teraz możesz otworzyć.',
    256: 'Co za piękna, okrągła liczba 💻',
    365: 'Ziemia robi kółko. Ty robisz plan.',
    366: 'Rok dostał dzień gratis.',
    666: 'Drukarka może zacząć wydawać niepokojące dźwięki.',
  };
  const englishByDay: Record<number, RangeCommentCopy> = {
    1: 'Big plans ahead, I see.',
    2: 'Rome was not built in a day, huh?',
    3: 'Three is always perfect!',
    4: 'We came up with nothing interesting for 4 days.',
    5: 'High five!',
    6: 'A neat six!',
    7: 'Looks like at least two weekend days 🙌',
    8: 'Keep going...',
    10: 'You can still count them on your fingers.',
    11: 'In 1752, the British removed 11 days from the calendar.',
    12: 'A dozen days!',
    14: [
      'In English, that is a fortnight. It may sound like a game, but it is a unit of time.',
      'Yeah - four weekend days!',
    ],
    15: 'Half a month, if the month decides to cooperate.',
    16: 'Sweeeet sixteen!',
    21: 'Apparently that is enough to form a habit. Apparently.',
    24: 'Perfect for an Advent calendar! Can you fit chocolate into those little windows?',
    25: 'A quarter of a hundred. A small milestone for a big plan.',
    27: 'The Moon will just about make one orbit around Earth.',
    28: [
      'Exactly four weeks. Suspiciously tidy.',
      'The perfect length for February.',
    ],
    29: 'The perfect length for February.',
    31: 'A month in XL.',
    40: 'Quarantine got its name from forty days. Happy planning.',
    41: 'Forty was not enough. We respect the ambition.',
    42: 'Could this be enough time to answer the great question of life, the universe and everything?',
    43: 'The meaning of life plus one buffer day.',
    66: 'Route 66, only without the car and with more sheets of paper.',
    67: 'ahem.',
    69: '😶',
    80: 'Just enough time to travel around the world. Theoretically.',
    90: 'A quarter. Corporate just took an interest in your KPIs.',
    100: 'ONE HUNDRED DAYS! 🎂',
    180: 'Half a year, rounded by an optimist.',
    182: 'Almost half a year. Do not pop the champagne yet.',
    183: 'More than half a year. You can open it now.',
    256: 'What a beautiful, round number 💻',
    365: 'Earth makes a lap. You make a plan.',
    366: 'The year got a bonus day.',
    666: 'The printer may start making unsettling noises.',
  };

  const dayComment = language === 'pl' ? polishByDay[units.days] : englishByDay[units.days];
  if (dayComment) return pickRangeComment(dayComment);

  if (units.months === 9) {
    return language === 'pl'
      ? 'Gratulacje? Jakiś baby shower w planie?'
      : 'Congratulations? Is there a baby shower in the plan?';
  }

  if (units.years === 67) return language === 'pl' ? 'EGHM!' : 'AHEM!';
  if (units.years === 18) return language === 'pl' ? 'Ktoś tu osiągnął pełnoletniość' : 'Someone just came of age';
  if (units.years === 2) {
    return language === 'pl'
      ? 'Mars zdąży mniej więcej okrążyć Słońce. Ty też możesz coś domknąć.'
      : 'Mars will just about orbit the Sun. You can wrap something up too.';
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

export function rangePresets(referenceValue: string, language: SiteLanguage) {
  const reference = parseDate(referenceValue);
  const referenceYear = reference.getUTCFullYear();
  const referenceMonth = reference.getUTCMonth();
  const schoolStartYear = referenceMonth >= 6 ? referenceYear : referenceYear - 1;
  const schoolYearLabel = `${schoolStartYear}/${String(schoolStartYear + 1).slice(-2)}`;
  const springSemester = referenceMonth < 6;
  const semesterStart = springSemester
    ? utcDate(referenceYear, 0, 1)
    : utcDate(referenceYear, 8, 1);
  const semesterEnd = springSemester
    ? utcDate(referenceYear, 5, 30)
    : utcDate(referenceYear + 1, 0, 31);
  const semesterYearLabel = springSemester
    ? String(referenceYear)
    : `${referenceYear}/${String(referenceYear + 1).slice(-2)}`;
  let holidayYear = reference.getUTCFullYear();
  if (reference > utcDate(holidayYear, 7, 31)) holidayYear += 1;
  const holidayStart = utcDate(holidayYear, 5, 21);
  holidayStart.setUTCDate(holidayStart.getUTCDate() + (6 - holidayStart.getUTCDay() + 7) % 7);
  let gardenYear = referenceYear;
  if (reference > utcDate(gardenYear, 9, 31)) gardenYear += 1;
  const nextYear = referenceYear + 1;
  const presets: CalendarRangePreset[] = [
    {
      group: 'quick',
      label: language === 'pl' ? '30 dni' : '30 days',
      start: referenceValue,
      end: addDaysValue(referenceValue, 29),
    },
    {
      group: 'quick',
      label: language === 'pl' ? 'Kwartał' : 'Quarter',
      start: referenceValue,
      end: addDaysValue(referenceValue, 89),
    },
    {
      group: 'quick',
      label: language === 'pl' ? 'Rok od teraz 🗓️' : 'One year from now 🗓️',
      start: referenceValue,
      end: defaultEndDateValue(referenceValue),
    },
    {
      group: 'quick',
      label: language === 'pl' ? 'Do końca roku' : 'Until year-end',
      start: referenceValue,
      end: dateValue(utcDate(referenceYear, 11, 31)),
    },
    {
      group: 'duration',
      label: language === 'pl' ? '12 tygodni' : '12 weeks',
      start: referenceValue,
      end: addDaysValue(referenceValue, 83),
    },
    {
      group: 'duration',
      label: language === 'pl' ? '100 dni' : '100 days',
      start: referenceValue,
      end: addDaysValue(referenceValue, 99),
    },
    {
      group: 'duration',
      label: language === 'pl' ? '6 miesięcy' : '6 months',
      start: referenceValue,
      end: addDaysValue(addMonthsValue(referenceValue, 6), -1),
    },
    {
      group: 'duration',
      label: language === 'pl' ? '9 miesięcy' : '9 months',
      start: referenceValue,
      end: addDaysValue(addMonthsValue(referenceValue, 9), -1),
    },
    {
      group: 'duration',
      label: language === 'pl' ? '2 lata' : '2 years',
      start: referenceValue,
      end: addDaysValue(addYearsValue(referenceValue, 2), -1),
    },
    {
      group: 'quick',
      label: language === 'pl' ? `Rok ${nextYear} 🔮` : `Year ${nextYear} 🔮`,
      start: dateValue(utcDate(nextYear, 0, 1)),
      end: dateValue(utcDate(nextYear, 11, 31)),
    },
    {
      group: 'calendar',
      label: language === 'pl' ? `Rok szkolny ${schoolYearLabel}` : `School year ${schoolYearLabel}`,
      start: dateValue(utcDate(schoolStartYear, 8, 1)),
      end: dateValue(utcDate(schoolStartYear + 1, 5, 30)),
    },
    {
      group: 'calendar',
      label: language === 'pl'
        ? `Semestr ${springSemester ? 'letni' : 'zimowy'} ${semesterYearLabel}`
        : `${springSemester ? 'Spring' : 'Fall'} semester ${semesterYearLabel}`,
      start: dateValue(semesterStart),
      end: dateValue(semesterEnd),
    },
    {
      group: 'calendar',
      label: language === 'pl' ? `Wakacje ${holidayYear} 🏖️` : `Summer ${holidayYear} 🏖️`,
      start: dateValue(holidayStart),
      end: dateValue(utcDate(holidayYear, 7, 31)),
    },
    {
      group: 'calendar',
      label: language === 'pl' ? `Sezon ogrodowy ${gardenYear} 🌱` : `Gardening season ${gardenYear} 🌱`,
      start: dateValue(utcDate(gardenYear, 2, 1)),
      end: dateValue(utcDate(gardenYear, 9, 31)),
    },
    {
      group: 'random',
      label: language === 'pl' ? 'Zaskocz mnie 🎲' : 'Surprise me 🎲',
      random: true as const,
    },
  ];

  return presets;
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

export function calendarFileName(
  start: string,
  end: string,
  style: CalendarStyle,
  language: SiteLanguage,
  format: CalendarFormat = 'standard',
  extension = 'pdf',
) {
  const styleName = style === 'rice' ? (language === 'pl' ? 'ryz' : 'grain') : 'block';
  const formatName = format === 'standard' ? '' : '_' + format;
  return 'the-awesome-calendar_' + language + '_' + start + '_' + end + '_' + styleName + formatName + '.' + extension;
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
