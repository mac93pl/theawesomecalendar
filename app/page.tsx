'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  CalendarRange,
  Check,
  Download,
  FileText,
  MoveHorizontal,
  Ruler,
  Sparkles,
} from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  CalendarMonth,
  CalendarStyle,
  SiteLanguage,
  addMonths,
  createMonths,
  currentMonthValue,
  monthCount,
  pageWord,
} from '@/lib/calendar';
import { COPY } from '@/lib/translations';

type ToolDefinition = {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  execute: (input: unknown) => unknown;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
};

type ModelContext = {
  registerTool: (tool: ToolDefinition, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

type CalendarToolInput = {
  start: string;
  end: string;
  style: CalendarStyle;
  language?: SiteLanguage;
};

function validToolInput(input: unknown): input is CalendarToolInput {
  if (!input || typeof input !== 'object') return false;
  const value = input as Record<string, unknown>;
  return (
    typeof value.start === 'string' &&
    typeof value.end === 'string' &&
    (value.style === 'rice' || value.style === 'block') &&
    (value.language === undefined || value.language === 'pl' || value.language === 'en') &&
    monthCount(value.start, value.end) >= 1 &&
    monthCount(value.start, value.end) <= 24
  );
}

function MonthTimeline({ data, x, y, width, style }: {
  data: CalendarMonth;
  x: number;
  y: number;
  width: number;
  style: CalendarStyle;
}) {
  const step = width / data.days;
  return (
    <g>
      <text className="calendar-month" x={x} y={y + 126}>{data.label}</text>
      <text className="calendar-year" x={x} y={y + 20}>{data.month === 0 ? data.year : ''}</text>
      {Array.from({ length: data.days }, (_, index) => {
        const day = index + 1;
        const dayOfWeek = new Date(Date.UTC(data.year, data.month, day)).getUTCDay();
        const weekend = dayOfWeek === 0 || dayOfWeek === 6;
        const dayX = x + index * step + step / 2;
        return (
          <g key={day}>
            <line className="calendar-day-line" x1={dayX} x2={dayX} y1={y + 28} y2={y + 96} />
            {style === 'rice' ? (
              <rect
                className={weekend ? 'calendar-mark weekend' : 'calendar-mark'}
                height={weekend ? 14 : 10}
                rx={4}
                width={weekend ? 5 : 3}
                x={dayX - (weekend ? 2.5 : 1.5)}
                y={y + 88}
              />
            ) : (
              <rect
                className={weekend ? 'calendar-block weekend' : 'calendar-block'}
                height={13}
                width={Math.max(step - 2, 4)}
                x={dayX - Math.max(step - 2, 4) / 2}
                y={y + 88}
              />
            )}
            <text className="calendar-day-number" textAnchor="middle" x={dayX} y={y + 114}>{day}</text>
          </g>
        );
      })}
    </g>
  );
}

function CalendarPagePreview({
  months,
  style,
  title,
  stripLabel,
}: {
  months: CalendarMonth[];
  style: CalendarStyle;
  title: string;
  stripLabel: string;
}) {
  const visible = months.slice(0, 4);
  return (
    <svg aria-labelledby="calendar-preview-title" className="calendar-sheet" viewBox="0 0 1120 790">
      <title id="calendar-preview-title">{title}</title>
      <rect fill="#fff" height="790" width="1120" />
      <path className="cut-line" d="M42 387 H1078" />
      <path className="safe-line" d="M42 46 H1078 V744 H42 Z" />
      {[0, 1].map((row) => {
        const rowMonths = visible.slice(row * 2, row * 2 + 2);
        if (rowMonths.length === 0) return null;
        return (
          <g key={row}>
            {rowMonths.map((month, index) => (
              <MonthTimeline
                data={month}
                key={String(month.year) + '-' + String(month.month)}
                style={style}
                width={484}
                x={index === 0 ? 58 : 578}
                y={84 + row * 350}
              />
            ))}
            <text className="strip-label" x={58} y={246 + row * 350}>THE AWESOME CALENDAR</text>
            <text className="strip-number" textAnchor="end" x={1062} y={246 + row * 350}>{stripLabel} {row + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Home() {
  const initialStart = useMemo(() => currentMonthValue(), []);
  const [language, setLanguage] = useState<SiteLanguage>('pl');
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(() => addMonths(initialStart, 11));
  const [style, setStyle] = useState<CalendarStyle>('rice');
  const [downloadState, setDownloadState] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const copy = COPY[language];

  const selectLanguage = useCallback((nextLanguage: SiteLanguage) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem('awesome-calendar-language', nextLanguage);
    const url = new URL(window.location.href);
    if (nextLanguage === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    window.history.replaceState({}, '', url);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const queryLanguage = new URLSearchParams(window.location.search).get('lang');
      const savedLanguage = window.localStorage.getItem('awesome-calendar-language');
      if (queryLanguage === 'en' || queryLanguage === 'pl') setLanguage(queryLanguage);
      else if (savedLanguage === 'en' || savedLanguage === 'pl') setLanguage(savedLanguage);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'pl'
      ? 'The Awesome Calendar — kalendarz liniowy do druku'
      : 'The Awesome Calendar — printable linear calendar';
  }, [language]);

  const count = monthCount(start, end);
  const invalidRange = count < 1 || count > 24;
  const months = useMemo(
    () => invalidRange ? [] : createMonths(start, end, language),
    [end, invalidRange, language, start],
  );
  const pages = Math.max(1, Math.ceil(months.length / 4));

  const runDownload = useCallback(async (selectedStyle: CalendarStyle = style) => {
    if (invalidRange) throw new Error(copy.generator.error);
    setStyle(selectedStyle);
    setDownloadState('working');

    try {
      const { downloadPdf, generateCalendarPdf } = await import('@/lib/calendar-pdf');
      const result = await generateCalendarPdf(start, end, selectedStyle, language);
      downloadPdf(result.bytes, result.filename);
      setDownloadState('done');
      return { downloaded: true, filename: result.filename, months: result.months, pages: result.pages, language };
    } catch (error) {
      setDownloadState('error');
      throw error;
    }
  }, [copy.generator.error, end, invalidRange, language, start, style]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: ToolDefinition) => {
      try {
        void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined);
      } catch {
        // WebMCP is optional; the visible interface remains fully functional.
      }
    };

    register({
      name: 'configure_calendar',
      title: language === 'pl' ? 'Ustaw kalendarz' : 'Configure calendar',
      description: language === 'pl'
        ? 'Ustawia widoczny zakres, styl i opcjonalnie język kalendarza.'
        : 'Sets the visible calendar range, style and optional language.',
      inputSchema: {
        type: 'object',
        properties: {
          start: { type: 'string', description: 'Start month in YYYY-MM format.' },
          end: { type: 'string', description: 'End month in YYYY-MM format.' },
          style: { type: 'string', enum: ['rice', 'block'] },
          language: { type: 'string', enum: ['pl', 'en'] },
        },
        required: ['start', 'end', 'style'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!validToolInput(input)) throw new Error(language === 'pl' ? 'Podaj poprawny zakres od 1 do 24 miesięcy.' : 'Provide a valid range from 1 to 24 months.');
        setStart(input.start);
        setEnd(input.end);
        setStyle(input.style);
        if (input.language) selectLanguage(input.language);
        const length = monthCount(input.start, input.end);
        return {
          start: input.start,
          end: input.end,
          style: input.style,
          language: input.language || language,
          months: length,
          pages: Math.ceil(length / 4),
        };
      },
    });

    register({
      name: 'download_calendar_pdf',
      title: language === 'pl' ? 'Pobierz kalendarz PDF' : 'Download calendar PDF',
      description: language === 'pl'
        ? 'Generuje PDF w języku aktualnie wybranym na stronie.'
        : 'Generates a PDF in the language currently selected on the page.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: () => runDownload(),
    });
    return () => lifecycle.abort();
  }, [language, runDownload, selectLanguage]);

  const statusMessage = downloadState === 'working'
    ? copy.generator.preparing
    : downloadState === 'done'
      ? copy.generator.done
      : downloadState === 'error'
        ? copy.generator.failed
        : '';
  const stepImages = ['/brand/drukarka.png', '/brand/ciecie.png', '/brand/klejenie.png'];

  return (
    <main>
      <header className="site-header">
        <a aria-label={copy.homeLabel} className="brand" href="#top">
          <Image alt="" height={100} priority src="/brand/logo.png" width={494} />
        </a>
        <div className="header-actions">
          <nav aria-label={copy.navLabel}>
            <a href="#jak-to-dziala">{copy.nav.how}</a>
            <a href="#warianty">{copy.nav.variants}</a>
            <a className="nav-support" href="#wsparcie">{copy.nav.support}</a>
          </nav>
          <fieldset className="language-switch">
            <legend className="language-legend">{copy.languageLabel}</legend>
            <button aria-pressed={language === 'pl'} onClick={() => selectLanguage('pl')} type="button">PL</button>
            <span aria-hidden="true">/</span>
            <button aria-pressed={language === 'en'} onClick={() => selectLanguage('en')} type="button">EN</button>
          </fieldset>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{copy.hero.eyebrow}</p>
          <h1>{copy.hero.line1}<br />{copy.hero.line2}</h1>
          <p className="hero-lead">{copy.hero.lead}</p>
          <a className="scroll-cue" href="#jak-to-dziala">{copy.hero.cue} <ArrowDown aria-hidden="true" /></a>
        </div>

        <div className="generator-card" id="generator">
          <div className="generator-heading">
            <div><p className="section-kicker">{copy.generator.kicker}</p><h2>{copy.generator.heading}</h2></div>
            <CalendarRange aria-hidden="true" />
          </div>
          <div className="date-grid">
            <label htmlFor="calendar-start"><span>{copy.generator.start}</span><Input aria-invalid={invalidRange} id="calendar-start" max="2035-12" min="2024-01" onChange={(event) => setStart(event.target.value)} type="month" value={start} /></label>
            <label htmlFor="calendar-end"><span>{copy.generator.end}</span><Input aria-invalid={invalidRange} id="calendar-end" max="2035-12" min="2024-01" onChange={(event) => setEnd(event.target.value)} type="month" value={end} /></label>
          </div>
          <RadioGroup aria-label={copy.generator.styleLabel} className="style-picker" onValueChange={(value) => setStyle(value as CalendarStyle)} value={style}>
            <label className="style-option" htmlFor="style-rice"><RadioGroupItem id="style-rice" value="rice" /><span><strong>{copy.generator.rice}</strong><small>{copy.generator.riceHint}</small></span></label>
            <label className="style-option" htmlFor="style-block"><RadioGroupItem id="style-block" value="block" /><span><strong>{copy.generator.block}</strong><small>{copy.generator.blockHint}</small></span></label>
          </RadioGroup>
          <div className="generator-result">
            <div><strong>{months.length || '—'} {copy.generator.monthsShort}</strong><span>{invalidRange ? copy.generator.fixRange : String(pages) + ' ' + pageWord(pages, language) + ' A4'}</span></div>
            <Button className="download-button" disabled={invalidRange || downloadState === 'working'} onClick={() => void runDownload()} size="lg">
              <Download aria-hidden="true" data-icon="inline-start" />{downloadState === 'working' ? copy.generator.working : copy.generator.download}
            </Button>
          </div>
          {invalidRange && <p className="range-error" role="alert">{copy.generator.error}</p>}
          <p className={['download-status', downloadState].join(' ')} aria-live="polite">{statusMessage}</p>
          <p className="privacy-note"><Check aria-hidden="true" /> {copy.generator.privacy}</p>
        </div>

        <div className="preview-card">
          <div className="preview-toolbar">
            <span>{copy.preview.label} — {copy.preview.page} 1 {copy.preview.of} {pages}</span>
            <span><FileText aria-hidden="true" /> {copy.preview.landscape}</span>
          </div>
          <div className="sheet-stage">
            {months.length > 0 ? (
              <CalendarPagePreview months={months} style={style} title={copy.preview.title} stripLabel={copy.preview.strip} />
            ) : <div className="empty-preview">{copy.preview.empty}</div>}
          </div>
        </div>
      </section>

      <section className="facts-rail" aria-label={copy.facts.label}>
        <div><Ruler aria-hidden="true" /><strong>{language === 'pl' ? '≈ 1,5 M' : '≈ 1.5 M'}</strong><span>{copy.facts.length}</span></div>
        <div><FileText aria-hidden="true" /><strong>3 × A4</strong><span>{copy.facts.pages}</span></div>
        <div><MoveHorizontal aria-hidden="true" /><strong>{copy.facts.axisValue}</strong><span>{copy.facts.axis}</span></div>
      </section>

      <section className="how-section" id="jak-to-dziala">
        <p className="section-kicker">{copy.how.kicker}</p><h2>{copy.how.heading}</h2>
        <div className="steps">
          {copy.how.steps.map(([title, text], index) => (
            <article className="step-card" key={title}>
              <span className="step-number">0{index + 1}</span><Image alt="" height={264} src={stepImages[index]} width={264} />
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="variants-section" id="warianty">
        <div className="section-heading-row">
          <div><p className="section-kicker">{copy.variants.kicker}</p><h2>{copy.variants.heading}</h2></div>
          <p>{copy.variants.lead}</p>
        </div>
        <div className="variant-grid">
          <article className="variant-card rice-variant">
            <div className="variant-image"><Image alt={copy.variants.riceAlt} height={600} src="/brand/ryz-preview.png" width={900} /></div>
            <div className="variant-copy"><span>{copy.variants.variant} 01</span><h3>{copy.variants.rice}</h3><p>{copy.variants.riceText}</p><Button onClick={() => void runDownload('rice')} disabled={invalidRange || downloadState === 'working'}><Download data-icon="inline-start" />{copy.variants.download}</Button></div>
          </article>
          <article className="variant-card block-variant">
            <div className="variant-image"><Image alt={copy.variants.blockAlt} height={600} src="/brand/blok-preview.png" width={900} /></div>
            <div className="variant-copy"><span>{copy.variants.variant} 02</span><h3>{copy.variants.block}</h3><p>{copy.variants.blockText}</p><Button onClick={() => void runDownload('block')} disabled={invalidRange || downloadState === 'working'}><Download data-icon="inline-start" />{copy.variants.download}</Button></div>
          </article>
        </div>
      </section>

      <section className="manifesto-section">
        <div className="manifesto-mark"><Sparkles aria-hidden="true" /></div>
        <blockquote>{copy.manifesto.quote}</blockquote><p>{copy.manifesto.text}</p>
      </section>

      <section className="faq-section" id="faq">
        <div><p className="section-kicker">{copy.faq.kicker}</p><h2>{copy.faq.line1}<br />{copy.faq.line2}</h2></div>
        <Accordion className="faq-list" key={language}>
          {copy.faq.items.map(([question, answer], index) => (
            <AccordionItem key={question} value={'faq-' + String(index)}><AccordionTrigger>{question}</AccordionTrigger><AccordionContent>{answer}</AccordionContent></AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="support-section" id="wsparcie">
        <p className="section-kicker">{copy.support.kicker}</p><h2>{copy.support.line1}<br />{copy.support.line2}</h2>
        <p>{copy.support.text}</p><Button disabled variant="outline">{copy.support.button}</Button>
      </section>

      <footer>
        <Image alt="The Awesome Calendar" height={100} src="/brand/logo.png" width={494} />
        <p>{copy.footer.line}</p><a href="#top">{copy.footer.top}</a>
      </footer>
    </main>
  );
}
