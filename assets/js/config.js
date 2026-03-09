const LEVELS = { LATWY:{options:2,len:9}, SREDNI:{options:3,len:12}, TRUDNY:{options:4,len:15} };
const LEVEL_NAMES = { LATWY:'Łatwy', SREDNI:'Średni', TRUDNY:'Trudny' };
const ALL_SECTIONS = ['menu','flashcards','quiz','finditem','memory','articulos','wordsearch','spelling','scramble','repeat','timerace'];
let currentLevel = 'LATWY';
let currentCat = 'FRUITS';
let menuStep = 1;

function datasetFor(cat){
  if (cat === 'MIXED'){
    let all = [];
    Object.entries(CATEGORIES).forEach(([k,v]) => { if (k !== 'MIXED' && v.data) all = all.concat(v.data); });
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
