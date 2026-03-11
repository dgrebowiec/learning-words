function renderItemVisual(item, size){
  size = size || '5rem';
  if (item.emoji){
    return '<span class="emoji-visual" style="font-size:'+size+'" role="img" aria-label="'+item.pl+'">'+item.emoji+'</span>';
  }
  return '<img src="'+item.img+'" alt="'+item.pl+'" class="item-img" />';
}

function toast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.position='fixed'; t.style.bottom='16px'; t.style.left='50%'; t.style.transform='translateX(-50%)';
  t.style.background='rgba(0,0,0,.85)'; t.style.padding='10px 14px'; t.style.border='1px solid rgba(255,255,255,.25)';
  t.style.borderRadius='12px'; t.style.zIndex='9999'; t.style.color='#fff';
  document.body.appendChild(t); setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .4s'; }, 1400);
  setTimeout(()=> t.remove(), 1850);
}

function renderCombo(elId, val) {
  const el = document.getElementById(elId);
  if (!el) return;
  const fires = val >= 5 ? ' 🔥🔥🔥' : val >= 3 ? ' 🔥' : '';
  el.textContent = val + fires;
  const pill = el.closest('.pill');
  if (!pill) return;
  if (val >= 3) {
    pill.classList.remove('streak-combo');
    void pill.offsetWidth;
    pill.classList.add('streak-combo');
  } else {
    pill.classList.remove('streak-combo');
  }
}

function miniConfetti(sourceEl) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#f59e0b','#ef4444','#10b981','#3b82f6','#8b5cf6','#ec4899'];
  const rect = sourceEl ? sourceEl.getBoundingClientRect() : {left:window.innerWidth/2,top:window.innerHeight/2,width:0,height:0};
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    const size = 6 + Math.random() * 5;
    p.style.cssText = `position:fixed;width:${size}px;height:${size}px;border-radius:50%;background:${colors[i%colors.length]};left:${cx}px;top:${cy}px;pointer-events:none;z-index:9999;`;
    document.body.appendChild(p);
    const angle = (i / 18) * 2 * Math.PI + Math.random() * 0.4;
    const dist = 45 + Math.random() * 65;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 20;
    p.animate(
      [{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0)`,opacity:0}],
      {duration:480+Math.random()*200,easing:'cubic-bezier(0,0,.2,1)',fill:'forwards'}
    ).onfinish = () => p.remove();
  }
}

function showStarRating(pct, elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.innerHTML = '';
  const count = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;
  for (let i = 0; i < 3; i++) {
    const star = document.createElement('span');
    star.className = 'star-icon' + (i >= count ? ' star-empty' : '');
    star.textContent = '⭐';
    if (i < count) star.style.animationDelay = (i * 320) + 'ms';
    el.appendChild(star);
  }
  if (count === 3) {
    setTimeout(() => { if (typeof launchConfetti === 'function') launchConfetti(); }, 1100);
  }
}

// ==========================================
// NOWE EFEKTY WIZUALNE I HAPTYCZNE (UX/JUICE)
// ==========================================

function spawnTouchParticles(x, y) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#22d3ee'];
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('div');
    const size = 4 + Math.random() * 6;
    p.style.cssText = `position:fixed;width:${size}px;height:${size}px;border-radius:50%;background:${colors[Math.floor(Math.random()*colors.length)]};left:${x}px;top:${y}px;pointer-events:none;z-index:99999;box-shadow:0 0 4px ${colors[Math.floor(Math.random()*colors.length)]};`;
    document.body.appendChild(p);
    const angle = Math.random() * 2 * Math.PI;
    const dist = 15 + Math.random() * 30;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    p.animate(
      [{transform:'translate(-50%,-50%) scale(1)',opacity:0.8},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0)`,opacity:0}],
      {duration:300+Math.random()*200,easing:'ease-out',fill:'forwards'}
    ).onfinish = () => p.remove();
  }
}

function vibrate(pattern) {
  if (navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch (e) {}
  }
}

function flashScreen(type) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const color = type === 'correct' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)';
  const overlay = document.createElement('div');
  overlay.style.cssText = `position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:9998;background:radial-gradient(circle at center, transparent 40%, ${color} 120%);transition:opacity 0.3s;opacity:1;`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 300);
  });
}

function reactCheerleader(type) {
  const mascot = document.getElementById('cheerleaderMascot');
  if (!mascot) return;

  if (typeof loadPetsData === 'function' && typeof getPetStage === 'function') {
    try {
      const data = loadPetsData();
      const activeId = data.activePetId || 'chicken';
      const petData = data.pets[activeId] || { xp: 0 };
      const stage = getPetStage(activeId, petData.xp);
      if (stage && stage.emoji) {
        mascot.querySelector('span').textContent = stage.emoji;
      }
    } catch(e) {}
  }
  
  mascot.classList.remove('hidden', 'cheer', 'sad');
  void mascot.offsetWidth; // trigger reflow
  
  if (type === 'happy') {
    mascot.classList.add('cheer');
    setTimeout(() => mascot.classList.remove('cheer'), 1000);
  } else if (type === 'sad') {
    mascot.classList.add('sad');
    setTimeout(() => mascot.classList.remove('sad'), 1000);
  }
}

// Globalne nasłuchiwanie kliknięć dla efektów
document.addEventListener('pointerdown', (e) => {
  // Ignorujemy przewijanie, bierzemy pierwszy punkt dotyku lub kliknięcie myszką
  const x = e.clientX;
  const y = e.clientY;
  if (e.pointerType === 'mouse' || e.pointerType === 'touch') {
    spawnTouchParticles(x, y);
  }
  // Delikatna wibracja na klik
  if (e.target.closest('button') || e.target.closest('.choice') || e.target.closest('.cat-card') || e.target.closest('.memory-card') || e.target.closest('.catch-item')) {
    vibrate(10);
  }
}, {passive: true});
