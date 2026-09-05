import { type CalendarDay, type SiteLanguage, createDays } from '@/lib/calendar';

export const CALENDAR_GEOMETRY = {
  pageWidth: 297,
  pageHeight: 210,
  margin: 15,
  workWidth: 267,
  workHeight: 180,
  stripHeight: 90,
  monthBandHeight: 9,
  dayAreaHeight: 81,
  referenceStrips: 6,
  glueTabWidth: 10,
  regularDaysPerStrip: 61,
  finalDaysPerStrip: 63,
  leadingMarginDays: 2,
  yearMarkerDays: 5,
  yearMarkerHeight: 9.2,
  yearMarkerGap: 0.8,
  cutLineOffset: 0.25,
} as const;

const REGULAR_CONTENT_WIDTH = CALENDAR_GEOMETRY.workWidth - CALENDAR_GEOMETRY.glueTabWidth;

export const DAY_WIDTH = REGULAR_CONTENT_WIDTH / CALENDAR_GEOMETRY.regularDaysPerStrip;
export const YEAR_MARKER_WIDTH = DAY_WIDTH * CALENDAR_GEOMETRY.yearMarkerDays;
export const REFERENCE_GLUE_TAB_WIDTH = CALENDAR_GEOMETRY.glueTabWidth;

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
  strips: CalendarStripLayout[];
};

export type CalendarLayout = {
  days: CalendarDay[];
  strips: CalendarStripLayout[];
  pages: CalendarPageLayout[];
  loosePaperLength: number;
  assembledPaperLength: number;
  dayAxisLength: number;
  leadingMargin: number;
  trailingMargin: number;
};

function packDays(days: CalendarDay[]) {
  const strips: CalendarStripLayout[] = [];
  let cursor = 0;

  while (cursor < days.length) {
    const isFirstStrip = strips.length === 0;
    const marginDaySlots = isFirstStrip
      ? CALENDAR_GEOMETRY.leadingMarginDays
      : 0;
    const dayOffset = marginDaySlots * DAY_WIDTH;
    const remaining = days.length - cursor;
    const finalCapacity =
      CALENDAR_GEOMETRY.finalDaysPerStrip - marginDaySlots;
    const hasGlueTab = remaining > finalCapacity;
    const stripCapacity =
      (hasGlueTab
        ? CALENDAR_GEOMETRY.regularDaysPerStrip
        : CALENDAR_GEOMETRY.finalDaysPerStrip) - marginDaySlots;
    const take = Math.min(remaining, stripCapacity);
    const stripDays = days.slice(cursor, cursor + take);
    const contentWidth = hasGlueTab
      ? REGULAR_CONTENT_WIDTH
      : dayOffset + stripDays.length * DAY_WIDTH;

    strips.push({
      index: strips.length,
      days: stripDays,
      dayOffset,
      hasGlueTab,
      contentWidth,
      glueWidth: hasGlueTab ? CALENDAR_GEOMETRY.glueTabWidth : 0,
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
    const markerEnd = Math.min(days.length, globalIndex + CALENDAR_GEOMETRY.yearMarkerDays);
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
        ? (globalIndex - targetStart) * DAY_WIDTH
        : 0
    );
    const drawableWidth = targetStrip.hasGlueTab ? targetStrip.contentWidth : CALENDAR_GEOMETRY.workWidth;
    return [{
      marker: {
        year: day.year,
        x: Math.max(
          targetStrip.dayOffset,
          Math.min(requestedX, drawableWidth - YEAR_MARKER_WIDTH),
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
        marker.x < visible.x + YEAR_MARKER_WIDTH + CALENDAR_GEOMETRY.yearMarkerGap
        && visible.x < marker.x + YEAR_MARKER_WIDTH + CALENDAR_GEOMETRY.yearMarkerGap
      ));
      if (!overlaps) visibleMarkers.push(marker);
    }
    strips[stripIndex].yearMarkers = visibleMarkers.sort((left, right) => left.x - right.x);
  }

  return strips;
}

export function createCalendarLayout(start: string, end: string, language: SiteLanguage): CalendarLayout {
  const days = createDays(start, end, language);
  const strips = packDays(days);
  const pages = Array.from({ length: Math.ceil(strips.length / 2) }, (_, index) => ({
    index,
    strips: strips.slice(index * 2, index * 2 + 2),
  }));
  const loosePaperLength = strips.length * CALENDAR_GEOMETRY.workWidth;
  const overlap = strips.reduce((sum, strip) => sum + strip.glueWidth, 0);
  const firstStrip = strips[0];
  const lastStrip = strips.at(-1);
  const leadingMargin = firstStrip?.dayOffset ?? 0;
  const trailingMargin = lastStrip
    ? CALENDAR_GEOMETRY.workWidth -
      lastStrip.dayOffset -
      lastStrip.days.length * DAY_WIDTH
    : 0;
  return {
    days,
    strips,
    pages,
    loosePaperLength,
    assembledPaperLength: loosePaperLength - overlap,
    dayAxisLength: days.length * DAY_WIDTH,
    leadingMargin,
    trailingMargin,
  };
}
