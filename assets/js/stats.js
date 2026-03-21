function levelLabel(level){
  return LEVEL_NAMES[level] || level;
}
function formatTime(value){
  return (typeof value === 'number' && isFinite(value)) ? value.toFixed(1)+' s' : '—';
}
function renderBestTimes(mode){
  const list = document.getElementById('bestTimesList');
  if (!list) return;
  list.innerHTML = '';
  const totalWords = datasetFor(currentCat).length;
  Object.keys(LEVELS).forEach(level=>{
    const li = document.createElement('li');
    const stats = getModeStats(mode, level, currentCat);
    const time = formatTime(stats.bestTime);
    const learnedCount = (stats.learnedWords || []).length;
    li.innerHTML = `<span>${levelLabel(level)}</span><span>czas: ${time}</span><span>słowa: ${learnedCount}/${totalWords}</span>`;
    list.appendChild(li);
  });
}
function updateGlobalStats(){
  const gamesEl = document.getElementById('globalGames');
  if (!gamesEl) return;
  const statsMap = loadStats();
  const allStats = Object.values(statsMap).map(s=>({ ...getDefaultStats(), ...s }));
  let games = 0, totalCorrect = 0, totalQuestions = 0;
  const learned = new Set();
  let lastPlayed = null;
  allStats.forEach(st=>{
    games += st.games || 0;
    totalCorrect += st.totalCorrect || 0;
    totalQuestions += st.totalQuestions || 0;
    (st.learnedWords || []).forEach(w=>learned.add(w));
    if (st.lastPlayed){
      const d = new Date(st.lastPlayed);
      if (!lastPlayed || d > lastPlayed) lastPlayed = d;
    }
  });
  const accuracy = totalQuestions ? Math.round((totalCorrect/totalQuestions)*100) : 0;
  gamesEl.textContent = games;
  document.getElementById('globalAccuracy').textContent = accuracy + '%';
  document.getElementById('globalLearned').textContent = learned.size;
  document.getElementById('globalTotalWords').textContent = datasetFor('MIXED').length;
  document.getElementById('globalLastPlayed').textContent = lastPlayed ? lastPlayed.toLocaleString() : '—';
}
function runFunctionalTests(){
  const tests = [
    {name:'Zestaw owoców niepusty', pass: FRUITS.length > 0},
    {name:'Zestaw warzyw niepusty', pass: VEGGIES.length > 0},
    {name:'Poziomy skonfigurowane', pass: Object.keys(LEVELS).length === 3},
    {name:'Łączny zestaw niepusty', pass: datasetFor('MIXED').length > 0},
    {name:'Sekcja menu obecna', pass: !!document.getElementById('menu')},
    {name:'Sekcja fiszek obecna', pass: !!document.getElementById('flashcards')},
    {name:'Sekcja quizu obecna', pass: !!document.getElementById('quiz')},
    {name:'Sekcja znajdź element obecna', pass: !!document.getElementById('finditem')},
    {name:'Sekcja memory obecna', pass: !!document.getElementById('memory')},
    {name:'Sekcja articulos obecna', pass: !!document.getElementById('articulos')},
    {name:'Sekcja wordsearch obecna', pass: !!document.getElementById('wordsearch')},
    {name:'Sekcja spelling obecna', pass: !!document.getElementById('spelling')},
    {name:'Siatka kategorii obecna', pass: !!document.getElementById('catGrid')},
    {name:'Kontener naklejek obecny', pass: !!document.getElementById('stickerShelf')},
    {name:"Kontener powtórek (błędy) obecny", pass: !!document.getElementById('reviewModeCard')},
    {name:"Przycisk powtórek (błędy) obecny", pass: !!document.getElementById('startReviewBtn')},
    {name:"Kontener nienauczonych obecny", pass: !!document.getElementById('unlearnedModeCard')},
    {name:"Przycisk nienauczonych obecny", pass: !!document.getElementById('startUnlearnedBtn')},
    {name:'Licznik postępu gwiazdek obecny', pass: !!document.getElementById('statStarProgress')},
    {name:'Licznik gwiazd w quizie obecny', pass: !!document.getElementById('quizStarProgress')},
    {name:'Licznik gwiazd w trybie znajdź obecny', pass: !!document.getElementById('findStarProgress')},
    {name:'Pasek postępu gwiazdek obecny', pass: !!document.getElementById('starProgressFill')},
    {name:'Panel ostatniej nagrody obecny', pass: !!document.getElementById('recentRewardCard')},
    {name:'Informacja o kolejnej naklejce obecna', pass: !!document.getElementById('statNextSticker')}
  ];
  const hasConsole = typeof console !== 'undefined';
  if (hasConsole && console.groupCollapsed){
    console.groupCollapsed('Testy funkcjonalne (automatyczne)');
    tests.forEach(t=> console.log(`${t.pass ? '✅' : '❌'} ${t.name}`));
    console.groupEnd();
  } else if (hasConsole) {
    tests.forEach(t=> console.log((t.pass ? '✅' : '❌') + ' ' + t.name));
  }
  if (tests.some(t=> !t.pass)){
    toast('⚠️ Testy funkcjonalne wykryły problem – sprawdź konsolę.');
  }
}
function updateMenuStats(mode){
  const st = getModeStats(mode, currentLevel, currentCat);
  document.getElementById('statMode').textContent = mode==='QUIZ_PL_ES' ? 'Quiz PL→ES' : (mode==='FIND_ITEM' ? 'Wybierz (ES→obraz)' : (mode==='SCRAMBLE' ? 'Ułóż słowo' : (mode==='REPEAT' ? 'Powtórz słowo' : '—')));
  document.getElementById('statLvl').textContent = levelLabel(currentLevel);
  document.getElementById('statCat').textContent = catLabel(currentCat);
  document.getElementById('statBest').textContent = st.bestScore || 0;
  document.getElementById('statBestTime').textContent = formatTime(st.bestTime);
  document.getElementById('statBestStreak').textContent = st.bestStreak || 0;
  document.getElementById('statLearned').textContent = (st.learnedWords || []).length;
  document.getElementById('statTotalWords').textContent = dataset().length;
  renderBestTimes(mode);

  updateGlobalStats();

  const refMode = 'QUIZ_PL_ES';
  const learnedSet = new Set(getModeStats(refMode, currentLevel, currentCat).learnedWords || []);
  const unlearnedPool = datasetFor(currentCat).filter(w => !learnedSet.has(w.es.toLowerCase()));

  const uBtn = $('#startUnlearnedBtn');
  const uCard = $('#unlearnedModeCard');
  if (uBtn && uCard){
    uBtn.textContent = `Start (${unlearnedPool.length} słów) ➜`;
    uBtn.disabled = unlearnedPool.length === 0;
    uCard.style.display = unlearnedPool.length > 0 ? 'flex' : 'none';
  }

  const mistakesSet = getPersistentMistakes(currentCat);
  const mistakesPool = datasetFor(currentCat).filter(w => mistakesSet.has(w.es.toLowerCase()));

  const rBtn = $('#startReviewBtn');
  const rCard = $('#reviewModeCard');
  if (rBtn && rCard){
    rBtn.textContent = `Start (${mistakesPool.length} słów) ➜`;
    rBtn.disabled = mistakesPool.length === 0;
    rCard.style.display = mistakesPool.length > 0 ? 'flex' : 'none';
  }

  const oppCard = $('#oppositesModeCard');
  if (oppCard){
    const hasOpposites = datasetFor(currentCat).some(w => w.opposite);
    oppCard.style.display = hasOpposites ? 'flex' : 'none';
  }

  const el3Best = document.getElementById('statBest3');
  const el3Time = document.getElementById('statBestTime3');
  const el3Learned = document.getElementById('statLearned3');
  const el3Total = document.getElementById('statTotalWords3');
  if (el3Best) el3Best.textContent = st.bestScore || 0;
  if (el3Time) el3Time.textContent = formatTime(st.bestTime);
  if (el3Learned) el3Learned.textContent = (st.learnedWords || []).length;
  if (el3Total) el3Total.textContent = dataset().length;
}
