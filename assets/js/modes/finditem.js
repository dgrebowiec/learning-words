(function(){
  let fRound=0, fScore=0, fStreak=0, fBestStreak=0, fAnswer=null, fLen=LEVELS[currentLevel].len, fOpts=LEVELS[currentLevel].options, fStartTime=0;
  let fPool = [];
  let fMistakes = [];
  let fMistakeSet = new Set();
  let fIsReviewMode = false;
  let fAutoTimer = null;

  function applyLevelToFind(){ fLen=LEVELS[currentLevel].len; fOpts=LEVELS[currentLevel].options; document.getElementById('fTotal').textContent=fLen; }
  function makeFindPool(){ const list = dataset(); fPool = shuffle([...list]).slice(0, Math.min(list.length, fLen)); }

  function resetFindMistakeSummaryUI(){
    const info = document.getElementById('fMistakeInfo');
    const list = document.getElementById('fMistakeList');
    const count = document.getElementById('fMistakeCount');
    const reviewBtn = document.getElementById('fSumReview');
    const success = document.getElementById('fMistakeSuccess');
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

  function registerFindMistake(word){
    if (!word) return;
    const key = (word.es || '').toLowerCase();
    if (fMistakeSet.has(key)) return;
    fMistakeSet.add(key);
    fMistakes.push(word);
    addPersistentMistake(word);
  }

  function updateFindMistakeSummary(){
    const info = document.getElementById('fMistakeInfo');
    const list = document.getElementById('fMistakeList');
    const count = document.getElementById('fMistakeCount');
    const reviewBtn = document.getElementById('fSumReview');
    const success = document.getElementById('fMistakeSuccess');
    if (!info || !list || !count || !reviewBtn || !success) return;
    list.innerHTML = '';
    count.textContent = fMistakes.length.toString();
    if (fMistakes.length){
      info.classList.remove('hidden');
      success.classList.add('hidden');
      fMistakes.forEach(word => {
        const li = document.createElement('li');
        li.innerHTML = `<b>${word.es}</b> – ${word.pl}`;
        list.appendChild(li);
      });
      reviewBtn.classList.remove('hidden');
      reviewBtn.disabled = false;
      reviewBtn.textContent = `🔁 Powtórz błędne (${fMistakes.length})`;
    } else {
      info.classList.add('hidden');
      success.textContent = fIsReviewMode ? 'Powtórka ukończona – brak błędów!' : 'Brak błędnych odpowiedzi – świetna robota!';
      success.classList.remove('hidden');
      reviewBtn.disabled = true;
      reviewBtn.classList.add('hidden');
    }
  }

  function startFindItem(){
    clearTimeout(fAutoTimer);
    fIsReviewMode = false;
    applyLevelToFind();
    makeFindPool();
    fRound=0; fScore=0; fStreak=0; fBestStreak = getModeStats('FIND_ITEM', currentLevel, currentCat).bestStreak || 0;
    fMistakes = [];
    fMistakeSet = new Set();
    document.getElementById('fScore').textContent='0'; renderCombo('fStreak', 0); document.getElementById('fBestStreak').textContent=fBestStreak;
    document.getElementById('fFill').style.width='0%'; document.getElementById('fNext').disabled=false; document.getElementById('fSkip').disabled=false;
    document.getElementById('fRetry').disabled=true;
    document.getElementById('fSummary').classList.add('hidden');
    const fStarEl = document.getElementById('fStarRating'); if (fStarEl) fStarEl.innerHTML = '';
    resetFindMistakeSummaryUI();
    const sumTitle = document.getElementById('fSummaryTitle'); if (sumTitle) sumTitle.textContent = 'Podsumowanie';
    fStartTime = performance.now();
    newFindQuestion();
  }

  function newFindQuestion(){
    fRound++; if (fRound>fLen){ endFind(); return; }
    [{pct:25,msg:'Dobry start! 🚀'},{pct:50,msg:'Połowa za Tobą! ⭐'},{pct:75,msg:'Prawie koniec! 💪'}]
      .forEach(m=>{ if (fRound === Math.ceil(fLen * m.pct / 100)) toast(m.msg); });
    const list = dataset();
    const correct = fPool[fRound-1] || pick(list,1)[0]; fAnswer = correct;
    document.getElementById('fEs').textContent = correct.es;
    document.getElementById('fPl').textContent = '('+correct.pl+')';
    document.getElementById('fNum').textContent = fRound; document.getElementById('fTotal').textContent = fLen;
    const options = shuffle([correct, ...pick(list.filter(x=>x!==correct), fOpts-1)]);
    const wrap = document.getElementById('itemChoices'); wrap.innerHTML='';
    options.forEach(opt=>{
      const btn=document.createElement('button'); btn.className='choice'; btn.style.flexDirection='column'; btn.style.alignItems='stretch';
      btn.innerHTML = `<div class="imgwrap">${renderItemVisual(opt, '5rem')}</div>`;
      btn.addEventListener('click', ()=>{
        const isOk = opt===correct;
        if (isOk){
          btn.classList.add('correct', 'anim-bounce'); fScore++; fStreak++; fBestStreak = Math.max(fBestStreak, fStreak);
          markLearned('FIND_ITEM', currentLevel, currentCat, correct);
          registerCorrectAnswer(correct);
          AudioFX.correct();
          miniConfetti(btn);
          fAutoTimer = setTimeout(() => newFindQuestion(), 1000);
        }
        else {
          btn.classList.add('wrong', 'anim-shake'); fStreak=0;
          registerFindMistake(correct);
          [...wrap.children].forEach(c=>{
            const img = c.querySelector('img');
            if (img && correct.img && img.src.endsWith(correct.img)) {
              c.classList.add('correct');
            }
          });
          AudioFX.wrong();
        }
        document.getElementById('fScore').textContent=fScore; renderCombo('fStreak', fStreak); document.getElementById('fBestStreak').textContent=fBestStreak;
        document.getElementById('fFill').style.width=(fScore/fLen*100)+'%';
        [...wrap.children].forEach(c=>c.disabled=true);
      });
      wrap.appendChild(btn);
    });
    setTimeout(()=> speakEs(correct.es), 120);
  }

  document.getElementById('fNext').addEventListener('click', ()=> {
    clearTimeout(fAutoTimer);
    const answered = [...document.getElementById('itemChoices').children].some(c => c.classList.contains('correct') || c.classList.contains('wrong'));
    if (fAnswer && !answered) { registerFindMistake(fAnswer); }
    newFindQuestion();
  });
  document.getElementById('fSkip').addEventListener('click', ()=> {
    clearTimeout(fAutoTimer);
    const answered = [...document.getElementById('itemChoices').children].some(c => c.classList.contains('correct') || c.classList.contains('wrong'));
    if (fAnswer && !answered) { registerFindMistake(fAnswer); }
    newFindQuestion();
  });
  document.getElementById('fSpeak').addEventListener('click', ()=> { if (fAnswer) speakEs(fAnswer.es); });
  document.getElementById('fRetry').addEventListener('click', ()=> { startFindItem(); });
  document.getElementById('fSumReview').addEventListener('click', ()=> { startMistakeReviewFind(); });

  function startMistakeReviewFind(){
    if (!fMistakes.length) {
      toast('Brak błędów do powtórzenia.');
      return;
    }
    const reviewPool = [...fMistakes];

    fIsReviewMode = true;
    fPool = reviewPool;
    fLen = reviewPool.length;
    fOpts = LEVELS[currentLevel].options;
    fRound = 0;
    fScore = 0;
    fStreak = 0;
    fBestStreak = 0;
    fMistakes = [];
    fMistakeSet = new Set();

    document.getElementById('fScore').textContent='0';
    renderCombo('fStreak', 0);
    document.getElementById('fBestStreak').textContent='0';
    document.getElementById('fFill').style.width='0%';
    document.getElementById('fNext').disabled=false;
    document.getElementById('fSkip').disabled=false;
    document.getElementById('fRetry').disabled=true;
    document.getElementById('fSummary').classList.add('hidden');
    const fStarElR = document.getElementById('fStarRating'); if (fStarElR) fStarElR.innerHTML = '';

    const sumTitle = document.getElementById('fSummaryTitle');
    if (sumTitle) sumTitle.textContent = 'Podsumowanie powtórki';

    resetFindMistakeSummaryUI();
    document.getElementById('fTotal').textContent = fLen;
    fStartTime = performance.now();

    if (typeof toast === 'function'){ toast('Rozpoczynamy powtórkę błędnych odpowiedzi!'); }
    newFindQuestion();
  }

  function endFind(){
    const elapsedSec = (performance.now() - fStartTime) / 1000;
    const st = getModeStats('FIND_ITEM', currentLevel, currentCat);

    if (!fIsReviewMode){
      st.games += 1; st.bestScore = Math.max(st.bestScore||0, fScore);
      st.bestStreak = Math.max(st.bestStreak||0, fBestStreak);
      st.totalCorrect += fScore; st.totalQuestions += fLen; st.lastPlayed = new Date().toISOString();
      st.lastTime = elapsedSec;
      if (!st.bestTime || elapsedSec < st.bestTime) st.bestTime = elapsedSec;
      setModeStats('FIND_ITEM', currentLevel, currentCat, st);

      addXP(fScore * 5, 'Znajdź element');
      if (fScore === fLen) addXP(20, 'Bonus Perfekt');

      checkAndAwardBadges(currentLevel, currentCat, fScore, fLen, fBestStreak, elapsedSec, st.games);
    }

    document.getElementById('itemChoices').innerHTML='';
    document.getElementById('fNum').textContent=fLen;
    document.getElementById('fNext').disabled=true;
    document.getElementById('fSkip').disabled=true;
    document.getElementById('fRetry').disabled=false;

    document.getElementById('fSumScore').textContent = fScore;
    document.getElementById('fSumTotal').textContent = fLen;
    const fPct = Math.round((fScore/fLen)*100);
    document.getElementById('fSumPct').textContent = fPct;
    document.getElementById('fSumBestStreak').textContent = fBestStreak;
    document.getElementById('fSumTime').textContent = elapsedSec.toFixed(1)+' s';
    const bestTime = st.bestTime ? st.bestTime.toFixed(1)+' s' : '—';
    document.getElementById('fSumBestTime').textContent = bestTime;

    showStarRating(fPct, 'fStarRating');
    updateFindMistakeSummary();
    document.getElementById('fSummary').classList.remove('hidden');

    document.getElementById('fSumRetry').onclick = ()=> startFindItem();
    document.getElementById('fSumMenu').onclick  = ()=> { show('menu'); };
    const fSumGames = document.getElementById('fSumGames');
    if (fSumGames) fSumGames.onclick = ()=> showModeSelect();
    updateGlobalStats();
  }

  window.startFindItem = startFindItem;
})();
