import { useId, type ReactNode } from 'react';

import type { CalendarStyle, SiteLanguage } from '@/lib/calendar';
import {
  BIG_CALENDAR_GEOMETRY,
  STANDARD_CALENDAR_GEOMETRY,
  TALL_CALENDAR_GEOMETRY,
  WIDE_CALENDAR_GEOMETRY,
  getCalendarGeometry,
  type CalendarGeometry,
  type CalendarPageLayout,
  type CalendarStripLayout,
  type CalendarTimelineLayout,
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
const MONTH_LABEL_MIN_WIDTH = 11;
// Worst-case uppercase Lato Black glyph advance, including letter spacing.
const MONTH_LABEL_CHARACTER_WIDTH = 2.55;
const MONTH_LABEL_WIDTH_PADDING = 0.5;

const DRAW_COPY = {
  pl: { cut: 'TU PRZETNIJ', glue: 'TU NAKLEJ' },
  en: { cut: 'CUT HERE', glue: 'GLUE HERE' },
} as const;

function estimateMonthLabelWidth(label: string, visualScale: number) {
  const characterCount = Array.from(label).length;
  return Math.max(
    MONTH_LABEL_MIN_WIDTH,
    characterCount * MONTH_LABEL_CHARACTER_WIDTH + MONTH_LABEL_WIDTH_PADDING,
  ) * visualScale;
}

function DayColumn({ day, dayOffset, geometry, index, stripY, style }: {
  day: CalendarStripLayout['days'][number];
  dayOffset: number;
  geometry: CalendarGeometry;
  index: number;
  stripY: number;
  style: CalendarStyle;
}) {
  const x = geometry.margin + dayOffset + index * geometry.dayWidth;
  const center = x + geometry.dayWidth / 2;
  const lineBottom = stripY + geometry.dayAreaHeight - 2 * geometry.dayWidth;
  const pillHeight = geometry.dayAreaHeight / 16 * (day.startsMonth ? 1.16 : 1);
  const pillWidth = geometry.dayWidth * 0.29;
  const lineWidth = (day.startsMonth ? RICE_MONTH_LINE_WIDTH : RICE_LINE_WIDTH) * geometry.visualScale;
  const weekNumber = day.weekday === 1 ? (
    <text
      fill={MID_GRAY}
      fontFamily="Lato, sans-serif"
      fontSize={(style === 'rice' ? 1.5 : 1.65) * geometry.visualScale}
      fontWeight={700}
      textAnchor={style === 'rice' ? 'start' : 'middle'}
      x={style === 'rice' ? center + RICE_WEEK_LABEL_OFFSET * geometry.visualScale : center}
      y={stripY + 3 * geometry.visualScale}
    >{day.isoWeek}</text>
  ) : null;

  if (style === 'block') {
    return (
      <g>
        <rect
          fill={day.isWeekend ? BODY_WEEKEND : '#ffffff'}
          height={geometry.dayAreaHeight}
          stroke={LIGHT_GRAY}
          strokeWidth={0.12 * geometry.visualScale}
          width={geometry.dayWidth}
          x={x}
          y={stripY}
        />
        <rect fill={DATE_CELL} height={geometry.dayWidth} width={geometry.dayWidth} x={x} y={lineBottom} />
        <rect fill={WEEKDAY_CELL} height={geometry.dayWidth} width={geometry.dayWidth} x={x} y={lineBottom + geometry.dayWidth} />
        {weekNumber}
        <text
          dominantBaseline="middle"
          fill={INK}
          fontFamily="Lato, sans-serif"
          fontSize={1.65 * geometry.visualScale}
          fontWeight={700}
          textAnchor="middle"
          x={center}
          y={lineBottom + geometry.dayWidth / 2}
        >{day.day}</text>
        <text
          dominantBaseline="middle"
          fill={INK}
          fontFamily="Lato, sans-serif"
          fontSize={1.7 * geometry.visualScale}
          fontWeight={700}
          textAnchor="middle"
          x={center}
          y={lineBottom + geometry.dayWidth * 1.5}
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
        fontFamily="Lato, sans-serif"
        fontSize={1.7 * geometry.visualScale}
        fontWeight={700}
        textAnchor="middle"
        x={center}
        y={lineBottom + geometry.dayWidth / 2}
      >{day.weekdayLabel}</text>
      <text
        dominantBaseline="middle"
        fill={RICE_INK}
        fontFamily="Lato, sans-serif"
        fontSize={1.65 * geometry.visualScale}
        fontWeight={700}
        textAnchor="middle"
        x={center}
        y={lineBottom + geometry.dayWidth * 1.5}
      >{day.day}</text>
    </g>
  );
}

function MonthLabels({ geometry, strip, stripY }: {
  geometry: CalendarGeometry;
  strip: CalendarStripLayout;
  stripY: number;
}) {
  const bandY = stripY + geometry.dayAreaHeight;
  const labelGap = 2 * geometry.visualScale;
  const edgeInset = 0.8 * geometry.visualScale;
  const leftEdge = geometry.margin + strip.dayOffset + edgeInset;
  const drawableWidth = strip.hasGlueTab ? strip.contentWidth : geometry.workWidth;
  const rightEdge = geometry.margin + drawableWidth - edgeInset;
  const requestedLabels = strip.days.flatMap((day, index) => {
    if (!day.startsMonth) return [];
    const startX =
      geometry.margin + strip.dayOffset + index * geometry.dayWidth;
    const estimatedWidth = estimateMonthLabelWidth(day.monthLabel, geometry.visualScale);
    const latestX = rightEdge - estimatedWidth;
    const requestedX = Math.max(leftEdge, Math.min(startX + edgeInset, latestX));
    return [{ day, estimatedWidth, requestedX }];
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
      {labels.map(({ day, estimatedWidth, labelX }) => {
        const isRightAligned = labelX + estimatedWidth >= rightEdge - 0.01;

        return (
          <g key={day.iso}>
            <text
              dominantBaseline="middle"
              fill={INK}
              fontFamily="Lato, sans-serif"
              fontSize={3.15 * geometry.visualScale}
              fontWeight={900}
              letterSpacing={0.08 * geometry.visualScale}
              textAnchor={isRightAligned ? 'end' : 'start'}
              x={isRightAligned ? rightEdge : labelX}
              y={bandY + geometry.monthBandHeight / 2 + 0.35 * geometry.visualScale}
            >{day.monthLabel}</text>
          </g>
        );
      })}
    </g>
  );
}

function GlueTab({ geometry, strip, stripY, patternId, language }: {
  geometry: CalendarGeometry;
  strip: CalendarStripLayout;
  stripY: number;
  patternId: string;
  language: SiteLanguage;
}) {
  if (!strip.hasGlueTab) return null;
  const x = geometry.margin + strip.contentWidth;
  return (
    <g>
      <rect fill={`url(#${patternId})`} height={geometry.stripHeight} width={strip.glueWidth} x={x} y={stripY} />
      <text
        dominantBaseline="middle"
        fill="#9b9b96"
        fontFamily="Lato, sans-serif"
        fontSize={1.8 * geometry.visualScale}
        fontWeight={700}
        letterSpacing={0.35 * geometry.visualScale}
        textAnchor="middle"
        transform={`rotate(-90 ${x + strip.glueWidth / 2} ${stripY + geometry.stripHeight / 2})`}
        x={x + strip.glueWidth / 2}
        y={stripY + geometry.stripHeight / 2}
      >{DRAW_COPY[language].glue}</text>
    </g>
  );
}

function YearMarkers({ geometry, strip, stripY }: {
  geometry: CalendarGeometry;
  strip: CalendarStripLayout;
  stripY: number;
}) {
  return (
    <g>
      {strip.yearMarkers.map((marker) => {
        const x = geometry.margin + marker.x;
        return (
          <g key={marker.year}>
            <rect
              fill="#ffffff"
              height={geometry.yearMarkerHeight}
              width={geometry.yearMarkerWidth}
              x={x}
              y={stripY}
            />
            <text
              alignmentBaseline="middle"
              dominantBaseline="middle"
              dy="0.07em"
              fill="#bdbdb8"
              fontFamily="Lato, sans-serif"
              fontSize={geometry.yearMarkerFontSize}
              fontWeight={900}
              textAnchor="middle"
              x={x + geometry.yearMarkerWidth / 2}
              y={stripY + geometry.yearMarkerHeight / 2}
            >{marker.year}</text>
          </g>
        );
      })}
    </g>
  );
}

function CutGuides({ geometry, row, stripY, isLastRow }: {
  geometry: CalendarGeometry;
  row: number;
  stripY: number;
  isLastRow: boolean;
}) {
  const offset = geometry.cutLineOffset;
  const left = geometry.margin - offset;
  const right = geometry.margin + geometry.workWidth + offset;
  const top = stripY - (row === 0 ? offset : 0);
  const bottom = stripY + geometry.stripHeight + (isLastRow ? offset : 0);
  const isPageDivider = geometry.stripsPerPage === 2 && row === 0 && !isLastRow;
  const segments = [
    `M ${left} ${top} V ${bottom}`,
    `M ${right} ${top} V ${bottom}`,
    row === 0 ? `M ${left} ${top} H ${right}` : '',
    isPageDivider ? '' : `M ${left} ${bottom} H ${right}`,
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

function SplitPageDivider({ geometry, language, page }: {
  geometry: CalendarGeometry;
  language: SiteLanguage;
  page: CalendarPageLayout;
}) {
  if (geometry.stripsPerPage !== 2 || page.strips.length < 2) return null;
  const y = geometry.margin + geometry.stripHeight;
  const labelPositions = [geometry.margin / 2, geometry.pageWidth - geometry.margin / 2];
  const [labelTop, labelBottom] = DRAW_COPY[language].cut.split(' ');

  return (
    <g>
      <line
        stroke={MID_GRAY}
        strokeDasharray="1.2 1.1"
        strokeWidth={0.18}
        x1={0}
        x2={geometry.pageWidth}
        y1={y}
        y2={y}
      />
      {labelPositions.map((x) => (
        <g key={x}>
          <text
            fill={INK}
            fontFamily="Lato, sans-serif"
            fontSize={1.35}
            fontWeight={900}
            letterSpacing={0.1}
            textAnchor="middle"
            x={x}
            y={y - 6.2}
          >{labelTop}</text>
          <text
            fill={INK}
            fontFamily="Lato, sans-serif"
            fontSize={1.55}
            fontWeight={900}
            letterSpacing={0.1}
            textAnchor="middle"
            x={x}
            y={y - 4.15}
          >{labelBottom}</text>
          <line
            stroke={INK}
            strokeWidth={0.28}
            x1={x}
            x2={x}
            y1={y - 3.25}
            y2={y - 1.35}
          />
          <path d={`M ${x - 0.75} ${y - 2.1} L ${x} ${y - 1.35} L ${x + 0.75} ${y - 2.1}`} fill="none" stroke={INK} strokeWidth={0.28} />
        </g>
      ))}
    </g>
  );
}

function CalendarStrip({ geometry, strip, row, patternId, style, language, isLastRow }: {
  geometry: CalendarGeometry;
  strip: CalendarStripLayout;
  row: number;
  patternId: string;
  style: CalendarStyle;
  language: SiteLanguage;
  isLastRow: boolean;
}) {
  const stripY = geometry.margin + row * geometry.stripHeight;
  return (
    <g>
      {strip.days.map((day, index) => (
        <DayColumn
          day={day}
          dayOffset={strip.dayOffset}
          geometry={geometry}
          index={index}
          key={day.iso}
          stripY={stripY}
          style={style}
        />
      ))}
      <MonthLabels geometry={geometry} strip={strip} stripY={stripY} />
      <GlueTab geometry={geometry} language={language} patternId={patternId} strip={strip} stripY={stripY} />
      <YearMarkers geometry={geometry} strip={strip} stripY={stripY} />
      <CutGuides geometry={geometry} isLastRow={isLastRow} row={row} stripY={stripY} />
    </g>
  );
}

export function CalendarTimelineSvg({ children, layout, style, title }: {
  children?: ReactNode;
  layout: CalendarTimelineLayout;
  style: CalendarStyle;
  title: string;
}) {
  const { geometry, strip, width, height } = layout;
  const stripY = 0;
  const titleId = useId();

  return (
    <svg
      aria-labelledby={titleId}
      className={`calendar-year-timeline calendar-year-timeline-${style}`}
      height={height}
      shapeRendering="geometricPrecision"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <rect fill="#ffffff" height={height} width={width} />
      {strip.days.map((day, index) => (
        <DayColumn
          day={day}
          dayOffset={strip.dayOffset}
          geometry={geometry}
          index={index}
          key={day.iso}
          stripY={stripY}
          style={style}
        />
      ))}
      <MonthLabels geometry={geometry} strip={strip} stripY={stripY} />
      <YearMarkers geometry={geometry} strip={strip} stripY={stripY} />
      {children}
    </svg>
  );
}

type CalendarPageSvgProps = {
  page: CalendarPageLayout;
  style: CalendarStyle;
  language: SiteLanguage;
  title: string;
  logoHref?: string;
};

function CalendarPageRenderer({
  geometry,
  page,
  style,
  language,
  title,
  logoHref = '/brand/logo.png',
}: CalendarPageSvgProps & { geometry: CalendarGeometry }) {
  const patternId = `glue-stripes-${geometry.format}-${page.index}`;
  const titleId = `calendar-page-${geometry.format}-${page.index}-title`;
  const patternSize = 4 * geometry.visualScale;
  const finalCutLineY =
    geometry.margin +
    page.strips.length * geometry.stripHeight +
    geometry.cutLineOffset;
  return (
    <svg
      aria-labelledby={titleId}
      className="calendar-sheet"
      height="210mm"
      shapeRendering="geometricPrecision"
      viewBox={`0 0 ${geometry.pageWidth} ${geometry.pageHeight}`}
      width="297mm"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <defs>
        <pattern height={patternSize} id={patternId} patternTransform="rotate(-45)" patternUnits="userSpaceOnUse" width={patternSize}>
          <rect fill="#ffffff" height={patternSize} width={patternSize} />
          <rect fill="#eeeeeb" height={patternSize} width={1.25 * geometry.visualScale} />
        </pattern>
      </defs>
      <rect fill="#ffffff" height={geometry.pageHeight} width={geometry.pageWidth} />
      {page.strips.map((strip, row) => (
        <CalendarStrip
          geometry={geometry}
          isLastRow={row === page.strips.length - 1}
          key={strip.index}
          language={language}
          patternId={patternId}
          row={row}
          strip={strip}
          style={style}
        />
      ))}
      <SplitPageDivider geometry={geometry} language={language} page={page} />
      <image
        aria-hidden="true"
        height={5.5}
        href={logoHref}
        preserveAspectRatio="xMinYMid meet"
        width={27.17}
        x={geometry.margin - geometry.cutLineOffset}
        y={finalCutLineY + 0.8}
      />
    </svg>
  );
}

export function StandardCalendarPageSvg(props: CalendarPageSvgProps) {
  return <CalendarPageRenderer {...props} geometry={STANDARD_CALENDAR_GEOMETRY} />;
}

export function TallCalendarPageSvg(props: CalendarPageSvgProps) {
  return <CalendarPageRenderer {...props} geometry={TALL_CALENDAR_GEOMETRY} />;
}

export function WideCalendarPageSvg(props: CalendarPageSvgProps) {
  return <CalendarPageRenderer {...props} geometry={WIDE_CALENDAR_GEOMETRY} />;
}

export function BigCalendarPageSvg(props: CalendarPageSvgProps) {
  return <CalendarPageRenderer {...props} geometry={BIG_CALENDAR_GEOMETRY} />;
}

export function CalendarPageSvg(props: CalendarPageSvgProps) {
  return (
    <CalendarPageRenderer
      {...props}
      geometry={getCalendarGeometry(props.page.size)}
    />
  );
}
