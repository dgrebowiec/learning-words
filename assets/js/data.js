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
  {img:'assets/img/material_escolar/temperowka.jpg', pl:'temperówka',   es:'sacapuntas',      article:'el'},
  {emoji:'📖', pl:'książka',      es:'libro',           article:'el'},
  {emoji:'📎', pl:'spinacz',      es:'clip',            article:'el'},
  {emoji:'🖇️', pl:'zszywacz',     es:'engrapadora',     article:'la'},
  {emoji:'📄', pl:'papier',       es:'papel',           article:'el'},
  {emoji:'🧼', pl:'gumka',        es:'borrador',        article:'el'},
  {emoji:'💧', pl:'klej',         es:'pegamento',       article:'el'},
  {emoji:'🖌️', pl:'zakreślacz',   es:'marcador',        article:'el'},
  {emoji:'🗑️', pl:'kosz',         es:'papelera',        article:'la'},
  {emoji:'📏', pl:'linijka',      es:'regla',           article:'la'},
  {emoji:'👝', pl:'piórnik',      es:'estuche',         article:'el'}
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
  {img:'assets/img/navidad/renifer.jpg', pl:'renifer',            es:'reno',              article:'el'},
  {emoji:'🐪', pl:'wielbłąd',           es:'camello',           article:'el'},
  {emoji:'🎅', pl:'Święty Mikołaj',     es:'papa noel',         article:'el'},
  {img:'assets/img/navidad/trzej_krolowie.jpg', pl:'Trzej Królowie',     es:'reyes magos',       article:'los'},
  {emoji:'⛄', pl:'bałwan',             es:'muñeco de nieve',   article:'el'},
  {img:'assets/img/navidad/boze_narodzenie.jpg', pl:'Boże Narodzenie',    es:'navidad',           article:'la'},
  {img:'assets/img/navidad/szopka.jpg', pl:'szopka',             es:'belén',             article:'el'}
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
  {img:'assets/img/otono/strach_na_wroble.jpg', pl:'strach na wróble', es:'espantapájaros',  article:'el'},
  {img:'assets/img/otono/szyszki.webb', pl:'szyszki',           es:'piñas',           article:'las'},
  {img:'assets/img/otono/sweter.jpg', pl:'sweter',            es:'jersey',          article:'el'}
];

const INVIERNO = [
  {img:'assets/img/invierno/snieg.jpg', pl:'śnieg',          es:'nieve',           article:'la'},
  {img:'assets/img/invierno/igloo.jpg', pl:'igloo',          es:'iglú',            article:'el'},
  {emoji:'❄️', pl:'płatek śniegu',  es:'copo de nieve',   article:'el'},
  {emoji:'🐧', pl:'pingwin',        es:'pingüino',        article:'el'},
  {emoji:'⛄', pl:'bałwan',         es:'muñeco de nieve', article:'el'},
  {emoji:'🧢', pl:'czapka',         es:'gorro',           article:'el'},
  {emoji:'🧣', pl:'szalik',         es:'bufanda',         article:'la'},
  {emoji:'🧤', pl:'rękawiczki',     es:'guantes',         article:'los'},
  {img:'assets/img/invierno/kurtka.jpg', pl:'kurtka',         es:'abrigo',          article:'el'},
  {emoji:'🥾', pl:'buty',           es:'botas',           article:'las'},
  {emoji:'🥶', pl:'zimno',          es:'frío',            article:'el'},
  {img:'assets/img/invierno/sopel.jpg', pl:'sopel',          es:'carámbano',       article:'el'}
];

const ESTACIONES = [
  {emoji:'🌸', pl:'wiosna', es:'primavera', article:'la'},
  {emoji:'☀️', pl:'lato',   es:'verano',    article:'el'},
  {emoji:'🍂', pl:'jesień', es:'otoño',     article:'el'},
  {emoji:'❄️', pl:'zima',   es:'invierno',  article:'el'}
];

const NUMEROS = [
  {val:0,  pl:'zero',       es:'cero'},
  {val:1,  pl:'jeden',      es:'uno'},
  {val:2,  pl:'dwa',        es:'dos'},
  {val:3,  pl:'trzy',       es:'tres'},
  {val:4,  pl:'cztery',     es:'cuatro'},
  {val:5,  pl:'pięć',       es:'cinco'},
  {val:6,  pl:'sześć',      es:'seis'},
  {val:7,  pl:'siedem',     es:'siete'},
  {val:8,  pl:'osiem',      es:'ocho'},
  {val:9,  pl:'dziewięć',   es:'nueve'},
  {val:10, pl:'dziesięć',   es:'diez'},
  {val:11, pl:'jedenaście', es:'once'},
  {val:12, pl:'dwanaście',  es:'doce'},
  {val:13, pl:'trzynaście', es:'trece'},
  {val:14, pl:'czternaście',es:'catorce'},
  {val:15, pl:'piętnaście', es:'quince'},
  {val:16, pl:'szesnaście',  es:'dieciséis'},
  {val:17, pl:'siedemnaście',es:'diecisiete'},
  {val:18, pl:'osiemnaście', es:'dieciocho'},
  {val:19, pl:'dziewiętnaście',es:'diecinueve'},
  {val:20, pl:'dwadzieścia',  es:'veinte'},
  {val:30, pl:'trzydzieści',  es:'treinta'},
  {val:40, pl:'czterdzieści', es:'cuarenta'},
  {val:50, pl:'pięćdziesiąt', es:'cincuenta'},
  {val:60, pl:'sześćdziesiąt',es:'sesenta'},
  {val:70, pl:'siedemdziesiąt',es:'setenta'},
  {val:80, pl:'osiemdziesiąt',es:'ochenta'},
  {val:90, pl:'dziewięćdziesiąt',es:'noventa'},
  {val:100,pl:'sto',          es:'cien'}
];

const OPUESTOS = [
  {es:'calor', pl:'gorąco', img:'assets/img/opuestos/goraco.jpg', opposite:'frío'},
  {es:'frío', pl:'zimno', img:'assets/img/opuestos/zimno.jpg', opposite:'calor'},
  {es:'grande', pl:'duży', img:'assets/img/opuestos/duzy.jpg', opposite:'pequeño'},
  {es:'pequeño', pl:'mały', img:'assets/img/opuestos/maly.jpg', opposite:'grande'},
  {es:'rápido', pl:'szybki', img:'assets/img/opuestos/szybki.jpg', opposite:'lento'},
  {es:'lento', pl:'wolny', img:'assets/img/opuestos/wolny.jpg', opposite:'rápido'},
  {es:'encendido', pl:'włączony', img:'assets/img/opuestos/wlaczony.jpg', opposite:'apagado'},
  {es:'apagado', pl:'wyłączony',  img:'assets/img/opuestos/wylaczony.jpg', opposite:'encendido'},
  {es:'arriba', pl:'na górze', emoji:'⬆️', opposite:'abajo'},
  {es:'abajo', pl:'na dole', emoji:'⬇️', opposite:'arriba'},
  {es:'duro', pl:'twardy', img:'assets/img/opuestos/twardy.jpg', opposite:'blando'},
  {es:'blando', pl:'miękki', img:'assets/img/opuestos/miekki.jpg', opposite:'duro'},
  {es:'feliz', pl:'szczęśliwy', emoji:'😊', opposite:'triste'},
  {es:'triste', pl:'smutny', emoji:'😢', opposite:'feliz'},
  {es:'largo', pl:'długi', img:'assets/img/opuestos/dlugi.png', opposite:'corto'},
  {es:'corto', pl:'krótki', img:'assets/img/opuestos/krotki.png', opposite:'largo'},
  {es:'abierto', pl:'otwarty', emoji:'🔓', opposite:'cerrado'},
  {es:'cerrado', pl:'zamknięty', emoji:'🔒', opposite:'abierto'},
  {es:'alto', pl:'wysoki', img:'assets/img/opuestos/wysoki.png', opposite:'bajo'},
  {es:'bajo', pl:'niski', img:'assets/img/opuestos/niski.png', opposite:'alto'},
  {es:'fuera', pl:'na zewnątrz', img:'assets/img/opuestos/nazewnatrz.jpg', opposite:'dentro'},
  {es:'dentro', pl:'wewnątrz', img:'assets/img/opuestos/wsrodku.jpg', opposite:'fuera'},
  {es:'lleno', pl:'pełny', img:'assets/img/opuestos/pelny.jpg', opposite:'vacío'},
  {es:'vacío', pl:'pusty', img:'assets/img/opuestos/pusty.jpg', opposite:'lleno'},
  {es:'cerca', pl:'blisko', img:'assets/img/opuestos/blisko.jpg', opposite:'lejos'},
  {es:'lejos', pl:'daleko', img:'assets/img/opuestos/daleko.jpg', opposite:'cerca'},
  {es:'adelante', pl:'przed', img:'assets/img/opuestos/przed.jpg', opposite:'atrás'},
  {es:'atrás', pl:'zza', img:'assets/img/opuestos/zza.jpg', opposite:'adelante'},
  {es:'entera', pl:'cała', img:'assets/img/opuestos/cala.jpg', opposite:'partida'},
  {es:'partida', pl:'przekrojona', img:'assets/img/opuestos/kawalek.jpg', opposite:'entera'},
  {es:'de pie', pl:'na stojąco', img:'assets/img/opuestos/nastojaco.jpg', opposite:'sentada'},
  {es:'sentada', pl:'na siedząco',img:'assets/img/opuestos/nasiedzaco.jpg', opposite:'de pie'},
  {es:'limpio', pl:'czysty', img:'assets/img/opuestos/czysty.jpg', opposite:'sucio'},
  {es:'sucio', pl:'brudny', img:'assets/img/opuestos/brudny.jpg', opposite:'limpio'}
];

const RECIENTES = [
  {es:'calor', pl:'gorąco', emoji:'🔥', opposite:'frío'},
  {es:'frío', pl:'zimno', emoji:'❄️', opposite:'calor'},
  {es:'grande', pl:'duży', emoji:'🐘', opposite:'pequeño'},
  {es:'pequeño', pl:'mały', emoji:'🐭', opposite:'grande'},
  {es:'rápido', pl:'szybki', emoji:'🏃', opposite:'lento'},
  {es:'lento', pl:'wolny', emoji:'🐢', opposite:'rápido'},
  {es:'encendido', pl:'włączony', emoji:'💡', opposite:'apagado'},
  {es:'apagado', pl:'wyłączony', emoji:'🔌', opposite:'encendido'},
  {es:'arriba', pl:'na górze', emoji:'⬆️', opposite:'abajo'},
  {es:'abajo', pl:'na dole', emoji:'⬇️', opposite:'arriba'},
  {es:'duro', pl:'twardy', emoji:'🪨', opposite:'blando'},
  {es:'blando', pl:'miękki', emoji:'🪶', opposite:'duro'},
  {es:'feliz', pl:'szczęśliwy', emoji:'😊', opposite:'triste'},
  {es:'triste', pl:'smutny', emoji:'😢', opposite:'feliz'},
  {es:'largo', pl:'długi', emoji:'📏', opposite:'corto'},
  {es:'corto', pl:'krótki', emoji:'✂️', opposite:'largo'},
  {es:'abierto', pl:'otwarty', emoji:'🔓', opposite:'cerrado'},
  {es:'cerrado', pl:'zamknięty', emoji:'🔒', opposite:'abierto'},
  {es:'alto', pl:'wysoki', emoji:'🦒', opposite:'bajo'},
  {es:'bajo', pl:'niski', emoji:'🐕', opposite:'alto'},
  {es:'fuera', pl:'na zewnątrz', emoji:'🏠', opposite:'dentro'},
  {es:'dentro', pl:'wewnątrz', emoji:'📥', opposite:'fuera'},
  {es:'lleno', pl:'pełny', emoji:'🥛', opposite:'vacío'},
  {es:'vacío', pl:'pusty', emoji:'🫙', opposite:'lleno'},
  {es:'cerca', pl:'blisko', emoji:'📍', opposite:'lejos'},
  {es:'lejos', pl:'daleko', emoji:'🔭', opposite:'cerca'},
  {es:'adelante', pl:'do przodu', emoji:'⏩', opposite:'atrás'},
  {es:'atrás', pl:'do tyłu', emoji:'⏪', opposite:'adelante'},
  {es:'entera', pl:'cała', emoji:'🍊', opposite:'partida'},
  {es:'partida', pl:'przecięta', emoji:'🔪', opposite:'entera'},
  {es:'de pie', pl:'na stojąco', emoji:'🧍', opposite:'sentada'},
  {es:'sentada', pl:'na siedząco', emoji:'🪑', opposite:'de pie'},
  {es:'limpio', pl:'czysty', emoji:'✨', opposite:'sucio'},
  {es:'sucio', pl:'brudny', emoji:'💩', opposite:'limpio'}
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
  NUMEROS:         {label:'Liczebniki',       emoji:'1️⃣', data:NUMEROS},
  OPUESTOS:        {label:'Przeciwieństwa',   emoji:'🌗', data:OPUESTOS},
  RECIENTES:       {label:'Ostatnio dodane',  emoji:'🆕', data:RECIENTES},
  MIXED:           {label:'Wszystko',         emoji:'🌍', data:null}
};

const XP_LEVELS = [
  {level:1, label:'Początkujący', minXp:0,    emoji:'🌱'},
  {level:2, label:'Uczeń',       minXp:100,  emoji:'📚'},
  {level:3, label:'Zaawansowany', minXp:300,  emoji:'🎓'},
  {level:4, label:'Mistrz',      minXp:600,  emoji:'🏆'},
  {level:5, label:'Legenda',     minXp:1000, emoji:'👑'}
];
