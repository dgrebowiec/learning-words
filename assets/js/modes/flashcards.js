(function(){
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
  document.getElementById('fcGamesBtn').addEventListener('click', ()=> showModeSelect());

  renderFlashcard();

  window.renderFlashcard = renderFlashcard;
})();

