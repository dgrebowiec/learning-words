(function(){
  /* ---------- Stałe ---------- */
  const PROFILES_STORAGE_KEY = 'hiszp_profiles_v1';
  const SESSION_KEY = 'hiszp_active_profile';
  const MAX_PROFILES = 10;

  const LEGACY_KEYS = [
    'hiszp_owoce_warzywa_stats_v4',
    'hiszp_owoce_warzywa_badges_v2',
    'hiszp_persistent_mistakes_v1',
    'hiszp_xp_v1',
    'hiszp_achievements_state_v1',
    'hiszp_streak_v1'
  ];

  const LEGACY_TO_NEW_SUFFIX = {
    'hiszp_owoce_warzywa_stats_v4':    'stats_v4',
    'hiszp_owoce_warzywa_badges_v2':   'badges_v2',
    'hiszp_persistent_mistakes_v1':    'mistakes_v1',
    'hiszp_xp_v1':                     'xp_v1',
    'hiszp_achievements_state_v1':     'achievements_v1',
    'hiszp_streak_v1':                 'streak_v1'
  };

  const PROFILE_DATA_SUFFIXES = ['stats_v4', 'badges_v2', 'mistakes_v1', 'xp_v1', 'achievements_v1', 'streak_v1'];

  const AVATARS = ['🦁','🐸','🦊','🐧','🐬','🦄','🐉','🌟','🍦','🚀','🐨','🐯','🦋','🐙','🦕','🐺','🐼','🦖','🎃','🌈'];

  /* ---------- CRUD profili ---------- */
  function getProfiles(){
    try { return JSON.parse(localStorage.getItem(PROFILES_STORAGE_KEY)) || []; } catch { return []; }
  }

  function saveProfiles(arr){
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(arr));
  }

  function createProfile(name, avatar){
    const profiles = getProfiles();
    if (profiles.length >= MAX_PROFILES) return null;
    const id = Math.random().toString(36).slice(2, 10);
    const profile = { id, name: name.trim(), avatar: avatar || '🙂', createdAt: new Date().toISOString() };
    profiles.push(profile);
    saveProfiles(profiles);
    return profile;
  }

  function deleteProfile(id){
    let profiles = getProfiles();
    profiles = profiles.filter(p => p.id !== id);
    saveProfiles(profiles);
    PROFILE_DATA_SUFFIXES.forEach(suffix => {
      localStorage.removeItem(`hiszp_${id}_${suffix}`);
    });
  }

  /* ---------- Aktywny profil ---------- */
  function getActiveProfileId(){
    return sessionStorage.getItem(SESSION_KEY) || null;
  }

  function setActiveProfile(id){
    sessionStorage.setItem(SESSION_KEY, id);
    window.ACTIVE_PROFILE_ID = id;
  }

  /* ---------- Migracja ---------- */
  function hasLegacyData(){
    return LEGACY_KEYS.some(k => localStorage.getItem(k) !== null);
  }

  function migrateLegacyData(profileId){
    LEGACY_KEYS.forEach(oldKey => {
      const val = localStorage.getItem(oldKey);
      if (val !== null){
        const suffix = LEGACY_TO_NEW_SUFFIX[oldKey];
        localStorage.setItem(`hiszp_${profileId}_${suffix}`, val);
        localStorage.removeItem(oldKey);
      }
    });
  }

  function clearLegacyData(){
    LEGACY_KEYS.forEach(k => localStorage.removeItem(k));
  }

  /* ---------- UI helpers ---------- */
  function reloadProfileUI(){
    const profile = getProfiles().find(p => p.id === getActiveProfileId());
    const display = document.getElementById('activePlayerDisplay');
    const changeBtn = document.getElementById('changePlayerBtn');
    if (display && profile){
      display.textContent = `${profile.avatar} ${profile.name}`;
      display.style.display = '';
    }
    if (changeBtn) changeBtn.style.display = '';

    if (typeof renderXPBar === 'function') renderXPBar();
    if (typeof renderBadges === 'function') renderBadges();
    if (typeof renderAchievements === 'function') renderAchievements();
    if (typeof renderStreak === 'function') renderStreak();
    if (typeof updateMenuStats === 'function') updateMenuStats('QUIZ_PL_ES');
  }

  /* ---------- Ekran wyboru profilu ---------- */
  function showProfileSelect(){
    const main = document.getElementById('appMain');
    const section = document.getElementById('profileSelect');
    if (main) main.classList.add('hidden');
    if (section) section.classList.remove('hidden');
    renderProfileGrid();
  }

  window.showProfileSelect = showProfileSelect;

  function hideProfileSelect(){
    const main = document.getElementById('appMain');
    const section = document.getElementById('profileSelect');
    if (section) section.classList.add('hidden');
    if (main) main.classList.remove('hidden');
    reloadProfileUI();
  }

  /* ---------- Renderowanie siatki profili ---------- */
  function renderProfileGrid(){
    const grid = document.getElementById('profileGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const profiles = getProfiles();

    profiles.forEach(profile => {
      const card = document.createElement('div');
      card.className = 'profile-card';
      card.innerHTML = `
        <button class="profile-delete-btn" data-id="${profile.id}" title="Usuń profil" aria-label="Usuń profil ${profile.name}">✕</button>
        <span class="profile-avatar">${profile.avatar}</span>
        <span class="profile-name">${profile.name}</span>
      `;
      card.addEventListener('click', (e) => {
        if (e.target.closest('.profile-delete-btn')) return;
        setActiveProfile(profile.id);
        hideProfileSelect();
      });
      card.querySelector('.profile-delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Usunąć profil "${profile.name}"? Wszystkie dane zostaną utracone.`)){
          deleteProfile(profile.id);
          renderProfileGrid();
        }
      });
      grid.appendChild(card);
    });

    if (profiles.length < MAX_PROFILES){
      const addCard = document.createElement('div');
      addCard.className = 'profile-card add-new';
      addCard.innerHTML = `<span class="profile-avatar">➕</span><span class="profile-name">Dodaj profil</span>`;
      addCard.addEventListener('click', () => showProfileForm());
      grid.appendChild(addCard);
    }
  }

  /* ---------- Formularz tworzenia profilu ---------- */
  function showProfileForm(migrationMode){
    const form = document.getElementById('profileForm');
    if (!form) return;
    form.classList.remove('hidden');

    const nameInput = document.getElementById('profileNameInput');
    const avatarGrid = document.getElementById('avatarGrid');
    let selectedAvatar = AVATARS[0];

    if (nameInput) nameInput.value = '';

    if (avatarGrid){
      avatarGrid.innerHTML = '';
      AVATARS.forEach((emoji, i) => {
        const btn = document.createElement('button');
        btn.className = 'avatar-btn' + (i === 0 ? ' active' : '');
        btn.textContent = emoji;
        btn.type = 'button';
        btn.addEventListener('click', () => {
          avatarGrid.querySelectorAll('.avatar-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          selectedAvatar = emoji;
        });
        avatarGrid.appendChild(btn);
      });
    }

    const saveBtn = document.getElementById('profileSaveBtn');
    const cancelBtn = document.getElementById('profileCancelBtn');

    if (saveBtn){
      const newSave = saveBtn.cloneNode(true);
      saveBtn.parentNode.replaceChild(newSave, saveBtn);
      newSave.addEventListener('click', () => {
        const name = document.getElementById('profileNameInput')?.value?.trim();
        if (!name){ alert('Podaj imię!'); return; }
        const profile = createProfile(name, selectedAvatar);
        if (!profile){ alert('Maksymalna liczba profili osiągnięta.'); return; }
        if (migrationMode){
          migrateLegacyData(profile.id);
        }
        form.classList.add('hidden');
        setActiveProfile(profile.id);
        hideProfileSelect();
      });
    }

    if (cancelBtn){
      const newCancel = cancelBtn.cloneNode(true);
      cancelBtn.parentNode.replaceChild(newCancel, cancelBtn);
      newCancel.addEventListener('click', () => {
        form.classList.add('hidden');
        if (migrationMode) renderProfileGrid();
      });
    }
  }

  /* ---------- Migracja — banner ---------- */
  function showMigrationBanner(){
    const banner = document.getElementById('migrationBanner');
    if (!banner) return;
    banner.classList.remove('hidden');

    const importBtn = document.getElementById('migrationImportBtn');
    const resetBtn = document.getElementById('migrationResetBtn');

    if (importBtn){
      const newImport = importBtn.cloneNode(true);
      importBtn.parentNode.replaceChild(newImport, importBtn);
      newImport.addEventListener('click', () => {
        banner.classList.add('hidden');
        showProfileForm(true);
      });
    }

    if (resetBtn){
      const newReset = resetBtn.cloneNode(true);
      resetBtn.parentNode.replaceChild(newReset, resetBtn);
      newReset.addEventListener('click', () => {
        clearLegacyData();
        banner.classList.add('hidden');
      });
    }
  }

  /* ---------- Przycisk "Zmień gracza" ---------- */
  function bindChangePlayerBtn(){
    const btn = document.getElementById('changePlayerBtn');
    if (btn){
      btn.addEventListener('click', () => showProfileSelect());
    }
  }

  /* ---------- Inicjalizacja ---------- */
  function init(){
    bindChangePlayerBtn();

    const activeId = getActiveProfileId();
    if (activeId && getProfiles().some(p => p.id === activeId)){
      window.ACTIVE_PROFILE_ID = activeId;
      reloadProfileUI();
      return;
    }

    if (hasLegacyData() && getProfiles().length === 0){
      showProfileSelect();
      showMigrationBanner();
      return;
    }

    showProfileSelect();
  }

  init();
})();
