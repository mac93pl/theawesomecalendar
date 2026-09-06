import { CalendarPageSvg } from '@/components/calendar-page-svg';
import { CalendarStyle, SiteLanguage, calendarFileName } from '@/lib/calendar';
import { CalendarLayout } from '@/lib/calendar-layout';

type ExportOptions = {
  onProgress?: (current: number, total: number) => void;
  signal?: AbortSignal;
};

function asBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return window.btoa(binary);
}

function throwIfCancelled(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException('Calendar export cancelled.', 'AbortError');
}

export async function generateCalendarPdf(
  layout: CalendarLayout,
  start: string,
  end: string,
  style: CalendarStyle,
  language: SiteLanguage,
  options: ExportOptions = {},
) {
  const [{ jsPDF }, { renderToStaticMarkup }] = await Promise.all([
    import('jspdf'),
    import('react-dom/server'),
    import('svg2pdf.js'),
  ]);
  const [latoRegularBytes, latoBoldBytes, latoBlackBytes, logoBytes] = await Promise.all([
    fetch('/fonts/lato-regular.ttf').then((response) => response.arrayBuffer()),
    fetch('/fonts/lato-bold.ttf').then((response) => response.arrayBuffer()),
    fetch('/fonts/lato-black.ttf').then((response) => response.arrayBuffer()),
    fetch('/brand/logo.png').then((response) => response.arrayBuffer()),
  ]);
  const logoHref = `data:image/png;base64,${asBase64(logoBytes)}`;
  throwIfCancelled(options.signal);

  const document = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
    putOnlyUsedFonts: true,
  });
  document.setProperties({
    title: 'The Awesome Calendar',
    subject: (language === 'pl' ? 'Kalendarz liniowy ' : 'Linear calendar ') + start + ' - ' + end,
    creator: 'The Awesome Calendar',
  });
  document.setLanguage(language);
  document.addFileToVFS('Lato-Regular.ttf', asBase64(latoRegularBytes));
  document.addFont('Lato-Regular.ttf', 'Lato', 'normal', 400);
  document.addFileToVFS('Lato-Bold.ttf', asBase64(latoBoldBytes));
  document.addFont('Lato-Bold.ttf', 'Lato', 'normal', 700);
  document.addFileToVFS('Lato-Black.ttf', asBase64(latoBlackBytes));
  document.addFont('Lato-Black.ttf', 'Lato', 'normal', 900);

  for (let index = 0; index < layout.pages.length; index += 1) {
    throwIfCancelled(options.signal);
    if (index > 0) document.addPage('a4', 'landscape');
    const markup = renderToStaticMarkup(
      <CalendarPageSvg
        language={language}
        logoHref={logoHref}
        page={layout.pages[index]}
        style={style}
        title={(language === 'pl' ? 'Kalendarz, strona ' : 'Calendar, page ') + String(index + 1)}
      />,
    );
    const svg = new DOMParser().parseFromString(markup, 'image/svg+xml').documentElement as unknown as SVGElement;
    await document.svg(svg, {
      x: 0,
      y: 0,
      width: layout.geometry.pageWidth,
      height: layout.geometry.pageHeight,
      loadExternalStyleSheets: false,
    });
    options.onProgress?.(index + 1, layout.pages.length);
    await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
  }

  throwIfCancelled(options.signal);
  return {
    bytes: new Uint8Array(document.output('arraybuffer')),
    filename: calendarFileName(start, end, style, language, layout.format),
    pages: layout.pages.length,
    days: layout.days.length,
    language,
    format: layout.format,
    dayWidth: layout.size.dayWidth,
    dayHeight: layout.size.dayHeight,
  };
}

export function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
