# Learning Words - Konwencje Projektu

## Tech Stack
- Pure vanilla HTML/CSS/JS (zero frameworks, zero build tools)
- HTML partials loaded via bootstrap.js (data-partial system)
- CSS custom properties in :root (--bg, --accent, --good, --bad, etc.)
- localStorage for persistence (stats, badges, XP, achievements, profiles)
- No npm, no bundler, no TypeScript - serve via simple HTTP server

## Architektura
- `index.html` - shell z data-partial placeholders
- `assets/html/*.html` - fragmenty HTML (każdy tryb gry = osobny plik)
- `assets/js/app.js` - główna logika, utils, system statystyk/odznak/XP/sklepu
- `assets/js/data.js` - dane kategorii słów (FRUITS, VEGGIES, EMOCIONES, etc.)
- `assets/js/bootstrap.js` - loader partiali i skryptów
- `assets/js/profiles.js` - system profili graczy
- `assets/js/modes/*.js` - logika poszczególnych trybów gier
- `assets/js/confetti.js` - efekty konfetti
- `assets/css/style.css` - wszystkie style w jednym pliku

## Konwencje Kodu
- Zmienne: camelCase
- Stałe: UPPER_SNAKE_CASE
- Selektory DOM: `$()` i `$$()` (zdefiniowane w app.js)
- Sekcje/tryby: show/hide via `.hidden` class
- Nawigacja: `show(sectionName)` function
- Nowe tryby gier: dodaj HTML partial + JS w modes/ + zarejestruj w bootstrap.js + ALL_SECTIONS
- Dane słówek: obiekty {img/emoji, pl, es, article?}
- Język interfejsu: polski
- Język nauczany: hiszpański

## Targetowa Grupa
- Pierwszoklasiści (6-7 lat)
- Interfejs MUSI być mega prosty, kolorowy, z dużymi przyciskami
- Emoji wszędzie gdzie się da
- Duże fonty, jasne kolory, zaokrąglone kształty
- Zero skomplikowanych słów w UI
