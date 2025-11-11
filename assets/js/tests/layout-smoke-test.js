(function(){
  const requiredIds = ['menu','flashcards','quiz','finditem','badgeShelf','achievementsCard','starProgressBar','recentRewardCard','qSumReview','qMistakeList','qMistakeSuccess','qMistakeInfo','qMistakeCount','qSummaryTitle'];
  const missing = requiredIds.filter(id => !document.getElementById(id));
  const hasConsole = typeof console !== 'undefined';
  if (hasConsole && console.groupCollapsed){
    console.groupCollapsed('Testy struktury layoutu');
    requiredIds.forEach(id => {
      const ok = !missing.includes(id);
      console.log(`${ok ? '✅' : '❌'} #${id} ${ok ? 'znaleziony' : 'brak w DOM'}`);
    });
    console.groupEnd();
  } else if (hasConsole){
    requiredIds.forEach(id => {
      const ok = !missing.includes(id);
      console.log((ok ? '✅' : '❌') + ` #${id} ${ok ? 'znaleziony' : 'brak w DOM'}`);
    });
  }
  if (missing.length && typeof toast === 'function'){
    toast('⚠️ Brakuje elementów interfejsu – sprawdź konsolę.');
  }
})();
