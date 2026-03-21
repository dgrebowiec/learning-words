const LEVELS = { LATWY:{options:2,len:9}, SREDNI:{options:3,len:12}, TRUDNY:{options:4,len:15} };
const LEVEL_NAMES = { LATWY:'Łatwy', SREDNI:'Średni', TRUDNY:'Trudny' };
const ALL_SECTIONS = ['menu','flashcards','quiz','finditem','memory','articulos','wordsearch','spelling','scramble','repeat','timerace','tamagotchi','balloons','catchword'];
let currentLevel = 'LATWY';
let currentCat = 'FRUITS';
let menuStep = 1;

function datasetFor(cat){
  if (cat === 'NUMEROS') {
    let range = 20;
    if (currentLevel === 'SREDNI') range = 50;
    if (currentLevel === 'TRUDNY') range = 101;
    return NUMEROS.filter(n => n.val < range).map(n => ({
      ...n,
      emoji: n.val.toString() // Używamy liczby jako emoji dla celów wizualnych w innych trybach
    }));
  }
  if (cat === 'MIXED'){
    let all = [];
    Object.entries(CATEGORIES).forEach(([k,v]) => { 
      if (k !== 'MIXED' && k !== 'NUMEROS' && v.data) all = all.concat(v.data); 
    });
    return all;
  }
  const entry = CATEGORIES[cat];
  return (entry && entry.data) ? entry.data : FRUITS;
}
function dataset(){ return datasetFor(currentCat); }

function catLabel(cat){
  const entry = CATEGORIES[cat];
  return entry ? entry.label : cat;
}
