(function() {
  let pool = [];
  let currentIndex = 0;
  let score = 0;
  let startTime = 0;
  let canCheck = true;
  let currentSelection = [];
  let availableLetters = [];

  function normalize(text) {
    return text.toLowerCase().trim();
  }

  function startScramble() {
    const list = dataset();
    if (!list.length) return;

    const limit = LEVELS[currentLevel].len || 10;
    pool = shuffle([...list]).slice(0, limit);
    
    currentIndex = 0;
    score = 0;
    startTime = performance.now();
    canCheck = true;

    resetUI();
    show('scramble');
    nextScrQuestion();
  }

  function resetUI() {
    document.getElementById('scrSummary').classList.add('hidden');
    document.getElementById('scrScore').textContent = '0';
    document.getElementById('scrFill').style.width = '0%';
    document.getElementById('scrTotal').textContent = pool.length;
    document.getElementById('scrResult').innerHTML = '';
    document.getElementById('scrLetters').innerHTML = '';
    currentSelection = [];
  }

  function nextScrQuestion() {
    if (currentIndex >= pool.length) {
      endScramble();
      return;
    }

    canCheck = true;
    const item = pool[currentIndex];
    const word = item.es.toUpperCase();
    
    document.getElementById('scrNum').textContent = currentIndex + 1;
    document.getElementById('scrPl').textContent = item.pl;
    document.getElementById('scrVisual').innerHTML = renderItemVisual(item, '8rem');
    document.getElementById('scrFill').style.width = (currentIndex / pool.length * 100) + '%';
    
    currentSelection = [];
    availableLetters = word.split('').map((l, idx) => ({ char: l, id: idx }));
    shuffle(availableLetters);
    
    renderLetters();
    renderResult();
  }

  function renderLetters() {
    const container = document.getElementById('scrLetters');
    container.innerHTML = '';
    availableLetters.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'btn letter-btn';
      btn.textContent = item.char;
      btn.style.minWidth = '40px';
      btn.style.padding = '10px';
      btn.addEventListener('click', () => selectLetter(item));
      container.appendChild(btn);
    });
  }

  function renderResult() {
    const container = document.getElementById('scrResult');
    container.innerHTML = '';
    currentSelection.forEach((item, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn result-btn';
      btn.textContent = item.char;
      btn.style.minWidth = '40px';
      btn.style.padding = '10px';
      btn.style.background = 'rgba(255,255,255,0.1)';
      btn.addEventListener('click', () => unselectLetter(idx));
      container.appendChild(btn);
    });
    
    // Puste miejsca
    const targetLen = pool[currentIndex].es.length;
    for (let i = currentSelection.length; i < targetLen; i++) {
        const slot = document.createElement('div');
        slot.style.width = '40px';
        slot.style.height = '40px';
        slot.style.borderBottom = '2px solid rgba(255,255,255,0.3)';
        slot.style.margin = '0 2px';
        container.appendChild(slot);
    }
  }

  function selectLetter(item) {
    if (!canCheck) return;
    availableLetters = availableLetters.filter(l => l.id !== item.id);
    currentSelection.push(item);
    renderLetters();
    renderResult();
    
    if (currentSelection.length === pool[currentIndex].es.length) {
        checkScramble();
    }
  }

  function unselectLetter(idx) {
    if (!canCheck) return;
    const item = currentSelection.splice(idx, 1)[0];
    availableLetters.push(item);
    renderLetters();
    renderResult();
  }

  function checkScramble() {
    if (!canCheck || currentIndex >= pool.length) return;
    
    const userVal = currentSelection.map(l => l.char).join('').toLowerCase();
    const correctVal = pool[currentIndex].es.toLowerCase();

    if (userVal === correctVal) {
      handleCorrect();
    } else {
      // Jeśli pełne słowo i błędne
      if (currentSelection.length === correctVal.length) {
          handleIncorrect();
      }
    }
  }

  function handleCorrect() {
    canCheck = false;
    score++;
    if (typeof registerCorrectAnswer === 'function') registerCorrectAnswer(pool[currentIndex]);
    document.getElementById('scrScore').textContent = score;
    
    const resultBtns = document.querySelectorAll('.result-btn');
    resultBtns.forEach(b => b.style.background = 'var(--good)');

    if (typeof AudioFX !== 'undefined') AudioFX.correct();
    if (typeof speakEs === 'function') speakEs(pool[currentIndex].es);
    if (typeof toast === 'function') toast('¡Muy bien! 🌟');
    
    setTimeout(() => {
      currentIndex++;
      nextScrQuestion();
    }, 1200);
  }

  function handleIncorrect() {
    const container = document.getElementById('scrResult');
    container.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(0)' }
    ], { duration: 200, iterations: 2 });

    if (typeof AudioFX !== 'undefined') AudioFX.wrong();
    if (typeof toast === 'function') toast('Spróbuj jeszcze raz! ❌');
    
    const resultBtns = document.querySelectorAll('.result-btn');
    resultBtns.forEach(b => {
      b.style.background = 'var(--bad)';
      b.style.borderColor = 'var(--bad)';
    });
    
    setTimeout(() => {
      resultBtns.forEach(b => {
        b.style.background = 'rgba(255,255,255,0.1)';
        b.style.borderColor = '';
      });
    }, 800);
  }

  function resetCurrentQuestion() {
      const item = pool[currentIndex];
      availableLetters = item.es.toUpperCase().split('').map((l, idx) => ({ char: l, id: idx }));
      shuffle(availableLetters);
      currentSelection = [];
      renderLetters();
      renderResult();
  }

  function showHint() {
    if (!canCheck || currentIndex >= pool.length) return;
    
    const correctWord = pool[currentIndex].es.toUpperCase();
    const nextIdx = currentSelection.length;
    
    if (nextIdx >= correctWord.length) return;
    
    const expectedChar = correctWord[nextIdx];
    
    // Znajdź tę literę w dostępnych
    const foundIdx = availableLetters.findIndex(l => l.char === expectedChar);
    
    if (foundIdx !== -1) {
      const letterItem = availableLetters.splice(foundIdx, 1)[0];
      currentSelection.push(letterItem);
      renderLetters();
      renderResult();
      
      if (currentSelection.length === correctWord.length) {
        checkScramble();
      }
    } else {
      // Jeśli litery nie ma w dostępnych, oznacza to że użytkownik wpisał coś źle wcześniej
      // Resetujemy i dajemy podpowiedź od nowa dla tego miejsca
      resetCurrentQuestion();
      showHint();
    }
  }

  function scrSummaryMessage(pct) {
    if (pct >= 100) return '¡Perfecto! Ułożyłeś wszystkie słowa! 🏆';
    if (pct >= 80) return 'Świetna robota! Prawie idealny wynik! 💪';
    if (pct >= 60) return 'Dobry wynik! Ćwicz układanie dalej! 😊';
    return 'Nie poddawaj się – z każdą rundą idzie lepiej! 🌱';
  }

  function endScramble() {
    const elapsed = (performance.now() - startTime) / 1000;
    const xp = score * 12;
    
    if (typeof addXP === 'function') addXP(xp, 'Ułóż słowo');
    if (score === pool.length && typeof launchConfetti === 'function') launchConfetti();

    document.getElementById('scrFill').style.width = '100%';
    const pct = pool.length ? Math.round((score / pool.length) * 100) : 0;
    if (typeof showStarRating === 'function') showStarRating(pct, 'scrStarRating');

    document.getElementById('scrFinalStats').textContent = `Wynik: ${score}/${pool.length} (${pct}%) • Czas: ${elapsed.toFixed(1)} s • +${xp} XP`;
    const extra = document.getElementById('scrSumExtra');
    if (extra) extra.textContent = scrSummaryMessage(pct);
    document.getElementById('scrSummary').classList.remove('hidden');

    const st = getModeStats('SCRAMBLE', currentLevel, currentCat);
    st.games = (st.games || 0) + 1;
    st.totalCorrect += score;
    st.totalQuestions += pool.length;
    if (!st.bestScore || score > st.bestScore) st.bestScore = score;
    setModeStats('SCRAMBLE', currentLevel, currentCat, st);
    updateGlobalStats();
  }

  window.startScramble = startScramble;

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.id === 'scrMenuBtn' || btn.id === 'scrSumMenuBtn') {
      if (typeof goHome === 'function') goHome();
      else show('menu');
    }
    if (btn.id === 'scrGamesBtn' || btn.id === 'scrSumGamesBtn') {
      if (typeof goToExercisePicker === 'function') goToExercisePicker();
      else if (typeof showModeSelect === 'function') showModeSelect();
    }
    if (btn.id === 'scrSumRetryBtn') startScramble();
    if (btn.getAttribute('data-go') === 'scramble') startScramble();
    if (btn.id === 'scrResetBtn') resetCurrentQuestion();
    if (btn.id === 'scrHintBtn') showHint();
    if (btn.id === 'scrCheckBtn') checkScramble();
    if (btn.id === 'scrPrevBtn') {
      if (currentIndex > 0) {
        currentIndex--;
        nextScrQuestion();
      }
    }
    if (btn.id === 'scrSkipBtn') {
      currentIndex++;
      nextScrQuestion();
    }
  });
})();
