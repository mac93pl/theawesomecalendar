/* eslint-disable nextjs/no-html-link-for-pages -- Global 404 has no client router; use full document navigation. */

import styles from './not-found-page.module.css';

export function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.sheet}>
        <a className={styles.brand} href="/">
          The Awesome Calendar
        </a>
        <div className={styles.timeline} aria-label="Błąd 404">
          <span>4</span>
          <span>0</span>
          <span>4</span>
        </div>
        <section lang="pl" aria-labelledby="not-found-pl">
          <p className={styles.eyebrow}>Ten adres wypadł z kalendarza</p>
          <h1 id="not-found-pl">Nie znaleziono strony.</h1>
          <p>
            Link może być nieaktualny albo w adresie jest literówka. Wróć na
            stronę główną i zaplanuj coś dobrego.
          </p>
          <p>
            <strong>
              The Awesome Calendar to darmowy kalendarz liniowy do druku.
            </strong>{' '}
            Pokazuje kolejne dni na jednej osi czasu, dzięki czemu łatwiej
            zobaczyć terminy i długość projektów. Wybierz gotowy kalendarz
            roczny lub własny zakres dat i pobierz PDF A4 bez zakładania konta.
            Wydrukuj kartki, wytnij paski i sklej je w ciągłą oś czasu.
          </p>
          <nav className={styles.actions} aria-label="Powrót do kalendarza">
            <a className={styles.primary} href="/">
              Przejdź na stronę główną <span aria-hidden="true">→</span>
            </a>
            <a href="/pl#generator">
              Utwórz własny kalendarz
            </a>
          </nav>
        </section>
        <section
          className={styles.english}
          lang="en"
          aria-labelledby="not-found-en"
        >
          <p className={styles.eyebrow}>English</p>
          <h2 id="not-found-en">This page couldn’t be found.</h2>
          <p>
            The link may be outdated or the address may contain a typo. The
            Awesome Calendar is a free printable linear calendar that puts
            consecutive days on one continuous timeline. Choose a ready-made
            yearly calendar or your own date range and download an A4 PDF
            without creating an account. Print the sheets, cut out the strips
            and join them together.
          </p>
          <a href="/en">
            Visit the English homepage <span aria-hidden="true">→</span>
          </a>
        </section>
      </div>
    </main>
  );
}
