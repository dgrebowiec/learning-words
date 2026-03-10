history.replaceState({ sectionId: 'menu', step: 1 }, '', '#menu-step1');
showMenuStep(1, false);
updateMenuStats('QUIZ_PL_ES');
renderBadges();
renderAchievements();
renderShop();
runFunctionalTests();
