const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const shuffle = a => { for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (arr,n) => { const pool=[...arr]; const out=[]; while(n-- > 0 && pool.length) out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]); return out; };
