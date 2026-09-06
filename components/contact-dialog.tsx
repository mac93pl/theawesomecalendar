'use client';

import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { Check, MessageSquareText, Send, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import type {
  CalendarDayHeight,
  CalendarDayWidth,
  CalendarStyle,
  SiteLanguage,
} from '@/lib/calendar';

type ContactTopic = 'idea' | 'other' | 'problem' | 'question';
type ContactStatus = 'idle' | 'submitting' | 'success';

type ContactCopy = {
  closeLabel: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  error: string;
  messageLabel: string;
  messagePlaceholder: string;
  privacy: string;
  securityError: string;
  securityLoading: string;
  sendAnother: string;
  submit: string;
  submitting: string;
  successDescription: string;
  successTitle: string;
  title: string;
  topicLabel: string;
  topics: Record<ContactTopic, string>;
  trigger: string;
};

type ContactContext = {
  dayHeight: CalendarDayHeight;
  dayWidth: CalendarDayWidth;
  end: string;
  start: string;
  style: CalendarStyle;
};

type TurnstileApi = {
  remove: (widgetId: string) => void;
  render: (
    container: HTMLElement,
    options: {
      action: string;
      callback: (token: string) => void;
      'error-callback': () => void;
      'expired-callback': () => void;
      language: SiteLanguage;
      sitekey: string;
      size: 'flexible';
      theme: 'auto';
    },
  ) => string;
  reset: (widgetId: string) => void;
};

const TURNSTILE_SCRIPT_ID = 'awesome-calendar-turnstile';
let turnstileScriptPromise: Promise<TurnstileApi> | null = null;

function currentTurnstile() {
  return (window as typeof window & { turnstile?: TurnstileApi }).turnstile;
}

function loadTurnstile() {
  const current = currentTurnstile();
  if (current) return Promise.resolve(current);
  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    const existing = document.getElementById(TURNSTILE_SCRIPT_ID);
    const handleLoad = () => {
      const api = currentTurnstile();
      if (api) resolve(api);
      else reject(new Error('Turnstile API was not initialized.'));
    };
    const handleError = () => reject(new Error('Turnstile script failed.'));

    if (existing) {
      existing.addEventListener('load', handleLoad, { once: true });
      existing.addEventListener('error', handleError, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = TURNSTILE_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src =
      'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
    document.head.appendChild(script);
  }).catch((error) => {
    document.getElementById(TURNSTILE_SCRIPT_ID)?.remove();
    turnstileScriptPromise = null;
    throw error;
  });

  return turnstileScriptPromise;
}

export function ContactDialog({
  context,
  copy,
  language,
}: {
  context: ContactContext;
  copy: ContactCopy;
  language: SiteLanguage;
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [siteKey, setSiteKey] = useState('');
  const [status, setStatus] = useState<ContactStatus>('idle');
  const [token, setToken] = useState('');
  const [topic, setTopic] = useState<ContactTopic>('question');
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const showForm = status !== 'success';

  useEffect(() => {
    if (!open || siteKey) return;
    const controller = new AbortController();

    void fetch('/api/contact', {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = (await response.json()) as {
          ok?: boolean;
          siteKey?: string;
        };
        if (!response.ok || !result.ok || !result.siteKey) throw new Error();
        setSiteKey(result.siteKey);
      })
      .catch((fetchError: unknown) => {
        if (
          fetchError instanceof DOMException &&
          fetchError.name === 'AbortError'
        )
          return;
        setError(copy.securityError);
      });

    return () => controller.abort();
  }, [copy.securityError, open, siteKey]);

  useEffect(() => {
    if (!open || !siteKey || !showForm) return;
    let cancelled = false;

    void loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !turnstileContainerRef.current) return;
        widgetIdRef.current = turnstile.render(turnstileContainerRef.current, {
          sitekey: siteKey,
          action: 'contact',
          callback: (nextToken) => {
            setToken(nextToken);
            setError('');
          },
          'expired-callback': () => setToken(''),
          'error-callback': () => {
            setToken('');
            setError(copy.securityError);
          },
          language,
          size: 'flexible',
          theme: 'auto',
        });
      })
      .catch(() => setError(copy.securityError));

    return () => {
      cancelled = true;
      const widgetId = widgetIdRef.current;
      const turnstile = currentTurnstile();
      if (widgetId && turnstile) turnstile.remove(widgetId);
      widgetIdRef.current = null;
      setToken('');
    };
  }, [copy.securityError, language, open, showForm, siteKey]);

  const resetChallenge = () => {
    setToken('');
    const widgetId = widgetIdRef.current;
    const turnstile = currentTurnstile();
    if (widgetId && turnstile) turnstile.reset(widgetId);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    setError('');
    if (nextOpen) setStatus('idle');
  };

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    if (!token || status === 'submitting') return;

    const form = new FormData(event.currentTarget);
    setError('');
    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context,
          email,
          language,
          message,
          pageUrl: window.location.href,
          topic,
          turnstileToken: token,
          website: form.get('website'),
        }),
      });

      if (!response.ok) throw new Error();
      const result = (await response.json()) as { ok?: boolean };
      if (!result.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('idle');
      setError(copy.error);
      resetChallenge();
    }
  };

  const sendAnother = () => {
    setEmail('');
    setError('');
    setMessage('');
    setStatus('idle');
    setTopic('question');
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger className="footer-contact-button">
        <MessageSquareText aria-hidden="true" />
        <span>{copy.trigger}</span>
      </DialogTrigger>
      <DialogContent className="contact-dialog" showCloseButton={false}>
        <DialogClose
          aria-label={copy.closeLabel}
          className="contact-dialog-close"
        >
          <X aria-hidden="true" />
        </DialogClose>

        {status === 'success' ? (
          <div className="contact-success">
            <span aria-hidden="true" className="contact-success-mark">
              <Check />
            </span>
            <DialogTitle>{copy.successTitle}</DialogTitle>
            <DialogDescription>{copy.successDescription}</DialogDescription>
            <div className="contact-success-actions">
              <Button onClick={sendAnother} type="button">
                {copy.sendAnother}
              </Button>
              <DialogClose render={<Button type="button" variant="outline" />}>
                {copy.closeLabel}
              </DialogClose>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="contact-dialog-header">
              <span className="contact-dialog-kicker">
                <MessageSquareText aria-hidden="true" />
                {copy.trigger}
              </span>
              <DialogTitle>{copy.title}</DialogTitle>
              <DialogDescription>{copy.description}</DialogDescription>
            </DialogHeader>

            <form className="contact-form" onSubmit={handleSubmit}>
              <fieldset className="contact-fieldset">
                <legend>{copy.topicLabel}</legend>
                <RadioGroup
                  aria-label={copy.topicLabel}
                  className="contact-topics"
                  onValueChange={(value) => setTopic(value as ContactTopic)}
                  value={topic}
                >
                  {(Object.keys(copy.topics) as ContactTopic[]).map((value) => (
                    <Label className="contact-topic" key={value}>
                      <RadioGroupItem value={value} />
                      <span>{copy.topics[value]}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </fieldset>

              <Label className="contact-field" htmlFor="contact-email">
                <span>{copy.emailLabel}</span>
                <Input
                  autoComplete="email"
                  id="contact-email"
                  maxLength={254}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={copy.emailPlaceholder}
                  required
                  type="email"
                  value={email}
                />
              </Label>

              <Label className="contact-field" htmlFor="contact-message">
                <span>{copy.messageLabel}</span>
                <Textarea
                  id="contact-message"
                  maxLength={4000}
                  minLength={10}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder={copy.messagePlaceholder}
                  required
                  rows={6}
                  value={message}
                />
              </Label>

              <Label aria-hidden="true" className="contact-honeypot">
                Website
                <Input autoComplete="off" name="website" tabIndex={-1} />
              </Label>

              <div className="contact-security">
                <div ref={turnstileContainerRef} />
                {!siteKey && !error ? (
                  <span>{copy.securityLoading}</span>
                ) : null}
              </div>

              <p className="contact-privacy">{copy.privacy}</p>
              <p aria-live="polite" className="contact-error" role="alert">
                {error}
              </p>

              <Button
                className="contact-submit"
                disabled={!token || status === 'submitting'}
                type="submit"
              >
                <Send aria-hidden="true" data-icon="inline-start" />
                {status === 'submitting' ? copy.submitting : copy.submit}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
