(function(){
  let cwRound=0, cwScore=0, cwTotal=10, cwLives=3, cwTarget=null;
  let cwPool = [];
  let cwSpawnInterval = null;
  let cwStartTime = 0;
  
  function getCatchwordSpeed() {
    return currentLevel === 'LATWY' ? 2500 : currentLevel === 'SREDNI' ? 1800 : 1200; // spawn rate in ms
  }
  function getFallDuration() {
    return currentLevel === 'LATWY' ? 5000 : currentLevel === 'SREDNI' ? 4000 : 3000; // fall duration in ms
  }

  function startCatchword(){
    cwTotal = LEVELS[currentLevel].len;
    cwPool = shuffle([...dataset()]);
    cwRound = 0;
    cwScore = 0;
    cwLives = 3;
    document.getElementById('cwSummary').classList.add('hidden');
    document.getElementById('cwScore').textContent = '0';
    document.getElementById('cwTotal').textContent = cwTotal;
    updateLivesUI();
    document.getElementById('cwFill').style.width = '0%';
    document.getElementById('catchArea').innerHTML = '';
    
    cwStartTime = performance.now();
    nextCatchwordRound();
  }

  function updateLivesUI() {
    document.getElementById('cwLives').textContent = '❤️'.repeat(cwLives) + '🤍'.repeat(3 - cwLives);
  }

  function nextCatchwordRound() {
    if (cwScore >= cwTotal || cwLives <= 0) {
      endCatchword();
      return;
    }
    
    // Pick next target word
    cwTarget = cwPool[cwRound % cwPool.length];
    document.getElementById('cwEs').textContent = cwTarget.es;
    speakEs(cwTarget.es);
    
    // Clear area
    document.getElementById('catchArea').innerHTML = '';
    
    // Start spawning items
    clearInterval(cwSpawnInterval);
    cwSpawnInterval = setInterval(spawnItem, getCatchwordSpeed());
    spawnItem(); // spawn first immediately
  }
  
  function spawnItem() {
    const catchArea = document.getElementById('catchArea');
    if (!catchArea) return;
    
    // 60% chance to spawn target, 40% chance to spawn random distractors
    // We want the target to appear reasonably often so the player isn't waiting forever.
    const isTarget = Math.random() < 0.6;
    let itemData;
    if (isTarget) {
      itemData = cwTarget;
    } else {
      let distractors = cwPool.filter(w => w !== cwTarget);
      itemData = pick(distractors, 1)[0] || cwTarget; // fallback if only 1 word in pool
    }
    
    const el = document.createElement('div');
    el.className = 'catch-item';
    // Use smaller rendering for falling items
    el.innerHTML = renderItemVisual(itemData, '4rem');
    
    // Random horizontal position (10% to 80% to avoid overflowing the right edge)
    const startX = 10 + Math.random() * 70;
    el.style.left = startX + '%';
    
    // Fall duration
    const duration = getFallDuration() + (Math.random() * 1000 - 500); // add a little randomness
    el.style.animationDuration = duration + 'ms';
    
    el.onclick = () => {
      if (el.classList.contains('caught')) return;
      el.classList.add('caught');
      
      if (itemData === cwTarget) {
        // Correct
        AudioFX.correct();
        miniConfetti(el);
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        
        cwScore++;
        cwRound++;
        document.getElementById('cwScore').textContent = cwScore;
        document.getElementById('cwFill').style.width = (cwScore / cwTotal * 100) + '%';
        markLearned('CATCHWORD', currentLevel, currentCat, cwTarget);
        
        clearInterval(cwSpawnInterval);
        setTimeout(nextCatchwordRound, 800);
      } else {
        // Wrong
        AudioFX.wrong();
        el.style.backgroundColor = 'rgba(239, 68, 68, 0.8)';
        el.style.borderColor = 'rgba(220, 38, 38, 1)';
        cwLives--;
        updateLivesUI();
        if (cwLives <= 0) {
          clearInterval(cwSpawnInterval);
          setTimeout(endCatchword, 500);
        }
      }
    };
    
    el.addEventListener('animationend', () => {
      if (el.parentNode) {
        if (!el.classList.contains('caught') && itemData === cwTarget) {
          // Missed the target
          cwLives--;
          updateLivesUI();
          AudioFX.wrong();
          if (cwLives <= 0) {
            clearInterval(cwSpawnInterval);
            setTimeout(endCatchword, 500);
          }
        }
        el.remove();
      }
    });
    
    catchArea.appendChild(el);
  }

  function endCatchword() {
    clearInterval(cwSpawnInterval);
    document.getElementById('catchArea').innerHTML = '';
    
    const elapsedSec = (performance.now() - cwStartTime) / 1000;
    
    const st = getModeStats('CATCHWORD', currentLevel, currentCat);
    st.games += 1;
    st.bestScore = Math.max(st.bestScore||0, cwScore);
    st.totalCorrect += cwScore; 
    st.totalQuestions += cwTotal; 
    st.lastPlayed = new Date().toISOString();
    setModeStats('CATCHWORD', currentLevel, currentCat, st);

    if (cwScore > 0) {
      addXP(cwScore * 5, 'Złap Słowo');
      if (cwScore >= cwTotal) addXP(20, 'Perfekt Złap Słowo');
    }

    document.getElementById('cwSumScore').textContent = cwScore;
    document.getElementById('cwSumTotal').textContent = cwTotal;
    const cwPct = Math.round((cwScore/cwTotal)*100);
    document.getElementById('cwSumPct').textContent = cwPct;
    document.getElementById('cwSumTime').textContent = elapsedSec.toFixed(1)+' s';

    showStarRating(cwPct, 'cwStarRating');
    document.getElementById('cwSummary').classList.remove('hidden');

    document.getElementById('cwSumRetry').onclick = ()=> startCatchword();
    document.getElementById('cwSumMenu').onclick  = ()=> { show('menu'); };
    updateGlobalStats();
  }

  document.getElementById('cwMenuBtn').addEventListener('click', ()=> {
    clearInterval(cwSpawnInterval);
    show('menu');
  });
  document.getElementById('cwSpeak').addEventListener('click', ()=> { if (cwTarget) speakEs(cwTarget.es); });

  window.startCatchword = startCatchword;
})();
