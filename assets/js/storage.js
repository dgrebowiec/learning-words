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
