(function() {
  let pool = [];
  let currentItem = null;
  let score = 0;
  let timeLeft = 60;
  let timerInterval = null;
  let inProgress = false;
  let learnedInSession = new Set();

  function startTimerace() {
    pool = [...dataset()];
    if (!pool.length) return;
    
    score = 0;
    timeLeft = 60;
    inProgress = true;
    learnedInSession.clear();
    
    document.getElementById('trSummary').classList.add('hidden');
    document.getElementById('trScore').textContent = score;
    document.getElementById('trTime').textContent = timeLeft + 's';
    
    show('timerace');
    nextRound();
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        timeLeft = 0;
        document.getElementById('trTime').textContent = '0s';
        endGame();
      } else {
        document.getElementById('trTime').textContent = timeLeft + 's';
        if (timeLeft <= 10) {
          document.getElementById('trTime').style.color = 'var(--danger)';
        } else {
          document.getElementById('trTime').style.color = '';
        }
      }
    }, 1000);
  }

  function nextRound() {
    if (!inProgress) return;
    currentItem = pool[Math.floor(Math.random() * pool.length)];
    
    const visual = document.getElementById('trVisual');
    visual.innerHTML = renderItemVisual(currentItem, '5rem');
    
    const optsCount = LEVELS[currentLevel]?.options || 4;
    const distractors = pick(dataset().filter(x => x.es !== currentItem.es), optsCount - 1);
    const options = shuffle([currentItem, ...distractors]);
    
    const optsContainer = document.getElementById('trOptions');
    optsContainer.innerHTML = '';
    
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'btn choice';
      btn.textContent = opt.es;
      btn.addEventListener('click', () => handleAnswer(opt.es === currentItem.es, btn));
      optsContainer.appendChild(btn);
    });
  }

  function handleAnswer(isCorrect, btn) {
    if (!inProgress) return;
    if (isCorrect) {
      if (typeof AudioFX !== 'undefined') AudioFX.correct();
      btn.classList.add('correct');
      score++;
      if (typeof registerCorrectAnswer === 'function') registerCorrectAnswer(currentItem);
      timeLeft += 2; // Bonus +2s
      if (typeof speak === 'function') speak(currentItem.es);
      document.getElementById('trScore').textContent = score;
      document.getElementById('trTime').textContent = timeLeft + 's';
      document.getElementById('trTime').style.color = 'var(--success)';
      setTimeout(() => document.getElementById('trTime').style.color = '', 500);
      learnedInSession.add(currentItem.es);
      setTimeout(nextRound, 400);
    } else {
      if (typeof AudioFX !== 'undefined') AudioFX.wrong();
      btn.classList.add('wrong');
      btn.classList.add('shake');
      timeLeft = Math.max(0, timeLeft - 3); // Penalty -3s
      document.getElementById('trTime').textContent = timeLeft + 's';
      document.getElementById('trTime').style.color = 'var(--danger)';
      setTimeout(() => {
        btn.classList.remove('wrong', 'shake');
      }, 500);
    }
  }

  function endGame() {
    inProgress = false;
    clearInterval(timerInterval);
    
    const xp = score * 5;
    if (typeof addXP === 'function' && xp > 0) addXP(xp, 'Wyścig z Czasem');
    if (typeof launchConfetti === 'function' && score > 5) launchConfetti();
    
    learnedInSession.forEach(word => {
      markLearned('TIMERACE', currentLevel, currentCat, { es: word });
    });
    
    let pct = 0;
    if (score >= 20) pct = 100;
    else if (score >= 10) pct = 60;
    else if (score > 0) pct = 30;
    
    if (typeof showStarRating === 'function') showStarRating(pct, 'trStarRating');
    
    let msg = '';
    if (score >= 20) msg = 'Niesamowita szybkość! Jesteś błyskawicą! ⚡🏆';
    else if (score >= 10) msg = 'Świetny wynik! Tak trzymaj! 💪😎';
    else if (score > 0) msg = 'Dobra robota! Następnym razem będzie jeszcze lepiej! 🏃‍♂️';
    else msg = 'Nie poddawaj się! Ćwiczenie czyni mistrza! 🌱';
    
    document.getElementById('trFinalStats').textContent = `Twój wynik: ${score} poprawnych odpowiedzi! Zdobyto ${xp} XP.`;
    document.getElementById('trSumExtra').textContent = msg;
    
    const st = getModeStats('TIMERACE', currentLevel, currentCat);
    st.games = (st.games || 0) + 1;
    if (!st.bestScore || score > st.bestScore) st.bestScore = score;
    setModeStats('TIMERACE', currentLevel, currentCat, st);
    if (typeof updateGlobalStats === 'function') updateGlobalStats();
    
    document.getElementById('trSummary').classList.remove('hidden');
  }

  window.startTimerace = startTimerace;

  document.addEventListener('click', (e) => {
    if (e.target.id === 'trMenuBtn' || e.target.id === 'trMenuSumBtn') {
      clearInterval(timerInterval);
      show('menu');
    }
    if (e.target.id === 'trRetryBtn') startTimerace();
    if (e.target.getAttribute('data-go') === 'timerace') startTimerace();
  });
})();
