let oppCurrentPairs = [];
let oppMatchedCount = 0;
let oppTimer = null;
let oppStartTime = 0;
let oppPairsTotal = 0;

let pieceDragging = null;
let pieceDragOffset = { x: 0, y: 0 };
let pieceDragOriginalRect = null;

function startOpposites() {
  show('opposites');
  const ds = datasetFor(currentCat);
  const fullPool = ds.filter(w => w.opposite);
  
  // Create unique pairs
  const uniquePairs = [];
  const seenIds = new Set();
  fullPool.forEach(w => {
    const pairId = [w.es.toLowerCase(), w.opposite.toLowerCase()].sort().join('-');
    if (!seenIds.has(pairId)) {
        uniquePairs.push(w);
        seenIds.add(pairId);
    }
  });

  const levelConf = LEVELS[currentLevel] || LEVELS.LATWY;
  const count = Math.min(uniquePairs.length, Math.ceil(levelConf.len / 2));
  oppCurrentPairs = shuffle([...uniquePairs]).slice(0, count);
  oppPairsTotal = oppCurrentPairs.length;
  
  oppMatchedCount = 0;
  
  document.getElementById('oppSummary').classList.add('hidden');
  document.getElementById('oppositesGameContainer').classList.remove('hidden');
  
  renderOpposites();
  startOppTimer();
}

function renderOpposites() {
  const puzzleArea = document.getElementById('oppPuzzleArea');
  const bank = document.getElementById('oppBank');
  if (!puzzleArea || !bank) return;
  
  puzzleArea.innerHTML = '';
  bank.innerHTML = '';
  
  const ds = datasetFor(currentCat);

  // Dane dla lewej strony (stałe)
  const leftData = oppCurrentPairs.map(p => ({
    id: p.es,
    es: p.es,
    pl: p.pl,
    emoji: p.emoji,
    side: 'left'
  }));

  // Dane dla prawej strony (kawałki do przeciągania)
  const rightData = oppCurrentPairs.map(p => {
    const oppWord = ds.find(w => w.es.toLowerCase() === p.opposite.toLowerCase()) || {es: p.opposite, pl: '', emoji: ''};
    return {
        id: p.es, // id parowania to id lewego słowa
        es: oppWord.es,
        pl: oppWord.pl,
        emoji: oppWord.emoji,
        side: 'right'
    };
  });

  // Renderujemy rzędy
  leftData.forEach(item => {
    puzzleArea.appendChild(createOppRow(item));
  });

  // Renderujemy bank (rozsypane)
  shuffle(rightData).forEach(item => {
    bank.appendChild(createOppPiece(item));
  });
  
  updateOppPairsText();
}

function createOppRow(item) {
    const row = document.createElement('div');
    row.className = 'opp-row';
    row.dataset.id = item.id;
    
    const isHard = currentLevel === 'TRUDNY';
    const emoji = isHard ? '' : (item.emoji || '❓');
    const pl = isHard ? '' : item.pl;
    
    row.innerHTML = `
        <div class="opp-btn" data-side="left">
            ${emoji ? `<span style="font-size:36px; pointer-events:none; margin-bottom:4px;">${emoji}</span>` : ''}
            <b style="font-size:18px; pointer-events:none;">${item.es}</b>
            ${pl ? `<small style="opacity:0.7; font-size:13px; pointer-events:none;">${pl}</small>` : ''}
        </div>
        <div class="opp-slot" data-id="${item.id}">
            Upuść tutaj
        </div>
    `;
    return row;
}

function createOppPiece(item) {
    const piece = document.createElement('div');
    piece.className = 'opp-piece';
    piece.dataset.id = item.id;
    
    const isHard = currentLevel === 'TRUDNY';
    const emoji = isHard ? '' : (item.emoji || '❓');
    const pl = isHard ? '' : item.pl;

    piece.innerHTML = `
        ${emoji ? `<span style="font-size:28px; pointer-events:none; margin-bottom:2px;">${emoji}</span>` : ''}
        <b style="font-size:16px; pointer-events:none;">${item.es}</b>
        ${pl ? `<small style="opacity:0.8; font-size:12px; pointer-events:none;">${pl}</small>` : ''}
    `;
    
    piece.onmousedown = (e) => startPieceDrag(e, piece, item);
    piece.ontouchstart = (e) => startPieceDrag(e, piece, item);
    
    return piece;
}

function startPieceDrag(e, el, item) {
    if (pieceDragging) return;
    
    pieceDragging = el;
    pieceDragOriginalRect = el.getBoundingClientRect();
    el.classList.add('dragging');
    
    const clientX = (e.touches) ? e.touches[0].clientX : e.clientX;
    const clientY = (e.touches) ? e.touches[0].clientY : e.clientY;
    
    pieceDragOffset = {
        x: clientX - pieceDragOriginalRect.left,
        y: clientY - pieceDragOriginalRect.top
    };
    
    el.style.position = 'fixed';
    el.style.width = pieceDragOriginalRect.width + 'px';
    el.style.height = pieceDragOriginalRect.height + 'px';
    el.style.pointerEvents = 'none'; // By móc wykryć slot pod spodem
    
    movePiece(clientX, clientY);
    
    window.addEventListener('mousemove', handlePieceMove);
    window.addEventListener('mouseup', handlePieceEnd);
    window.addEventListener('touchmove', handlePieceMove, { passive: false });
    window.addEventListener('touchend', handlePieceEnd);
}

function handlePieceMove(e) {
    if (!pieceDragging) return;
    if (e.type === 'touchmove') e.preventDefault();
    const clientX = (e.touches) ? e.touches[0].clientX : e.clientX;
    const clientY = (e.touches) ? e.touches[0].clientY : e.clientY;
    movePiece(clientX, clientY);
    
    // Wizualna informacja o slocie pod kursorem
    const targetEl = document.elementFromPoint(clientX, clientY);
    const slot = targetEl ? targetEl.closest('.opp-slot') : null;
    
    document.querySelectorAll('.opp-slot').forEach(s => s.classList.remove('over'));
    if (slot && !slot.parentElement.classList.contains('matched')) {
        slot.classList.add('over');
    }
}

function movePiece(x, y) {
    pieceDragging.style.left = (x - pieceDragOffset.x) + 'px';
    pieceDragging.style.top = (y - pieceDragOffset.y) + 'px';
}

function handlePieceEnd(e) {
    if (!pieceDragging) return;
    
    const clientX = (e.changedTouches) ? e.changedTouches[0].clientX : e.clientX;
    const clientY = (e.changedTouches) ? e.changedTouches[0].clientY : e.clientY;
    
    // Pobierz element pod kursorem ZANIM zmienisz pointerEvents z powrotem na domyślne
    const targetEl = document.elementFromPoint(clientX, clientY);
    const slot = targetEl ? targetEl.closest('.opp-slot') : null;

    pieceDragging.classList.remove('dragging');
    pieceDragging.style.pointerEvents = '';
    
    let matched = false;
    if (slot && !slot.parentElement.classList.contains('matched')) {
        if (slot.dataset.id === pieceDragging.dataset.id) {
            // Match!
            const row = slot.parentElement;
            row.classList.add('matched');
            slot.innerHTML = pieceDragging.innerHTML;
            pieceDragging.remove();
            matched = true;
            
            oppMatchedCount++;
            updateOppPairsText();
            if (typeof playSuccessSound === 'function') playSuccessSound();
            
            if (oppMatchedCount === oppPairsTotal) {
                setTimeout(finishOpposites, 500);
            }
        } else {
            // Mismatch
            if (typeof playErrorSound === 'function') playErrorSound();
        }
    }
    
    if (!matched) {
        resetPiece(pieceDragging);
    }
    
    pieceDragging = null;
    document.querySelectorAll('.opp-slot').forEach(s => s.classList.remove('over'));
    
    window.removeEventListener('mousemove', handlePieceMove);
    window.removeEventListener('mouseup', handlePieceEnd);
    window.removeEventListener('touchmove', handlePieceMove);
    window.removeEventListener('touchend', handlePieceEnd);
}

function resetPiece(el) {
    el.style.position = '';
    el.style.width = '';
    el.style.height = '';
    el.style.left = '';
    el.style.top = '';
    el.style.pointerEvents = '';
}

function updateOppPairsText() {
  const el = document.getElementById('oppPairs');
  if (el) el.textContent = `${oppMatchedCount}/${oppPairsTotal}`;
}

function startOppTimer() {
  oppStartTime = Date.now();
  if (oppTimer) clearInterval(oppTimer);
  oppTimer = setInterval(() => {
    const elapsed = (Date.now() - oppStartTime) / 1000;
    const el = document.getElementById('oppTime');
    if (el) el.textContent = elapsed.toFixed(1) + ' s';
  }, 100);
}

function finishOpposites() {
  clearInterval(oppTimer);
  const elapsed = (Date.now() - oppStartTime) / 1000;
  
  document.getElementById('oppositesGameContainer').classList.add('hidden');
  const summary = document.getElementById('oppSummary');
  summary.classList.remove('hidden');
  
  document.getElementById('oppFinalStats').textContent = `Ukończono w ${elapsed.toFixed(1)}s! Świetna robota!`;
  
  if (typeof saveStats === 'function') {
    saveStats('OPPOSITES', currentLevel, currentCat, {
      games: 1,
      totalCorrect: oppPairsTotal,
      totalQuestions: oppPairsTotal,
      bestTime: elapsed,
      bestScore: 100,
      lastPlayed: new Date().toISOString()
    });
  }
  
  if (typeof addXP === 'function') addXP(20);
  if (typeof spawnConfetti === 'function') spawnConfetti();
}

// Event Listeners
document.getElementById('oppMenuBtn').onclick = () => show('menu');
document.getElementById('oppSumMenuBtn').onclick = () => show('menu');
document.getElementById('oppGamesBtn').onclick = () => showMenuStep(3);
document.getElementById('oppSumGamesBtn').onclick = () => showMenuStep(3);
document.getElementById('oppSumRetryBtn').onclick = () => startOpposites();

// Register globally
window.startOpposites = startOpposites;
