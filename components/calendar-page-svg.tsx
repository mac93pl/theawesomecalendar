import type { CalendarStyle, SiteLanguage } from '@/lib/calendar';
import {
  CALENDAR_GEOMETRY,
  DAY_WIDTH,
  YEAR_MARKER_WIDTH,
  type CalendarPageLayout,
  type CalendarStripLayout,
} from '@/lib/calendar-layout';

const INK = '#11110f';
const MID_GRAY = '#8b8b86';
const LIGHT_GRAY = '#d8d8d3';
const BODY_WEEKEND = '#e9e9e5';
const DATE_CELL = '#d7d7d2';
const WEEKDAY_CELL = '#bdbdb8';
const RICE_INK = '#000000';
const RICE_LINE_WIDTH = 0.16;
const RICE_MONTH_LINE_WIDTH = 0.24;
const RICE_WEEK_LABEL_OFFSET = 0.44;

const DRAW_COPY = {
  pl: { glue: 'TU NAKLEJ' },
  en: { glue: 'GLUE HERE' },
} as const;

function DayColumn({ day, dayOffset, index, stripY, style }: {
  day: CalendarStripLayout['days'][number];
  dayOffset: number;
  index: number;
  stripY: number;
  style: CalendarStyle;
}) {
  const x = CALENDAR_GEOMETRY.margin + dayOffset + index * DAY_WIDTH;
  const center = x + DAY_WIDTH / 2;
  const lineBottom = stripY + CALENDAR_GEOMETRY.dayAreaHeight - 2 * DAY_WIDTH;
  const pillHeight = CALENDAR_GEOMETRY.dayAreaHeight / 16 * (day.startsMonth ? 1.16 : 1);
  const pillWidth = DAY_WIDTH * 0.29;
  const lineWidth = day.startsMonth ? RICE_MONTH_LINE_WIDTH : RICE_LINE_WIDTH;
  const weekNumber = day.weekday === 1 ? (
    <text
      fill={MID_GRAY}
      fontFamily="Inter, Arial, sans-serif"
      fontSize={style === 'rice' ? 1.5 : 1.65}
      fontWeight={700}
      textAnchor={style === 'rice' ? 'start' : 'middle'}
      x={style === 'rice' ? center + RICE_WEEK_LABEL_OFFSET : center}
      y={stripY + 3}
    >{day.isoWeek}</text>
  ) : null;

  if (style === 'block') {
    return (
      <g>
        <rect
          fill={day.isWeekend ? BODY_WEEKEND : '#ffffff'}
          height={CALENDAR_GEOMETRY.dayAreaHeight}
          stroke={LIGHT_GRAY}
          strokeWidth={0.12}
          width={DAY_WIDTH}
          x={x}
          y={stripY}
        />
        <rect fill={DATE_CELL} height={DAY_WIDTH} width={DAY_WIDTH} x={x} y={lineBottom} />
        <rect fill={WEEKDAY_CELL} height={DAY_WIDTH} width={DAY_WIDTH} x={x} y={lineBottom + DAY_WIDTH} />
        {weekNumber}
        <text
          dominantBaseline="middle"
          fill={INK}
          fontFamily="Inter, Arial, sans-serif"
          fontSize={1.65}
          fontWeight={700}
          textAnchor="middle"
          x={center}
          y={lineBottom + DAY_WIDTH / 2}
        >{day.day}</text>
        <text
          dominantBaseline="middle"
          fill={INK}
          fontFamily="Inter, Arial, sans-serif"
          fontSize={1.7}
          fontWeight={700}
          textAnchor="middle"
          x={center}
          y={lineBottom + DAY_WIDTH * 1.5}
        >{day.weekdayLabel}</text>
      </g>
    );
  }

  return (
    <g>
      <line
        stroke={RICE_INK}
        strokeWidth={lineWidth}
        x1={center}
        x2={center}
        y1={stripY}
        y2={lineBottom}
      />
      <rect
        fill={day.isWeekend ? INK : '#ffffff'}
        height={pillHeight}
        rx={pillWidth / 2}
        stroke={RICE_INK}
        strokeWidth={lineWidth}
        width={pillWidth}
        x={center - pillWidth / 2}
        y={lineBottom - pillHeight}
      />
      {weekNumber}
      <text
        dominantBaseline="middle"
        fill={RICE_INK}
        fontFamily="Inter, Arial, sans-serif"
        fontSize={1.7}
        fontWeight={700}
        textAnchor="middle"
        x={center}
        y={lineBottom + DAY_WIDTH / 2}
      >{day.weekdayLabel}</text>
      <text
        dominantBaseline="middle"
        fill={RICE_INK}
        fontFamily="Inter, Arial, sans-serif"
        fontSize={1.65}
        fontWeight={700}
        textAnchor="middle"
        x={center}
        y={lineBottom + DAY_WIDTH * 1.5}
      >{day.day}</text>
    </g>
  );
}

function MonthLabels({ strip, stripY }: { strip: CalendarStripLayout; stripY: number }) {
  const bandY = stripY + CALENDAR_GEOMETRY.dayAreaHeight;
  const labelGap = 2;
  const leftEdge = CALENDAR_GEOMETRY.margin + strip.dayOffset + 0.8;
  const drawableWidth = strip.hasGlueTab ? strip.contentWidth : CALENDAR_GEOMETRY.workWidth;
  const rightEdge = CALENDAR_GEOMETRY.margin + drawableWidth - 0.8;
  const requestedLabels = strip.days.flatMap((day, index) => {
    if (!day.startsMonth) return [];
    const startX =
      CALENDAR_GEOMETRY.margin + strip.dayOffset + index * DAY_WIDTH;
    const estimatedWidth = Math.min(31, Math.max(11, day.monthLabel.length * 1.7));
    const latestX = rightEdge - estimatedWidth;
    const requestedX = Math.max(leftEdge, Math.min(startX + 0.8, latestX));
    return [{ day, estimatedWidth, requestedX, startX }];
  });

  const forwardLabels = requestedLabels.reduce<
    Array<Omit<(typeof requestedLabels)[number], 'requestedX'> & { labelX: number }>
  >((result, label) => {
    const previousLabel = result.at(-1);
    const nextAvailableX = previousLabel
      ? previousLabel.labelX + previousLabel.estimatedWidth + labelGap
      : leftEdge;

    return [
      ...result,
      {
        day: label.day,
        estimatedWidth: label.estimatedWidth,
        labelX: Math.max(label.requestedX, nextAvailableX),
        startX: label.startX,
      },
    ];
  }, []);

  const overflow = forwardLabels.at(-1)
    ? forwardLabels.at(-1)!.labelX +
      forwardLabels.at(-1)!.estimatedWidth -
      rightEdge
    : 0;
  const labels = overflow > 0
    ? forwardLabels.reduceRight<typeof forwardLabels>((result, label) => {
        const nextLabel = result[0];
        const latestX = nextLabel
          ? nextLabel.labelX - labelGap - label.estimatedWidth
          : rightEdge - label.estimatedWidth;

        return [
          {
            ...label,
            labelX: Math.max(leftEdge, Math.min(label.labelX, latestX)),
          },
          ...result,
        ];
      }, [])
    : forwardLabels;

  return (
    <g>
      {labels.map(({ day, labelX, startX }) => (
        <g key={day.iso}>
          <line stroke={INK} strokeWidth={0.35} x1={startX} x2={startX} y1={bandY} y2={bandY + 2.2} />
          <text
            dominantBaseline="middle"
            fill={INK}
            fontFamily="Anton, Arial Narrow, sans-serif"
            fontSize={3.15}
            letterSpacing={0.08}
            x={labelX}
            y={bandY + CALENDAR_GEOMETRY.monthBandHeight / 2 + 0.35}
          >{day.monthLabel}</text>
        </g>
      ))}
    </g>
  );
}

function GlueTab({ strip, stripY, patternId, language }: {
  strip: CalendarStripLayout;
  stripY: number;
  patternId: string;
  language: SiteLanguage;
}) {
  if (!strip.hasGlueTab) return null;
  const x = CALENDAR_GEOMETRY.margin + strip.contentWidth;
  return (
    <g>
      <rect fill={`url(#${patternId})`} height={CALENDAR_GEOMETRY.stripHeight} width={strip.glueWidth} x={x} y={stripY} />
      <text
        dominantBaseline="middle"
        fill="#9b9b96"
        fontFamily="Inter, Arial, sans-serif"
        fontSize={1.8}
        fontWeight={700}
        letterSpacing={0.35}
        textAnchor="middle"
        transform={`rotate(-90 ${x + strip.glueWidth / 2} ${stripY + CALENDAR_GEOMETRY.stripHeight / 2})`}
        x={x + strip.glueWidth / 2}
        y={stripY + CALENDAR_GEOMETRY.stripHeight / 2}
      >{DRAW_COPY[language].glue}</text>
    </g>
  );
}

function YearMarkers({ strip, stripY }: { strip: CalendarStripLayout; stripY: number }) {
  return (
    <g>
      {strip.yearMarkers.map((marker) => {
        const x = CALENDAR_GEOMETRY.margin + marker.x;
        return (
          <g key={marker.year}>
            <rect
              fill="#ffffff"
              height={CALENDAR_GEOMETRY.yearMarkerHeight}
              width={YEAR_MARKER_WIDTH}
              x={x}
              y={stripY}
            />
            <text
              alignmentBaseline="middle"
              dominantBaseline="middle"
              dy="0.07em"
              fill="#bdbdb8"
              fontFamily="Lato, Arial, sans-serif"
              fontSize={CALENDAR_GEOMETRY.yearMarkerFontSize}
              fontWeight={900}
              textAnchor="middle"
              x={x + YEAR_MARKER_WIDTH / 2}
              y={stripY + CALENDAR_GEOMETRY.yearMarkerHeight / 2}
            >{marker.year}</text>
          </g>
        );
      })}
    </g>
  );
}

function CutGuides({ row, stripY, isLastRow }: { row: number; stripY: number; isLastRow: boolean }) {
  const offset = CALENDAR_GEOMETRY.cutLineOffset;
  const left = CALENDAR_GEOMETRY.margin - offset;
  const right = CALENDAR_GEOMETRY.margin + CALENDAR_GEOMETRY.workWidth + offset;
  const top = stripY - (row === 0 ? offset : 0);
  const bottom = stripY + CALENDAR_GEOMETRY.stripHeight + (isLastRow ? offset : 0);
  const segments = [
    `M ${left} ${top} V ${bottom}`,
    `M ${right} ${top} V ${bottom}`,
    row === 0 ? `M ${left} ${top} H ${right}` : '',
    `M ${left} ${bottom} H ${right}`,
  ].filter(Boolean).join(' ');
  return (
    <path
      d={segments}
      fill="none"
      stroke={MID_GRAY}
      strokeDasharray="1.2 1.1"
      strokeWidth={0.18}
    />
  );
}

function CalendarStrip({ strip, row, patternId, style, language, isLastRow }: {
  strip: CalendarStripLayout;
  row: number;
  patternId: string;
  style: CalendarStyle;
  language: SiteLanguage;
  isLastRow: boolean;
}) {
  const stripY = CALENDAR_GEOMETRY.margin + row * CALENDAR_GEOMETRY.stripHeight;
  return (
    <g>
      {strip.days.map((day, index) => (
        <DayColumn
          day={day}
          dayOffset={strip.dayOffset}
          index={index}
          key={day.iso}
          stripY={stripY}
          style={style}
        />
      ))}
      <MonthLabels strip={strip} stripY={stripY} />
      <GlueTab language={language} patternId={patternId} strip={strip} stripY={stripY} />
      <YearMarkers strip={strip} stripY={stripY} />
      <CutGuides isLastRow={isLastRow} row={row} stripY={stripY} />
    </g>
  );
}

export function CalendarPageSvg({ page, style, language, title, logoHref = '/brand/logo.png' }: {
  page: CalendarPageLayout;
  style: CalendarStyle;
  language: SiteLanguage;
  title: string;
  logoHref?: string;
}) {
  const patternId = `glue-stripes-${page.index}`;
  const titleId = `calendar-page-${page.index}-title`;
  const finalCutLineY =
    CALENDAR_GEOMETRY.margin +
    page.strips.length * CALENDAR_GEOMETRY.stripHeight +
    CALENDAR_GEOMETRY.cutLineOffset;
  return (
    <svg
      aria-labelledby={titleId}
      className="calendar-sheet"
      height="210mm"
      shapeRendering="geometricPrecision"
      viewBox="0 0 297 210"
      width="297mm"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <defs>
        <pattern height="4" id={patternId} patternTransform="rotate(-45)" patternUnits="userSpaceOnUse" width="4">
          <rect fill="#ffffff" height="4" width="4" />
          <rect fill="#eeeeeb" height="4" width="1.25" />
        </pattern>
      </defs>
      <rect fill="#ffffff" height={CALENDAR_GEOMETRY.pageHeight} width={CALENDAR_GEOMETRY.pageWidth} />
      {page.strips.map((strip, row) => (
        <CalendarStrip
          isLastRow={row === page.strips.length - 1}
          key={strip.index}
          language={language}
          patternId={patternId}
          row={row}
          strip={strip}
          style={style}
        />
      ))}
      <image
        aria-hidden="true"
        height={5.5}
        href={logoHref}
        preserveAspectRatio="xMinYMid meet"
        width={27.17}
        x={CALENDAR_GEOMETRY.margin - CALENDAR_GEOMETRY.cutLineOffset}
        y={finalCutLineY + 0.8}
      />
    </svg>
  );
}
