'use client';

import { ArrowRight, Check, Coffee, Download, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CalendarSampleSvg } from '@/components/calendar-page-svg';
import {
  DonationCheckout,
  type SupportStatus,
} from '@/components/donation-checkout';
import { DownloadTrust } from '@/components/download-trust';
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
import { STANDARD_CALENDAR_SIZE, type SiteLanguage } from '@/lib/calendar';
import { createCalendarLayout } from '@/lib/calendar-layout';
import { BLOG_COPY } from '@/lib/blog';
import { COPY } from '@/lib/translations';

function yearRange(year: number) {
  return { start: `${year}-01-01`, end: `${year}-12-31` };
}

function withYear(template: string, year: number) {
  return template.replace('{year}', String(year));
}

function triggerDownload(bytes: Uint8Array, filename: string) {
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

export function BlogDownloadCta({ language }: { language: SiteLanguage }) {
  const [currentYear] = useState(() => new Date().getFullYear());
  const [workingYear, setWorkingYear] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const [supportStatus] = useState<SupportStatus>(null);
  const copy = BLOG_COPY[language].download;
  const donationCopy = COPY[language].donation;
  const currentRange = useMemo(() => yearRange(currentYear), [currentYear]);
  const sampleStrip = useMemo(
    () =>
      createCalendarLayout(
        currentRange.start,
        currentRange.end,
        language,
        STANDARD_CALENDAR_SIZE,
      ).strips[0],
    [currentRange.end, currentRange.start, language],
  );

  const downloadCalendar = async (year: number) => {
    const range = yearRange(year);
    setFailed(false);
    setWorkingYear(year);

    try {
      const layout = createCalendarLayout(
        range.start,
        range.end,
        language,
        STANDARD_CALENDAR_SIZE,
      );
      const { generateCalendarPdf } = await import('@/lib/calendar-export');
      const result = await generateCalendarPdf(
        layout,
        range.start,
        range.end,
        'rice',
        language,
      );
      triggerDownload(result.bytes, result.filename);
      setDonationOpen(true);
    } catch (error) {
      console.warn('Blog calendar PDF generation failed.', error);
      setFailed(true);
    } finally {
      setWorkingYear(null);
    }
  };

  return (
    <aside aria-labelledby="blog-download-title" className="blog-download-cta">
      <div className="blog-download-copy">
        <p className="section-kicker">{copy.kicker}</p>
        <h2 id="blog-download-title">{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>
      <div className="blog-download-current">
        <div className="blog-download-preview">
          <CalendarSampleSvg
            strip={sampleStrip}
            style="rice"
            title={withYear(copy.preview, currentYear)}
          />
        </div>
        <DownloadTrust
          className="blog-download-direct blog-download-primary-trust"
          message={COPY[language].downloadTrust}
        >
          <Button
            disabled={workingYear !== null}
            onClick={() => void downloadCalendar(currentYear)}
            type="button"
          >
            <Download aria-hidden="true" data-icon="inline-start" />
            {workingYear === currentYear
              ? copy.working
              : withYear(copy.current, currentYear)}
          </Button>
        </DownloadTrust>
      </div>
      <div className="blog-download-secondary">
        <DownloadTrust
          className="blog-download-direct"
          message={COPY[language].downloadTrust}
        >
          <Button
            disabled={workingYear !== null}
            onClick={() => void downloadCalendar(currentYear + 1)}
            type="button"
            variant="outline"
          >
            <Download aria-hidden="true" data-icon="inline-start" />
            {workingYear === currentYear + 1
              ? copy.working
              : withYear(copy.next, currentYear + 1)}
          </Button>
        </DownloadTrust>
        <Button
          nativeButton={false}
          render={
            <a aria-label={copy.generate} href={`/${language}#generator`} />
          }
          variant="outline"
        >
          {copy.generate}
          <ArrowRight aria-hidden="true" data-icon="inline-end" />
        </Button>
      </div>
      {failed ? (
        <p aria-live="polite" className="blog-download-error" role="alert">
          {copy.failed}
        </p>
      ) : null}

      <Dialog onOpenChange={setDonationOpen} open={donationOpen}>
        <DialogContent
          className="donation-dialog blog-donation-dialog"
          showCloseButton={false}
        >
          <DialogClose
            aria-label={donationCopy.closeLabel}
            className="donation-x"
          >
            <X aria-hidden="true" />
          </DialogClose>
          <div className="donation-signal">
            <Coffee aria-hidden="true" />
            <span>{donationCopy.badge}</span>
          </div>
          <DialogHeader>
            <output aria-live="polite" className="donation-download-note">
              <span
                aria-hidden="true"
                className="donation-download-check is-animated"
              >
                <Check />
              </span>
              <span className="donation-download-message">
                <strong>{donationCopy.downloadTitle}</strong>
                <small>{donationCopy.downloadLead}</small>
              </span>
            </output>
            <div className="donation-copy">
              <DialogTitle>{donationCopy.title}</DialogTitle>
              <p className="donation-voluntary-copy">
                {donationCopy.voluntaryLead}
              </p>
              <DialogFooter className="donation-actions">
                <DonationCheckout
                  copy={donationCopy}
                  language={language}
                  source="dialog"
                  status={supportStatus}
                />
              </DialogFooter>
              <DialogDescription>{donationCopy.lead}</DialogDescription>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
