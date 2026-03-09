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

function showModeSelect(){
  ALL_SECTIONS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', id !== 'menu');
  });
  renderBadges();
  renderAchievements();
  renderXPBar();
  renderStreak();
  updateMenuStats('QUIZ_PL_ES');
  showMenuStep(3);
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
  if (target==='tamagotchi'){ if(typeof window.renderTamagotchi === 'function') window.renderTamagotchi(); }
}));

document.getElementById('startReviewBtn').addEventListener('click', () => {
  const mistakesSet = getPersistentMistakes(currentCat);
  const pool = datasetFor(currentCat).filter(w => mistakesSet.has(w.es.toLowerCase()));
  startSpecialQuiz(pool, 'Powtórka błędów');
});
document.getElementById('startUnlearnedBtn').addEventListener('click', () => {
  const mode = 'QUIZ_PL_ES';
  const learnedSet = new Set(getModeStats(mode, currentLevel, currentCat).learnedWords || []);
  const pool = datasetFor(currentCat).filter(w => !learnedSet.has(w.es.toLowerCase()));
  startSpecialQuiz(pool, 'Nowe słowa');
});
