(function() {
  let score = 0;
  let lives = 3;
  let targetScore = 10;
  let currentWord = null;
  let balloonsInterval = null;
  let activeBalloons = [];
  let gameActive = false;

  function startBalloons() {
    const list = dataset();
    if (!list || list.length < 2) {
      if (typeof toast === 'function') toast('⚠️ Za mało słówek w kategorii!');
      return;
    }

    score = 0;
    lives = 3;
    targetScore = LEVELS[currentLevel]?.len || 10;
    activeBalloons = [];
    gameActive = true;

    const container = document.getElementById('balloonsContainer');
    if (container) container.innerHTML = '';
    
    document.getElementById('balloonsSummary').classList.add('hidden');
    
    updateBalloonsUI();
    nextRound();
    
    clearInterval(balloonsInterval);
    balloonsInterval = setInterval(gameLoop, 50);

    show('balloons');
  }

  function nextRound() {
    const list = dataset();
    currentWord = pick(list, 1)[0];
    const targetEl = document.getElementById('balloonsTargetWord');
    if (targetEl) targetEl.textContent = currentWord.es;
    
    if (typeof speak === 'function') speak(currentWord.es);
    spawnBalloons();
  }

  function spawnBalloons() {
    const container = document.getElementById('balloonsContainer');
    if (!container) return;
    container.innerHTML = '';
    activeBalloons = [];

    const list = dataset();
    let optionsCount = LEVELS[currentLevel]?.options || 3;
    
    let wrongWords = list.filter(w => w.es !== currentWord.es);
    wrongWords = shuffle(wrongWords).slice(0, optionsCount - 1);
    
    let pool = [currentWord, ...wrongWords];
    pool = shuffle(pool);

    const containerWidth = container.clientWidth;
    const balloonWidth = 60; 

    pool.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'balloon';
      
      // Random color for balloon background if not COLORES
      const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      const bg = colors[index % colors.length];
      
      el.style.backgroundColor = bg;
      el.innerHTML = renderItemVisual(item, '30px');
      
      // Position evenly
      const spacing = containerWidth / pool.length;
      const left = (index * spacing) + (spacing / 2) - (balloonWidth / 2);
      
      el.style.left = left + 'px';
      el.style.bottom = '-80px';
      
      el.dataset.es = item.es;
      
      el.addEventListener('mousedown', () => popBalloon(el, item));
      el.addEventListener('touchstart', (e) => { e.preventDefault(); popBalloon(el, item); });

      container.appendChild(el);
      
      activeBalloons.push({
        element: el,
        y: -80,
        speed: 1.5 + Math.random() * 1.5, // Random speed
        item: item
      });
    });
  }

  function popBalloon(el, item) {
    if (!gameActive) return;
    
    // Add pop animation class
    el.style.transform = 'scale(1.5)';
    el.style.opacity = '0';
    
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 200);

    activeBalloons = activeBalloons.filter(b => b.element !== el);

    if (item.es === currentWord.es) {
      // Correct!
      score++;
      if (typeof playSound === 'function') playSound('correct');
      if (typeof registerCorrectAnswer === 'function') registerCorrectAnswer(item);
      
      updateBalloonsUI();
      
      if (score >= targetScore) {
        endGame(true);
      } else {
        setTimeout(nextRound, 500);
      }
    } else {
      // Wrong!
      lives--;
      if (typeof playSound === 'function') playSound('wrong');
      if (typeof registerWrongAnswer === 'function') registerWrongAnswer(currentWord);
      
      updateBalloonsUI();
      
      if (lives <= 0) {
        endGame(false);
      }
    }
  }

  function gameLoop() {
    if (!gameActive) return;
    const container = document.getElementById('balloonsContainer');
    if (!container) return;
    const containerHeight = container.clientHeight;

    let missedTarget = false;

    activeBalloons.forEach(b => {
      b.y += b.speed;
      b.element.style.bottom = b.y + 'px';
      
      if (b.y > containerHeight + 20) {
        if (b.item.es === currentWord.es && !missedTarget) {
          missedTarget = true;
        }
        if (b.element.parentNode) b.element.parentNode.removeChild(b.element);
      }
    });

    activeBalloons = activeBalloons.filter(b => b.y <= containerHeight + 20);

    if (missedTarget) {
      lives--;
      if (typeof playSound === 'function') playSound('wrong');
      if (typeof registerWrongAnswer === 'function') registerWrongAnswer(currentWord);
      updateBalloonsUI();
      
      if (lives <= 0) {
        endGame(false);
      } else {
        setTimeout(nextRound, 500);
      }
    } else if (activeBalloons.length === 0 && gameActive) {
      // Wszyscy odlecieli, ale nie ominęliśmy poprawnego (to niemożliwe logicznie, ale zabezpieczenie)
      setTimeout(nextRound, 500);
    }
  }

  function updateBalloonsUI() {
    const sEl = document.getElementById('balloonsScore');
    const tEl = document.getElementById('balloonsTarget');
    const lEl = document.getElementById('balloonsLives');
    
    if (sEl) sEl.textContent = score;
    if (tEl) tEl.textContent = targetScore;
    if (lEl) lEl.textContent = lives;
  }

  function endGame(win) {
    gameActive = false;
    clearInterval(balloonsInterval);
    
    const summary = document.getElementById('balloonsSummary');
    const msg = document.getElementById('balloonsFinalMsg');
    
    summary.classList.remove('hidden');
    
    if (win) {
      const xp = targetScore * 5;
      if (typeof addXP === 'function') addXP(xp, 'Balloons Game');
      if (typeof launchConfetti === 'function') launchConfetti();
      msg.textContent = `¡Fantástico! Przebito wszystkie balony! Zdobyto ${xp} XP! 🎉`;
      
      const st = getModeStats('BALLOONS', currentLevel, currentCat);
      st.games = (st.games || 0) + 1;
      setModeStats('BALLOONS', currentLevel, currentCat, st);
      updateGlobalStats();
    } else {
      msg.textContent = `Koniec żyć! Ukończono ${score}/${targetScore}. Spróbuj jeszcze raz! 💪`;
    }
  }

  window.startBalloons = startBalloons;

  document.addEventListener('click', (e) => {
    if (e.target.id === 'balloonsMenuBtn' || e.target.id === 'balloonsSumMenuBtn') {
      clearInterval(balloonsInterval);
      gameActive = false;
      show('menu');
    }
    if (e.target.id === 'balloonsRetryBtn') {
      startBalloons();
    }
    if (e.target.id === 'balloonsSpeakBtn') {
      if (currentWord && typeof speak === 'function') speak(currentWord.es);
    }
  });

})();