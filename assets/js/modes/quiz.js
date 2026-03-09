(function(){
  let qRound=0, qScore=0, qStreak=0, qBestStreak=0, qAnswer=null, qLen=LEVELS[currentLevel].len, qOpts=LEVELS[currentLevel].options, qStartTime=0;
  let qPool = [];
  let qMistakes = [];
  let qMistakeSet = new Set();
  let qIsReviewMode = false;
  let qAnswered = false;
  let qAnsweredCorrect = false;
  let qAutoTimer = null;

  function applyLevelToQuiz(){ qLen=LEVELS[currentLevel].len; qOpts=LEVELS[currentLevel].options; document.getElementById('qTotal').textContent=qLen; }
  function makeQuestionPool(){ const list = dataset(); qPool = shuffle([...list]).slice(0, Math.min(list.length, qLen)); }

  function resetMistakeSummaryUI(){
    const info = document.getElementById('qMistakeInfo');
    const list = document.getElementById('qMistakeList');
    const count = document.getElementById('qMistakeCount');
    const reviewBtn = document.getElementById('qSumReview');
    const success = document.getElementById('qMistakeSuccess');
    if (info) info.classList.add('hidden');
    if (list) list.innerHTML = '';
    if (count) count.textContent = '0';
    if (reviewBtn){
      reviewBtn.classList.add('hidden');
      reviewBtn.disabled = true;
      reviewBtn.textContent = '🔁 Powtórz błędne';
    }
    if (success) success.classList.add('hidden');
  }

  function registerMistake(word){
    if (!word) return;
    const key = (word.es || '').toLowerCase();
    if (qMistakeSet.has(key)) return;
    qMistakeSet.add(key);
    qMistakes.push(word);
    addPersistentMistake(word);
  }

  function updateMistakeSummary(){
    const info = document.getElementById('qMistakeInfo');
    const list = document.getElementById('qMistakeList');
    const count = document.getElementById('qMistakeCount');
    const reviewBtn = document.getElementById('qSumReview');
    const success = document.getElementById('qMistakeSuccess');
    if (!info || !list || !count || !reviewBtn || !success) return;
    list.innerHTML = '';
    count.textContent = qMistakes.length.toString();
    if (qMistakes.length){
      info.classList.remove('hidden');
      success.classList.add('hidden');
      qMistakes.forEach(word => {
        const li = document.createElement('li');
        li.innerHTML = `<b>${word.es}</b> – ${word.pl}`;
        list.appendChild(li);
      });
      reviewBtn.classList.remove('hidden');
      reviewBtn.disabled = false;
      reviewBtn.textContent = `🔁 Powtórz błędne (${qMistakes.length})`;
    } else {
      info.classList.add('hidden');
      success.textContent = qIsReviewMode ? 'Powtórka ukończona – brak błędów!' : 'Brak błędnych odpowiedzi – świetna robota!';
      success.classList.remove('hidden');
      reviewBtn.disabled = true;
      reviewBtn.classList.add('hidden');
    }
  }

  function startQuiz(){
    clearTimeout(qAutoTimer);
    qIsReviewMode = false;
    applyLevelToQuiz();
    makeQuestionPool();
    qRound=0; qScore=0; qStreak=0; qBestStreak = getModeStats('QUIZ_PL_ES', currentLevel, currentCat).bestStreak || 0;
    qMistakes = [];
    qMistakeSet = new Set();
    qAnswered = false;
    qAnsweredCorrect = false;
    document.getElementById('qScore').textContent='0'; renderCombo('qStreak', 0); document.getElementById('qBestStreak').textContent=qBestStreak;
    document.getElementById('scoreFill').style.width='0%'; document.getElementById('qNext').disabled=false; document.getElementById('qSkip').disabled=false;
    document.getElementById('qRetry').disabled=true;
    document.getElementById('qSummary').classList.add('hidden');
    const qStarEl = document.getElementById('qStarRating'); if (qStarEl) qStarEl.innerHTML = '';
    resetMistakeSummaryUI();
    const sumTitle = document.getElementById('qSummaryTitle'); if (sumTitle) sumTitle.textContent = 'Podsumowanie';
    qStartTime = performance.now();
    newQuestion();
  }

  function newQuestion(){
    qRound++; if (qRound>qLen){ endQuiz(); return; }
    [{pct:25,msg:'Dobry start! 🚀'},{pct:50,msg:'Połowa za Tobą! ⭐'},{pct:75,msg:'Prawie koniec! 💪'}]
      .forEach(m=>{ if (qRound === Math.ceil(qLen * m.pct / 100)) toast(m.msg); });
    qAnswered = false;
    qAnsweredCorrect = false;
    const list = dataset();
    const correct = qPool[qRound-1] || pick(list,1)[0]; qAnswer = correct;
    document.getElementById('qVisual').innerHTML = renderItemVisual(correct, '10rem');
    document.getElementById('qHint').textContent = 'po polsku: ' + correct.pl;
    document.getElementById('qNum').textContent = qRound; document.getElementById('qTotal').textContent = qLen;
    const wrap = document.getElementById('choices'); wrap.innerHTML='';
    const options = shuffle([correct, ...pick(list.filter(x=>x!==correct), qOpts-1)]);
    options.forEach(opt=>{
      const btn=document.createElement('button'); btn.className='choice';
      btn.innerHTML = `<b>${opt.es}</b><button class="choice-speak" title="Odsłuchaj: ${opt.es}">🔊</button>`;

      btn.addEventListener('click', ()=>{
        if (qAnswered) return;
        const isOk = opt===correct;
        qAnswered = true;
        qAnsweredCorrect = isOk;
        if (isOk){
          btn.classList.add('correct', 'anim-bounce'); qScore++; qStreak++; qBestStreak = Math.max(qBestStreak, qStreak);
          markLearned('QUIZ_PL_ES', currentLevel, currentCat, correct);
          registerCorrectAnswer(correct);
          AudioFX.correct();
          miniConfetti(btn);
          qAutoTimer = setTimeout(() => { if (qAnswered && qAnsweredCorrect) newQuestion(); }, 1000);
        }
        else {
          btn.classList.add('wrong', 'anim-shake'); qStreak = 0;
          registerMistake(correct);
          [...wrap.children].forEach(c=>{ if (c.textContent.toLowerCase().includes(correct.es.split(' ')[0])) c.classList.add('correct'); });
          AudioFX.wrong();
        }
        document.getElementById('qScore').textContent=qScore; renderCombo('qStreak', qStreak); document.getElementById('qBestStreak').textContent=qBestStreak;
        document.getElementById('scoreFill').style.width=(qScore/qLen*100)+'%';
        [...wrap.children].forEach(c=>c.disabled=true);
      });

      const speakBtn = btn.querySelector('.choice-speak');
      speakBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        speakEs(opt.es);
      });

      wrap.appendChild(btn);
    });
  }

  document.getElementById('qNext').addEventListener('click', ()=>{
    clearTimeout(qAutoTimer);
    if (!qAnswered && qAnswer){ registerMistake(qAnswer); }
    newQuestion();
  });
  document.getElementById('qSkip').addEventListener('click', ()=>{
    clearTimeout(qAutoTimer);
    if (qAnswer && (!qAnswered || !qAnsweredCorrect)){ registerMistake(qAnswer); }
    newQuestion();
  });
  document.getElementById('qSpeak').addEventListener('click', ()=> { if (qAnswer) speakEs(qAnswer.es); });
  document.getElementById('qRetry').addEventListener('click', ()=> { startQuiz(); });
  document.getElementById('qSumReview').addEventListener('click', ()=> { startMistakeReview(); });

  function endQuiz(){
    const elapsedSec = (performance.now() - qStartTime) / 1000;
    const st = getModeStats('QUIZ_PL_ES', currentLevel, currentCat);
    if (!qIsReviewMode){
      st.games += 1; st.bestScore = Math.max(st.bestScore||0, qScore);
      st.bestStreak = Math.max(st.bestStreak||0, qBestStreak);
      st.totalCorrect += qScore; st.totalQuestions += qLen; st.lastPlayed = new Date().toISOString();
      st.lastTime = elapsedSec;
      if (!st.bestTime || elapsedSec < st.bestTime) st.bestTime = elapsedSec;
      setModeStats('QUIZ_PL_ES', currentLevel, currentCat, st);

      addXP(qScore * 5, 'Quiz');
      if (qScore === qLen) addXP(20, 'Bonus Perfekt');

      checkAndAwardBadges(currentLevel, currentCat, qScore, qLen, qBestStreak, elapsedSec, st.games);
    }

    document.getElementById('choices').innerHTML='';
    document.getElementById('qNum').textContent=qLen;
    document.getElementById('qNext').disabled=true;
    document.getElementById('qSkip').disabled=true;
    document.getElementById('qRetry').disabled=false;

    document.getElementById('qSumScore').textContent = qScore;
    document.getElementById('qSumTotal').textContent = qLen;
    const qPct = Math.round((qScore/qLen)*100);
    document.getElementById('qSumPct').textContent = qPct;
    document.getElementById('qSumBestStreak').textContent = qBestStreak;
    document.getElementById('qSumTime').textContent = elapsedSec.toFixed(1)+' s';
    const bestTime = st.bestTime ? st.bestTime.toFixed(1)+' s' : '—';
    document.getElementById('qSumBestTime').textContent = bestTime;

    showStarRating(qPct, 'qStarRating');
    updateMistakeSummary();
    document.getElementById('qSummary').classList.remove('hidden');

    document.getElementById('qSumRetry').onclick = ()=> startQuiz();
    document.getElementById('qSumMenu').onclick  = ()=> { show('menu'); };
    const qSumGames = document.getElementById('qSumGames');
    if (qSumGames) qSumGames.onclick = ()=> showModeSelect();
    updateGlobalStats();
  }

  function startMistakeReview(){
    if (!qMistakes.length) return;
    const reviewPool = [...qMistakes];
    startSpecialQuiz(reviewPool, 'Podsumowanie powtórki');
  }

  function startSpecialQuiz(wordPool, title) {
    if (!wordPool || !wordPool.length) {
      toast('Brak słów do ćwiczenia w tym trybie.');
      return;
    }

    qIsReviewMode = true;
    qPool = shuffle([...wordPool]);
    qLen = qPool.length;
    qOpts = LEVELS[currentLevel].options;
    qRound = 0;
    qScore = 0;
    qStreak = 0;
    qBestStreak = 0;
    qAnswered = false;
    qAnsweredCorrect = false;
    qMistakes = [];
    qMistakeSet = new Set();

    document.getElementById('qScore').textContent='0';
    renderCombo('qStreak', 0);
    document.getElementById('qBestStreak').textContent='0';
    document.getElementById('scoreFill').style.width='0%';
    document.getElementById('qNext').disabled=false;
    document.getElementById('qSkip').disabled=false;
    document.getElementById('qRetry').disabled=true;
    document.getElementById('qSummary').classList.add('hidden');
    const qStarElS = document.getElementById('qStarRating'); if (qStarElS) qStarElS.innerHTML = '';

    const sumTitle = document.getElementById('qSummaryTitle');
    if (sumTitle) sumTitle.textContent = title;

    resetMistakeSummaryUI();
    document.getElementById('qTotal').textContent = qLen;
    qStartTime = performance.now();

    if (typeof toast === 'function'){ toast(`Rozpoczynamy: ${title}!`); }
    show('quiz');
    newQuestion();
  }

  window.startQuiz = startQuiz;
  window.startSpecialQuiz = startSpecialQuiz;
})();
