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
      btn.classList.add('correct');
      document.getElementById('artScore').textContent = score;
      if (typeof toast === 'function') toast('¡Muy bien! 🌟');
    } else {
      btn.classList.add('incorrect');
      // Pokaż poprawny przycisk
      const correctBtn = document.querySelector(`.large-art[data-art="${correct}"]`);
      if (correctBtn) correctBtn.classList.add('correct');
      if (typeof toast === 'function') toast('Ups! Spróbuj zapamiętać. 💡');
    }

    setTimeout(() => {
      currentIndex++;
      nextArtQuestion();
    }, 1000);
  }

  function endArticulos() {
    const elapsed = (performance.now() - startTime) / 1000;
    const xp = score * 4; // 4 XP za poprawny rodzajnik
    if (typeof addXP === 'function') addXP(xp, 'Gra El/La');
    if (score === pool.length && typeof launchConfetti === 'function') launchConfetti();

    document.getElementById('artFill').style.width = '100%';
    document.getElementById('artFinalStats').textContent = `Wynik: ${score}/${pool.length} (Czas: ${elapsed.toFixed(1)} s). Zdobyto ${xp} XP.`;
    document.getElementById('artSummary').classList.remove('hidden');

    // Zapisz statystyki
    const st = getModeStats('ARTICULOS', currentLevel, currentCat);
    st.games = (st.games || 0) + 1;
    st.totalCorrect += score;
    st.totalQuestions += pool.length;
    if (!st.bestScore || score > st.bestScore) st.bestScore = score;
    setModeStats('ARTICULOS', currentLevel, currentCat, st);
    updateGlobalStats();
  }

  window.startArticulos = startArticulos;

  // Globalny listener (delegacja)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    if (btn.id === 'artSumMenuBtn' || btn.id === 'artMenuBtn') show('menu');
    if (btn.id === 'artSumRetryBtn') startArticulos();
    if (btn.getAttribute('data-go') === 'articulos') startArticulos();
    if (btn.classList.contains('large-art')) handleArtClick(btn);
  });
})();
