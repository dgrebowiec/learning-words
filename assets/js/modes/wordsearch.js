(function() {
  const GRID_SIZE = 9;
  let grid = [];
  let wordsToFind = [];
  let foundWords = new Set();
  let isSelecting = false;
  let startCell = null;
  let currentSelection = [];
  let startTime = 0;

  function startWordSearch() {
    const list = dataset();
    if (!list.length) return;

    // Wybieramy 5-8 słów, które mają max 8 znaków
    const pool = shuffle(list.filter(w => w.es.length <= GRID_SIZE))
                 .slice(0, Math.min(6, list.length));
    
    wordsToFind = pool.map(w => ({
      es: w.es.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑ]/g, ''),
      original: w,
      found: false
    }));

    foundWords.clear();
    generateGrid();
    renderGrid();
    renderWordList();
    resetUI();
    startTime = performance.now();
    show('wordsearch');
  }

  function generateGrid() {
    // Inicjalizacja pustej siatki
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(''));

    wordsToFind.forEach(wordObj => {
      const word = wordObj.es;
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 50) {
        const direction = Math.random() > 0.5 ? 'H' : 'V'; // Poziomo lub Pionowo
        const row = Math.floor(Math.random() * (direction === 'V' ? GRID_SIZE - word.length + 1 : GRID_SIZE));
        const col = Math.floor(Math.random() * (direction === 'H' ? GRID_SIZE - word.length + 1 : GRID_SIZE));

        if (canPlaceWord(word, row, col, direction)) {
          for (let i = 0; i < word.length; i++) {
            const r = direction === 'V' ? row + i : row;
            const c = direction === 'H' ? col + i : col;
            grid[r][c] = word[i];
          }
          placed = true;
        }
        attempts++;
      }
    });

    // Wypełnienie pustych miejsc losowymi literami
    const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ";
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === '') {
          grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }
  }

  function canPlaceWord(word, row, col, direction) {
    for (let i = 0; i < word.length; i++) {
      const r = direction === 'V' ? row + i : row;
      const c = direction === 'H' ? col + i : col;
      if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
    }
    return true;
  }

  function renderGrid() {
    const container = document.getElementById('wsGrid');
    if (!container) return;
    container.innerHTML = '';
    container.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = document.createElement('div');
        cell.className = 'ws-cell';
        cell.textContent = grid[r][c];
        cell.dataset.row = r;
        cell.dataset.col = c;
        
        cell.addEventListener('mousedown', (e) => startSelection(r, c));
        cell.addEventListener('mouseover', (e) => updateSelection(r, c));
        
        // Touch events
        cell.addEventListener('touchstart', (e) => {
          e.preventDefault();
          startSelection(r, c);
        });

        container.appendChild(cell);
      }
    }

    window.addEventListener('mouseup', endSelection);
    container.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', endSelection);
  }

  function renderWordList() {
    const listEl = document.getElementById('wsWordList');
    if (!listEl) return;
    listEl.innerHTML = '';
    wordsToFind.forEach(w => {
      const item = document.createElement('div');
      item.className = 'ws-word-item';
      item.id = `ws-word-${w.es}`;
      item.innerHTML = `
        <span class="ws-word-visual">${renderItemVisual(w.original, '1.4rem')}</span>
        <span class="ws-word-labels">
          <span class="ws-word-es">${w.es}</span>
          <span class="ws-word-pl">${w.original.pl}</span>
        </span>
        <button class="ws-speak-btn" title="Posłuchaj po hiszpańsku" onclick="event.stopPropagation(); speakEs('${w.original.es.replace(/'/g, "\\'")}')">🔊</button>
      `;
      listEl.appendChild(item);
    });
  }

  function startSelection(r, c) {
    isSelecting = true;
    startCell = { r, c };
    clearSelectionStyles();
    updateSelection(r, c);
  }

  function updateSelection(r, c) {
    if (!isSelecting) return;

    // Dozwolone tylko proste linie (H lub V)
    if (r !== startCell.r && c !== startCell.c) return;

    clearSelectionStyles();
    currentSelection = [];
    
    const rStart = Math.min(startCell.r, r);
    const rEnd = Math.max(startCell.r, r);
    const cStart = Math.min(startCell.c, c);
    const cEnd = Math.max(startCell.c, c);

    for (let i = rStart; i <= rEnd; i++) {
      for (let j = cStart; j <= cEnd; j++) {
        const cell = document.querySelector(`.ws-cell[data-row="${i}"][data-col="${j}"]`);
        if (cell) {
          cell.classList.add('selecting');
          currentSelection.push({ r: i, c: j, char: grid[i][j] });
        }
      }
    }
  }

  function handleTouchMove(e) {
    if (!isSelecting) return;
    const touch = e.touches[0];
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    if (el && el.classList.contains('ws-cell')) {
      updateSelection(parseInt(el.dataset.row), parseInt(el.dataset.col));
    }
  }

  function endSelection() {
    if (!isSelecting) return;
    isSelecting = false;

    const selectedWord = currentSelection.map(s => s.char).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    const match = wordsToFind.find(w => !w.found && (w.es === selectedWord || w.es === reversedWord));

    if (match) {
      match.found = true;
      foundWords.add(match.es);
      markFound(currentSelection);
      document.getElementById(`ws-word-${match.es}`).classList.add('ws-word-found');
      if (typeof toast === 'function') toast(`¡Encontrado: ${match.es}! ✨`);
      
      if (foundWords.size === wordsToFind.length) {
        endWordSearch();
      }
    }

    clearSelectionStyles();
  }

  function clearSelectionStyles() {
    document.querySelectorAll('.ws-cell.selecting').forEach(el => el.classList.remove('selecting'));
  }

  function markFound(selection) {
    selection.forEach(s => {
      const cell = document.querySelector(`.ws-cell[data-row="${s.r}"][data-col="${s.c}"]`);
      if (cell) cell.classList.add('found');
    });
  }

  function resetUI() {
    document.getElementById('wsSummary').classList.add('hidden');
  }

  function endWordSearch() {
    const elapsed = (performance.now() - startTime) / 1000;
    const xp = wordsToFind.length * 15;
    if (typeof addXP === 'function') addXP(xp, 'Sopa de Letras');
    if (typeof launchConfetti === 'function') launchConfetti();

    document.getElementById('wsFinalStats').textContent = `Znaleziono ${foundWords.size} słów w ${elapsed.toFixed(1)} s. Zdobyto ${xp} XP.`;
    document.getElementById('wsSummary').classList.remove('hidden');

    const st = getModeStats('WORDSEARCH', currentLevel, currentCat);
    st.games = (st.games || 0) + 1;
    if (!st.bestTime || elapsed < st.bestTime) st.bestTime = elapsed;
    setModeStats('WORDSEARCH', currentLevel, currentCat, st);
    updateGlobalStats();
  }

  window.startWordSearch = startWordSearch;

  // Globalny listener (delegacja)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.id === 'wsMenuBtn' || btn.id === 'wsSumMenuBtn') show('menu');
    if (btn.id === 'wsRetryBtn' || btn.id === 'wsSumRetryBtn') startWordSearch();
    if (btn.getAttribute('data-go') === 'wordsearch') startWordSearch();
  });
})();
