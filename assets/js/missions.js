function MISSIONS_KEY() { return `hiszp_${profileId()}_missions_v1`; }

const MISSION_TYPES = [
  { id: 'play_memory', desc: 'Zagraj w Memory', target: 1, xp: 50 },
  { id: 'play_quiz', desc: 'Zagraj w Quiz', target: 1, xp: 50 },
  { id: 'learn_words', desc: 'Poznaj nowe słowa', target: 5, xp: 100 },
  { id: 'earn_stars', desc: 'Zdobądź gwiazdki', target: 3, xp: 80 },
  { id: 'play_timerace', desc: 'Zagraj w Wyścig z Czasem', target: 1, xp: 60 }
];

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function loadMissions() {
  try {
    const raw = JSON.parse(localStorage.getItem(MISSIONS_KEY()));
    if (raw && raw.date === getTodayStr()) {
      return raw.missions;
    }
  } catch(e) {}
  
  // Generate 3 random missions for today
  const shuffled = [...MISSION_TYPES].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3).map(m => ({
    id: m.id,
    desc: m.desc,
    target: m.target,
    xp: m.xp,
    progress: 0,
    completed: false,
    claimed: false
  }));
  
  const state = {
    date: getTodayStr(),
    missions: selected
  };
  localStorage.setItem(MISSIONS_KEY(), JSON.stringify(state));
  return selected;
}

function saveMissions(missions) {
  const state = {
    date: getTodayStr(),
    missions: missions
  };
  localStorage.setItem(MISSIONS_KEY(), JSON.stringify(state));
}

function progressMission(type, amount = 1) {
  const missions = loadMissions();
  let changed = false;
  
  missions.forEach(m => {
    if (m.id === type && !m.completed) {
      m.progress += amount;
      if (m.progress >= m.target) {
        m.progress = m.target;
        m.completed = true;
        if (typeof toast === 'function') {
          toast(`✨ Misja ukończona: ${m.desc}! Odbierz nagrodę w Menu.`);
        }
      }
      changed = true;
    }
  });
  
  if (changed) {
    saveMissions(missions);
    renderMissions();
  }
}

function claimMission(index) {
  const missions = loadMissions();
  const m = missions[index];
  
  if (m && m.completed && !m.claimed) {
    m.claimed = true;
    saveMissions(missions);
    
    if (typeof addXP === 'function') {
      addXP(m.xp, `Misja: ${m.desc}`);
    }
    if (typeof launchConfetti === 'function') {
      launchConfetti();
    }
    
    renderMissions();
  }
}

function renderMissions() {
  const container = document.getElementById('dailyMissionsContainer');
  if (!container) return;
  
  const missions = loadMissions();
  container.innerHTML = '';
  
  missions.forEach((m, index) => {
    const card = document.createElement('div');
    card.style.cssText = `
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      background: var(--bg-color); 
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
      ${m.completed && !m.claimed ? 'border-color: var(--primary-color); box-shadow: 0 0 10px rgba(250,204,21,0.3);' : ''}
      ${m.claimed ? 'opacity: 0.6;' : ''}
    `;
    
    const info = document.createElement('div');
    info.style.cssText = 'flex: 1;';
    info.innerHTML = `
      <div style="font-weight: 700; color: var(--text-color); margin-bottom: 4px;">
        ${m.desc}
      </div>
      <div style="font-size: 12px; opacity: 0.8;">
        Postęp: ${m.progress}/${m.target} | Nagroda: ${m.xp} XP
      </div>
    `;
    
    const action = document.createElement('div');
    action.style.cssText = 'margin-left: 12px;';
    
    if (m.claimed) {
      action.innerHTML = '<span style="font-size: 20px;">✅</span>';
    } else if (m.completed) {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.style.cssText = 'min-height: 44px; padding: 0 16px; background: var(--primary-color); color: #000;';
      btn.textContent = 'Odbierz';
      btn.onclick = () => claimMission(index);
      action.appendChild(btn);
    } else {
      action.innerHTML = `<span style="font-size: 20px; opacity: 0.5;">⏳</span>`;
    }
    
    card.appendChild(info);
    card.appendChild(action);
    container.appendChild(card);
  });
}

// Intercept stars and learned words
const originalRegisterCorrectAnswer = typeof registerCorrectAnswer === 'function' ? registerCorrectAnswer : null;
if (originalRegisterCorrectAnswer) {
  window.registerCorrectAnswer = function(correctWord) {
    const stateBefore = loadAchievements();
    const starsBefore = stateBefore.stars || 0;
    
    originalRegisterCorrectAnswer(correctWord);
    
    const stateAfter = loadAchievements();
    const starsAfter = stateAfter.stars || 0;
    
    if (starsAfter > starsBefore) {
      progressMission('earn_stars', starsAfter - starsBefore);
    }
  };
}

const originalMarkLearned = typeof markLearned === 'function' ? markLearned : null;
if (originalMarkLearned) {
  window.markLearned = function(mode, level, cat, word) {
    const statsBefore = getModeStats(mode, level, cat);
    const learnedBefore = new Set(statsBefore.learnedWords || []).size;
    
    originalMarkLearned(mode, level, cat, word);
    
    const statsAfter = getModeStats(mode, level, cat);
    const learnedAfter = new Set(statsAfter.learnedWords || []).size;
    
    if (learnedAfter > learnedBefore) {
      progressMission('learn_words', learnedAfter - learnedBefore);
    }
  };
}

// Hook into app start or menu show
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (typeof renderMissions === 'function') {
      renderMissions();
    }
  }, 500);
});
