import type { SiteLanguage } from '@/lib/calendar';
import type { CalendarTimelineLayout } from '@/lib/calendar-layout';

type NoteCopy = Record<SiteLanguage, string>;
type RangeNote = {
  from: string;
  to: string;
  label: NoteCopy;
  aside?: NoteCopy;
  ink: string;
  highlight: string;
  y: number;
  tilt: number;
};
type PointNote = {
  date: string;
  label: NoteCopy;
  ink: string;
  y: number;
  offset: number;
  mark: 'circle' | 'star';
};

const BLUE = '#2459a5';
const RED = '#b23e50';
const GREEN = '#28724e';
const PURPLE = '#795099';

const RANGES: RangeNote[] = [
  {
    from: '01-05',
    to: '01-18',
    label: { pl: 'nowy projekt', en: 'new project' },
    aside: { pl: 'małymi krokami!', en: 'one step at a time!' },
    ink: BLUE,
    highlight: '#ffe566',
    y: 26,
    tilt: -3,
  },
  {
    from: '02-09',
    to: '02-22',
    label: { pl: 'ferie / góry', en: 'winter break' },
    ink: PURPLE,
    highlight: '#e1cef4',
    y: 28,
    tilt: 2,
  },
  {
    from: '03-02',
    to: '03-22',
    label: { pl: 'czas na nowy nawyk', en: 'a new habit' },
    aside: { pl: 'codziennie po trochu', en: 'a little every day' },
    ink: GREEN,
    highlight: '#bce8b5',
    y: 24,
    tilt: -2,
  },
  {
    from: '04-13',
    to: '05-03',
    label: { pl: 'projekt: ogród', en: 'garden project' },
    ink: GREEN,
    highlight: '#bce8b5',
    y: 30,
    tilt: 2,
  },
  {
    from: '05-18',
    to: '06-07',
    label: { pl: 'ostatnia prosta!', en: 'the home stretch!' },
    aside: { pl: 'dam radę :)', en: 'I can do this :)' },
    ink: BLUE,
    highlight: '#c1dff5',
    y: 25,
    tilt: -2,
  },
  {
    from: '07-06',
    to: '07-24',
    label: { pl: 'URLOP!', en: 'HOLIDAY!' },
    aside: { pl: 'zero maili, dużo słońca', en: 'less email, more sunshine' },
    ink: BLUE,
    highlight: '#ffe566',
    y: 29,
    tilt: -3,
  },
  {
    from: '08-17',
    to: '08-30',
    label: { pl: 'więcej offline', en: 'more time offline' },
    ink: PURPLE,
    highlight: '#e1cef4',
    y: 25,
    tilt: 2,
  },
  {
    from: '09-07',
    to: '10-02',
    label: { pl: 'uczę się czegoś nowego', en: 'learning something new' },
    aside: { pl: 'pon. + śr. — 18:00', en: 'Mon + Wed — 6 pm' },
    ink: GREEN,
    highlight: '#bce8b5',
    y: 28,
    tilt: -2,
  },
  {
    from: '10-19',
    to: '11-08',
    label: { pl: 'robimy remont', en: 'home makeover' },
    ink: BLUE,
    highlight: '#c1dff5',
    y: 25,
    tilt: 2,
  },
  {
    from: '12-21',
    to: '12-31',
    label: { pl: 'czas dla nas', en: 'time for us' },
    ink: GREEN,
    highlight: '#ffe566',
    y: 29,
    tilt: -2,
  },
];

const POINTS: PointNote[] = [
  {
    date: '01-24',
    label: { pl: 'urodziny Oli!', en: 'Ola’s birthday!' },
    ink: RED,
    y: 53,
    offset: 0,
    mark: 'circle',
  },
  {
    date: '02-27',
    label: { pl: 'oddać projekt', en: 'project due' },
    ink: BLUE,
    y: 54,
    offset: -2,
    mark: 'star',
  },
  {
    date: '03-28',
    label: { pl: 'start biegu!', en: 'race day!' },
    ink: RED,
    y: 52,
    offset: -2,
    mark: 'circle',
  },
  {
    date: '04-10',
    label: { pl: 'odebrać sadzonki', en: 'pick up seedlings' },
    ink: GREEN,
    y: 53,
    offset: -3,
    mark: 'star',
  },
  {
    date: '05-10',
    label: { pl: 'obiad u mamy', en: 'lunch at Mum’s' },
    ink: RED,
    y: 51,
    offset: -2,
    mark: 'circle',
  },
  {
    date: '06-19',
    label: { pl: 'KONCERT!', en: 'GIG NIGHT!' },
    ink: PURPLE,
    y: 46,
    offset: 2,
    mark: 'star',
  },
  {
    date: '07-31',
    label: { pl: 'wydrukować zdjęcia', en: 'print the photos' },
    ink: RED,
    y: 54,
    offset: 2,
    mark: 'circle',
  },
  {
    date: '08-08',
    label: { pl: 'pod namiot!', en: 'camping trip!' },
    ink: GREEN,
    y: 26,
    offset: -2,
    mark: 'star',
  },
  {
    date: '09-26',
    label: { pl: 'nasza rocznica', en: 'our anniversary' },
    ink: RED,
    y: 56,
    offset: 0,
    mark: 'circle',
  },
  {
    date: '10-10',
    label: { pl: 'weekend w lesie', en: 'forest weekend' },
    ink: GREEN,
    y: 48,
    offset: 0,
    mark: 'star',
  },
  {
    date: '11-20',
    label: { pl: 'pokazać efekty!', en: 'show what we made!' },
    ink: PURPLE,
    y: 50,
    offset: 1,
    mark: 'circle',
  },
  {
    date: '12-12',
    label: { pl: 'upiec pierniki', en: 'bake gingerbread' },
    ink: RED,
    y: 53,
    offset: -2,
    mark: 'star',
  },
];

export function CalendarHeroNotes({
  layout,
  language,
}: {
  layout: CalendarTimelineLayout;
  language: SiteLanguage;
}) {
  const { geometry, strip } = layout;
  // Month/day anchors stay on the same dates when February gains a leap day.
  const dayPositions = new Map(
    strip.days.map((day, index) => [
      day.iso.slice(5),
      strip.dayOffset + (index + 0.5) * geometry.dayWidth,
    ]),
  );
  const dateY = geometry.dayAreaHeight - geometry.dayWidth / 2;

  return (
    <g
      aria-hidden="true"
      className="calendar-hero-notes"
      data-calendar-hero-notes="true"
      fill="none"
      pointerEvents="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {RANGES.map((note) => {
        const from = dayPositions.get(note.from);
        const to = dayPositions.get(note.to);
        if (from === undefined || to === undefined) return null;
        const left = from - geometry.dayWidth / 2;
        const right = to + geometry.dayWidth / 2;
        const center = (left + right) / 2;
        const { y } = note;

        return (
          <g data-from={note.from} data-to={note.to} key={note.from}>
            <path
              d={`M ${left + 1} ${y - 0.5} Q ${center} ${y - 2.4} ${right - 1} ${y + 0.3}`}
              opacity={0.65}
              stroke={note.highlight}
              strokeWidth={7}
            />
            <path
              d={`M ${left} ${y - 3} L ${left + 0.4} ${y + 2} Q ${center} ${y + 0.4} ${right} ${y + 1.1} L ${right - 0.3} ${y - 3.5}`}
              stroke={note.ink}
              strokeWidth={0.7}
            />
            <path
              d={`M ${from} ${y + 5} L ${from} ${dateY - 5} M ${to} ${y + 5} L ${to} ${dateY - 5}`}
              opacity={0.45}
              stroke={note.ink}
              strokeDasharray="0.7 2"
              strokeWidth={0.45}
            />
            <text
              className="calendar-hero-note-label"
              fill={note.ink}
              textAnchor="middle"
              transform={`rotate(${note.tilt} ${center} ${y - 5})`}
              x={center}
              y={y - 5}
            >
              {note.label[language]}
            </text>
            {note.aside && (
              <g transform={`rotate(${note.tilt / 2} ${center} ${y + 14})`}>
                <text
                  className="calendar-hero-note-aside"
                  fill={note.ink}
                  textAnchor="middle"
                  x={center}
                  y={y + 14}
                >
                  {note.aside[language]}
                </text>
                <path
                  d={`M ${center - 13} ${y + 17} q 6 -1.5 12 0 t 13 -0.5 m -23 2 q 10 -1.6 21 0`}
                  opacity={0.7}
                  stroke={note.ink}
                  strokeWidth={0.45}
                />
              </g>
            )}
          </g>
        );
      })}
      {POINTS.map((note) => {
        const x = dayPositions.get(note.date);
        if (x === undefined) return null;
        const labelX = x + note.offset * geometry.dayWidth;
        const { y } = note;

        return (
          <g data-date={note.date} key={note.date}>
            <text
              className="calendar-hero-note-label"
              fill={note.ink}
              textAnchor="middle"
              transform={`rotate(-4 ${labelX} ${y})`}
              x={labelX}
              y={y}
            >
              {note.label[language]}
            </text>
            <path
              d={`M ${labelX + 2} ${y + 3} Q ${x + 7} ${y + 11} ${x + 0.5} ${dateY - 5} m -1.6 -3 l 1.6 3 2.5 -2.3`}
              stroke={note.ink}
              strokeWidth={0.7}
            />
            {note.mark === 'circle' ? (
              <g stroke={note.ink} strokeWidth={0.65}>
                <ellipse
                  cx={x}
                  cy={dateY}
                  rx={3.7}
                  ry={4.2}
                  transform={`rotate(-12 ${x} ${dateY})`}
                />
                <path
                  d={`M ${x - 3.8} ${dateY + 0.8} C ${x - 4.8} ${dateY - 5.1} ${x + 3.9} ${dateY - 5.6} ${x + 4} ${dateY - 0.5}`}
                  opacity={0.65}
                />
              </g>
            ) : (
              <path
                d={`M ${x} ${dateY - 4} l 1.2 2.4 2.8 0.4 -2 2 0.6 2.9 -2.6 -1.4 -2.6 1.4 0.6 -2.9 -2 -2 2.8 -0.4 Z`}
                fill="#ffe566"
                fillOpacity={0.35}
                stroke={note.ink}
                strokeWidth={0.6}
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
