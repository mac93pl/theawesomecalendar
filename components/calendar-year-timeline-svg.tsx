import { useId } from 'react';

import type { CalendarDay } from '@/lib/calendar';

const VIEW_WIDTH = 1460;
const VIEW_HEIGHT = 108;
const PADDING_X = 18;
const LINE_TOP = 16;
const LINE_BOTTOM = 68;
const MONTH_LABEL_Y = 94;

export function CalendarYearTimelineSvg({ days, title }: {
  days: CalendarDay[];
  title: string;
}) {
  const titleId = useId();
  const dayWidth = (VIEW_WIDTH - PADDING_X * 2) / Math.max(days.length, 1);

  return (
    <svg
      aria-labelledby={titleId}
      className="hero-year-calendar"
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="geometricPrecision"
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id={titleId}>{title}</title>
      <rect fill="#ffffff" height={VIEW_HEIGHT} width={VIEW_WIDTH} />
      {days.map((day, index) => {
        const x = PADDING_X + index * dayWidth;
        const center = x + dayWidth / 2;
        const markerHeight = day.isWeekend ? 12 : 9;

        return (
          <g key={day.iso}>
            {day.startsMonth && (
              <text
                fill="#11110f"
                fontFamily="Lato, sans-serif"
                fontSize="12"
                fontWeight="900"
                letterSpacing="0.55"
                x={x + 3}
                y={MONTH_LABEL_Y}
              >
                {day.monthLabel}
              </text>
            )}
            <line
              stroke="#11110f"
              strokeWidth="0.55"
              x1={center}
              x2={center}
              y1={LINE_TOP}
              y2={LINE_BOTTOM - markerHeight}
            />
            <rect
              fill={day.isWeekend ? '#11110f' : '#ffffff'}
              height={markerHeight}
              rx="0.75"
              stroke="#11110f"
              strokeWidth="0.55"
              width="1.5"
              x={center - 0.75}
              y={LINE_BOTTOM - markerHeight}
            />
          </g>
        );
      })}
    </svg>
  );
}
