# Learning Words - Hiszpański dla dzieci

## Opis
Aplikacja do nauki hiszpańskiego dla pierwszoklasistów (6-7 lat). Pure vanilla HTML/CSS/JS, zero frameworków.

## Jak uruchomić
Serwuj przez dowolny HTTP server z katalogu projektu:
```bash
npx serve .
# lub
python3 -m http.server 8000
```

## Struktura
- `index.html` - shell aplikacji
- `assets/html/*.html` - HTML partials (każdy tryb = osobny plik)
- `assets/js/app.js` - główna logika + utils
- `assets/js/data.js` - dane słówek (kategorie)
- `assets/js/bootstrap.js` - loader partiali i skryptów
- `assets/js/profiles.js` - system profili
- `assets/js/modes/*.js` - logika trybów gier
- `assets/css/style.css` - wszystkie style

## Dodawanie nowego trybu gry
1. Stwórz `assets/html/[nazwa].html`
2. Stwórz `assets/js/modes/[nazwa].js`
3. Dodaj do `PARTIALS` i `SCRIPTS` w `bootstrap.js`
4. Dodaj do `ALL_SECTIONS` w `app.js`
5. Dodaj `<div data-partial="[nazwa]"></div>` w `index.html`
6. Dodaj kartę trybu w `assets/html/menu.html`

## Zautomatyzowany workflow
Użyj skill `learning-words-dev` - symuluje pełny zespół deweloperski (PO, UX, Dev, Review, QA).
Trigger: powiedz "workflow", "nowa funkcjonalność", "sprint", "co dalej"

## Konwencje
- Zmienne: camelCase, stałe: UPPER_SNAKE_CASE
- Selektory: $() i $$()
- Nawigacja: show('sectionName')
- Język UI: polski, język nauczany: hiszpański
- Ton: mega pozytywny, motywujący, z emoji
