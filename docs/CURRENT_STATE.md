# Learning Words - Current State

## Aplikacja i Główne Moduły
- Aplikacja typu Single Page Application (SPA), bez frameworków, oparta na Vanilla JS.
- Zaimplementowany system nawigacji bazujący na chowaniu/pokazywaniu `section`.
- Elementy wspólne w `assets/html` pobierane dynamicznie przy starcie (`bootstrap.js`).
- Posiada system walut (gwiazdki `⭐`), punktów doświadczenia (`XP`) oraz serii dni (`streak`).

## Kategorie Słówek
Dostępne kategorie:
1. Owoce (FRUITS)
2. Warzywa (VEGGIES)
3. Emocje (EMOCIONES)
4. Zaimki (PRONOMBRES)
5. Kolory (COLORES)
6. Przybory szkolne (MATERIAL_ESCOLAR)
7. Halloween (HALLOWEEN)
8. Boże Narodzenie (NAVIDAD)
9. Jesień (OTONO)
10. Zima (INVIERNO)
11. Pory roku (ESTACIONES)
12. Wszystko (MIXED)

## Tryby Gry
1. **Fiszki (Flashcards)** - Przeglądanie słówek z odsłuchem.
2. **Quiz PL -> ES** - Wybór hiszpańskiego słowa do polskiego tłumaczenia.
3. **Wybierz element** - Wybór obrazka do hiszpańskiego słowa.
4. **Memory** - Gra typu memo, łączenie obrazka/polskiego słowa z hiszpańskim.
5. **El / La (Articulos)** - Dopasowywanie rodzajnika.
6. **Sopa de Letras (Wordsearch)** - Szukanie słów w siatce liter.
7. **Wpisz słowo (Spelling)** - Wpisywanie hiszpańskiego słowa z klawiatury.
8. **Ułóż słowo (Scramble)** - Układanie słowa z rozsypanych liter.
9. **Powtórz słowo (Repeat)** - Ćwiczenie wymowy z mikrofonem.
10. **Wyścig z czasem (Timerace)** - Odpowiadanie na pytania z limitem czasowym 60s.

## Inne Funkcjonalności
- **Tamagotchi** - wirtualny zwierzak rosnący wraz z postępami.
- **Misje dnia** - codzienne wyzwania dodające XP.
- **Sklep z odznakami** - możliwość wymiany zdobytych gwiazdek na "naklejki".

## Zidentyfikowane Problemy / Miejsca do Poprawy
- `Spelling` (Wpisz słowo): Brak obsługi klawisza Enter. Dziecko musi klikać przycisk "Sprawdź", co może być frustrujące.
- `Memory`: Klikanie kart - przy szybkim klikaniu wszystko może działać dobrze, ale brak powiązania typowych dźwięków? Ocenimy dokładniej.
- `Wordsearch`: Złożoność słów do znalezienia jest ok, wpisywanie na urządzeniach dotykowych ma eventy. Brak wyraźnego błędu.
- Ogólna stabilność jest wysoka, ale mniejsze UX/UI bugi mogą wciąż istnieć.

## Podsumowanie dla PO
Zarówno moduł "Gra w Memory" jak i "Kategorie Słówek" zostały już całkowicie zrealizowane i włączone do aplikacji.
Wyzwania Dnia (Daily Quests) są obecne (Misje), a Tryb Pisania (Spelling) również istnieje. Jednakże Spelling i Scramble można by ulepszyć pod kątem użyteczności dla 6/7 latków.

Możemy skupić się na poprawkach UX lub nowych pomysłach.
