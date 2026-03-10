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
    void fill.offsetWidth;
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

const STAR_INTERVAL = 5;
const STICKER_STAR_REQUIREMENT = 10;

const STICKER_CATALOG = [
  {id:'sunrise', icon:'🌅', name:'Świt nauki', desc:'Zgromadź 10 gwiazdek.'},
  {id:'rocket',  icon:'🚀', name:'Rakietowy start', desc:'Zgromadź 20 gwiazdek.'},
  {id:'compass', icon:'🧭', name:'Kierunek hiszpański', desc:'Zgromadź 30 gwiazdek.'},
  {id:'palette', icon:'🎨', name:'Kolorowe słowa', desc:'Zgromadź 40 gwiazdek.'},
  {id:'trophy',  icon:'🏆', name:'Mistrz nauki', desc:'Zgromadź 50 gwiazdek.'},
  {id:'crown',   icon:'👑', name:'Korona językowa', desc:'Zgromadź 60 gwiazdek.'}
];

const LIVE_STAR_SEG_TARGETS = [
  'quizStarSegs','findStarSegs','memStarSegs','wsStarSegs',
  'spStarSegs','scrStarSegs','artStarSegs','repStarSegs','headerStarSegs'
];
const LIVE_STAR_COUNT_TARGETS = [
  'quizStarCount','findStarCount','memStarCount','wsStarCount',
  'spStarCount','scrStarCount','artStarCount','repStarCount','headerStarCount'
];

function normalizeStarProgress(value){
  const numeric = Number(value);
  return Math.max(0, Math.min(STAR_INTERVAL, Number.isFinite(numeric) ? numeric : 0));
}

let _prevStarProgress = -1;

function renderStarSegments(containerId, progress, total){
  const container = document.getElementById(containerId);
  if (!container) return;
  const prevFilled = container.querySelectorAll('.star-seg.filled').length;
  container.innerHTML = '';
  for (let i = 0; i < total; i++){
    const seg = document.createElement('span');
    seg.className = 'star-seg' + (i < progress ? ' filled' : '');
    if (i < progress && i >= prevFilled) seg.classList.add('just-filled');
    container.appendChild(seg);
  }
}

function updateLiveStarProgress(state){
  const progressValue = normalizeStarProgress(state?.starProgress);
  const stars = state?.stars || 0;
  LIVE_STAR_SEG_TARGETS.forEach(id => renderStarSegments(id, progressValue, STAR_INTERVAL));
  LIVE_STAR_COUNT_TARGETS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = stars;
  });
  if (progressValue === 0 && _prevStarProgress === STAR_INTERVAL){
    LIVE_STAR_SEG_TARGETS.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('star-earned');
      setTimeout(() => { if (el) el.classList.remove('star-earned'); }, 700);
    });
  }
  _prevStarProgress = progressValue;
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

  if (state.lastDate === today) return;

  const lastDate = state.lastDate ? new Date(state.lastDate) : null;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let addedDay = false;

  if (state.lastDate === yesterdayStr) {
    state.count += 1;
    addedDay = true;
  } else {
    state.count = 1;
    addedDay = true;
  }

  state.lastDate = today;
  saveStreak(state);
  renderStreak();

  if (addedDay) {
    if (state.count % 7 === 0) {
      if (typeof addXP === 'function') addXP(100, "Tydzień nauki!");
      if (typeof toast === 'function') toast(`🎉 100 XP za 7 dni nauki z rzędu!`);
      if (typeof launchConfetti === 'function') launchConfetti();
    } else {
      if (typeof toast === 'function') toast(`🔥 Dzienna seria: ${state.count} dni!`);
    }
  }
}

function renderStreak() {
  const state = loadStreak();
  const el = document.getElementById('streakPill');
  if (el) el.textContent = `🔥 Seria: ${state.count} dni`;
  
  const statsEl = document.getElementById('streakPillStats');
  if (statsEl) statsEl.textContent = state.count;

  const daysContainer = document.getElementById('streakDaysContainer');
  if (daysContainer) {
    daysContainer.innerHTML = '';
    
    let filledDays = state.count % 7;
    if (state.count > 0 && filledDays === 0) {
      filledDays = 7;
    }

    for (let i = 1; i <= 7; i++) {
      const circle = document.createElement('div');
      circle.style.width = '35px';
      circle.style.height = '35px';
      circle.style.borderRadius = '50%';
      circle.style.display = 'flex';
      circle.style.alignItems = 'center';
      circle.style.justifyContent = 'center';
      circle.style.fontWeight = 'bold';
      circle.style.fontSize = '16px';
      
      if (i <= filledDays) {
        circle.style.background = '#ef4444';
        circle.style.color = '#fff';
        circle.style.boxShadow = '0 0 8px #ef4444';
        circle.textContent = i === 7 ? '🎁' : '✓';
      } else {
        circle.style.background = 'rgba(255,255,255,0.05)';
        circle.style.border = '2px solid rgba(255,255,255,0.2)';
        circle.textContent = i === 7 ? '🎁' : i;
      }
      
      daysContainer.appendChild(circle);
    }
    
    const textEl = document.getElementById('streakNextRewardText');
    if (textEl) {
      if (filledDays === 7) {
         textEl.textContent = '🎉 Tydzień ukończony! 100 XP zdobyte!';
      } else {
         const left = 7 - filledDays;
         textEl.textContent = `Graj codziennie! Za ${left} dni wielka nagroda!`;
      }
    }
  }
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

  renderShop();

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
