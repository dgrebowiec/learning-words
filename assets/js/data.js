const FRUITS = [
  {img:'assets/img/fruits/jablko.jpg',      pl:'jabłko',      es:'manzana',    article:'la'},
  {img:'assets/img/fruits/truskawka.jpg',   pl:'truskawka',   es:'fresa',      article:'la'},
  {img:'assets/img/fruits/pomarancza.jpg',  pl:'pomarańcza',  es:'naranja',    article:'la'},
  {img:'assets/img/fruits/mango.jpg',       pl:'mango',       es:'mango',      article:'el'},
  {img:'assets/img/fruits/gruszka.webp',    pl:'gruszka',     es:'pera',       article:'la'},
  {img:'assets/img/fruits/papaja.jpg',      pl:'papaja',      es:'papaya',     article:'la'},
  {img:'assets/img/fruits/ananas.jpg',      pl:'ananas',      es:'piña',       article:'la'},
  {img:'assets/img/fruits/banan.jpg',       pl:'banan',       es:'plátano',    article:'el'},
  {img:'assets/img/fruits/arbuz.jpg',       pl:'arbuz',       es:'sandía',     article:'la'},
  {img:'assets/img/fruits/kiwi.jpg',        pl:'kiwi',        es:'kiwi',       article:'el'},
  {img:'assets/img/fruits/brzoskwinia.jpg', pl:'brzoskwinia', es:'durazno',    article:'el'},
  {img:'assets/img/fruits/winogrono.jpg',   pl:'winogrono',   es:'uva / uvas', article:'la'},
  {img:'assets/img/fruits/granat.jpg',      pl:'granat',      es:'granada',    article:'la'},
  {img:'assets/img/fruits/kokos.jpg',       pl:'kokos',       es:'coco',       article:'el'},
  {img:'assets/img/fruits/melon.jpg',       pl:'melon',       es:'melón',      article:'el'},
  {img:'assets/img/fruits/jezyna.jpg',      pl:'jeżyna',      es:'mora',       article:'la'}
];

const VEGGIES = [
  {img:'assets/img/veggies/karczoch.jpg',    pl:'karczoch',    es:'alcachofa',        article:'la'},
  {img:'assets/img/veggies/seler.jpg',       pl:'seler',       es:'apio',             article:'el'},
  {img:'assets/img/veggies/batat.jpg',       pl:'batat',       es:'batata',           article:'la'},
  {img:'assets/img/veggies/baklazan.jpg',    pl:'bakłażan',    es:'berenjena',        article:'la'},
  {img:'assets/img/veggies/brokul.jpg',      pl:'brokuł',      es:'brócoli',          article:'el'},
  {img:'assets/img/veggies/cukinia.jpg',     pl:'cukinia',     es:'calabacín',        article:'el'},
  {img:'assets/img/veggies/cebula.jpg',      pl:'cebula',      es:'cebolla',          article:'la'},
  {img:'assets/img/veggies/pieczarki.jpg',   pl:'pieczarki',   es:'champiñones',      article:'el'},
  {img:'assets/img/veggies/kapusta.jpg',     pl:'kapusta',     es:'col',              article:'la'},
  {img:'assets/img/veggies/brukselka.jpg',   pl:'brukselka',   es:'coles de Bruselas',article:'las'},
  {img:'assets/img/veggies/kalafior.jpg',    pl:'kalafior',    es:'coliflor',         article:'la'},
  {img:'assets/img/veggies/szparagi.jpg',    pl:'szparagi',    es:'espárragos',       article:'el'},
  {img:'assets/img/veggies/groszek.jpg',     pl:'groszek',     es:'guisantes',        article:'el'},
  {img:'assets/img/veggies/fasolka.jpg',     pl:'fasolka',     es:'judías',           article:'las'},
  {img:'assets/img/veggies/salata.jpg',      pl:'sałata',      es:'lechuga',          article:'la'},
  {img:'assets/img/veggies/kukurydza.jpg',   pl:'kukurydza',   es:'maíz',             article:'el'},
  {img:'assets/img/veggies/ziemniak.jpg',    pl:'ziemniak',    es:'patata / papa',    article:'la'},
  {img:'assets/img/veggies/ogorek.jpg',      pl:'ogórek',      es:'pepino',           article:'el'},
  {img:'assets/img/veggies/papryka.jpg',     pl:'papryka',     es:'pimiento',         article:'el'},
  {img:'assets/img/veggies/rzodkiewka.jpg',  pl:'rzodkiewka',  es:'rábano',           article:'el'},
  {img:'assets/img/veggies/burak.jpg',       pl:'burak',       es:'remolacha',        article:'la'},
  {img:'assets/img/veggies/pomidor.jpg',     pl:'pomidor',     es:'tomate',           article:'el'},
  {img:'assets/img/veggies/marchewka.jpg',   pl:'marchewka',   es:'zanahoria',        article:'la'},
  {img:'assets/img/veggies/dynia.jpg',       pl:'dynia',       es:'calabaza',         article:'la'}
];

const EMOCIONES = [
  {emoji:'😊', pl:'szczęśliwy',    es:'feliz'},
  {emoji:'😢', pl:'smutny',        es:'triste'},
  {emoji:'😨', pl:'przestraszony', es:'asustado'},
  {emoji:'😤', pl:'zdenerwowany',  es:'disgustado'},
  {emoji:'😲', pl:'zaskoczony',    es:'sorprendido'},
  {emoji:'😡', pl:'rozgniewany',   es:'enojado'}
];

const PRONOMBRES = [
  {emoji:'🙋', pl:'ja',   es:'yo'},
  {emoji:'🫵', pl:'ty',   es:'tú'},
  {emoji:'👨', pl:'on',   es:'él'},
  {emoji:'👩', pl:'ona',  es:'ella'}
];

const COLORES = [
  {emoji:'🔴', pl:'czerwony',     es:'rojo',     article:'el'},
  {emoji:'🔵', pl:'niebieski',    es:'azul',     article:'el'},
  {emoji:'🟢', pl:'zielony',      es:'verde',    article:'el'},
  {emoji:'🟡', pl:'żółty',        es:'amarillo', article:'el'},
  {emoji:'🟠', pl:'pomarańczowy', es:'naranja',  article:'el'},
  {emoji:'🟣', pl:'fioletowy',    es:'morado',   article:'el'},
  {emoji:'🟤', pl:'brązowy',      es:'marrón',   article:'el'},
  {emoji:'⚫', pl:'czarny',       es:'negro',    article:'el'},
  {emoji:'⚪', pl:'biały',        es:'blanco',   article:'el'},
  {emoji:'🩷', pl:'różowy',       es:'rosa',     article:'el'}
];

const MATERIAL_ESCOLAR = [
  {emoji:'✏️', pl:'ołówek',       es:'lápiz',           article:'el'},
  {emoji:'📓', pl:'zeszyt',       es:'cuaderno',        article:'el'},
  {emoji:'✂️', pl:'nożyczki',     es:'tijeras',         article:'las'},
  {emoji:'🎒', pl:'plecak',       es:'mochila',         article:'la'},
  {emoji:'🖊️', pl:'długopis',     es:'bolígrafo',       article:'el'},
  {emoji:'🔧', pl:'temperówka',   es:'sacapuntas',      article:'el'},
  {emoji:'📖', pl:'książka',      es:'libro',           article:'el'},
  {emoji:'📎', pl:'spinacz',      es:'clip',            article:'el'},
  {emoji:'🗂️', pl:'zszywacz',     es:'engrapadora',     article:'la'},
  {emoji:'📄', pl:'papier',       es:'papel',           article:'el'},
  {emoji:'🧽', pl:'gumka',        es:'borrador',        article:'el'},
  {emoji:'🧴', pl:'klej',         es:'pegamento',       article:'el'},
  {emoji:'🖍️', pl:'zakreślacz',   es:'marcador',        article:'el'},
  {emoji:'🗑️', pl:'kosz',         es:'papelera',        article:'la'},
  {emoji:'📏', pl:'linijka',      es:'regla',           article:'la'},
  {emoji:'🧳', pl:'piórnik',      es:'estuche',         article:'el'}
];

const HALLOWEEN = [
  {emoji:'🎃', pl:'dynia',        es:'calabaza',    article:'la'},
  {emoji:'🧛', pl:'wampir',       es:'vampiro',     article:'el'},
  {emoji:'💀', pl:'szkielet',     es:'esqueleto',   article:'el'},
  {emoji:'🧙', pl:'czarownica',   es:'bruja',       article:'la'},
  {emoji:'🕷️', pl:'pająk',        es:'araña',       article:'la'},
  {emoji:'🧟', pl:'mumia',        es:'momia',       article:'la'},
  {emoji:'👻', pl:'duch',         es:'fantasma',    article:'el'},
  {emoji:'☠️', pl:'czaszka',      es:'calavera',    article:'la'},
  {emoji:'🦇', pl:'nietoperz',    es:'murciélago',  article:'el'},
  {emoji:'🕯️', pl:'świeca',       es:'vela',        article:'la'},
  {emoji:'🕸️', pl:'pajęczyna',    es:'telaraña',    article:'la'},
  {emoji:'🧹', pl:'miotła',       es:'escoba',      article:'la'},
  {emoji:'⚰️', pl:'trumna',       es:'ataúd',       article:'el'},
  {emoji:'🦴', pl:'kości',        es:'huesos',      article:'los'},
  {emoji:'🍬', pl:'cukierek',     es:'dulce',       article:'el'},
  {emoji:'🧛‍♂️', pl:'Drakula',      es:'drácula',     article:'el'}
];

const NAVIDAD = [
  {emoji:'🎄', pl:'choinka',            es:'árbol de navidad',  article:'el'},
  {emoji:'🎁', pl:'prezent',            es:'regalo',            article:'el'},
  {emoji:'⭐', pl:'gwiazda',            es:'estrella',          article:'la'},
  {emoji:'🔔', pl:'dzwonek',            es:'campana',           article:'la'},
  {emoji:'🛷', pl:'sanie',              es:'trineo',            article:'el'},
  {emoji:'🦌', pl:'renifer',            es:'reno',              article:'el'},
  {emoji:'🐪', pl:'wielbłąd',           es:'camello',           article:'el'},
  {emoji:'🎅', pl:'Święty Mikołaj',     es:'papa noel',         article:'el'},
  {emoji:'👑', pl:'Trzej Królowie',     es:'reyes magos',       article:'los'},
  {emoji:'⛄', pl:'bałwan',             es:'muñeco de nieve',   article:'el'},
  {emoji:'🎉', pl:'Boże Narodzenie',    es:'navidad',           article:'la'},
  {emoji:'🏘️', pl:'szopka',             es:'belén',             article:'el'}
];

const OTONO = [
  {emoji:'🍂', pl:'liść',              es:'hoja',            article:'la'},
  {emoji:'🌰', pl:'żołędzie',          es:'bellotas',        article:'las'},
  {emoji:'🍄', pl:'grzyby',            es:'setas',           article:'las'},
  {emoji:'🦊', pl:'lis',               es:'zorro',           article:'el'},
  {emoji:'🌧️', pl:'deszcz',            es:'lluvia',          article:'la'},
  {emoji:'🎃', pl:'dynia',             es:'calabaza',        article:'la'},
  {emoji:'🥾', pl:'buty',              es:'botas',           article:'las'},
  {emoji:'🍫', pl:'czekolada',         es:'chocolate',       article:'el'},
  {emoji:'🦔', pl:'jeż',              es:'erizo',           article:'el'},
  {emoji:'🧑‍🌾', pl:'strach na wróble', es:'espantapájaros',  article:'el'},
  {emoji:'🌲', pl:'szyszki',           es:'piñas',           article:'las'},
  {emoji:'🧥', pl:'sweter',            es:'jersey',          article:'el'}
];

const INVIERNO = [
  {emoji:'❄️', pl:'śnieg',          es:'nieve',           article:'la'},
  {emoji:'🏠', pl:'igloo',          es:'iglú',            article:'el'},
  {emoji:'❄️', pl:'płatek śniegu',  es:'copo de nieve',   article:'el'},
  {emoji:'🐧', pl:'pingwin',        es:'pingüino',        article:'el'},
  {emoji:'⛄', pl:'bałwan',         es:'muñeco de nieve', article:'el'},
  {emoji:'🧢', pl:'czapka',         es:'gorro',           article:'el'},
  {emoji:'🧣', pl:'szalik',         es:'bufanda',         article:'la'},
  {emoji:'🧤', pl:'rękawiczki',     es:'guantes',         article:'los'},
  {emoji:'🧥', pl:'kurtka',         es:'abrigo',          article:'el'},
  {emoji:'🥾', pl:'buty',           es:'botas',           article:'las'},
  {emoji:'🥶', pl:'zimno',          es:'frío',            article:'el'},
  {emoji:'🧊', pl:'sopel',          es:'carámbano',       article:'el'}
];

const ESTACIONES = [
  {emoji:'🌸', pl:'wiosna', es:'primavera', article:'la'},
  {emoji:'☀️', pl:'lato',   es:'verano',    article:'el'},
  {emoji:'🍂', pl:'jesień', es:'otoño',     article:'el'},
  {emoji:'❄️', pl:'zima',   es:'invierno',  article:'el'}
];

const CATEGORIES = {
  FRUITS:          {label:'Owoce',            emoji:'🍓', data:FRUITS},
  VEGGIES:         {label:'Warzywa',          emoji:'🥦', data:VEGGIES},
  EMOCIONES:       {label:'Emocje',           emoji:'😊', data:EMOCIONES},
  PRONOMBRES:      {label:'Zaimki',           emoji:'👤', data:PRONOMBRES},
  COLORES:         {label:'Kolory',           emoji:'🎨', data:COLORES},
  MATERIAL_ESCOLAR:{label:'Przybory szkolne', emoji:'🎒', data:MATERIAL_ESCOLAR},
  HALLOWEEN:       {label:'Halloween',        emoji:'🎃', data:HALLOWEEN},
  NAVIDAD:         {label:'Boże Narodzenie',  emoji:'🎄', data:NAVIDAD},
  OTONO:           {label:'Jesień',           emoji:'🍂', data:OTONO},
  INVIERNO:        {label:'Zima',             emoji:'❄️', data:INVIERNO},
  ESTACIONES:      {label:'Pory roku',        emoji:'🌸', data:ESTACIONES},
  MIXED:           {label:'Wszystko',         emoji:'🌍', data:null}
};

const XP_LEVELS = [
  {level:1, label:'Początkujący', minXp:0,    emoji:'🌱'},
  {level:2, label:'Uczeń',       minXp:100,  emoji:'📚'},
  {level:3, label:'Zaawansowany', minXp:300,  emoji:'🎓'},
  {level:4, label:'Mistrz',      minXp:600,  emoji:'🏆'},
  {level:5, label:'Legenda',     minXp:1000, emoji:'👑'}
];
