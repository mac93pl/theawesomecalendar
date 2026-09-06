'use client';

import { Coffee } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SiteLanguage } from '@/lib/calendar';
import { formatSupportAmount, SUPPORT_CONFIG } from '@/lib/support';
import { COPY } from '@/lib/translations';

export type SupportStatus =
  | 'cancelled'
  | 'error'
  | 'invalid'
  | 'success'
  | null;

type DonationCheckoutProps = {
  copy: (typeof COPY)[SiteLanguage]['donation'];
  language: SiteLanguage;
  source: 'dialog' | 'section';
  status: SupportStatus;
};

export function DonationCheckout({
  copy,
  language,
  source,
  status,
}: DonationCheckoutProps) {
  const supportConfig = SUPPORT_CONFIG[language];
  const statusMessage = status ? copy.status[status] : '';

  return (
    <div className="donation-checkout">
      <fieldset className="donation-presets">
        <legend>{copy.amountLegend}</legend>
        <div className="donation-preset-buttons">
          {supportConfig.amounts.map((amount, index) => (
            <form action="/api/checkout" key={amount} method="post">
              <input name="language" type="hidden" value={language} />
              <input name="source" type="hidden" value={source} />
              <Button
                aria-label={`${copy.presetButton}: ${formatSupportAmount(amount, language)} — ${copy.amountNames[index]}`}
                aria-describedby={`donation-legal-${source}`}
                className={
                  amount === supportConfig.recommendedAmount
                    ? 'donation-preset-option is-recommended'
                    : 'donation-preset-option'
                }
                name="amount"
                type="submit"
                value={amount}
              >
                <strong>{formatSupportAmount(amount, language)}</strong>
                <span>{copy.amountNames[index]}</span>
                {amount === supportConfig.recommendedAmount && (
                  <small>{copy.recommended}</small>
                )}
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
              max={supportConfig.maxAmount}
              min={supportConfig.minAmount}
              name="amount"
              placeholder={copy.customPlaceholder}
              required
              step="1"
              type="number"
            />
            <span aria-hidden="true">{supportConfig.currencyLabel}</span>
          </div>
          <Button aria-describedby={`donation-legal-${source}`} type="submit">
            <Coffee aria-hidden="true" />
            {copy.customButton}
          </Button>
        </div>
        <p className="donation-hint" id={`support-hint-${source}`}>
          {copy.hint}
        </p>
      </form>
      <p className="donation-legal" id={`donation-legal-${source}`}>
        {copy.legal}
      </p>
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
