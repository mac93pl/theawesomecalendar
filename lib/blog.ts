import type { SiteLanguage } from '@/lib/calendar';

export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogSource = {
  label: string;
  url: string;
};

export type BlogArticle = {
  id: string;
  slug: string;
  date: string;
  title: string;
  lead: string;
  description: string;
  tags: string[];
  sections: BlogSection[];
  sources?: BlogSource[];
};

const montessoriPl: BlogArticle = {
  id: 'montessori-linear-calendar',
  slug: '2026-01-14-dlaczego-montessori-wybiera-kalendarz-liniowy',
  date: '2026-01-14',
  title:
    'Jaki kalendarz wybiera Montessori? Kalendarz liniowy to dobra propozycja.',
  lead: 'Kalendarz liniowy pomaga dziecku zobaczyć czas jako ciąg następujących po sobie dni. To prosty, konkretny obraz roku, który dobrze współgra z montessoriańskim porządkowaniem świata.',
  description:
    'Sprawdź, dlaczego kalendarz liniowy dobrze pasuje do edukacji Montessori i jak używać go z dzieckiem do rozmowy o dniach, miesiącach i planach.',
  tags: [
    'Montessori',
    'kalendarz liniowy',
    'nauka czasu',
    'planowanie z dzieckiem',
    'kalendarz dla dzieci',
  ],
  sections: [
    {
      heading: 'Czas, który można zobaczyć',
      paragraphs: [
        'Dla dorosłego zdanie „wakacje będą za trzy miesiące” jest dość czytelne. Dziecko może zrozumieć to zdanie, a mimo to nie mieć wyobrażenia odległości między „dzisiaj” a wyjazdem. Tradycyjny kalendarz dzieli rok na osobne kartki lub niewielkie kratki. Kalendarz liniowy robi coś innego: rozkłada kolejne dni obok siebie i pozwala śledzić drogę od teraz do wybranego wydarzenia.',
        'Taki układ zamienia abstrakcyjne pojęcie czasu w widoczny porządek. Wczoraj znajduje się przed dzisiaj, jutro tuż za nim, a kolejny miesiąc nie pojawia się nagle po przewróceniu strony. Dziecko może wskazać dzień palcem, policzyć odcinki, zaznaczyć urodziny i porównać, czy do świąt jest bliżej niż do wakacji.',
      ],
    },
    {
      heading: 'Dlaczego ten format pasuje do podejścia Montessori',
      paragraphs: [
        'W edukacji Montessori ważne są konkret, samodzielność i uporządkowane otoczenie. Dobrze przygotowana pomoc nie wyręcza dziecka, lecz pozwala mu samodzielnie zauważać zależności. Kalendarz liniowy może pełnić właśnie taką rolę: pokazuje jeden czytelny system, nie narzuca skomplikowanej instrukcji i daje się uzupełniać własnymi symbolami.',
        'Chociaż kalendarz liniowy nie jest obowiązkowym ani oficjalnie zdefiniowanym materiałem Montessori to jest narzędziem, które może wspierać montessoriańskie cele. Pomaga przechodzić od doświadczenia - „wakcje były dwa miesiące temu, kolejne będą za 8 miesiecy - jak to długo?" - do reprezentacji - zaznaczenia tego dnia na osi. Dzięki temu rozmowa o czasie opiera się na czymś, co dziecko widzi i czego może dotknąć.',
      ],
    },
    {
      heading: 'Jedna oś zamiast dwunastu osobnych obrazów',
      paragraphs: [
        'Największą zaletą formatu liniowego jest ciągłość. Koniec miesiąca nie przerywa opowieści o roku, a tygodnie zachowują tę samą skalę. Dziecko widzi, że siedem dni zawsze zajmuje podobny odcinek, miesiąc jest dłuższy od tygodnia, a rok składa się z wielu powtarzalnych fragmentów. Łatwiej też dostrzec pory roku oraz rytm zajęć, weekendów i rodzinnych wydarzeń.',
        'Widok całego roku wspiera przewidywanie. Można wspólnie zaznaczyć początek przedszkola, wizytę u dziadków albo dzień, w którym planujecie zasiać rzeżuchę. Potem zamiast odpowiadać po raz dziesiąty „jak długo jeszcze?”, rodzic może zaprosić dziecko do odszukania wydarzenia i sprawdzenia, ile drogi zostało.',
      ],
    },
    {
      heading: 'Jak przygotować kalendarz razem z dzieckiem',
      paragraphs: [
        'Najlepiej zacząć prosto. Wydrukuj kalendarz, sklej paski i zawieś je na wysokości dostępnej dla dziecka. Wybierz kilka oznaczeń: kropka może znaczyć dzień przedszkola, mały domek dzień wolny, a kolorowa kreska rodzinny wyjazd. Zbyt wiele symboli na początku zmieni czytelną oś w dekorację, którą trudno odczytać.',
        'Codzienny rytuał może trwać mniej niż minutę. Zaznaczcie mijający dzień, nazwijcie dzień tygodnia i spójrzcie na najbliższe wydarzenie. Starsze dziecko może samo prowadzić oś, dopisywać krótkie słowa lub mierzyć odległość między terminami. Młodszemu wystarczą kolory, naklejki albo proste rysunki.',
      ],
    },
    {
      heading: 'Kalendarz ma pomagać, a nie sprawdzać',
      paragraphs: [
        'Kalendarz nie powinien stawać się tablicą ocen zachowania ani kolejnym obowiązkiem wykonywanym dla dorosłego. Jego siłą jest neutralna informacja: pokazuje kolejność i odległość. Jeśli dziecko przez kilka dni nie chce go aktualizować, nic się nie dzieje. Można wrócić do osi przy następnym ważnym planie.',
        'Dobrze używany kalendarz liniowy daje rodzinie wspólny język czasu. Nie obiecuje, że dziecko natychmiast zrozumie rok, ale pozwala budować to rozumienie krok po kroku. Właśnie ta prostota, możliwość samodzielnej pracy i oparcie na konkrecie sprawiają, że wiele rodzin inspirujących się Montessori wybiera liniowy sposób pokazywania czasu.',
      ],
    },
  ],
};

const montessoriEn: BlogArticle = {
  id: 'montessori-linear-calendar',
  slug: '2026-01-14-why-montessori-chooses-a-linear-calendar',
  date: '2026-01-14',
  title:
    'Which calendar does Montessori choose? A linear calendar is a good option.',
  lead: 'A linear calendar helps a child see time as a sequence of days. It offers a simple, concrete picture of the year that fits naturally with the Montessori approach to ordering the world.',
  description:
    'Learn why a linear calendar fits Montessori education and how to use it with a child to talk about days, months and future plans.',
  tags: [
    'Montessori',
    'linear calendar',
    'learning about time',
    'planning with children',
    'calendar for kids',
  ],
  sections: [
    {
      heading: 'Time a child can see',
      paragraphs: [
        'For an adult, “the holiday is three months away” sounds reasonably precise. A child may understand that sentence and still have no sense of the distance between “today” and the trip. A conventional calendar divides the year into separate pages or small boxes. A linear calendar does something different: it places consecutive days next to one another and lets the child follow the path from now to a chosen event.',
        'The layout turns an abstract idea into a visible order. Yesterday sits before today, tomorrow follows it, and a new month does not suddenly appear when somebody flips a page. A child can point to a date, count sections, mark a birthday and compare whether Christmas or the summer holiday is closer.',
      ],
    },
    {
      heading: 'Why the format suits a Montessori approach',
      paragraphs: [
        'Montessori education values concrete experience, independence and an orderly environment. A well-prepared material does not do the thinking for a child; it makes a relationship clear enough for the child to discover. A linear calendar can play that role. It presents one consistent system, needs little explanation and can be completed with the child’s own symbols.',
        'Although a linear calendar is neither a compulsory nor an officially defined Montessori material, it is a tool that can support Montessori goals. It helps a child move from an experience - “the holidays were two months ago, the next will be in eight months - how long is that?” - to a representation - marking the dates on the timeline. The conversation about time is then grounded in something the child can see and touch.',
      ],
    },
    {
      heading: 'One timeline instead of twelve separate pictures',
      paragraphs: [
        'Continuity is the format’s greatest advantage. The end of a month does not interrupt the story of the year, and every week keeps the same scale. A child can see that seven days always occupy a similar section, that a month is longer than a week and that the year consists of many repeating parts. Seasons and the rhythm of school days, weekends and family events become easier to notice.',
        'A whole-year view also supports anticipation. Together you can mark the first day of nursery, a visit to grandparents or the day you plan to sow seeds. Instead of answering “how much longer?” for the tenth time, a parent can invite the child to find the event and see how much of the line remains.',
      ],
    },
    {
      heading: 'How to prepare the calendar together',
      paragraphs: [
        'Start simply. Print the calendar, join the strips and hang it at a height the child can reach. Choose only a few marks: a dot might mean a nursery day, a small house a day at home and a coloured line a family trip. Too many symbols at the beginning can turn a clear timeline into decoration that is difficult to read.',
        'A daily ritual can take less than a minute. Mark the day that has passed, name the weekday and look at the next event. An older child can maintain the timeline, add short notes or measure the distance between dates. Colours, stickers and simple drawings are enough for a younger child.',
      ],
    },
    {
      heading: 'A calendar should help, not test',
      paragraphs: [
        'The calendar should not become a behaviour scorecard or another task performed to please an adult. Its strength is neutral information: sequence and distance. If the child does not want to update it for a few days, nothing is lost. The family can return to the line when the next meaningful plan appears.',
        'Used well, a linear calendar gives a family a shared language for time. It will not make a child understand an entire year overnight, but it makes that understanding easier to build one step at a time. Its simplicity, independence and concrete form are exactly why many Montessori-inspired families choose a linear way to show time.',
      ],
    },
  ],
};

const bestCalendarPl: BlogArticle = {
  id: 'best-calendar',
  slug: '2026-02-03-jaki-jest-najlepszy-kalendarz',
  date: '2026-02-03',
  title: 'Jaki jest najlepszy kalendarz?',
  lead: 'Odważnie postawione pytanie w tytule nie ma dobrej odpowiedzi: nie istnieje jeden najlepszy kalendarz dla wszystkich. Dobry wybór zależy od tego, czy chcesz zapisywać szczegóły dnia, pilnować spotkań, czy zobaczyć cały rok jako jeden ciąg czasu. Do tego ostatniego zadania mamy najlepszą propozcyję: kalendarz liniowy.',
  description:
    'Jaki kalendarz wybrać: cyfrowy, książkowy, ścienny czy liniowy? Porównujemy zastosowania i pokazujemy, kiedy najlepiej sprawdza się oś całego roku.',
  tags: [
    'najlepszy kalendarz',
    'kalendarz liniowy',
    'planowanie roku',
    'kalendarz do druku',
    'organizacja czasu',
  ],
  sections: [
    {
      heading: 'Najlepszy, czyli najlepszy do czego?',
      paragraphs: [
        'Pytanie o najlepszy kalendarz brzmi jak pytanie o najlepsze buty. Inna para sprawdzi się na górskim szlaku, inna na ślubie, a jeszcze inna podczas codziennego spaceru. Z kalendarzem jest podobnie. Narzędzie, które świetnie przypomina o spotkaniu za piętnaście minut, nie musi dobrze pokazywać, jak blisko siebie leżą dwa duże projekty.',
        'Przed wyborem warto nazwać podstawowe zadanie. Czy potrzebujesz godzinowego planu dnia? Miejsca na notatki? Współdzielenia terminów z zespołem? A może perspektywy, w której styczeń, wakacje i grudzień są fragmentami tej samej osi? Dopiero wtedy można ocenić, który format jest naprawdę pomocny.',
      ],
    },
    {
      heading: 'Każdy format widzi inny kawałek czasu',
      paragraphs: [
        'Kalendarz cyfrowy wygrywa w przypomnieniach, cyklicznych spotkaniach i szybkiej zmianie terminów. Planer książkowy daje przestrzeń na szczegóły, listy zadań i spokojne myślenie na papierze. Klasyczny kalendarz ścienny dobrze pokazuje bieżący miesiąc i jest dostępny dla całego domu. Żadne z tych narzędzi nie jest z definicji lepsze - każde ustawia ostrość na innym poziomie.',
        'Problem pojawia się, gdy narzędzie pokazujące dzień próbujemy zmusić do planowania roku. Dwanaście ekranów albo dwanaście kartek nie daje jednoczesnego obrazu całości. Pamiętamy poszczególne daty, ale tracimy relacje między nimi: czas na przygotowanie, okresy spiętrzenia i puste miejsca, które można świadomie zostawić wolne.',
      ],
    },
    {
      heading: 'Co wnosi kalendarz liniowy',
      paragraphs: [
        'Kalendarz liniowy prezentuje czas w stałej kolejności i skali. Kolejne dni tworzą jeden pas, a miesiące nie są osobnymi planszami. Dzięki temu długość urlopu, projektu czy semestru staje się widoczna jako odcinek. Łatwiej porównać odległości i zauważyć, że dwa pozornie niezależne plany zajmują ten sam tydzień.',
        'Jego siłą jest szeroki kadr. Na jednej osi można zaznaczyć najważniejsze terminy, etapy i okresy odpoczynku, a szczegóły nadal prowadzić w telefonie, zeszycie lub aplikacji projektowej. Kalendarz liniowy uzupełnia te systemy.',
      ],
    },
    {
      heading: 'Najlepszy zestaw może składać się z dwóch narzędzi',
      paragraphs: [
        'Wiele osób nie potrzebuje jednego wszechstronnego planera, lecz różnych prostych perspektyw. Pierwsza odpowiada na pytanie „co robię dziś?” i może być cyfrowa. Druga odpowiada na pytanie „dokąd zmierza cały rok?” - tutaj dobrze działa fizyczna oś powieszona nad biurkiem lub na wspólnej ścianie.',
        'Taki podział zmniejsza presję, by w jednym miejscu przechowywać wszystko. Na osi zostają tylko informacje, które mają znaczenie w skali tygodni i miesięcy. Szczegółowa lista może się zmieniać codziennie, ale widok strategiczny pozostaje czytelny. To szczególnie przydatne przy długich projektach, roku szkolnym, przygotowaniach do ślubu albo planowaniu rodzinnych wyjazdów.',
      ],
    },
    {
      heading: 'Czy liniowy układ jest dla Ciebie',
      paragraphs: [
        'Wydrukuj jeden rok, sklej paski i zaznacz pięć do dziesięciu najważniejszych terminów. Dodaj okresy przygotowań oraz wolne okresy. Po tygodniu sprawdź, czy częściej dostrzegasz zależności, które wcześniej ginęły między kartkami lub ekranami.',
        'Najlepszy kalendarz to ten, który pomaga podejmować decyzje i którego naprawdę używasz. Jeżeli potrzebujesz szczegółów, wybierz narzędzie szczegółowe. Jeżeli chcesz zobaczyć czas w formacie ciągłej osi, wypróbuj kalendarz liniowy. Nie musi zastępować reszty - wystarczy, że pokaże to, czego inne formaty nie mieszczą w jednym spojrzeniu.',
      ],
    },
  ],
};

const linearCalendarExplainedPl: BlogArticle = {
  id: 'linear-calendar-explained',
  slug: '2026-03-12-kalendarz-liniowy-linearny-co-to-takiego',
  date: '2026-03-12',
  title: 'Kalendarz liniowy, linearny - co to takiego?',
  lead: 'Kalendarz liniowy układa dni, tygodnie i miesiące jeden za drugim na ciągłej osi. Zamiast dwunastu oddzielnych plansz otrzymujesz jeden widok, na którym od razu widać kolejność, odległość i długość wydarzeń.',
  description:
    'Wyjaśniamy, czym jest kalendarz liniowy lub linearny, jak wygląda, czym różni się od zwykłego kalendarza i do czego warto go używać.',
  tags: [
    'kalendarz liniowy',
    'kalendarz linearny',
    'oś czasu',
    'planowanie wizualne',
    'kalendarz roczny',
  ],
  sections: [
    {
      heading: 'Prosta definicja kalendarza liniowego',
      paragraphs: [
        'Kalendarz liniowy - nazywany też linearnym - to sposób przedstawienia czasu na jednej osi. Każdy dzień zajmuje kolejne miejsce, tygodnie następują po sobie, a granice miesięcy porządkują całość, ale jej nie rozrywają. Oś może biec poziomo lub pionowo. Najważniejsze jest zachowanie ciągłości i czytelnej skali.',
        'W wersji rocznej taki kalendarz przypomina długi pas. Początek roku znajduje się po jednej stronie, koniec po drugiej, a dzisiaj jest konkretnym punktem pomiędzy nimi. Wydarzenie jednodniowe można oznaczyć kreską lub symbolem. Urlop, projekt albo semestr zajmuje odcinek odpowiadający rzeczywistej liczbie dni.',
      ],
    },
    {
      heading: 'Czym różni się od zwykłego kalendarza',
      paragraphs: [
        'Najpopularniejszy kalendarz miesięczny korzysta z siatki tygodni. Jest kompaktowy i dobrze odpowiada na pytanie, w jaki dzień tygodnia wypada konkretna data. Płaci jednak za tę wygodę przerwami: po ostatnim dniu miesiąca przechodzimy do nowej kartki lub ekranu, a wizualna odległość między terminami przestaje być oczywista.',
        'Kalendarz liniowy zachowuje sąsiedztwo dni również na przełomie miesiąca i roku. Niedziela 31 maja oraz poniedziałek 1 czerwca pozostają obok siebie. To drobna zmiana, która wpływa na sposób myślenia. Zamiast zbioru osobnych miesięcy widzimy czas jako nieprzerwany zasób, w którym każde zadanie zajmuje miejsce.',
      ],
    },
    {
      heading: 'Do czego służy stała skala',
      paragraphs: [
        'Stała skala pozwala porównywać czas wzrokiem. Dwutygodniowy urlop jest krótszy niż sześciotygodniowy etap projektu, a przerwa między dwoma wydarzeniami może okazać się znacznie mniejsza, niż podpowiadała pamięć. Nie trzeba przeliczać kartek ani przesuwać widoku aplikacji - proporcje są częścią rysunku.',
        'To właśnie dlatego liniowe osie pojawiają się w edukacji, planowaniu projektów i organizacji rodzinnej. Nie pokazują wszystkiego. Pokazują za to bardzo dobrze kolejność, czas trwania, nakładanie się okresów oraz drogę od punktu startu do celu. Są mapą czasu, a nie szczegółową listą poleceń.',
      ],
    },
    {
      heading: 'Jak korzystać z kalendarza linearnego',
      paragraphs: [
        'Najpierw wybierz zakres. Może to być rok kalendarzowy, rok szkolny, czas trwania projektu albo okres od dzisiaj do ważnego wydarzenia. Następnie zaznacz terminy, których nie da się łatwo przesunąć: święta, podróże, egzaminy, starty i zakończenia. Dopiero później dodawaj etapy przygotowań.',
        'Warto ograniczyć liczbę kolorów i stworzyć krótką legendę. Jeden kolor może oznaczać pracę, drugi rodzinę, trzeci odpoczynek. Długie wydarzenia najlepiej rysować jako linie lub pola biegnące przez kilka dni. Pojedyncze terminy mogą pozostać punktami. Czytelność jest ważniejsza niż ozdobność.',
      ],
    },
    {
      heading: 'Papierowa oś jako drugi poziom planu',
      paragraphs: [
        'Fizyczny kalendarz liniowy nie musi konkurować z aplikacją. Powieszony w widocznym miejscu działa jak stały widok strategiczny, podczas gdy telefon przechowuje godziny spotkań i wysyła przypomnienia. Na papierze łatwo też dopisywać, skreślać i rozmawiać o planie z innymi osobami bez przekazywania urządzenia.',
        'Jeśli chcesz sprawdzić ten sposób myślenia, wystarczy drukarka A4, nożyczki i kilka minut na sklejenie pasków. Efektem nie jest kolejny planer do skrupulatnego wypełniania, lecz długa, prosta odpowiedź na pytanie: gdzie jesteśmy teraz i ile czasu dzieli nas od tego, co planujemy?',
      ],
    },
  ],
};

const planYearPl: BlogArticle = {
  id: 'plan-whole-year',
  slug: '2026-04-08-jak-zaplanowac-caly-rok-i-nie-zwariowac',
  date: '2026-04-08',
  title: 'Jak zaplanować cały rok i nie zwariować? Wybierz kalendarz liniowy',
  lead: 'Plan roku nie powinien być listą 365 idealnie wykorzystanych dni. Ma pomóc zobaczyć rytm pracy, odpoczynku i ważnych wydarzeń. Kalendarz liniowy ułatwia zbudowanie takiego planu bez ukrywania pustych miejsc i bez przeładowania szczegółami.',
  description:
    'Praktyczny sposób planowania całego roku na kalendarzu liniowym: ważne daty, etapy, bufory, odpoczynek i regularny przegląd planu.',
  tags: [
    'planowanie roku',
    'kalendarz liniowy',
    'plan roczny',
    'zarządzanie czasem',
    'work-life balance',
  ],
  sections: [
    {
      heading: 'Rok nie jest powiększonym dniem pracy',
      paragraphs: [
        'W planowaniu rocznym łatwo zastosować logikę listy zadań: dopisać cele, projekty, podróże, remont, naukę języka i jeszcze regularny odpoczynek. Taki plan szybko staje się katalogiem życzeń. Nie pokazuje, że wszystkie rzeczy korzystają z tego samego czasu oraz energii.',
        'Perspektywa roku wymaga mniej szczegółów, a więcej relacji. Najważniejsze są kolejność, długość i sąsiedztwo dużych spraw. Kalendarz liniowy pomaga, ponieważ zmusza każdy plan do zajęcia realnego odcinka. Gdy coś pojawia się na osi, widać także, co znajduje się przed nim, po nim i dokładnie w tym samym czasie.',
      ],
    },
    {
      heading: 'Zacznij od kotwic, których nie przesuniesz',
      paragraphs: [
        'Najpierw zaznacz terminy stałe: początek roku szkolnego, zamknięcia w pracy, rodzinne uroczystości, opłacone wyjazdy, egzaminy i wizyty. To kotwice planu. Nie oceniaj ich i jeszcze niczego nie optymalizuj. Chodzi o zobaczenie szkieletu roku takim, jaki naprawdę jest.',
        'Następnie zaznacz okresy przygotowań. Jeżeli wydarzenie wymaga trzech tygodni pracy, sama data finału jest myląca. Narysuj odcinek prowadzący do terminu. Dzięki temu majowy wyjazd nie będzie jednym punktem, lecz planem obejmującym rezerwacje, zakupy i spokojne zamknięcie bieżących obowiązków.',
      ],
    },
    {
      heading: 'Planuj odleglości i odcinki, nie tylko cele',
      paragraphs: [
        'Kiedy duże elementy są już widoczne, poszukaj miejsc, w których nakłada się kilka wymagających okresów. To ważniejszy etap niż dopisywanie kolejnych ambicji. Jeśli kwiecień zawiera finał projektu, przeprowadzkę i święta, problemem nie jest brak silnej woli. Problemem jest ograniczona pojemność miesiąca. Na kalendarzu liniowym zobaczysz to jako wyraźne zagęszczenie notatek i oznaczeń.',
        'W takim miejscu można wcześniej przesunąć zadanie, ograniczyć zakres albo poprosić o pomoc. Na osi warto też oznaczyć bufory: wolny weekend po podróży, tydzień bez nowego projektu lub kilka dni na nieprzewidziane sprawy. Puste pole niech będzie czasami przestrzenią, dzięki której plan wytrzyma kontakt z rzeczywistością.',
      ],
    },
    {
      heading: 'Użyj kilku warstw i bardzo małej legendy',
      paragraphs: [
        'Jedna linia może pomieścić różne obszary, jeśli oznaczenia są konsekwentne. Wybierz najwyżej trzy lub cztery kategorie, na przykład praca, rodzina, odpoczynek i rozwój. Użyj kolorów, symboli albo osobnych poziomów nad osią.',
        'Zapisuj tylko to, co zmienia obraz tygodnia lub miesiąca. Krótkie spotkanie pozostaje w telefonie. Dwutygodniowy etap, ferie dzieci, ważny deadline i urlop trafiają na oś. Taki filtr sprawia, że kalendarz pozostaje czytelny, a spojrzenie z kilku metrów nadal przynosi informację.',
      ],
    },
    {
      heading: 'Zobacz cały rok na pierwszy rzut oka.',
      paragraphs: [
        'Plan roczny ma być stabilnym tłem, nie kolejną tablicą wymagającą stałej obsługi. Raz w tygodniu wystarczy zaznaczyć mijający czas. Raz w miesiącu można sprawdzić najbliższy kwartał, przesunąć elastyczne elementy i dopisać nowe kotwice. Codzienne zadania nadal mogą żyć w bardziej szczegółowym systemie.',
      ],
    },
  ],
};

const weddingPlanningPl: BlogArticle = {
  id: 'wedding-planning',
  slug: '2026-05-16-planuje-wesele-excel-planer-czy-kalendarz-liniowy',
  date: '2026-05-16',
  title:
    'Jak zaplanować wesele - Excel, planer w zeszycie, a może... kalendarz liniowy?',
  lead: 'Excel dobrze liczy budżet, zeszyt zbiera pomysły, a kalendarz liniowy pokazuje drogę do dnia ślubu. Zamiast wybierać jedno narzędzie do wszystkiego, warto przydzielić każdemu z nich zadanie, które wykonuje najlepiej.',
  description:
    'Porównanie Excela, papierowego planera i kalendarza liniowego w organizacji wesela oraz prosty system łączący budżet, notatki i terminy.',
  tags: [
    'planowanie wesela',
    'kalendarz ślubny',
    'kalendarz liniowy',
    'planer weselny',
    'Excel wesele',
  ],
  sections: [
    {
      heading: 'Trzy narzędzia, trzy różne pytania',
      paragraphs: [
        'Organizacja wesela łączy liczby, decyzje, inspiracje i terminy. Nic dziwnego, że jedno narzędzie szybko staje się niewygodne. Arkusz kalkulacyjny chce konkrentych liczb, dat, cen. Zeszyt przyjmuje swobodne notatki, ale nie daje prostego obrazu całości. Kalendarz liniowy pokazuje kolejność. Próba zmieszczenia wszystkiego w jednym formacie zwykle kończy się albo przeładowaniem, albo pomijaniem ważnych informacji.',
        'Zamiast pytać „który planer jest najlepszy?”, lepiej zapytać: gdzie będziemy liczyć pieniądze, gdzie zbierać decyzje, a gdzie pilnować czasu? Jasny podział ogranicza dublowanie pracy. Każda informacja ma swoje podstawowe miejsce, a cały system nadal można zrozumieć bez skomplikowanej aplikacji.',
      ],
    },
    {
      heading: 'Excel: budżet, goście i porównania',
      paragraphs: [
        'Excel lub inny arkusz świetnie radzi sobie z listą gości, potwierdzeniami, kosztami i ofertami. Można filtrować dane, sumować wydatki oraz porównywać warianty. Jeśli cena sali albo liczba osób się zmienia, arkusz szybko przeliczy konsekwencje. W tych zadaniach papierowy planer będzie wolniejszy.',
        'Arkusz gorzej pokazuje jednak odległość w czasie. Kolumna z datą mówi, że umowę trzeba podpisać 20 czerwca, ale nie pokazuje intuicyjnie, ile tygodni zostało od degustacji do ostatecznej decyzji. Widok tabeli sprzyja zarządzaniu pozycjami, niekoniecznie rytmem całych przygotowań.',
      ],
    },
    {
      heading: 'Zeszyt: pomysły, rozmowy i decyzje',
      paragraphs: [
        'Planer w formie zeszytu dobrze przechowuje inspiracje, pytania do usługodawców, szkice ustawienia stołów i notatki z rozmów. Pozwala myśleć bez dopasowywania każdej myśli do komórki. Dla wielu par samo pisanie ręczne pomaga uporządkować wybory i oddzielić własne potrzeby od podpowiedzi otoczenia.',
        'Zeszyt ma jednak układ stron, a przygotowania dzieją się jednocześnie. Informacja o fotografie może znaleźć się kilkadziesiąt kartek od harmonogramu płatności. Dobry spis treści i zakładki pomagają, lecz nadal trudno jednym spojrzeniem ocenić, czy w tym samym miesiącu nie skumulowało się zbyt wiele decyzji.',
      ],
    },
    {
      heading: 'Kalendarz liniowy: droga do dnia ślubu',
      paragraphs: [
        'Na osi czasu data ślubu staje się wyraźnym punktem końcowym, a przygotowania dostają rzeczywistą długość. Można zaznaczyć rezerwację miejsca, wysłanie zaproszeń, terminy płatności, przymiarki, spotkania i wolne tygodnie. Długie zadania - na przykład wybór oprawy muzycznej - warto narysować jako odcinki, nie pojedyncze deadline’y.',
        'Liniowy widok pozwala także cofać się od finału. Jeśli druk zaproszeń wymaga czasu, a wcześniej trzeba zamknąć listę i projekt, kolejne etapy naturalnie układają się wstecz. Od razu widać, kiedy decyzja musi się naprawdę rozpocząć, a nie tylko kiedy powinna być gotowa.',
      ],
    },
    {
      heading: 'Prosty system dla pary',
      paragraphs: [
        'Najpraktyczniejszy zestaw może wyglądać tak: budżet i lista gości w arkuszu, pomysły i ustalenia w zeszycie, a główne terminy na wydrukowanej osi. Na kalendarzu dopisz krótkie odwołania, na przykład „budżet: arkusz, wiersz sala”, zamiast przepisywać kwoty. Dzięki temu każde narzędzie zachowuje czytelność.',
        'Powieście oś w miejscu, które oboje regularnie widzicie. Sprawdźcie najbliższy miesiąc, wybierzcie kilka realnych działań i zostawcie wolne okresy. Dobre planowanie wesela ma sprawić, że wiadomo, co jest teraz, co później i kiedy można spokojnie odpocząć.',
      ],
    },
  ],
};

const projectManagementPl: BlogArticle = {
  id: 'physical-project-management',
  slug: '2026-06-23-zarzadzanie-projektem-kalendarz-fizyczny',
  date: '2026-06-23',
  title: 'Zarządzanie projektem - kalendarz fizyczny może być dobrym wyborem',
  lead: 'Aplikacja projektowa przechowuje zadania, ale fizyczny kalendarz może lepiej utrzymywać wspólny obraz czasu. Długi, liniowy plan na ścianie pomaga zespołowi widzieć etapy, zależności i zbliżające się spiętrzenia bez otwierania kolejnej zakładki.',
  description:
    'Jak wykorzystać fizyczny kalendarz liniowy w zarządzaniu projektem: kamienie milowe, etapy, bufory, odpowiedzialność i współpraca z narzędziami cyfrowymi.',
  tags: [
    'zarządzanie projektem',
    'kalendarz projektowy',
    'kalendarz fizyczny',
    'oś czasu projektu',
    'planowanie zespołu',
  ],
  sections: [
    {
      heading: 'Stare, dobre, papierowowe, widoczne.',
      paragraphs: [
        'Zespoły pracują w rozbudowanych systemach, a mimo to podczas spotkania ktoś pyta, ile czasu zostało do wdrożenia. Problemem zwykle nie jest brak danych. Problemem jest brak wspólnego obrazu, który da się odczytać w kilka sekund. Informacje są poprawne, ale ukryte w widokach, filtrach i powiadomieniach.',
        'Fizyczny kalendarz może pełnić funkcję stałej mapy projektu. Powieszony w przestrzeni zespołu przypomina o kolejności etapów również wtedy, gdy nikt aktywnie go nie sprawdza. Czas w fomrmie ograniczonego odcinka wymusza wybór tego, co naprawdę ma znaczenie w skali całego przedsięwzięcia.',
      ],
    },
    {
      heading: 'Co warto przenieść na oś projektu',
      paragraphs: [
        'Na liniowym kalendarzu powinny znaleźć się daty graniczne, kamienie milowe, fazy pracy, decyzje blokujące oraz okresy ograniczonej dostępności. Nie wpisuj każdego zadania. Jeśli informacja nie zmienia obrazu tygodnia albo nie wpływa na inną osobę, prawdopodobnie lepiej zostawić ją w rozwiązaniu cyfrowym.',
        'Etapy rysuj jako odcinki, a pojedyncze decyzje jako punkty. Zależność można pokazać prostą kolejnością: badania kończą się przed projektem, projekt przed produkcją, a produkcja przed testami. Gdy dwa odcinki niebezpiecznie się nakładają, zespół widzi ryzyko wcześniej niż w tabeli z osobnymi datami końcowymi.',
      ],
    },
    {
      heading: 'Ściana tworzy wspólną perspektywę',
      paragraphs: [
        'Duża, dostępna oś dobrze działa podczas krótkiego przeglądu. Zespół może stanąć obok niej, wskazać aktualny tydzień i omówić trzy najważniejsze zmiany. Rozmowa pozostaje zakotwiczona w tym samym obrazie. Nie trzeba udostępniać ekranu ani czekać, aż każdy otworzy właściwą aplikację.',
        'Fizyczna obecność planu sprzyja także przypadkowym, ale wartościowym obserwacjom. Osoba przechodząca obok może zauważyć, że planowany urlop pokrywa się z testami albo że dwa zespoły oczekują tej samej decyzji w różnych terminach. Widok staje się częścią środowiska pracy, a nie dokumentem oglądanym wyłącznie na spotkaniu statusowym.',
      ],
    },
    {
      heading: 'Aktualizacje muszą mieć właściciela',
      paragraphs: [
        'Papierowy plan traci zaufanie natychmiast, gdy przestaje być aktualny. Ustal jedną osobę odpowiedzialną za nanoszenie zmian albo prosty rytuał zespołowy, na przykład aktualizację po cotygodniowym przeglądzie. Przy każdej zmianie warto równocześnie poprawić system cyfrowy i oś.',
        'Nie przerysowuj całego kalendarza z powodu jednego przesunięcia. Samoprzylepne znaczniki, ołówek i czytelne skreślenia są częścią narzędzia. Oś ma pokazywać aktualną najlepszą wiedzę, a nie udawać idealny plan. Widoczne korekty mogą wręcz pomagać zespołowi zrozumieć, jak projekt ewoluuje.',
      ],
    },
    {
      heading: 'Najlepszy bywa układ hybrydowy',
      paragraphs: [
        'Aplikacja nadal odpowiada za szczegóły, komentarze, pliki, odpowiedzialność i automatyczne przypomnienia. Kalendarz fizyczny odpowiada za wspólną orientację. Łącznikiem mogą być nazwy etapów lub krótkie identyfikatory. Nie trzeba przepisywać pełnych opisów z jednego miejsca do drugiego.',
        'Taki układ sprawdza się szczególnie w projektach trwających wiele tygodni, realizowanych przez kilka osób i zależnych od decyzji w konkretnych terminach. Jeśli projekt jest jednodniowy albo zespół pracuje wyłącznie asynchronicznie w różnych strefach czasowych, papier może wnosić mniej. Dobry wybór zależy od pracy, ale fizycznej osi nie warto odrzucać tylko dlatego, że jest analogowa.',
      ],
    },
  ],
};

const multipleChildrenPl: BlogArticle = {
  id: 'planning-multiple-children',
  slug: '2026-08-11-mama-dwojki-trojki-czworki-dzieci-jak-planowac',
  date: '2026-08-11',
  title:
    'Mama dwójki, trójki, czwórki dzieci - jak nie zwariować z planowaniem?',
  lead: 'Przy kilkorgu dzieciach problemem nie jest tylko liczba terminów, lecz ich nakładanie się. Wydrukuj osobną linię czasu dla każdego dziecka, ustaw wszystkie w tej samej skali i śledź plany równolegle - bez wciskania całej rodziny w jedną przeładowaną kratkę.',
  description:
    'System planowania dla rodziny z dwojgiem, trojgiem lub czworgiem dzieci: osobne kalendarze liniowe, wspólna skala, kolory, przegląd tygodnia i podział opieki.',
  tags: [
    'planowanie rodzinne',
    'kalendarz dla mamy',
    'kalendarz dla dzieci',
    'organizacja rodziny',
    'kalendarz liniowy',
  ],
  sections: [
    {
      heading: 'To nie brak organizacji, tylko dużo równoległych planów',
      paragraphs: [
        'Jedno dziecko ma wycieczkę, drugie wizytę, trzecie trening, a w tym samym tygodniu trzeba pamiętać o stroju na przedstawienie. Nawet świetna pamięć zaczyna działać jak zatłoczona skrzynka odbiorcza. Wiele rodzin próbuje rozwiązać ten problem, dopisując wszystko do jednego kalendarza miesięcznego. Po chwili każda kratka zawiera kilka skrótów i kolorów.',
        'Trudność wynika z tego, że kilka osobnych harmonogramów spotyka się w jednym domu. Potrzebny jest widok, który zachowa tożsamość każdego planu, a jednocześnie pozwoli porównać je obok siebie. Tu pomocny staje się zestaw równoległych kalendarzy liniowych.',
      ],
    },
    {
      heading: 'Wydrukuj tyle osi, ile potrzebujesz',
      paragraphs: [
        'Dla dwojga dzieci przygotuj dwa kalendarze, dla trojga trzy, a dla czworga cztery. Każdy powinien obejmować ten sam zakres i mieć identyczną skalę. Powieś osie jedna pod drugą, wyrównując początki miesięcy. Dzięki temu ten sam dzień tworzy pionową kolumnę przez wszystkie plany.',
        'Podpisz każdą linię imieniem lub prostym symbolem. Dzieci mogą wybrać własny kolor, ale nie musisz kodować kolorem każdego rodzaju wydarzenia. Gdy każda osoba ma osobny pas, sam układ wykonuje część pracy. Kolor służy identyfikacji, a nie ratowaniu nieczytelnej, wspólnej kratki.',
      ],
    },
    {
      heading: 'Nakładanie się terminów widać od razu',
      paragraphs: [
        'Największa korzyść pojawia się przy porównywaniu. Jeśli wycieczka jednego dziecka, zawody drugiego i zebranie trzeciego wypadają tego samego dnia, znaczniki układają się pionowo. Rodzina może wcześniej zdecydować, kto odpowiada za transport, czy potrzebna jest pomoc bliskiej osoby i czego nie da się połączyć.',
        'Oś pokazuje także dłuższe okresy: ferie, półkolonie, tygodnie egzaminów, rehabilitację albo serię treningów. Zamiast trzech pojedynczych dat w telefonie widać zajęty fragment miesiąca. To pomaga planować własną pracę rodziców, urlopy i chwile, w których rodzina potrzebuje mniej dodatkowych zobowiązań.',
      ],
    },
    {
      heading: 'Dodaj jedną linię wspólną dla domu',
      paragraphs: [
        'Dobra propozycja: pod osiami dzieci warto umieścić jeszcze jeden pas - rodzinny. Trafiają na niego wspólne wyjazdy, święta, wizyty gości, terminy administracyjne i urlopy rodziców. Nie duplikuj tych informacji na każdym kalendarzu, jeśli dotyczą wszystkich. Wspólna linia utrzymuje porządek i pokazuje kontekst.',
      ],
    },
    {
      heading: 'Krótki rodzinny przegląd zamiast ciągłego przypominania',
      paragraphs: [
        'Raz w tygodniu spójrzcie razem na najbliższe siedem lub czternaście dni. Starsze dzieci mogą same dodać wydarzenia albo przesunąć znaczniki. Młodsze mogą znaleźć swoje symbole i opowiedzieć, co nadchodzi. Taki rytuał rozkłada odpowiedzialność i sprawia, że plan nie mieszka wyłącznie w głowie jednej osoby.',
        'Nie chodzi o perfekcyjne kontrolowanie każdego dnia. Chodzi o zmniejszenie liczby niespodzianek oraz decyzji podejmowanych w ostatniej chwili. Dwie, trzy lub cztery równoległe osie zajmują więcej miejsca na ścianie niż jeden kalendarz, ale oddają rodzinie znacznie więcej przestrzeni w głowie. Przy wielu dzieciach to bardzo uczciwa wymiana.',
      ],
    },
  ],
};

const freeCalendar2027Pl: BlogArticle = {
  id: 'free-calendar-2027',
  slug: '2026-08-27-darmowy-kalendarz-2027-do-druku-kalendarz-liniowy',
  date: '2026-08-27',
  title: 'Darmowy kalendarz 2027 do druku - warto wybrać kalendarz liniowy!',
  lead: 'Darmowy kalendarz 2027 do druku może być czymś więcej niż zestawem dwunastu kartek. W układzie liniowym cały rok tworzy jedną oś, dlatego łatwiej zobaczyć odległość między planami, długość ważnych okresów i miejsce, które naprawdę pozostało wolne.',
  description:
    'Pobierz darmowy kalendarz 2027 do druku i sprawdź, dlaczego liniowy układ całego roku pomaga planować urlopy, projekty i rodzinne wydarzenia.',
  tags: [
    'darmowy kalendarz 2027',
    'kalendarz 2027 do druku',
    'kalendarz liniowy 2027',
    'planer roczny 2027',
    'kalendarz PDF',
  ],
  sections: [
    {
      heading: 'Kalendarz 2027, który pokazuje cały rok',
      paragraphs: [
        'Klasyczny kalendarz do druku zwykle dzieli rok na dwanaście osobnych plansz. To wygodne, gdy trzeba sprawdzić dzień tygodnia albo zapisać spotkanie. Trudniej jednak porównać wydarzenia oddalone o kilka miesięcy. Styczeń znika z pola widzenia, gdy patrzymy na maj, a koniec jednego miesiąca wydaje się odległy od początku następnego.',
        'Kalendarz liniowy 2027 układa dni w stałej kolejności na jednej osi. Wszystkie tygodnie zachowują podobną skalę, a granice miesięcy porządkują widok, zamiast go przerywać. Dzięki temu roczny plan staje się mapą czasu: można zobaczyć, gdzie jesteśmy, co nadchodzi i jak dużo miejsca zajmuje każde zobowiązanie.',
      ],
    },
    {
      heading: 'Dlatego warto wybrać The Awesome Calendar',
      paragraphs: [
        'Nowy sposób planowania najlepiej najpierw sprawdzić bez kupowania kolejnego planera. Pobierz darmowy plik PDF, wydrukuj go na zwykłych kartkach A4 i połącz pasy zgodnie z układem. Już kilka ważnych dat wystarczy, aby ocenić, czy widok całego roku pomaga lepiej niż kolejne strony w zeszycie.',
        'Darmowy format pozwala też swobodnie eksperymentować. Jeden egzemplarz może służyć rodzinie, drugi projektowi, a trzeci planowaniu urlopów. Jeśli pierwszy sposób oznaczania okaże się nieczytelny, można wydrukować świeżą kopię i uprościć legendę bez poczucia, że drogi planer został zmarnowany.',
      ],
    },
    {
      heading: 'Co zaznaczyć na osi 2027',
      paragraphs: [
        'Najpierw wpisz daty, których nie można łatwo przesunąć: święta, ferie, zaplanowane wyjazdy, egzaminy, wydarzenia rodzinne i terminy zawodowe. Potem dodaj okresy przygotowań. Wakacje to nie tylko dzień wyjazdu, lecz także czas na rezerwacje, dokumenty i spokojne zamknięcie obowiązków przed podróżą.',
        'Długie wydarzenia rysuj jako odcinki, a pojedyncze terminy jako punkty. Wybierz maksymalnie trzy lub cztery kolory i nadaj im stałe znaczenie. Kalendarz ma być czytelny z niewielkiej odległości, dlatego nie trzeba przenosić na niego każdej godziny i każdego zadania z telefonu.',
      ],
    },
    {
      heading: 'Papier i telefon mogą działać razem',
      paragraphs: [
        'Wydrukowany kalendarz 2027 nie musi zastępować aplikacji. Telefon dobrze pilnuje dokładnych godzin, adresów i przypomnień. Oś na ścianie odpowiada na inne pytania: które tygodnie są już zajęte, kiedy zaczyna się spokojniejszy okres i czy nowy plan nie koliduje z tym, co zostało ustalone wcześniej.',
        'Najlepszy kalendarz to ten, do którego rzeczywiście wracasz. Liniowy układ warto wybrać, jeśli potrzebujesz szerokiego kadru i chcesz podejmować decyzje w perspektywie całego roku. Darmowy kalendarz do druku daje prosty sposób, by zacząć planowanie 2027 bez abonamentu, rejestracji i rozbudowanego systemu.',
      ],
    },
  ],
};

const schoolCalendarPl: BlogArticle = {
  id: 'school-calendar-2026-2027',
  slug: '2026-07-18-kalendarz-szkolny-2026-2027-caly-rok-na-jednej-osi',
  date: '2026-07-18',
  title:
    'Kalendarz szkolny 2026/2027 może być super: cały rok szkolny w jednej osi',
  lead: 'Rok szkolny nie mieści się wygodnie ani w jednym roku kalendarzowym, ani na jednej stronie miesięcznego planera. Kalendarz liniowy 2026/2027 pokazuje okres od początku nauki do wakacji jako jedną, nieprzerwaną drogę.',
  description:
    'Zaplanuj rok szkolny 2026/2027 na jednej osi czasu. Zobacz semestry, przerwy, egzaminy, projekty i rodzinne obowiązki w jednym czytelnym widoku.',
  tags: [
    'kalendarz szkolny 2026/2027',
    'kalendarz roku szkolnego',
    'planer dla ucznia',
    'organizacja nauki',
    'kalendarz liniowy',
  ],
  sections: [
    {
      heading: 'Rok szkolny potrzebuje własnego zakresu',
      paragraphs: [
        'Plan od września do czerwca przecina granicę dwóch lat kalendarzowych. W grudniu kończy się jedna kartka roczna, ale nauka, zajęcia i projekty trwają dalej. Gdy plan zostaje rozdzielony, łatwo potraktować styczeń jak zupełnie nowy początek i stracić z oczu zadania rozpoczęte jesienią.',
        'Liniowy kalendarz szkolny 2026/2027 może zacząć się pod koniec wakacji i kończyć po ostatnich szkolnych wydarzeniach. Wrzesień, ferie, wiosenne egzaminy i czerwiec pozostają częścią tej samej osi. Widać nie tylko daty, lecz także proporcje między okresami nauki i odpoczynku.',
      ],
    },
    {
      heading: 'Co wpisać na początku roku',
      paragraphs: [
        'Zacznij od terminów wspólnych dla szkoły: rozpoczęcia i zakończenia zajęć, przerw świątecznych, ferii oraz dni wolnych znanych rodzinie. Dokładne daty najlepiej przepisać z oficjalnych informacji szkoły i właściwego kalendarza oświatowego, ponieważ wydarzenia lokalne mogą różnić się między placówkami.',
      ],
    },
    {
      heading: 'Od terminu do realnego czasu na naukę',
      paragraphs: [
        'Sama data sprawdzianu niewiele mówi o przygotowaniu. Na osi można zaznaczyć również tydzień lub dwa, które prowadzą do tego dnia. Dłuższy projekt szkolny powinien wyglądać jak odcinek, a nie pojedyncza kropka na końcu. Uczeń widzi wtedy, kiedy zacząć i z czym zadanie będzie się nakładało.',
        'Taki widok pomaga też rozsądnie rozłożyć intensywność. Jeśli kilka zaliczeń i wydarzeń pojawia się blisko siebie, wcześniej można ograniczyć dodatkowe plany, rozpocząć pracę etapami albo poprosić o pomoc.',
      ],
    },
    {
      heading: 'Jedna oś dla ucznia i rodziny',
      paragraphs: [
        'Dziecko może używać symboli i kolorów, dopisywać nazwy przedmiotów i krótkie etapy. Rodzic może poniżej dodać wspólną linię z urlopami, wyjazdami i ważnymi terminami domowymi. Dzięki tej samej skali od razu widać, czy rodzinny plan nie wpada w środek intensywnego okresu szkolnego.',
        'Kalendarz szkolny na jednej osi jest prostym tłem dla cotygodniowej rozmowy. Wystarczy zaznaczyć mijający tydzień i spojrzeć na kolejny miesiąc. Cały rok nie musi być zaplanowany szczegółowo od pierwszego dnia. Ważne, że jego kształt pozostaje widoczny i można go aktualizować bez przewracania wielu stron.',
      ],
    },
  ],
};

const printableGanttPl: BlogArticle = {
  id: 'printable-gantt-chart',
  slug: '2026-05-31-wykres-gantta-do-wydrukowania-kalendarz-liniowy',
  date: '2026-05-31',
  title:
    'Wykres Gantta do wydrukowania - kalendarz liniowy to prosta i szybka propozycja',
  lead: 'Nie każdy projekt potrzebuje rozbudowanego programu do harmonogramów. Wydrukowany kalendarz liniowy może działać jak wykres Gantta: pokazuje etapy jako odcinki, terminy jako punkty i zależności w jednej skali czasu.',
  description:
    'Prosty wykres Gantta - kalendarz liniowy. Zobacz, jak rozpisać etapy, terminy, zależności i bufory projektu.',
  tags: [
    'wykres Gantta do druku',
    'kalendarz projektowy',
    'harmonogram projektu',
    'plan projektu',
    'kalendarz liniowy',
  ],
  sections: [
    {
      heading: 'Co wykres Gantta ma pokazać',
      paragraphs: [
        'Wykres Gantta porządkuje pracę na osi czasu. Zadania lub etapy są przedstawiane jako poziome odcinki, więc można porównać ich długość, kolejność i nakładanie się. W rozbudowanym projekcie oprogramowanie liczy zależności i zasoby, ale w mniejszym przedsięwzięciu często potrzebny jest przede wszystkim czytelny obraz najbliższych tygodni.',
        'Kalendarz liniowy dostarcza gotową skalę dat. Wystarczy dodać kilka wierszy pod osią i narysować na nich fazy projektu. Powstaje papierowy harmonogram podobny do prostego Gantta, bez konfiguracji konta, uczenia się aplikacji i ustawiania wielu pól, których niewielki zespół może wcale nie potrzebować.',
      ],
    },
    {
      heading: 'Jak przygotować wersję do wydrukowania',
      paragraphs: [
        'Najpierw wybierz zakres obejmujący cały projekt oraz niewielki zapas przed startem i po zakończeniu. Wypisz od czterech do ośmiu głównych etapów, na przykład badania, projekt, produkcję, testy i wdrożenie. Każdy etap otrzymuje osobny wiersz oraz odcinek od planowanego początku do końca.',
        'Kamienie milowe zaznacz innym symbolem niż zadania. Strzałki lub krótkie notatki mogą pokazać najważniejsze zależności, ale nie rysuj całej sieci połączeń, jeśli przestaje być czytelna. Celem wydruku jest szybka orientacja. Szczegółowe zadania, komentarze i pliki nadal mogą pozostać w cyfrowym narzędziu.',
      ],
    },
    {
      heading: 'Zostaw miejsce na prawdziwe życie projektu',
      paragraphs: [
        'Papierowy harmonogram szybko ujawnia plan wypełniony od brzegu do brzegu. Jeżeli jedna faza kończy się dokładnie w dniu rozpoczęcia kolejnej, nawet niewielkie opóźnienie przesuwa całość. Dodaj bufory przy pracy zależnej od akceptacji, dostawy, osoby zewnętrznej albo terminu, na który zespół ma ograniczony wpływ.',
        'Warto też zaznaczyć urlopy, święta i okresy mniejszej dostępności - zmieniają realną przepustowość zespołu. Prosty wykres ma pomagać podejmować decyzje, dlatego powinien pokazywać warunki pracy.',
      ],
    },
    {
      heading: 'Kiedy papier wystarczy, a kiedy nie',
      paragraphs: [
        'Wydrukowany Gantt dobrze sprawdza się przy jednym projekcie, kilku osobach i ograniczonej liczbie zależności. Można go powiesić w pracowni, biurze lub domu i omawiać podczas krótkiego przeglądu. Zmiany nanosi się ołówkiem lub samoprzylepnymi paskami, a aktualny tydzień zaznacza wyraźną linią.',
        'Przy setkach zadań, automatycznym bilansowaniu zasobów i wielu zespołach potrzebne będzie specjalistyczne narzędzie. Kalendarz liniowy nadal może pełnić rolę uproszczonego widoku zarządczego. Nie konkuruje wtedy z systemem, lecz wyciąga z niego najważniejszy rytm projektu i pokazuje go w formie dostępnej jednym spojrzeniem.',
      ],
    },
  ],
};

const contentCalendarPl: BlogArticle = {
  id: 'annual-content-calendar',
  slug: '2026-04-27-roczny-content-calendar-dla-malej-firmy-i-freelancera',
  date: '2026-04-27',
  title: 'Roczny content calendar dla małej firmy i freelancera',
  lead: 'Roczny content calendar pomaga przestać wymyślać komunikację od zera w każdy poniedziałek. Na jednej osi można rozłożyć kampanie, sezonowe tematy, premiery i spokojniejsze okresy, a szczegóły pojedynczych publikacji zostawić w prostym arkuszu lub aplikacji.',
  description:
    'Jak stworzyć roczny content calendar dla małej firmy lub freelancera: filary treści, kampanie, częstotliwość, bufory i kalendarz liniowy.',
  tags: [
    'content calendar',
    'kalendarz treści',
    'marketing małej firmy',
    'planowanie social media',
    'kalendarz dla freelancera',
  ],
  sections: [
    {
      heading: 'Najpierw zobacz rytm roku',
      paragraphs: [
        'Rozumiemy to: mała firma rzadko ma osobny zespół do każdej kampanii. Ta sama osoba obsługuje klientów, tworzy ofertę, publikuje treści i pilnuje sprzedaży. Planowanie wyłącznie tydzień po tygodniu sprawia, że ważne sezony pojawiają się za późno, a komunikacja konkuruje z najbardziej intensywną pracą operacyjną.',
        'Roczna oś pozwala zacząć od szerokiego kadru. Zaznacz okresy ważne dla klientów, planowane premiery, wydarzenia branżowe, urlopy i miesiące o większym obciążeniu. Dzięki temu widać, kiedy treść powinna przygotować odbiorców do oferty, a kiedy lepiej ograniczyć częstotliwość i wykorzystać materiały evergreen.',
      ],
    },
    {
      heading: 'Zbuduj plan z kilku filarów treści',
      paragraphs: [
        'Wybierz trzy do pięciu tematów, które łączą potrzeby odbiorców z Twoją wiedzą i ofertą. Freelancer projektant może mówić o procesie współpracy, przygotowaniu materiałów, decyzjach wizualnych i efektach projektów. Mały sklep może łączyć poradniki, zastosowania produktów, kulisy i treści sezonowe.',
      ],
    },
    {
      heading: 'Planuj kampanie jako odcinki, nie pojedyncze posty',
      paragraphs: [
        'Premiera produktu albo nabór klientów nie zaczyna się w dniu publikacji oferty. Na osi zaznacz czas przygotowania, edukacji odbiorców, głównej komunikacji i podsumowania. Kampania nabiera odpowiedniej perspektywy: staje się odcinkiem z kilkoma fazami.',
        'Ten sposób pomaga ocenić, czy dwie kampanie nie walczą o uwagę w tym samym tygodniu. Pokazuje też czas potrzebny na napisanie, projekt, akceptację i ponowne wykorzystanie materiału. Jeden dobry artykuł może później zasilić newsletter oraz kilka krótszych publikacji, jeśli w planie przewidziano przestrzeń na adaptację.',
      ],
    },
    {
      heading: 'Realna regularność wygrywa z idealnym planem',
      paragraphs: [
        'Content calendar ma zmniejszać presję. Wybierz częstotliwość możliwą do utrzymania także w tygodniach pełnych pracy dla klientów. Lepiej publikować jeden przemyślany materiał co dwa tygodnie niż zaplanować pięć kanałów i zrezygnować z nich po miesiącu.',
        'Raz w miesiącu przejrzyj kolejne osiem do dwunastu tygodni. Przesuń treści, które straciły znaczenie, dodaj pomysły wynikające z pytań klientów i pozostaw trochę wolnego miejsca. Roczna oś daje kierunek, a krótszy przegląd pozwala reagować. Dla małej firmy i freelancera właśnie taki lekki system bywa najbardziej użyteczny.',
      ],
    },
  ],
};

const monthlyPlanningPl: BlogArticle = {
  id: 'plan-next-month',
  slug: '2026-03-03-plan-na-najblizszy-miesiac-co-warto-uzyc',
  date: '2026-03-03',
  title: 'Potrzebuję rozpisać plan na najbliższy miesiąc, co warto użyć?',
  lead: 'Do planu miesiąca nie potrzebujesz najbardziej rozbudowanej aplikacji. Najpierw zdecyduj, czy ważniejsze są godziny, lista zadań czy kolejność kilku etapów. Jeśli chcesz zobaczyć wszystkie dni w jednej skali, miesięczna oś czasu będzie prostym punktem startu.',
  description:
    'Jak rozpisać plan na najbliższy miesiąc: wybór między kalendarzem cyfrowym, listą zadań, planerem i liniową osią czasu.',
  tags: [
    'plan miesiąca',
    'planowanie miesięczne',
    'kalendarz miesięczny',
    'organizacja czasu',
    'oś czasu',
  ],
  sections: [
    {
      heading: 'Wybierz narzędzie według rodzaju planu',
      paragraphs: [
        'Jeśli miesiąc składa się głównie ze spotkań o określonych godzinach, najlepiej sprawdzi się kalendarz cyfrowy z przypomnieniami. Jeśli potrzebujesz wykonać wiele drobnych czynności bez sztywnych dat, wygodniejsza będzie lista zadań. Planer papierowy daje miejsce na notatki i codzienne priorytety.',
        'Liniowy kalendarz odpowiada na inne pytanie: jak kolejne dni łączą się w całość? Przydaje się, gdy plan zawiera kilka etapów, okres przygotowania, ważny termin i czas odpoczynku. Nie trzeba wybierać jednego narzędzia na zawsze. Miesiąc może mieć szeroki widok na osi oraz szczegóły zapisane w telefonie.',
      ],
    },
    {
      heading: 'Rozpisz stałe punkty i dostępny czas',
      paragraphs: [
        'Na początku zaznacz wydarzenia, których nie możesz przesunąć: wizyty, podróże, terminy oddania, dni wolne i zobowiązania rodzinne. Dopiero później dodawaj własne zadania. Taka kolejność chroni przed planem, który ignoruje połowę życia i zakłada pełną produktywność każdego dnia.',
        'Spójrz na wolne odcinki między stałymi punktami. Nie każdy jest rzeczywiście dostępny. Po podróży możesz potrzebować spokojniejszego dnia, a duże zadanie wymaga czasu bez kilku równoległych zobowiązań. Na osi łatwo odróżnić pustą kratkę od okresu, który ma realną przestrzeń na nową pracę.',
      ],
    },
    {
      heading: 'Duże zadania zamień w krótkie odcinki',
      paragraphs: [
        'Zadanie „przygotować portfolio” albo „zaplanować remont” jest zbyt duże, by umieścić je w jednym dniu. Podziel je na kilka widocznych etapów: zebranie materiałów, wybór, wykonanie, konsultację i poprawki. Każdy etap zajmuje fragment miesiąca i prowadzi do konkretnego rezultatu.',
        'Nie rozpisuj jednak każdej czynności na osi. Szczegóły mogą trafić na dzienną listę. Widok miesięczny powinien pokazywać rytm oraz kolejność. Jeśli kilka dużych odcinków nachodzi na siebie, zmniejsz ich zakres albo przesuń jeden z nich, zanim intensywny tydzień stanie się źródłem stresu.',
      ],
    },
    {
      heading: 'Krótki przegląd wystarczy',
      paragraphs: [
        'Raz w tygodniu zaznacz aktualny dzień i sprawdź następne siedem do dziesięciu dni. Zaktualizuj przesunięte terminy, wykreśl nieaktualne plany i wybierz najważniejszy etap. Nie trzeba codziennie projektować miesiąca od początku. Dobry plan jest stabilnym tłem dla decyzji, a nie kolejnym zadaniem do obsługi.',
        'Po zakończeniu miesiąca zachowaj wydruk przez chwilę. Zobacz, które odcinki były realistyczne, gdzie zabrakło bufora i jak często zmieniały się priorytety. Te obserwacje są bardziej wartościowe niż idealnie wypełniona strona. Pomagają zaplanować następny miesiąc w sposób dopasowany do Twojego prawdziwego tempa.',
      ],
    },
  ],
};

const habitTrackingPl: BlogArticle = {
  id: 'habit-tracking-timeline',
  slug: '2026-01-26-jak-budowac-nawyki-i-sledzic-postepy-na-osi-czasu',
  date: '2026-01-26',
  title: 'Jak budować nawyki, jak śledzić postępy? Wykres na jednej osi czasu.',
  lead: 'Śledzenie nawyku nie musi przypominać arkusza ocen. Prosty wykres na jednej osi czasu pomaga zobaczyć regularność, przerwy i powrót do działania, bez udawania, że pojedynczy opuszczony dzień przekreśla cały proces.',
  description:
    'Jak budować nawyki i śledzić postępy na liniowej osi czasu. Prosty habit tracker do druku, realistyczna częstotliwość i przegląd wzorców.',
  tags: [
    'budowanie nawyków',
    'śledzenie postępów',
    'habit tracker do druku',
    'wykres nawyków',
    'kalendarz liniowy',
  ],
  sections: [
    {
      heading: 'Śledź zachowanie, które da się zauważyć',
      paragraphs: [
        'Cel „więcej się ruszać” brzmi dobrze, ale trudno go jednoznacznie zaznaczyć. Na początku wybierz prostą obserwowalną czynność, na przykład trzydziestominutowy spacer, trening albo przygotowanie stroju sportowego poprzedniego wieczoru. Im mniej interpretacji wymaga wpis, tym łatwiej prowadzić wykres uczciwie.',
        'Warto też ustalić częstotliwość. Nie każdy nawyk musi wydarzać się codziennie. Trzy treningi w tygodniu, telefon do bliskiej osoby w niedzielę czy podsumowanie finansów raz w miesiącu są równie prawdziwymi rytmami. Oś czasu powinna odpowiadać zachowaniu, a nie popularnej serii codziennych kratek.',
      ],
    },
    {
      heading: 'Jedna oś pokazuje ciągłość i przerwy',
      paragraphs: [
        'Na kalendarzu liniowym każdy kolejny dzień zajmuje miejsce obok poprzedniego. Wystarczy kropka, kreska albo kolor, by zaznaczyć wykonanie. Kropka wyżej może oznczać większy wisiłek, niżej - krótszy marsz. Po kilku tygodniach tworzy się wykres pokazujący nie tylko serię, lecz także rytm: dni tygodnia, w których działanie przychodzi łatwiej, oraz momenty częstszych przerw.',
        'Taki widok pomaga odróżnić jednorazowe pominięcie od powtarzalnego problemu. Jeśli przerwy pojawiają się zawsze po intensywnym poniedziałku, rozwiązaniem może być zmiana dnia, skrócenie wersji podstawowej albo lepsze przygotowanie. Dane mają wspierać korektę planu, nie osądzać charakteru.',
      ],
    },
    {
      heading: 'Zaplanuj wersję minimalną i powrót',
      paragraphs: [
        'Nawyk łatwiej utrzymać, gdy ma wersję możliwą do wykonania w trudnym dniu. Pełny trening może mieć odpowiednik w postaci dziesięciu minut ruchu, a długa sesja pisania w postaci jednego akapitu. Na wykresie można użyć dwóch znaków, aby rozróżnić pełne oraz minimalne wykonanie bez traktowania mniejszego kroku jak porażki.',
        'Przerwa jest częścią procesu. Zamiast próbować chronić idealną serię za wszelką cenę, ustal regułę powrotu, na przykład wykonanie małej wersji przy najbliższej okazji. Oś zachowuje historię i pokazuje, że po luce można kontynuować. Umiejętność wracania bywa ważniejsza niż najdłuższy nieprzerwany ciąg.',
      ],
    },
    {
      heading: 'Oceniaj trend, nie pojedynczy dzień',
      paragraphs: [
        'Raz na tydzień lub miesiąc spójrz na cały odcinek i zadaj sobie pytania: w których momentach podejmowałem zadanie częściej, kiedy rzadziej, co pomagało, co przeszkadzało i co warto uprościć? Nie dodawaj od razu wielu nowych nawyków. Jeden czytelny wykres daje więcej wiedzy niż rozbudowany tracker porzucony po kilku dniach.',
        'Postęp może oznaczać większą regularność, krótsze przerwy albo szybszy powrót. Liniowa forma dobrze pokazuje każdą z tych zmian, ponieważ zachowuje skalę czasu. Tworzy spokojne, konkretne sprzężenie zwrotne, które pomaga budować zachowanie na podstawie własnych doświadczeń.',
      ],
    },
  ],
};

const septemberQ4PlanningPl: BlogArticle = {
  id: 'september-q4-planning',
  slug: '2026-09-04-wrzesien-planowanie-q4-kalendarz-liniowy',
  date: '2026-09-04',
  title: 'Wrzesień i planowanie Q4 - jak poukładać jesień w życiu i pracy?',
  lead: 'Wrzesień ma energię drugiego początku. Kończy luźniejszy rytm lata, porządkuje codzienność i daje dobry moment, by spojrzeć na ostatni kwartał roku. To czas na spokojne ułożenie pracy, domu i odpoczynku przed intensywną końcówką roku.',
  description:
    'Jak wykorzystać wrzesień do planowania Q4 w życiu i pracy? Uporządkuj jesienne projekty, rodzinne terminy, odpoczynek i cele na kalendarzu liniowym.',
  tags: [
    'wrzesień planowanie',
    'planowanie Q4',
    'kalendarz liniowy',
    'plan na jesień',
    'planowanie ostatniego kwartału',
    'organizacja pracy i życia',
  ],
  sections: [
    {
      heading: 'Wrzesień ma energię drugiego początku',
      paragraphs: [
        'Styczeń ma swoje postanowienia, ale to wrzesień często naprawdę zmienia codzienny rytm. Kończą się wakacyjne wyjazdy, dzieci wracają do szkoły, zespoły znów pracują w pełnym składzie, a kalendarz szybko zapełnia się spotkaniami i stałymi zajęciami. Po letnim rozproszeniu łatwiej zauważyć, które sprawy wymagają porządku przed końcem roku.',
        'Wrzesień nie musi być jednak kolejnym egzaminem z produktywności. Zamiast zaczynać wszystko od nowa, warto zrobić krótką inwentaryzację. Co już działa? Co zostało odłożone na później? Z czego można zrezygnować? Taki przegląd daje lepszy punkt wyjścia niż długa lista nowych celów dopisana do już pełnych tygodni.',
      ],
    },
    {
      heading: 'Najpierw zaplanuj życie poza pracą',
      paragraphs: [
        'Zacznij od wydarzeń, które wyznaczają rytm domu: planu szkoły i zajęć, wizyt lekarskich, rodzinnych uroczystości, wyjazdów, świąt oraz dni, które chcesz zachować wolne. Jesienią łatwo skoncentrować się na obowiązkach i dopiero później odkryć, że odpoczynek nie znalazł miejsca w żadnym tygodniu.',
        'Wrzesień jest dobrym momentem, aby porozmawiać o tym, jak ma wyglądać październik, listopad i grudzień. Warto wcześniej ustalić świąteczne podróże, większe domowe wydatki, czas dla bliskich oraz okresy, w których rodzina nie bierze na siebie kolejnych zobowiązań. Plan Q4 może obejmować samopoczucie i relacje obok zadań do wykonania.',
      ],
    },
    {
      heading: 'Q4 w pracy zaczyna się we wrześniu',
      paragraphs: [
        'Ostatni kwartał formalnie zaczyna się w październiku, ale jego wynik często zależy od decyzji podjętych kilka tygodni wcześniej. We wrześniu warto zebrać terminy projektów, kampanii, budżetów, rozliczeń i urlopów. Gdy wszystkie znajdują się w jednym widoku, łatwiej dostrzec, że listopadowy finał wymaga przygotowań już na początku jesieni.',
        'Wybierz od jednego do trzech rezultatów, które naprawdę mają znaczenie przed końcem roku. Następnie rozpisz drogę wstecz: decyzje, materiały, konsultacje, wykonanie i bufor na poprawki. Pozostałe pomysły mogą trafić na osobną listę. Planowanie Q4 to świadomy wybór tego, co ma zostać ukończone.',
      ],
    },
    {
      heading: 'Zobacz jesień na jednej osi',
      paragraphs: [
        'The Awesome Calendar to kalendarz liniowy, który pokaże Ci wrzesień i całe Q4 jako jedną oś czasu. Projekty, wyjazdy, szkolne przerwy i przygotowania do świąt zajmują na nim rzeczywiste odcinki. Dzięki temu koniec roku nie ukrywa tego, co zaczyna się zaraz po nim, a odległość między dzisiaj a grudniowymi terminami pozostaje widoczna.',
        'Możesz zastosować dwie linie: jedną dla pracy, drugą dla życia prywatnego. Gdy intensywny etap projektu pokrywa się z rodzinnym wyjazdem albo szkolną przerwą, konflikt staje się widoczny zanim zamieni się w stresujący tydzień. Najważniejsze elementy zapisz na papierowym kalendarzu liniowym, a szczegółowe godziny nadal mogą pozostać w telefonie.',
      ],
    },
    {
      heading: 'Plan ma pomagać przez całą jesień',
      paragraphs: [
        'Raz w tygodniu zaznacz aktualny dzień i spójrz na najbliższe dwa lub trzy tygodnie. Raz w miesiącu sprawdź całą drogę do końca grudnia. Przesuń elastyczne elementy, wykreśl nieaktualne plany i dopisz nowe terminy, które rzeczywiście zmieniają obraz kwartału. Taki rytm wystarczy, by kalendarz pozostawał użyteczny.',
        'Dobry plan jesieni nie powinien wypełniać każdego wolnego miejsca. Zostaw bufory na opóźnienia, nagłą zmianę priorytetów, zwykłe zmęczenie, a może przeziębienie? Wrzesień może być świetnym momentem, w którym odzyskujesz perspektywę i decydujesz, jak chcesz przejść przez ostatnią część roku.',
      ],
    },
  ],
};

const adhdPlanningPl: BlogArticle = {
  id: 'adhd-linear-calendar',
  slug: '2026-09-09-adhd-planowanie-kalendarz-liniowy',
  date: '2026-09-09',
  title:
    'ADHD i planowanie - dlaczego kalendarz liniowy może być najlepszym rozwiązaniem?',
  lead: 'Planowanie z ADHD potrafi być wyzwaniem. Chęci i zapału zazwyczaj nie brakuje - podczas układania planów terminy, priorytety i kolejne etapy łatwo znikają z pola widzenia. Zwłaszcza priorytety, które potrafią zmienić się z minuty na minutę. Kalendarz liniowy pokazuje czas jako jedną ciągłą oś. Dla wielu osób może być prostym sposobem na odciążenie pamięci i zobaczenie, co wydarzy się za tydzień, miesiąc i kilka miesięcy.',
  description:
    'ADHD i planowanie czasu - sprawdź, jak kalendarz liniowy może ułatwić dostrzeganie terminów, etapów zadań oraz przerw między wydarzeniami.',
  tags: [
    'ADHD i planowanie',
    'kalendarz dla osób z ADHD',
    'kalendarz liniowy',
    'planowanie czasu z ADHD',
    'organizacja czasu ADHD',
    'planowanie zadań',
    'kalendarz do druku',
    'wizualne planowanie czasu',
  ],
  sections: [
    {
      heading: 'Dlaczego planowanie przy ADHD bywa trudne?',
      paragraphs: [
        'ADHD może wpływać na koncentrację, organizację, zarządzanie czasem i kończenie rozpoczętych zadań. Nie każda osoba doświadcza tych trudności w ten sam sposób. Jedna zapomina o odległych terminach, druga odkłada rozpoczęcie dużego projektu, a jeszcze inna tworzy rozbudowany plan, po czym przestaje do niego zaglądać.',
        'Problemem nie zawsze jest brak kalendarza. Czasem narzędzi jest wręcz za dużo: aplikacja do zadań, kalendarz w telefonie, notatki, wiadomości oznaczone gwiazdką i kartka leżąca na biurku. Każde z tych miejsc przechowuje część planu, ale żadne nie pokazuje całego obrazu. Wydarzenia w aplikacji, przypomnienia i listy nie pokazują przy tym czegoś bardzo ważnego: jak długo trwają zdarzenia i ile czasu rzeczywiście pozostaje między nimi.',
      ],
    },
    {
      heading: 'Kiedy czasu nie widać, łatwiej stracić go z oczu',
      paragraphs: [
        'Klasyczny kalendarz dzieli rok na miesiące i strony. To wygodne rozwiązanie, ale ma pewną wadę: koniec kartki wygląda jak koniec okresu planowania. Termin zapisany na kolejnej stronie może wydawać się odległy, chociaż dzieli nas od niego tylko kilka dni.',
        'Kalendarz liniowy przedstawia dni, tygodnie i miesiące na jednej osi. Czas nie znika przy zmianie strony, a wydarzenia zajmują rzeczywiste odcinki. Dzięki temu można zobaczyć nie tylko datę oddania projektu, ale również przestrzeń potrzebną na przygotowanie materiałów, konsultacje, wykonanie i poprawki. Dla osoby, która potrzebuje widocznego upływu czasu, taki układ może być jednym z najlepszych i najprostszych rozwiązań.',
      ],
    },
    {
      heading: 'Kalendarz liniowy przenosi plan z pamięci na papier',
      paragraphs: [
        'The Awesome Calendar to kalendarz liniowy do wydrukowania, który pozwala spojrzeć na cały rok bez przełączania widoków. Możesz zaznaczyć na nim projekty, wizyty, wyjazdy, szkolne terminy, płatności i czas na odpoczynek. Wszystkie te elementy zaczynają tworzyć jedną mapę zamiast zbioru niezależnych przypomnień.',
        'Papierowy kalendarz warto umieścić w miejscu, na które spoglądasz każdego dnia. Nie trzeba pamiętać o otwarciu aplikacji ani wybierać odpowiedniego widoku. Plan pozostaje widoczny, a zaznaczenie aktualnego dnia pozwala szybko sprawdzić, co jest blisko i ile czasu naprawdę zostało.',
      ],
    },
    {
      heading: 'Jak używać kalendarza liniowego przy ADHD?',
      paragraphs: [
        'Najpierw wpisz daty, których nie możesz przesunąć: wizyty, wyjazdy, egzaminy, końce projektów i ważne rodzinne wydarzenia. Następnie wybierz jeden większy cel i zaplanuj go od końca. Zaznacz termin, a potem dopisz wcześniejsze etapy. Duże zadanie zmienia się wtedy w kilka mniejszych kroków rozmieszczonych na osi czasu.',
        'Nie próbuj od razu szczegółowo planować całego roku. Możesz zacząć od najbliższych sześciu lub ośmiu tygodni. Użyj dwóch albo trzech kolorów, na przykład dla pracy, życia prywatnego i odpoczynku. Im prostszy system, tym mniej energii wymaga jego utrzymanie.',
        'Kalendarz w telefonie nadal może przypominać o konkretnej godzinie spotkania. Papierowy kalendarz liniowy pełni inną funkcję: pokazuje szerszą perspektywę. Te dwa narzędzia nie muszą ze sobą konkurować. Telefon może pilnować szczegółów dnia, a kalendarz na ścianie pomagać w ocenie całych tygodni i miesięcy.',
      ],
    },
    {
      heading: 'Dobry plan wspiera, zamiast oceniać',
      paragraphs: [
        'Kalendarz nie diagnozuje ani nie leczy ADHD. Może jednak wspierać codzienną organizację, pomagać w zapisywaniu ważnych dat i ograniczać liczbę rzeczy, o których trzeba pamiętać. Jeśli plan przestaje działać, nie oznacza to porażki. Być może potrzebuje mniej szczegółów, innego miejsca albo prostszego oznaczenia priorytetów.',
        'Najlepszy kalendarz to taki, który pozostaje zrozumiały i do którego chce się wracać. Dla wielu osób z ADHD właśnie kalendarz liniowy może być dobrym wyborem, ponieważ zamienia abstrakcyjny czas w widoczną przestrzeń. Nie rozwiązuje każdego problemu, ale może sprawić, że następny krok, termin i wolne miejsce pomiędzy nimi staną się łatwiejsze do zauważenia.',
      ],
    },
  ],
  sources: [
    {
      label:
        'NIMH: ADHD u dorosłych - organizacja, planowanie i zarządzanie czasem',
      url: 'https://www.nimh.nih.gov/health/publications/adhd-what-you-need-to-know',
    },
    {
      label:
        'Metaanaliza: zdolności postrzegania czasu u osób z ADHD (Journal of the American Academy of Child & Adolescent Psychiatry, 2022)',
      url: 'https://pubmed.ncbi.nlm.nih.gov/34923055/',
    },
    {
      label:
        'Badanie randomizowane: trening zarządzania czasem, organizacji i planowania u dorosłych z ADHD (American Journal of Psychiatry, 2010)',
      url: 'https://pubmed.ncbi.nlm.nih.gov/20231319/',
    },
  ],
};

const bestCalendarEn: BlogArticle = {
  id: 'best-calendar',
  slug: '2026-02-03-what-is-the-best-calendar',
  date: '2026-02-03',
  title: 'What is the best calendar?',
  lead: 'The bold question in the title has no single good answer: there is no one best calendar for everyone. The right choice depends on whether you need to record the details of a day, remember appointments or see the entire year as one continuous stretch of time. For that last task, our best suggestion is a linear calendar.',
  description:
    'Which calendar is best: digital, paper, wall-mounted or linear? Compare their uses and learn when a whole-year timeline is the most useful view.',
  tags: [
    'best calendar',
    'linear calendar',
    'year planning',
    'printable calendar',
    'time management',
  ],
  sections: [
    {
      heading: 'Best for what?',
      paragraphs: [
        'Asking for the best calendar is a little like asking for the best pair of shoes. One pair belongs on a mountain path, another at a wedding and another on an everyday walk. Calendars work in the same way. A tool that gives an excellent fifteen-minute meeting reminder may be poor at showing how close two large projects are to one another.',
        'Before choosing, name the main job. Do you need an hourly plan, room for notes, dates shared with a team or a view in which January, the summer and December are parts of the same line? Only then can you judge which format is genuinely helpful.',
      ],
    },
    {
      heading: 'Each format focuses on a different scale',
      paragraphs: [
        'A digital calendar excels at reminders, recurring meetings and quick changes. A bound planner gives you space for detail, task lists and unhurried thinking on paper. A conventional wall calendar is easy for a household to see and works well for the current month. None is inherently better; each brings a different part of time into focus.',
        'Trouble begins when a day-level tool is forced to plan a year. Twelve screens or twelve pages cannot show the complete picture at once. Individual dates remain available, but their relationships disappear: preparation time, crowded periods and empty spaces that could deliberately stay empty.',
      ],
    },
    {
      heading: 'What a linear calendar adds',
      paragraphs: [
        'A linear calendar presents time in a consistent order and scale. Consecutive days form one strip instead of twelve separate monthly boards. The length of a holiday, project or school term becomes a visible section. You can compare distances and notice that two apparently unrelated plans occupy the same week.',
        'Its strength is the wide view. Use the line for major dates, stages and periods of rest, while keeping detail in a phone, notebook or project app. The linear calendar complements those systems.',
      ],
    },
    {
      heading: 'The best setup may use two tools',
      paragraphs: [
        'Many people do not need one all-purpose planner, but several simple perspectives. The first answers “what am I doing today?” and can easily be digital. The second answers “where is this whole year going?” - a physical timeline above a desk or on a shared wall works especially well here.',
        'This division removes the pressure to store everything in one place. Only information that matters across weeks and months belongs on the line. A detailed list may change every day while the strategic view stays legible. That is useful for long projects, a school year, wedding preparations or family travel.',
      ],
    },
    {
      heading: 'Is a linear layout right for you?',
      paragraphs: [
        'Print one year, join the strips and mark five to ten important dates. Add their preparation periods and open stretches of time. After a week, ask whether you are spotting relationships that used to disappear between pages or screens.',
        'The best calendar is the one that supports your decisions and that you continue to use. Choose a detailed tool when detail is the job. Try a linear calendar when you want time in the format of one continuous axis. It does not have to replace anything; it only needs to reveal what the other formats cannot fit into a single glance.',
      ],
    },
  ],
};

const linearCalendarExplainedEn: BlogArticle = {
  id: 'linear-calendar-explained',
  slug: '2026-03-12-what-is-a-linear-calendar',
  date: '2026-03-12',
  title: 'What is a linear calendar?',
  lead: 'A linear calendar places days, weeks and months one after another on a continuous timeline. Instead of twelve separate boards, you get one view that makes sequence, distance and the duration of events immediately visible.',
  description:
    'A clear explanation of the linear calendar: how it looks, how it differs from a conventional calendar and when a continuous whole-year timeline is useful.',
  tags: [
    'linear calendar',
    'timeline calendar',
    'visual planning',
    'year calendar',
    'printable calendar',
  ],
  sections: [
    {
      heading: 'A simple definition',
      paragraphs: [
        'A linear calendar is a way of presenting time on one axis. Each day takes the next position, weeks follow one another, and month boundaries organise the view without breaking it apart. The axis may run horizontally or vertically. Continuity and a readable, consistent scale are what make it linear.',
        'A yearly version looks like a long strip. The beginning of the year sits at one end, the finish at the other, and today is a specific point between them. A single-day event can be a mark or symbol. A holiday, project or school term occupies a section whose length reflects the actual number of days.',
      ],
    },
    {
      heading: 'How it differs from a conventional calendar',
      paragraphs: [
        'The familiar monthly calendar uses a grid of weeks. It is compact and quickly tells you which weekday a date falls on. That convenience comes with breaks: after the last day of a month, you move to a new page or screen, and the visual distance between dates becomes less obvious.',
        'A linear calendar preserves the relationship between neighbouring days across a month or year boundary. Sunday 31 May and Monday 1 June remain side by side. This small layout change affects the way the year feels. Instead of a collection of months, time appears as one continuous resource in which every commitment needs space.',
      ],
    },
    {
      heading: 'Why a consistent scale matters',
      paragraphs: [
        'A consistent scale lets you compare time by sight. A two-week holiday is shorter than a six-week project stage, and the gap between two events may turn out to be much smaller than memory suggested. There is no need to count pages or swipe through an app; proportion is built into the drawing.',
        'That is why linear timelines are useful in education, project planning and family organisation. They do not show everything. They show sequence, duration, overlapping periods and the path from a starting point to a goal exceptionally well. Think of the line as a map of time, not a detailed list of instructions.',
      ],
    },
    {
      heading: 'How to use a timeline calendar',
      paragraphs: [
        'Begin by choosing a range. It might be a calendar year, an academic year, the life of a project or the period from today to an important event. Mark the dates that are hard to move: holidays, trips, exams, launches and finishes. Only then add the periods of preparation that lead to them.',
        'Keep the colour palette small and create a short legend. One colour could mean work, another family and another rest. Show longer events as lines or blocks running across several days, while individual deadlines remain points. Legibility is more useful than decoration.',
      ],
    },
    {
      heading: 'A paper timeline as a second level of planning',
      paragraphs: [
        'A physical linear calendar does not need to compete with an app. On a visible wall it becomes a permanent strategic view, while a phone stores appointment times and sends reminders. Paper is also easy to annotate, cross out and discuss with another person without passing around a device.',
        'Trying the approach takes little more than A4 paper, scissors and a few minutes to join the strips. The result is not another planner that demands perfect maintenance. It is a long, simple answer to two useful questions: where are we now, and how much time separates us from what we are planning?',
      ],
    },
  ],
};

const planYearEn: BlogArticle = {
  id: 'plan-whole-year',
  slug: '2026-04-08-how-to-plan-a-whole-year-without-going-mad',
  date: '2026-04-08',
  title: 'How to plan a whole year without going mad: choose a linear calendar',
  lead: 'A yearly plan should not be a list of 365 perfectly productive days. It should reveal the rhythm of work, rest and important events. A linear calendar helps you build that view without hiding empty space or overwhelming it with detail.',
  description:
    'A practical way to plan a whole year on a linear calendar using key dates, stages, buffers, rest and regular reviews of the plan.',
  tags: [
    'year planning',
    'linear calendar',
    'annual plan',
    'time management',
    'work-life balance',
  ],
  sections: [
    {
      heading: 'A year is not an enlarged workday',
      paragraphs: [
        'It is easy to plan a year with the logic of a task list: add goals, projects, trips, a home renovation, language study and regular rest. The result quickly becomes a catalogue of wishes. It does not show that all of those plans draw on the same time and energy.',
        'A yearly perspective needs less detail and more relationship. Sequence, duration and the proximity of big commitments matter most. A linear calendar helps because every plan has to occupy a real section. Once something appears on the axis, you can also see what comes before it, after it and at exactly the same time.',
      ],
    },
    {
      heading: 'Start with the anchors you cannot move',
      paragraphs: [
        'Enter fixed dates first: the start of the school year, closing periods at work, family occasions, paid trips, exams and appointments. These are the plan’s anchors. Do not judge or optimise them yet. The first step is simply to see the skeleton of the year as it really exists.',
        'Next, mark the preparation that each anchor requires. If an event needs three weeks of work, its final date alone is misleading. Draw the section leading up to it. A May trip then becomes a plan that includes bookings, purchases and enough time to close current responsibilities calmly.',
      ],
    },
    {
      heading: 'Plan distances and sections, not only goals',
      paragraphs: [
        'When the large pieces are visible, look for periods where several demanding sections overlap. This is more important than adding another ambition. If April contains a project launch, a house move and a major holiday, the problem is not weak willpower. The problem is the limited capacity of the month. On a linear calendar, you will see it as a clear concentration of notes and markers.',
        'You may be able to move work earlier, reduce its scope or arrange help. Add buffers to the line as well: a free weekend after travel, a week without a new project or a few days for the unexpected. Let empty space sometimes be what helps the plan survive contact with real life.',
      ],
    },
    {
      heading: 'Use a few layers and a very small legend',
      paragraphs: [
        'One line can hold different areas when the markings are consistent. Choose no more than three or four categories, perhaps work, family, rest and personal development. Use colours, symbols or separate levels above the axis.',
        'Record only what changes the shape of a week or month. A short meeting stays on the phone. A two-week phase, the children’s school holiday, a major deadline and annual leave belong on the axis. That filter keeps the calendar readable and useful even from a few metres away.',
      ],
    },
    {
      heading: 'See the whole year at a glance',
      paragraphs: [
        'A yearly plan should be stable background, not another board demanding constant attention. Once a week, mark the passage of time. Once a month, review the next quarter, move flexible items and add new anchors. Daily work can continue to live in a more detailed system.',
      ],
    },
  ],
};

const weddingPlanningEn: BlogArticle = {
  id: 'wedding-planning',
  slug: '2026-05-16-planning-a-wedding-spreadsheet-notebook-or-linear-calendar',
  date: '2026-05-16',
  title:
    'How to plan a wedding - Excel, a notebook planner or perhaps... a linear calendar?',
  lead: 'Excel is good at calculating the budget, a notebook collects ideas and a linear calendar shows the road to the wedding day. Rather than choosing one tool for everything, give each one the job it performs best.',
  description:
    'A comparison of Excel, a paper planner and a linear calendar for organising a wedding, plus a simple system combining the budget, notes and dates.',
  tags: [
    'wedding planning',
    'wedding calendar',
    'linear calendar',
    'wedding planner',
    'wedding spreadsheet',
  ],
  sections: [
    {
      heading: 'Three tools, three different questions',
      paragraphs: [
        'Wedding planning combines numbers, decisions, inspiration and deadlines. It is no surprise that one tool soon becomes uncomfortable. A spreadsheet expects specific numbers, dates and prices. A notebook welcomes free-form notes but does not provide a simple view of the whole. A linear calendar shows sequence. Trying to squeeze everything into a single format usually produces clutter or missing information.',
        'Instead of asking “which planner is best?”, ask where you will calculate money, collect decisions and keep track of time. A clear division reduces duplicate work. Every piece of information has one primary home, and the complete system remains understandable without a complicated app.',
      ],
    },
    {
      heading: 'Spreadsheet: budget, guests and comparisons',
      paragraphs: [
        'Excel or another spreadsheet is excellent for the guest list, replies, costs and supplier quotes. You can filter entries, total spending and compare alternatives. If the venue price or number of guests changes, the sheet quickly calculates the consequences. A paper planner will be slower at these jobs.',
        'A spreadsheet is less effective at communicating distance in time. A date column may say that a contract is due on 20 June, but it does not make the number of weeks between a tasting and the final choice intuitive. Tables are designed to manage entries, not necessarily the rhythm of an entire preparation period.',
      ],
    },
    {
      heading: 'Notebook: ideas, conversations and decisions',
      paragraphs: [
        'A bound wedding planner is a good place for inspiration, questions for suppliers, table sketches and notes from conversations. It lets you think without fitting every thought into a cell. For many couples, handwriting also helps organise choices and separate their own priorities from everybody else’s suggestions.',
        'A notebook still has sequential pages while wedding preparation happens in parallel. Notes about the photographer may be dozens of pages away from the payment schedule. Tabs and a good index help, but they do not make it easy to see whether too many decisions have accumulated in the same month.',
      ],
    },
    {
      heading: 'Linear calendar: the road to the wedding day',
      paragraphs: [
        'On a timeline, the wedding becomes a clear destination and every preparation gets a realistic duration. Mark the venue booking, invitations, payment dates, fittings, meetings and open weeks. Longer jobs, such as choosing music, work better as sections than as isolated deadlines.',
        'The linear view also makes backward planning natural. Invitations need production time, and the design and guest list have to be ready earlier still. Place those stages back from the wedding day. You can see when a decision genuinely needs to begin, not only the day on which it must be finished.',
      ],
    },
    {
      heading: 'A simple system for two people',
      paragraphs: [
        'A practical combination might keep the budget and guest list in a spreadsheet, ideas and agreements in a notebook, and the major schedule on a printed timeline. Add short references on the calendar, such as “budget: venue row”, instead of copying amounts. Each tool stays clear and useful.',
        'Hang the timeline somewhere both of you regularly see it. Look at the next month, choose a few realistic actions and preserve the open periods. Good wedding planning should make clear what matters now, what comes later and when you can both rest.',
      ],
    },
  ],
};

const projectManagementEn: BlogArticle = {
  id: 'physical-project-management',
  slug: '2026-06-23-project-management-when-a-physical-calendar-works',
  date: '2026-06-23',
  title: 'Project management: a physical calendar can be a good choice',
  lead: 'A project app stores tasks, but a physical calendar may do a better job of keeping the shared shape of time visible. A long timeline on the wall helps a team see stages, dependencies and approaching bottlenecks without opening another tab.',
  description:
    'How to use a physical linear calendar in project management for milestones, phases, buffers, ownership and a practical hybrid digital workflow.',
  tags: [
    'project management',
    'project calendar',
    'physical calendar',
    'project timeline',
    'team planning',
  ],
  sections: [
    {
      heading: 'Good old-fashioned paper, always visible',
      paragraphs: [
        'Teams can work in powerful systems and still ask during a meeting how much time remains before launch. The problem is rarely missing data. It is the lack of a shared picture that can be read in seconds. The information is correct, but hidden behind views, filters and notifications.',
        'A physical calendar can serve as the project’s permanent map. On a team wall, it communicates the order of stages even when nobody is actively checking it. Time presented as a limited section forces a choice about what genuinely matters across the whole project.',
      ],
    },
    {
      heading: 'What belongs on the project line',
      paragraphs: [
        'Use the linear calendar for boundaries, milestones, work phases, blocking decisions and periods of limited availability. Do not add every task. If an item does not change the shape of a week or affect another person, it probably belongs in the digital system instead.',
        'Draw phases as sections and decisions as points. Simple sequence can show dependency: research ends before design, design before production and production before testing. When two sections overlap dangerously, the team sees the risk earlier than it would in a table of separate due dates.',
      ],
    },
    {
      heading: 'A wall creates a shared perspective',
      paragraphs: [
        'A large, accessible timeline works well in a short review. The team can stand beside it, point to the current week and discuss the three most important changes. Everyone remains anchored in the same picture. There is no screen sharing and no wait while each person opens the right app.',
        'A physical plan also encourages useful incidental observations. Someone passing the wall may notice that annual leave overlaps testing or that two teams expect the same decision at different times. The timeline becomes part of the working environment rather than a document viewed only during a status meeting.',
      ],
    },
    {
      heading: 'Updates need an owner',
      paragraphs: [
        'A paper plan loses trust as soon as it becomes stale. Give one person responsibility for changes or create a simple team ritual, such as updating the wall after a weekly review. Whenever the plan changes, correct both the digital source and the physical line.',
        'Do not redraw the calendar after every shift. Sticky markers, pencil and clear corrections are part of the tool. The line should show the team’s best current knowledge, not pretend the original plan was perfect. Visible revisions can even help everyone understand how the project is evolving.',
      ],
    },
    {
      heading: 'A hybrid setup is often strongest',
      paragraphs: [
        'The application remains responsible for task details, comments, files, ownership and automated reminders. The physical calendar is responsible for shared orientation. Stage names or short identifiers can connect the two. Full descriptions do not need to be copied from one place to another.',
        'This approach is especially useful for projects lasting many weeks, involving several people and depending on decisions at specific times. A one-day project or a fully distributed asynchronous team may gain less from paper. The right choice depends on the work, but a physical timeline should not be dismissed simply because it is analogue.',
      ],
    },
  ],
};

const multipleChildrenEn: BlogArticle = {
  id: 'planning-multiple-children',
  slug: '2026-08-11-planning-for-two-three-or-four-children',
  date: '2026-08-11',
  title:
    'Two, three or four children: how can a mum keep family planning manageable?',
  lead: 'With several children, the challenge is not only the number of dates but the way they overlap. Print one timeline for each child, use the same scale for all of them and follow the plans in parallel instead of squeezing an entire family into one crowded calendar square.',
  description:
    'A family planning system for two, three or four children using separate linear calendars, one scale, simple colours, a short weekly review and a division of care responsibilities.',
  tags: [
    'family planning',
    'calendar for mums',
    'children’s calendar',
    'family organisation',
    'linear calendar',
  ],
  sections: [
    {
      heading: 'This is not poor organisation - it is parallel planning',
      paragraphs: [
        'One child has a school trip, another an appointment, a third a sports session, and the costume for a performance is due in the same week. Even an excellent memory starts to behave like an overcrowded inbox. Many families respond by adding everything to one monthly calendar until every square contains several colours and abbreviations.',
        'The difficulty comes from several independent schedules meeting in one household. The family needs a view that preserves each plan while making comparison easy. A set of parallel linear calendars provides exactly that structure.',
      ],
    },
    {
      heading: 'Print as many lines as you need',
      paragraphs: [
        'Prepare two calendars for two children, three for three and four for four. Give each one the same date range and identical scale. Hang the lines one below another with the beginnings of the months aligned. The same day then forms a vertical column through every plan.',
        'Label each line with a name or simple symbol. Children can choose their own colour, but you do not need a separate colour for every type of event. Once each person has a dedicated strip, the layout does much of the organising. Colour identifies the owner instead of rescuing an unreadable shared square.',
      ],
    },
    {
      heading: 'Clashes become visible immediately',
      paragraphs: [
        'The largest benefit appears when dates are compared. If one child’s trip, another child’s competition and a third child’s parents’ evening happen on the same day, the marks line up vertically. The family can decide early who handles transport, whether help is needed and which commitments cannot be combined.',
        'The axis also shows longer periods: school holidays, camps, exam weeks, rehabilitation or a run of sports sessions. Instead of three isolated entries on a phone, you see a busy part of the month. That helps parents plan their own work, leave and the periods when the household should take on fewer optional commitments.',
      ],
    },
    {
      heading: 'Add one shared line for the household',
      paragraphs: [
        'A good option is to place one more strip below the children’s lines for shared family events. Trips, holidays, visitors, administrative dates and the parents’ leave belong there. Do not duplicate an event on every child’s calendar when it affects everybody. The common line keeps the system organised and provides context.',
      ],
    },
    {
      heading: 'A short family review replaces constant reminders',
      paragraphs: [
        'Once a week, look together at the next seven or fourteen days. Older children can add events or move markers themselves. Younger children can find their symbols and talk about what is coming. This ritual shares responsibility and stops the plan from living entirely in one person’s head.',
        'The aim is not perfect control of every day. It is fewer surprises and fewer decisions made at the last minute. Two, three or four parallel timelines take more wall space than one calendar, but they return far more space in the family’s mind. For a busy family, that is a very fair exchange.',
      ],
    },
  ],
};

const freeCalendar2027En: BlogArticle = {
  id: 'free-calendar-2027',
  slug: '2026-08-27-free-printable-2027-linear-calendar',
  date: '2026-08-27',
  title: 'Free printable 2027 calendar - a linear calendar is worth choosing!',
  lead: 'A free printable 2027 calendar can be more than a set of twelve pages. A linear layout turns the whole year into one timeline, making it easier to see the distance between plans, the duration of important periods and the space that is genuinely still available.',
  description:
    'Download a free printable 2027 calendar and discover why a linear whole-year layout is useful for planning holidays, projects and family events.',
  tags: [
    'free 2027 calendar',
    'printable 2027 calendar',
    '2027 linear calendar',
    '2027 yearly planner',
    'calendar PDF',
  ],
  sections: [
    {
      heading: 'A 2027 calendar that shows the whole year',
      paragraphs: [
        'A conventional printable calendar usually divides the year into twelve separate boards. That is convenient when you need to check a weekday or write down an appointment. It is harder to compare events several months apart. January disappears when you look at May, and the end of one month seems distant from the beginning of the next.',
        'A linear 2027 calendar puts days in a fixed sequence on one axis. Every week keeps a similar scale, while month boundaries organise the view without interrupting it. The annual plan becomes a map of time: you can see where you are, what is coming and how much space each commitment actually occupies.',
      ],
    },
    {
      heading: 'Why The Awesome Calendar is worth choosing',
      paragraphs: [
        'The easiest way to test a new planning method is to avoid buying another planner first. Download the free PDF, print it on ordinary A4 paper and join the strips according to the layout. A handful of important dates is enough to tell whether the whole-year view helps more than another set of notebook pages.',
        'A free format also makes experimentation easy. One copy can serve the family, another a project and a third holiday planning. If the first marking system becomes difficult to read, print a fresh copy and simplify the legend without feeling that an expensive planner has been wasted.',
      ],
    },
    {
      heading: 'What to mark on your 2027 timeline',
      paragraphs: [
        'Enter dates that are difficult to move first: public holidays, school breaks, planned trips, exams, family events and work deadlines. Then add the preparation periods. A holiday is not only the departure date. It also needs time for bookings, documents and a calm finish to existing responsibilities before the journey.',
        'Draw long events as sections and single deadlines as points. Choose no more than three or four colours and give each a consistent meaning. The calendar should remain legible from a short distance, so there is no need to copy every hour and task from your phone onto the line.',
      ],
    },
    {
      heading: 'Paper and your phone can work together',
      paragraphs: [
        'A printed 2027 calendar does not have to replace an app. Your phone is good at exact times, addresses and reminders. The wall timeline answers different questions: which weeks are already busy, when a quieter period begins and whether a new idea conflicts with something that has already been agreed.',
        'The best calendar is one you genuinely return to. A linear layout is worth choosing when you need a wider frame and want to make decisions across a whole year. A free printable calendar offers a simple way to begin planning 2027 without a subscription, registration or a complicated new system.',
      ],
    },
  ],
};

const schoolCalendarEn: BlogArticle = {
  id: 'school-calendar-2026-2027',
  slug: '2026-07-18-school-calendar-2026-2027-on-one-timeline',
  date: '2026-07-18',
  title:
    'The 2026/2027 school calendar can be great: the whole school year on one timeline',
  lead: 'A school year does not fit neatly into one calendar year or one monthly planner page. A linear 2026/2027 school calendar presents the period from the start of term to the summer holiday as one continuous journey.',
  description:
    'Plan the 2026/2027 school year on one timeline and see terms, breaks, exams, projects and family commitments in a single readable view.',
  tags: [
    '2026/2027 school calendar',
    'academic year calendar',
    'student planner',
    'study planning',
    'linear calendar',
  ],
  sections: [
    {
      heading: 'The school year needs its own date range',
      paragraphs: [
        'A plan from September to June crosses the boundary between two calendar years. One annual page ends in December, but lessons, activities and projects continue. When the plan is split, January can feel like a completely new beginning and autumn work that still matters becomes harder to see.',
        'A linear 2026/2027 school calendar can begin near the end of the summer holiday and finish after the final school events. September, the winter break, spring exams and June remain parts of the same axis. You see not only their dates but also the proportions between periods of study and rest.',
      ],
    },
    {
      heading: 'What to enter at the beginning of the year',
      paragraphs: [
        'Start with dates shared by the school: the beginning and end of terms, holidays, breaks and known closure days. Copy exact dates from official school information and the relevant education authority, because local events and term dates can vary between schools and regions.',
      ],
    },
    {
      heading: 'Turn a deadline into real study time',
      paragraphs: [
        'An exam date alone says little about preparation. Mark the week or two that leads to it as well. A longer school project should look like a section rather than one dot at the finish. The student can see when to begin and what other activity will share the same stretch of time.',
        'The view also supports a more realistic workload. When several assessments and events cluster together, the family can reduce optional plans, begin in smaller stages or arrange help.',
      ],
    },
    {
      heading: 'One timeline for the student and family',
      paragraphs: [
        'A child can use symbols and colours, add subject names and mark short stages. A parent can place a shared line below for leave, trips and important household dates. When every strip uses the same scale, a family plan that lands in the middle of an intense school period is immediately visible.',
        'A school calendar on one axis becomes a simple background for a weekly conversation. Mark the week that has passed and look at the next month. The whole year does not need detailed planning on day one. What matters is that its shape remains visible and can be updated without turning through many separate pages.',
      ],
    },
  ],
};

const printableGanttEn: BlogArticle = {
  id: 'printable-gantt-chart',
  slug: '2026-05-31-printable-gantt-chart-with-a-linear-calendar',
  date: '2026-05-31',
  title:
    'A printable Gantt chart - a linear calendar is a simple, quick option',
  lead: 'Not every project needs sophisticated scheduling software. A printed linear calendar can work like a Gantt chart, showing phases as sections, deadlines as points and dependencies on one consistent time scale.',
  description:
    'A simple Gantt chart - a linear calendar. Learn how to map project stages, deadlines, dependencies and buffers.',
  tags: [
    'printable Gantt chart',
    'project calendar',
    'project schedule',
    'project plan',
    'linear calendar',
  ],
  sections: [
    {
      heading: 'What a Gantt chart needs to show',
      paragraphs: [
        'A Gantt chart arranges work on a timeline. Tasks or phases appear as horizontal bars, allowing their duration, order and overlap to be compared. In a complex project, software can calculate dependencies and resources. In a smaller effort, the main need is often a readable picture of the coming weeks.',
        'A linear calendar provides a ready-made date scale. Add a few rows beneath the axis and draw the project phases across them. The result is a paper schedule similar to a simple Gantt chart, without configuring an account, learning an application or maintaining fields a small team may never need.',
      ],
    },
    {
      heading: 'How to prepare a printable version',
      paragraphs: [
        'Choose a range that covers the complete project, with a small margin before the start and after the planned finish. List four to eight principal stages, such as research, design, production, testing and launch. Give each stage its own row and a bar running from its expected start to finish.',
        'Use a different symbol for milestones. Arrows or short notes can identify the most important dependencies, but avoid drawing the entire network if it becomes hard to read. The printout is for quick orientation. Detailed tasks, comments and files can remain in a digital project tool.',
      ],
    },
    {
      heading: 'Leave room for real project conditions',
      paragraphs: [
        'A paper schedule quickly reveals a plan filled from edge to edge. If one phase finishes on the exact day the next begins, a minor delay moves the entire sequence. Add buffers around work that depends on approval, delivery, an external person or any deadline the team cannot fully control.',
        'Mark annual leave, public holidays and periods of lower availability too - they change the team’s real capacity. A simple chart should support decisions, so it needs to represent working conditions.',
      ],
    },
    {
      heading: 'When paper is enough and when it is not',
      paragraphs: [
        'A printable Gantt works well for one project, a few people and a limited number of dependencies. Hang it in a studio, office or home and use it during a short review. Pencil or sticky strips make changes easy, while a strong vertical line can show the current week.',
        'Specialist software becomes necessary with hundreds of tasks, automated resource balancing and multiple teams. The linear calendar can still act as a simplified management view. It does not compete with the system, but extracts the project’s most important rhythm and makes it available at a glance.',
      ],
    },
  ],
};

const contentCalendarEn: BlogArticle = {
  id: 'annual-content-calendar',
  slug: '2026-04-27-annual-content-calendar-small-business-freelancer',
  date: '2026-04-27',
  title: 'An annual content calendar for a small business or freelancer',
  lead: 'An annual content calendar helps you stop inventing your communication from scratch every Monday. Campaigns, seasonal topics, launches and quieter periods can live on one timeline, while individual post details remain in a simple spreadsheet or app.',
  description:
    'How to create an annual content calendar for a small business or freelancer using content pillars, campaigns, a realistic frequency and buffers.',
  tags: [
    'content calendar',
    'annual content plan',
    'small business marketing',
    'social media planning',
    'freelancer calendar',
  ],
  sections: [
    {
      heading: 'See the rhythm of the year first',
      paragraphs: [
        'We understand: a small business rarely has a separate team for every campaign. The same person serves clients, develops the offer, publishes content and looks after sales. Planning only one week at a time means important seasons arrive too late, while communication competes with the busiest periods of operational work.',
        'An annual line provides the wider frame first. Mark the periods that matter to customers, planned launches, industry events, holidays and months with a heavier workload. You can then see when content needs to prepare an audience for an offer and when a lower frequency supported by evergreen material makes more sense.',
      ],
    },
    {
      heading: 'Build the plan from a few content pillars',
      paragraphs: [
        'Choose three to five subjects that connect audience needs with your expertise and offer. A freelance designer might discuss the collaboration process, preparing source materials, visual decisions and project outcomes. A small shop might combine guides, product uses, behind-the-scenes material and seasonal content.',
      ],
    },
    {
      heading: 'Plan campaigns as sections, not isolated posts',
      paragraphs: [
        'A product launch or client opening does not begin on the day the offer is published. Mark time for preparation, audience education, the main message and follow-up. The campaign gains the right perspective: it becomes a section with several phases.',
        'This view shows when two campaigns compete for attention in the same week. It also represents the time needed for writing, design, approval and repurposing. One strong article can later support a newsletter and several shorter posts when the plan deliberately reserves room for adaptation.',
      ],
    },
    {
      heading: 'Sustainable consistency beats a perfect plan',
      paragraphs: [
        'A content calendar should reduce pressure. Choose a frequency you can maintain during weeks filled with client work. One thoughtful piece every two weeks is better than planning five channels and abandoning them after a month.',
        'Review the next eight to twelve weeks once a month. Move material that is no longer relevant, add ideas from customer questions and preserve some open space. The annual line provides direction while the shorter review lets you react. For a small business or freelancer, that light system is often the most useful one.',
      ],
    },
  ],
};

const monthlyPlanningEn: BlogArticle = {
  id: 'plan-next-month',
  slug: '2026-03-03-how-to-map-out-the-next-month',
  date: '2026-03-03',
  title: 'I need to map out the next month - what should I use?',
  lead: 'Planning a month does not require the most sophisticated app. First decide whether hours, a task list or the order of several stages matters most. If you want to see every day at a consistent scale, a monthly timeline is a simple place to begin.',
  description:
    'How to plan the next month by choosing between a digital calendar, task list, paper planner and linear timeline.',
  tags: [
    'monthly plan',
    'monthly planning',
    'monthly calendar',
    'time management',
    'planning timeline',
  ],
  sections: [
    {
      heading: 'Match the tool to the type of plan',
      paragraphs: [
        'If the month mainly contains meetings at precise times, a digital calendar with reminders is the strongest option. A task list works better for many small actions without strict dates. A paper planner provides room for notes and daily priorities.',
        'A linear calendar answers another question: how do consecutive days form a whole? It helps when a plan includes several stages, a preparation period, an important deadline and recovery time. There is no need to choose one tool forever. The month can have a wide timeline view and details stored on a phone.',
      ],
    },
    {
      heading: 'Map fixed points and available time',
      paragraphs: [
        'Mark events you cannot move first: appointments, travel, delivery dates, days off and family commitments. Add your own tasks only afterwards. This order protects you from building a plan that ignores half of life and assumes full productivity every day.',
        'Look at the open sections between fixed points. Not all of them are genuinely available. You may need a quiet day after travel, while a large task needs a period without several competing obligations. A timeline helps distinguish an empty square from a stretch with real room for something new.',
      ],
    },
    {
      heading: 'Turn large tasks into short sections',
      paragraphs: [
        'Tasks such as “prepare a portfolio” or “plan the renovation” are too large for one day. Divide them into visible stages: gathering material, choosing, making, consulting and revising. Each stage occupies part of the month and leads to a concrete result.',
        'Do not put every action on the line. Details can live on a daily list. The monthly view should communicate rhythm and order. If several large sections overlap, reduce their scope or move one before an intense week becomes a source of stress.',
      ],
    },
    {
      heading: 'A short review is enough',
      paragraphs: [
        'Once a week, mark today and look at the next seven to ten days. Update moved deadlines, remove plans that no longer matter and choose the most important stage. You do not need to redesign the month each morning. A useful plan is a stable background for decisions, not another task to maintain.',
        'Keep the printout briefly after the month finishes. Notice which sections were realistic, where a buffer was missing and how often priorities changed. Those observations are more useful than a perfectly filled page. They help you plan the following month around your actual pace.',
      ],
    },
  ],
};

const habitTrackingEn: BlogArticle = {
  id: 'habit-tracking-timeline',
  slug: '2026-01-26-how-to-build-habits-and-track-progress-on-a-timeline',
  date: '2026-01-26',
  title: 'How do you build habits and track progress? A chart on one timeline.',
  lead: 'Habit tracking does not need to feel like a report card. A simple chart on one timeline reveals consistency, gaps and the return to action without pretending that one missed day cancels the entire process.',
  description:
    'Learn how to build habits and track progress on a linear timeline using a simple printable habit tracker, a realistic frequency and a review of patterns.',
  tags: [
    'building habits',
    'progress tracking',
    'printable habit tracker',
    'habit chart',
    'linear calendar',
  ],
  sections: [
    {
      heading: 'Track a behaviour you can observe',
      paragraphs: [
        'A goal such as “move more” sounds worthwhile, but it is difficult to mark consistently. Begin with a simple observable action, such as a thirty-minute walk, a workout or preparing exercise clothes the night before. The less interpretation an entry requires, the easier it is to maintain the chart honestly.',
        'Decide on frequency as well. Not every habit needs to happen daily. Three workouts a week, a Sunday call to someone close or a monthly financial review are all genuine rhythms. The timeline should match the behaviour instead of forcing everything into a fashionable sequence of daily boxes.',
      ],
    },
    {
      heading: 'One timeline reveals continuity and gaps',
      paragraphs: [
        'On a linear calendar, each day sits beside the day before it. A dot, line or colour is enough to record an action. A higher dot can represent greater effort, while a lower one can mark a shorter walk. After several weeks, the chart shows more than a streak. It reveals rhythm, including weekdays when the action comes easily and moments when gaps appear more often.',
        'The view helps separate one missed day from a repeating problem. If gaps always follow a demanding Monday, the answer may be a different day, a shorter minimum version or better preparation. The information should help adjust the plan rather than judge your character.',
      ],
    },
    {
      heading: 'Plan a minimum version and a return',
      paragraphs: [
        'A habit is easier to maintain when it has a version that fits a difficult day. A full workout might become ten minutes of movement, and a long writing session might become one paragraph. Use two symbols to distinguish full and minimum versions without treating the smaller action as a failure.',
        'A gap is part of the process. Rather than protecting a perfect streak at any cost, create a return rule, such as completing the minimum version at the next opportunity. The line preserves the history and shows that action can continue after a break. The ability to return often matters more than the longest uninterrupted run.',
      ],
    },
    {
      heading: 'Evaluate the trend, not one day',
      paragraphs: [
        'Once a week or month, look at the whole section and ask yourself: when did I do the activity more often, when less often, what helped, what got in the way and what could become simpler? Avoid adding several new habits immediately. One legible chart offers more insight than an elaborate tracker abandoned after a few days.',
        'Progress may mean greater consistency, shorter gaps or a quicker return. A linear format shows each change well because it preserves the scale of time. It creates calm, specific feedback that helps you build behaviour from your own experience.',
      ],
    },
  ],
};

const septemberQ4PlanningEn: BlogArticle = {
  id: 'september-q4-planning',
  slug: '2026-09-04-september-q4-planning-linear-calendar',
  date: '2026-09-04',
  title:
    'September and Q4 planning - how to organise autumn at home and at work',
  lead: 'September has the energy of a second beginning. It brings the looser rhythm of summer to a close, restores structure to everyday life and offers a good moment to look at the final quarter of the year. It is a time to calmly arrange work, home and rest before the busy year-end period.',
  description:
    'How can you use September to plan Q4 at home and at work? Organise autumn projects, family dates, rest and goals on a linear calendar.',
  tags: [
    'September planning',
    'Q4 planning',
    'linear calendar',
    'autumn planning',
    'fourth quarter planning',
    'work-life organisation',
  ],
  sections: [
    {
      heading: 'September has the energy of a second beginning',
      paragraphs: [
        'January has its resolutions, but September is often the month that genuinely changes the rhythm of everyday life. Summer trips end, children return to school, teams work at full strength again, and the calendar quickly fills with meetings and regular activities. After the scattered pace of summer, it becomes easier to notice what needs attention before the year ends.',
        'September does not, however, need to become another productivity test. Instead of starting everything again, take a short inventory. What already works? What has been postponed? What can you give up? This review provides a better starting point than adding a long list of new goals to weeks that are already full.',
      ],
    },
    {
      heading: 'Plan life outside work first',
      paragraphs: [
        'Begin with the events that shape the rhythm of home: school and activity schedules, medical appointments, family occasions, trips, holidays and the days you want to keep free. In autumn, it is easy to focus on obligations and discover too late that rest has not been given a place in any week.',
        'September is a good moment to discuss what October, November and December should look like. Agree on festive travel, larger household expenses, time with people close to you and the periods when the family will avoid taking on more commitments. A Q4 plan can include wellbeing and relationships alongside the tasks to complete.',
      ],
    },
    {
      heading: 'Q4 at work begins in September',
      paragraphs: [
        'The final quarter formally begins in October, but its results often depend on decisions made several weeks earlier. September is the time to gather project, campaign, budget, reporting and annual leave dates. With everything in one view, it becomes clear when a November finish requires preparation at the very beginning of autumn.',
        'Choose one to three outcomes that genuinely matter before the end of the year. Then work backwards through the decisions, materials, consultations, production and a buffer for revisions. Other ideas can remain on a separate list. Q4 planning means consciously choosing what should be completed.',
      ],
    },
    {
      heading: 'See autumn on one timeline',
      paragraphs: [
        'The Awesome Calendar is a linear calendar that will show you September and the whole of Q4 as one timeline. Projects, trips, school breaks and festive preparations occupy real sections of it. This means the end of the year does not hide what begins immediately after it, while the distance from today to December deadlines remains visible.',
        'You can use two lines: one for work and another for personal life. When an intensive project phase overlaps a family trip or school break, the conflict becomes visible before it turns into a stressful week. Record the most important elements on a paper linear calendar, while precise times can remain in your phone.',
      ],
    },
    {
      heading: 'The plan should help throughout autumn',
      paragraphs: [
        'Once a week, mark today and look at the next two or three weeks. Once a month, review the whole path to the end of December. Move flexible items, remove plans that no longer matter and add new dates that genuinely change the shape of the quarter. This light rhythm is enough to keep the calendar useful.',
        'A good autumn plan should not fill every open space. Leave buffers for delays, a sudden change of priorities, ordinary tiredness, or perhaps even a cold. September can be a great moment to regain perspective and decide how you want to move through the final part of the year.',
      ],
    },
  ],
};

const adhdPlanningEn: BlogArticle = {
  id: 'adhd-linear-calendar',
  slug: '2026-09-09-adhd-planning-linear-calendar',
  date: '2026-09-09',
  title: 'ADHD and planning - why a linear calendar may be the best solution',
  lead: 'Planning with ADHD can be challenging. There is usually no shortage of motivation or enthusiasm - while making plans, deadlines, priorities and next steps can easily slip out of view. Priorities in particular may seem to change from one minute to the next. A linear calendar presents time as one continuous timeline. For many people, it can be a simple way to reduce the load on memory and see what will happen in a week, a month and several months.',
  description:
    'ADHD and time planning - learn how a linear calendar can make deadlines, stages of a task and the real gaps between events easier to see.',
  tags: [
    'ADHD and planning',
    'calendar for people with ADHD',
    'linear calendar',
    'time planning with ADHD',
    'ADHD time management',
    'task planning',
    'printable calendar',
    'visual time planning',
  ],
  sections: [
    {
      heading: 'Why can planning be difficult with ADHD?',
      paragraphs: [
        'ADHD can affect concentration, organisation, time management and the ability to complete tasks that have already been started. Not everyone experiences these difficulties in the same way. One person may forget distant deadlines, another may postpone starting a large project, while someone else creates an elaborate plan and then stops looking at it.',
        'The problem is not always a lack of calendars. Sometimes there are simply too many tools: a task app, a calendar on your phone, notes, starred messages and a sheet of paper on your desk. Each of these places holds part of the plan, but none shows the complete picture. Events in an app, reminders and lists also leave out something important: how long events last and how much time actually remains between them.',
      ],
    },
    {
      heading: 'When time is not visible, it is easier to lose sight of it',
      paragraphs: [
        'A conventional calendar divides the year into months and pages. This is convenient, but it has a drawback: the end of a page can feel like the end of the planning period. A deadline written on the next page may seem distant even when it is only a few days away.',
        'A linear calendar presents days, weeks and months on one timeline. Time does not disappear when a page changes, and events occupy real sections of the line. You can see not only a project deadline, but also the space needed to prepare materials, consult other people, do the work and make revisions. For someone who needs the passage of time to remain visible, this format may be one of the best and simplest solutions.',
      ],
    },
    {
      heading: 'A linear calendar moves the plan from memory onto paper',
      paragraphs: [
        'The Awesome Calendar is a printable linear calendar that lets you view the whole year without switching between screens. You can use it to mark projects, appointments, trips, school dates, payments and time for rest. These elements begin to form one map instead of a collection of separate reminders.',
        'It helps to place a paper calendar somewhere you look every day. You do not need to remember to open an app or select the right view. The plan remains visible, and marking the current day makes it easy to check what is approaching and how much time is actually left.',
      ],
    },
    {
      heading: 'How can you use a linear calendar with ADHD?',
      paragraphs: [
        'Start by entering dates you cannot move: appointments, trips, exams, project deadlines and important family events. Then choose one larger goal and plan backwards from its deadline. Mark the final date and add the earlier stages. A large task becomes a series of smaller steps placed along the timeline.',
        'Do not try to plan the entire year in detail straight away. You can begin with the next six or eight weeks. Use two or three colours, perhaps one for work, one for personal life and one for rest. The simpler the system, the less energy it requires to maintain.',
        'Your phone calendar can still remind you about the exact time of a meeting. A paper linear calendar has a different role: it shows the wider perspective. The two tools do not need to compete. Your phone can take care of the details of the day, while the calendar on the wall helps you assess whole weeks and months.',
      ],
    },
    {
      heading: 'A good plan supports you instead of judging you',
      paragraphs: [
        'A calendar does not diagnose or treat ADHD. It can, however, support everyday organisation, help record important dates and reduce the number of things you need to remember. If a plan stops working, that does not mean you have failed. It may need less detail, a different location or a simpler way to mark priorities.',
        'The best calendar is one that remains understandable and that you want to return to. For many people with ADHD, a linear calendar may be a good choice because it turns abstract time into visible space. It will not solve every problem, but it can make the next step, a deadline and the free space between them easier to notice.',
      ],
    },
  ],
  sources: [
    {
      label:
        'NIMH: ADHD in adults - organisation, planning and time management',
      url: 'https://www.nimh.nih.gov/health/publications/adhd-what-you-need-to-know',
    },
    {
      label: 'Meta-analysis: altered perceptual timing abilities in ADHD',
      url: 'https://pubmed.ncbi.nlm.nih.gov/34923055/',
    },
    {
      label:
        'Randomised study: time-management, organisation and planning training for adults with ADHD',
      url: 'https://pubmed.ncbi.nlm.nih.gov/20231319/',
    },
  ],
};

export const BLOG_ARTICLES: Record<SiteLanguage, BlogArticle[]> = {
  pl: [
    adhdPlanningPl,
    septemberQ4PlanningPl,
    freeCalendar2027Pl,
    multipleChildrenPl,
    schoolCalendarPl,
    projectManagementPl,
    printableGanttPl,
    weddingPlanningPl,
    contentCalendarPl,
    planYearPl,
    linearCalendarExplainedPl,
    monthlyPlanningPl,
    bestCalendarPl,
    habitTrackingPl,
    montessoriPl,
  ],
  en: [
    adhdPlanningEn,
    septemberQ4PlanningEn,
    freeCalendar2027En,
    multipleChildrenEn,
    schoolCalendarEn,
    projectManagementEn,
    printableGanttEn,
    weddingPlanningEn,
    contentCalendarEn,
    planYearEn,
    linearCalendarExplainedEn,
    monthlyPlanningEn,
    bestCalendarEn,
    habitTrackingEn,
    montessoriEn,
  ],
};

export const BLOG_COPY = {
  pl: {
    label: 'Blog o planowaniu',
    indexTitle: 'CZAS W JEDNEJ LINII.',
    indexLead:
      'Praktycznie o kalendarzach liniowych, planowaniu roku i ogarnianiu wielu terminów bez dokładania sobie kolejnego systemu.',
    topics: 'Ostatnie wpisy',
    expandTopics: 'Rozwiń',
    collapseTopics: 'Zwiń',
    readArticle: 'Czytaj artykuł',
    published: 'Opublikowano',
    keywords: 'Słowa kluczowe',
    sources: 'Badania i źródła',
    sourcesNote:
      'Materiały opisują ADHD, postrzeganie czasu i strategie planowania. Nie badają skuteczności konkretnego kalendarza.',
    allArticles: 'Wszystkie artykuły',
    backToBlog: 'Wróć do bloga',
    download: {
      kicker: 'Kalendarz do artykułu',
      title: 'TEN ROK NA JEDNEJ OSI.',
      lead: 'Zobacz plan w praktyce. Pobierz gotowy kalendarz albo ustaw własny zakres dat.',
      current: 'Pobierz kalendarz {year}',
      next: 'Pobierz kalendarz {year}',
      generate: 'Wygeneruj własny',
      preview: 'Podgląd kalendarza liniowego {year}',
      working: 'Generuję PDF…',
      failed: 'Nie udało się wygenerować pliku. Spróbuj ponownie.',
    },
  },
  en: {
    label: 'Planning blog',
    indexTitle: 'TIME IN ONE LINE.',
    indexLead:
      'Practical ideas about linear calendars, planning a whole year and managing many dates without adding another complicated system.',
    topics: 'Latest posts',
    expandTopics: 'Expand',
    collapseTopics: 'Collapse',
    readArticle: 'Read article',
    published: 'Published',
    keywords: 'Keywords',
    sources: 'Research and sources',
    sourcesNote:
      'These materials cover ADHD, time perception and planning strategies. They do not test the effectiveness of any specific calendar.',
    allArticles: 'All articles',
    backToBlog: 'Back to the blog',
    download: {
      kicker: 'Calendar for this article',
      title: 'THIS YEAR ON ONE LINE.',
      lead: 'Put the idea into practice. Download a ready-made calendar or choose your own date range.',
      current: 'Download calendar {year}',
      next: 'Download calendar {year}',
      generate: 'Generate your own',
      preview: 'Preview of the {year} linear calendar',
      working: 'Generating PDF…',
      failed: 'The PDF could not be generated. Please try again.',
    },
  },
} as const;

export function blogPath(language: SiteLanguage, slug?: string) {
  const base = `/${language}/blog`;
  return slug ? `${base}/${slug}` : base;
}

export function getBlogArticle(language: SiteLanguage, slug: string) {
  return BLOG_ARTICLES[language].find((article) => article.slug === slug);
}

export function getTranslatedArticle(
  language: SiteLanguage,
  articleId: string,
) {
  return BLOG_ARTICLES[language].find((article) => article.id === articleId);
}
