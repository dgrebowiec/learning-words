function getTamaStage(xp) {
  if (xp < 100) return { emoji: '🥚', name: 'Jajeczko', req: 100 };
  if (xp < 300) return { emoji: '🐣', name: 'Pisklak', req: 300 };
  if (xp < 600) return { emoji: '🐥', name: 'Kurczaczek', req: 600 };
  if (xp < 1000) return { emoji: '🐔', name: 'Kura', req: 1000 };
  return { emoji: '🦅', name: 'Orzeł', req: 1000, max: true };
}

function renderTamagotchi() {
  const state = typeof loadXP === 'function' ? loadXP() : {xp:0};
  const stage = getTamaStage(state.xp);
  
  const petEl = document.getElementById('tamaPet');
  const nameEl = document.getElementById('tamaName');
  const xpFill = document.getElementById('tamaXpFill');
  const statusEl = document.getElementById('tamaStatus');

  if(petEl) petEl.textContent = stage.emoji;
  if(nameEl) nameEl.textContent = stage.name;
  
  if(xpFill) {
    if (stage.max) {
      xpFill.style.width = '100%';
      if(statusEl) statusEl.textContent = `Twój zwierzak osiągnął maksymalny poziom! (${state.xp} XP)`;
    } else {
      let prevReq = 0;
      if (state.xp >= 600) prevReq = 600;
      else if (state.xp >= 300) prevReq = 300;
      else if (state.xp >= 100) prevReq = 100;

      const range = stage.req - prevReq;
      const progress = state.xp - prevReq;
      const pct = Math.max(0, Math.min(100, (progress / range) * 100));
      xpFill.style.width = pct + '%';
      if(statusEl) statusEl.textContent = `Brakuje ${stage.req - state.xp} XP do ewolucji!`;
    }
  }
}

function initTamagotchiInteractions() {
  const tamaFeedBtn = document.getElementById('tamaFeedBtn');
  const tamaPetBtn = document.getElementById('tamaPetBtn');
  const tamaMessage = document.getElementById('tamaMessage');
  const tamaPet = document.getElementById('tamaPet');

  function playTamaAnim(msg) {
    if(tamaMessage) tamaMessage.textContent = msg;
    if(tamaPet) {
      tamaPet.classList.remove('tama-happy-anim');
      void tamaPet.offsetWidth;
      tamaPet.classList.add('tama-happy-anim');
    }
    miniConfetti(tamaPet);
    setTimeout(() => {
      if(tamaMessage) tamaMessage.textContent = '';
    }, 2000);
  }

  if(tamaFeedBtn) tamaFeedBtn.addEventListener('click', () => {
    playTamaAnim('Mniam mniam! 🍎 Otrzymano jedzonko!');
  });
  if(tamaPetBtn) tamaPetBtn.addEventListener('click', () => {
    playTamaAnim('Mru mru! 🥰 Zwierzak jest szczęśliwy!');
  });
}

// Inicjalizacja nasłuchiwaczy zdarzeń gdy DOM jest gotowy (odpalane z bootstrap)
document.addEventListener('DOMContentLoaded', () => {
  // Tryb będzie załadowany dynamicznie, więc zdarzenia najlepiej podpiąć po wstrzyknięciu HTML
  // Co bootstrap robi asynchronicznie, więc dla pewności podepniemy przy renderTamagotchi z opóźnieniem
});

// Hack: zainicjuj eventy przy pierwszym renderze, ponieważ partial ładuje się async
let tamaEventsBound = false;
const originalRenderTamagotchi = renderTamagotchi;
window.renderTamagotchi = function() {
  originalRenderTamagotchi();
  if(!tamaEventsBound && document.getElementById('tamaFeedBtn')) {
    initTamagotchiInteractions();
    tamaEventsBound = true;
  }
};
