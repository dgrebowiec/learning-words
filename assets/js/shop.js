const SHOP_CATALOG = [
  {id:'shop_parrot',   icon:'🦜', name:'Papuga Hispanica', desc:'Ekspert od powtarzania słów.', cost:3},
  {id:'shop_wizard',   icon:'🧙', name:'Czarodziej słów',   desc:'Prawdziwy mistrz języka.', cost:5},
  {id:'shop_unicorn',  icon:'🦄', name:'Jednorożec nauki',  desc:'Rzadka i wyjątkowa naklejka.', cost:8},
  {id:'shop_dragon',   icon:'🐉', name:'Smoczy mistrz',     desc:'Pokonaj wszystkie wyzwania.', cost:12},
  {id:'shop_galaxy',   icon:'🌌', name:'Galaktyczny uczeń', desc:'Sięgnij gwiazd!', cost:20},
  {id:'shop_diamond',  icon:'💎', name:'Diament wiedzy',    desc:'Najcenniejsza kolekcja.', cost:30},
];

function SHOP_KEY(){ return `hiszp_${profileId()}_shop_v1`; }
function loadShopOwned(){ try { return JSON.parse(localStorage.getItem(SHOP_KEY())) || []; } catch { return []; } }
function saveShopOwned(arr){ localStorage.setItem(SHOP_KEY(), JSON.stringify(arr)); }

function buyShopItem(id){
  const item = SHOP_CATALOG.find(x => x.id === id);
  if (!item) return;
  const owned = loadShopOwned();
  if (owned.some(o => o.id === id)){ toast('Masz już tę naklejkę!'); return; }
  const state = loadAchievements();
  const stars = state.stars || 0;
  if (stars < item.cost){ toast(`Potrzebujesz ${item.cost} ⭐, masz tylko ${stars}.`); return; }
  state.stars = stars - item.cost;
  saveAchievements(state);
  owned.push({id: item.id, boughtAt: new Date().toISOString()});
  saveShopOwned(owned);
  toast(`🛒 Zakupiono: ${item.icon} ${item.name}!`);
  if (typeof launchConfetti === 'function') launchConfetti();
  renderAchievements();
  renderShop();
}

function renderShop(){
  const shelf = document.getElementById('shopShelf');
  if (!shelf) return;
  const owned = loadShopOwned();
  const state = loadAchievements();
  const stars = state.stars || 0;
  const starsEl = document.getElementById('shopStarBalance');
  if (starsEl) starsEl.textContent = stars;
  shelf.innerHTML = '';
  SHOP_CATALOG.forEach(item => {
    const isOwned = owned.some(o => o.id === item.id);
    const canAfford = stars >= item.cost;
    const el = document.createElement('div');
    el.className = 'shop-item' + (isOwned ? ' shop-owned' : '') + (!canAfford && !isOwned ? ' shop-unaffordable' : '');
    el.innerHTML = `
      <span class="shop-item-icon">${item.icon}</span>
      <div class="shop-item-info">
        <b>${item.name}</b>
        <span class="shop-item-desc">${item.desc}</span>
      </div>
      <button class="btn shop-buy-btn${isOwned ? ' shop-owned-btn' : ''}" data-shop-id="${item.id}" ${isOwned ? 'disabled' : ''}>
        ${isOwned ? '✓ Masz' : `⭐ ${item.cost}`}
      </button>`;
    shelf.appendChild(el);
  });
}

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-shop-id]');
  if (btn) buyShopItem(btn.getAttribute('data-shop-id'));
});
