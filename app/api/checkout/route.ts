import { SUPPORT_CONFIG } from '@/lib/support';

type SiteLanguage = 'pl' | 'en';
type CheckoutSource = 'section' | 'dialog';
type ReturnStatus = 'cancelled' | 'error' | 'invalid' | 'success';

function returnUrl(
  request: Request,
  language: SiteLanguage,
  status: ReturnStatus,
) {
  const url = new URL(language === 'en' ? '/en' : '/pl', request.url);
  url.searchParams.set('support', status);
  url.hash = 'wsparcie';
  return url;
}

function redirectBack(
  request: Request,
  language: SiteLanguage,
  status: ReturnStatus,
) {
  return Response.redirect(returnUrl(request, language, status), 303);
}

export async function POST(request: Request) {
  const requestOrigin = new URL(request.url).origin;
  const browserOrigin = request.headers.get('origin');
  if (browserOrigin && browserOrigin !== requestOrigin) {
    return new Response('Forbidden', { status: 403 });
  }

  const formData = await request.formData();
  const language: SiteLanguage =
    formData.get('language') === 'en' ? 'en' : 'pl';
  const source: CheckoutSource =
    formData.get('source') === 'dialog' ? 'dialog' : 'section';
  const amount = Number(formData.get('amount'));
  const supportConfig = SUPPORT_CONFIG[language];

  if (
    !Number.isInteger(amount) ||
    amount < supportConfig.minAmount ||
    amount > supportConfig.maxAmount
  ) {
    return redirectBack(request, language, 'invalid');
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error('STRIPE_SECRET_KEY is not configured.');
    return redirectBack(request, language, 'error');
  }

  const successUrl = returnUrl(request, language, 'success');
  const cancelUrl = returnUrl(request, language, 'cancelled');
  const productName =
    language === 'pl'
      ? 'Kawa dla The Awesome Calendar'
      : 'Coffee for The Awesome Calendar';
  const params = new URLSearchParams({
    mode: 'payment',
    locale: language,
    success_url: successUrl.toString(),
    cancel_url: cancelUrl.toString(),
    'line_items[0][price_data][currency]': supportConfig.currency,
    'line_items[0][price_data][unit_amount]': String(amount * 100),
    'line_items[0][price_data][product_data][name]': productName,
    'line_items[0][quantity]': '1',
    'metadata[support_source]': source,
    'metadata[site_language]': language,
    'payment_intent_data[metadata][support_source]': source,
  });

  try {
    const response = await fetch(
      'https://api.stripe.com/v1/checkout/sessions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      },
    );
    const session = (await response.json()) as {
      url?: string;
      error?: { message?: string };
    };

    if (!response.ok || !session.url) {
      console.error(
        'Stripe Checkout Session creation failed.',
        session.error?.message || response.status,
      );
      return redirectBack(request, language, 'error');
    }

    return Response.redirect(session.url, 303);
  } catch (error) {
    console.error('Stripe Checkout request failed.', error);
    return redirectBack(request, language, 'error');
  }
}
