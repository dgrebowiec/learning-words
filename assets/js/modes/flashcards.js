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

  renderFlashcard();

  window.renderFlashcard = renderFlashcard;
})();
