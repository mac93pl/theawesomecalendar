'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Download,
  FileText,
  Moon,
  MoveHorizontal,
  Ruler,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';

import { CalendarPageSvg } from '@/components/calendar-page-svg';
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
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
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
  language?: SiteLanguage;
};

type Theme = 'light' | 'dark';
type SupportStatus = 'cancelled' | 'error' | 'invalid' | 'success' | null;

const THEME_STORAGE_KEY = 'awesome-calendar-theme';
const SUPPORT_AMOUNTS = [10, 20, 50] as const;

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
          {SUPPORT_AMOUNTS.map((amount) => (
            <form action="/api/checkout" key={amount} method="post">
              <input name="language" type="hidden" value={language} />
              <input name="source" type="hidden" value={source} />
              <Button name="amount" type="submit" value={amount}>
                {language === 'pl' ? `${amount} zł` : `PLN ${amount}`}
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
              aria-describedby={`support-hint-${source}`}
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
          <Button type="submit"><Coffee aria-hidden="true" />{copy.customButton}</Button>
        </div>
        <p className="donation-hint" id={`support-hint-${source}`}>{copy.hint}</p>
      </form>
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
  const [previewPage, setPreviewPage] = useState(0);
  const [downloadState, setDownloadState] = useState<'idle' | 'working' | 'done' | 'cancelled' | 'error'>('idle');
  const [downloadProgress, setDownloadProgress] = useState<{ current: number; total: number } | null>(null);
  const [donationOpen, setDonationOpen] = useState(false);
  const [supportStatus, setSupportStatus] = useState<SupportStatus>(null);
  const downloadAbortRef = useRef<AbortController | null>(null);
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

  const invalidRange = !rangeIsValid(start, end);
  const layout = useMemo(
    () => invalidRange ? null : createCalendarLayout(start, end, language),
    [end, invalidRange, language, start],
  );
  const units = rangeUnits(start, end);
  const pages = layout?.pages.length ?? 0;
  const presets = useMemo(
    () => rangePresets(initialStart, language),
    [initialStart, language],
  );
  const rangeFeedback = rangeComment(units, language);
  const validationMessage = invalidRange ? rangeFeedback || copy.generator.error : rangeFeedback;
  const activePreviewPage = Math.min(previewPage, Math.max(0, pages - 1));

  const runDownload = useCallback(async (
    selectedStyle: CalendarStyle = style,
    selectedRange?: { start: string; end: string },
  ) => {
    const rangeStart = selectedRange?.start ?? start;
    const rangeEnd = selectedRange?.end ?? end;
    if (!rangeIsValid(rangeStart, rangeEnd)) throw new Error(copy.generator.error);
    const targetLayout = selectedRange
      ? createCalendarLayout(rangeStart, rangeEnd, language)
      : layout;
    if (!targetLayout) throw new Error(copy.generator.error);

    downloadAbortRef.current?.abort();
    const controller = new AbortController();
    downloadAbortRef.current = controller;
    setStyle(selectedStyle);
    setDownloadState('working');
    setDownloadProgress({ current: 0, total: targetLayout.pages.length });

    try {
      const { downloadPdf, generateCalendarPdf } = await import('@/lib/calendar-export');
      const result = await generateCalendarPdf(targetLayout, rangeStart, rangeEnd, selectedStyle, language, {
        signal: controller.signal,
        onProgress: (current, total) => setDownloadProgress({ current, total }),
      });
      downloadPdf(result.bytes, result.filename);
      setDownloadState('done');
      setDonationOpen(true);
      return { downloaded: true, filename: result.filename, days: result.days, pages: result.pages, language };
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setDownloadState('cancelled');
        return { downloaded: false, cancelled: true };
      }
      setDownloadState('error');
      throw error;
    } finally {
      if (downloadAbortRef.current === controller) downloadAbortRef.current = null;
    }
  }, [copy.generator.error, end, language, layout, start, style]);

  const cancelDownload = useCallback(() => {
    downloadAbortRef.current?.abort();
  }, []);

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
        ? 'Ustawia widoczny zakres dni, styl i opcjonalnie język kalendarza.'
        : 'Sets the visible date range, style and optional calendar language.',
      inputSchema: {
        type: 'object',
        properties: {
          start: { type: 'string', description: 'Inclusive start date in YYYY-MM-DD format.' },
          end: { type: 'string', description: 'Inclusive end date in YYYY-MM-DD format.' },
          style: { type: 'string', enum: ['rice', 'block'] },
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
        if (input.language) selectLanguage(input.language);
        const configuredLayout = createCalendarLayout(input.start, input.end, input.language || language);
        return {
          start: input.start,
          end: input.end,
          style: input.style,
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
  }, [copy.generator.error, language, runDownload, selectLanguage]);

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
          <Image alt="" height={100} priority src="/brand/logo.png" width={494} />
        </a>
        <div className="header-actions">
          <nav aria-label={copy.navLabel}>
            <a href="#jak-to-dziala">{copy.nav.how}</a>
            <a href="#warianty">{copy.nav.variants}</a>
            <a className="nav-support" href="#wsparcie">{copy.nav.support}</a>
          </nav>
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

      <section className="promo-hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">{copy.hero.eyebrow}</p>
          <h1>{copy.hero.line1}<br />{copy.hero.line2}</h1>
          <p className="hero-lead">{copy.hero.lead}</p>
        </div>

        <div className="year-download-grid">
          <article className="year-download-card rice-download-card">
            <Image alt={copy.variants.riceAlt} height={600} priority src="/brand/ryz-preview.png" width={900} />
            <Button className="year-download-button" disabled={downloadState === 'working'} onClick={() => void runDownload('rice', { start: initialStart, end: initialEnd })}>
              <Download aria-hidden="true" data-icon="inline-start" />{copy.hero.riceButton}
            </Button>
          </article>
          <article className="year-download-card block-download-card">
            <Image alt={copy.variants.blockAlt} height={600} priority src="/brand/blok-preview.png" width={900} />
            <Button className="year-download-button" disabled={downloadState === 'working'} onClick={() => void runDownload('block', { start: initialStart, end: initialEnd })}>
              <Download aria-hidden="true" data-icon="inline-start" />{copy.hero.blockButton}
            </Button>
          </article>
        </div>
        <a className="scroll-cue" href="#generator">{copy.hero.cue} <ArrowDown aria-hidden="true" /></a>
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
            <div className="preset-group">
              <span>{copy.generator.presets}</span>
              <div className="preset-buttons">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      const selectedRange = 'random' in preset
                        ? randomCalendarRange(initialStart)
                        : preset;
                      setStart(selectedRange.start);
                      setEnd(selectedRange.end);
                      setPreviewPage(0);
                    }}
                    type="button"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="date-grid">
              <label htmlFor="calendar-start"><span>{copy.generator.start}</span><Input aria-invalid={invalidRange} id="calendar-start" max="9999-12-31" min="1900-01-01" onChange={(event) => setStart(event.target.value)} type="date" value={start} /></label>
              <label htmlFor="calendar-end"><span>{copy.generator.end}</span><Input aria-invalid={invalidRange} id="calendar-end" max="9999-12-31" min={start || '1900-01-01'} onChange={(event) => setEnd(event.target.value)} type="date" value={end} /></label>
            </div>
            <RadioGroup aria-label={copy.generator.styleLabel} className="style-picker" onValueChange={(value) => setStyle(value as CalendarStyle)} value={style}>
              <label className="style-option" htmlFor="style-rice"><RadioGroupItem id="style-rice" value="rice" /><span><strong>{copy.generator.rice}</strong><small>{copy.generator.riceHint}</small></span></label>
              <label className="style-option" htmlFor="style-block"><RadioGroupItem id="style-block" value="block" /><span><strong>{copy.generator.block}</strong><small>{copy.generator.blockHint}</small></span></label>
            </RadioGroup>
            <div className="generator-result">
              <div className="range-summary">
                <div className="range-counters">
                  {units.years > 0 && <span><b>{units.years}</b> {yearWord(units.years, language)}</span>}
                  {units.months > 0 && <span><b>{units.months}</b> {monthWord(units.months, language)}</span>}
                  <span><b>{units.days || '—'}</b> {units.days ? dayWord(units.days, language) : ''}</span>
                </div>
                <small>{invalidRange ? copy.generator.fixRange : String(pages) + ' ' + pageWord(pages, language) + ' A4'}</small>
              </div>
              <div className="download-actions">
                <Button className="download-button" disabled={invalidRange || downloadState === 'working'} onClick={() => void runDownload()} size="lg">
                  <Download aria-hidden="true" data-icon="inline-start" />{downloadState === 'working' ? copy.generator.working : copy.generator.download}
                </Button>
                {downloadState === 'working' && (
                  <Button aria-label={copy.generator.cancel} className="cancel-button" onClick={cancelDownload} size="icon" variant="outline"><X aria-hidden="true" /></Button>
                )}
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
            <div className="variant-copy"><span>{copy.variants.variant} 01</span><h3>{copy.variants.rice}</h3><p>{copy.variants.riceText}</p><Button onClick={() => void runDownload('rice', { start: initialStart, end: initialEnd })} disabled={downloadState === 'working'}><Download data-icon="inline-start" />{copy.variants.download}</Button></div>
          </article>
          <article className="variant-card block-variant">
            <div className="variant-image"><Image alt={copy.variants.blockAlt} height={600} src="/brand/blok-preview.png" width={900} /></div>
            <div className="variant-copy"><span>{copy.variants.variant} 02</span><h3>{copy.variants.block}</h3><p>{copy.variants.blockText}</p><Button onClick={() => void runDownload('block', { start: initialStart, end: initialEnd })} disabled={downloadState === 'working'}><Download data-icon="inline-start" />{copy.variants.download}</Button></div>
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
        <p>{copy.support.text}</p>
        <DonationCheckout copy={copy.donation} language={language} source="section" status={supportStatus} />
      </section>

      <footer>
        <Image alt="The Awesome Calendar" height={100} src="/brand/logo.png" width={494} />
        <p>{copy.footer.line}</p><a href="#top">{copy.footer.top}</a>
      </footer>

      <Dialog onOpenChange={setDonationOpen} open={donationOpen}>
        <DialogContent className="donation-dialog" showCloseButton={false}>
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
