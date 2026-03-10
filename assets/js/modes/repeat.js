(function() {
  let pool = [];
  let currentIndex = 0;
  let score = 0;
  let startTime = 0;
  let recognition = null;
  let isRecording = false;

  // Funkcja obliczająca podobieństwo (Levenshtein)
  function similarity(s1, s2) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    let longerLength = longer.length;
    if (longerLength === 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    let costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0)
          costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (s1.charAt(i - 1) !== s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }

  function initSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast('Twoja przeglądarka nie wspiera rozpoznawania mowy. 😢');
      return false;
    }
    recognition = new SpeechRecognition();
    recognition.lang = 'es-ES'; // Ustawiamy język hiszpański
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isRecording = true;
      document.getElementById('repRecordBtn').style.background = '#2ecc71';
      document.getElementById('repStatus').textContent = 'Słucham...';
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      const target = pool[currentIndex].es;
      const acc = similarity(result, target);
      handleSpeechResult(result, acc);
    };

    recognition.onerror = (event) => {
      console.error('Błąd rozpoznawania mowy:', event.error);
      isRecording = false;
      document.getElementById('repRecordBtn').style.background = '#e74c3c';
      document.getElementById('repStatus').textContent = 'Błąd. Spróbuj ponownie.';
      if (event.error === 'not-allowed') {
          toast('Brak dostępu do mikrofonu! 🎤');
      }
    };

    recognition.onend = () => {
      isRecording = false;
      document.getElementById('repRecordBtn').style.background = '#e74c3c';
    };
    
    return true;
  }

  function handleSpeechResult(transcript, accuracy) {
    const accuracyPct = Math.round(accuracy * 100);
    document.getElementById('repAccuracyVal').textContent = accuracyPct;
    document.getElementById('repAccuracy').style.display = 'block';
    document.getElementById('repStatus').textContent = `Usłyszano: "${transcript}"`;
    
    if (accuracy >= 0.75) {
      score++;
      if (typeof registerCorrectAnswer === 'function') registerCorrectAnswer(pool[currentIndex]);
      document.getElementById('repScore').textContent = score;
      if (typeof AudioFX !== 'undefined') AudioFX.correct();
      toast(`¡Excelente! (${accuracyPct}%) 🌟`);
      document.getElementById('repNextBtn').style.display = 'inline-block';
      document.getElementById('repRecordBtn').style.display = 'none';
    } else {
      if (typeof AudioFX !== 'undefined') AudioFX.wrong();
      toast(`Spróbuj jeszcze raz! (${accuracyPct}%) ❌`);
    }
  }

  function startRepeat() {
    if (!recognition && !initSpeech()) return;
    
    const list = dataset();
    if (!list.length) return;

    const limit = LEVELS[currentLevel].len || 10;
    pool = shuffle([...list]).slice(0, limit);
    
    currentIndex = 0;
    score = 0;
    startTime = performance.now();

    resetUI();
    show('repeat');
    nextRepQuestion();
  }

  function resetUI() {
    document.getElementById('repSummary').classList.add('hidden');
    document.getElementById('repScore').textContent = '0';
    document.getElementById('repFill').style.width = '0%';
    document.getElementById('repTotal').textContent = pool.length;
    document.getElementById('repAccuracy').style.display = 'none';
    document.getElementById('repNextBtn').style.display = 'none';
    document.getElementById('repRecordBtn').style.display = 'inline-block';
    document.getElementById('repStatus').textContent = 'Kliknij mikrofon i mów...';
  }

  function nextRepQuestion() {
    if (currentIndex >= pool.length) {
      endRepeat();
      return;
    }

    const item = pool[currentIndex];
    document.getElementById('repNum').textContent = currentIndex + 1;
    document.getElementById('repEs').textContent = item.es;
    document.getElementById('repPl').textContent = item.pl;
    document.getElementById('repVisual').innerHTML = renderItemVisual(item, '8rem');
    document.getElementById('repFill').style.width = (currentIndex / pool.length * 100) + '%';
    
    document.getElementById('repAccuracy').style.display = 'none';
    document.getElementById('repNextBtn').style.display = 'none';
    document.getElementById('repRecordBtn').style.display = 'inline-block';
    document.getElementById('repStatus').textContent = 'Kliknij mikrofon i mów...';
  }

  function speakWord() {
    const word = pool[currentIndex].es;
    const ut = new SpeechSynthesisUtterance(word);
    ut.lang = 'es-ES';
    ut.rate = 0.9;
    window.speechSynthesis.speak(ut);
  }

  function repSummaryMessage(pct) {
    if (pct >= 100) return '¡Perfecto! Wymówiłeś wszystkie słowa poprawnie! 🏆';
    if (pct >= 80) return 'Świetna wymowa! Prawie ideał! 💪';
    if (pct >= 60) return 'Dobry wynik! Ćwicz wymowę dalej! 😊';
    return 'Nie poddawaj się – wymowa to kwestia praktyki! 🌱';
  }

  function endRepeat() {
    const elapsed = (performance.now() - startTime) / 1000;
    const xp = score * 15;
    
    if (typeof addXP === 'function') addXP(xp, 'Powtórz słowo');
    if (score === pool.length && typeof launchConfetti === 'function') launchConfetti();

    document.getElementById('repFill').style.width = '100%';
    const pct = pool.length ? Math.round((score / pool.length) * 100) : 0;
    if (typeof showStarRating === 'function') showStarRating(pct, 'repStarRating');

    document.getElementById('repFinalStats').textContent = `Wynik: ${score}/${pool.length} (${pct}%) • Czas: ${elapsed.toFixed(1)} s • +${xp} XP`;
    const extra = document.getElementById('repSumExtra');
    if (extra) extra.textContent = repSummaryMessage(pct);
    document.getElementById('repSummary').classList.remove('hidden');

    const st = getModeStats('REPEAT', currentLevel, currentCat);
    st.games = (st.games || 0) + 1;
    st.totalCorrect += score;
    st.totalQuestions += pool.length;
    if (!st.bestScore || score > st.bestScore) st.bestScore = score;
    setModeStats('REPEAT', currentLevel, currentCat, st);
    updateGlobalStats();
  }

  window.startRepeat = startRepeat;

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    
    if (btn.id === 'repMenuBtn') show('menu');
    if (btn.id === 'repGamesBtn') { if (typeof showModeSelect === 'function') showModeSelect(); }
    if (btn.id === 'repSumMenuBtn') show('menu');
    if (btn.id === 'repSumGamesBtn') { if (typeof showModeSelect === 'function') showModeSelect(); }
    if (btn.id === 'repSumRetryBtn') startRepeat();
    if (btn.getAttribute('data-go') === 'repeat') startRepeat();
    
    if (btn.id === 'repListenBtn') speakWord();
    if (btn.id === 'repRecordBtn') {
      if (isRecording) {
        recognition.stop();
      } else {
        recognition.start();
      }
    }
    if (btn.id === 'repNextBtn') {
      currentIndex++;
      nextRepQuestion();
    }
    if (btn.id === 'repPrevBtn') {
      if (currentIndex > 0) {
        currentIndex--;
        nextRepQuestion();
      }
    }
    if (btn.id === 'repSkipBtn') {
      currentIndex++;
      nextRepQuestion();
    }
  });
})();
