import {
  type CalendarDayHeight,
  type CalendarDayWidth,
  type CalendarDay,
  type CalendarFormat,
  type CalendarSize,
  type SiteLanguage,
  STANDARD_CALENDAR_SIZE,
  createDays,
} from '@/lib/calendar';

type WidthGeometryProfile = {
  monthBandHeight: number;
  referenceStrips: number;
  regularDaysPerStrip: number;
  finalDaysPerStrip: number;
  visualScale: number;
};

type HeightGeometryProfile = {
  stripsPerPage: 1 | 2;
  stripHeight: number;
};

export type CalendarGeometry = {
  readonly format: CalendarFormat;
  readonly size: CalendarSize;
  readonly pageWidth: number;
  readonly pageHeight: number;
  readonly margin: number;
  readonly workWidth: number;
  readonly workHeight: number;
  readonly stripsPerPage: 1 | 2;
  readonly stripHeight: number;
  readonly monthBandHeight: number;
  readonly dayAreaHeight: number;
  readonly referenceStrips: number;
  readonly glueTabWidth: number;
  readonly regularContentWidth: number;
  readonly regularDaysPerStrip: number;
  readonly finalDaysPerStrip: number;
  readonly leadingMarginDays: number;
  readonly dayWidth: number;
  readonly yearMarkerDays: number;
  readonly yearMarkerWidth: number;
  readonly yearMarkerHeight: number;
  readonly yearMarkerFontSize: number;
  readonly yearMarkerGap: number;
  readonly cutLineOffset: number;
  readonly visualScale: number;
};

const PAGE_GEOMETRY = {
  pageWidth: 297,
  pageHeight: 210,
  margin: 15,
  workWidth: 267,
  workHeight: 180,
  glueTabWidth: 10,
  leadingMarginDays: 2,
  yearMarkerDays: 5,
  cutLineOffset: 0.25,
} as const;

const WIDTH_GEOMETRY: Record<CalendarDayWidth, WidthGeometryProfile> = {
  standard: {
    monthBandHeight: 9,
    referenceStrips: 6,
    regularDaysPerStrip: 61,
    finalDaysPerStrip: 63,
    visualScale: 1,
  },
  wide: {
    monthBandHeight: 18,
    referenceStrips: 12,
    regularDaysPerStrip: 31,
    finalDaysPerStrip: 32,
    visualScale: 2,
  },
};

const HEIGHT_GEOMETRY: Record<CalendarDayHeight, HeightGeometryProfile> = {
  standard: { stripsPerPage: 2, stripHeight: 90 },
  tall: { stripsPerPage: 1, stripHeight: 180 },
};

export function calendarFormatForSize(size: CalendarSize): CalendarFormat {
  if (size.dayWidth === 'wide') {
    return size.dayHeight === 'tall' ? 'big' : 'wide';
  }
  return size.dayHeight === 'tall' ? 'tall' : 'standard';
}

function createGeometry(size: CalendarSize): CalendarGeometry {
  const widthProfile = WIDTH_GEOMETRY[size.dayWidth];
  const heightProfile = HEIGHT_GEOMETRY[size.dayHeight];
  const regularContentWidth = PAGE_GEOMETRY.workWidth - PAGE_GEOMETRY.glueTabWidth;
  const dayWidth = regularContentWidth / widthProfile.regularDaysPerStrip;

  return {
    ...PAGE_GEOMETRY,
    ...widthProfile,
    ...heightProfile,
    format: calendarFormatForSize(size),
    size,
    dayAreaHeight: heightProfile.stripHeight - widthProfile.monthBandHeight,
    regularContentWidth,
    dayWidth,
    yearMarkerWidth: dayWidth * PAGE_GEOMETRY.yearMarkerDays,
    yearMarkerHeight: 10.2 * widthProfile.visualScale,
    yearMarkerFontSize: 8.4 * widthProfile.visualScale,
    yearMarkerGap: 0.8 * widthProfile.visualScale,
  };
}

export const STANDARD_CALENDAR_GEOMETRY = createGeometry(STANDARD_CALENDAR_SIZE);

export const TALL_CALENDAR_GEOMETRY = createGeometry({
  dayWidth: 'standard',
  dayHeight: 'tall',
});

export const WIDE_CALENDAR_GEOMETRY = createGeometry({
  dayWidth: 'wide',
  dayHeight: 'standard',
});

export const BIG_CALENDAR_GEOMETRY = createGeometry({
  dayWidth: 'wide',
  dayHeight: 'tall',
});

export const CALENDAR_GEOMETRIES: Record<CalendarFormat, CalendarGeometry> = {
  standard: STANDARD_CALENDAR_GEOMETRY,
  tall: TALL_CALENDAR_GEOMETRY,
  wide: WIDE_CALENDAR_GEOMETRY,
  big: BIG_CALENDAR_GEOMETRY,
};

export function getCalendarGeometry(size: CalendarSize) {
  return CALENDAR_GEOMETRIES[calendarFormatForSize(size)];
}

// Backwards-compatible aliases intentionally point at the original renderer.
export const CALENDAR_GEOMETRY = STANDARD_CALENDAR_GEOMETRY;
export const DAY_WIDTH = STANDARD_CALENDAR_GEOMETRY.dayWidth;
export const YEAR_MARKER_WIDTH = STANDARD_CALENDAR_GEOMETRY.yearMarkerWidth;
export const REFERENCE_GLUE_TAB_WIDTH = STANDARD_CALENDAR_GEOMETRY.glueTabWidth;

export type CalendarYearMarkerLayout = {
  year: number;
  x: number;
  rangeDayCount: number;
  placementDayCount: number;
};

export type CalendarStripLayout = {
  index: number;
  days: CalendarDay[];
  dayOffset: number;
  hasGlueTab: boolean;
  contentWidth: number;
  glueWidth: number;
  yearMarkers: CalendarYearMarkerLayout[];
};

export type CalendarPageLayout = {
  index: number;
  format: CalendarFormat;
  size: CalendarSize;
  strips: CalendarStripLayout[];
};

export type CalendarLayout = {
  format: CalendarFormat;
  size: CalendarSize;
  geometry: CalendarGeometry;
  days: CalendarDay[];
  strips: CalendarStripLayout[];
  pages: CalendarPageLayout[];
  loosePaperLength: number;
  assembledPaperLength: number;
  dayAxisLength: number;
  leadingMargin: number;
  trailingMargin: number;
};

function packDays(days: CalendarDay[], geometry: CalendarGeometry) {
  const strips: CalendarStripLayout[] = [];
  let cursor = 0;

  while (cursor < days.length) {
    const isFirstStrip = strips.length === 0;
    const marginDaySlots = isFirstStrip ? geometry.leadingMarginDays : 0;
    const dayOffset = marginDaySlots * geometry.dayWidth;
    const remaining = days.length - cursor;
    const finalCapacity = geometry.finalDaysPerStrip - marginDaySlots;
    const hasGlueTab = remaining > finalCapacity;
    const stripCapacity = (
      hasGlueTab ? geometry.regularDaysPerStrip : geometry.finalDaysPerStrip
    ) - marginDaySlots;
    const take = Math.min(remaining, stripCapacity);
    const stripDays = days.slice(cursor, cursor + take);
    const contentWidth = hasGlueTab
      ? geometry.regularContentWidth
      : dayOffset + stripDays.length * geometry.dayWidth;

    strips.push({
      index: strips.length,
      days: stripDays,
      dayOffset,
      hasGlueTab,
      contentWidth,
      glueWidth: hasGlueTab ? geometry.glueTabWidth : 0,
      yearMarkers: [],
    });
    cursor += take;
  }

  const stripStarts = strips.map((_, stripIndex) => (
    strips.slice(0, stripIndex).reduce((sum, strip) => sum + strip.days.length, 0)
  ));
  const stripForDay = (dayIndex: number) => strips.findIndex((strip, stripIndex) => (
    dayIndex >= stripStarts[stripIndex] && dayIndex < stripStarts[stripIndex] + strip.days.length
  ));
  const daysByYear = days.reduce((counts, day) => {
    counts.set(day.year, (counts.get(day.year) ?? 0) + 1);
    return counts;
  }, new Map<number, number>());

  const candidates = days.flatMap((day, globalIndex) => {
    if (!day.startsYear) return [];
    const originStripIndex = stripForDay(globalIndex);
    const placementCounts = new Map<number, number>();
    const markerEnd = Math.min(days.length, globalIndex + geometry.yearMarkerDays);
    for (let markerDayIndex = globalIndex; markerDayIndex < markerEnd; markerDayIndex += 1) {
      const stripIndex = stripForDay(markerDayIndex);
      placementCounts.set(stripIndex, (placementCounts.get(stripIndex) ?? 0) + 1);
    }
    const targetStripIndex = [...placementCounts.entries()].sort((left, right) => (
      right[1] - left[1]
      || Number(right[0] === originStripIndex) - Number(left[0] === originStripIndex)
    ))[0]?.[0] ?? originStripIndex;
    const targetStrip = strips[targetStripIndex];
    const targetStart = stripStarts[targetStripIndex];
    const requestedX = targetStrip.dayOffset + (
      targetStripIndex === originStripIndex
        ? (globalIndex - targetStart) * geometry.dayWidth
        : 0
    );
    const drawableWidth = targetStrip.hasGlueTab ? targetStrip.contentWidth : geometry.workWidth;
    return [{
      marker: {
        year: day.year,
        x: Math.max(
          targetStrip.dayOffset,
          Math.min(requestedX, drawableWidth - geometry.yearMarkerWidth),
        ),
        rangeDayCount: daysByYear.get(day.year) ?? 0,
        placementDayCount: placementCounts.get(targetStripIndex) ?? 0,
      },
      targetStripIndex,
    }];
  });

  for (let stripIndex = 0; stripIndex < strips.length; stripIndex += 1) {
    const markerCandidates = candidates
      .filter((candidate) => candidate.targetStripIndex === stripIndex)
      .map((candidate) => candidate.marker)
      .sort((left, right) => (
        right.rangeDayCount - left.rangeDayCount
        || right.placementDayCount - left.placementDayCount
        || right.year - left.year
      ));
    const visibleMarkers: CalendarYearMarkerLayout[] = [];
    for (const marker of markerCandidates) {
      const overlaps = visibleMarkers.some((visible) => (
        marker.x < visible.x + geometry.yearMarkerWidth + geometry.yearMarkerGap
        && visible.x < marker.x + geometry.yearMarkerWidth + geometry.yearMarkerGap
      ));
      if (!overlaps) visibleMarkers.push(marker);
    }
    strips[stripIndex].yearMarkers = visibleMarkers.sort((left, right) => left.x - right.x);
  }

  return strips;
}

function buildCalendarLayout(
  start: string,
  end: string,
  language: SiteLanguage,
  geometry: CalendarGeometry,
): CalendarLayout {
  const days = createDays(start, end, language);
  const strips = packDays(days, geometry);
  const pages = Array.from(
    { length: Math.ceil(strips.length / geometry.stripsPerPage) },
    (_, index) => ({
      index,
      format: geometry.format,
      size: geometry.size,
      strips: strips.slice(
        index * geometry.stripsPerPage,
        index * geometry.stripsPerPage + geometry.stripsPerPage,
      ),
    }),
  );
  const loosePaperLength = strips.length * geometry.workWidth;
  const overlap = strips.reduce((sum, strip) => sum + strip.glueWidth, 0);
  const firstStrip = strips[0];
  const lastStrip = strips.at(-1);
  const leadingMargin = firstStrip?.dayOffset ?? 0;
  const trailingMargin = lastStrip
    ? geometry.workWidth - lastStrip.dayOffset - lastStrip.days.length * geometry.dayWidth
    : 0;

  return {
    format: geometry.format,
    size: geometry.size,
    geometry,
    days,
    strips,
    pages,
    loosePaperLength,
    assembledPaperLength: loosePaperLength - overlap,
    dayAxisLength: days.length * geometry.dayWidth,
    leadingMargin,
    trailingMargin,
  };
}

export function createStandardCalendarLayout(start: string, end: string, language: SiteLanguage) {
  return buildCalendarLayout(start, end, language, STANDARD_CALENDAR_GEOMETRY);
}

export function createTallCalendarLayout(start: string, end: string, language: SiteLanguage) {
  return buildCalendarLayout(start, end, language, TALL_CALENDAR_GEOMETRY);
}

export function createWideCalendarLayout(start: string, end: string, language: SiteLanguage) {
  return buildCalendarLayout(start, end, language, WIDE_CALENDAR_GEOMETRY);
}

export function createBigCalendarLayout(start: string, end: string, language: SiteLanguage) {
  return buildCalendarLayout(start, end, language, BIG_CALENDAR_GEOMETRY);
}

export function createCalendarLayout(
  start: string,
  end: string,
  language: SiteLanguage,
  size: CalendarSize = STANDARD_CALENDAR_SIZE,
): CalendarLayout {
  return buildCalendarLayout(start, end, language, getCalendarGeometry(size));
}
