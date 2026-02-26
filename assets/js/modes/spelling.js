(function() {
  let pool = [];
  let currentIndex = 0;
  let score = 0;
  let hintCount = 0;
  let startTime = 0;
  let canCheck = true;

  function normalize(text) {
    return text.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // usuwa akcenty dla łatwiejszego wpisywania na polskiej klawiaturze
  }

  function startSpelling() {
    const list = dataset();
    if (!list.length) return;

    const limit = LEVELS[currentLevel].len || 10;
    pool = shuffle([...list]).slice(0, limit);
    
    currentIndex = 0;
    score = 0;
    startTime = performance.now();
    canCheck = true;

    resetUI();
    show('spelling');
    nextSpQuestion();
  }

  function resetUI() {
    document.getElementById('spSummary').classList.add('hidden');
    document.getElementById('spScore').textContent = '0';
    document.getElementById('spFill').style.width = '0%';
    document.getElementById('spTotal').textContent = pool.length;
    document.getElementById('spInput').value = '';
    document.getElementById('spInput').style.borderColor = 'rgba(255,255,255,0.2)';
    document.getElementById('spInput').disabled = false;
  }

  function nextSpQuestion() {
    if (currentIndex >= pool.length) {
      endSpelling();
      return;
    }

    canCheck = true;
    hintCount = 0;
    const item = pool[currentIndex];
    
    document.getElementById('spNum').textContent = currentIndex + 1;
    document.getElementById('spPl').textContent = item.pl;
    document.getElementById('spVisual').innerHTML = renderItemVisual(item, '8rem');
    document.getElementById('spFill').style.width = (currentIndex / pool.length * 100) + '%';
    
    const input = document.getElementById('spInput');
    input.value = '';
    input.style.borderColor = 'rgba(255,255,255,0.2)';
    input.disabled = false;
    input.focus();
    
    updateHintText();
  }

  function updateHintText() {
    const item = pool[currentIndex];
    const word = item.es;
    let hint = '';
    for (let i = 0; i < word.length; i++) {
      if (i < hintCount || word[i] === ' ') {
        hint += word[i];
      } else {
        hint += '_';
      }
    }
    document.getElementById('spHintText').textContent = hint;
  }

  function checkSpelling() {
    if (!canCheck || currentIndex >= pool.length) return;
    
    const inputEl = document.getElementById('spInput');
    const userVal = normalize(inputEl.value);
    const correctVal = normalize(pool[currentIndex].es);

    if (userVal === correctVal) {
      handleCorrect();
    } else {
      handleIncorrect();
    }
  }

  function handleCorrect() {
    canCheck = false;
    score++;
    document.getElementById('spScore').textContent = score;
    const inputEl = document.getElementById('spInput');
    inputEl.style.borderColor = '#10b981';
    inputEl.disabled = true;

    if (typeof toast === 'function') toast('¡Excelente! 🌟');
    
    setTimeout(() => {
      currentIndex++;
      nextSpQuestion();
    }, 1200);
  }

  function handleIncorrect() {
    const inputEl = document.getElementById('spInput');
    inputEl.style.borderColor = '#ef4444';
    
    // Pulse effect
    inputEl.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(0)' }
    ], { duration: 200, iterations: 2 });

    if (typeof toast === 'function') toast('Spróbuj jeszcze raz! ❌');
    
    // Automatyczna podpowiedź przy błędzie
    showHint();
  }

  function showHint() {
    const word = pool[currentIndex].es;
    if (hintCount < word.length) {
      hintCount++;
      updateHintText();
    }
  }

  function endSpelling() {
    const elapsed = (performance.now() - startTime) / 1000;
    const xp = score * 10;
    
    if (typeof addXP === 'function') addXP(xp, 'Wpisz słowo');
    if (score === pool.length && typeof launchConfetti === 'function') launchConfetti();

    document.getElementById('spFill').style.width = '100%';
    document.getElementById('spFinalStats').textContent = `Wynik: ${score}/${pool.length} (Czas: ${elapsed.toFixed(1)} s). Zdobyto ${xp} XP.`;
    document.getElementById('spSummary').classList.remove('hidden');

    // Stats
    const st = getModeStats('SPELLING', currentLevel, currentCat);
    st.games = (st.games || 0) + 1;
    st.totalCorrect += score;
    st.totalQuestions += pool.length;
    if (!st.bestScore || score > st.bestScore) st.bestScore = score;
    setModeStats('SPELLING', currentLevel, currentCat, st);
    updateGlobalStats();
  }

  window.startSpelling = startSpelling;

  // Globalny listener (delegacja)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.id === 'spSumMenuBtn') show('menu');
    if (btn.id === 'spSumRetryBtn') startSpelling();
    if (btn.getAttribute('data-go') === 'spelling') startSpelling();
    if (btn.id === 'spCheckBtn') checkSpelling();
    if (btn.id === 'spHintBtn') showHint();
    if (btn.id === 'spSkipBtn') {
      currentIndex++;
      nextSpQuestion();
    }
  });
})();
