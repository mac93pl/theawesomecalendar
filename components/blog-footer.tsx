import { BrandLogo } from '@/components/brand-logo';
import type { SiteLanguage } from '@/lib/calendar';
import { COPY } from '@/lib/translations';

export function BlogFooter({ language }: { language: SiteLanguage }) {
  const copy = COPY[language];

  return (
    <footer className="site-footer blog-footer">
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
        <a className="footer-top" href="#top">
          {copy.footer.top}
        </a>
      </div>
    </footer>
  );
}
