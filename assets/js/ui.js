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
