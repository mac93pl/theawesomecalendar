import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from 'pdf-lib';

import {
  CalendarMonth,
  CalendarStyle,
  SiteLanguage,
  calendarFileName,
  createMonths,
} from '@/lib/calendar';

const A4_LANDSCAPE: [number, number] = [841.89, 595.28];
const INK = rgb(0.043, 0.043, 0.039);
const GRAY = rgb(0.58, 0.58, 0.55);
const LIGHT_GRAY = rgb(0.82, 0.82, 0.78);
const YELLOW = rgb(1, 0.788, 0.078);
const PDF_COPY = {
  pl: {
    subject: 'Kalendarz liniowy',
    strip: 'PASEK',
    instruction: 'DRUKUJ 100%  /  WYTNJ WZDŁUŻ LINII  /  SKLEJ PASKI W KOLEJNOŚCI',
  },
  en: {
    subject: 'Linear calendar',
    strip: 'STRIP',
    instruction: 'PRINT AT 100%  /  CUT ALONG THE LINE  /  JOIN STRIPS IN ORDER',
  },
} as const;

type FontPair = { body: PDFFont; display: PDFFont };

function drawCropMarks(page: PDFPage) {
  const [width, height] = A4_LANDSCAPE;
  const length = 12;
  const offset = 18;
  for (const x of [offset, width - offset]) {
    for (const y of [offset, height - offset]) {
      page.drawLine({ start: { x: x - length / 2, y }, end: { x: x + length / 2, y }, thickness: 0.6, color: INK });
      page.drawLine({ start: { x, y: y - length / 2 }, end: { x, y: y + length / 2 }, thickness: 0.6, color: INK });
    }
  }
  page.drawLine({
    start: { x: 24, y: height / 2 },
    end: { x: width - 24, y: height / 2 },
    thickness: 0.55,
    color: GRAY,
    dashArray: [4, 4],
  });
}

function drawMonth(page: PDFPage, data: CalendarMonth, x: number, top: number, width: number, style: CalendarStyle, fonts: FontPair) {
  const timelineY = top - 105;
  const step = width / data.days;
  if (data.month === 0) {
    page.drawText(String(data.year), { x, y: top - 8, size: 23, font: fonts.display, color: LIGHT_GRAY });
  }

  for (let index = 0; index < data.days; index += 1) {
    const day = index + 1;
    const dayX = x + index * step + step / 2;
    const weekday = new Date(Date.UTC(data.year, data.month, day)).getUTCDay();
    const weekend = weekday === 0 || weekday === 6;
    page.drawLine({
      start: { x: dayX, y: timelineY + 17 },
      end: { x: dayX, y: timelineY + 69 },
      thickness: 0.35,
      color: LIGHT_GRAY,
    });

    if (style === 'rice') {
      page.drawEllipse({
        x: dayX,
        y: timelineY + 15,
        xScale: weekend ? 2.1 : 1.3,
        yScale: weekend ? 6 : 4.2,
        borderWidth: 0.65,
        borderColor: INK,
        color: weekend ? INK : undefined,
      });
    } else {
      const markWidth = Math.max(step - 1.5, 2.8);
      page.drawRectangle({
        x: dayX - markWidth / 2,
        y: timelineY + 9,
        width: markWidth,
        height: 11,
        borderWidth: 0.65,
        borderColor: INK,
        color: weekend ? INK : undefined,
      });
    }

    const number = String(day);
    const size = 4.8;
    page.drawText(number, {
      x: dayX - fonts.body.widthOfTextAtSize(number, size) / 2,
      y: timelineY,
      size,
      font: fonts.body,
      color: GRAY,
    });
  }
  page.drawText(data.label, { x, y: timelineY - 25, size: 12.5, font: fonts.display, color: INK });
}

function drawStrip(
  page: PDFPage,
  months: CalendarMonth[],
  row: number,
  style: CalendarStyle,
  fonts: FontPair,
  stripNumber: number,
  language: SiteLanguage,
) {
  const [pageWidth, pageHeight] = A4_LANDSCAPE;
  const marginX = 38;
  const gap = 24;
  const monthWidth = (pageWidth - marginX * 2 - gap) / 2;
  const rowTop = pageHeight - 46 - row * (pageHeight / 2);
  const footerY = row === 0 ? pageHeight / 2 + 18 : 20;
  months.forEach((month, index) => {
    drawMonth(page, month, marginX + index * (monthWidth + gap), rowTop, monthWidth, style, fonts);
  });

  page.drawText('THE AWESOME CALENDAR', { x: marginX, y: footerY, size: 7, font: fonts.body, color: INK });
  const strip = PDF_COPY[language].strip + ' ' + String(stripNumber).padStart(2, '0');
  page.drawText(strip, {
    x: pageWidth - marginX - fonts.body.widthOfTextAtSize(strip, 7),
    y: footerY,
    size: 7,
    font: fonts.body,
    color: INK,
  });
  page.drawRectangle({ x: pageWidth / 2 - 22, y: footerY - 2, width: 44, height: 2, color: YELLOW });
}

export async function generateCalendarPdf(
  start: string,
  end: string,
  style: CalendarStyle,
  language: SiteLanguage,
) {
  const months = createMonths(start, end, language);
  const displayBytes = await fetch('/fonts/anton-regular.ttf').then((response) => {
    if (!response.ok) throw new Error(language === 'pl' ? 'Nie udało się wczytać fontu Anton.' : 'The Anton font could not be loaded.');
    return response.arrayBuffer();
  });

  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  document.setTitle('The Awesome Calendar');
  document.setSubject(PDF_COPY[language].subject + ' ' + start + '–' + end);
  document.setCreator('The Awesome Calendar');
  document.setLanguage(language);
  const fonts = {
    body: await document.embedFont(StandardFonts.Helvetica),
    display: await document.embedFont(displayBytes, { subset: true }),
  };

  for (let pageIndex = 0; pageIndex < Math.ceil(months.length / 4); pageIndex += 1) {
    const page = document.addPage(A4_LANDSCAPE);
    const pageMonths = months.slice(pageIndex * 4, pageIndex * 4 + 4);
    drawCropMarks(page);
    drawStrip(page, pageMonths.slice(0, 2), 0, style, fonts, pageIndex * 2 + 1, language);
    if (pageMonths.length > 2) {
      drawStrip(page, pageMonths.slice(2, 4), 1, style, fonts, pageIndex * 2 + 2, language);
    }
    page.drawText(PDF_COPY[language].instruction, {
      x: 38,
      y: 6,
      size: 4.5,
      font: fonts.display,
      color: GRAY,
    });
  }

  return {
    bytes: await document.save(),
    filename: calendarFileName(start, end, style, language),
    pages: document.getPageCount(),
    months: months.length,
    language,
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
  setTimeout(() => URL.revokeObjectURL(url), 1_000);
}
