import { memo, useId, useMemo } from 'react';

import { CalendarHeroNotes } from '@/components/calendar-hero-notes';
import { CalendarTimelineSvg } from '@/components/calendar-page-svg';
import type { CalendarStyle, SiteLanguage } from '@/lib/calendar';
import { createCalendarYearTimelineLayout } from '@/lib/calendar-layout';
import { COPY } from '@/lib/translations';

type CalendarYearPreviewProps = {
  annotated?: boolean;
  year: number;
  language: SiteLanguage;
  style: CalendarStyle;
  title: string;
};

export const CalendarYearTimelineSvg = memo(function CalendarYearTimelineSvg({
  annotated = false,
  year,
  language,
  style,
  title,
}: CalendarYearPreviewProps) {
  const layout = useMemo(
    () => createCalendarYearTimelineLayout(year, language),
    [year, language],
  );

  return (
    <CalendarTimelineSvg layout={layout} style={style} title={title}>
      {annotated && <CalendarHeroNotes language={language} layout={layout} />}
    </CalendarTimelineSvg>
  );
});

export function CalendarYearPreview(props: CalendarYearPreviewProps) {
  const hintId = useId();

  /* eslint-disable jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-noninteractive-element-interactions -- The scroll region needs keyboard focus and must keep arrow keys out of the surrounding radio group. */
  return (
    <div className="calendar-year-preview">
      <section
        aria-describedby={hintId}
        aria-label={props.title}
        className="calendar-year-scroll"
        onKeyDown={(event) => {
          // Keep arrow keys here instead of moving the surrounding style radios.
          if (event.key.startsWith('Arrow')) event.stopPropagation();
        }}
        tabIndex={0}
      >
        <CalendarYearTimelineSvg {...props} />
      </section>
      <span className="calendar-year-scroll-hint" id={hintId}>
        {COPY[props.language].hero.yearPreviewScrollHint}
      </span>
    </div>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-noninteractive-element-interactions */
}
