/* ----------------- Dane offline ----------------- */
/*
 * Ta wersja pliku app.js korzysta wyłącznie z lokalnych obrazów umieszczonych
 * w katalogu assets/img/fruits i assets/img/veggies. Aplikacja nie pobiera
 * grafik z internetu.
 */
const FRUITS = [
  {img:'assets/img/fruits/jablko.jpg',      pl:'jabłko',      es:'manzana'},
  {img:'assets/img/fruits/truskawka.jpg',   pl:'truskawka',   es:'fresa'},
  {img:'assets/img/fruits/pomarancza.jpg',  pl:'pomarańcza',  es:'naranja'},
  {img:'assets/img/fruits/mango.jpg',       pl:'mango',       es:'mango'},
  {img:'assets/img/fruits/gruszka.webp',    pl:'gruszka',     es:'pera'},
  {img:'assets/img/fruits/papaja.jpg',      pl:'papaja',      es:'papaya'},
  {img:'assets/img/fruits/ananas.jpg',      pl:'ananas',      es:'piña'},
  {img:'assets/img/fruits/banan.jpg',       pl:'banan',       es:'plátano'},
  {img:'assets/img/fruits/arbuz.jpg',       pl:'arbuz',       es:'sandía'},
  {img:'assets/img/fruits/kiwi.jpg',        pl:'kiwi',        es:'kiwi'},
  {img:'assets/img/fruits/brzoskwinia.jpg', pl:'brzoskwinia', es:'durazno'},
  {img:'assets/img/fruits/winogrono.jpg',   pl:'winogrono',   es:'uva / uvas'},
  {img:'assets/img/fruits/granat.jpg',      pl:'granat',      es:'granada'},
  {img:'assets/img/fruits/kokos.jpg',       pl:'kokos',       es:'coco'},
  {img:'assets/img/fruits/melon.jpg',       pl:'melon',       es:'melón'},
  {img:'assets/img/fruits/jezyna.jpg',      pl:'jeżyna',      es:'mora'}
];

const VEGGIES = [
  {img:'assets/img/veggies/karczoch.jpg',    pl:'karczoch',    es:'alcachofa'},
  {img:'assets/img/veggies/seler.jpg',       pl:'seler',       es:'apio'},
  {img:'assets/img/veggies/batat.jpg',       pl:'batat',       es:'batata'},
  {img:'assets/img/veggies/baklazan.jpg',    pl:'bakłażan',    es:'berenjena'},
  {img:'assets/img/veggies/brokul.jpg',      pl:'brokuł',      es:'brócoli'},
  {img:'assets/img/veggies/cukinia.jpg',     pl:'cukinia',     es:'calabacín'},
  {img:'assets/img/veggies/cebula.jpg',      pl:'cebula',      es:'cebolla'},
  {img:'assets/img/veggies/pieczarki.jpg',   pl:'pieczarki',   es:'champiñones'},
  {img:'assets/img/veggies/kapusta.jpg',     pl:'kapusta',     es:'col'},
  {img:'assets/img/veggies/brukselka.jpg',   pl:'brukselka',   es:'coles de Bruselas'},
  {img:'assets/img/veggies/kalafior.jpg',    pl:'kalafior',    es:'coliflor'},
  {img:'assets/img/veggies/szparagi.jpg',    pl:'szparagi',    es:'espárragos'},
  {img:'assets/img/veggies/groszek.jpg',     pl:'groszek',     es:'guisantes'},
  {img:'assets/img/veggies/fasolka.jpg',     pl:'fasolka',     es:'judías'},
  {img:'assets/img/veggies/salata.jpg',      pl:'sałata',      es:'lechuga'},
  {img:'assets/img/veggies/kukurydza.jpg',   pl:'kukurydza',   es:'maíz'},
  {img:'assets/img/veggies/ziemniak.jpg',    pl:'ziemniak',    es:'patata / papa'},
  {img:'assets/img/veggies/ogorek.jpg',      pl:'ogórek',      es:'pepino'},
  {img:'assets/img/veggies/papryka.jpg',     pl:'papryka',     es:'pimiento'},
  {img:'assets/img/veggies/rzodkiewka.jpg',  pl:'rzodkiewka',  es:'rábano'},
  {img:'assets/img/veggies/burak.jpg',       pl:'burak',       es:'remolacha'},
  {img:'assets/img/veggies/pomidor.jpg',     pl:'pomidor',     es:'tomate'},
  {img:'assets/img/veggies/marchewka.jpg',   pl:'marchewka',   es:'zanahoria'},
  {img:'assets/img/veggies/dynia.jpg',       pl:'dynia',       es:'calabaza'}
];

/* ---------- Utils ---------- */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const shuffle = a => { for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a; };
const pick = (arr,n) => { const pool=[...arr]; const out=[]; while(n-- > 0 && pool.length) out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]); return out; };

/* ---------- Konfiguracja ---------- */
const LEVELS = { LATWY:{options:2,len:6}, SREDNI:{options:3,len:8}, TRUDNY:{options:4,len:10} };
const LEVEL_NAMES = { LATWY:'Łatwy', SREDNI:'Średni', TRUDNY:'Trudny' };
const CAT_NAMES = { FRUITS:'Owoce', VEGGIES:'Warzywa', MIXED:'Mieszane' };
let currentLevel = 'LATWY';
let currentCat = 'FRUITS'; // FRUITS / VEGGIES / MIXED
function datasetFor(cat){
  if (cat==='FRUITS') return FRUITS;
  if (cat==='VEGGIES') return VEGGIES;
  return [...FRUITS, ...VEGGIES];
}
function dataset(){ return datasetFor(currentCat); }

/* ---------- Persistencja + Odznaki ---------- */
const STORAGE_KEY = 'hiszp_owoce_warzywa_stats_v4';
const BADGES_KEY  = 'hiszp_owoce_warzywa_badges_v2';

function getDefaultStats(){
  return { games:0, bestScore:0, bestStreak:0, totalCorrect:0, totalQuestions:0, lastPlayed:null, lastTime:null, bestTime:null, learnedWords:[] };
}
function loadStats(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } }
function saveStats(s){ localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
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

const BADGES_CATALOG = [
  {id:'first_quiz',   icon:'🎉', name:'Pierwszy quiz!', desc:'Ukończ dowolny quiz po raz pierwszy.'},
  {id:'perfect_easy', icon:'🌟', name:'Perfekt: Łatwy', desc:'Zdobądź 100% w quizie na poziomie Łatwy.'},
  {id:'perfect_mid',  icon:'💫', name:'Perfekt: Średni', desc:'Zdobądź 100% w quizie na poziomie Średni.'},
  {id:'perfect_hard', icon:'🏆', name:'Perfekt: Trudny', desc:'Zdobądź 100% w quizie na poziomie Trudny.'},
  {id:'streak_5',     icon:'🔥', name:'Seria 5',        desc:'Osiągnij serię 5 poprawnych odpowiedzi.'},
  {id:'speed_runner', icon:'⏱️', name:'Szybka runda',   desc:'Ukończ quiz w < 60 s (dowolny poziom).'},
  {id:'fruit_master', icon:'🍓', name:'Mistrz owoców',  desc:'100% w quizie w kategorii Owoce (dowolny poziom).'},
  {id:'veggie_master',icon:'🥦', name:'Mistrz warzyw',  desc:'100% w quizie w kategorii Warzywa (dowolny poziom).'}
];
function loadBadges(){ try { return JSON.parse(localStorage.getItem(BADGES_KEY)) || []; } catch { return []; } }
function saveBadges(arr){ localStorage.setItem(BADGES_KEY, JSON.stringify(arr)); }
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
  const shelf = $('#badgeShelf'); shelf.innerHTML='';
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

const ACHIEVEMENTS_KEY = 'hiszp_achievements_state_v1';
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
    const raw = JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY));
    return { ...achievementDefaults(), ...(raw || {}) };
  } catch {
    return achievementDefaults();
  }
}
function saveAchievements(state){
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(state));
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

function registerCorrectAnswer(){
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
  ['menu','flashcards','quiz','finditem'].forEach(id => document.getElementById(id).classList.toggle('hidden', id!==sectionId));
  if (sectionId==='menu'){
    renderBadges();
    renderAchievements();
  }
}
document.getElementById('toMenuBtn').addEventListener('click', ()=> { show('menu'); updateMenuStats('QUIZ_PL_ES'); });
document.getElementById('catSeg').addEventListener('click', e => {
  const seg = e.target.closest('.seg'); if(!seg) return;
  $$('#catSeg .seg').forEach(s=>s.classList.remove('active'));
  seg.classList.add('active'); currentCat = seg.dataset.cat;
  updateMenuStats('QUIZ_PL_ES');
});
document.getElementById('levelSeg').addEventListener('click', e => {
  const seg = e.target.closest('.seg'); if(!seg) return;
  $$('#levelSeg .seg').forEach(s=>s.classList.remove('active'));
  seg.classList.add('active'); currentLevel = seg.dataset.level;
  updateMenuStats('QUIZ_PL_ES');
});
$$('[data-go]').forEach(b => b.addEventListener('click', () => {
  const target = b.getAttribute('data-go'); show(target);
  if (target==='quiz'){ startQuiz(); updateMenuStats('QUIZ_PL_ES'); }
  if (target==='finditem'){ startFindItem(); updateMenuStats('FIND_ITEM'); }
  if (target==='flashcards'){ renderFlashcard(); }
}));

/* ---------- Fiszki ---------- */
let fcIndex = 0;
function renderFlashcard(){
  const list = dataset(); if (!list.length) return;
  const idx = ((fcIndex%list.length)+list.length)%list.length;
  const item = list[idx];
  document.getElementById('fcImg').src = item.img;
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
  qIsReviewMode = false;
  applyLevelToQuiz();
  makeQuestionPool();
  qRound=0; qScore=0; qStreak=0; qBestStreak = getModeStats('QUIZ_PL_ES', currentLevel, currentCat).bestStreak || 0;
  qMistakes = [];
  qMistakeSet = new Set();
  qAnswered = false;
  qAnsweredCorrect = false;
  document.getElementById('qScore').textContent='0'; document.getElementById('qStreak').textContent='0'; document.getElementById('qBestStreak').textContent=qBestStreak;
  document.getElementById('scoreFill').style.width='0%'; document.getElementById('qNext').disabled=false; document.getElementById('qSkip').disabled=false;
  document.getElementById('qRetry').disabled=true;
  document.getElementById('qSummary').classList.add('hidden');
  resetMistakeSummaryUI();
  const sumTitle = document.getElementById('qSummaryTitle'); if (sumTitle) sumTitle.textContent = 'Podsumowanie';
  qStartTime = performance.now();
  newQuestion();
}
function newQuestion(){
  qRound++; if (qRound>qLen){ endQuiz(); return; }
  qAnswered = false;
  qAnsweredCorrect = false;
  const list = dataset();
  const correct = qPool[qRound-1] || pick(list,1)[0]; qAnswer = correct;
  document.getElementById('qImg').src = correct.img;
  document.getElementById('qHint').textContent = 'po polsku: ' + correct.pl;
  document.getElementById('qNum').textContent = qRound; document.getElementById('qTotal').textContent = qLen;
  const wrap = document.getElementById('choices'); wrap.innerHTML='';
  const options = shuffle([correct, ...pick(list.filter(x=>x!==correct), qOpts-1)]);
  options.forEach(opt=>{
    const btn=document.createElement('button'); btn.className='choice'; btn.innerHTML = `<b>${opt.es}</b>`;
    btn.addEventListener('click', ()=>{
      if (qAnswered) return;
      const isOk = opt===correct;
      qAnswered = true;
      qAnsweredCorrect = isOk;
      if (isOk){
        btn.classList.add('correct'); qScore++; qStreak++; qBestStreak = Math.max(qBestStreak, qStreak);
        markLearned('QUIZ_PL_ES', currentLevel, currentCat, correct);
        registerCorrectAnswer();
      }
      else {
        btn.classList.add('wrong'); qStreak = 0;
        registerMistake(correct);
        [...wrap.children].forEach(c=>{ if (c.textContent.toLowerCase().includes(correct.es.split(' ')[0])) c.classList.add('correct'); });
      }
      document.getElementById('qScore').textContent=qScore; document.getElementById('qStreak').textContent=qStreak; document.getElementById('qBestStreak').textContent=qBestStreak;
      document.getElementById('scoreFill').style.width=(qScore/qLen*100)+'%';
      [...wrap.children].forEach(c=>c.disabled=true);
    });
    wrap.appendChild(btn);
  });
}
document.getElementById('qNext').addEventListener('click', ()=>{
  if (!qAnswered && qAnswer){ registerMistake(qAnswer); }
  newQuestion();
});
document.getElementById('qSkip').addEventListener('click', ()=>{
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

    if (st.games === 1) awardBadge('first_quiz');
    if (qScore === qLen){
      if (currentLevel==='LATWY') awardBadge('perfect_easy');
      if (currentLevel==='SREDNI') awardBadge('perfect_mid');
      if (currentLevel==='TRUDNY') awardBadge('perfect_hard');
      if (currentCat==='FRUITS') awardBadge('fruit_master');
      if (currentCat==='VEGGIES') awardBadge('veggie_master');
    }
    if (qBestStreak >= 5) awardBadge('streak_5');
    if (elapsedSec < 60) awardBadge('speed_runner');
  }

  document.getElementById('choices').innerHTML='';
  document.getElementById('qNum').textContent=qLen;
  document.getElementById('qNext').disabled=true;
  document.getElementById('qSkip').disabled=true;
  document.getElementById('qRetry').disabled=false;

  document.getElementById('qSumScore').textContent = qScore;
  document.getElementById('qSumTotal').textContent = qLen;
  document.getElementById('qSumPct').textContent = Math.round((qScore/qLen)*100);
  document.getElementById('qSumBestStreak').textContent = qBestStreak;
  document.getElementById('qSumTime').textContent = elapsedSec.toFixed(1)+' s';
  const bestTime = st.bestTime ? st.bestTime.toFixed(1)+' s' : '—';
  document.getElementById('qSumBestTime').textContent = bestTime;
  const sumTitle = document.getElementById('qSummaryTitle'); if (sumTitle) sumTitle.textContent = qIsReviewMode ? 'Podsumowanie powtórki' : 'Podsumowanie';
  updateMistakeSummary();
  document.getElementById('qSummary').classList.remove('hidden');

  document.getElementById('qSumRetry').onclick = ()=> startQuiz();
  document.getElementById('qSumMenu').onclick  = ()=> { show('menu'); updateMenuStats('QUIZ_PL_ES'); };
  updateGlobalStats();
}

function startMistakeReview(){
  if (!qMistakes.length) return;
  const reviewPool = [...qMistakes];
  qIsReviewMode = true;
  qPool = reviewPool;
  qLen = reviewPool.length;
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
  document.getElementById('qStreak').textContent='0';
  document.getElementById('qBestStreak').textContent='0';
  document.getElementById('scoreFill').style.width='0%';
  document.getElementById('qNext').disabled=false;
  document.getElementById('qSkip').disabled=false;
  document.getElementById('qRetry').disabled=true;
  document.getElementById('qSummary').classList.add('hidden');
  const sumTitle = document.getElementById('qSummaryTitle'); if (sumTitle) sumTitle.textContent = 'Podsumowanie powtórki';
  resetMistakeSummaryUI();
  document.getElementById('qTotal').textContent = qLen;
  qStartTime = performance.now();
  if (typeof toast === 'function'){ toast('Rozpoczynamy powtórkę błędnych odpowiedzi!'); }
  newQuestion();
}

/* ---------- Find Item (ES -> IMG) ---------- */
let fRound=0, fScore=0, fStreak=0, fBestStreak=0, fAnswer=null, fLen=LEVELS[currentLevel].len, fOpts=LEVELS[currentLevel].options, fStartTime=0;
let fPool = [];
function applyLevelToFind(){ fLen=LEVELS[currentLevel].len; fOpts=LEVELS[currentLevel].options; document.getElementById('fTotal').textContent=fLen; }
function makeFindPool(){ const list = dataset(); fPool = shuffle([...list]).slice(0, Math.min(list.length, fLen)); }
function startFindItem(){
  applyLevelToFind();
  makeFindPool();
  fRound=0; fScore=0; fStreak=0; fBestStreak = getModeStats('FIND_ITEM', currentLevel, currentCat).bestStreak || 0;
  document.getElementById('fScore').textContent='0'; document.getElementById('fStreak').textContent='0'; document.getElementById('fBestStreak').textContent=fBestStreak;
  document.getElementById('fFill').style.width='0%'; document.getElementById('fNext').disabled=false; document.getElementById('fSkip').disabled=false;
  document.getElementById('fRetry').disabled=true;
  document.getElementById('fSummary').classList.add('hidden');
  fStartTime = performance.now();
  newFindQuestion();
}
function newFindQuestion(){
  fRound++; if (fRound>fLen){ endFind(); return; }
  const list = dataset();
  const correct = fPool[fRound-1] || pick(list,1)[0]; fAnswer = correct;
  document.getElementById('fEs').textContent = correct.es;
  document.getElementById('fPl').textContent = '('+correct.pl+')';
  document.getElementById('fNum').textContent = fRound; document.getElementById('fTotal').textContent = fLen;
  const options = shuffle([correct, ...pick(list.filter(x=>x!==correct), fOpts-1)]);
  const wrap = document.getElementById('itemChoices'); wrap.innerHTML='';
  options.forEach(opt=>{
    const btn=document.createElement('button'); btn.className='choice'; btn.style.flexDirection='column'; btn.style.alignItems='stretch';
    btn.innerHTML = `<div class="imgwrap"><img alt="obraz" src="${opt.img}"/></div>`;
    btn.addEventListener('click', ()=>{
      const isOk = opt===correct;
      if (isOk){
        btn.classList.add('correct'); fScore++; fStreak++; fBestStreak = Math.max(fBestStreak, fStreak);
        markLearned('FIND_ITEM', currentLevel, currentCat, correct);
        registerCorrectAnswer();
      }
      else { btn.classList.add('wrong'); fStreak=0;
        [...wrap.children].forEach(c=>{
          const has = c.querySelector('img')?.src === (new URL(correct.img, document.baseURI)).href;
          if (has) c.classList.add('correct');
        });
      }
      document.getElementById('fScore').textContent=fScore; document.getElementById('fStreak').textContent=fStreak; document.getElementById('fBestStreak').textContent=fBestStreak;
      document.getElementById('fFill').style.width=(fScore/fLen*100)+'%';
      [...wrap.children].forEach(c=>c.disabled=true);
    });
    wrap.appendChild(btn);
  });
  setTimeout(()=> speakEs(correct.es), 120);
}
document.getElementById('fNext').addEventListener('click', newFindQuestion);
document.getElementById('fSkip').addEventListener('click', newFindQuestion);
document.getElementById('fSpeak').addEventListener('click', ()=> { if (fAnswer) speakEs(fAnswer.es); });
document.getElementById('fRetry').addEventListener('click', ()=> { startFindItem(); });

function endFind(){
  const elapsedSec = (performance.now() - fStartTime) / 1000;
  const st = getModeStats('FIND_ITEM', currentLevel, currentCat);
  st.games += 1; st.bestScore = Math.max(st.bestScore||0, fScore);
  st.bestStreak = Math.max(st.bestStreak||0, fBestStreak);
  st.totalCorrect += fScore; st.totalQuestions += fLen; st.lastPlayed = new Date().toISOString();
  st.lastTime = elapsedSec;
  if (!st.bestTime || elapsedSec < st.bestTime) st.bestTime = elapsedSec;
  setModeStats('FIND_ITEM', currentLevel, currentCat, st);

  document.getElementById('itemChoices').innerHTML='';
  document.getElementById('fNum').textContent=fLen;
  document.getElementById('fNext').disabled=true;
  document.getElementById('fSkip').disabled=true;
  document.getElementById('fRetry').disabled=false;

  document.getElementById('fSumScore').textContent = fScore;
  document.getElementById('fSumTotal').textContent = fLen;
  document.getElementById('fSumPct').textContent = Math.round((fScore/fLen)*100);
  document.getElementById('fSumBestStreak').textContent = fBestStreak;
  document.getElementById('fSumTime').textContent = elapsedSec.toFixed(1)+' s';
  const bestTime = st.bestTime ? st.bestTime.toFixed(1)+' s' : '—';
  document.getElementById('fSumBestTime').textContent = bestTime;
  document.getElementById('fSummary').classList.remove('hidden');

  document.getElementById('fSumRetry').onclick = ()=> startFindItem();
  document.getElementById('fSumMenu').onclick  = ()=> { show('menu'); updateMenuStats('FIND_ITEM'); };
  updateGlobalStats();
}

/* ---------- Statystyki w menu ---------- */
function catLabel(cat){
  return CAT_NAMES[cat] || cat;
}
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
    {name:'Łączny zestaw spójny', pass: datasetFor('MIXED').length === datasetFor('FRUITS').length + datasetFor('VEGGIES').length},
    {name:'Sekcja menu obecna', pass: !!document.getElementById('menu')},
    {name:'Sekcja fiszek obecna', pass: !!document.getElementById('flashcards')},
    {name:'Sekcja quizu obecna', pass: !!document.getElementById('quiz')},
    {name:'Sekcja znajdź element obecna', pass: !!document.getElementById('finditem')},
    {name:'Kontener naklejek obecny', pass: !!document.getElementById('stickerShelf')},
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
  const st = getModeStats(mode, currentLevel, currentCat);
  document.getElementById('statMode').textContent = mode==='QUIZ_PL_ES' ? 'Quiz PL→ES' : (mode==='FIND_ITEM' ? 'Wybierz (ES→obraz)' : '—');
  document.getElementById('statLvl').textContent = levelLabel(currentLevel);
  document.getElementById('statCat').textContent = catLabel(currentCat);
  document.getElementById('statBest').textContent = st.bestScore || 0;
  document.getElementById('statBestTime').textContent = formatTime(st.bestTime);
  document.getElementById('statBestStreak').textContent = st.bestStreak || 0;
  document.getElementById('statLearned').textContent = (st.learnedWords || []).length;
  document.getElementById('statTotalWords').textContent = dataset().length;
  renderBestTimes(mode);
  updateGlobalStats();
}

/* ---------- Inicjalizacja ---------- */
updateMenuStats('QUIZ_PL_ES');
renderBadges();
renderAchievements();
runFunctionalTests();