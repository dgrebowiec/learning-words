(function() {
  let cards = [];
  let flipped = [];
  let matches = 0;
  let totalPairs = 0;
  let startTime = 0;
  let timerInterval = null;

  function startMemory() {
    const list = dataset();
    if (!list.length) return;

    // Poziomy: LATWY=6 par, SREDNI=8 par, TRUDNY=10 par
    const pairCounts = { LATWY: 6, SREDNI: 8, TRUDNY: 10 };
    totalPairs = Math.min(pairCounts[currentLevel] || 6, list.length);
    
    const selected = pick(list, totalPairs);
    const pool = [];
    selected.forEach(item => {
      // Każda para to dwa obiekty: jeden z wizualizacją, drugi ze słowem
      pool.push({ ...item, type: 'visual', id: item.es });
      pool.push({ ...item, type: 'word', id: item.es });
    });

    cards = shuffle(pool);
    flipped = [];
    matches = 0;
    
    renderGrid();
    resetUI();
    startTimer();
    show('memory');
  }

  function renderGrid() {
    const grid = document.getElementById('memoryGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    // Ustawienie liczby kolumn w zależności od liczby par
    const cols = totalPairs > 8 ? 5 : 4;
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    cards.forEach((card, index) => {
      const el = document.createElement('div');
      el.className = 'memory-card';
      el.dataset.index = index;
      
      const inner = document.createElement('div');
      inner.className = 'memory-card-inner';
      
      const front = document.createElement('div');
      front.className = 'memory-card-front';
      front.textContent = '?';
      
      const back = document.createElement('div');
      back.className = 'memory-card-back';
      
      if (card.type === 'visual') {
        back.innerHTML = renderItemVisual(card, '3rem');
      } else {
        back.innerHTML = `<span class="mem-word">${card.es}</span>`;
      }
      
      inner.appendChild(front);
      inner.appendChild(back);
      el.appendChild(inner);
      
      el.addEventListener('click', () => handleFlip(el, index));
      grid.appendChild(el);
    });
  }

  function handleFlip(el, index) {
    if (flipped.length >= 2 || el.classList.contains('flipped') || el.classList.contains('matched')) return;

    if (typeof AudioFX !== 'undefined' && AudioFX.pop) AudioFX.pop();
    el.classList.add('flipped');
    flipped.push({ el, index });

    if (flipped.length === 2) {
      checkMatch();
    }
  }

  function checkMatch() {
    const [c1, c2] = flipped;
    const item1 = cards[c1.index];
    const item2 = cards[c2.index];

    if (item1.id === item2.id) {
      // Match!
      if (typeof AudioFX !== 'undefined') AudioFX.correct();
      if (typeof speakEs === 'function') speakEs(item1.es);
      setTimeout(() => {
        c1.el.classList.add('matched');
        c2.el.classList.add('matched');
        matches++;
        if (typeof registerCorrectAnswer === 'function') registerCorrectAnswer(item1);
        updateProgress();
        flipped = [];
        if (matches === totalPairs) endMemory();
      }, 500);
    } else {
      // No match
      if (typeof AudioFX !== 'undefined') AudioFX.wrong();
      setTimeout(() => {
        c1.el.classList.remove('flipped');
        c2.el.classList.remove('flipped');
        flipped = [];
      }, 1000);
    }
  }

  function updateProgress() {
    document.getElementById('memPairs').textContent = `${matches}/${totalPairs}`;
  }

  function startTimer() {
    startTime = performance.now();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      document.getElementById('memTime').textContent = elapsed.toFixed(1) + ' s';
    }, 100);
  }

  function resetUI() {
    document.getElementById('memSummary').classList.add('hidden');
    updateProgress();
  }

  function summaryMessage(pct) {
    if (pct >= 100) return '¡Perfecto! Wszystkie pary dopasowane! 🏆';
    if (pct >= 80) return 'Świetna robota! Prawie ideał! 💪';
    if (pct >= 60) return 'Dobrze idzie! Ćwicz dalej! 😊';
    return 'Nie poddawaj się – spróbuj jeszcze raz! 🌱';
  }

  function memoryStarPct(elapsed) {
    const threshold3 = totalPairs * 5;
    const threshold2 = totalPairs * 10;
    if (elapsed <= threshold3) return 100;
    if (elapsed <= threshold2) return 70;
    return 40;
  }

  function endMemory() {
    clearInterval(timerInterval);
    const elapsed = (performance.now() - startTime) / 1000;
    
    const xp = totalPairs * 8;
    if (typeof addXP === 'function') addXP(xp, 'Memory Game');
    if (typeof launchConfetti === 'function') launchConfetti();

    const pct = memoryStarPct(elapsed);
    if (typeof showStarRating === 'function') showStarRating(pct, 'memStarRating');

    document.getElementById('memFinalStats').textContent = `Ukończono w ${elapsed.toFixed(1)} s! Zdobyto ${xp} XP.`;
    const extra = document.getElementById('memSumExtra');
    if (extra) extra.textContent = summaryMessage(100);
    document.getElementById('memSummary').classList.remove('hidden');
    
    const st = getModeStats('MEMORY', currentLevel, currentCat);
    st.games = (st.games || 0) + 1;
    if (!st.bestTime || elapsed < st.bestTime) st.bestTime = elapsed;
    setModeStats('MEMORY', currentLevel, currentCat, st);
    updateGlobalStats();
  }

  window.startMemory = startMemory;

  document.addEventListener('click', (e) => {
    if (e.target.id === 'memMenuBtn' || e.target.id === 'memSumMenuBtn') {
      clearInterval(timerInterval);
      if (typeof goHome === 'function') goHome();
      else show('menu');
    }
    if (e.target.id === 'memGamesBtn' || e.target.id === 'memSumGamesBtn') { 
      clearInterval(timerInterval);
      if (typeof goToExercisePicker === 'function') goToExercisePicker();
      else if (typeof showModeSelect === 'function') showModeSelect(); 
    }
    if (e.target.id === 'memRetryBtn' || e.target.id === 'memSumRetryBtn') startMemory();
    if (e.target.getAttribute('data-go') === 'memory') startMemory();
  });
})();
