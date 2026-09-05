'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarRange,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Download,
  FileText,
  Menu,
  Moon,
  MoveHorizontal,
  Ruler,
  Sun,
  X,
} from 'lucide-react';

import { CalendarPageSvg, CalendarSampleSvg } from '@/components/calendar-page-svg';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  type CalendarRangePreset,
  type CalendarFormat,
  type CalendarStyle,
  type SiteLanguage,
  currentDateValue,
  dayWord,
  defaultEndDateValue,
  monthWord,
  pageWord,
  rangePresets,
  randomCalendarRange,
  rangeComment,
  rangeIsValid,
  rangeUnits,
  yearWord,
} from '@/lib/calendar';
import { createCalendarLayout } from '@/lib/calendar-layout';
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
  format?: CalendarFormat;
  language?: SiteLanguage;
};

type CalendarDownloadRequest = {
  format?: CalendarFormat;
  range?: { start: string; end: string };
  style?: CalendarStyle;
};

type Theme = 'light' | 'dark';
type SupportStatus = 'cancelled' | 'error' | 'invalid' | 'success' | null;

const THEME_STORAGE_KEY = 'awesome-calendar-theme';
const MODULE_RECOVERY_KEY = 'awesome-calendar-module-recovery';
const SUPPORT_AMOUNTS = [5, 10, 20] as const;

function calendarYearRange(year: number) {
  return { start: `${year}-01-01`, end: `${year}-12-31` };
}

function insertYear(template: string, year: number) {
  return template.replace('{year}', String(year));
}

function displayDateRange(start: string, end: string, language: SiteLanguage) {
  const displayDate = (value: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return value;
    return language === 'pl'
      ? `${match[3]}.${match[2]}.${match[1]}`
      : `${match[3]}/${match[2]}/${match[1]}`;
  };

  return `${displayDate(start)}–${displayDate(end)}`;
}

function BrandLogo({ alt, priority = false }: { alt: string; priority?: boolean }) {
  return (
    <span className="brand-logo">
      <Image alt={alt} className="brand-logo-light" height={113} priority={priority} src="/brand/logo-light.svg" width={545} />
      <Image alt={alt} className="brand-logo-dark" height={113} priority={priority} src="/brand/logo-dark.svg" width={545} />
    </span>
  );
}

type DonationCheckoutProps = {
  copy: (typeof COPY)[SiteLanguage]['donation'];
  language: SiteLanguage;
  source: 'dialog' | 'section';
  status: SupportStatus;
};

function DonationCheckout({ copy, language, source, status }: DonationCheckoutProps) {
  const statusMessage = status ? copy.status[status] : '';

  return (
    <div className="donation-checkout">
      <fieldset className="donation-presets">
        <legend>{copy.amountLegend}</legend>
        <div className="donation-preset-buttons">
          {SUPPORT_AMOUNTS.map((amount, index) => (
            <form action="/api/checkout" key={amount} method="post">
              <input name="language" type="hidden" value={language} />
              <input name="source" type="hidden" value={source} />
              <Button
                aria-label={`${copy.presetButton}: ${language === 'pl' ? `${amount} zł` : `PLN ${amount}`} — ${copy.amountNames[index]}`}
                aria-describedby={`donation-legal-${source}`}
                className={amount === 10 ? 'donation-preset-option is-recommended' : 'donation-preset-option'}
                name="amount"
                type="submit"
                value={amount}
              >
                <strong>{language === 'pl' ? `${amount} zł` : `PLN ${amount}`}</strong>
                <span>{copy.amountNames[index]}</span>
                {amount === 10 && <small>{copy.recommended}</small>}
              </Button>
            </form>
          ))}
        </div>
      </fieldset>
      <form action="/api/checkout" className="donation-custom" method="post">
        <input name="language" type="hidden" value={language} />
        <input name="source" type="hidden" value={source} />
        <label htmlFor={`support-amount-${source}`}>{copy.customLabel}</label>
        <div className="donation-custom-row">
          <div className="donation-amount-field">
            <Input
              aria-describedby={`support-hint-${source} donation-legal-${source}`}
              id={`support-amount-${source}`}
              inputMode="numeric"
              max="1000"
              min="5"
              name="amount"
              placeholder={copy.customPlaceholder}
              required
              step="1"
              type="number"
            />
            <span aria-hidden="true">PLN</span>
          </div>
          <Button aria-describedby={`donation-legal-${source}`} type="submit"><Coffee aria-hidden="true" />{copy.customButton}</Button>
        </div>
        <p className="donation-hint" id={`support-hint-${source}`}>{copy.hint}</p>
      </form>
      <p className="donation-legal" id={`donation-legal-${source}`}>{copy.legal}</p>
      <p
        aria-live="polite"
        className={status ? `donation-status ${status}` : 'donation-status'}
        role={status === 'error' || status === 'invalid' ? 'alert' : undefined}
      >
        {statusMessage}
      </p>
    </div>
  );
}

function validToolInput(input: unknown): input is CalendarToolInput {
  if (!input || typeof input !== 'object') return false;
  const value = input as Record<string, unknown>;
  return (
    typeof value.start === 'string' &&
    typeof value.end === 'string' &&
    (value.style === 'rice' || value.style === 'block') &&
    (value.format === undefined || value.format === 'standard' || value.format === 'tall' || value.format === 'big') &&
    (value.language === undefined || value.language === 'pl' || value.language === 'en') &&
    rangeIsValid(value.start, value.end)
  );
}

export default function Home() {
  const [initialStart, setInitialStart] = useState(() => new Date().toISOString().slice(0, 10));
  const initialEnd = useMemo(() => defaultEndDateValue(initialStart), [initialStart]);
  const [language, setLanguage] = useState<SiteLanguage>('pl');
  const [theme, setTheme] = useState<Theme>('light');
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [style, setStyle] = useState<CalendarStyle>('rice');
  const [format, setFormat] = useState<CalendarFormat>('standard');
  const [readyYear, setReadyYear] = useState(() => new Date().getFullYear());
  const [readyStyle, setReadyStyle] = useState<CalendarStyle>('rice');
  const [previewPage, setPreviewPage] = useState(0);
  const [downloadState, setDownloadState] = useState<'idle' | 'working' | 'done' | 'cancelled' | 'error'>('idle');
  const [downloadProgress, setDownloadProgress] = useState<{ current: number; total: number } | null>(null);
  const [donationOpen, setDonationOpen] = useState(false);
  const [supportStatus, setSupportStatus] = useState<SupportStatus>(null);
  const downloadAbortRef = useRef<AbortController | null>(null);
  const copy = COPY[language];
  const currentYear = Number(initialStart.slice(0, 4));
  const nextYear = currentYear + 1;
  const readyYearRange = useMemo(() => calendarYearRange(readyYear), [readyYear]);
  const readyYearLayout = useMemo(
    () => createCalendarLayout(readyYearRange.start, readyYearRange.end, language),
    [language, readyYearRange.end, readyYearRange.start],
  );
  const readySampleStrip = readyYearLayout.strips[0];
  const readyStyleLabel = readyStyle === 'rice' ? copy.generator.rice : copy.generator.block;
  const readyDownloadLabel = insertYear(copy.ready.download, readyYear);

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
      const searchParams = new URLSearchParams(window.location.search);
      const queryLanguage = searchParams.get('lang');
      const savedLanguage = window.localStorage.getItem('awesome-calendar-language');
      if (queryLanguage === 'en' || queryLanguage === 'pl') setLanguage(queryLanguage);
      else if (savedLanguage === 'en' || savedLanguage === 'pl') setLanguage(savedLanguage);
      const queryStatus = searchParams.get('support');
      if (queryStatus === 'success' || queryStatus === 'cancelled' || queryStatus === 'error' || queryStatus === 'invalid') {
        setSupportStatus(queryStatus);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const localStart = currentDateValue();
      if (localStart === initialStart) return;
      setInitialStart(localStart);
      setStart(localStart);
      setEnd(defaultEndDateValue(localStart));
      setReadyYear(Number(localStart.slice(0, 4)));
      setPreviewPage(0);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [initialStart]);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    const syncTheme = () => {
      if (window.sessionStorage.getItem(THEME_STORAGE_KEY)) return;
      const nextTheme: Theme = media.matches ? 'dark' : 'light';
      root.classList.toggle('dark', nextTheme === 'dark');
      root.style.colorScheme = nextTheme;
      setTheme(nextTheme);
    };

    const timeout = window.setTimeout(() => {
      setTheme(root.classList.contains('dark') ? 'dark' : 'light');
    }, 0);
    media.addEventListener('change', syncTheme);
    return () => {
      window.clearTimeout(timeout);
      media.removeEventListener('change', syncTheme);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const nextTheme: Theme = root.classList.contains('dark') ? 'light' : 'dark';
    root.classList.toggle('dark', nextTheme === 'dark');
    root.style.colorScheme = nextTheme;
    window.sessionStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'pl'
      ? 'The Awesome Calendar - kalendarz liniowy'
      : 'The Awesome Calendar - linear calendar';
  }, [language]);

  useEffect(() => {
    const recoverFromStaleModule = (event: Event) => {
      event.preventDefault();
      if (window.sessionStorage.getItem(MODULE_RECOVERY_KEY) === 'reloaded') {
        setDownloadState('error');
        return;
      }
      window.sessionStorage.setItem(MODULE_RECOVERY_KEY, 'reloaded');
      window.location.reload();
    };

    window.addEventListener('vite:preloadError', recoverFromStaleModule);
    return () => window.removeEventListener('vite:preloadError', recoverFromStaleModule);
  }, []);

  const invalidRange = !rangeIsValid(start, end);
  const layout = useMemo(
    () => invalidRange ? null : createCalendarLayout(start, end, language, format),
    [end, format, invalidRange, language, start],
  );
  const units = useMemo(() => rangeUnits(start, end), [end, start]);
  const pages = layout?.pages.length ?? 0;
  const presets = useMemo(
    () => rangePresets(initialStart, language),
    [initialStart, language],
  );
  const quickPresets = presets.filter((preset) => preset.group === 'quick');
  const durationPresets = presets.filter((preset) => preset.group === 'duration');
  const calendarPresets = presets.filter((preset) => preset.group === 'calendar');
  const randomPreset = presets.find((preset) => preset.group === 'random');
  const rangeFeedback = useMemo(
    () => rangeComment(units, language),
    [language, units],
  );
  const validationMessage = invalidRange ? rangeFeedback || copy.generator.error : rangeFeedback;
  const activePreviewPage = Math.min(previewPage, Math.max(0, pages - 1));
  const selectedFormatLabel = format === 'standard'
    ? copy.generator.formatStandard
    : format === 'tall'
      ? copy.generator.formatTall
      : copy.generator.formatBig;
  const selectedStyleLabel = style === 'rice' ? copy.generator.rice : copy.generator.block;
  const downloadSpec = invalidRange
    ? copy.generator.downloadFixRange
    : `${displayDateRange(start, end, language)} · ${selectedFormatLabel} · ${selectedStyleLabel} · ${pages} A4`;

  const runDownload = useCallback(async (request: CalendarDownloadRequest = {}) => {
    const selectedStyle = request.style ?? style;
    const selectedFormat = request.format ?? format;
    const rangeStart = request.range?.start ?? start;
    const rangeEnd = request.range?.end ?? end;
    if (!rangeIsValid(rangeStart, rangeEnd)) throw new Error(copy.generator.error);
    const targetLayout = request.range || request.format
      ? createCalendarLayout(rangeStart, rangeEnd, language, selectedFormat)
      : layout;
    if (!targetLayout) throw new Error(copy.generator.error);

    downloadAbortRef.current?.abort();
    const controller = new AbortController();
    downloadAbortRef.current = controller;
    setDownloadState('working');
    setDownloadProgress({ current: 0, total: targetLayout.pages.length });

    try {
      const { downloadPdf, generateCalendarPdf } = await import('@/lib/calendar-export');
      const result = await generateCalendarPdf(targetLayout, rangeStart, rangeEnd, selectedStyle, language, {
        signal: controller.signal,
        onProgress: (current, total) => setDownloadProgress({ current, total }),
      });
      window.sessionStorage.removeItem(MODULE_RECOVERY_KEY);
      downloadPdf(result.bytes, result.filename);
      setDownloadState('done');
      setDonationOpen(true);
      return { downloaded: true, filename: result.filename, days: result.days, pages: result.pages, language, format: result.format };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setDownloadState('cancelled');
        return { downloaded: false, cancelled: true };
      }
      setDownloadState('error');
      console.warn('Calendar PDF generation failed.', error);
      return {
        downloaded: false,
        error: error instanceof Error ? error.message : copy.generator.failed,
      };
    } finally {
      if (downloadAbortRef.current === controller) downloadAbortRef.current = null;
    }
  }, [copy.generator.error, copy.generator.failed, end, format, language, layout, start, style]);

  const runReadyCalendarDownload = useCallback((selectedStyle: CalendarStyle, year: number) => (
    runDownload({
      format: 'standard',
      range: calendarYearRange(year),
      style: selectedStyle,
    })
  ), [runDownload]);

  const cancelDownload = useCallback(() => {
    downloadAbortRef.current?.abort();
  }, []);

  const selectPreset = useCallback((preset: CalendarRangePreset) => {
    const selectedRange = preset.group === 'random'
      ? randomCalendarRange(initialStart)
      : preset;
    setStart(selectedRange.start);
    setEnd(selectedRange.end);
    setPreviewPage(0);
  }, [initialStart]);

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
        ? 'Ustawia widoczny zakres dni, styl, rozmiar i opcjonalnie język kalendarza.'
        : 'Sets the visible date range, style, size and optional calendar language.',
      inputSchema: {
        type: 'object',
        properties: {
          start: { type: 'string', description: 'Inclusive start date in YYYY-MM-DD format.' },
          end: { type: 'string', description: 'Inclusive end date in YYYY-MM-DD format.' },
          style: { type: 'string', enum: ['rice', 'block'] },
          format: { type: 'string', enum: ['standard', 'tall', 'big'] },
          language: { type: 'string', enum: ['pl', 'en'] },
        },
        required: ['start', 'end', 'style'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!validToolInput(input)) throw new Error(copy.generator.error);
        setStart(input.start);
        setEnd(input.end);
        setStyle(input.style);
        const configuredFormat = input.format || format;
        setFormat(configuredFormat);
        setPreviewPage(0);
        if (input.language) selectLanguage(input.language);
        const configuredLayout = createCalendarLayout(
          input.start,
          input.end,
          input.language || language,
          configuredFormat,
        );
        return {
          start: input.start,
          end: input.end,
          style: input.style,
          format: configuredFormat,
          language: input.language || language,
          days: configuredLayout.days.length,
          strips: configuredLayout.strips.length,
          pages: configuredLayout.pages.length,
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
  }, [copy.generator.error, format, language, runDownload, selectLanguage]);

  const statusMessage = downloadState === 'working'
    ? copy.generator.preparing
      .replace('{current}', String(downloadProgress?.current ?? 0))
      .replace('{total}', String(downloadProgress?.total ?? pages))
    : downloadState === 'done'
      ? copy.generator.done
      : downloadState === 'cancelled'
        ? copy.generator.cancelled
        : downloadState === 'error'
          ? copy.generator.failed
          : '';
  const stepImages = ['/brand/drukarka.png', '/brand/ciecie.png', '/brand/klejenie.png'];

  return (
    <main>
      <header className="site-header">
        <a aria-label={copy.homeLabel} className="brand" href="#top">
          <BrandLogo alt="" priority />
        </a>
        <div className="header-actions">
          <nav aria-label={copy.navLabel} className="desktop-nav">
            <a href="#gotowy">{copy.nav.ready}</a>
            <a href="#generator">{copy.nav.custom}</a>
            <a className="nav-support" href="#wsparcie">{copy.nav.support}</a>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger render={<button aria-label={copy.nav.menu} className="mobile-nav-trigger" type="button" />}>
              <Menu aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="mobile-nav-menu" sideOffset={8}>
              <DropdownMenuItem render={<a aria-label={copy.nav.ready} href="#gotowy" />}>{copy.nav.ready}</DropdownMenuItem>
              <DropdownMenuItem render={<a aria-label={copy.nav.custom} href="#generator" />}>{copy.nav.custom}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<a aria-label={copy.nav.support} href="#wsparcie" />}>{copy.nav.support}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            aria-label={theme === 'dark' ? copy.theme.light : copy.theme.dark}
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? copy.theme.light : copy.theme.dark}
            type="button"
          >
            {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
          <fieldset className="language-switch">
            <legend className="language-legend">{copy.languageLabel}</legend>
            <button aria-pressed={language === 'pl'} onClick={() => selectLanguage('pl')} type="button">PL</button>
            <span aria-hidden="true">/</span>
            <button aria-pressed={language === 'en'} onClick={() => selectLanguage('en')} type="button">EN</button>
          </fieldset>
        </div>
      </header>

      <section aria-label={copy.process.label} className="process-strip">
        <ol>
          {copy.process.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </section>

      <section className="promo-hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{copy.hero.eyebrow}</p>
          <h1>{copy.hero.line1}<br />{copy.hero.line2}</h1>
          <p className="hero-lead">{copy.hero.lead}</p>
          <div className="hero-actions">
            <a className="hero-primary" href="#gotowy"><Download aria-hidden="true" />{copy.hero.primaryCta}</a>
            <a className="hero-secondary" href="#generator"><CalendarRange aria-hidden="true" />{copy.hero.secondaryCta}</a>
          </div>
          <p className="hero-meta">{copy.hero.meta}</p>
        </div>
      </section>

      <section className="facts-rail" aria-label={copy.facts.label}>
        <div><Ruler aria-hidden="true" /><strong>{language === 'pl' ? '≈ 1,5–3 M' : '≈ 1.5–3 M'}</strong><span>{copy.facts.length}</span></div>
        <div><FileText aria-hidden="true" /><strong>3–12 × A4</strong><span>{copy.facts.pages}</span></div>
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

      <section className="ready-section" id="gotowy">
        <div className="ready-heading">
          <div><p className="section-kicker">{copy.ready.kicker}</p><h2>{copy.ready.heading}</h2></div>
          <p>{copy.ready.lead}</p>
        </div>
        <div className="ready-builder">
          <div className="ready-choice ready-year-choice">
            <span className="ready-choice-label">{copy.ready.yearLabel}</span>
            <RadioGroup
              aria-label={copy.ready.yearLabel}
              className="ready-year-picker"
              onValueChange={(value) => setReadyYear(Number(value))}
              value={String(readyYear)}
            >
              <label className="ready-year-option" htmlFor="ready-year-current">
                <RadioGroupItem id="ready-year-current" value={String(currentYear)} />
                <span><strong>{currentYear}</strong><small>{copy.ready.currentYear}</small></span>
              </label>
              <label className="ready-year-option" htmlFor="ready-year-next">
                <RadioGroupItem id="ready-year-next" value={String(nextYear)} />
                <span><strong>{nextYear}</strong><small>{copy.ready.nextYear}</small></span>
              </label>
            </RadioGroup>
          </div>

          <div className="ready-choice ready-style-choice">
            <span className="ready-choice-label">{copy.ready.styleLabel}</span>
            <RadioGroup
              aria-label={copy.ready.styleLabel}
              className="ready-style-picker"
              onValueChange={(value) => setReadyStyle(value as CalendarStyle)}
              value={readyStyle}
            >
              <label className="ready-style-option ready-style-rice" htmlFor="ready-style-rice">
                <span className="ready-style-preview"><CalendarSampleSvg strip={readySampleStrip} style="rice" title={copy.variants.riceAlt} /></span>
                <span className="ready-style-meta"><RadioGroupItem id="ready-style-rice" value="rice" /><span><strong>{copy.generator.rice}</strong><small>{copy.generator.riceHint}</small></span></span>
              </label>
              <label className="ready-style-option ready-style-block" htmlFor="ready-style-block">
                <span className="ready-style-preview"><CalendarSampleSvg strip={readySampleStrip} style="block" title={copy.variants.blockAlt} /></span>
                <span className="ready-style-meta"><RadioGroupItem id="ready-style-block" value="block" /><span><strong>{copy.generator.block}</strong><small>{copy.generator.blockHint}</small></span></span>
              </label>
            </RadioGroup>
          </div>

          <div className="ready-result">
            <div>
              <span>{copy.ready.selected}</span>
              <strong>{readyYear} · {readyStyleLabel}</strong>
              <small>{copy.ready.summary}</small>
            </div>
            <Button className="ready-download-button" disabled={downloadState === 'working'} onClick={() => void runReadyCalendarDownload(readyStyle, readyYear)} size="lg">
              <Download aria-hidden="true" data-icon="inline-start" />{downloadState === 'working' ? copy.generator.working : readyDownloadLabel}
            </Button>
          </div>
        </div>
      </section>

      <section className="generator-hero" id="generator">
        <div className="generator-intro">
          <p className="section-kicker">{copy.custom.kicker}</p>
          <h2>{copy.custom.line1}<br />{copy.custom.line2}<br />{copy.custom.line3}</h2>
          <p>{copy.custom.text}</p>
        </div>

        <div className="generator-workspace">
          <div className="generator-card">
            <div className="generator-heading">
              <div><p className="section-kicker">{copy.generator.kicker}</p><h2>{copy.generator.heading}</h2></div>
              <CalendarRange aria-hidden="true" />
            </div>
            <section className="generator-step">
              <h3 className="generator-step-title"><span>01</span>{copy.generator.rangeSection}</h3>
              <div className="preset-group">
                <span>{copy.generator.presets}</span>
                <div className="preset-buttons">
                  {quickPresets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => selectPreset(preset)}
                      type="button"
                    >
                      {preset.label}
                    </button>
                  ))}
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<button aria-label={copy.generator.morePresets} className="preset-more-button" type="button" />}>
                      {copy.generator.morePresets}<ChevronDown aria-hidden="true" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="preset-menu" sideOffset={7}>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>{copy.generator.durationPresets}</DropdownMenuLabel>
                        {durationPresets.map((preset) => (
                          <DropdownMenuItem key={preset.label} onClick={() => selectPreset(preset)}>
                            {preset.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>{copy.generator.calendarPresets}</DropdownMenuLabel>
                        {calendarPresets.map((preset) => (
                          <DropdownMenuItem key={preset.label} onClick={() => selectPreset(preset)}>
                            {preset.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                      {randomPreset && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="preset-menu-random" onClick={() => selectPreset(randomPreset)}>
                            {randomPreset.label}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="date-grid">
                <label htmlFor="calendar-start"><span>{copy.generator.start}</span><Input aria-invalid={invalidRange} id="calendar-start" max="9999-12-31" min="1900-01-01" onChange={(event) => setStart(event.target.value)} type="date" value={start} /></label>
                <label htmlFor="calendar-end"><span>{copy.generator.end}</span><Input aria-invalid={invalidRange} id="calendar-end" max="9999-12-31" min={start || '1900-01-01'} onChange={(event) => setEnd(event.target.value)} type="date" value={end} /></label>
              </div>
            </section>
            <section className="generator-step">
              <h3 className="generator-step-title"><span>02</span>{copy.generator.sizeSection}</h3>
              <div className="format-control">
                <RadioGroup
                  aria-describedby="calendar-format-explanation"
                  aria-label={copy.generator.formatLabel}
                  className="format-picker"
                  onValueChange={(value) => {
                    setFormat(value as CalendarFormat);
                    setPreviewPage(0);
                  }}
                  value={format}
                >
                  <label className="format-option format-option-standard" htmlFor="format-standard">
                    <RadioGroupItem disabled={downloadState === 'working'} id="format-standard" value="standard" />
                    <span aria-hidden="true" className="format-glyph format-glyph-standard" />
                    <span><strong>{copy.generator.formatStandard}</strong><small>{copy.generator.formatStandardHint}</small></span>
                  </label>
                  <label className="format-option format-option-tall" htmlFor="format-tall">
                    <RadioGroupItem disabled={downloadState === 'working'} id="format-tall" value="tall" />
                    <span aria-hidden="true" className="format-glyph format-glyph-tall" />
                    <span><strong>{copy.generator.formatTall}</strong><small>{copy.generator.formatTallHint}</small></span>
                  </label>
                  <label className="format-option format-option-big" htmlFor="format-big">
                    <RadioGroupItem disabled={downloadState === 'working'} id="format-big" value="big" />
                    <span aria-hidden="true" className="format-glyph format-glyph-big" />
                    <span><strong>{copy.generator.formatBig}</strong><small>{copy.generator.formatBigHint}</small></span>
                  </label>
                </RadioGroup>
                <p className="format-explanation" id="calendar-format-explanation">{copy.generator.formatExplanation}</p>
              </div>
            </section>
            <section className="generator-step">
              <h3 className="generator-step-title"><span>03</span>{copy.generator.styleSection}</h3>
              <RadioGroup aria-label={copy.generator.styleLabel} className="style-picker" onValueChange={(value) => setStyle(value as CalendarStyle)} value={style}>
                <label className="style-option" htmlFor="style-rice"><RadioGroupItem id="style-rice" value="rice" /><span aria-hidden="true" className="style-glyph style-glyph-rice" /><span><strong>{copy.generator.rice}</strong><small>{copy.generator.riceHint}</small></span></label>
                <label className="style-option" htmlFor="style-block"><RadioGroupItem id="style-block" value="block" /><span aria-hidden="true" className="style-glyph style-glyph-block" /><span><strong>{copy.generator.block}</strong><small>{copy.generator.blockHint}</small></span></label>
              </RadioGroup>
            </section>
            <div className="generator-result">
              <div className="range-summary">
                <div className="range-counters">
                  {units.years > 0 && <span><b>{units.years}</b> {yearWord(units.years, language)}</span>}
                  {units.remainingMonths > 0 && <span><b>{units.remainingMonths}</b> {monthWord(units.remainingMonths, language)}</span>}
                  {units.remainingDays > 0 && <span><b>{units.remainingDays}</b> {dayWord(units.remainingDays, language)}</span>}
                  {units.years === 0 && units.remainingMonths === 0 && units.remainingDays === 0 && <span><b>—</b></span>}
                </div>
                <small>{invalidRange ? copy.generator.fixRange : String(pages) + ' ' + pageWord(pages, language) + ' A4'}</small>
                {!invalidRange && units.months > 0 && (
                  <small className="range-totals">
                    {copy.generator.totalRange}: {units.months} {monthWord(units.months, language)} · {units.days} {dayWord(units.days, language)}
                  </small>
                )}
              </div>
              <div className="download-panel">
                <p className="download-spec"><span>{copy.generator.downloadIncludes}</span><strong>{downloadSpec}</strong></p>
                <div className="download-actions">
                  <Button className="download-button generator-download-button" disabled={invalidRange || downloadState === 'working'} onClick={() => void runDownload()} size="lg">
                    <Download aria-hidden="true" data-icon="inline-start" />{downloadState === 'working' ? copy.generator.working : copy.generator.download}
                  </Button>
                  {downloadState === 'working' && (
                    <Button aria-label={copy.generator.cancel} className="cancel-button" onClick={cancelDownload} size="icon" variant="outline"><X aria-hidden="true" /></Button>
                  )}
                </div>
              </div>
            </div>
            {validationMessage && (
              <p className={invalidRange ? 'range-error' : 'range-comment'} role={invalidRange ? 'alert' : undefined}>
                {validationMessage}
              </p>
            )}
            <p className={['download-status', downloadState].join(' ')} aria-live="polite">{statusMessage}</p>
          </div>

          <div className="preview-card">
            <div className="preview-toolbar">
              <div className="preview-page-controls">
                <button aria-label={copy.preview.previous} disabled={activePreviewPage === 0 || !layout} onClick={() => setPreviewPage(Math.max(0, activePreviewPage - 1))} type="button"><ChevronLeft aria-hidden="true" /></button>
                <span>{copy.preview.label} — {copy.preview.page} {pages ? activePreviewPage + 1 : 0} {copy.preview.of} {pages}</span>
                <button aria-label={copy.preview.next} disabled={!layout || activePreviewPage >= pages - 1} onClick={() => setPreviewPage(Math.min(pages - 1, activePreviewPage + 1))} type="button"><ChevronRight aria-hidden="true" /></button>
              </div>
              <span><FileText aria-hidden="true" /> {copy.preview.landscape}</span>
            </div>
            <div className="sheet-stage">
              {layout?.pages[activePreviewPage] ? (
                <CalendarPageSvg language={language} page={layout.pages[activePreviewPage]} style={style} title={`${copy.preview.title} ${activePreviewPage + 1}`} />
              ) : <div className="empty-preview">{copy.preview.empty}</div>}
            </div>
          </div>
        </div>
      </section>

      <section className="project-note">
        <div className="project-note-copy">
          <span className="project-note-stamp">{copy.projectNote.stamp}</span>
          <p className="project-note-lead">
            {copy.projectNote.leadPrefix}<mark>{copy.projectNote.leadHighlight}</mark>{copy.projectNote.leadSuffix}
          </p>
          <div className="project-note-grid">
            <p>
              {copy.projectNote.originPrefix}<mark>{copy.projectNote.originHighlight}</mark>{copy.projectNote.originSuffix}
            </p>
            <p>
              {copy.projectNote.usagePrefix}<mark>{copy.projectNote.usageHighlight}</mark>{copy.projectNote.usageSuffix}
            </p>
          </div>
          <div className="project-note-closing">
            <div>
              <p>{copy.projectNote.thanks}</p>
              <p className="project-note-signoff">{copy.projectNote.signoff}</p>
            </div>
            <a className="project-note-cta" href="#wsparcie"><Coffee aria-hidden="true" />{copy.projectNote.cta}</a>
          </div>
        </div>
      </section>

      <section className="manifesto-section">
        <div className="manifesto-mark"><MoveHorizontal aria-hidden="true" /></div>
        <div className="manifesto-main">
          <blockquote>{copy.manifesto.quote}</blockquote>
          <div aria-hidden="true" className="manifesto-axis">
            <span>{copy.manifesto.past}</span>
            <span>{copy.manifesto.now}</span>
            <span>{copy.manifesto.future}</span>
          </div>
        </div>
        <div className="manifesto-copy">
          <p>{copy.manifesto.perception}</p>
          <p>{copy.manifesto.approach}</p>
        </div>
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
        <p>{copy.support.text}</p>
        <DonationCheckout copy={copy.donation} language={language} source="section" status={supportStatus} />
      </section>

      <section aria-labelledby="quick-download-heading" className="quick-download-section">
        <div className="quick-download-heading">
          <div>
            <p className="section-kicker">{copy.quickDownload.kicker}</p>
            <h2 id="quick-download-heading">{copy.quickDownload.heading}</h2>
          </div>
          <p>{copy.quickDownload.lead}</p>
        </div>
        <div className="quick-download-grid">
          {([
            { name: copy.generator.rice, style: 'rice' as const, title: copy.variants.riceAlt },
            { name: copy.generator.block, style: 'block' as const, title: copy.variants.blockAlt },
          ]).map((variant, index) => (
            <article className={`quick-download-card quick-download-${variant.style}`} key={variant.style}>
              <div className="quick-download-preview">
                <CalendarSampleSvg strip={readySampleStrip} style={variant.style} title={variant.title} />
              </div>
              <div className="quick-download-body">
                <div className="quick-download-title">
                  <span>{copy.variants.variant} 0{index + 1}</span>
                  <h3>{variant.name}</h3>
                </div>
                <div className="quick-download-actions">
                  {[currentYear, nextYear].map((year) => (
                    <Button
                      disabled={downloadState === 'working'}
                      key={year}
                      onClick={() => void runReadyCalendarDownload(variant.style, year)}
                      type="button"
                    >
                      <Download aria-hidden="true" data-icon="inline-start" />
                      {insertYear(copy.variants.download, year)}
                    </Button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand">
          <BrandLogo alt="The Awesome Calendar" />
          <p>{copy.footer.line}</p>
          <p className="footer-copyright">{copy.footer.copyright}</p>
        </div>
        <div className="footer-legal">
          <p>{copy.footer.permission}</p>
          <nav aria-label={copy.footer.licensesLabel} className="footer-license-links">
            <a data-license="MPL-2.0" href="https://www.mozilla.org/MPL/2.0/" rel="license">{copy.footer.codeLicense}</a>
            <a data-license="CC-BY-4.0" href="https://creativecommons.org/licenses/by/4.0/" rel="license">{copy.footer.contentLicense}</a>
          </nav>
          <p>{copy.footer.attribution}</p>
          <p>{copy.footer.brand}</p>
          <p className="footer-warning">{copy.footer.warning}</p>
        </div>
        <a className="footer-top" href="#top">{copy.footer.top}</a>
      </footer>

      <Dialog onOpenChange={setDonationOpen} open={donationOpen}>
        <DialogContent className="donation-dialog" showCloseButton={false}>
          <output aria-live="polite" className="donation-download-banner">
            <span aria-hidden="true" className="donation-download-check"><Check /></span>
            <span className="donation-download-message">
              <strong>{copy.donation.downloadTitle}</strong>
              <small>{copy.donation.downloadLead}</small>
            </span>
          </output>
          <DialogClose aria-label={copy.donation.closeLabel} className="donation-x"><X aria-hidden="true" /></DialogClose>
          <div className="donation-signal">
            <Coffee aria-hidden="true" />
            <span>{copy.donation.badge}</span>
          </div>
          <DialogHeader>
            <p className="donation-eyebrow">{copy.donation.eyebrow}</p>
            <div className="donation-copy">
              <DialogTitle>{copy.donation.title}</DialogTitle>
              <DialogFooter className="donation-actions">
                <DonationCheckout copy={copy.donation} language={language} source="dialog" status={supportStatus} />
              </DialogFooter>
              <DialogDescription>{copy.donation.lead}</DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
