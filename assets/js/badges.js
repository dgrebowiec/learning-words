const BADGES_CATALOG = [
  {id:'first_game',   icon:'🎉', name:'Pierwsza gra!', desc:'Ukończ dowolną grę po raz pierwszy.'},
  {id:'perfect_easy', icon:'🌟', name:'Perfekt: Łatwy', desc:'Zdobądź 100% w grze na poziomie Łatwy.'},
  {id:'perfect_mid',  icon:'💫', name:'Perfekt: Średni', desc:'Zdobądź 100% w grze na poziomie Średni.'},
  {id:'perfect_hard', icon:'🏆', name:'Perfekt: Trudny', desc:'Zdobądź 100% w grze na poziomie Trudny.'},
  {id:'streak_5',     icon:'🔥', name:'Seria 5',        desc:'Osiągnij serię 5 poprawnych odpowiedzi.'},
  {id:'speed_runner', icon:'⏱️', name:'Szybka runda',   desc:'Ukończ grę w < 60 s (dowolny poziom).'},
  {id:'fruit_master', icon:'🍓', name:'Mistrz owoców',  desc:'100% w grze w kategorii Owoce (dowolny poziom).'},
  {id:'veggie_master',icon:'🥦', name:'Mistrz warzyw',  desc:'100% w grze w kategorii Warzywa (dowolny poziom).'},
  {id:'emociones_master', icon:'😊', name:'Mistrz emocji', desc:'100% w grze w kategorii Emocje.'},
  {id:'pronombres_master', icon:'👤', name:'Mistrz zaimków', desc:'100% w grze w kategorii Zaimki.'},
  {id:'colores_master', icon:'🎨', name:'Mistrz kolorów', desc:'100% w grze w kategorii Kolory.'},
  {id:'escolar_master', icon:'🎒', name:'Mistrz przyborów', desc:'100% w grze w kategorii Przybory szkolne.'},
  {id:'halloween_master', icon:'🎃', name:'Mistrz Halloween', desc:'100% w grze w kategorii Halloween.'},
  {id:'navidad_master', icon:'🎄', name:'Mistrz świąt', desc:'100% w grze w kategorii Boże Narodzenie.'},
  {id:'otono_master', icon:'🍂', name:'Mistrz jesieni', desc:'100% w grze w kategorii Jesień.'},
  {id:'invierno_master', icon:'❄️', name:'Mistrz zimy', desc:'100% w grze w kategorii Zima.'},
  {id:'estaciones_master', icon:'🌸', name:'Mistrz pór roku', desc:'100% w grze w kategorii Pory roku.'}
];
function loadBadges(){ try { return JSON.parse(localStorage.getItem(BADGES_KEY())) || []; } catch { return []; } }
function saveBadges(arr){ localStorage.setItem(BADGES_KEY(), JSON.stringify(arr)); }
function hasBadge(id){ return loadBadges().some(b=>b.id===id); }
function awardBadge(id){
  if (hasBadge(id)) return false;
  const cat = BADGES_CATALOG.find(x=>x.id===id); if (!cat) return false;
  const now = new Date().toISOString();
  const list = loadBadges(); list.push({id:cat.id, earnedAt:now}); saveBadges(list);
  renderBadges(); toast(`Zdobyto odznakę: ${cat.icon} ${cat.name}`);
  return true;
}
function renderBadges(){
  const shelf = $('#badgeShelf'); if (!shelf) return;
  shelf.innerHTML='';
  const owned = loadBadges().map(b=> ({...BADGES_CATALOG.find(c=>c.id===b.id), earnedAt:b.earnedAt}));
  $('#badgeTotal').textContent = BADGES_CATALOG.length;
  $('#badgeCount').textContent = owned.length;
  BADGES_CATALOG.forEach(cat=>{
    const ownedOne = owned.find(o=>o.id===cat.id);
    const el = document.createElement('div'); el.className='badge';
    el.style.opacity = ownedOne ? '1' : '.55';
    el.title = cat.desc + (ownedOne ? `\nZdobyto: ${new Date(ownedOne.earnedAt).toLocaleString()}` : '');
    el.innerHTML = `<span style="font-size:18px">${cat.icon}</span><b>${cat.name}</b>`;
    shelf.appendChild(el);
  });
}

function checkAndAwardBadges(level, cat, score, len, streak, time, games) {
  if (games === 1) awardBadge('first_game');

  if (score === len) {
    if (level === 'LATWY') awardBadge('perfect_easy');
    if (level === 'SREDNI') awardBadge('perfect_mid');
    if (level === 'TRUDNY') awardBadge('perfect_hard');
    if (cat === 'FRUITS') awardBadge('fruit_master');
    if (cat === 'VEGGIES') awardBadge('veggie_master');
    if (cat === 'EMOCIONES') awardBadge('emociones_master');
    if (cat === 'PRONOMBRES') awardBadge('pronombres_master');
    if (cat === 'COLORES') awardBadge('colores_master');
    if (cat === 'MATERIAL_ESCOLAR') awardBadge('escolar_master');
    if (cat === 'HALLOWEEN') awardBadge('halloween_master');
    if (cat === 'NAVIDAD') awardBadge('navidad_master');
    if (cat === 'OTONO') awardBadge('otono_master');
    if (cat === 'INVIERNO') awardBadge('invierno_master');
    if (cat === 'ESTACIONES') awardBadge('estaciones_master');
  }
  if (streak >= 5) awardBadge('streak_5');
  if (time < 60) awardBadge('speed_runner');
}
