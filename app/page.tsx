'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  ArrowDown, CalendarRange, Check, Download, FileText,
  MoveHorizontal, Ruler, Sparkles,
} from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  CalendarMonth, CalendarStyle, addMonths, createMonths,
  currentMonthValue, monthCount, pageWord,
} from '@/lib/calendar';

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

function validToolInput(input: unknown): input is { start: string; end: string; style: CalendarStyle } {
  if (!input || typeof input !== 'object') return false;
  const value = input as Record<string, unknown>;
  return (
    typeof value.start === 'string' &&
    typeof value.end === 'string' &&
    (value.style === 'rice' || value.style === 'block') &&
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

function CalendarPagePreview({ months, style }: { months: CalendarMonth[]; style: CalendarStyle }) {
  const visible = months.slice(0, 4);
  return (
    <svg aria-labelledby="calendar-preview-title" className="calendar-sheet" viewBox="0 0 1120 790">
      <title id="calendar-preview-title">Podgląd pierwszej strony kalendarza</title>
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
            <text className="strip-number" textAnchor="end" x={1062} y={246 + row * 350}>PASEK {row + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Home() {
  const initialStart = useMemo(() => currentMonthValue(), []);
  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(() => addMonths(initialStart, 11));
  const [style, setStyle] = useState<CalendarStyle>('rice');
  const [downloadState, setDownloadState] = useState<'idle' | 'working' | 'done' | 'error'>('idle');
  const [downloadMessage, setDownloadMessage] = useState('');

  const count = monthCount(start, end);
  const invalidRange = count < 1 || count > 24;
  const months = useMemo(() => invalidRange ? [] : createMonths(start, end), [end, invalidRange, start]);
  const pages = Math.max(1, Math.ceil(months.length / 4));

  const runDownload = useCallback(async (selectedStyle: CalendarStyle = style) => {
    if (invalidRange) throw new Error('Wybierz zakres od 1 do 24 miesięcy.');
    setStyle(selectedStyle);
    setDownloadState('working');
    setDownloadMessage('Składam strony i przygotowuję plik…');

    try {
      const { downloadPdf, generateCalendarPdf } = await import('@/lib/calendar-pdf');
      const result = await generateCalendarPdf(start, end, selectedStyle);
      downloadPdf(result.bytes, result.filename);
      setDownloadState('done');
      setDownloadMessage('Gotowe — plik PDF został pobrany.');
      return { downloaded: true, filename: result.filename, months: result.months, pages: result.pages };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nie udało się wygenerować pliku.';
      setDownloadState('error');
      setDownloadMessage(message);
      throw error;
    }
  }, [end, invalidRange, start, style]);

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
      title: 'Ustaw kalendarz',
      description: 'Ustawia widoczny zakres od 1 do 24 miesięcy i wybiera styl kalendarza.',
      inputSchema: {
        type: 'object',
        properties: {
          start: { type: 'string', description: 'Miesiąc początkowy w formacie RRRR-MM.' },
          end: { type: 'string', description: 'Miesiąc końcowy w formacie RRRR-MM.' },
          style: { type: 'string', enum: ['rice', 'block'] },
        },
        required: ['start', 'end', 'style'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!validToolInput(input)) throw new Error('Podaj poprawny zakres od 1 do 24 miesięcy i styl rice lub block.');
        setStart(input.start);
        setEnd(input.end);
        setStyle(input.style);
        const length = monthCount(input.start, input.end);
        return { start: input.start, end: input.end, style: input.style, months: length, pages: Math.ceil(length / 4) };
      },
    });

    register({
      name: 'download_calendar_pdf',
      title: 'Pobierz kalendarz PDF',
      description: 'Generuje i pobiera PDF dla zakresu oraz stylu ustawionego w widocznym generatorze.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: () => runDownload(),
    });

    return () => lifecycle.abort();
  }, [runDownload]);

  return (
    <main>
      <header className="site-header">
        <a aria-label="The Awesome Calendar — strona główna" className="brand" href="#top">
          <Image alt="" height={100} priority src="/brand/logo.png" width={494} />
        </a>
        <nav aria-label="Główna nawigacja">
          <a href="#jak-to-dziala">Jak to działa</a>
          <a href="#warianty">Warianty</a>
          <a className="nav-support" href="#wsparcie">Wesprzyj później</a>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Kalendarz liniowy do druku</p>
          <h1>CAŁY ROK.<br />JEDEN RZUT OKA.</h1>
          <p className="hero-lead">Wybierz zakres. Wydrukuj. Wytnij. Sklej w jedną czytelną oś czasu.</p>
          <a className="scroll-cue" href="#jak-to-dziala">Zobacz, jak to działa <ArrowDown aria-hidden="true" /></a>
        </div>

        <div className="generator-card" id="generator">
          <div className="generator-heading">
            <div><p className="section-kicker">Twój kalendarz</p><h2>Ustaw zakres</h2></div>
            <CalendarRange aria-hidden="true" />
          </div>

          <div className="date-grid">
            <label htmlFor="calendar-start"><span>Od miesiąca</span><Input aria-invalid={invalidRange} id="calendar-start" max="2035-12" min="2024-01" onChange={(event) => setStart(event.target.value)} type="month" value={start} /></label>
            <label htmlFor="calendar-end"><span>Do miesiąca</span><Input aria-invalid={invalidRange} id="calendar-end" max="2035-12" min="2024-01" onChange={(event) => setEnd(event.target.value)} type="month" value={end} /></label>
          </div>

          <RadioGroup aria-label="Styl kalendarza" className="style-picker" onValueChange={(value) => setStyle(value as CalendarStyle)} value={style}>
            <label className="style-option" htmlFor="style-rice"><RadioGroupItem id="style-rice" value="rice" /><span><strong>Nowoczesny ryż</strong><small>subtelne znaczniki dni</small></span></label>
            <label className="style-option" htmlFor="style-block"><RadioGroupItem id="style-block" value="block" /><span><strong>Klasyczny blok</strong><small>mocny rytm tygodnia</small></span></label>
          </RadioGroup>

          <div className="generator-result">
            <div><strong>{months.length || '—'} mies.</strong><span>{invalidRange ? 'popraw zakres' : String(pages) + ' ' + pageWord(pages) + ' A4'}</span></div>
            <Button className="download-button" disabled={invalidRange || downloadState === 'working'} onClick={() => void runDownload()} size="lg">
              <Download aria-hidden="true" data-icon="inline-start" />{downloadState === 'working' ? 'Generuję…' : 'Pobierz PDF'}
            </Button>
          </div>
          {invalidRange && <p className="range-error" role="alert">Wybierz zakres od 1 do 24 miesięcy.</p>}
          <p className={['download-status', downloadState].join(' ')} aria-live="polite">{downloadMessage}</p>
          <p className="privacy-note"><Check aria-hidden="true" /> Plik powstaje w Twojej przeglądarce. Niczego nie wysyłamy.</p>
        </div>

        <div className="preview-card">
          <div className="preview-toolbar"><span>Podgląd — strona 1 z {pages}</span><span><FileText aria-hidden="true" /> A4 poziomo</span></div>
          <div className="sheet-stage">
            {months.length > 0 ? <CalendarPagePreview months={months} style={style} /> : <div className="empty-preview">Popraw zakres, aby zobaczyć podgląd.</div>}
          </div>
        </div>
      </section>

      <section className="facts-rail" aria-label="Najważniejsze cechy">
        <div><Ruler aria-hidden="true" /><strong>≈ 1,5 M</strong><span>po sklejeniu</span></div>
        <div><FileText aria-hidden="true" /><strong>3 × A4</strong><span>dla 12 miesięcy</span></div>
        <div><MoveHorizontal aria-hidden="true" /><strong>1 OŚ</strong><span>bez kartek do przewracania</span></div>
      </section>

      <section className="how-section" id="jak-to-dziala">
        <p className="section-kicker">Bez kombinowania</p>
        <h2>TRZY KROKI. JEDNA OŚ CZASU.</h2>
        <div className="steps">
          {[
            ['/brand/drukarka.png', '01', 'Wydrukuj', 'Zwykłe kartki A4, druk w skali 100%.'],
            ['/brand/ciecie.png', '02', 'Wytnij', 'Prowadzą Cię delikatne linie cięcia.'],
            ['/brand/klejenie.png', '03', 'Sklej', 'Połącz paski w kalendarz długości około 1,5 m.'],
          ].map(([image, number, title, text]) => (
            <article className="step-card" key={number}>
              <span className="step-number">{number}</span><Image alt="" height={264} src={image} width={264} />
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="variants-section" id="warianty">
        <div className="section-heading-row">
          <div><p className="section-kicker">Dwa charaktery</p><h2>WYBIERZ SWÓJ RYTM.</h2></div>
          <p>Ten sam zakres, ten sam prosty montaż. Inny ciężar graficzny.</p>
        </div>
        <div className="variant-grid">
          <article className="variant-card rice-variant">
            <div className="variant-image"><Image alt="Podgląd wariantu Nowoczesny ryż" height={600} src="/brand/ryz-preview.png" width={900} /></div>
            <div className="variant-copy"><span>Wariant 01</span><h3>Nowoczesny ryż</h3><p>Lekki, precyzyjny i spokojny. Dobrze znosi notatki, kreski i kolor.</p><Button onClick={() => void runDownload('rice')} disabled={invalidRange || downloadState === 'working'}><Download data-icon="inline-start" />Pobierz ten wariant</Button></div>
          </article>
          <article className="variant-card block-variant">
            <div className="variant-image"><Image alt="Podgląd wariantu Klasyczny blok" height={600} src="/brand/blok-preview.png" width={900} /></div>
            <div className="variant-copy"><span>Wariant 02</span><h3>Klasyczny blok</h3><p>Wyrazisty i bezpośredni. Weekend widać od razu, nawet z drugiego końca pokoju.</p><Button onClick={() => void runDownload('block')} disabled={invalidRange || downloadState === 'working'}><Download data-icon="inline-start" />Pobierz ten wariant</Button></div>
          </article>
        </div>
      </section>

      <section className="manifesto-section">
        <div className="manifesto-mark"><Sparkles aria-hidden="true" /></div>
        <blockquote>„CZAS NIE MIEŚCI SIĘ W KRATKACH. DLATEGO ROZCIĄGNĘLIŚMY GO W LINIĘ.”</blockquote>
        <p>Plan projektu, semestru, treningu albo całego roku — zobacz początek, koniec i wszystko pomiędzy bez zmiany widoku.</p>
      </section>

      <section className="faq-section" id="faq">
        <div><p className="section-kicker">Przed drukiem</p><h2>DROBNE PYTANIA.<br />PROSTE ODPOWIEDZI.</h2></div>
        <Accordion className="faq-list">
          <AccordionItem value="print"><AccordionTrigger>Jak ustawić drukarkę?</AccordionTrigger><AccordionContent>Wybierz papier A4 w poziomie, skalę 100% i wyłącz dopasowanie do strony. Linie cięcia oraz kolejność pasków są już w PDF.</AccordionContent></AccordionItem>
          <AccordionItem value="range"><AccordionTrigger>Czy muszę zaczynać od stycznia?</AccordionTrigger><AccordionContent>Nie. Generator przyjmuje dowolny zakres od 1 do 24 kolejnych miesięcy — także rok szkolny, sezon albo kwartał.</AccordionContent></AccordionItem>
          <AccordionItem value="privacy"><AccordionTrigger>Czy moje dane trafiają na serwer?</AccordionTrigger><AccordionContent>Nie. Daty, podgląd i plik PDF powstają lokalnie w przeglądarce. Projekt nie wymaga konta ani backendu.</AccordionContent></AccordionItem>
          <AccordionItem value="price"><AccordionTrigger>Ile to kosztuje?</AccordionTrigger><AccordionContent>Na tym etapie kalendarz jest dostępny bez płatności. W przyszłości pojawi się dobrowolna opcja wsparcia projektu.</AccordionContent></AccordionItem>
        </Accordion>
      </section>

      <section className="support-section" id="wsparcie">
        <p className="section-kicker">Jeszcze nie teraz</p><h2>KAWA DLA<br />KALENDARZA.</h2>
        <p>Kalendarz pozostaje do pobrania bez bramki płatniczej. Tu później pojawi się prosty, dobrowolny przycisk wsparcia.</p>
        <Button disabled variant="outline">Wsparcie — wkrótce</Button>
      </section>

      <footer>
        <Image alt="The Awesome Calendar" height={100} src="/brand/logo.png" width={494} />
        <p>Kalendarz, który wreszcie pokazuje cały plan.</p><a href="#top">Wróć na górę ↑</a>
      </footer>
    </main>
  );
}
