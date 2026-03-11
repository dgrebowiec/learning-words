let voices = []; let esVoice = null;
function chooseEsVoice(){
  voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  esVoice = voices.find(v => /es-ES|Spanish.*Spain/i.test(v.lang||"")) || voices.find(v => /es/i.test(v.lang||""));
}
if ('speechSynthesis' in window){ chooseEsVoice(); window.speechSynthesis.onvoiceschanged = chooseEsVoice; }
function speakEs(text){
  if (!('speechSynthesis' in window)) return;
  const spokenText = text.replace(/\//g, ', ');
  const u = new SpeechSynthesisUtterance(spokenText); u.lang = (esVoice && esVoice.lang) || 'es-ES'; u.voice = esVoice || null; u.rate = 0.95; u.pitch=1.0;
  window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
}

const AudioFX = (() => {
  let _ctx = null;
  function getCtx() {
    if (!_ctx && window.AudioContext) _ctx = new AudioContext();
    return _ctx;
  }
  function tone(freq, dur, type, gain) {
    const ac = getCtx(); if (!ac) return;
    try {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.connect(g); g.connect(ac.destination);
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(gain || 0.28, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
      osc.start(); osc.stop(ac.currentTime + dur);
    } catch(e) {}
  }
  return {
    correct() { 
      tone(880, 0.13); setTimeout(() => tone(1320, 0.11), 70); 
      if (typeof flashScreen === 'function') flashScreen('correct');
      if (typeof reactCheerleader === 'function') reactCheerleader('happy');
      if (typeof vibrate === 'function') vibrate([30, 50, 30]);
    },
    wrong() { 
      tone(200, 0.22, 'sawtooth', 0.18); 
      if (typeof flashScreen === 'function') flashScreen('wrong');
      if (typeof reactCheerleader === 'function') reactCheerleader('sad');
      if (typeof vibrate === 'function') vibrate([100, 50, 100]);
    },
    pop() { 
      tone(600, 0.05, 'sine', 0.1); 
    }
  };
})();
