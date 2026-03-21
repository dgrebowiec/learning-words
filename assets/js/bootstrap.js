(function(){
  const PARTIALS = [
    {name:'profile-select', path:'assets/html/profile-select.html'},
    {name:'header', path:'assets/html/header.html'},
    {name:'menu', path:'assets/html/menu.html'},
    {name:'flashcards', path:'assets/html/flashcards.html'},
    {name:'wordlist', path:'assets/html/wordlist.html'},
    {name:'quiz', path:'assets/html/quiz.html'},
    {name:'finditem', path:'assets/html/finditem.html'},
    {name:'memory', path:'assets/html/memory.html'},
    {name:'articulos', path:'assets/html/articulos.html'},
    {name:'wordsearch', path:'assets/html/wordsearch.html'},
    {name:'spelling', path:'assets/html/spelling.html'},
    {name:'scramble', path:'assets/html/scramble.html'},
    {name:'repeat', path:'assets/html/repeat.html'},
    {name:'timerace', path:'assets/html/timerace.html'},
    {name:'tamagotchi', path:'assets/html/tamagotchi.html'},
    {name:'balloons', path:'assets/html/balloons.html'},
    {name:'catchword', path:'assets/html/catchword.html'},
    {name:'opposites', path:'assets/html/opposites.html'},
    {name:'footer', path:'assets/html/footer.html'}
  ];

  const SCRIPTS = [
    'assets/js/data.js',
    'assets/js/confetti.js',
    'assets/js/utils.js',
    'assets/js/config.js',
    'assets/js/ui.js',
    'assets/js/tts.js',
    'assets/js/storage.js',
    'assets/js/profiles.js',
    'assets/js/badges.js',
    'assets/js/achievements.js',
    'assets/js/shop.js',
    'assets/js/stats.js',
    'assets/js/navigation.js',
    'assets/js/modes/quiz.js',
    'assets/js/modes/finditem.js',
    'assets/js/modes/flashcards.js',
    'assets/js/modes/wordlist.js',
    'assets/js/modes/memory.js',
    'assets/js/modes/articulos.js',
    'assets/js/modes/wordsearch.js',
    'assets/js/modes/spelling.js',
    'assets/js/modes/scramble.js',
    'assets/js/modes/repeat.js',
    'assets/js/modes/timerace.js',
    'assets/js/modes/tamagotchi.js',
    'assets/js/modes/balloons.js',
    'assets/js/modes/catchword.js',
    'assets/js/modes/opposites.js',
    'assets/js/missions.js',
    'assets/js/app.js',
    'assets/js/tests/layout-smoke-test.js'
  ];

  async function fetchFragment(url){
    const response = await fetch(url, {cache:'no-cache'});
    if (!response.ok){
      throw new Error(`Nie udało się pobrać fragmentu (${response.status})`);
    }
    return await response.text();
  }

  function injectMarkup(placeholder, html){
    placeholder.insertAdjacentHTML('beforebegin', html.trim());
    placeholder.remove();
  }

  function injectFallback(placeholder, message){
    const warning = document.createElement('div');
    warning.className = 'card';
    warning.style.margin = '12px';
    warning.innerHTML = `<p style="margin:0"><strong>Nie udało się załadować fragmentu:</strong> ${message}.<br />Uruchom aplikację z serwera HTTP (np. npm serve) albo sprawdź ścieżki.</p>`;
    placeholder.replaceWith(warning);
  }

  function loadScript(url){
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.defer = false;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Nie udało się załadować skryptu: ${url}`));
      document.body.appendChild(script);
    });
  }

  async function bootstrap(){
    for (const partial of PARTIALS){
      const target = document.querySelector(`[data-partial="${partial.name}"]`);
      if (!target) continue;
      try {
        const html = await fetchFragment(partial.path);
        injectMarkup(target, html);
      } catch (err) {
        console.error(`Błąd podczas ładowania fragmentu ${partial.name}:`, err);
        injectFallback(target, err.message);
      }
    }

    for (const src of SCRIPTS){
      try {
        await loadScript(src);
      } catch (err) {
        console.error(err);
        if (typeof toast === 'function'){
          toast('⚠️ Nie udało się załadować zasobów aplikacji.');
        }
      }
    }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
