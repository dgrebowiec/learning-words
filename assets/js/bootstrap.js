(function(){
  const PARTIALS = [
    {name:'header', path:'assets/html/header.html'},
    {name:'menu', path:'assets/html/menu.html'},
    {name:'flashcards', path:'assets/html/flashcards.html'},
    {name:'quiz', path:'assets/html/quiz.html'},
    {name:'finditem', path:'assets/html/finditem.html'},
    {name:'footer', path:'assets/html/footer.html'}
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

    try {
      await loadScript('assets/js/app.js');
      await loadScript('assets/js/tests/layout-smoke-test.js');
    } catch (err) {
      console.error(err);
      if (typeof toast === 'function'){
        toast('⚠️ Nie udało się załadować zasobów aplikacji.');
      }
    }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
