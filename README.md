# The Awesome Calendar

Jednostronicowa strona z generatorem liniowego kalendarza do druku. Użytkownik wybiera zakres od 1 do 24 miesięcy i jeden z dwóch stylów, ogląda podgląd pierwszej strony, a następnie pobiera wielostronicowy PDF A4.

## Uruchomienie

Wymagany jest Node.js 22.13 lub nowszy.

    npm install
    npm run dev

Strona będzie dostępna pod adresem http://localhost:3000.

## Kontrola jakości

    npm run lint
    npm run build

## Jak to działa

- Cała aplikacja działa po stronie przeglądarki — bez backendu, bazy danych i kont użytkowników.
- PDF generuje się lokalnie przy użyciu pdf-lib i ma format A4 w poziomie.
- Na jednej stronie mieszczą się cztery miesiące; zakres 12 miesięcy daje trzy strony A4.
- Fonty i grafiki są częścią projektu, więc generator nie potrzebuje zewnętrznych usług.
- Sekcja dobrowolnego wsparcia jest celowo nieaktywna. Później można podpiąć Buy Me a Coffee, Ko-fi albo prosty link płatniczy bez przebudowy generatora.

## Najważniejsze pliki

- app/page.tsx — interfejs i interakcje onepagera.
- app/globals.css — kompletny responsywny layout.
- lib/calendar.ts — logika zakresów i miesięcy.
- lib/calendar-pdf.ts — skład oraz pobieranie PDF.
- public/brand — oryginalne grafiki projektu.
- public/fonts — lokalne fonty oraz ich licencje OFL.
