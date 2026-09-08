# The Awesome Calendar

Jednostronicowy generator liniowego kalendarza do wydruku. Pozwala wybrać
dowolny zakres dat z dokładnością do dnia, język polski lub angielski oraz jeden
z dwóch stylów: **Ryż** albo **Boksy**. Gotowy kalendarz jest generowany jako
wielostronicowy PDF A4 do wycięcia i sklejenia.

Cała logika generatora oraz eksport PDF działają w przeglądarce. Jedyny endpoint
serwerowy tworzy sesje Stripe Checkout dla dobrowolnego wsparcia projektu.

## Stack

- React 19, TypeScript i Vinext/Vite,
- `date-fns` do obliczeń kalendarzowych,
- SVG jako wspólny format podglądu i wydruku,
- `jsPDF` oraz `svg2pdf.js` do eksportu PDF,
- lokalne fonty i grafiki z katalogu `public/`.

## Uruchomienie lokalne

Wymagany jest Node.js 22.13 lub nowszy oraz npm.

```bash
npm ci
npm run dev
```

Strona będzie dostępna pod adresem <http://localhost:3000>.

## Stripe Checkout

Przyciski 10, 20 i 50 zł oraz pole własnej kwoty korzystają z hostowanego
Stripe Checkout. Skopiuj `.env.example` do `.env.local` i uzupełnij testowy
sekret z **Stripe Dashboard → Developers → API keys**:

```bash
STRIPE_SECRET_KEY=sk_test_...
```

Klucz `sk_...` jest używany wyłącznie w endpointcie serwerowym i nie może być
udostępniony w kodzie klienta. W środowisku produkcyjnym dodaj
`STRIPE_SECRET_KEY` jako zaszyfrowany sekret Workera. Metody płatności są
dobierane dynamicznie z ustawień Stripe Dashboard; tam możesz włączyć m.in.
karty, Apple Pay i Google Pay. Przed publikacją zamień klucz testowy na `sk_live_...`.

## Formularz kontaktowy

Formularz w stopce wysyła wiadomości przez Resend. Rozmowa jest kontynuowana
zwykłym e-mailem: adres użytkownika jest ustawiany jako `Reply-To`, więc
odpowiedź z docelowej skrzynki trafia bezpośrednio do niego. Skonfiguruj w
środowisku Workera:

```bash
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL="The Awesome Calendar <connect@send.theawesomecalendar.com>"
CONTACT_TO_EMAIL=hello@theawesomecalendar.com
TURNSTILE_SITE_KEY=...
TURNSTILE_SECRET_KEY=...
```

Subdomena używana w `CONTACT_FROM_EMAIL` musi być zweryfikowana w Resend.
Turnstile jest weryfikowany po stronie serwera; sam publiczny site key nie
wystarcza do przyjęcia wiadomości. Wartości produkcyjne przechowuj jako zmienne
i sekrety Workera, a nie w repozytorium. Konfiguracja buildu zachowuje zmienne
ustawione bezpośrednio w panelu Cloudflare podczas kolejnych wdrożeń.

## Skrypty

| Polecenie | Działanie |
| --- | --- |
| `npm run dev` | Uruchamia lokalny serwer deweloperski. |
| `npm run lint` | Sprawdza kod aplikacji. |
| `npm run typecheck` | Sprawdza typy TypeScript. |
| `npm run build` | Tworzy produkcyjny build w `dist/`. |
| `npm run check` | Uruchamia lint, sprawdzanie typów i build. |
| `npm run start` | Uruchamia lokalnie zbudowanego Workera. |
| `npm run deploy` | Wdraża gotowy `dist/` przez Wrangler. |

## CI/CD

Workflow `.github/workflows/ci-cd.yml` uruchamia się dla pull requestów, pushy
do `main` oraz ręcznie:

1. instaluje zależności przez `npm ci`,
2. uruchamia lint i sprawdzanie typów,
3. buduje aplikację,
4. zapisuje katalog `dist/` jako krótko przechowywany artefakt,
5. opcjonalnie wdraża ten sam artefakt do Cloudflare Workers.

Wdrożenie jest domyślnie wyłączone, dzięki czemu pierwszy push nie zakończy się
błędem z powodu brakujących danych Cloudflare. Aby włączyć automatyczne CD, w
ustawieniach repozytorium GitHub dodaj:

- sekret `CLOUDFLARE_API_TOKEN` z minimalnymi uprawnieniami do wdrażania
  Workera,
- sekret `CLOUDFLARE_ACCOUNT_ID`,
- zmienną repozytorium `CLOUDFLARE_DEPLOY_ENABLED` o wartości `true`.

Po włączeniu CD każdy poprawny push do `main` wdroży wersję produkcyjną. Workflow
można też uruchomić ręcznie z zakładki **Actions**. Żaden sekret nie jest
przechowywany w kodzie ani w konfiguracji Git.

## Indeksowanie i wersje językowe

Polska wersja strony jest dostępna pod `/`, a angielska pod `/en`. Obie wersje
są renderowane na serwerze, mają własne canonicale i wzajemne odnośniki
`hreflang`. Mapa strony i reguły crawlerów są generowane pod `/sitemap.xml` oraz
`/robots.txt` dla domeny `https://theawesomecalendar.com`.

Weryfikację Google Search Console i Bing Webmaster Tools można włączyć podczas
budowania przez ustawienie odpowiednio `GOOGLE_SITE_VERIFICATION` oraz
`BING_SITE_VERIFICATION`. Wartości są publicznymi tokenami weryfikacyjnymi, nie
kluczami dostępowymi. W GitHub Actions dodaj je jako zmienne repozytorium
(`Settings → Secrets and variables → Actions → Variables`). Po wdrożeniu zgłoś
w obu usługach adres
`https://theawesomecalendar.com/sitemap.xml`.

## Strona 404 i honeypoty

Nieistniejące adresy zwracają HTTP 404 z krótkim opisem kalendarza po polsku
i angielsku oraz zaproszeniem na stronę główną i do generatora. Dokument
`app/global-not-found.tsx` obsługuje brak trasy poza osobnymi layoutami PL/EN,
a `app/not-found.tsx` — błędy `notFound()` wewnątrz aplikacji. Treść jest
renderowana w HTML i taka sama dla ludzi oraz crawlerów. Strony błędu mają
`noindex`; honeypoty nie są dodawane do mapy strony.

`proxy.ts` oznacza sondy ścieżek rozpoznawanych przez `lib/honeypots.ts`:
`wp-admin`, `wp-login.php`, `xmlrpc.php`, `index.php`, `wp-json`,
`wp-includes/wlwmanifest.xml` oraz `.env` z wariantami. Uwzględnia instalacje
w podkatalogach, wielkość liter i kodowanie URL. Routing nadal zwraca 404;
honeypoty nie udają panelu WordPressa ani plików konfiguracyjnych. Zwykłe
odwiedziny `/pl`, `/en`, API i starych grafik nie dostają tego oznaczenia.

Każde dopasowanie emituje jeden obiekt przez `console.info`, np.:

```json
{"event":"honeypot_hit","path":"/wp-admin/install.php","family":"wordpress","method":"GET"}
```

Cloudflare Workers Logs zapisuje pola obiektu jako dane strukturalne. W panelu
Workera, w **Observability**, filtruj pole `event` po wartości `honeypot_hit`,
a następnie grupuj i zliczaj wpisy po `path` lub `family`. To osobne zdarzenie
obok standardowego logu żądania — przy liczeniu używaj tylko zdarzeń
`honeypot_hit`, aby nie liczyć tego samego żądania dwa razy. Samo dopasowanie
ścieżki nie potwierdza tożsamości bota ani wykorzystania treści do treningu AI.

Ten dodatkowy wpis zawiera wyłącznie typ zdarzenia, znormalizowaną ścieżkę,
rodzinę sondy i metodę HTTP. Nie zawiera IP, User-Agenta, query ani body;
standardowe logi żądań Cloudflare zachowują swoją dotychczasową konfigurację.
Nie powstaje osobna baza ani plik z logami na Workerze. Zliczanie podlega
retencji, limitom i próbkowaniu Workers Logs; do odtworzenia dłuższej historii
trzeba zachować eksporty. Build obecnie generuje `observability.enabled: true`;
ustawienia faktycznie wdrożonego Workera można sprawdzić w panelu Cloudflare.

Testy dopasowań i wykluczeń: `npm run test:honeypots` (także w `npm run check`).

Dokumentacja: [Cloudflare Workers Logs](https://developers.cloudflare.com/workers/observability/logs/workers-logs/).

## Struktura projektu

- `app/(pl)/page.tsx` oraz `app/(en)/en/page.tsx` — indeksowalne wejścia językowe,
- `components/calendar-landing.tsx` — onepager i interakcje generatora,
- `lib/seo.ts`, `app/robots.ts` i `app/sitemap.ts` — metadata oraz indeksowanie,
- `app/globals.css` — layout, responsywność i styl strony,
- `components/calendar-page-svg.tsx` — render pojedynczej strony kalendarza,
- `components/calendar-year-timeline-svg.tsx` — przewijane podglądy całego roku
  w nagłówku, kartach pobierania i na blogu; wspólne oznaczenia i standardowe
  proporcje dni jak w PDF, bez podziału na A4,
- `components/calendar-hero-notes.tsx` — przykładowe odręczne plany PL/EN,
  zakotwiczone w datach i włączane wyłącznie w nagłówku przez `annotated`,
- `lib/calendar.ts` — daty, zakresy i presety,
- `lib/calendar-layout.ts` — geometria stron, pasków i dni,
- `lib/calendar-export.tsx` — generowanie SVG i PDF,
- `lib/translations.ts` — teksty polskie i angielskie,
- `public/brand` oraz `public/fonts` — lokalne zasoby.

Odręczne notatki używają lokalnego fontu
[Caveat](https://github.com/google/fonts/tree/main/ofl/caveat).
Licencja fontu znajduje się w `public/fonts/OFL-Caveat.txt`.

Wygenerowane katalogi `dist/`, `output/` i lokalne pliki środowiskowe są
ignorowane przez Git.
