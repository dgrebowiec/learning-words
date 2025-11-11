/* ----------------- Dane ----------------- */
const FRUITS = [
  {img:"https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg", pl:"jabłko", es:"manzana"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqfg0Wha6sW-FYXe11D8ZcKNZ69zUbxAiostHCtyUzl04RmW9IpfiaxtcPvck&s", pl:"truskawka", es:"fresa"},
  {img:"https://upload.wikimedia.org/wikipedia/commons/c/c4/Orange-Fruit-Pieces.jpg", pl:"pomarańcza", es:"naranja"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSysuFcNwDyhq-1xqnhkv4poX4Z6ivLqLOoDrIoNADPG3HPAETaIiDKiLksrts&s", pl:"mango", es:"mango"},
  {img:"https://www.lokalnywarzywniak.pl/1472-medium_default/gruszka-czerwona.webp", pl:"gruszka", es:"pera"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMPTOSbFmiadO02IIzvvkv_8EgDnGnFrkKDAWXdJoZorn4M-vQxsel1AOBJZg&s", pl:"papaja", es:"papaya"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFPZFCC6SYcNhxp1NIPD6NZj6aPVpuVfjySHP7ojmC2M_Nox6QreZz84rJVA&s", pl:"ananas", es:"piña"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTur7v5PX6FGapp1e1thM8uDeDDp8mZ53tdzvNPXKEn7b0N_dTHaQpNg1Vuig&s", pl:"banan", es:"plátano"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkHovEZEWpcqmzZv6JQWzfQqMVEh_YNn-ODiQvqhxw6Cgo3i-HL9fSIJrz0vQ&s", pl:"arbuz", es:"sandía"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv58glmM-XVzRQ7Lmka88EM0MYnXN5Dx33md09qU44c4Nrdp1lWCTdgVdRhs0&s", pl:"kiwi", es:"kiwi"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrt6lf7jriPJA0G5Yjx2Dv6CUWGlhaguJrjihejjQi2cVpiPYdQ1enkEMkrLM&s", pl:"brzoskwinia", es:"durazno"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR33pyAkczMTgQz3wB-8fhyiGNtrc4TWhDvHHRXxw9S5VqT7rPbfDas0nYLQA&s", pl:"winogrono", es:"uva / uvas"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3622tUEv--Am_CudSE50JmlsF3auH13IvY3S_bacfGlef1l6oQCy83CgVXQ&s", pl:"granat", es:"granada"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMzhhnxijWWgPnSk9n2DCgN-wyNZv2Yg_0PyaAb3ksVI2dDhxYZroUSxyDXKA&s", pl:"kokos", es:"coco"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1J4RAXLeu8k4-wAwY49b4c72WPBsigwppodnh0ZM9CrE4reaPJuMG5PlSeg&s", pl:"melon", es:"melón"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu8Qf2JdCO-Y3Fq16cfTuaVVAB7TVWB_8w3D8v-JamlAE1Qvu3dwwfzbZ5lkI&s", pl:"jeżyna", es:"mora"}
];

const VEGGIES = [
  {img:"https://d13l1gw8yx87m9.cloudfront.net/emelissa-cms/blog_pages/d2473bdb-7349-4719-a951-7ffec3e95f58.jpg?format=webp&preset=2xl", pl:"karczoch", es:"alcachofa"},
  {img:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Au_march%C3%A9_-_C%C3%A9leri_en_branches_et_c%C3%A9leri_rave.JPG/800px-Au_march%C3%A9_-_C%C3%A9leri_en_branches_et_c%C3%A9leri_rave.JPG", pl:"seler", es:"apio"},
  {img:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Ipomoea_batatas_006.JPG/250px-Ipomoea_batatas_006.JPG", pl:"batat", es:"batata"},
  {img:"https://upload.wikimedia.org/wikipedia/commons/f/fb/Aubergine.jpg", pl:"bakłażan", es:"berenjena"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQylec9j5Y9ErEx1Bpx80kYahhjuzI8-pxHN0a-ewr6HQ83JJWgbdYsch1vG8U&s", pl:"brokuł", es:"brócoli"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDWUE7W0lOTBNf1pzme5GSOjFumrWsklN6jiavOx6MFi9MJ8rD1F85WVhoyg&s", pl:"cukinia", es:"calabacín"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbpHeF6CpPK9FbujPy42rQC3BGmJ_adB7mSoFFOn5cQIBmQPMdQ0Uk8iKT3g&s", pl:"cebula", es:"cebolla"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNnEkmjxBO88gTK3aT4upKikA11KblWenDnqsgh_0BqznKJiCvNX40sz-MdQ&s", pl:"pieczarki", es:"champiñones"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-uKbxG6IS0w-fY69lo-aJtbCawpZRZugkXafWZUNpaJ6TBM9iSDdOhU3BrQ&s", pl:"kapusta", es:"col"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM3h3MAf3UhvyBOJK4-CSq-OIhPwVK3j4_7xttWONhXKTPIOGb0J9Oc7CDdJw&s", pl:"brukselka", es:"coles de Bruselas"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQufqj8he54DWgM4aurgiRSIBgaLVw_qV13KQe5QnNiqBMaK_KbNGp3qMR5FPs&s", pl:"kalafior", es:"coliflor"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKb6Z5l-mo7t-izZ4WtB6_LJGGJKxj9A_Kl5EPCP7Cjgi7LKAss-JfpNJgMw&s", pl:"szparagi", es:"espárragos"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQAMZhOAfpAcMkudP6rzvOUWMKOv219A1nP7iP9S6rtpzwEv79EOBIhJk28vg&s", pl:"groszek", es:"guisantes"},
  {img:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Heaps_of_beans.jpg/250px-Heaps_of_beans.jpg", pl:"fasolka", es:"judías"},
  {img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPJpcO_9mND6RXOnsgnBjZLOEm1C4zPstjPxM0vAol4aUC3mCTMkyefirPxTY&s", pl:"sałata", es:"lechuga"},
  {img:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Zea_mays.jpg/800px-Zea_mays.jpg", pl:"kukurydza", es:"maíz"},
  {img:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Solanum_tuberosum_Vineta20100419_12.jpg/1024px-Solanum_tuberosum_Vineta20100419_12.jpg", pl:"ziemniak", es:"patata / papa"},
  {img:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Cucumis_sativus.jpg/800px/Cucumis_sativus.jpg", pl:"ogórek", es:"pepino"},
  {img:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Red_capsicum_and_cross_section.jpg/250px-Red_capsicum_and_cross_section.jpg", pl:"papryka", es:"pimiento"},
  {img:"https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/2018-06-01_%28132%29_Raphanus_sativus_%28Radish%29_at_Bichlh%C3%A4usl_in_Frankenfels%2C_Austria.jpg/800px-2018-06-01_%28132%29_Raphanus_sativus_%28Radish%29_at_Bichlh%C3%A4usl_in_Frankenfels%2C_Austria.jpg", pl:"rzodkiewka", es:"rábano"},
  {img:"https://upload.wikimedia.org/wikipedia/commons/9/93/Beets_produce-1.jpg", pl:"burak", es:"remolacha"},
  {img:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Pomidory_-_tomato.jpg/800px-Pomidory_-_tomato.jpg", pl:"pomidor", es:"tomate"},
  {img:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Carrots.JPG/1024px-Carrots.JPG", pl:"marchewka", es:"zanahoria"},
  {img:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/%D0%93%D0%B0%D1%80%D0%B1%D1%83%D0%B7_%D0%B2%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%BF%D0%BB%D1%96%D0%B4%D0%BD%D0%B8%D0%B9_%D0%B0%D0%B1%D0%BE_%D0%B2%D0%BE%D0%BB%D0%BE%D1%81%D1%8C%D0%BA%D0%B8%D0%B9_Cucurbita_maxima.jpg/800px-%D0%93%D0%B0%D1%80%D0%B1%D1%83%D0%B7_%D0%B2%D0%B5%D0%BB%D0%B8%D0%BA%D0%BE%D0%BF%D0%BB%D1%96%D0%B4%D0%BD%D0%B8%D0%B9_%D0%B0%D0%B1%D0%BE_%D0%B2%D0%BE%D0%BB%D0%BE%D1%81%D1%8C%D0%BA%D0%B8%D0%B9_Cucurbita_maxima.jpg", pl:"dynia", es:"calabaza"}
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

function achievementDefaults(){
  return { stars:0, starProgress:0, stickers:[], totalCorrect:0 };
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
function renderAchievements(){
  const state = loadAchievements();
  const stars = state.stars || 0;
  const progress = state.starProgress || 0;
  const progressEl = document.getElementById('statStarProgress');
  if (progressEl) progressEl.textContent = `${progress}/${STAR_INTERVAL}`;
  const starsEl = document.getElementById('statStars');
  if (starsEl) starsEl.textContent = stars;
  const stickersEl = document.getElementById('statStickers');
  if (stickersEl) stickersEl.textContent = (state.stickers || []).length;
  const shelf = document.getElementById('stickerShelf');
  if (shelf){
    shelf.innerHTML='';
    STICKER_CATALOG.forEach(sticker=>{
      const ownedOne = (state.stickers || []).find(s=>s.id===sticker.id);
      const el = document.createElement('div');
      el.className='badge';
      el.style.opacity = ownedOne ? '1' : '.5';
      const title = ownedOne ? `${sticker.desc}\nZdobyto: ${new Date(ownedOne.earnedAt).toLocaleString()}` : `${sticker.desc}\nZdobądź ${stickerThresholdForIndex(STICKER_CATALOG.indexOf(sticker))} gwiazdek.`;
      el.title = title;
      el.innerHTML = `<span style="font-size:18px">${sticker.icon}</span><b>${sticker.name}</b>`;
      shelf.appendChild(el);
    });
  }
}
function registerCorrectAnswer(){
  const state = loadAchievements();
  state.totalCorrect = (state.totalCorrect || 0) + 1;
  state.starProgress = (state.starProgress || 0) + 1;
  let starsEarned = 0;
  while (state.starProgress >= STAR_INTERVAL){
    state.starProgress -= STAR_INTERVAL;
    state.stars = (state.stars || 0) + 1;
    starsEarned++;
  }
  const stickersBefore = (state.stickers || []).length;
  while (state.stars >= stickerThresholdForIndex((state.stickers || []).length) && (state.stickers || []).length < STICKER_CATALOG.length){
    const newSticker = STICKER_CATALOG[(state.stickers || []).length];
    state.stickers.push({id:newSticker.id, earnedAt:new Date().toISOString()});
    toast(`🏅 Nowa naklejka: ${newSticker.icon} ${newSticker.name}`);
  }
  saveAchievements(state);
  renderAchievements();
  if (starsEarned > 0){
    const plural = starsEarned > 1 ? 'gwiazdki' : 'gwiazdkę';
    toast(`⭐ Zdobyto ${starsEarned} ${plural}!`);
  }
  if (starsEarned === 0 && ((state.stickers || []).length === stickersBefore)){
    // brak nowych nagród – tylko aktualizacja postępu
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
function applyLevelToQuiz(){ qLen=LEVELS[currentLevel].len; qOpts=LEVELS[currentLevel].options; document.getElementById('qTotal').textContent=qLen; }
function makeQuestionPool(){ const list = dataset(); qPool = shuffle([...list]).slice(0, Math.min(list.length, qLen)); }
function startQuiz(){
  applyLevelToQuiz();
  makeQuestionPool();
  qRound=0; qScore=0; qStreak=0; qBestStreak = getModeStats('QUIZ_PL_ES', currentLevel, currentCat).bestStreak || 0;
  document.getElementById('qScore').textContent='0'; document.getElementById('qStreak').textContent='0'; document.getElementById('qBestStreak').textContent=qBestStreak;
  document.getElementById('scoreFill').style.width='0%'; document.getElementById('qNext').disabled=false; document.getElementById('qSkip').disabled=false;
  document.getElementById('qRetry').disabled=true;
  document.getElementById('qSummary').classList.add('hidden');
  qStartTime = performance.now();
  newQuestion();
}
function newQuestion(){
  qRound++; if (qRound>qLen){ endQuiz(); return; }
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
      const isOk = opt===correct;
      if (isOk){
        btn.classList.add('correct'); qScore++; qStreak++; qBestStreak = Math.max(qBestStreak, qStreak);
        markLearned('QUIZ_PL_ES', currentLevel, currentCat, correct);
        registerCorrectAnswer();
      }
      else { btn.classList.add('wrong'); qStreak = 0;
        [...wrap.children].forEach(c=>{ if (c.textContent.toLowerCase().includes(correct.es.split(' ')[0])) c.classList.add('correct'); });
      }
      document.getElementById('qScore').textContent=qScore; document.getElementById('qStreak').textContent=qStreak; document.getElementById('qBestStreak').textContent=qBestStreak;
      document.getElementById('scoreFill').style.width=(qScore/qLen*100)+'%';
      [...wrap.children].forEach(c=>c.disabled=true);
    });
    wrap.appendChild(btn);
  });
}
document.getElementById('qNext').addEventListener('click', newQuestion);
document.getElementById('qSkip').addEventListener('click', newQuestion);
document.getElementById('qSpeak').addEventListener('click', ()=> { if (qAnswer) speakEs(qAnswer.es); });
document.getElementById('qRetry').addEventListener('click', ()=> { startQuiz(); });

function endQuiz(){
  const elapsedSec = (performance.now() - qStartTime) / 1000;
  const st = getModeStats('QUIZ_PL_ES', currentLevel, currentCat);
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
  document.getElementById('qSummary').classList.remove('hidden');

  document.getElementById('qSumRetry').onclick = ()=> startQuiz();
  document.getElementById('qSumMenu').onclick  = ()=> { show('menu'); updateMenuStats('QUIZ_PL_ES'); };
  updateGlobalStats();
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
    {name:'Licznik postępu gwiazdek obecny', pass: !!document.getElementById('statStarProgress')}
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
