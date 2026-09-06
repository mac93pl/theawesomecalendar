'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, Share2 } from 'lucide-react';

import { BrandLogo } from '@/components/brand-logo';
import {
  ContactDialog,
  type ContactContext,
} from '@/components/contact-dialog';
import type { SiteLanguage } from '@/lib/calendar';
import { COPY } from '@/lib/translations';

type ShareStatus = 'copied' | 'error' | 'idle' | 'shared';

function ShareStatusIcon({ status }: { status: ShareStatus }) {
  return status === 'copied' || status === 'shared' ? (
    <Check aria-hidden="true" />
  ) : (
    <Share2 aria-hidden="true" />
  );
}

export function SiteFooter({
  contactContext,
  language,
  shareText,
  shareTitle,
  shareUrl,
}: {
  contactContext?: ContactContext;
  language: SiteLanguage;
  shareText?: string;
  shareTitle?: string;
  shareUrl: string;
}) {
  const copy = COPY[language];
  const [shareStatus, setShareStatus] = useState<ShareStatus>('idle');
  const shareStatusMessage =
    shareStatus === 'shared'
      ? copy.share.shared
      : shareStatus === 'copied'
        ? copy.share.copied
        : shareStatus === 'error'
          ? copy.share.error
          : '';

  const sharePage = useCallback(async () => {
    setShareStatus('idle');

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle || document.title,
          text: shareText || copy.share.text,
          url: shareUrl,
        });
        setShareStatus('shared');
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setShareStatus('copied');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setShareStatus('error');
    }
  }, [copy.share.text, shareText, shareTitle, shareUrl]);

  useEffect(() => {
    if (shareStatus === 'idle') return;
    const timeout = window.setTimeout(() => setShareStatus('idle'), 4000);
    return () => window.clearTimeout(timeout);
  }, [shareStatus]);

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <BrandLogo alt="The Awesome Calendar" />
        <p>{copy.footer.line}</p>
        <p className="footer-copyright">{copy.footer.copyright}</p>
        <p className="footer-made-in">{copy.footer.madeIn}</p>
      </div>
      <div className="footer-legal">
        <p>{copy.footer.permission}</p>
        <nav
          aria-label={copy.footer.licensesLabel}
          className="footer-license-links"
        >
          <a
            data-license="MPL-2.0"
            href="https://www.mozilla.org/MPL/2.0/"
            rel="license"
          >
            {copy.footer.codeLicense}
          </a>
          <a
            data-license="CC-BY-4.0"
            href="https://creativecommons.org/licenses/by/4.0/"
            rel="license"
          >
            {copy.footer.contentLicense}
          </a>
        </nav>
        <p>{copy.footer.attribution}</p>
        <p>{copy.footer.brand}</p>
        <p className="footer-warning">{copy.footer.warning}</p>
      </div>
      <div className="footer-actions">
        <ContactDialog
          context={contactContext}
          copy={copy.contact}
          language={language}
        />
        <button
          aria-label={copy.share.button}
          className="footer-share-button"
          data-share-status={shareStatus}
          onClick={() => void sharePage()}
          title={shareStatusMessage || copy.share.button}
          type="button"
        >
          <ShareStatusIcon status={shareStatus} />
          <span>{copy.share.button}</span>
        </button>
        <a className="footer-top" href="#top">
          {copy.footer.top}
        </a>
        <p aria-live="polite" className="sr-only">
          {shareStatusMessage}
        </p>
      </div>
    </footer>
  );
}
