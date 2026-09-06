'use client';

import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useRef,
} from 'react';

export function DownloadTrust({
  children,
  className = '',
  message,
}: {
  children: ReactNode;
  className?: string;
  message: string;
}) {
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const moveTooltip = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      const gap = 18;
      const viewportPadding = 12;
      const left = Math.min(
        event.clientX + gap,
        window.innerWidth - tooltip.offsetWidth - viewportPadding,
      );
      const below = event.clientY + gap;
      const top =
        below + tooltip.offsetHeight <= window.innerHeight - viewportPadding
          ? below
          : event.clientY - tooltip.offsetHeight - gap;

      tooltip.style.left = `${Math.max(viewportPadding, left)}px`;
      tooltip.style.top = `${Math.max(viewportPadding, top)}px`;
    },
    [],
  );

  return (
    <div
      className={`download-trust ${className}`.trim()}
      onPointerEnter={moveTooltip}
      onPointerMove={moveTooltip}
    >
      {children}
      <span
        aria-hidden="true"
        className="download-trust-tooltip"
        ref={tooltipRef}
      >
        {message}
      </span>
      <p className="download-trust-mobile">{message}</p>
    </div>
  );
}
