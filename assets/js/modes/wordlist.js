function startWordList() {
    const container = document.getElementById('wordlistContainer');
    if (!container) return;
    
    container.innerHTML = '';
    const pool = dataset();
    
    const title = document.getElementById('wordlistTitle');
    const cat = CATEGORIES[currentCat];
    if (title && cat) {
        title.innerHTML = `<span>${cat.emoji}</span> ${cat.label}`;
    }

    pool.forEach(word => {
        const card = document.createElement('div');
        card.className = 'wordlist-card card';
        
        let visualHtml = '';
        if (word.img) {
            visualHtml = `<img src="${word.img}" alt="${word.pl}" class="wordlist-img">`;
        } else if (word.emoji) {
            visualHtml = `<div class="wordlist-emoji">${word.emoji}</div>`;
        }

        const articleHtml = word.article ? `<span class="wordlist-article">${word.article}</span> ` : '';

        card.innerHTML = `
            <div class="wordlist-row">
                <div class="wordlist-visual-container">${visualHtml}</div>
                <div class="wordlist-info">
                    <div class="wordlist-es">${articleHtml}${word.es}</div>
                    <div class="wordlist-pl">${word.pl}</div>
                </div>
                <button class="btn speak-btn" aria-label="Słuchaj">🔊</button>
            </div>
        `;

        const playSpeak = (e) => {
            if (e) e.stopPropagation();
            speakEs(word.es);
            if (typeof AudioFX !== 'undefined' && AudioFX.pop) AudioFX.pop();
        };

        card.querySelector('.speak-btn').addEventListener('click', playSpeak);
        card.addEventListener('click', playSpeak);

        container.appendChild(card);
    });
}
