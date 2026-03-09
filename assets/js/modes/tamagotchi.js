const PET_TYPES = [
  {
    id: 'chicken', name: 'Kurczaczek',
    stages: [
      { emoji: '🥚', name: 'Jajeczko', req: 100 },
      { emoji: '🐣', name: 'Pisklak', req: 300 },
      { emoji: '🐥', name: 'Kurczaczek', req: 600 },
      { emoji: '🐔', name: 'Kura', req: 1000 },
      { emoji: '🦅', name: 'Orzeł', req: 1000, max: true }
    ],
    favFood: 'apple'
  },
  {
    id: 'dog', name: 'Piesek',
    stages: [
      { emoji: '🎾', name: 'Zabawka', req: 120 },
      { emoji: '🐶', name: 'Szczeniak', req: 350 },
      { emoji: '🐕', name: 'Piesek', req: 700 },
      { emoji: '🦮', name: 'Pies Tropiący', req: 1100 },
      { emoji: '🐺', name: 'Wilk', req: 1100, max: true }
    ],
    favFood: 'bone'
  },
  {
    id: 'cat', name: 'Kotek',
    stages: [
      { emoji: '🧶', name: 'Kłębek', req: 120 },
      { emoji: '🐱', name: 'Kociak', req: 350 },
      { emoji: '🐈', name: 'Kotek', req: 700 },
      { emoji: '🐈‍⬛', name: 'Czarny Kot', req: 1100 },
      { emoji: '🦁', name: 'Lew', req: 1100, max: true }
    ],
    favFood: 'fish'
  },
  {
    id: 'dragon', name: 'Smoczek',
    stages: [
      { emoji: '🪨', name: 'Smocze Jajo', req: 150 },
      { emoji: '🦎', name: 'Jaszczurka', req: 400 },
      { emoji: '🦕', name: 'Mały Smok', req: 800 },
      { emoji: '🦖', name: 'Smok', req: 1200 },
      { emoji: '🐉', name: 'Potężny Smok', req: 1200, max: true }
    ],
    favFood: 'meat'
  },
  {
    id: 'unicorn', name: 'Jednorożec',
    stages: [
      { emoji: '🔮', name: 'Magiczna Kula', req: 200 },
      { emoji: '🐴', name: 'Kucyk', req: 500 },
      { emoji: '🐎', name: 'Koń', req: 900 },
      { emoji: '🦄', name: 'Jednorożec', req: 1500 },
      { emoji: '✨', name: 'Alikorn', req: 1500, max: true }
    ],
    favFood: 'candy'
  }
];

const FOOD_TYPES = [
  { id: 'apple', emoji: '🍎', name: 'Jabłko', cost: 1, xp: 20 },
  { id: 'bone', emoji: '🦴', name: 'Kość', cost: 1, xp: 20 },
  { id: 'fish', emoji: '🐟', name: 'Ryba', cost: 2, xp: 50 },
  { id: 'meat', emoji: '🥩', name: 'Mięso', cost: 2, xp: 50 },
  { id: 'candy', emoji: '🍬', name: 'Cukierek', cost: 3, xp: 80 },
];

function PET_STORAGE_KEY() { return `hiszp_${profileId()}_pets_v1`; }

function loadPetsData() {
  try {
    const raw = localStorage.getItem(PET_STORAGE_KEY());
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  
  // Migracja z globalnego XP do pierwszego zwierzaka
  const globalXP = typeof loadXP === 'function' ? loadXP().xp : 0;
  return {
    activePetId: 'chicken',
    pets: {
      'chicken': { xp: globalXP }
    }
  };
}

function savePetsData(data) {
  localStorage.setItem(PET_STORAGE_KEY(), JSON.stringify(data));
}

function getPetStage(petId, xp) {
  const typeDef = PET_TYPES.find(p => p.id === petId) || PET_TYPES[0];
  let currentStage = typeDef.stages[typeDef.stages.length - 1]; // default to max
  let prevReq = 0;

  for (let i = 0; i < typeDef.stages.length; i++) {
    const s = typeDef.stages[i];
    if (xp < s.req || s.max) {
      currentStage = s;
      if (i > 0) prevReq = typeDef.stages[i - 1].req;
      break;
    }
  }
  return { ...currentStage, prevReq };
}

function hasAnyMaxedPet(data) {
  for (const [pId, pData] of Object.entries(data.pets)) {
    const stage = getPetStage(pId, pData.xp);
    if (stage.max) return true;
  }
  return false;
}

function renderTamagotchi() {
  const data = loadPetsData();
  const activeId = data.activePetId || 'chicken';
  const typeDef = PET_TYPES.find(p => p.id === activeId) || PET_TYPES[0];
  const petData = data.pets[activeId] || { xp: 0 };
  const stage = getPetStage(activeId, petData.xp);
  
  const petEl = document.getElementById('tamaPet');
  const nameEl = document.getElementById('tamaName');
  const xpFill = document.getElementById('tamaXpFill');
  const statusEl = document.getElementById('tamaStatus');
  const foodContainer = document.getElementById('tamaFoodOptions');

  if(petEl) petEl.textContent = stage.emoji;
  if(nameEl) nameEl.textContent = `${stage.name} (${typeDef.name})`;
  
  if(xpFill) {
    if (stage.max) {
      xpFill.style.width = '100%';
      if(statusEl) statusEl.textContent = `Twój zwierzak osiągnął maksymalny poziom! (${petData.xp} XP)`;
    } else {
      const range = stage.req - stage.prevReq;
      const progress = petData.xp - stage.prevReq;
      const pct = Math.max(0, Math.min(100, (progress / range) * 100));
      xpFill.style.width = pct + '%';
      if(statusEl) statusEl.textContent = `Brakuje ${stage.req - petData.xp} XP do ewolucji!`;
    }
  }

  // Generowanie menu jedzenia
  if(foodContainer) {
    foodContainer.innerHTML = '';
    FOOD_TYPES.forEach(food => {
      const isFav = typeDef.favFood === food.id;
      const xpGain = isFav ? food.xp * 2 : food.xp;
      const costText = stage.max ? 'Darmowe' : `-${food.cost} ⭐`;
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.style.minWidth = '80px';
      btn.style.display = 'flex';
      btn.style.flexDirection = 'column';
      btn.style.alignItems = 'center';
      btn.style.lineHeight = '1.2';
      btn.style.padding = '8px';
      btn.style.position = 'relative';
      if(isFav) {
        btn.style.border = '2px solid var(--accent)';
      }

      btn.innerHTML = `
        <span style="font-size:24px;">${food.emoji}</span>
        <span style="font-size:0.8em;">${food.name}</span>
        <span style="font-size:0.7em; opacity:0.8;">${costText}</span>
        <span style="font-size:0.7em; color:var(--good);">+${xpGain} XP</span>
      `;
      if(isFav) {
        btn.innerHTML += `<div style="position:absolute; top:-8px; right:-8px; background:var(--accent); color:#fff; font-size:10px; padding:2px 5px; border-radius:10px;">Ulubione</div>`;
      }
      
      btn.addEventListener('click', () => feedPet(food, isFav, stage.max));
      foodContainer.appendChild(btn);
    });
  }
}

function feedPet(food, isFav, isMaxed) {
  const data = loadPetsData();
  const activeId = data.activePetId;
  const achState = typeof loadAchievements === 'function' ? loadAchievements() : {stars: 0};
  
  if (!isMaxed && achState.stars < food.cost) {
    playTamaAnim('O nie! Brakuje gwiazdek! ⭐ Zdobądź je w grach!');
    return;
  }
  
  if (!isMaxed) {
    achState.stars -= food.cost;
    if(typeof saveAchievements === 'function') saveAchievements(achState);
    if(typeof renderAchievements === 'function') renderAchievements();
  }
  
  // Oblicz xp
  const xpGain = isFav ? food.xp * 2 : food.xp;
  if (!data.pets[activeId]) data.pets[activeId] = { xp: 0 };
  data.pets[activeId].xp += xpGain;
  savePetsData(data);
  
  // Dodajemy też globalnego XP gracza (opcjonalnie)
  if(typeof addXP === 'function') {
    addXP(xpGain, 'Karmienie zwierzaka');
  }

  const msg = isFav ? `Mniam mniam! Ulubione! 😍 (+${xpGain} XP)` : `Pyszne! 😋 (+${xpGain} XP)`;
  playTamaAnim(msg);
  renderTamagotchi();
}

function playTamaAnim(msg) {
  const tamaMessage = document.getElementById('tamaMessage');
  const tamaPet = document.getElementById('tamaPet');
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

function initTamagotchiInteractions() {
  const tamaPetBtn = document.getElementById('tamaPetBtn');
  const tamaAlbumBtn = document.getElementById('tamaAlbumBtn');
  const tamaBackBtn = document.getElementById('tamaBackBtn');

  if(tamaPetBtn) tamaPetBtn.addEventListener('click', () => {
    playTamaAnim('Mru mru! 🥰 Zwierzak jest szczęśliwy!');
  });
  
  if(tamaAlbumBtn) tamaAlbumBtn.addEventListener('click', showAlbumView);
  if(tamaBackBtn) tamaBackBtn.addEventListener('click', showMainView);
}

function showAlbumView() {
  const mainView = document.getElementById('tamaMainView');
  const albumView = document.getElementById('tamaAlbumView');
  const tamaAlbumBtn = document.getElementById('tamaAlbumBtn');
  if(mainView) mainView.style.display = 'none';
  if(tamaAlbumBtn) tamaAlbumBtn.style.display = 'none';
  if(albumView) {
    albumView.style.display = 'flex';
    renderAlbum();
  }
}

function showMainView() {
  const mainView = document.getElementById('tamaMainView');
  const albumView = document.getElementById('tamaAlbumView');
  const tamaAlbumBtn = document.getElementById('tamaAlbumBtn');
  if(albumView) albumView.style.display = 'none';
  if(tamaAlbumBtn) tamaAlbumBtn.style.display = 'block';
  if(mainView) {
    mainView.style.display = 'flex';
    renderTamagotchi();
  }
}

function renderAlbum() {
  const list = document.getElementById('tamaAlbumList');
  if(!list) return;
  list.innerHTML = '';
  
  const data = loadPetsData();
  const canAdoptNew = hasAnyMaxedPet(data);
  
  PET_TYPES.forEach(typeDef => {
    const isOwned = !!data.pets[typeDef.id];
    const petData = data.pets[typeDef.id] || { xp: 0 };
    const stage = getPetStage(typeDef.id, petData.xp);
    const isActive = data.activePetId === typeDef.id;
    
    const card = document.createElement('div');
    card.style.background = 'rgba(255,255,255,0.05)';
    card.style.borderRadius = '12px';
    card.style.padding = '10px';
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.gap = '15px';
    if(isActive) {
      card.style.border = '2px solid var(--accent)';
    }

    if(isOwned) {
      card.innerHTML = `
        <div style="font-size: 50px;">${stage.emoji}</div>
        <div style="flex:1;">
          <h4 style="margin:0;">${stage.name} (${typeDef.name})</h4>
          <div style="font-size: 0.8em; opacity: 0.8;">XP: ${petData.xp}${stage.max ? ' (MAX)' : ` / ${stage.req}`}</div>
          ${isActive ? '<div style="color:var(--accent); font-weight:bold; font-size:0.8em;">Aktywny</div>' : ''}
        </div>
      `;
      if(!isActive) {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.style.padding = '5px 10px';
        btn.textContent = 'Wybierz';
        btn.onclick = () => {
          data.activePetId = typeDef.id;
          savePetsData(data);
          renderAlbum();
        };
        card.appendChild(btn);
      }
    } else {
      card.innerHTML = `
        <div style="font-size: 50px; opacity: 0.5;">❓</div>
        <div style="flex:1; opacity: 0.7;">
          <h4 style="margin:0;">${typeDef.name}</h4>
          <div style="font-size: 0.8em;">Nieodkryty</div>
        </div>
      `;
      if(canAdoptNew) {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.style.padding = '5px 10px';
        btn.style.background = 'var(--good)';
        btn.textContent = 'Zaadoptuj';
        btn.onclick = () => {
          data.pets[typeDef.id] = { xp: 0 };
          data.activePetId = typeDef.id;
          savePetsData(data);
          if (typeof launchConfetti === 'function') launchConfetti();
          renderAlbum();
        };
        card.appendChild(btn);
      } else {
        const lock = document.createElement('div');
        lock.style.fontSize = '0.8em';
        lock.style.opacity = '0.6';
        lock.style.textAlign = 'right';
        lock.innerHTML = 'Odblokuj<br>wychowując<br>innego na MAX';
        card.appendChild(lock);
      }
    }
    
    list.appendChild(card);
  });
}

// Hack: zainicjuj eventy przy pierwszym renderze, ponieważ partial ładuje się async
let tamaEventsBound = false;
const originalRenderTamagotchi = renderTamagotchi;
window.renderTamagotchi = function() {
  originalRenderTamagotchi();
  if(!tamaEventsBound && document.getElementById('tamaPetBtn')) {
    initTamagotchiInteractions();
    tamaEventsBound = true;
  }
};
