/* ----------------- Dane offline ----------------- */
/* Dane FRUITS, VEGGIES i reszta kategorii są w data.js (ładowany przed app.js) */

/* ---------- Utils ---------- */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
// ZMIANA: Poprawka błędu w funkcji shuffle (było [a[j],a[j]] zamiast [a[j],a[i]])
const shuffle = a => { for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (arr,n) => { const pool=[...arr]; const out=[]; while(n-- > 0 && pool.length) out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]); return out; };

/* ---------- Konfiguracja ---------- */
const LEVELS = { LATWY:{options:2,len:9}, SREDNI:{options:3,len:12}, TRUDNY:{options:4,len:15} };
const LEVEL_NAMES = { LATWY:'Łatwy', SREDNI:'Średni', TRUDNY:'Trudny' };
const ALL_SECTIONS = ['menu','flashcards','quiz','finditem','memory','articulos','wordsearch','spelling','scramble','repeat'];
let currentLevel = 'LATWY';
let currentCat = 'FRUITS';
let menuStep = 1;

function datasetFor(cat){
  if (cat === 'MIXED'){
    let all = [];
    Object.entries(CATEGORIES).forEach(([k,v]) => { if (k !== 'MIXED' && v.data) all = all.concat(v.data); });
    return all;
  }
  const entry = CATEGORIES[cat];
  return (entry && entry.data) ? entry.data : FRUITS;
}
function dataset(){ return datasetFor(currentCat); }

function catLabel(cat){
  const entry = CATEGORIES[cat];
  return entry ? entry.label : cat;
}

function renderItemVisual(item, size){
  size = size || '5rem';
  if (item.emoji){
    return '<span class="emoji-visual" style="font-size:'+size+'" role="img" aria-label="'+item.pl+'">'+item.emoji+'</span>';
  }
  return '<img src="'+item.img+'" alt="'+item.pl+'" class="item-img" />';
}

function renderCatGrid(){
  const grid = document.getElementById('catGrid');
  if (!grid) return;
  grid.innerHTML = '';
  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    const card = document.createElement('div');
    card.className = 'cat-card' + (key === currentCat ? ' active' : '');
    card.dataset.cat = key;
    const count = key === 'MIXED' ? datasetFor('MIXED').length : (cat.data ? cat.data.length : 0);
    card.innerHTML = '<span class="cat-emoji">'+cat.emoji+'</span><span class="cat-label">'+cat.label+'</span><span class="cat-count">'+count+' słów</span>';
    card.addEventListener('click', () => {
      $$('.cat-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentCat = key;
      showMenuStep(2);
    });
    grid.appendChild(card);
  });
}

/* ---------- Persistencja + Odznaki ---------- */
function profileId(){ return window.ACTIVE_PROFILE_ID || 'default'; }
function STORAGE_KEY(){ return `hiszp_${profileId()}_stats_v4`; }
function BADGES_KEY(){  return `hiszp_${profileId()}_badges_v2`; }
function MISTAKES_KEY(){ return `hiszp_${profileId()}_mistakes_v1`; }

function getDefaultStats(){
  return { games:0, bestScore:0, bestStreak:0, totalCorrect:0, totalQuestions:0, lastPlayed:null, lastTime:null, bestTime:null, learnedWords:[] };
}
function loadStats(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY())) || {}; } catch { return {}; } }
function saveStats(s){ localStorage.setItem(STORAGE_KEY(), JSON.stringify(s)); }
function statKey(mode, level, cat){ return `${mode}__${level}__${cat}`; }
function getModeStats(mode, level, cat){
  const s = loadStats(); const key = statKey(mode, level, cat);
  return { ...getDefaultStats(), ...(s[key] || {}) };
}
function setModeStats(mode, level, cat, data){
  const s = loadStats(); s[statKey(mode, level, cat)] = { ...getDefaultStats(), ...data };
  saveStats(s);
}

function markLearned(mode, level, cat, word){
  if (!word) return;
  const stats = getModeStats(mode, level, cat);
  const learnedSet = new Set(stats.learnedWords || []);
  learnedSet.add((word.es || '').toLowerCase());
  stats.learnedWords = Array.from(learnedSet);
  setModeStats(mode, level, cat, stats);
  if (!document.getElementById('menu').classList.contains('hidden')){
    updateMenuStats(mode);
  }
}

/* --- Trwałe błędy --- */
function loadPersistentMistakes(){ try { return JSON.parse(localStorage.getItem(MISTAKES_KEY())) || {}; } catch { return {}; } }
function savePersistentMistakes(s){ localStorage.setItem(MISTAKES_KEY(), JSON.stringify(s)); }

function getPersistentMistakes(cat){
  const all = loadPersistentMistakes();
  if (cat === 'MIXED'){
    const combined = new Set();
    Object.values(all).forEach(arr => (arr || []).forEach(w => combined.add(w)));
    return combined;
  }
  return new Set(all[cat] || []);
}

function addPersistentMistake(word){
  if (!word || !word.es) return;
  const w_es = word.es.toLowerCase();
  const all = loadPersistentMistakes();
  let changed = false;
  Object.entries(CATEGORIES).forEach(([key, cat]) => {
    if (key === 'MIXED' || !cat.data) return;
    if (cat.data.some(item => item.es.toLowerCase() === w_es)){
      const s = new Set(all[key] || []);
      if (!s.has(w_es)){ s.add(w_es); all[key] = [...s]; changed = true; }
    }
  });
  if (changed) savePersistentMistakes(all);
}

function removePersistentMistake(word){
  if (!word || !word.es) return;
  const w_es = word.es.toLowerCase();
  const all = loadPersistentMistakes();
  let changed = false;
  Object.keys(all).forEach(key => {
    if (!all[key]) return;
    const s = new Set(all[key]);
    if (s.delete(w_es)){ all[key] = [...s]; changed = true; }
  });
  if (changed) savePersistentMistakes(all);
}


/* --- Odznaki --- */
// ZMIANA: Uogólnienie odznak (np. 'first_game' zamiast 'first_quiz')
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

// ZMIANA: Nowa, wydzielona funkcja do przyznawania odznak
function checkAndAwardBadges(level, cat, score, len, streak, time, games) {
  if (games === 1) awardBadge('first_game'); // Użyj nowego, generycznego ID

  if (score === len) { // Perfect score
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

/* --- Osiągnięcia (Gwiazdki/Naklejki) --- */
function ACHIEVEMENTS_KEY(){ return `hiszp_${profileId()}_achievements_v1`; }
function XP_KEY(){ return `hiszp_${profileId()}_xp_v1`; }
function STREAK_KEY(){ return `hiszp_${profileId()}_streak_v1`; }

function xpDefaults() { return { xp: 0, level: 1 }; }
function loadXP() {
  try {
    const raw = JSON.parse(localStorage.getItem(XP_KEY()));
    return { ...xpDefaults(), ...(raw || {}) };
  } catch { return xpDefaults(); }
}
function saveXP(state) { localStorage.setItem(XP_KEY(), JSON.stringify(state)); }

function getCurrentLevel(xp) {
  let found = XP_LEVELS[0];
  for (const lvl of XP_LEVELS) {
    if (xp >= lvl.minXp) found = lvl;
  }
  return found;
}

function renderXPBar() {
  const state = loadXP();
  const currentLvl = getCurrentLevel(state.xp);
  const nextLvl = XP_LEVELS.find(l => l.level === currentLvl.level + 1);
  
  const pill = document.getElementById('xpLevelPill');
  if (pill) pill.textContent = `${currentLvl.emoji} ${currentLvl.label}`;
  
  const fill = document.getElementById('xpBarFill');
  if (fill) {
    fill.classList.remove('pulse');
    void fill.offsetWidth; // trigger reflow
    fill.classList.add('pulse');
    
    if (!nextLvl) {
      fill.style.width = '100%';
    } else {
      const range = nextLvl.minXp - currentLvl.minXp;
      const progress = state.xp - currentLvl.minXp;
      const pct = Math.max(0, Math.min(100, (progress / range) * 100));
      fill.style.width = pct + '%';
    }
  }
}

function addXP(amount, reason) {
  const state = loadXP();
  const oldLvl = getCurrentLevel(state.xp);
  state.xp += amount;
  const newLvl = getCurrentLevel(state.xp);
  
  saveXP(state);
  renderXPBar();
  
  if (reason && typeof toast === 'function') {
    toast(`+${amount} XP (${reason})`);
  }
  
  if (newLvl.level > oldLvl.level) {
    if (typeof launchConfetti === 'function') launchConfetti();
    if (typeof toast === 'function') {
      toast(`🎊 Awans na poziom: ${newLvl.label}!`);
    }
  }
}

const STAR_INTERVAL = 5; // co tyle poprawnych odpowiedzi przyznajemy gwiazdkę
const STICKER_STAR_REQUIREMENT = 10; // liczba gwiazdek na naklejkę

const STICKER_CATALOG = [
  {id:'sunrise', icon:'🌅', name:'Świt nauki', desc:'Zgromadź 10 gwiazdek.'},
  {id:'rocket',  icon:'🚀', name:'Rakietowy start', desc:'Zgromadź 20 gwiazdek.'},
  {id:'compass', icon:'🧭', name:'Kierunek hiszpański', desc:'Zgromadź 30 gwiazdek.'},
  {id:'palette', icon:'🎨', name:'Kolorowe słowa', desc:'Zgromadź 40 gwiazdek.'},
  {id:'trophy',  icon:'🏆', name:'Mistrz nauki', desc:'Zgromadź 50 gwiazdek.'},
  {id:'crown',   icon:'👑', name:'Korona językowa', desc:'Zgromadź 60 gwiazdek.'}
];

const LIVE_STAR_TARGETS = ['quizStarProgress', 'findStarProgress'];

function normalizeStarProgress(value){
  const numeric = Number(value);
  return Math.max(0, Math.min(STAR_INTERVAL, Number.isFinite(numeric) ? numeric : 0));
}

function updateLiveStarProgress(state){
  const progressValue = normalizeStarProgress(state?.starProgress);
  const label = `${progressValue}/${STAR_INTERVAL}`;
  LIVE_STAR_TARGETS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = label;
  });
}

function achievementDefaults(){
  return { stars:0, starProgress:0, stickers:[], totalCorrect:0, recentReward:null };
}
function loadAchievements(){
  try {
    const raw = JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY()));
    return { ...achievementDefaults(), ...(raw || {}) };
  } catch {
    return achievementDefaults();
  }
}
function saveAchievements(state){
  localStorage.setItem(ACHIEVEMENTS_KEY(), JSON.stringify(state));
}
function stickerThresholdForIndex(index){
  return (index + 1) * STICKER_STAR_REQUIREMENT;
}
function pluralizeStars(count){
  const abs = Math.abs(count);
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (abs === 1) return 'gwiazdka';
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 'gwiazdki';
  return 'gwiazdek';
}
function streakDefaults() { return { lastDate: null, count: 0 }; }
function loadStreak() {
  try {
    const raw = JSON.parse(localStorage.getItem(STREAK_KEY()));
    return { ...streakDefaults(), ...(raw || {}) };
  } catch { return streakDefaults(); }
}
function saveStreak(state) { localStorage.setItem(STREAK_KEY(), JSON.stringify(state)); }

function updateStreak() {
  const state = loadStreak();
  const today = new Date().toISOString().split('T')[0];
  
  if (state.lastDate === today) return; // już naliczone dzisiaj
  
  const lastDate = state.lastDate ? new Date(state.lastDate) : null;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (state.lastDate === yesterdayStr) {
    state.count += 1;
  } else {
    state.count = 1;
  }
  
  state.lastDate = today;
  saveStreak(state);
  renderStreak();
  
  if (typeof toast === 'function') {
    toast(`🔥 Dzienna seria: ${state.count} dni!`);
  }
}

function renderStreak() {
  const state = loadStreak();
  const el = document.getElementById('streakPill');
  if (el) el.textContent = `🔥 Seria: ${state.count} dni`;
}

function renderAchievements(){
  const state = loadAchievements();
  const stars = state.stars || 0;
  const progress = normalizeStarProgress(state.starProgress);
  const stickers = Array.isArray(state.stickers) ? state.stickers : [];

  updateLiveStarProgress(state);

  const progressEl = document.getElementById('statStarProgress');
  if (progressEl) progressEl.textContent = `${progress}/${STAR_INTERVAL}`;

  const starsEl = document.getElementById('statStars');
  if (starsEl) starsEl.textContent = stars;

  const stickersEl = document.getElementById('statStickers');
  if (stickersEl) stickersEl.textContent = stickers.length;

  const progressBar = document.getElementById('starProgressBar');
  const progressFill = document.getElementById('starProgressFill');
  if (progressBar && progressFill){
    const ratio = Math.max(0, Math.min(1, progress / STAR_INTERVAL));
    progressFill.style.width = `${Math.round(ratio * 100)}%`;
    progressBar.setAttribute('aria-valuenow', String(progress));
    progressBar.setAttribute('aria-valuemax', String(STAR_INTERVAL));
  }

  const nextStickerEl = document.getElementById('statNextSticker');
  const nextStickerInfo = document.getElementById('nextStickerInfo');
  if (nextStickerEl){
    if (stickers.length >= STICKER_CATALOG.length){
      nextStickerEl.textContent = '—';
      if (nextStickerInfo) nextStickerInfo.textContent = 'Wszystkie naklejki odblokowane! Graj dalej dla satysfakcji.';
    } else {
      const nextSticker = STICKER_CATALOG[stickers.length];
      const threshold = stickerThresholdForIndex(stickers.length);
      const remaining = Math.max(0, threshold - stars);
      nextStickerEl.textContent = remaining;
      if (nextStickerInfo){
        if (remaining <= 0){
          nextStickerInfo.textContent = `Naklejka ${nextSticker.icon} ${nextSticker.name} już gotowa – kontynuuj, aby ją zobaczyć!`;
        } else {
          const word = pluralizeStars(remaining);
          nextStickerInfo.textContent = `Naklejka ${nextSticker.icon} ${nextSticker.name} już niedaleko – potrzeba ${remaining} ${word}.`;
        }
      }
    }
  }

  const shelf = document.getElementById('stickerShelf');
  if (shelf){
    shelf.innerHTML='';
    const recent = state.recentReward;
    STICKER_CATALOG.forEach((sticker, index)=>{
      const ownedOne = stickers.find(s=>s.id===sticker.id);
      const el = document.createElement('div');
      const isRecent = recent && recent.type === 'sticker' && recent.id === sticker.id;
      el.className = `badge${isRecent ? ' recent' : ''}`;
      el.style.opacity = ownedOne ? '1' : '.5';
      const threshold = stickerThresholdForIndex(index);
      const title = ownedOne
        ? `${sticker.desc}\nZdobyto: ${new Date(ownedOne.earnedAt).toLocaleString()}`
        : `${sticker.desc}\nZdobądź ${threshold} ${pluralizeStars(threshold)}.`;
      el.title = title;
      el.innerHTML = `<span style="font-size:18px">${sticker.icon}</span><b>${sticker.name}</b>`;
      shelf.appendChild(el);
    });
  }

  const rewardWrap = document.getElementById('recentRewardDetails');
  const rewardTime = document.getElementById('recentRewardTime');
  if (rewardWrap){
    rewardWrap.innerHTML = '';
    const reward = state.recentReward;
    if (!reward){
      const info = document.createElement('p');
      info.className = 'sub small placeholder';
      info.style.margin = '0';
      info.textContent = 'Brak nagród – rozegraj rundę, aby zdobywać gwiazdki.';
      rewardWrap.appendChild(info);
      if (rewardTime) rewardTime.textContent = '—';
    } else if (reward.type === 'sticker'){
      const badge = document.createElement('div');
      badge.className = 'badge recent';
      badge.innerHTML = `<span style="font-size:18px">${reward.icon}</span><b>${reward.name}</b>`;
      rewardWrap.appendChild(badge);
      const info = document.createElement('p');
      info.className = 'sub small';
      info.style.margin = '0';
      info.textContent = `Zdobyto dzięki ${STICKER_STAR_REQUIREMENT} ${pluralizeStars(STICKER_STAR_REQUIREMENT)}.`;
      rewardWrap.appendChild(info);
      if (rewardTime) rewardTime.textContent = reward.earnedAt ? new Date(reward.earnedAt).toLocaleString() : 'przed chwilą';
    } else if (reward.type === 'star'){
      const info = document.createElement('div');
      info.className = 'badge';
      info.innerHTML = `<span style="font-size:18px">⭐</span><b>+${reward.amount} ${pluralizeStars(reward.amount)}</b>`;
      rewardWrap.appendChild(info);
      const sub = document.createElement('p');
      sub.className = 'sub small';
      sub.style.margin = '0';
      sub.textContent = `Łącznie na koncie: ${reward.total} ${pluralizeStars(reward.total)}.`;
      rewardWrap.appendChild(sub);
      if (rewardTime) rewardTime.textContent = reward.earnedAt ? new Date(reward.earnedAt).toLocaleString() : 'przed chwilą';
    } else {
      const info = document.createElement('p');
      info.className = 'sub small placeholder';
      info.style.margin = '0';
      info.textContent = 'Nowe nagrody będą widoczne tutaj.';
      rewardWrap.appendChild(info);
      if (rewardTime) rewardTime.textContent = '—';
    }
  }
}

function registerCorrectAnswer(correctWord){
  updateStreak();
  const state = loadAchievements();
  const prevProgress = normalizeStarProgress(state.starProgress);
  state.totalCorrect = (state.totalCorrect || 0) + 1;
  state.starProgress = (state.starProgress || 0) + 1;
  let starsEarned = 0;
  while (state.starProgress >= STAR_INTERVAL){
    state.starProgress -= STAR_INTERVAL;
    state.stars = (state.stars || 0) + 1;
    starsEarned++;
  }
  const stickersBefore = (state.stickers || []).length;
  const unlockedThisRound = [];
  while (state.stars >= stickerThresholdForIndex((state.stickers || []).length) && (state.stickers || []).length < STICKER_CATALOG.length){
    const newSticker = STICKER_CATALOG[(state.stickers || []).length];
    const earnedAt = new Date().toISOString();
    state.stickers.push({id:newSticker.id, earnedAt});
    unlockedThisRound.push({id:newSticker.id, name:newSticker.name, icon:newSticker.icon, earnedAt});
    toast(`🏅 Nowa naklejka: ${newSticker.icon} ${newSticker.name}`);
  }
  if (unlockedThisRound.length){
    const latest = unlockedThisRound[unlockedThisRound.length - 1];
    state.recentReward = { type:'sticker', id:latest.id, name:latest.name, icon:latest.icon, earnedAt:latest.earnedAt };
  } else if (starsEarned > 0){
    state.recentReward = { type:'star', amount:starsEarned, total: state.stars, earnedAt: new Date().toISOString() };
  }
  saveAchievements(state);
  renderAchievements();

  // Usuń z trwałych błędów po poprawnej odpowiedzi
  removePersistentMistake(correctWord);

  if (starsEarned > 0){
    const plural = pluralizeStars(starsEarned);
    toast(`⭐ Zdobyto ${starsEarned} ${plural}!`);
  }
  if (starsEarned === 0 && ((state.stickers || []).length === stickersBefore)){
    const newProgress = normalizeStarProgress(state.starProgress);
    if (newProgress !== prevProgress){
      const remaining = Math.max(0, STAR_INTERVAL - newProgress);
      const remainText = remaining > 0 ? ` (pozostało ${remaining} ${pluralizeStars(remaining)}).` : '.';
      const menu = document.getElementById('menu');
      const menuVisible = menu ? !menu.classList.contains('hidden') : false;
      if (!menuVisible){
        toast(`⭐ Postęp do gwiazdki: ${newProgress}/${STAR_INTERVAL}${remainText}`);
      }
    }
  }
}

/* ---------- TTS ---------- */
let voices = []; let esVoice = null;
function chooseEsVoice(){
  voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  esVoice = voices.find(v => /es-ES|Spanish.*Spain/i.test(v.lang||"")) || voices.find(v => /es/i.test(v.lang||""));
  const status = document.getElementById('ttsStatus');
  if (status){
    status.textContent = esVoice ? `TTS: ${esVoice.name} (${esVoice.lang})` : 'TTS: użyję głosu domyślnego';
  }
}
if ('speechSynthesis' in window){ chooseEsVoice(); window.speechSynthesis.onvoiceschanged = chooseEsVoice; } else {
  const status = document.getElementById('ttsStatus');
  if (status) status.textContent='Brak wsparcia TTS';
}
function speakEs(text){
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text); u.lang = (esVoice && esVoice.lang) || 'es-ES'; u.voice = esVoice || null; u.rate = 0.95; u.pitch=1.0;
  window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
}

/* ---------- AudioFX (syntetyczny feedback dźwiękowy) ---------- */
const AudioFX = (() => {
  let _ctx = null;
  function getCtx() {
    if (!_ctx && window.AudioContext) _ctx = new AudioContext();
    return _ctx;
  }
  function tone(freq, dur, type, gain) {
    const ac = getCtx(); if (!ac) return;
    try {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.connect(g); g.connect(ac.destination);
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(gain || 0.28, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
      osc.start(); osc.stop(ac.currentTime + dur);
    } catch(e) {}
  }
  return {
    correct() { tone(880, 0.13); setTimeout(() => tone(1320, 0.11), 70); },
    wrong()   { tone(200, 0.22, 'sawtooth', 0.18); }
  };
})();

/* ---------- renderCombo (F4) ---------- */
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

/* ---------- miniConfetti (F5) ---------- */
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

/* ---------- showStarRating (F7) ---------- */
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

/* ---------- UI: powiadomienia ---------- */
function toast(msg){
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.position='fixed'; t.style.bottom='16px'; t.style.left='50%'; t.style.transform='translateX(-50%)';
  t.style.background='rgba(0,0,0,.85)'; t.style.padding='10px 14px'; t.style.border='1px solid rgba(255,255,255,.25)';
  t.style.borderRadius='12px'; t.style.zIndex='9999'; t.style.color='#fff';
  document.body.appendChild(t); setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .4s'; }, 1400);
  setTimeout(()=> t.remove(), 1850);
}

/* ---------- Nawigacja ---------- */
function show(sectionId){
  ALL_SECTIONS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', id !== sectionId);
  });
  if (sectionId==='menu'){
    showMenuStep(1);
    renderBadges();
    renderAchievements();
    renderXPBar();
    renderStreak();
    updateMenuStats('QUIZ_PL_ES');
  }
}

function showMenuStep(n){
  menuStep = n;
  [1,2,3].forEach(i => {
    const el = document.getElementById('menuStep'+i);
    if (el) el.classList.toggle('hidden', i !== n);
  });

  const cat = CATEGORIES[currentCat] || {};
  const wizCatChosen = document.getElementById('wizCatChosen');
  const wizLvlChosen = document.getElementById('wizLvlChosen');
  const wizStep1Btn  = document.getElementById('wizStep1Btn');
  const wizStep2Btn  = document.getElementById('wizStep2Btn');
  const wizStep3Btn  = document.getElementById('wizStep3Btn');

  if (wizCatChosen) wizCatChosen.textContent = n >= 2 ? (cat.emoji || '') + ' ' + (cat.label || '') : '';
  if (wizLvlChosen) wizLvlChosen.textContent = n >= 3 ? LEVEL_NAMES[currentLevel] || '' : '';

  if (wizStep1Btn){ wizStep1Btn.classList.toggle('active', n===1); wizStep1Btn.disabled = false; }
  if (wizStep2Btn){ wizStep2Btn.classList.toggle('active', n===2); wizStep2Btn.disabled = n < 2; }
  if (wizStep3Btn){ wizStep3Btn.classList.toggle('active', n===3); wizStep3Btn.disabled = n < 3; }

  if (n === 1){
    renderCatGrid();
  }
  if (n === 2){
    const step2CatEmoji = document.getElementById('step2CatEmoji');
    const step2CatLabel = document.getElementById('step2CatLabel');
    if (step2CatEmoji) step2CatEmoji.textContent = cat.emoji || '';
    if (step2CatLabel) step2CatLabel.textContent = cat.label || catLabel(currentCat);
    $$('.level-card').forEach(c => c.classList.toggle('active', c.dataset.level === currentLevel));
  }
  if (n === 3){
    const step3CatEmoji = document.getElementById('step3CatEmoji');
    const step3CatLabel = document.getElementById('step3CatLabel');
    const step3LevelLabel = document.getElementById('step3LevelLabel');
    if (step3CatEmoji) step3CatEmoji.textContent = cat.emoji || '';
    if (step3CatLabel) step3CatLabel.textContent = cat.label || catLabel(currentCat);
    if (step3LevelLabel) step3LevelLabel.textContent = LEVEL_NAMES[currentLevel] || '';
    updateMenuStats('QUIZ_PL_ES');
  }
}

document.getElementById('toMenuBtn').addEventListener('click', ()=> { show('menu'); });

document.getElementById('wizardBreadcrumb').addEventListener('click', e => {
  const btn = e.target.closest('.wiz-step');
  if (!btn || btn.disabled) return;
  const step = parseInt(btn.dataset.step, 10);
  if (step < menuStep) showMenuStep(step);
});

$$('.level-card').forEach(card => {
  card.addEventListener('click', () => {
    currentLevel = card.dataset.level;
    showMenuStep(3);
  });
});

$$('[data-go]').forEach(b => b.addEventListener('click', () => {
  const target = b.getAttribute('data-go'); show(target);
  if (target==='quiz'){ startQuiz(); updateMenuStats('QUIZ_PL_ES'); }
  if (target==='finditem'){ startFindItem(); updateMenuStats('FIND_ITEM'); }
  if (target==='flashcards'){ renderFlashcard(); }
  if (target==='scramble'){ startScramble(); updateMenuStats('SCRAMBLE'); }
  if (target==='repeat'){ startRepeat(); updateMenuStats('REPEAT'); }
}));

// Nowe tryby z menu
document.getElementById('startReviewBtn').addEventListener('click', () => {
  const mistakesSet = getPersistentMistakes(currentCat);
  const pool = datasetFor(currentCat).filter(w => mistakesSet.has(w.es.toLowerCase()));
  startSpecialQuiz(pool, 'Powtórka błędów');
});
document.getElementById('startUnlearnedBtn').addEventListener('click', () => {
  // Bazujmy na statystykach z Quizu (PL -> ES) jako domyślnych
  const mode = 'QUIZ_PL_ES';
  const learnedSet = new Set(getModeStats(mode, currentLevel, currentCat).learnedWords || []);
  const pool = datasetFor(currentCat).filter(w => !learnedSet.has(w.es.toLowerCase()));
  startSpecialQuiz(pool, 'Nowe słowa');
});


/* ---------- Fiszki ---------- */
let fcIndex = 0;
function renderFlashcard(){
  const list = dataset(); if (!list.length) return;
  const idx = ((fcIndex%list.length)+list.length)%list.length;
  const item = list[idx];
  document.getElementById('fcVisual').innerHTML = renderItemVisual(item, '8rem');
  document.getElementById('fcEs').textContent = item.es;
  document.getElementById('fcPl').textContent = item.pl;
}
const flashcardSpeak = () => speakEs(dataset()[((fcIndex%dataset().length)+dataset().length)%dataset().length].es);
document.getElementById('fcNext').addEventListener('click', ()=> { fcIndex=(fcIndex+1); renderFlashcard(); flashcardSpeak(); });
document.getElementById('fcPrev').addEventListener('click', ()=> { fcIndex=(fcIndex-1); renderFlashcard(); flashcardSpeak(); });
document.getElementById('fcSpeak').addEventListener('click', flashcardSpeak);
document.getElementById('resetBtn').addEventListener('click', ()=> { fcIndex=0; renderFlashcard(); });
renderFlashcard();

/* ---------- Odsłuch całej listy ---------- */
let speakingAll=false;
document.getElementById('speakAllBtn').addEventListener('click', async ()=>{
  if (!('speechSynthesis' in window)) return;
  speakingAll = !speakingAll; const btn=document.getElementById('speakAllBtn');
  if (speakingAll){
    btn.textContent='⏹️ Stop';
    for (const it of dataset()){ if (!speakingAll) break; speakEs(it.es); await new Promise(r=>setTimeout(r,1200)); }
    speakingAll=false; btn.textContent='🔊 Lista';
  } else { window.speechSynthesis.cancel(); btn.textContent='🔊 Lista'; }
});

/* ---------- Quiz PL -> ES ---------- */
let qRound=0, qScore=0, qStreak=0, qBestStreak=0, qAnswer=null, qLen=LEVELS[currentLevel].len, qOpts=LEVELS[currentLevel].options, qStartTime=0;
let qPool = [];
let qMistakes = [];
let qMistakeSet = new Set();
let qIsReviewMode = false;
let qAnswered = false;
let qAnsweredCorrect = false;
let qAutoTimer = null;
function applyLevelToQuiz(){ qLen=LEVELS[currentLevel].len; qOpts=LEVELS[currentLevel].options; document.getElementById('qTotal').textContent=qLen; }
function makeQuestionPool(){ const list = dataset(); qPool = shuffle([...list]).slice(0, Math.min(list.length, qLen)); }
function resetMistakeSummaryUI(){
  const info = document.getElementById('qMistakeInfo');
  const list = document.getElementById('qMistakeList');
  const count = document.getElementById('qMistakeCount');
  const reviewBtn = document.getElementById('qSumReview');
  const success = document.getElementById('qMistakeSuccess');
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
function registerMistake(word){
  if (!word) return;
  const key = (word.es || '').toLowerCase();
  if (qMistakeSet.has(key)) return;
  qMistakeSet.add(key);
  qMistakes.push(word);
  // Dodaj do trwałej listy błędów
  addPersistentMistake(word);
}
function updateMistakeSummary(){
  const info = document.getElementById('qMistakeInfo');
  const list = document.getElementById('qMistakeList');
  const count = document.getElementById('qMistakeCount');
  const reviewBtn = document.getElementById('qSumReview');
  const success = document.getElementById('qMistakeSuccess');
  if (!info || !list || !count || !reviewBtn || !success) return;
  list.innerHTML = '';
  count.textContent = qMistakes.length.toString();
  if (qMistakes.length){
    info.classList.remove('hidden');
    success.classList.add('hidden');
    qMistakes.forEach(word => {
      const li = document.createElement('li');
      li.innerHTML = `<b>${word.es}</b> – ${word.pl}`;
      list.appendChild(li);
    });
    reviewBtn.classList.remove('hidden');
    reviewBtn.disabled = false;
    reviewBtn.textContent = `🔁 Powtórz błędne (${qMistakes.length})`;
  } else {
    info.classList.add('hidden');
    success.textContent = qIsReviewMode ? 'Powtórka ukończona – brak błędów!' : 'Brak błędnych odpowiedzi – świetna robota!';
    success.classList.remove('hidden');
    reviewBtn.disabled = true;
    reviewBtn.classList.add('hidden');
  }
}
function startQuiz(){
  clearTimeout(qAutoTimer);
  qIsReviewMode = false;
  applyLevelToQuiz();
  makeQuestionPool();
  qRound=0; qScore=0; qStreak=0; qBestStreak = getModeStats('QUIZ_PL_ES', currentLevel, currentCat).bestStreak || 0;
  qMistakes = [];
  qMistakeSet = new Set();
  qAnswered = false;
  qAnsweredCorrect = false;
  document.getElementById('qScore').textContent='0'; renderCombo('qStreak', 0); document.getElementById('qBestStreak').textContent=qBestStreak;
  document.getElementById('scoreFill').style.width='0%'; document.getElementById('qNext').disabled=false; document.getElementById('qSkip').disabled=false;
  document.getElementById('qRetry').disabled=true;
  document.getElementById('qSummary').classList.add('hidden');
  const qStarEl = document.getElementById('qStarRating'); if (qStarEl) qStarEl.innerHTML = '';
  resetMistakeSummaryUI();
  const sumTitle = document.getElementById('qSummaryTitle'); if (sumTitle) sumTitle.textContent = 'Podsumowanie';
  qStartTime = performance.now();
  newQuestion();
}
function newQuestion(){
  qRound++; if (qRound>qLen){ endQuiz(); return; }
  [{pct:25,msg:'Dobry start! 🚀'},{pct:50,msg:'Połowa za Tobą! ⭐'},{pct:75,msg:'Prawie koniec! 💪'}]
    .forEach(m=>{ if (qRound === Math.ceil(qLen * m.pct / 100)) toast(m.msg); });
  qAnswered = false;
  qAnsweredCorrect = false;
  const list = dataset();
  const correct = qPool[qRound-1] || pick(list,1)[0]; qAnswer = correct;
  document.getElementById('qVisual').innerHTML = renderItemVisual(correct, '10rem');
  document.getElementById('qHint').textContent = 'po polsku: ' + correct.pl;
  document.getElementById('qNum').textContent = qRound; document.getElementById('qTotal').textContent = qLen;
  const wrap = document.getElementById('choices'); wrap.innerHTML='';
  const options = shuffle([correct, ...pick(list.filter(x=>x!==correct), qOpts-1)]);
  options.forEach(opt=>{
    const btn=document.createElement('button'); btn.className='choice';
    // Dodanie przycisku głośnika
    btn.innerHTML = `<b>${opt.es}</b><button class="choice-speak" title="Odsłuchaj: ${opt.es}">🔊</button>`;

    btn.addEventListener('click', ()=>{
      if (qAnswered) return;
      const isOk = opt===correct;
      qAnswered = true;
      qAnsweredCorrect = isOk;
      if (isOk){
        btn.classList.add('correct', 'anim-bounce'); qScore++; qStreak++; qBestStreak = Math.max(qBestStreak, qStreak);
        markLearned('QUIZ_PL_ES', currentLevel, currentCat, correct);
        registerCorrectAnswer(correct);
        AudioFX.correct();
        miniConfetti(btn);
        qAutoTimer = setTimeout(() => { if (qAnswered && qAnsweredCorrect) newQuestion(); }, 1000);
      }
      else {
        btn.classList.add('wrong', 'anim-shake'); qStreak = 0;
        registerMistake(correct);
        [...wrap.children].forEach(c=>{ if (c.textContent.toLowerCase().includes(correct.es.split(' ')[0])) c.classList.add('correct'); });
        AudioFX.wrong();
      }
      document.getElementById('qScore').textContent=qScore; renderCombo('qStreak', qStreak); document.getElementById('qBestStreak').textContent=qBestStreak;
      document.getElementById('scoreFill').style.width=(qScore/qLen*100)+'%';
      [...wrap.children].forEach(c=>c.disabled=true);
    });

    // Listener dla przycisku głośnika
    const speakBtn = btn.querySelector('.choice-speak');
    speakBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Zapobiegaj wybraniu odpowiedzi po kliknięciu głośnika
      speakEs(opt.es);
    });

    wrap.appendChild(btn);
  });
}
document.getElementById('qNext').addEventListener('click', ()=>{
  clearTimeout(qAutoTimer);
  if (!qAnswered && qAnswer){ registerMistake(qAnswer); }
  newQuestion();
});
document.getElementById('qSkip').addEventListener('click', ()=>{
  clearTimeout(qAutoTimer);
  if (qAnswer && (!qAnswered || !qAnsweredCorrect)){ registerMistake(qAnswer); }
  newQuestion();
});
document.getElementById('qSpeak').addEventListener('click', ()=> { if (qAnswer) speakEs(qAnswer.es); });
document.getElementById('qRetry').addEventListener('click', ()=> { startQuiz(); });
document.getElementById('qSumReview').addEventListener('click', ()=> { startMistakeReview(); });

function endQuiz(){
  const elapsedSec = (performance.now() - qStartTime) / 1000;
  const st = getModeStats('QUIZ_PL_ES', currentLevel, currentCat);
  if (!qIsReviewMode){
    st.games += 1; st.bestScore = Math.max(st.bestScore||0, qScore);
    st.bestStreak = Math.max(st.bestStreak||0, qBestStreak);
    st.totalCorrect += qScore; st.totalQuestions += qLen; st.lastPlayed = new Date().toISOString();
    st.lastTime = elapsedSec;
    if (!st.bestTime || elapsedSec < st.bestTime) st.bestTime = elapsedSec;
    setModeStats('QUIZ_PL_ES', currentLevel, currentCat, st);

    addXP(qScore * 5, 'Quiz');
    if (qScore === qLen) addXP(20, 'Bonus Perfekt');

    // ZMIANA: Wywołanie nowej, generycznej funkcji do odznak
    checkAndAwardBadges(currentLevel, currentCat, qScore, qLen, qBestStreak, elapsedSec, st.games);
  }

  document.getElementById('choices').innerHTML='';
  document.getElementById('qNum').textContent=qLen;
  document.getElementById('qNext').disabled=true;
  document.getElementById('qSkip').disabled=true;
  document.getElementById('qRetry').disabled=false;

  document.getElementById('qSumScore').textContent = qScore;
  document.getElementById('qSumTotal').textContent = qLen;
  const qPct = Math.round((qScore/qLen)*100);
  document.getElementById('qSumPct').textContent = qPct;
  document.getElementById('qSumBestStreak').textContent = qBestStreak;
  document.getElementById('qSumTime').textContent = elapsedSec.toFixed(1)+' s';
  const bestTime = st.bestTime ? st.bestTime.toFixed(1)+' s' : '—';
  document.getElementById('qSumBestTime').textContent = bestTime;

  showStarRating(qPct, 'qStarRating');
  // Tytuł podsumowania jest ustawiany przy starcie quizu
  updateMistakeSummary();
  document.getElementById('qSummary').classList.remove('hidden');

  document.getElementById('qSumRetry').onclick = ()=> startQuiz();
  document.getElementById('qSumMenu').onclick  = ()=> { show('menu'); };
  updateGlobalStats();
}

function startMistakeReview(){
  if (!qMistakes.length) return;
  const reviewPool = [...qMistakes];
  startSpecialQuiz(reviewPool, 'Podsumowanie powtórki');
}

/** Rozpoczyna specjalny quiz (np. powtórka, nienauczone) */
function startSpecialQuiz(wordPool, title) {
  if (!wordPool || !wordPool.length) {
    toast('Brak słów do ćwiczenia w tym trybie.');
    return;
  }

  qIsReviewMode = true; // Traktuj jako tryb powtórki (bez zapisywania statystyk)
  qPool = shuffle([...wordPool]);
  qLen = qPool.length;
  qOpts = LEVELS[currentLevel].options;
  qRound = 0;
  qScore = 0;
  qStreak = 0;
  qBestStreak = 0;
  qAnswered = false;
  qAnsweredCorrect = false;
  qMistakes = [];
  qMistakeSet = new Set();

  document.getElementById('qScore').textContent='0';
  renderCombo('qStreak', 0);
  document.getElementById('qBestStreak').textContent='0';
  document.getElementById('scoreFill').style.width='0%';
  document.getElementById('qNext').disabled=false;
  document.getElementById('qSkip').disabled=false;
  document.getElementById('qRetry').disabled=true;
  document.getElementById('qSummary').classList.add('hidden');
  const qStarElS = document.getElementById('qStarRating'); if (qStarElS) qStarElS.innerHTML = '';

  const sumTitle = document.getElementById('qSummaryTitle');
  if (sumTitle) sumTitle.textContent = title;

  resetMistakeSummaryUI();
  document.getElementById('qTotal').textContent = qLen;
  qStartTime = performance.now();

  if (typeof toast === 'function'){ toast(`Rozpoczynamy: ${title}!`); }
  show('quiz');
  newQuestion();
}


/* ---------- Find Item (ES -> IMG) ---------- */
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
  // Dodaj do trwałej listy błędów
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

    // ZMIANA: Wywołanie nowej, generycznej funkcji do odznak
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
  // Tytuł podsumowania jest ustawiany przy starcie
  updateFindMistakeSummary();
  document.getElementById('fSummary').classList.remove('hidden');

  document.getElementById('fSumRetry').onclick = ()=> startFindItem();
  document.getElementById('fSumMenu').onclick  = ()=> { show('menu'); };
  updateGlobalStats();
}

/* ---------- Statystyki w menu ---------- */
function levelLabel(level){
  return LEVEL_NAMES[level] || level;
}
function formatTime(value){
  return (typeof value === 'number' && isFinite(value)) ? value.toFixed(1)+' s' : '—';
}
function renderBestTimes(mode){
  const list = document.getElementById('bestTimesList');
  if (!list) return;
  list.innerHTML = '';
  const totalWords = datasetFor(currentCat).length;
  Object.keys(LEVELS).forEach(level=>{
    const li = document.createElement('li');
    const stats = getModeStats(mode, level, currentCat);
    const time = formatTime(stats.bestTime);
    const learnedCount = (stats.learnedWords || []).length;
    li.innerHTML = `<span>${levelLabel(level)}</span><span>czas: ${time}</span><span>słowa: ${learnedCount}/${totalWords}</span>`;
    list.appendChild(li);
  });
}
function updateGlobalStats(){
  const gamesEl = document.getElementById('globalGames');
  if (!gamesEl) return;
  const statsMap = loadStats();
  const allStats = Object.values(statsMap).map(s=>({ ...getDefaultStats(), ...s }));
  let games = 0, totalCorrect = 0, totalQuestions = 0;
  const learned = new Set();
  let lastPlayed = null;
  allStats.forEach(st=>{
    games += st.games || 0;
    totalCorrect += st.totalCorrect || 0;
    totalQuestions += st.totalQuestions || 0;
    (st.learnedWords || []).forEach(w=>learned.add(w));
    if (st.lastPlayed){
      const d = new Date(st.lastPlayed);
      if (!lastPlayed || d > lastPlayed) lastPlayed = d;
    }
  });
  const accuracy = totalQuestions ? Math.round((totalCorrect/totalQuestions)*100) : 0;
  gamesEl.textContent = games;
  document.getElementById('globalAccuracy').textContent = accuracy + '%';
  document.getElementById('globalLearned').textContent = learned.size;
  document.getElementById('globalTotalWords').textContent = datasetFor('MIXED').length;
  document.getElementById('globalLastPlayed').textContent = lastPlayed ? lastPlayed.toLocaleString() : '—';
}
function runFunctionalTests(){
  const tests = [
    {name:'Zestaw owoców niepusty', pass: FRUITS.length > 0},
    {name:'Zestaw warzyw niepusty', pass: VEGGIES.length > 0},
    {name:'Poziomy skonfigurowane', pass: Object.keys(LEVELS).length === 3},
    {name:'Łączny zestaw niepusty', pass: datasetFor('MIXED').length > 0},
    {name:'Sekcja menu obecna', pass: !!document.getElementById('menu')},
    {name:'Sekcja fiszek obecna', pass: !!document.getElementById('flashcards')},
    {name:'Sekcja quizu obecna', pass: !!document.getElementById('quiz')},
    {name:'Sekcja znajdź element obecna', pass: !!document.getElementById('finditem')},
    {name:'Sekcja memory obecna', pass: !!document.getElementById('memory')},
    {name:'Sekcja articulos obecna', pass: !!document.getElementById('articulos')},
    {name:'Sekcja wordsearch obecna', pass: !!document.getElementById('wordsearch')},
    {name:'Sekcja spelling obecna', pass: !!document.getElementById('spelling')},
    {name:'Siatka kategorii obecna', pass: !!document.getElementById('catGrid')},
    {name:'Kontener naklejek obecny', pass: !!document.getElementById('stickerShelf')},
    {name:"Kontener powtórek (błędy) obecny", pass: !!document.getElementById('reviewModeCard')},
    {name:"Przycisk powtórek (błędy) obecny", pass: !!document.getElementById('startReviewBtn')},
    {name:"Kontener nienauczonych obecny", pass: !!document.getElementById('unlearnedModeCard')},
    {name:"Przycisk nienauczonych obecny", pass: !!document.getElementById('startUnlearnedBtn')},
    {name:'Licznik postępu gwiazdek obecny', pass: !!document.getElementById('statStarProgress')},
    {name:'Licznik gwiazd w quizie obecny', pass: !!document.getElementById('quizStarProgress')},
    {name:'Licznik gwiazd w trybie znajdź obecny', pass: !!document.getElementById('findStarProgress')},
    {name:'Pasek postępu gwiazdek obecny', pass: !!document.getElementById('starProgressFill')},
    {name:'Panel ostatniej nagrody obecny', pass: !!document.getElementById('recentRewardCard')},
    {name:'Informacja o kolejnej naklejce obecna', pass: !!document.getElementById('statNextSticker')}
  ];
  const hasConsole = typeof console !== 'undefined';
  if (hasConsole && console.groupCollapsed){
    console.groupCollapsed('Testy funkcjonalne (automatyczne)');
    tests.forEach(t=> console.log(`${t.pass ? '✅' : '❌'} ${t.name}`));
    console.groupEnd();
  } else if (hasConsole) {
    tests.forEach(t=> console.log((t.pass ? '✅' : '❌') + ' ' + t.name));
  }
  if (tests.some(t=> !t.pass)){
    toast('⚠️ Testy funkcjonalne wykryły problem – sprawdź konsolę.');
  }
}
function updateMenuStats(mode){
  // Statystyki trybu (górna karta)
  const st = getModeStats(mode, currentLevel, currentCat);
  document.getElementById('statMode').textContent = mode==='QUIZ_PL_ES' ? 'Quiz PL→ES' : (mode==='FIND_ITEM' ? 'Wybierz (ES→obraz)' : (mode==='SCRAMBLE' ? 'Ułóż słowo' : (mode==='REPEAT' ? 'Powtórz słowo' : '—')));
  document.getElementById('statLvl').textContent = levelLabel(currentLevel);
  document.getElementById('statCat').textContent = catLabel(currentCat);
  document.getElementById('statBest').textContent = st.bestScore || 0;
  document.getElementById('statBestTime').textContent = formatTime(st.bestTime);
  document.getElementById('statBestStreak').textContent = st.bestStreak || 0;
  document.getElementById('statLearned').textContent = (st.learnedWords || []).length;
  document.getElementById('statTotalWords').textContent = dataset().length;
  renderBestTimes(mode);

  // Statystyki globalne
  updateGlobalStats();

  // Zaktualizuj nowe tryby (powtórki i nienauczone)
  // Użyj statystyk z 'QUIZ_PL_ES' jako referencji dla nienauczonych
  const refMode = 'QUIZ_PL_ES';
  const learnedSet = new Set(getModeStats(refMode, currentLevel, currentCat).learnedWords || []);
  const unlearnedPool = datasetFor(currentCat).filter(w => !learnedSet.has(w.es.toLowerCase()));

  const uBtn = $('#startUnlearnedBtn');
  const uCard = $('#unlearnedModeCard');
  if (uBtn && uCard){
    uBtn.textContent = `Start (${unlearnedPool.length} słów) ➜`;
    uBtn.disabled = unlearnedPool.length === 0;
    uCard.style.display = unlearnedPool.length > 0 ? 'flex' : 'none';
  }

  // Zaktualizuj tryb powtórki błędów
  const mistakesSet = getPersistentMistakes(currentCat);
  const mistakesPool = datasetFor(currentCat).filter(w => mistakesSet.has(w.es.toLowerCase()));

  const rBtn = $('#startReviewBtn');
  const rCard = $('#reviewModeCard');
  if (rBtn && rCard){
    rBtn.textContent = `Start (${mistakesPool.length} słów) ➜`;
    rBtn.disabled = mistakesPool.length === 0;
    rCard.style.display = mistakesPool.length > 0 ? 'flex' : 'none';
  }

  const el3Best = document.getElementById('statBest3');
  const el3Time = document.getElementById('statBestTime3');
  const el3Learned = document.getElementById('statLearned3');
  const el3Total = document.getElementById('statTotalWords3');
  if (el3Best) el3Best.textContent = st.bestScore || 0;
  if (el3Time) el3Time.textContent = formatTime(st.bestTime);
  if (el3Learned) el3Learned.textContent = (st.learnedWords || []).length;
  if (el3Total) el3Total.textContent = dataset().length;
}

/* ---------- Inicjalizacja ---------- */
showMenuStep(1);
updateMenuStats('QUIZ_PL_ES');
renderBadges();
renderAchievements();
runFunctionalTests();