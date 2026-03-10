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
    
    // Obsługa klawisza Enter
    input.onkeydown = function(e) {
      if (e.key === 'Enter') {
        checkSpelling();
      }
    };
    
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
    if (typeof registerCorrectAnswer === 'function') registerCorrectAnswer(pool[currentIndex]);
    document.getElementById('spScore').textContent = score;
    const inputEl = document.getElementById('spInput');
    inputEl.style.borderColor = '#10b981';
    inputEl.disabled = true;

    if (typeof AudioFX !== 'undefined') AudioFX.correct();
    if (typeof toast === 'function') toast('¡Excelente! 🌟');
    
    setTimeout(() => {
      currentIndex++;
      nextSpQuestion();
    }, 1200);
  }

  function handleIncorrect() {
    const inputEl = document.getElementById('spInput');
    inputEl.style.borderColor = '#ef4444';
    
    inputEl.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)' },
      { transform: 'translateX(5px)' },
      { transform: 'translateX(0)' }
    ], { duration: 200, iterations: 2 });

    if (typeof AudioFX !== 'undefined') AudioFX.wrong();
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

  function spSummaryMessage(pct) {
    if (pct >= 100) return '¡Perfecto! Wpisałeś wszystkie słowa poprawnie! 🏆';
    if (pct >= 80) return 'Świetna robota! Prawie ideał! 💪';
    if (pct >= 60) return 'Dobry wynik! Ćwicz pisownię dalej! 😊';
    return 'Nie poddawaj się – z każdą rundą idzie lepiej! 🌱';
  }

  function endSpelling() {
    const elapsed = (performance.now() - startTime) / 1000;
    const xp = score * 10;
    
    if (typeof addXP === 'function') addXP(xp, 'Wpisz słowo');
    if (score === pool.length && typeof launchConfetti === 'function') launchConfetti();

    document.getElementById('spFill').style.width = '100%';
    const pct = pool.length ? Math.round((score / pool.length) * 100) : 0;
    if (typeof showStarRating === 'function') showStarRating(pct, 'spStarRating');

    document.getElementById('spFinalStats').textContent = `Wynik: ${score}/${pool.length} (${pct}%) • Czas: ${elapsed.toFixed(1)} s • +${xp} XP`;
    const extra = document.getElementById('spSumExtra');
    if (extra) extra.textContent = spSummaryMessage(pct);
    document.getElementById('spSummary').classList.remove('hidden');

    const st = getModeStats('SPELLING', currentLevel, currentCat);
    st.games = (st.games || 0) + 1;
    st.totalCorrect += score;
    st.totalQuestions += pool.length;
    if (!st.bestScore || score > st.bestScore) st.bestScore = score;
    setModeStats('SPELLING', currentLevel, currentCat, st);
    updateGlobalStats();
  }

  window.startSpelling = startSpelling;

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.id === 'spMenuBtn') show('menu');
    if (btn.id === 'spGamesBtn') { if (typeof showModeSelect === 'function') showModeSelect(); }
    if (btn.id === 'spSumMenuBtn') show('menu');
    if (btn.id === 'spSumGamesBtn') { if (typeof showModeSelect === 'function') showModeSelect(); }
    if (btn.id === 'spSumRetryBtn') startSpelling();
    if (btn.getAttribute('data-go') === 'spelling') startSpelling();
    if (btn.id === 'spCheckBtn') checkSpelling();
    if (btn.id === 'spHintBtn') showHint();
    if (btn.id === 'spPrevBtn') {
      if (currentIndex > 0) {
        currentIndex--;
        nextSpQuestion();
      }
    }
    if (btn.id === 'spSkipBtn') {
      currentIndex++;
      nextSpQuestion();
    }
  });
})();
