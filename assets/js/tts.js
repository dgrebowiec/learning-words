let voices = []; let esVoice = null;
function chooseEsVoice(){
  if (!window.speechSynthesis) return;
  const vList = window.speechSynthesis.getVoices();
  if (vList && vList.length > 0) {
    voices = vList;
    esVoice = voices.find(v => /es-ES|Spanish.*Spain/i.test(v.lang||"")) || 
              voices.find(v => /es-MX/i.test(v.lang||"")) ||
              voices.find(v => /es/i.test(v.lang||""));
  }
}
if ('speechSynthesis' in window){ 
  chooseEsVoice(); 
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = chooseEsVoice;
  }
}
function speakEs(text){
  if (!('speechSynthesis' in window)) return;
  if (!esVoice) chooseEsVoice();
  
  const spokenText = text.replace(/\//g, ', ');
  const u = new SpeechSynthesisUtterance(spokenText); 
  u.lang = (esVoice && esVoice.lang) || 'es-ES'; 
  u.voice = esVoice || null; 
  u.rate = 0.95; 
  u.pitch=1.0;
  
  window.speechSynthesis.cancel(); 
  
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
  
  // Extra resume just before speak (Safari mobile hack)
  setTimeout(() => {
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    window.speechSynthesis.speak(u);
  }, 60);
}
function speak(text) { speakEs(text); }

const AudioFX = (() => {
  let _ctx = null;
  function getCtx() {
    if (!_ctx && (window.AudioContext || window.webkitAudioContext)) {
      _ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (_ctx && _ctx.state === 'suspended') {
      _ctx.resume().catch(() => {});
    }
    return _ctx;
  }
  function tone(freq, dur, type, gain) {
    const ac = getCtx(); if (!ac) return;
    try {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.connect(g); g.connect(ac.destination);
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      g.gain.setValueAtTime(gain || 0.28, ac.currentTime);
      g.gain.linearRampToValueAtTime(0.0001, ac.currentTime + dur);
      osc.start(); 
      osc.stop(ac.currentTime + dur);
      osc.onended = () => {
        g.disconnect();
        osc.disconnect();
      };
    } catch(e) {}
  }
  return {
    init() { 
      const ac = getCtx(); 
      if (ac) {
        if (ac.state === 'suspended') ac.resume();
        // Play silent sound to wake up context
        try {
          const osc = ac.createOscillator();
          const g = ac.createGain();
          osc.connect(g); g.connect(ac.destination);
          g.gain.setValueAtTime(0.0001, ac.currentTime);
          osc.start(); osc.stop(ac.currentTime + 0.01);
        } catch(e){}
      }
    },
    correct() { 
      tone(880, 0.15); setTimeout(() => tone(1320, 0.12), 80); 
      if (typeof flashScreen === 'function') flashScreen('correct');
      if (typeof reactCheerleader === 'function') reactCheerleader('happy');
      if (typeof vibrate === 'function') vibrate([30, 50, 30]);
    },
    wrong() { 
      tone(220, 0.25, 'sawtooth', 0.2); 
      if (typeof flashScreen === 'function') flashScreen('wrong');
      if (typeof reactCheerleader === 'function') reactCheerleader('sad');
      if (typeof vibrate === 'function') vibrate([100, 50, 100]);
    },
    pop() { 
      tone(500, 0.1, 'sine', 0.5); 
      setTimeout(() => tone(200, 0.08, 'sine', 0.3), 20);
    }
  };
})();
function playSound(type) {
  if (AudioFX && typeof AudioFX[type] === 'function') AudioFX[type]();
}
function initAudio() {
  if (AudioFX && AudioFX.init) AudioFX.init();
  if (window.speechSynthesis) {
    if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    // Wake up TTS with a silent utterance
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    u.rate = 10;
    window.speechSynthesis.speak(u);
  }
}
document.addEventListener('click', initAudio);
document.addEventListener('touchstart', initAudio, {passive: true});
document.addEventListener('mousedown', initAudio);
document.addEventListener('touchend', initAudio, {passive: true});
function playSuccessSound() { playSound('correct'); }
function playErrorSound() { playSound('wrong'); }
function spawnConfetti() { if (typeof launchConfetti === 'function') launchConfetti(); }
