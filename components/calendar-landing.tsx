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
  Share2,
  Sun,
  X,
} from 'lucide-react';

import { CalendarPageSvg } from '@/components/calendar-page-svg';
import { CalendarYearPreview } from '@/components/calendar-year-timeline-svg';
import { BrandLogo } from '@/components/brand-logo';
import {
  DonationCheckout,
  type SupportStatus,
} from '@/components/donation-checkout';
import { DownloadTrust } from '@/components/download-trust';
import { SeoStructuredData } from '@/components/seo-structured-data';
import { SiteFooter } from '@/components/site-footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  type CalendarRangePreset,
  type CalendarDayHeight,
  type CalendarDayWidth,
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
import { SITE_ORIGIN } from '@/lib/site';
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
  registerTool: (
    tool: ToolDefinition,
    options?: { signal?: AbortSignal },
  ) => void | Promise<void>;
};

type CalendarToolInput = {
  start: string;
  end: string;
  style: CalendarStyle;
  dayWidth?: CalendarDayWidth;
  dayHeight?: CalendarDayHeight;
  language?: SiteLanguage;
};

type CalendarDownloadRequest = {
  dayWidth?: CalendarDayWidth;
  dayHeight?: CalendarDayHeight;
  range?: { start: string; end: string };
  style?: CalendarStyle;
};

type Theme = 'light' | 'dark';
type ShareStatus = 'copied' | 'error' | 'idle' | 'shared';
type MobilePdfStatus = 'idle' | 'preparing' | 'ready';
type PendingPdfDownload = {
  deliveryFrame: number | null;
  deliveryTimeout: number | null;
  file: File;
  filename: string;
  url: string;
};

const THEME_STORAGE_KEY = 'awesome-calendar-theme';
const MODULE_RECOVERY_KEY = 'awesome-calendar-module-recovery';

function isMobilePdfFlow() {
  return (
    window.matchMedia('(max-width: 980px)').matches ||
    (navigator.maxTouchPoints > 0 &&
      window.matchMedia('(max-width: 1180px)').matches)
  );
}

function triggerPdfDownload(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function openPdfInNewTab(url: string) {
  const openedTab = window.open(url, '_blank');
  if (!openedTab) return false;
  try {
    openedTab.opener = null;
  } catch {
    // Some mobile browsers do not expose the newly opened tab.
  }
  return true;
}

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

function ShareActionIcon({ status }: { status: ShareStatus }) {
  return status === 'copied' || status === 'shared' ? (
    <Check aria-hidden="true" />
  ) : (
    <Share2 aria-hidden="true" />
  );
}

function validToolInput(input: unknown): input is CalendarToolInput {
  if (!input || typeof input !== 'object') return false;
  const value = input as Record<string, unknown>;
  return (
    typeof value.start === 'string' &&
    typeof value.end === 'string' &&
    (value.style === 'rice' || value.style === 'block') &&
    (value.dayWidth === undefined ||
      value.dayWidth === 'standard' ||
      value.dayWidth === 'wide') &&
    (value.dayHeight === undefined ||
      value.dayHeight === 'standard' ||
      value.dayHeight === 'tall') &&
    (value.language === undefined ||
      value.language === 'pl' ||
      value.language === 'en') &&
    rangeIsValid(value.start, value.end)
  );
}

export function CalendarLanding({
  initialLanguage,
}: {
  initialLanguage: SiteLanguage;
}) {
  const [initialStart, setInitialStart] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const initialEnd = useMemo(
    () => defaultEndDateValue(initialStart),
    [initialStart],
  );
  const language = initialLanguage;
  const [theme, setTheme] = useState<Theme>('light');
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);
  const [style, setStyle] = useState<CalendarStyle>('rice');
  const [dayWidth, setDayWidth] = useState<CalendarDayWidth>('standard');
  const [dayHeight, setDayHeight] = useState<CalendarDayHeight>('standard');
  const [readyYear, setReadyYear] = useState(() => new Date().getFullYear());
  const [readyStyle, setReadyStyle] = useState<CalendarStyle>('rice');
  const [previewPage, setPreviewPage] = useState(0);
  const [downloadState, setDownloadState] = useState<
    'idle' | 'working' | 'done' | 'cancelled' | 'error'
  >('idle');
  const [downloadProgress, setDownloadProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [donationOpen, setDonationOpen] = useState(false);
  const [mobilePdfStatus, setMobilePdfStatus] =
    useState<MobilePdfStatus>('idle');
  const [supportStatus, setSupportStatus] = useState<SupportStatus>(null);
  const [shareStatus, setShareStatus] = useState<ShareStatus>('idle');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileGeneratorActionsVisible, setMobileGeneratorActionsVisible] =
    useState(false);
  const downloadAbortRef = useRef<AbortController | null>(null);
  const pendingPdfRef = useRef<PendingPdfDownload | null>(null);
  const generatorWorkspaceRef = useRef<HTMLDivElement | null>(null);
  const generatorPreviewRef = useRef<HTMLDivElement | null>(null);
  const projectNoteRef = useRef<HTMLElement | null>(null);
  const copy = COPY[language];
  const currentYear = Number(initialStart.slice(0, 4));
  const nextYear = currentYear + 1;
  const readyStyleLabel =
    readyStyle === 'rice' ? copy.generator.rice : copy.generator.block;
  const readyDownloadLabel = insertYear(copy.ready.download, readyYear);

  const selectLanguage = useCallback(
    (nextLanguage: SiteLanguage) => {
      window.localStorage.setItem('awesome-calendar-language', nextLanguage);
      document.cookie = `awesome-calendar-language=${nextLanguage}; Max-Age=31536000; Path=/; SameSite=Lax`;
      if (nextLanguage === language) return;
      window.location.assign(nextLanguage === 'en' ? '/en' : '/pl');
    },
    [language],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const queryStatus = searchParams.get('support');
      if (
        queryStatus === 'success' ||
        queryStatus === 'cancelled' ||
        queryStatus === 'error' ||
        queryStatus === 'invalid'
      ) {
        setSupportStatus(queryStatus);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(
    () => () => {
      const pending = pendingPdfRef.current;
      if (!pending) return;
      if (pending.deliveryFrame !== null)
        window.cancelAnimationFrame(pending.deliveryFrame);
      if (pending.deliveryTimeout !== null)
        window.clearTimeout(pending.deliveryTimeout);
      URL.revokeObjectURL(pending.url);
    },
    [],
  );

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

  useEffect(() => {
    const workspace = generatorWorkspaceRef.current;
    const projectNote = projectNoteRef.current;
    if (!workspace || !projectNote) return;

    const mobileMedia = window.matchMedia('(max-width: 720px)');
    const syncVisibility = () => {
      if (!mobileMedia.matches) {
        setMobileGeneratorActionsVisible(false);
        return;
      }

      const workspaceBounds = workspace.getBoundingClientRect();
      const projectNoteBounds = projectNote.getBoundingClientRect();
      setMobileGeneratorActionsVisible(
        workspaceBounds.top < window.innerHeight &&
          workspaceBounds.bottom > 0 &&
          projectNoteBounds.top >= window.innerHeight,
      );
    };
    const observer = new IntersectionObserver(syncVisibility, { threshold: 0 });
    const handleMediaChange = () => syncVisibility();

    observer.observe(workspace);
    observer.observe(projectNote);
    mobileMedia.addEventListener('change', handleMediaChange);
    syncVisibility();

    return () => {
      observer.disconnect();
      mobileMedia.removeEventListener('change', handleMediaChange);
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
    return () =>
      window.removeEventListener('vite:preloadError', recoverFromStaleModule);
  }, []);

  const invalidRange = !rangeIsValid(start, end);
  const layout = useMemo(
    () =>
      invalidRange
        ? null
        : createCalendarLayout(start, end, language, { dayWidth, dayHeight }),
    [dayHeight, dayWidth, end, invalidRange, language, start],
  );
  const units = useMemo(() => rangeUnits(start, end), [end, start]);
  const pages = layout?.pages.length ?? 0;
  const presets = useMemo(
    () => rangePresets(initialStart, language),
    [initialStart, language],
  );
  const quickPresets = presets.filter((preset) => preset.group === 'quick');
  const durationPresets = presets.filter(
    (preset) => preset.group === 'duration',
  );
  const calendarPresets = presets.filter(
    (preset) => preset.group === 'calendar',
  );
  const randomPreset = presets.find((preset) => preset.group === 'random');
  const rangeFeedback = useMemo(
    () => rangeComment(units, language),
    [language, units],
  );
  const validationMessage = invalidRange
    ? rangeFeedback || copy.generator.error
    : rangeFeedback;
  const activePreviewPage = Math.min(previewPage, Math.max(0, pages - 1));
  const selectedWidthLabel =
    dayWidth === 'standard'
      ? copy.generator.widthStandard
      : copy.generator.widthWide;
  const selectedHeightLabel =
    dayHeight === 'standard'
      ? copy.generator.heightStandard
      : copy.generator.heightTall;
  const selectedStyleLabel =
    style === 'rice' ? copy.generator.rice : copy.generator.block;
  const downloadSpec = invalidRange
    ? copy.generator.downloadFixRange
    : `${displayDateRange(start, end, language)} · ${copy.generator.widthSection.toLowerCase()}: ${selectedWidthLabel.toLowerCase()} · ${copy.generator.heightSection.toLowerCase()}: ${selectedHeightLabel.toLowerCase()} · ${selectedStyleLabel} · ${pages} A4`;

  const runDownload = useCallback(
    async (request: CalendarDownloadRequest = {}) => {
      const selectedStyle = request.style ?? style;
      const selectedDayWidth = request.dayWidth ?? dayWidth;
      const selectedDayHeight = request.dayHeight ?? dayHeight;
      const rangeStart = request.range?.start ?? start;
      const rangeEnd = request.range?.end ?? end;
      if (!rangeIsValid(rangeStart, rangeEnd))
        throw new Error(copy.generator.error);
      const targetLayout =
        request.range || request.dayWidth || request.dayHeight
          ? createCalendarLayout(rangeStart, rangeEnd, language, {
              dayWidth: selectedDayWidth,
              dayHeight: selectedDayHeight,
            })
          : layout;
      if (!targetLayout) throw new Error(copy.generator.error);

      downloadAbortRef.current?.abort();
      const previousPdf = pendingPdfRef.current;
      if (previousPdf) {
        if (previousPdf.deliveryFrame !== null)
          window.cancelAnimationFrame(previousPdf.deliveryFrame);
        if (previousPdf.deliveryTimeout !== null)
          window.clearTimeout(previousPdf.deliveryTimeout);
        URL.revokeObjectURL(previousPdf.url);
        pendingPdfRef.current = null;
      }
      const controller = new AbortController();
      downloadAbortRef.current = controller;
      setMobilePdfStatus('idle');
      setDownloadState('working');
      setDownloadProgress({ current: 0, total: targetLayout.pages.length });

      try {
        const { generateCalendarPdf } = await import('@/lib/calendar-export');
        const result = await generateCalendarPdf(
          targetLayout,
          rangeStart,
          rangeEnd,
          selectedStyle,
          language,
          {
            signal: controller.signal,
            onProgress: (current, total) =>
              setDownloadProgress({ current, total }),
          },
        );
        window.sessionStorage.removeItem(MODULE_RECOVERY_KEY);
        const file = new File([result.bytes as BlobPart], result.filename, {
          type: 'application/pdf',
        });
        const pendingPdf: PendingPdfDownload = {
          deliveryFrame: null,
          deliveryTimeout: null,
          file,
          filename: result.filename,
          url: URL.createObjectURL(file),
        };
        const mobileFlow = isMobilePdfFlow();
        pendingPdfRef.current = pendingPdf;
        setDownloadState('done');
        setMobilePdfStatus(mobileFlow ? 'preparing' : 'idle');
        setDonationOpen(true);
        pendingPdf.deliveryFrame = window.requestAnimationFrame(() => {
          pendingPdf.deliveryFrame = null;
          pendingPdf.deliveryTimeout = window.setTimeout(
            () => {
              pendingPdf.deliveryTimeout = null;
              if (pendingPdfRef.current !== pendingPdf) return;
              if (mobileFlow) {
                setMobilePdfStatus('ready');
                return;
              }
              triggerPdfDownload(pendingPdf.url, pendingPdf.filename);
            },
            mobileFlow ? 2_000 : 1_000,
          );
        });
        return {
          downloaded: true,
          filename: result.filename,
          days: result.days,
          pages: result.pages,
          language,
          format: result.format,
          dayWidth: result.dayWidth,
          dayHeight: result.dayHeight,
        };
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
        if (downloadAbortRef.current === controller)
          downloadAbortRef.current = null;
      }
    },
    [
      copy.generator.error,
      copy.generator.failed,
      dayHeight,
      dayWidth,
      end,
      language,
      layout,
      start,
      style,
    ],
  );

  const runReadyCalendarDownload = useCallback(
    (selectedStyle: CalendarStyle, year: number) =>
      runDownload({
        dayWidth: 'standard',
        dayHeight: 'standard',
        range: calendarYearRange(year),
        style: selectedStyle,
      }),
    [runDownload],
  );

  const cancelDownload = useCallback(() => {
    downloadAbortRef.current?.abort();
  }, []);

  const scrollToGeneratorPreview = useCallback(() => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches
      ? 'auto'
      : 'smooth';
    generatorPreviewRef.current?.scrollIntoView({ behavior, block: 'start' });
  }, []);

  const saveMobilePdf = useCallback(async () => {
    const pending = pendingPdfRef.current;
    if (!pending) return;

    if (pending.deliveryFrame !== null) {
      window.cancelAnimationFrame(pending.deliveryFrame);
      pending.deliveryFrame = null;
    }
    if (pending.deliveryTimeout !== null) {
      window.clearTimeout(pending.deliveryTimeout);
      pending.deliveryTimeout = null;
    }

    try {
      if (navigator.share && navigator.canShare?.({ files: [pending.file] })) {
        await navigator.share({
          files: [pending.file],
          title: pending.filename,
        });
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
    }

    openPdfInNewTab(pending.url);
  }, []);

  const shareCalendar = useCallback(async () => {
    const url = language === 'en' ? `${SITE_ORIGIN}/en` : `${SITE_ORIGIN}/pl`;
    setShareStatus('idle');

    try {
      if (navigator.share) {
        await navigator.share({
          title: copy.share.title,
          text: copy.share.text,
          url,
        });
        setShareStatus('shared');
        return;
      }

      await navigator.clipboard.writeText(url);
      setShareStatus('copied');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareStatus('error');
    }
  }, [copy.share.text, copy.share.title, language]);

  useEffect(() => {
    if (shareStatus === 'idle') return;
    const timeout = window.setTimeout(() => setShareStatus('idle'), 4000);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  const selectPreset = useCallback(
    (preset: CalendarRangePreset) => {
      const selectedRange =
        preset.group === 'random' ? randomCalendarRange(initialStart) : preset;
      setStart(selectedRange.start);
      setEnd(selectedRange.end);
      setPreviewPage(0);
    },
    [initialStart],
  );

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: ToolDefinition) => {
      try {
        void Promise.resolve(
          context.registerTool(tool, { signal: lifecycle.signal }),
        ).catch(() => undefined);
      } catch {
        // WebMCP is optional; the visible interface remains fully functional.
      }
    };

    register({
      name: 'configure_calendar',
      title: language === 'pl' ? 'Ustaw kalendarz' : 'Configure calendar',
      description:
        language === 'pl'
          ? 'Ustawia widoczny zakres dni, styl, szerokość i wysokość dnia oraz opcjonalnie język kalendarza.'
          : 'Sets the visible date range, style, day width, day height and optional calendar language.',
      inputSchema: {
        type: 'object',
        properties: {
          start: {
            type: 'string',
            description: 'Inclusive start date in YYYY-MM-DD format.',
          },
          end: {
            type: 'string',
            description: 'Inclusive end date in YYYY-MM-DD format.',
          },
          style: { type: 'string', enum: ['rice', 'block'] },
          dayWidth: { type: 'string', enum: ['standard', 'wide'] },
          dayHeight: { type: 'string', enum: ['standard', 'tall'] },
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
        const configuredDayWidth = input.dayWidth || dayWidth;
        const configuredDayHeight = input.dayHeight || dayHeight;
        setDayWidth(configuredDayWidth);
        setDayHeight(configuredDayHeight);
        setPreviewPage(0);
        if (input.language) selectLanguage(input.language);
        const configuredLayout = createCalendarLayout(
          input.start,
          input.end,
          input.language || language,
          {
            dayWidth: configuredDayWidth,
            dayHeight: configuredDayHeight,
          },
        );
        return {
          start: input.start,
          end: input.end,
          style: input.style,
          dayWidth: configuredDayWidth,
          dayHeight: configuredDayHeight,
          language: input.language || language,
          days: configuredLayout.days.length,
          strips: configuredLayout.strips.length,
          pages: configuredLayout.pages.length,
        };
      },
    });

    register({
      name: 'download_calendar_pdf',
      title:
        language === 'pl' ? 'Pobierz kalendarz PDF' : 'Download calendar PDF',
      description:
        language === 'pl'
          ? 'Generuje PDF w języku aktualnie wybranym na stronie.'
          : 'Generates a PDF in the language currently selected on the page.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: () => runDownload(),
    });
    return () => lifecycle.abort();
  }, [
    copy.generator.error,
    dayHeight,
    dayWidth,
    language,
    runDownload,
    selectLanguage,
  ]);

  const statusMessage =
    downloadState === 'working'
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
  const shareStatusMessage =
    shareStatus === 'shared'
      ? copy.share.shared
      : shareStatus === 'copied'
        ? copy.share.copied
        : shareStatus === 'error'
          ? copy.share.error
          : '';
  const stepImages = [
    '/brand/drukarka.png',
    '/brand/ciecie.png',
    '/brand/klejenie.png',
  ];

  return (
    <>
      <SeoStructuredData language={language} />
      <main>
        <header className="site-header">
          <a aria-label={copy.homeLabel} className="brand" href="#top">
            <BrandLogo alt="" priority />
          </a>
          <div className="header-actions">
            <nav aria-label={copy.navLabel} className="desktop-nav">
              <a href="#gotowy">{copy.nav.ready}</a>
              <a className="nav-custom" href="#generator">
                {copy.nav.custom}
              </a>
              <a
                className="nav-blog"
                href={language === 'en' ? '/en/blog' : '/pl/blog'}
              >
                {copy.nav.blog}
              </a>
              <button
                aria-label={copy.share.button}
                className="nav-share-button"
                data-share-status={shareStatus}
                onClick={() => void shareCalendar()}
                title={shareStatusMessage || copy.share.button}
                type="button"
              >
                <ShareActionIcon status={shareStatus} />
              </button>
              <a className="nav-support" href="#wsparcie">
                {copy.nav.support}
              </a>
            </nav>
            <a className="mobile-nav-support nav-support" href="#wsparcie">
              {copy.nav.support}
            </a>
            <DropdownMenu
              onOpenChange={setMobileMenuOpen}
              open={mobileMenuOpen}
            >
              <DropdownMenuTrigger
                render={
                  <button
                    aria-expanded={mobileMenuOpen}
                    aria-label={
                      mobileMenuOpen ? copy.nav.closeMenu : copy.nav.menu
                    }
                    className="mobile-nav-trigger"
                    type="button"
                  />
                }
              >
                {mobileMenuOpen ? (
                  <X aria-hidden="true" />
                ) : (
                  <Menu aria-hidden="true" />
                )}
              </DropdownMenuTrigger>
              {mobileMenuOpen && (
                <DropdownMenuPortal>
                  <button
                    aria-label={copy.nav.closeMenu}
                    className="mobile-nav-backdrop"
                    onClick={() => setMobileMenuOpen(false)}
                    tabIndex={-1}
                    type="button"
                  />
                </DropdownMenuPortal>
              )}
              <DropdownMenuContent
                align="end"
                className="mobile-nav-menu"
                sideOffset={10}
              >
                <DropdownMenuGroup className="mobile-nav-primary">
                  <DropdownMenuLabel className="mobile-nav-title">
                    Menu
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    className="mobile-nav-primary-item"
                    render={<a aria-label={copy.nav.ready} href="#gotowy" />}
                  >
                    <span className="mobile-nav-number">01</span>
                    <span>{copy.nav.ready}</span>
                    <ChevronRight aria-hidden="true" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="mobile-nav-primary-item"
                    render={
                      <a aria-label={copy.nav.custom} href="#generator" />
                    }
                  >
                    <span className="mobile-nav-number">02</span>
                    <span>{copy.nav.custom}</span>
                    <ChevronRight aria-hidden="true" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="mobile-nav-primary-item"
                    render={
                      <a
                        aria-label={copy.nav.blog}
                        href={language === 'en' ? '/en/blog' : '/pl/blog'}
                      />
                    }
                  >
                    <span className="mobile-nav-number">03</span>
                    <span>{copy.nav.blog}</span>
                    <ChevronRight aria-hidden="true" />
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuGroup className="mobile-nav-utilities">
                  <DropdownMenuItem
                    className="mobile-nav-utility-item"
                    onClick={() => void shareCalendar()}
                  >
                    <ShareActionIcon status={shareStatus} />
                    {copy.share.button}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="mobile-nav-utility-item"
                    onClick={toggleTheme}
                  >
                    {theme === 'dark' ? (
                      <Sun aria-hidden="true" />
                    ) : (
                      <Moon aria-hidden="true" />
                    )}
                    {theme === 'dark' ? copy.theme.light : copy.theme.dark}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuGroup className="mobile-nav-language">
                  <DropdownMenuLabel>{copy.languageLabel}</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    aria-label={copy.languageLabel}
                    onValueChange={(value) =>
                      selectLanguage(value as SiteLanguage)
                    }
                    value={language}
                  >
                    <DropdownMenuRadioItem value="pl">PL</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="en">EN</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              aria-label={theme === 'dark' ? copy.theme.light : copy.theme.dark}
              className="theme-toggle"
              onClick={toggleTheme}
              title={theme === 'dark' ? copy.theme.light : copy.theme.dark}
              type="button"
            >
              {theme === 'dark' ? (
                <Sun aria-hidden="true" />
              ) : (
                <Moon aria-hidden="true" />
              )}
            </button>
            <fieldset className="language-switch">
              <legend className="language-legend">{copy.languageLabel}</legend>
              <button
                aria-pressed={language === 'pl'}
                onClick={() => selectLanguage('pl')}
                type="button"
              >
                PL
              </button>
              <span aria-hidden="true">/</span>
              <button
                aria-pressed={language === 'en'}
                onClick={() => selectLanguage('en')}
                type="button"
              >
                EN
              </button>
            </fieldset>
          </div>
        </header>
        <p aria-live="polite" className="sr-only">
          {shareStatusMessage}
        </p>

        <section aria-label={copy.process.label} className="process-strip">
          <ol>
            {copy.process.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="promo-hero" id="top">
          <div className="hero-copy">
            <p className="eyebrow">{copy.hero.eyebrow}</p>
            <h1>
              <span className="hero-title-prefix">{copy.hero.line1}</span>
              <span className="hero-title-main">{copy.hero.line2}</span>
            </h1>
            <p className="hero-lead">{copy.hero.lead}</p>
            <figure className="hero-year-preview">
              <CalendarYearPreview
                annotated
                language={language}
                style="rice"
                title={insertYear(copy.hero.yearPreviewTitle, currentYear)}
                year={currentYear}
              />
            </figure>
            <div className="hero-actions">
              <a className="hero-primary" href="#gotowy">
                <Download aria-hidden="true" />
                {copy.hero.primaryCta}
              </a>
              <a className="hero-secondary" href="#generator">
                <CalendarRange aria-hidden="true" />
                {copy.hero.secondaryCta}
              </a>
            </div>
            <p className="hero-meta">{copy.hero.meta}</p>
          </div>
        </section>

        <section className="facts-rail" aria-label={copy.facts.label}>
          <div>
            <Ruler aria-hidden="true" />
            <strong>{language === 'pl' ? '≈ 1,5–3 M' : '≈ 1.5–3 M'}</strong>
            <span>{copy.facts.length}</span>
          </div>
          <div>
            <FileText aria-hidden="true" />
            <strong>3–12 × A4</strong>
            <span>{copy.facts.pages}</span>
          </div>
          <div>
            <MoveHorizontal aria-hidden="true" />
            <strong>{copy.facts.axisValue}</strong>
            <span>{copy.facts.axis}</span>
          </div>
        </section>

        <section className="how-section" id="jak-to-dziala">
          <p className="section-kicker">{copy.how.kicker}</p>
          <h2>{copy.how.heading}</h2>
          <div className="steps">
            {copy.how.steps.map(([title, text], index) => (
              <article className="step-card" key={title}>
                <span className="step-number">0{index + 1}</span>
                <Image
                  alt=""
                  height={264}
                  src={stepImages[index]}
                  width={264}
                />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ready-section" id="gotowy">
          <div className="ready-heading">
            <div>
              <p className="section-kicker">{copy.ready.kicker}</p>
              <h2>{copy.ready.heading}</h2>
            </div>
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
                <label
                  className="ready-year-option"
                  htmlFor="ready-year-current"
                >
                  <RadioGroupItem
                    id="ready-year-current"
                    value={String(currentYear)}
                  />
                  <span>
                    <strong>{currentYear}</strong>
                    <small>{copy.ready.currentYear}</small>
                  </span>
                </label>
                <label className="ready-year-option" htmlFor="ready-year-next">
                  <RadioGroupItem
                    id="ready-year-next"
                    value={String(nextYear)}
                  />
                  <span>
                    <strong>{nextYear}</strong>
                    <small>{copy.ready.nextYear}</small>
                  </span>
                </label>
              </RadioGroup>
            </div>

            <div className="ready-choice ready-style-choice">
              <span className="ready-choice-label">
                {copy.ready.styleLabel}
              </span>
              <RadioGroup
                aria-label={copy.ready.styleLabel}
                className="ready-style-picker"
                onValueChange={(value) => setReadyStyle(value as CalendarStyle)}
                value={readyStyle}
              >
                <div
                  className="ready-style-option ready-style-rice"
                >
                  <div className="ready-style-preview">
                    <CalendarYearPreview
                      language={language}
                      year={readyYear}
                      style="rice"
                      title={`${copy.variants.riceAlt} · ${readyYear}`}
                    />
                  </div>
                  <label className="ready-style-meta" htmlFor="ready-style-rice">
                    <RadioGroupItem id="ready-style-rice" value="rice" />
                    <span>
                      <strong>{copy.generator.rice}</strong>
                      <small>{copy.generator.riceHint}</small>
                    </span>
                  </label>
                </div>
                <div
                  className="ready-style-option ready-style-block"
                >
                  <div className="ready-style-preview">
                    <CalendarYearPreview
                      language={language}
                      year={readyYear}
                      style="block"
                      title={`${copy.variants.blockAlt} · ${readyYear}`}
                    />
                  </div>
                  <label className="ready-style-meta" htmlFor="ready-style-block">
                    <RadioGroupItem id="ready-style-block" value="block" />
                    <span>
                      <strong>{copy.generator.block}</strong>
                      <small>{copy.generator.blockHint}</small>
                    </span>
                  </label>
                </div>
              </RadioGroup>
            </div>

            <div className="ready-result">
              <div className="ready-result-summary">
                <span>{copy.ready.selected}</span>
                <strong>
                  {readyYear} · {readyStyleLabel}
                </strong>
                <small>{copy.ready.summary}</small>
              </div>
              <div className="ready-result-actions">
                <DownloadTrust
                  className="ready-download-trust"
                  message={copy.downloadTrust}
                >
                  <Button
                    className="ready-download-button"
                    disabled={downloadState === 'working'}
                    onClick={() =>
                      void runReadyCalendarDownload(readyStyle, readyYear)
                    }
                    size="lg"
                  >
                    <Download aria-hidden="true" data-icon="inline-start" />
                    {downloadState === 'working'
                      ? copy.generator.working
                      : readyDownloadLabel}
                  </Button>
                </DownloadTrust>
                <a className="ready-custom-range-link" href="#generator">
                  {copy.ready.customRange}
                  <ChevronDown aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="generator-hero" id="generator">
          <div className="generator-intro">
            <div className="generator-intro-heading">
              <p className="section-kicker">{copy.custom.kicker}</p>
              <h2>
                {copy.custom.line1}
                <br />
                {copy.custom.line2}
                <br />
                {copy.custom.line3}
              </h2>
            </div>
            <p>{copy.custom.text}</p>
          </div>

          <div className="generator-workspace" ref={generatorWorkspaceRef}>
            <div className="generator-card">
              <div className="generator-heading">
                <div>
                  <p className="section-kicker">{copy.generator.kicker}</p>
                  <h2>{copy.generator.heading}</h2>
                </div>
                <CalendarRange aria-hidden="true" />
              </div>
              <section className="generator-step">
                <h3 className="generator-step-title">
                  <span>01</span>
                  {copy.generator.rangeSection}
                </h3>
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
                      <DropdownMenuTrigger
                        render={
                          <button
                            aria-label={copy.generator.morePresets}
                            className="preset-more-button"
                            type="button"
                          />
                        }
                      >
                        {copy.generator.morePresets}
                        <ChevronDown aria-hidden="true" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="preset-menu"
                        sideOffset={7}
                      >
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>
                            {copy.generator.durationPresets}
                          </DropdownMenuLabel>
                          {durationPresets.map((preset) => (
                            <DropdownMenuItem
                              key={preset.label}
                              onClick={() => selectPreset(preset)}
                            >
                              {preset.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>
                            {copy.generator.calendarPresets}
                          </DropdownMenuLabel>
                          {calendarPresets.map((preset) => (
                            <DropdownMenuItem
                              key={preset.label}
                              onClick={() => selectPreset(preset)}
                            >
                              {preset.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                        {randomPreset && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="preset-menu-random"
                              onClick={() => selectPreset(randomPreset)}
                            >
                              {randomPreset.label}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="date-grid">
                  <label htmlFor="calendar-start">
                    <span>{copy.generator.start}</span>
                    <Input
                      aria-invalid={invalidRange}
                      id="calendar-start"
                      max="9999-12-31"
                      min="1900-01-01"
                      onChange={(event) => setStart(event.target.value)}
                      type="date"
                      value={start}
                    />
                  </label>
                  <label htmlFor="calendar-end">
                    <span>{copy.generator.end}</span>
                    <Input
                      aria-invalid={invalidRange}
                      id="calendar-end"
                      max="9999-12-31"
                      min={start || '1900-01-01'}
                      onChange={(event) => setEnd(event.target.value)}
                      type="date"
                      value={end}
                    />
                  </label>
                </div>
              </section>
              <section className="generator-step">
                <h3 className="generator-step-title">
                  <span>02</span>
                  {copy.generator.sizeSection}
                </h3>
                <div className="size-control">
                  <div className="size-axis">
                    <p className="size-axis-title">
                      {copy.generator.widthSection}
                    </p>
                    <RadioGroup
                      aria-describedby="calendar-size-explanation"
                      aria-label={copy.generator.widthLabel}
                      className="size-picker"
                      onValueChange={(value) => {
                        setDayWidth(value as CalendarDayWidth);
                        setPreviewPage(0);
                      }}
                      value={dayWidth}
                    >
                      <label
                        className="size-option size-option-width-standard"
                        htmlFor="day-width-standard"
                      >
                        <RadioGroupItem
                          disabled={downloadState === 'working'}
                          id="day-width-standard"
                          value="standard"
                        />
                        <span
                          aria-hidden="true"
                          className="size-glyph size-glyph-width-standard"
                        />
                        <span>
                          <strong>{copy.generator.widthStandard}</strong>
                          <small>{copy.generator.widthStandardHint}</small>
                        </span>
                      </label>
                      <label
                        className="size-option size-option-width-wide"
                        htmlFor="day-width-wide"
                      >
                        <RadioGroupItem
                          disabled={downloadState === 'working'}
                          id="day-width-wide"
                          value="wide"
                        />
                        <span
                          aria-hidden="true"
                          className="size-glyph size-glyph-width-wide"
                        />
                        <span>
                          <strong>{copy.generator.widthWide}</strong>
                          <small>{copy.generator.widthWideHint}</small>
                        </span>
                      </label>
                    </RadioGroup>
                  </div>
                  <div className="size-axis">
                    <p className="size-axis-title">
                      {copy.generator.heightSection}
                    </p>
                    <RadioGroup
                      aria-describedby="calendar-size-explanation"
                      aria-label={copy.generator.heightLabel}
                      className="size-picker"
                      onValueChange={(value) => {
                        setDayHeight(value as CalendarDayHeight);
                        setPreviewPage(0);
                      }}
                      value={dayHeight}
                    >
                      <label
                        className="size-option size-option-height-standard"
                        htmlFor="day-height-standard"
                      >
                        <RadioGroupItem
                          disabled={downloadState === 'working'}
                          id="day-height-standard"
                          value="standard"
                        />
                        <span
                          aria-hidden="true"
                          className="size-glyph size-glyph-height-standard"
                        />
                        <span>
                          <strong>{copy.generator.heightStandard}</strong>
                          <small>{copy.generator.heightStandardHint}</small>
                        </span>
                      </label>
                      <label
                        className="size-option size-option-height-tall"
                        htmlFor="day-height-tall"
                      >
                        <RadioGroupItem
                          disabled={downloadState === 'working'}
                          id="day-height-tall"
                          value="tall"
                        />
                        <span
                          aria-hidden="true"
                          className="size-glyph size-glyph-height-tall"
                        />
                        <span>
                          <strong>{copy.generator.heightTall}</strong>
                          <small>{copy.generator.heightTallHint}</small>
                        </span>
                      </label>
                    </RadioGroup>
                  </div>
                  <p
                    className="size-explanation"
                    id="calendar-size-explanation"
                  >
                    {copy.generator.sizeExplanation}
                  </p>
                </div>
              </section>
              <section className="generator-step">
                <h3 className="generator-step-title">
                  <span>03</span>
                  {copy.generator.styleSection}
                </h3>
                <RadioGroup
                  aria-label={copy.generator.styleLabel}
                  className="style-picker"
                  onValueChange={(value) => setStyle(value as CalendarStyle)}
                  value={style}
                >
                  <label className="style-option" htmlFor="style-rice">
                    <RadioGroupItem id="style-rice" value="rice" />
                    <span
                      aria-hidden="true"
                      className="style-glyph style-glyph-rice"
                    />
                    <span>
                      <strong>{copy.generator.rice}</strong>
                      <small>{copy.generator.riceHint}</small>
                    </span>
                  </label>
                  <label className="style-option" htmlFor="style-block">
                    <RadioGroupItem id="style-block" value="block" />
                    <span
                      aria-hidden="true"
                      className="style-glyph style-glyph-block"
                    />
                    <span>
                      <strong>{copy.generator.block}</strong>
                      <small>{copy.generator.blockHint}</small>
                    </span>
                  </label>
                </RadioGroup>
              </section>
              <div className="generator-result">
                <div className="range-summary">
                  <div className="range-counters">
                    {units.years > 0 && (
                      <span>
                        <b>{units.years}</b> {yearWord(units.years, language)}
                      </span>
                    )}
                    {units.remainingMonths > 0 && (
                      <span>
                        <b>{units.remainingMonths}</b>{' '}
                        {monthWord(units.remainingMonths, language)}
                      </span>
                    )}
                    {units.remainingDays > 0 && (
                      <span>
                        <b>{units.remainingDays}</b>{' '}
                        {dayWord(units.remainingDays, language)}
                      </span>
                    )}
                    {units.years === 0 &&
                      units.remainingMonths === 0 &&
                      units.remainingDays === 0 && (
                        <span>
                          <b>—</b>
                        </span>
                      )}
                  </div>
                  <small>
                    {invalidRange
                      ? copy.generator.fixRange
                      : String(pages) + ' ' + pageWord(pages, language) + ' A4'}
                  </small>
                  {!invalidRange && units.months > 0 && (
                    <small className="range-totals">
                      {copy.generator.totalRange}: {units.months}{' '}
                      {monthWord(units.months, language)} · {units.days}{' '}
                      {dayWord(units.days, language)}
                    </small>
                  )}
                </div>
                <div className="download-panel">
                  <p className="download-spec">
                    <span>{copy.generator.downloadIncludes}</span>
                    <strong>{downloadSpec}</strong>
                  </p>
                  <DownloadTrust
                    className="generator-download-trust"
                    message={copy.downloadTrust}
                  >
                    <div className="download-actions">
                      <Button
                        className="download-button generator-download-button"
                        disabled={invalidRange || downloadState === 'working'}
                        onClick={() => void runDownload()}
                        size="lg"
                      >
                        <Download aria-hidden="true" data-icon="inline-start" />
                        {downloadState === 'working'
                          ? copy.generator.working
                          : copy.generator.download}
                      </Button>
                      {downloadState === 'working' && (
                        <Button
                          aria-label={copy.generator.cancel}
                          className="cancel-button"
                          onClick={cancelDownload}
                          size="icon"
                          variant="outline"
                        >
                          <X aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  </DownloadTrust>
                </div>
              </div>
              {validationMessage && (
                <p
                  className={invalidRange ? 'range-error' : 'range-comment'}
                  role={invalidRange ? 'alert' : undefined}
                >
                  {validationMessage}
                </p>
              )}
              <p
                className={['download-status', downloadState].join(' ')}
                aria-live="polite"
              >
                {statusMessage}
              </p>
            </div>

            <div className="preview-card" ref={generatorPreviewRef}>
              <div className="preview-toolbar">
                <div className="preview-page-controls">
                  <button
                    aria-label={copy.preview.previous}
                    disabled={activePreviewPage === 0 || !layout}
                    onClick={() =>
                      setPreviewPage(Math.max(0, activePreviewPage - 1))
                    }
                    type="button"
                  >
                    <ChevronLeft aria-hidden="true" />
                  </button>
                  <span>
                    {copy.preview.label} — {copy.preview.page}{' '}
                    {pages ? activePreviewPage + 1 : 0} {copy.preview.of}{' '}
                    {pages}
                  </span>
                  <button
                    aria-label={copy.preview.next}
                    disabled={!layout || activePreviewPage >= pages - 1}
                    onClick={() =>
                      setPreviewPage(Math.min(pages - 1, activePreviewPage + 1))
                    }
                    type="button"
                  >
                    <ChevronRight aria-hidden="true" />
                  </button>
                </div>
                <span>
                  <FileText aria-hidden="true" /> {copy.preview.landscape}
                </span>
              </div>
              <div className="sheet-stage">
                {layout?.pages[activePreviewPage] ? (
                  <CalendarPageSvg
                    language={language}
                    page={layout.pages[activePreviewPage]}
                    style={style}
                    title={`${copy.preview.title} ${activePreviewPage + 1}`}
                  />
                ) : (
                  <div className="empty-preview">{copy.preview.empty}</div>
                )}
              </div>
            </div>
          </div>

          {mobileGeneratorActionsVisible && (
            <div className="mobile-generator-actions">
              <Button
                className="mobile-generator-download"
                disabled={invalidRange || downloadState === 'working'}
                onClick={() => void runDownload()}
                size="lg"
              >
                <Download aria-hidden="true" data-icon="inline-start" />
                {downloadState === 'working'
                  ? copy.generator.working
                  : copy.generator.mobileDownload}
              </Button>
              <Button
                className="mobile-generator-preview"
                onClick={scrollToGeneratorPreview}
                size="lg"
                type="button"
              >
                {copy.generator.mobilePreview}
                <ChevronDown aria-hidden="true" data-icon="inline-end" />
              </Button>
            </div>
          )}
        </section>

        <section className="project-note" ref={projectNoteRef}>
          <div className="project-note-copy">
            <span className="project-note-stamp">{copy.projectNote.stamp}</span>
            <p className="project-note-lead">
              {copy.projectNote.leadPrefix}
              <mark>{copy.projectNote.leadHighlight}</mark>
              {copy.projectNote.leadSuffix}
            </p>
            <div className="project-note-grid">
              <p>
                {copy.projectNote.originPrefix}
                <mark>{copy.projectNote.originHighlight}</mark>
                {copy.projectNote.originSuffix}
              </p>
              <p>
                {copy.projectNote.usagePrefix}
                <mark>{copy.projectNote.usageHighlight}</mark>
                {copy.projectNote.usageSuffix}
              </p>
            </div>
            <div className="project-note-closing">
              <div>
                <p>{copy.projectNote.thanks}</p>
                <p className="project-note-signoff">
                  {copy.projectNote.signoff}
                </p>
              </div>
              <a className="project-note-cta" href="#wsparcie">
                <Coffee aria-hidden="true" />
                {copy.projectNote.cta}
              </a>
            </div>
          </div>
        </section>

        <section className="manifesto-section">
          <div className="manifesto-mark">
            <MoveHorizontal aria-hidden="true" />
          </div>
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
          <div>
            <p className="section-kicker">{copy.faq.kicker}</p>
            <h2>
              {copy.faq.line1}
              <br />
              {copy.faq.line2}
            </h2>
          </div>
          <Accordion className="faq-list" key={language}>
            {copy.faq.items.map(([question, answer], index) => (
              <AccordionItem key={question} value={'faq-' + String(index)}>
                <AccordionTrigger>{question}</AccordionTrigger>
                <AccordionContent>{answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="support-section" id="wsparcie">
          <p className="section-kicker">{copy.support.kicker}</p>
          <h2>
            {copy.support.line1}
            <br />
            {copy.support.line2}
          </h2>
          <p>{copy.support.text}</p>
          <DonationCheckout
            copy={copy.donation}
            language={language}
            source="section"
            status={supportStatus}
          />
        </section>

        <section
          aria-labelledby="quick-download-heading"
          className="quick-download-section"
        >
          <div className="quick-download-heading">
            <div>
              <p className="section-kicker">{copy.quickDownload.kicker}</p>
              <h2 id="quick-download-heading">{copy.quickDownload.heading}</h2>
            </div>
            <p>{copy.quickDownload.lead}</p>
          </div>
          <div className="quick-download-grid">
            {[
              {
                name: copy.generator.rice,
                style: 'rice' as const,
                title: copy.variants.riceAlt,
              },
              {
                name: copy.generator.block,
                style: 'block' as const,
                title: copy.variants.blockAlt,
              },
            ].map((variant, index) => (
              <article
                className={`quick-download-card quick-download-${variant.style}`}
                key={variant.style}
              >
                <div className="quick-download-preview">
                  <CalendarYearPreview
                    language={language}
                    year={currentYear}
                    style={variant.style}
                    title={`${variant.title} · ${currentYear}`}
                  />
                </div>
                <div className="quick-download-body">
                  <div className="quick-download-title">
                    <span>
                      {copy.variants.variant} 0{index + 1}
                    </span>
                    <h3>{variant.name}</h3>
                  </div>
                  <DownloadTrust
                    className="quick-download-trust"
                    message={copy.downloadTrust}
                  >
                    <div className="quick-download-actions">
                      {[currentYear, nextYear].map((year) => (
                        <Button
                          disabled={downloadState === 'working'}
                          key={year}
                          onClick={() =>
                            void runReadyCalendarDownload(variant.style, year)
                          }
                          type="button"
                        >
                          <Download
                            aria-hidden="true"
                            data-icon="inline-start"
                          />
                          {insertYear(copy.variants.download, year)}
                        </Button>
                      ))}
                    </div>
                  </DownloadTrust>
                </div>
              </article>
            ))}
          </div>
        </section>

        <SiteFooter
          contactContext={{ dayHeight, dayWidth, end, start, style }}
          language={language}
          shareText={copy.share.text}
          shareTitle={copy.share.title}
          shareUrl={
            language === 'en' ? `${SITE_ORIGIN}/en` : `${SITE_ORIGIN}/pl`
          }
        />

        <Dialog onOpenChange={setDonationOpen} open={donationOpen}>
          <DialogContent className="donation-dialog" showCloseButton={false}>
            <DialogClose
              aria-label={copy.donation.closeLabel}
              className="donation-x"
            >
              <X aria-hidden="true" />
            </DialogClose>
            <div className="donation-signal">
              <Coffee aria-hidden="true" />
              <span>{copy.donation.badge}</span>
            </div>
            <DialogHeader>
              <output aria-live="polite" className="donation-download-note">
                <span
                  aria-hidden="true"
                  className={`donation-download-check${mobilePdfStatus === 'preparing' ? '' : ' is-animated'}`}
                >
                  <Check />
                </span>
                <span className="donation-download-message">
                  <strong>{copy.donation.downloadTitle}</strong>
                  <small>{copy.donation.downloadLead}</small>
                </span>
              </output>
              <div className="donation-share">
                {mobilePdfStatus !== 'idle' ? (
                  <Button
                    className="donation-mobile-download-button"
                    data-state={mobilePdfStatus}
                    disabled={mobilePdfStatus === 'preparing'}
                    onClick={() => void saveMobilePdf()}
                    type="button"
                  >
                    {mobilePdfStatus === 'preparing' ? (
                      <>
                        <span>{copy.donation.mobilePreparing}</span>
                        <span
                          aria-hidden="true"
                          className="donation-download-dots"
                        >
                          <i />
                          <i />
                          <i />
                        </span>
                      </>
                    ) : (
                      <>
                        <Download aria-hidden="true" data-icon="inline-start" />
                        {copy.donation.mobileDownload}
                      </>
                    )}
                  </Button>
                ) : null}
                <Button
                  className="donation-share-button"
                  onClick={() => void shareCalendar()}
                  type="button"
                  variant="outline"
                >
                  <Share2 aria-hidden="true" data-icon="inline-start" />
                  {copy.share.button}
                </Button>
                <p
                  aria-live="polite"
                  className={`donation-share-status ${shareStatus}`}
                >
                  {shareStatusMessage}
                </p>
              </div>
              <div className="donation-copy">
                <DialogTitle>{copy.donation.title}</DialogTitle>
                <p className="donation-voluntary-copy">
                  {copy.donation.voluntaryLead}
                </p>
                <DialogFooter className="donation-actions">
                  <DonationCheckout
                    copy={copy.donation}
                    language={language}
                    source="dialog"
                    status={supportStatus}
                  />
                </DialogFooter>
                <DialogDescription>{copy.donation.lead}</DialogDescription>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
