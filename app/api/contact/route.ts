type ContactLanguage = 'en' | 'pl';
type ContactTopic = 'idea' | 'other' | 'problem' | 'question';

type ContactPayload = {
  context?: {
    dayHeight?: unknown;
    dayWidth?: unknown;
    end?: unknown;
    start?: unknown;
    style?: unknown;
  };
  email?: unknown;
  language?: unknown;
  message?: unknown;
  pageUrl?: unknown;
  topic?: unknown;
  turnstileToken?: unknown;
  website?: unknown;
};

type TurnstileResult = {
  action?: string;
  hostname?: string;
  success?: boolean;
};

const CONTACT_TOPICS: Record<ContactTopic, Record<ContactLanguage, string>> = {
  idea: { en: 'Idea', pl: 'Pomysł' },
  other: { en: 'Other', pl: 'Inne' },
  problem: { en: 'Problem', pl: 'Problem' },
  question: { en: 'Question', pl: 'Pytanie' },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_REQUEST_BYTES = 16_000;

function json(payload: object, status = 200) {
  return Response.json(payload, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function sameOrigin(request: Request) {
  const browserOrigin = request.headers.get('origin');
  return !browserOrigin || browserOrigin === new URL(request.url).origin;
}

function isTopic(value: unknown): value is ContactTopic {
  return typeof value === 'string' && Object.hasOwn(CONTACT_TOPICS, value);
}

function optionalText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function GET() {
  const siteKey = process.env.TURNSTILE_SITE_KEY;
  if (!siteKey) {
    console.error('TURNSTILE_SITE_KEY is not configured.');
    return json({ ok: false }, 503);
  }

  return json({ ok: true, siteKey });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ ok: false }, 403);

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_REQUEST_BYTES) return json({ ok: false }, 413);

  let payload: ContactPayload;
  try {
    const candidate: unknown = await request.json();
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate))
      return json({ ok: false }, 400);
    payload = candidate as ContactPayload;
  } catch {
    return json({ ok: false }, 400);
  }

  // Bots commonly fill fields hidden from people. Respond successfully without
  // sending anything so the trap does not disclose how it works.
  if (typeof payload.website === 'string' && payload.website.trim()) {
    return json({ ok: true });
  }

  const language: ContactLanguage = payload.language === 'en' ? 'en' : 'pl';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message =
    typeof payload.message === 'string' ? payload.message.trim() : '';
  const turnstileToken =
    typeof payload.turnstileToken === 'string'
      ? payload.turnstileToken.trim()
      : '';

  if (
    !isTopic(payload.topic) ||
    email.length > 254 ||
    !EMAIL_PATTERN.test(email) ||
    message.length < 10 ||
    message.length > 4_000 ||
    turnstileToken.length > 2_048 ||
    !turnstileToken
  ) {
    return json({ ok: false }, 400);
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!resendApiKey || !turnstileSecretKey || !from || !to) {
    console.error('Contact form environment is not fully configured.');
    return json({ ok: false }, 503);
  }

  const requestUrl = new URL(request.url);
  const turnstileForm = new FormData();
  turnstileForm.set('secret', turnstileSecretKey);
  turnstileForm.set('response', turnstileToken);
  turnstileForm.set('idempotency_key', crypto.randomUUID());
  const remoteIp = request.headers.get('CF-Connecting-IP');
  if (remoteIp) turnstileForm.set('remoteip', remoteIp);

  let challenge: TurnstileResult;
  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: turnstileForm },
    );
    challenge = (await response.json()) as TurnstileResult;
  } catch (error) {
    console.error('Turnstile verification failed.', error);
    return json({ ok: false }, 503);
  }

  const hostnameMatches =
    !challenge.hostname ||
    requestUrl.hostname === 'localhost' ||
    challenge.hostname === requestUrl.hostname;
  if (
    !challenge.success ||
    challenge.action !== 'contact' ||
    !hostnameMatches
  ) {
    return json({ ok: false }, 403);
  }

  const context = payload.context;
  const details = [
    `Język strony / Site language: ${language}`,
    `Strona / Page: ${optionalText(payload.pageUrl, 500) || requestUrl.origin}`,
  ];

  if (context && typeof context === 'object') {
    const start = optionalText(context.start, 10);
    const end = optionalText(context.end, 10);
    const style = optionalText(context.style, 20);
    const dayWidth = optionalText(context.dayWidth, 20);
    const dayHeight = optionalText(context.dayHeight, 20);
    if (start && end) details.push(`Zakres / Range: ${start} – ${end}`);
    if (style) details.push(`Styl / Style: ${style}`);
    if (dayWidth) details.push(`Szerokość / Width: ${dayWidth}`);
    if (dayHeight) details.push(`Wysokość / Height: ${dayHeight}`);
  }

  const topic = CONTACT_TOPICS[payload.topic][language];
  const emailBody = [
    message,
    '',
    '---',
    `Od / From: ${email}`,
    ...details,
  ].join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': crypto.randomUUID(),
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[The Awesome Calendar] ${topic}`,
        text: emailBody,
      }),
    });

    if (!response.ok) {
      console.error('Resend contact email failed.', response.status);
      return json({ ok: false }, 502);
    }
  } catch (error) {
    console.error('Resend contact request failed.', error);
    return json({ ok: false }, 502);
  }

  return json({ ok: true });
}
