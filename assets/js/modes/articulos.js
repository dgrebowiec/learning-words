(function() {
  let pool = [];
  let currentIndex = 0;
  let score = 0;
  let canClick = true;
  let startTime = 0;

  function startArticulos() {
    const list = dataset();
    // Filtrujemy tylko słowa z zdefiniowanym rodzajnikiem el/la
    pool = shuffle(list.filter(item => item.article === 'el' || item.article === 'la'));

    if (!pool.length) {
      if (typeof toast === 'function') toast('Brak słów z rodzajnikami w tej kategorii.');
      return;
    }

    // Limitujemy rundę do max 10 pytań (lub mniej jeśli brak słów)
    const limit = LEVELS[currentLevel].len || 10;
    pool = pool.slice(0, limit);

    currentIndex = 0;
    score = 0;
    canClick = true;
    startTime = performance.now();

    resetUI();
    show('articulos');
    nextArtQuestion();
  }

  function resetUI() {
    document.getElementById('artSummary').classList.add('hidden');
    document.getElementById('artScore').textContent = '0';
    document.getElementById('artFill').style.width = '0%';
    document.getElementById('artTotal').textContent = pool.length;
    
    // Reset kolorów przycisków
    const buttons = document.querySelectorAll('.large-art');
    buttons.forEach(btn => {
      btn.classList.remove('correct', 'incorrect');
      btn.disabled = false;
    });
  }

  function nextArtQuestion() {
    if (currentIndex >= pool.length) {
      endArticulos();
      return;
    }

    canClick = true;
    const item = pool[currentIndex];
    document.getElementById('artNum').textContent = currentIndex + 1;
    document.getElementById('artWord').textContent = item.es;
    document.getElementById('artPl').textContent = '(' + item.pl + ')';
    document.getElementById('artVisual').innerHTML = renderItemVisual(item, '8rem');
    
    if (typeof speakEs === 'function') speakEs(item.es);
    
    const fill = (currentIndex / pool.length) * 100;
    document.getElementById('artFill').style.width = fill + '%';

    // Reset kolorów przycisków przed nowym pytaniem
    const buttons = document.querySelectorAll('.large-art');
    buttons.forEach(btn => btn.classList.remove('correct', 'incorrect'));
  }

  function handleArtClick(btn) {
    if (!canClick) return;
    canClick = false;

    const selected = btn.dataset.art;
    const correct = pool[currentIndex].article;
    const isOk = selected === correct;

    if (isOk) {
      score++;
      if (typeof registerCorrectAnswer === 'function') registerCorrectAnswer(pool[currentIndex]);
      btn.classList.add('correct', 'anim-bounce');
      document.getElementById('artScore').textContent = score;
      if (typeof AudioFX !== 'undefined') AudioFX.correct();
      if (typeof toast === 'function') toast('¡Muy bien! 🌟');
    } else {
      btn.classList.add('incorrect', 'anim-shake');
      const correctBtn = document.querySelector(`.large-art[data-art="${correct}"]`);
      if (correctBtn) correctBtn.classList.add('correct');
      if (typeof AudioFX !== 'undefined') AudioFX.wrong();
      if (typeof toast === 'function') toast('Ups! Spróbuj zapamiętać. 💡');
    }

    setTimeout(() => {
      currentIndex++;
      nextArtQuestion();
    }, 1000);
  }

  function artSummaryMessage(pct) {
    if (pct >= 100) return '¡Perfecto! Wszystkie rodzajniki poprawne! 🏆';
    if (pct >= 80) return 'Świetna znajomość rodzajników! 💪';
    if (pct >= 60) return 'Dobry wynik! Ćwicz el/la dalej! 😊';
    return 'Nie poddawaj się – rodzajniki to trudna sprawa! 🌱';
  }

  function endArticulos() {
    const elapsed = (performance.now() - startTime) / 1000;
    const xp = score * 4;
    if (typeof addXP === 'function') addXP(xp, 'Gra El/La');
    if (score === pool.length && typeof launchConfetti === 'function') launchConfetti();

    document.getElementById('artFill').style.width = '100%';
    const pct = pool.length ? Math.round((score / pool.length) * 100) : 0;
    if (typeof showStarRating === 'function') showStarRating(pct, 'artStarRating');

    document.getElementById('artFinalStats').textContent = `Wynik: ${score}/${pool.length} (${pct}%) • Czas: ${elapsed.toFixed(1)} s • +${xp} XP`;
    const extra = document.getElementById('artSumExtra');
    if (extra) extra.textContent = artSummaryMessage(pct);
    document.getElementById('artSummary').classList.remove('hidden');

    const st = getModeStats('ARTICULOS', currentLevel, currentCat);
    st.games = (st.games || 0) + 1;
    st.totalCorrect += score;
    st.totalQuestions += pool.length;
    if (!st.bestScore || score > st.bestScore) st.bestScore = score;
    setModeStats('ARTICULOS', currentLevel, currentCat, st);
    updateGlobalStats();
  }

  window.startArticulos = startArticulos;

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.id === 'artMenuBtn' || btn.id === 'artSumMenuBtn') {
      if (typeof goHome === 'function') goHome();
      else show('menu');
    }
    if (btn.id === 'artGamesBtn' || btn.id === 'artSumGamesBtn') {
      if (typeof goToExercisePicker === 'function') goToExercisePicker();
      else if (typeof showModeSelect === 'function') showModeSelect();
    }
    if (btn.id === 'artPrevBtn') {
      if (currentIndex > 0) {
        currentIndex--;
        nextArtQuestion();
      }
    }
    if (btn.id === 'artSumRetryBtn') startArticulos();
    if (btn.getAttribute('data-go') === 'articulos') startArticulos();
    if (btn.classList.contains('large-art')) handleArtClick(btn);
  });
})();
