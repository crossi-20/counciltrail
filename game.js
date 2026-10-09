// Council Trail, Chapter I: the roads to Nicaea.
// Screens are plain DOM; scenes are drawn on small canvases and scaled up by
// whole numbers so the pixel art stays crisp. Content lives in data.js.
(function () {
  'use strict';

  const CH = window.CHAPTER;
  const app = document.getElementById('app');
  const modal = document.getElementById('modal');
  const captionBar = document.getElementById('caption');
  const rotateNotice = document.getElementById('rotate');
  rotateNotice.addEventListener('click', () => { rotateNotice.hidden = true; });

  // ---------------------------------------------------------------- art
  const ART = {
    player: 'characters/bishop_confessor.png',
    athanasius: 'characters/athanasius.png',
    alexander: 'characters/alexander_of_alexandria.png',
    eustathius: 'characters/eustathius_of_antioch.png',
    macarius: 'characters/macarius_of_jerusalem.png',
    paul: 'characters/paul_of_neocaesarea.png',
    vitus: 'characters/vitus.png',
    vincentius: 'characters/vincentius.png',
    arius: 'characters/arius.png',
    nicholas: 'characters/nicholas_of_myra.png',
    emperor: 'characters/emperor.png',
    pope: 'characters/pope.png',
    bishop: 'characters/bishop.png',
    monk: 'characters/monk.png',
    soldier: 'characters/soldier.png',
    cart: 'props/cart.png',
    ox: 'props/ox.png',
    ship: 'props/ship.png',
    chi_rho: 'props/chi_rho.png',
    gate: 'churches/nicaea_gate.png',
    basilica: 'churches/old_st_peters.png',
    hall: 'scenes/council_hall.png',
    map: 'map/council_map_unlabeled.png',
  };
  const IMG = {};

  function loadArt() {
    return Promise.all(Object.keys(ART).map(key => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => { IMG[key] = img; resolve(); };
      img.onerror = () => reject(new Error('Could not load assets/' + ART[key]));
      img.src = 'assets/' + ART[key];
    })));
  }

  // `key` may also be 'player' or 'companion', meaning whoever is travelling.
  function artKey(key) {
    if (state && key === 'player') return state.party[0].art;
    if (state && key === 'companion') return state.party[1].art;
    return key;
  }

  function sprite(key, scale, alt) {
    const src = IMG[artKey(key)];
    const img = document.createElement('img');
    img.src = src.src;
    img.width = src.naturalWidth * scale;
    img.height = src.naturalHeight * scale;
    img.className = 'px';
    img.alt = alt || '';
    return img;
  }

  const PEOPLE = {
    alexander: { art: 'alexander', name: 'Bishop Alexander of Alexandria' },
    athanasius: { art: 'athanasius', name: 'Athanasius, his deacon' },
    emperor: { art: 'emperor', name: 'Emperor Constantine' },
    pope: { art: 'pope', name: 'Pope Sylvester' },
    messenger: { art: 'soldier', name: 'An imperial messenger' },
    arius: { art: 'arius', name: 'Arius, a priest of Alexandria' },
    nicholas: { art: 'nicholas', name: 'St. Nicholas of Myra' },
    legates: { art: 'vitus', name: 'Vitus and Vincentius, for Pope Sylvester' },
    narrator: { art: null, name: 'Narrator' },
  };

  function person(who) {
    if (who === 'companion') return { art: 'companion', name: state.party[1].name };
    return PEOPLE[who];
  }

  // Fill in {hero} and {companion} in any text from data.js.
  function fill(text) {
    if (!text || !state) return text;
    return text.replace(/\{hero\}/g, state.party[0].name).replace(/\{companion\}/g, state.party[1].name);
  }

  // ---------------------------------------------------------------- DOM helpers
  function el(tag, props, ...kids) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
      else if (v === true) node.setAttribute(k, '');
      else if (v !== false && v != null) node.setAttribute(k, v);
    }
    for (const kid of kids.flat()) if (kid != null && kid !== false) node.append(kid);
    return node;
  }

  function button(label, onclick, cls, disabled) {
    return el('button', { class: 'btn ' + (cls || ''), type: 'button', onclick, disabled: !!disabled }, label);
  }

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  let resizeHandler = null;
  window.addEventListener('resize', () => resizeHandler && resizeHandler());

  function setScreen(node) {
    travel = null;
    resizeHandler = null;
    closeModal();
    app.replaceChildren(node);
    window.scrollTo(0, 0);
  }

  // Largest whole-number scale that fits the width and a share of the height.
  function fitScale(w, h, share) {
    const availW = app.clientWidth - 48;
    const availH = window.innerHeight * share;
    return Math.max(1, Math.floor(Math.min(availW / w, availH / h)));
  }

  function sizeCanvas(canvas, share) {
    const k = fitScale(canvas.width, canvas.height, share);
    canvas.style.width = canvas.width * k + 'px';
    canvas.style.height = canvas.height * k + 'px';
    return k;
  }

  function openModal(node, low) {
    modal.replaceChildren(node);
    modal.className = low ? 'modal low' : 'modal';
    modal.hidden = false;
    const first = modal.querySelector('button:not([disabled])');
    if (first) first.focus({ preventScroll: true });
  }

  function closeModal() {
    modal.hidden = true;
    modal.replaceChildren();
    if (travel) updateTravel();
  }

  // A card: optional art, a title, text, a "did you know" fact and buttons.
  function card(o) {
    const texts = [].concat(o.text || []);
    return el('div', { class: 'panel card', role: 'dialog', 'aria-label': fill(o.title) },
      o.art && el('div', { class: 'art' }, sprite(o.art, o.artScale || 5, '')),
      el('div', { class: 'body' },
        el('h2', { text: fill(o.title) }),
        o.speaker && el('div', { class: 'muted', text: fill(o.speaker) }),
        texts.map(t => el('p', { text: fill(t) })),
        o.changes && o.changes.length > 0 ? el('p', { class: 'changes', text: o.changes.join(' · ') }) : null,
        o.fact && el('p', { class: 'fact', text: fill(o.fact) }),
        el('div', { class: o.inline ? 'actions inline' : 'actions' }, o.actions)));
  }

  // ---------------------------------------------------------------- sound
  // Optional retro sounds, made in code. Off by default; each sound shows a caption.
  const SOUND_KEY = 'councilTrail.sound';
  const CAPTIONS = {
    arrive: '[a church bell rings]', event: '[a drum beats]', good: '[a cheerful tune]',
    bad: '[a low, sad note]', coins: '[coins clink]', storm: '[thunder rumbles]',
    sail: '[waves splash against the ship]', council: '[trumpets sound]',
  };
  const TUNES = {
    arrive: [[784, 0.25], [659, 0.25], [523, 0.5]],
    event: [[196, 0.12], [196, 0.12], [262, 0.25]],
    good: [[523, 0.1], [659, 0.1], [784, 0.1], [1047, 0.3]],
    bad: [[220, 0.3], [185, 0.5]],
    coins: [[1319, 0.08], [1760, 0.15]],
    council: [[392, 0.15], [523, 0.15], [659, 0.15], [784, 0.45]],
  };
  const Sound = {
    on: (() => { try { return localStorage.getItem(SOUND_KEY) === 'on'; } catch (e) { return false; } })(),
    ctx: null,
    toggle() {
      this.on = !this.on;
      try { localStorage.setItem(SOUND_KEY, this.on ? 'on' : 'off'); } catch (e) { /* private mode */ }
      if (this.on) this.play('good');
    },
    audio() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },
    play(name) {
      if (!this.on) return;
      showCaption(CAPTIONS[name]);
      const ac = this.audio();
      if (!ac) return;
      if (name === 'storm' || name === 'sail') {
        this.noise(ac, name === 'storm' ? 1.4 : 0.9, name === 'storm' ? 0.35 : 0.12);
        return;
      }
      let t = ac.currentTime + 0.02;
      for (const [freq, len] of TUNES[name]) {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + len);
        osc.connect(gain).connect(ac.destination);
        osc.start(t);
        osc.stop(t + len);
        t += len * 0.9;
      }
    },
    noise(ac, seconds, volume) {
      const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * seconds), ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
      const src = ac.createBufferSource();
      const filter = ac.createBiquadFilter();
      const gain = ac.createGain();
      filter.type = 'lowpass';
      filter.frequency.value = 600;
      gain.gain.value = volume;
      src.buffer = buffer;
      src.connect(filter).connect(gain).connect(ac.destination);
      src.start();
    },
  };
  // iPads only allow sound to start from a tap.
  document.addEventListener('pointerdown', () => { if (Sound.on) Sound.audio(); }, { once: true });

  let captionTimer = null;
  function showCaption(text) {
    if (!text) return;
    captionBar.textContent = text;
    captionBar.hidden = false;
    clearTimeout(captionTimer);
    captionTimer = setTimeout(() => { captionBar.hidden = true; }, 2600);
  }

  const soundLabel = () => `Sound: ${Sound.on ? 'On' : 'Off'}`;
  function soundButton() {
    const b = button(soundLabel(), () => { Sound.toggle(); b.textContent = soundLabel(); }, 'secondary');
    return b;
  }

  // ---------------------------------------------------------------- calendar
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];   // 325 is not a leap year

  function dayOfYear(date) {
    let n = date.day;
    for (let i = 0; i < date.month - 1; i++) n += MONTH_DAYS[i];
    return n;
  }
  const COUNCIL_DAY = dayOfYear(CH.councilDate);

  function dateText(day) {
    let n = state.startDay + day;
    let m = 0;
    while (n > MONTH_DAYS[m]) { n -= MONTH_DAYS[m]; m++; }
    return `${MONTHS[m]} ${n}, ${CH.year}`;
  }

  const deadline = () => COUNCIL_DAY - state.startDay;

  // ---------------------------------------------------------------- the road network
  const PLACES = CH.places;
  const legsFrom = id => CH.legs.filter(l => l.from === id);
  const legIndex = leg => CH.legs.indexOf(leg);

  const distCache = {};
  function kmToNicaea(id) {
    if (id === 'nicaea') return 0;
    if (distCache[id] == null) distCache[id] = Math.min(...legsFrom(id).map(l => l.km + kmToNicaea(l.to)));
    return distCache[id];
  }

  // Every place and leg reachable from a home city.
  function reachable(start) {
    const places = new Set([start]);
    const legs = new Set();
    const queue = [start];
    while (queue.length) {
      for (const l of legsFrom(queue.shift())) {
        legs.add(l);
        if (!places.has(l.to)) { places.add(l.to); queue.push(l.to); }
      }
    }
    return { places, legs };
  }

  const project = (lat, lon) => [(lon - 12) * 12.8, (45.5 - lat) * 16.25];

  // A leg's points on the map, each with its distance (km) from the leg's start.
  function legPoints(leg) {
    const a = PLACES[leg.from], b = PLACES[leg.to];
    const raw = [[a.lat, a.lon], ...(leg.via || []), [b.lat, b.lon]];
    const pts = raw.map(([lat, lon]) => ({ lat, lon, xy: project(lat, lon), len: 0 }));
    let total = 0;
    pts.forEach((p, i) => {
      if (i) total += Math.hypot(p.xy[0] - pts[i - 1].xy[0], p.xy[1] - pts[i - 1].xy[1]);
      p.len = total;
    });
    pts.forEach(p => { p.km = total ? leg.km * p.len / total : 0; });
    return pts;
  }

  // Where along a leg the party is: { lat, lon, xy }.
  function pointOnLeg(leg, km) {
    const pts = legPoints(leg);
    for (let i = 1; i < pts.length; i++) {
      if (km <= pts[i].km || i === pts.length - 1) {
        const a = pts[i - 1], b = pts[i];
        const t = b.km === a.km ? 0 : clamp((km - a.km) / (b.km - a.km), 0, 1);
        return {
          lat: a.lat + (b.lat - a.lat) * t,
          lon: a.lon + (b.lon - a.lon) * t,
          xy: [a.xy[0] + (b.xy[0] - a.xy[0]) * t, a.xy[1] + (b.xy[1] - a.xy[1]) * t],
        };
      }
    }
    return pts[0];
  }

  function herePoint() {
    if (state.leg != null) return pointOnLeg(CH.legs[state.leg], state.legKm);
    const p = PLACES[state.at];
    return { lat: p.lat, lon: p.lon, xy: project(p.lat, p.lon) };
  }

  // The kind of country at a point, for the travel scene and the speed.
  function landAt(lat, lon) {
    if (lat < 31.7 && lon > 28 && lon < 34.6) return 'desert';
    if (lat > 36.8 && lat < 38.2 && lon > 33.4 && lon < 35.6) return 'mountains';
    if (lat > 40.6 && lat < 41.4 && lon > 20 && lon < 22.2) return 'mountains';
    if (lat > 37.6 && lon > 29.5) return 'plateau';
    return 'coast';
  }

  const currentMode = () => (state.leg != null ? CH.legs[state.leg].mode
    : PLACES[state.at].scenery === 'sea' ? 'sea' : 'land');

  // ---------------------------------------------------------------- state & saving
  let state = null;
  const SAVE_KEY = 'councilTrail.ch1.save';

  function newState(seeId) {
    const home = CH.sees.find(s => s.id === seeId) || CH.sees[1];
    const hero = home.heroes[0];
    const companion = hero.companion || home.companion;
    return {
      version: 2,
      see: home.id,
      startDay: dayOfYear(home.startDate),
      stage: 'road',
      day: 0,
      at: home.start,        // the last place reached
      leg: null,             // index of the leg being travelled
      legKm: 0,
      km: 0,
      trail: [],             // legs already travelled
      visited: [home.start],
      atStop: true,
      moving: false,
      food: 0,
      coins: CH.startCoins,
      pace: 'steady',
      post: false,
      storm: 0,
      party: [
        { id: 'player', art: hero.art, name: hero.name, health: 100, ill: null },
        { id: 'companion', art: companion.art, name: companion.name, health: 100, ill: null },
      ],
      usedEvents: {},
      doneEvents: {},
      firstTry: 0,
      message: '',
    };
  }

  function save() {
    if (!state) return;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, moving: false })); } catch (e) { /* storage off */ }
  }

  function loadSave() {
    try {
      const s = JSON.parse(localStorage.getItem(SAVE_KEY));
      return s && s.version === 2 && PLACES[s.at] ? s : null;
    } catch (e) { return null; }
  }

  function clearSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* storage off */ }
  }

  const see = () => CH.sees.find(s => s.id === state.see);
  const foodPrice = () => CH.foodPrice + Math.min(2, Math.floor(state.km / 600));

  function speed() {
    const leg = CH.legs[state.leg];
    if (leg.mode === 'sea') return 90;
    let s = state.pace === 'hurried' ? 42 : 30;
    if (state.post) s += 15;
    const p = herePoint();
    if (landAt(p.lat, p.lon) === 'mountains') s = Math.round(s * 0.7);
    return s;
  }

  // Each day eats one day of food. Resting heals; hurrying and illness wear people down.
  function passDays(n, mode) {
    for (let i = 0; i < n; i++) {
      state.day++;
      if (state.storm > 0) state.storm--;
      const atSea = currentMode() === 'sea';
      let change = mode === 'rest' ? 12 : atSea ? 1 : state.pace === 'hurried' ? -4 : 2;
      if (state.food > 0) state.food--;
      else {
        change -= 8;
        state.message = 'You have run out of food! Buy more at the next market.';
      }
      for (const p of state.party) {
        let c = change;
        if (p.ill) {
          c -= 4;
          p.ill.days -= mode === 'rest' ? 2 : 1;
          if (p.ill.days <= 0) {
            state.message = `${p.name} has recovered from ${p.ill.name}.`;
            p.ill = null;
          }
        }
        p.health = clamp(p.health + c, 0, 100);
      }
    }
  }

  function healthWord(h) {
    return h >= 70 ? 'Good' : h >= 40 ? 'Fair' : h >= 20 ? 'Poor' : 'Very poor';
  }

  // ---------------------------------------------------------------- title & setup
  function showTitle() {
    stopTravel();
    const saved = loadSave();
    setScreen(el('section', { class: 'screen title-screen' },
      sprite('chi_rho', 10, 'Chi-Rho, the sign of Christ'),
      el('h1', { text: 'COUNCIL TRAIL' }),
      el('p', { class: 'subtitle', text: `Chapter I: ${CH.title}, A.D. ${CH.year}` }),
      el('div', { class: 'row bottom' }, sprite('cart', 5, 'A covered cart'), sprite('ox', 5, 'An ox')),
      el('div', { class: 'row' },
        saved && button('Continue the journey ▸', () => resume(saved)),
        button(saved ? 'New journey' : 'Begin the journey', () => { clearSave(); showSees(); }, saved ? 'secondary' : ''),
        soundButton()),
      el('p', { class: 'small', text: 'A journey to the seven great councils of the Church' })));
  }

  function resume(saved) {
    state = saved;
    if (state.stage === 'council') { startCouncil(); return; }
    showTravel();
    if (state.atStop) openPlace(state.at, true);
  }

  function showSees() {
    const cards = CH.sees.map(s => {
      state = newState(s.id);
      const leaves = dateText(0);
      return el('button', { class: 'panel hero-card', type: 'button', onclick: () => { state = newState(s.id); showChoose(); } },
        sprite(s.art, 4, ''),
        el('div', {},
          el('div', { class: 'name', text: s.name }),
          el('div', { class: 'muted', text: `Leaves ${leaves}` }),
          el('p', { text: s.blurb })));
    });
    state = null;
    setScreen(el('section', { class: 'screen' },
      el('h2', { text: 'Where does your journey begin?' }),
      el('p', { text: 'Bishops came to Nicaea from every corner of the Empire. Choose your home city.' }),
      el('div', { class: 'choices' }, cards)));
  }

  function showChoose() {
    const s = see();
    setScreen(el('section', { class: 'screen' },
      el('h2', { text: 'Who are you?' }),
      el('p', { text: `You travel from ${s.name} to the first great council of the Church.` }),
      el('div', { class: 'choices' }, s.heroes.map(h =>
        el('button', { class: 'panel hero-card', type: 'button', onclick: () => pickHero(h) },
          sprite(h.art, 5, ''),
          el('div', {},
            el('div', { class: 'name', text: h.name }),
            el('div', { class: 'muted', text: h.title }),
            el('p', { text: h.bio })))))));
  }

  function pickHero(h) {
    const s = see();
    const companion = h.companion || s.companion;
    state.party[0].name = h.name;
    state.party[0].art = h.art;
    state.party[1].name = companion.name;
    state.party[1].art = companion.art;
    talk(s.intro, showStartShop);
  }

  // A box for one line of { who, text }. The narrator (the game telling the story)
  // gets a dark box and a NARRATOR tag; a person speaking gets their portrait,
  // "Name says:" and their words in quotation marks.
  function speechBox(scale, onNext) {
    const portrait = el('div', { class: 'portrait' });
    const tag = el('div', { class: 'tag' });
    const text = el('p', { class: 'text' });
    const box = el('div', { class: 'panel speech-box' }, portrait,
      el('div', { class: 'speech-body' }, tag, text, el('div', { class: 'row' }, button('Next ▸', onNext))));
    const show = line => {
      const narrating = line.who === 'narrator';
      const who = person(line.who);
      box.classList.toggle('narration', narrating);
      portrait.hidden = narrating;
      portrait.replaceChildren(narrating ? '' : sprite(who.art, scale, who.name));
      tag.replaceChildren(el('span', { class: 'name', text: narrating ? 'NARRATOR' : `${who.name} says:` }),
        line.legend ? el('span', { class: 'stamp', text: 'LEGEND' }) : '');
      text.textContent = narrating ? fill(line.text) : `"${fill(line.text)}"`;
    };
    return { box, show };
  }

  // A screen of lines, one at a time.
  function talk(lines, done) {
    let i = 0;
    const speech = speechBox(6, () => { i++; if (i < lines.length) speech.show(lines[i]); else done(); });
    setScreen(el('section', { class: 'screen' }, el('div', { class: 'talk' }, speech.box)));
    speech.show(lines[0]);
  }

  // ---------------------------------------------------------------- market
  function shopPanel(o) {
    let buy = o.start ? Math.min(40, Math.floor(state.coins / o.price / 5) * 5) : 0;
    const amount = el('div', { class: 'amount' });
    const cost = el('span');
    const left = el('span');
    const minus = button('−5', () => { buy = Math.max(0, buy - 5); render(); }, 'secondary');
    const plus = button('+5', () => { buy += 5; render(); }, 'secondary');
    const render = () => {
      amount.textContent = `${buy} days`;
      cost.textContent = `Cost: ${buy * o.price} coins`;
      left.textContent = `Coins left: ${state.coins - buy * o.price}`;
      plus.disabled = (buy + 5) * o.price > state.coins;
      minus.disabled = buy === 0;
    };
    const done = button(o.start ? 'Set out ▸' : 'Done ▸', () => {
      if (buy) Sound.play('coins');
      state.coins -= buy * o.price;
      state.food += buy;
      save();
      o.onDone();
    });
    render();
    return el('div', { class: 'panel shop' },
      el('h2', { text: `${o.where} market` }),
      el('p', { text: `Food costs ${o.price} coins for one day for your party. You have ${state.coins} coins and ${state.food} days of food.` }),
      o.start && el('div', { class: 'member' }, sprite('companion', 3, ''),
        el('p', { text: `${state.party[1].name}: "The journey takes six or seven weeks. Food is cheaper here than far from home, but keep some coins for ships and trouble on the road!"` })),
      el('div', { class: 'stepper' }, minus, amount, plus),
      el('div', { class: 'totals' }, cost, left),
      el('div', { class: 'row' }, done));
  }

  function showStartShop() {
    setScreen(el('section', { class: 'screen' },
      shopPanel({
        where: PLACES[state.at].name, price: CH.foodPrice, start: true,
        onDone: () => { showTravel(); openPlace(state.at); },
      })));
  }

  // ---------------------------------------------------------------- travel screen
  let travel = null;    // refs for the live travel screen
  let dayTimer = null;
  let anim = null;
  let scroll = 0;
  let frame = 0;

  function showTravel() {
    const canvas = el('canvas', { class: 'px', width: 320, height: 120, role: 'img', 'aria-label': 'Your party on the road' });
    const refs = {
      canvas,
      ctx: canvas.getContext('2d'),
      stats: el('dl', { class: 'stats' }),
      party: el('div', { class: 'party' }),
      message: el('p', { class: 'message' }),
      go: button('', toggleTravel),
      pace: button('', togglePace, 'secondary'),
      rest: button('Rest a day', restDay, 'secondary'),
    };
    setScreen(el('section', { class: 'screen' },
      el('div', { class: 'scene-wrap' }, canvas),
      el('div', { class: 'travel-info' }, el('div', { class: 'panel' }, refs.stats), el('div', { class: 'panel' }, refs.party)),
      refs.message,
      el('div', { class: 'controls' }, refs.go, refs.pace, refs.rest, button('Map', showMap, 'secondary'), soundButton())));
    travel = refs;
    refs.ctx.imageSmoothingEnabled = false;
    resizeHandler = () => sizeCanvas(canvas, 0.5);
    resizeHandler();
    updateTravel();
    startAnimation();
  }

  function updateTravel() {
    if (!travel) return;
    const leg = state.leg != null ? CH.legs[state.leg] : null;
    const daysLeft = deadline() - state.day;
    const pairs = [
      ['Date', dateText(state.day)],
      ['Council opens', daysLeft >= 0 ? `May 20 (${daysLeft} days)` : `May 20 (${-daysLeft} days ago!)`],
      leg ? ['Next stop', `${PLACES[leg.to].name}, ${leg.km - state.legKm} km${leg.mode === 'sea' ? ' by sea' : ''}`]
        : ['At', PLACES[state.at].name],
      ['To Nicaea', `about ${leg ? leg.km - state.legKm + kmToNicaea(leg.to) : kmToNicaea(state.at)} km`],
      ['Food', `${state.food} days`],
      ['Coins', String(state.coins)],
    ];
    travel.stats.replaceChildren(...pairs.flatMap(([k, v]) => [el('dt', { text: k }), el('dd', { text: v })]));
    travel.party.replaceChildren(...state.party.map(p => {
      const bar = el('div', { class: 'bar ' + (p.health < 40 ? 'poor' : p.health < 70 ? 'fair' : '') },
        el('span', { style: `width:${p.health}%` }));
      const status = healthWord(p.health) + (p.ill ? `, has ${p.ill.name}` : '');
      return el('div', { class: 'member' }, sprite(p.art, 2, ''),
        el('div', { class: 'who' }, el('div', { text: `${p.name}: ${status}` }), bar));
    }));
    travel.message.textContent = state.message;
    const atSea = currentMode() === 'sea';
    travel.go.textContent = state.moving ? 'Stop' : state.day === 0 && !leg ? 'Set off ▸' : atSea ? 'Sail on ▸' : 'Travel on ▸';
    travel.pace.textContent = atSea ? 'Pace: the wind' : `Pace: ${state.pace === 'hurried' ? 'Hurried' : 'Steady'}${state.post ? ' (post)' : ''}`;
    travel.pace.disabled = atSea;
    travel.rest.disabled = state.moving || atSea;
  }

  function toggleTravel() {
    if (state.moving) stopTravel();
    else startTravel();
  }

  // Leaving a place: pick the road (asking at a fork), pay any fare, and go.
  function startTravel() {
    if (state.leg == null) {
      const options = legsFrom(state.at);
      if (!options.length) return;
      if (options.length > 1) { showFork(); return; }
      takeLeg(options[0]);
    }
    state.moving = true;
    state.atStop = false;
    if (!state.message.startsWith('You pay') && !state.message.startsWith('You cannot pay')) state.message = '';
    updateTravel();
    scheduleDay();
  }

  function takeLeg(leg) {
    const prev = state.trail.length ? CH.legs[state.trail.at(-1)] : null;
    const boarding = leg.mode === 'sea' && leg.fare && !(prev && prev.mode === 'sea');
    state.message = '';
    if (boarding) {
      if (state.coins >= leg.fare) {
        state.coins -= leg.fare;
        state.message = `You pay ${leg.fare} coins for your passage.`;
        Sound.play('coins');
      } else {
        state.message = 'You cannot pay the fare, so the captain lets you work for your passage.';
        for (const p of state.party) p.health = clamp(p.health - 10, 0, 100);
      }
    }
    state.leg = legIndex(leg);
    state.legKm = 0;
    if (leg.mode === 'sea') Sound.play('sail');
    save();
  }

  function showFork() {
    const here = PLACES[state.at];
    const actions = legsFrom(state.at).map(l => {
      const total = l.km + kmToNicaea(l.to);
      // A road down to a port shows the fare of the ship waiting there.
      const onward = legsFrom(l.to);
      const fare = l.fare || (onward.length === 1 && onward[0].mode === 'sea' ? onward[0].fare || 0 : 0);
      return button(`${l.choice} (by ${l.by || l.mode}, about ${total} km to Nicaea${fare ? `, fare ${fare} coins` : ''})`,
        () => { takeLeg(l); closeModal(); startTravel(); }, 'wide', fare > state.coins);
    });
    actions.push(button('Look at the map first', showMap, 'secondary'));
    openModal(card({
      title: 'Which way?',
      text: [`From ${here.name} there are two ways to Nicaea.`,
        'Ships are faster, but cost a fare and can meet storms. Roads are slower, but you can stop in cities and buy food.'],
      actions,
    }));
  }

  function stopTravel() {
    clearTimeout(dayTimer);
    if (!state) return;
    state.moving = false;
    updateTravel();
  }

  function scheduleDay() {
    clearTimeout(dayTimer);
    dayTimer = setTimeout(travelDay, 650);
  }

  function travelDay() {
    if (!state.moving) return;
    const leg = CH.legs[state.leg];
    const step = Math.min(speed(), leg.km - state.legKm);
    state.legKm += step;
    state.km += step;
    passDays(1, 'travel');
    if (state.legKm >= leg.km) {
      state.trail.push(state.leg);
      state.at = leg.to;
      state.leg = null;
      state.legKm = 0;
      if (!state.visited.includes(leg.to)) state.visited.push(leg.to);
      state.atStop = true;
      stopTravel();
      save();
      openPlace(leg.to);
      return;
    }
    save();
    updateTravel();
    const scripted = Object.entries(CH.dayEvents)
      .find(([day, id]) => Number(day) <= state.day && !state.doneEvents[id]);
    if (scripted) {
      const [, id] = scripted;
      state.doneEvents[id] = true;
      stopTravel();
      showEvent(CH.events[id]);
      return;
    }
    const weak = state.party.find(p => p.health <= 20);
    if (weak) { stopTravel(); showSick(weak); return; }
    if (Math.random() < (leg.mode === 'sea' ? 0.25 : 0.15)) {
      const ev = pickRandomEvent();
      if (ev) { stopTravel(); showEvent(ev); return; }
    }
    scheduleDay();
  }

  function togglePace() {
    state.pace = state.pace === 'steady' ? 'hurried' : 'steady';
    state.message = state.pace === 'hurried'
      ? 'Hurrying covers more ground, but tires everyone out.'
      : 'A steady pace keeps everyone healthy.';
    save();
    updateTravel();
  }

  function restDay() {
    state.message = 'You rest for a day. Everyone feels better.';
    passDays(1, 'rest');
    save();
    updateTravel();
  }

  // No one is ever lost on this road: the weak rest, and strangers share bread.
  function showSick(p) {
    const texts = [`${p.name} is too weak to go on. You stop for three days of rest.`];
    if (state.food === 0) {
      state.food += 5;
      texts.push('A Christian family nearby shares five days of bread with you.');
    }
    passDays(3, 'rest');
    save();
    Sound.play('bad');
    openModal(card({ art: p.art, title: 'Time to rest', text: texts, actions: [button('Continue ▸', closeModal)] }));
  }

  // ---------------------------------------------------------------- places & events
  function openPlace(id, resuming) {
    const place = PLACES[id];
    if (id === 'nicaea') { arriveNicaea(place); return; }
    if (!resuming) Sound.play('arrive');
    const next = () => {
      if (place.event && !state.doneEvents[id]) {
        state.doneEvents[id] = true;
        save();
        showEvent(CH.events[place.event]);
      } else if (legsFrom(id).length > 1) showFork();
      else closeModal();
    };
    const back = () => openPlace(id, true);
    const actions = [];
    if (place.market) {
      actions.push(button('Buy food', () => openModal(shopPanel({ where: place.name, price: foodPrice(), onDone: back })), 'secondary'));
      actions.push(button('Rest here a day', () => {
        state.message = 'You rest a day at the church guesthouse.';
        passDays(1, 'rest');
        save();
        back();
      }, 'secondary'));
    }
    if (place.news) {
      actions.push(button('Hear the news', () => openModal(card({
        title: `News in ${place.name}`, text: place.news, actions: [button('Back ▸', back)], inline: true,
      }), true), 'secondary'));
    }
    actions.push(button('Continue ▸', next));
    const texts = [place.text];
    if (resuming && state.message) texts.push(state.message);
    openModal(card({ title: place.name, text: texts, actions, inline: true }), true);
    updateTravel();
  }

  function eventFits(e) {
    const w = e.when || {};
    if (w.mode && w.mode !== currentMode()) return false;
    if (w.post != null && w.post !== state.post) return false;
    if (w.lands) {
      const p = herePoint();
      if (!w.lands.includes(landAt(p.lat, p.lon))) return false;
    }
    return !state.usedEvents[e.id];
  }

  function pickRandomEvent() {
    const pool = CH.randomEvents.filter(eventFits);
    if (!pool.length) return null;
    const ev = pool[Math.floor(Math.random() * pool.length)];
    state.usedEvents[ev.id] = true;
    if (ev.storm) { state.storm = 2; Sound.play('storm'); }
    return ev;
  }

  function showEvent(ev) {
    if (!ev.storm) Sound.play('event');
    const actions = ev.choices.map(c =>
      button(fill(c.label), () => choose(ev, c), 'wide', c.cost != null && c.cost > state.coins));
    openModal(card({ art: ev.sprite, title: ev.title, speaker: ev.speaker, text: ev.text, fact: ev.fact, actions }));
  }

  function choose(ev, c) {
    const lucky = c.chance == null || Math.random() < c.chance;
    const outcome = lucky ? c : c.fail;
    const effect = outcome.effect || {};
    const before = { food: state.food, coins: state.coins, day: state.day };
    applyEffect(effect);
    const changes = [];
    const diff = (n, word) => n && changes.push(`${n > 0 ? '+' : '−'}${Math.abs(n)} ${word}`);
    diff(state.food - before.food, 'food');
    diff(state.coins - before.coins, 'coins');
    if (state.day > before.day) changes.push(`${state.day - before.day} day${state.day - before.day > 1 ? 's' : ''} pass`);
    Sound.play(lucky && !effect.ill ? 'good' : 'bad');
    save();
    openModal(card({ art: ev.sprite, title: ev.title, text: outcome.result, changes,
      actions: [button('Continue ▸', closeModal)] }));
  }

  function applyEffect(e) {
    if (e.ill) {
      const p = state.party[e.ill.who === 'player' ? 0 : 1];
      p.ill = { name: e.ill.name, days: e.ill.days };
    }
    if (e.days) passDays(e.days, 'rest');
    if (e.food) state.food = Math.max(0, state.food + e.food);
    if (e.coins) state.coins = Math.max(0, state.coins + e.coins);
    if (e.health) for (const p of state.party) p.health = clamp(p.health + e.health, 0, 100);
    if (e.companion) state.party[1].health = clamp(state.party[1].health + e.companion, 0, 100);
    if (e.post) state.post = true;
  }

  function arriveNicaea(place) {
    Sound.play('arrive');
    const late = state.day - deadline();
    const when = late < 0
      ? `You arrive on ${dateText(state.day)}, with ${-late} day${late === -1 ? '' : 's'} to spare!`
      : late === 0
        ? `You arrive on ${dateText(state.day)}, the very day the council opens!`
        : `You arrive on ${dateText(state.day)}. The council opened ${late} days ago, but the great debate is still going on. You slip quietly into the hall.`;
    openModal(card({ art: 'gate', artScale: 4, title: 'Nicaea at last!', text: [place.text, when],
      actions: [button('Enter the council ▸', startCouncil)] }), true);
  }

  // ---------------------------------------------------------------- the travel scene
  const LANDS = {
    desert: { sky: ['#f3e6c0', '#ead6a0'], far: '#d8bc84', mid: '#c9a868', ground: '#dcc48e', road: '#c4a46c', rut: '#ac8c58', props: ['palm', 'palm', 'rock'] },
    coast: { sky: ['#a8cdf0', '#cfe3f5'], far: '#7f9a6a', mid: '#8fa860', ground: '#b8b070', road: '#c8b080', rut: '#a89060', props: ['cypress', 'olive', 'olive'] },
    mountains: { sky: ['#9fc3ea', '#c6dcf2'], far: '#7a7480', mid: '#8a7a5a', ground: '#a8926a', road: '#bca478', rut: '#968058', props: ['pine', 'rock', 'rock'] },
    plateau: { sky: ['#a8cdf0', '#d4e6f6'], far: '#a89a68', mid: '#b8aa6c', ground: '#c8b878', road: '#d0bc8a', rut: '#ac9868', props: ['poplar', 'bush', 'bush'] },
  };

  const hash = k => ((Math.imul(k, 2654435761) >>> 0) % 1000) / 1000;

  function startAnimation() {
    cancelAnimationFrame(anim);
    const tick = () => {
      if (!travel) return;
      if (state.moving) scroll += 1;
      frame++;
      if (currentMode() === 'sea') drawSea(travel.ctx); else drawRoad(travel.ctx);
      anim = requestAnimationFrame(tick);
    };
    tick();
  }

  function drawSky(px, sky, cloudy) {
    px(0, 0, 320, 44, sky[0]);
    px(0, 44, 320, 40, sky[1]);
    for (let x = 0; x < 320; x += 2) px(x, 44, 1, 1, sky[0]);
    for (let y = -8; y <= 8; y++) {                       // sun
      const w = Math.round(Math.sqrt(64 - y * y));
      px(276 - w, 20 + y, w * 2, 1, y > -5 && y < 5 && w > 4 ? '#fff4c8' : '#f8e8a0');
    }
    if (cloudy) {                                         // clouds drift slowly
      for (let i = 0; i < 3; i++) {
        const x = Math.round(((i * 131 - scroll * 0.05) % 380 + 380) % 380) - 40;
        px(x, 12 + i * 9, 22, 3, '#ffffff');
        px(x + 5, 9 + i * 9, 11, 3, '#ffffff');
      }
    }
  }

  function drawRoad(ctx) {
    const here = herePoint();
    const land = LANDS[landAt(here.lat, here.lon)];
    const px = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };

    drawSky(px, land.sky, land !== LANDS.desert);
    const mountains = land === LANDS.mountains;
    for (let x = 0; x < 320; x++) {                       // far hills
      const w = x + scroll * 0.15;
      const h = Math.round((mountains ? 30 : 10) + (mountains ? 12 : 6) * Math.sin(w / 37) + 5 * Math.sin(w / 13 + 1));
      px(x, 82 - h, 1, h, land.far);
      if (mountains && h > 34) px(x, 82 - h, 1, 3, '#f0ece0');
    }
    for (let x = 0; x < 320; x++) {                       // near hills
      const w = x + scroll * 0.4;
      const h = Math.round(6 + 4 * Math.sin(w / 23) + 3 * Math.sin(w / 9.7));
      px(x, 86 - h, 1, h, land.mid);
    }
    px(0, 84, 320, 36, land.ground);

    const place = state.atStop ? PLACES[state.at] : null;
    if (place && place.scenery !== 'river') drawScenery(ctx, px, place.scenery);

    drawProps(px, land, 46, 91, scroll * 0.8, 1);        // far side of the road
    px(0, 92, 320, 13, land.road);
    for (let x = 0; x < 320; x++) {
      if ((x + Math.floor(scroll)) % 12 < 7) { px(x, 96, 1, 1, land.rut); px(x, 101, 1, 1, land.rut); }
    }

    if (place && place.scenery === 'river') drawScenery(ctx, px, 'river');

    const bob = state.moving && (frame >> 3) % 2 ? 1 : 0;   // cart and ox
    ctx.drawImage(IMG.cart, 150, 88 + bob);
    px(169, 97, 4, 1, '#4a2a14');
    ctx.drawImage(IMG.ox, 172, 94 - bob);
    if (state.moving) {
      for (let i = 0; i < 4; i++) px(146 - ((frame + i * 5) % 14), 100 - (i % 2), 1, 1, '#e8dcbc');
    }
    drawProps(px, land, 70, 119, scroll * 1.3, 2);        // near side of the road
  }

  function drawSea(ctx) {
    const px = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    const storm = state.storm > 0;
    if (storm) {
      px(0, 0, 320, 84, frame % 150 < 3 ? '#d8dce8' : '#5a6070');   // lightning flashes
      for (let i = 0; i < 4; i++) {
        const x = Math.round(((i * 97 - scroll * 0.1) % 380 + 380) % 380) - 40;
        px(x, 8 + i * 7, 46, 6, '#454a58');
      }
    } else drawSky(px, ['#a8cdf0', '#cfe3f5'], true);

    const far = scroll * 0.1;                             // distant islands
    for (let k = Math.floor(far / 160) - 1; k < Math.floor(far / 160) + 3; k++) {
      const x = Math.round(k * 160 + hash(k + 50) * 90 - far);
      const w = 30 + Math.round(hash(k + 90) * 40);
      for (let i = 0; i < w; i++) {
        const h = Math.round(6 * Math.sin(Math.PI * i / w) + 2);
        px(x + i, 80 - h, 1, h, storm ? '#4a5048' : '#8a9a6a');
      }
    }
    px(0, 80, 320, 40, storm ? '#1e3058' : '#284a86');
    px(0, 80, 320, 2, storm ? '#2e4878' : '#3a68aa');
    for (let row = 0; row < 7; row++) {                   // waves
      const y = 85 + row * 5;
      const drift = 0.3 + row * 0.25;
      for (let k = 0; k < 14; k++) {
        const x = Math.round(((k * 29 + row * 11 - scroll * drift) % 330 + 330) % 330) - 10;
        px(x, y + ((frame >> 4) + k) % 2, 4 + (row >> 1), 1, storm ? '#8a9ab8' : '#7aa0d8');
      }
    }
    const rock = storm ? ((frame >> 3) % 4) - 1 : state.moving && (frame >> 4) % 2 ? 1 : 0;
    ctx.drawImage(IMG.ship, 144, 80 + rock);
    px(144, 96 + rock, 32, 1, '#dfe6f2');
    if (storm) {
      for (let i = 0; i < 40; i++) px((i * 37 + frame * 3) % 320, (i * 23 + frame * 5) % 120, 1, 3, '#b8c0d0');
    }
  }

  function drawProps(px, land, spacing, base, offset, seed) {
    const first = Math.floor(offset / spacing) - 1;
    for (let k = first; k < first + 320 / spacing + 3; k++) {
      const r = hash(k * 7 + seed);
      const x = Math.round(k * spacing + r * spacing * 0.6 - offset);
      if (x < -12 || x > 320) continue;
      const kind = k % 5 === 0 && seed === 1 ? 'milestone' : land.props[Math.floor(r * land.props.length)];
      PROPS[kind](px, x, base);
    }
  }

  const PROPS = {
    palm(px, x, b) {
      px(x + 3, b - 12, 1, 12, '#7a4a24');
      px(x, b - 14, 8, 1, '#3a7a3a'); px(x + 1, b - 15, 6, 1, '#3a7a3a'); px(x + 2, b - 16, 4, 1, '#4a8a44');
      px(x - 1, b - 13, 3, 1, '#3a7a3a'); px(x + 6, b - 13, 3, 1, '#3a7a3a'); px(x + 3, b - 13, 2, 1, '#e8b830');
    },
    cypress(px, x, b) {
      px(x + 2, b - 3, 1, 3, '#4a2a14');
      px(x + 1, b - 14, 3, 11, '#2f5a2a'); px(x, b - 11, 5, 7, '#2f5a2a'); px(x + 2, b - 16, 1, 2, '#2f5a2a');
    },
    olive(px, x, b) {
      px(x + 3, b - 4, 1, 4, '#5a3a1a');
      px(x, b - 8, 8, 4, '#6a8a4a'); px(x + 1, b - 9, 6, 1, '#7a9a5a');
    },
    pine(px, x, b) {
      px(x + 3, b - 3, 1, 3, '#4a2a14');
      [1, 3, 3, 5, 7].forEach((w, i) => px(x + 3 - (w - 1) / 2, b - 13 + i * 2, w, 2, '#2a4a30'));
    },
    poplar(px, x, b) {
      px(x + 2, b - 3, 1, 3, '#4a2a14');
      px(x + 1, b - 15, 3, 12, '#5a7a3a'); px(x + 2, b - 17, 1, 2, '#5a7a3a');
    },
    bush(px, x, b) { px(x, b - 4, 7, 4, '#7a8a4a'); px(x + 1, b - 5, 5, 1, '#8a9a5a'); },
    rock(px, x, b) { px(x, b - 4, 7, 4, '#8a8490'); px(x + 1, b - 5, 4, 1, '#b0aab4'); },
    milestone(px, x, b) { px(x, b - 7, 3, 7, '#d8d0c0'); px(x + 2, b - 7, 1, 7, '#a8a090'); px(x, b - 8, 3, 1, '#a8a090'); },
  };

  function drawScenery(ctx, px, kind) {
    if (kind === 'pharos') {                              // the lighthouse of Alexandria
      px(200, 78, 120, 6, '#3a68aa');
      px(246, 60, 30, 26, '#dcb898'); px(270, 60, 6, 26, '#a8846a');
      px(252, 38, 18, 22, '#dcb898'); px(265, 38, 5, 22, '#a8846a');
      px(256, 24, 10, 14, '#dcb898');
      px(258, 16, 6, 8, '#e8b830'); px(260, 18, 2, 4, '#b02828');
      px(259, 46, 3, 5, '#2a2030'); px(259, 66, 4, 6, '#2a2030');
    } else if (kind === 'city') {
      px(244, 46, 24, 12, '#8890a0'); px(250, 42, 12, 4, '#8890a0'); px(255, 38, 2, 4, '#e8b830');
      px(214, 64, 104, 26, '#dcb898');
      for (let x = 214; x < 318; x += 6) px(x, 61, 3, 3, '#dcb898');
      px(214, 72, 104, 2, '#b0583a'); px(214, 80, 104, 2, '#b0583a');
      px(220, 54, 12, 36, '#dcb898'); px(296, 54, 12, 36, '#dcb898');
      px(230, 54, 2, 36, '#a8846a'); px(306, 54, 2, 36, '#a8846a');
      px(258, 76, 10, 14, '#2a2030');
    } else if (kind === 'pass') {
      for (let x = 210; x < 320; x++) {
        const h = 50 + Math.round(12 * Math.sin(x / 7) + 6 * Math.sin(x / 3));
        px(x, 90 - h, 1, h, x % 9 < 2 ? '#8a8090' : '#6a6070');
      }
    } else if (kind === 'river') {
      px(196, 84, 40, 36, '#3a68aa');
      for (let i = 0; i < 12; i++) px(198 + Math.floor((i * 13 + frame / 4) % 36), 86 + i * 3, 4, 1, '#7aa0d8');
      px(194, 84, 2, 36, '#8a6a3a'); px(236, 84, 2, 36, '#8a6a3a');
    } else if (kind === 'gate') {
      ctx.drawImage(IMG.gate, 240, 56);
    } else if (kind === 'basilica') {
      ctx.drawImage(IMG.basilica, 240, 52);
    }
  }

  // ---------------------------------------------------------------- map
  function showMap() {
    stopTravel();
    const canvas = el('canvas', { class: 'px', width: 320, height: 260, role: 'img', 'aria-label': 'Map of the roads to Nicaea' });
    const labels = el('div');
    setScreen(el('section', { class: 'screen' },
      el('h2', { text: `From ${PLACES[see().start].name} to Nicaea` }),
      el('div', { class: 'map-wrap' }, canvas, labels),
      el('div', { class: 'map-key' },
        el('span', {}, el('span', { class: 'swatch', style: 'background:#ff4a2a' }), 'Travelled'),
        el('span', {}, el('span', { class: 'swatch', style: 'background:#e8b830' }), 'Road'),
        el('span', {}, el('span', { class: 'swatch', style: 'background:#ffffff' }), 'Sea lane'),
        el('span', { text: `${state.km} km travelled` })),
      button('Back to the road', () => { showTravel(); if (state.atStop) openPlace(state.at, true); })));

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(IMG.map, 0, 0);
    const { places, legs } = reachable(see().start);
    const dot = (x, y, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), 1, 1); };
    const drawLeg = (leg, doneKm) => {
      const pts = legPoints(leg);
      let n = 0;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i];
        const steps = Math.max(1, Math.ceil(Math.max(Math.abs(b.xy[0] - a.xy[0]), Math.abs(b.xy[1] - a.xy[1]))));
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const x = a.xy[0] + (b.xy[0] - a.xy[0]) * t, y = a.xy[1] + (b.xy[1] - a.xy[1]) * t;
          if (a.km + (b.km - a.km) * t <= doneKm) dot(x, y, '#ff4a2a');
          else if (n++ % 3 < 2) dot(x, y, leg.mode === 'sea' ? '#ffffff' : '#e8b830');
        }
      }
    };
    for (const leg of legs) {
      const i = legIndex(leg);
      drawLeg(leg, state.trail.includes(i) ? Infinity : i === state.leg ? state.legKm : -1);
    }
    const next = state.leg != null ? CH.legs[state.leg].to : null;
    for (const id of places) {
      const [x, y] = project(PLACES[id].lat, PLACES[id].lon).map(Math.round);
      ctx.fillStyle = '#1e140c'; ctx.fillRect(x - 1, y - 1, 3, 3);
      ctx.fillStyle = state.visited.includes(id) ? '#b02828' : '#e8b830'; ctx.fillRect(x, y, 1, 1);
    }
    const here = herePoint().xy.map(Math.round);           // the party
    ctx.fillStyle = '#ffffff'; ctx.fillRect(here[0] - 2, here[1] - 2, 5, 5);
    ctx.fillStyle = '#b02828'; ctx.fillRect(here[0] - 1, here[1] - 1, 3, 3);

    // Name only the places visited, the next stop and Nicaea, so the map stays readable.
    const named = [...places].filter(id => (state.visited.includes(id) || id === next || id === 'nicaea')
      && !(PLACES[id].minor && id !== next && id !== state.at));
    const place = () => {
      const k = sizeCanvas(canvas, 0.68);
      labels.replaceChildren(...named.map(id => {
        const p = PLACES[id];
        const [x, y] = project(p.lat, p.lon);
        const [lx, ly, shift] = {
          above: [x + 0.5, y - 2, '-50%,-100%'], below: [x + 0.5, y + 3, '-50%,0'],
          left: [x - 3, y + 0.5, '-100%,-50%'], right: [x + 4, y + 0.5, '0,-50%'],
          'below-left': [x + 1, y + 3, '-100%,0'], 'above-left': [x + 1, y - 2, '-100%,-100%'],
        }[p.label || 'above'];
        return el('span', {
          class: 'map-label' + (id === next ? ' next' : ''),
          style: `left:${lx * k}px;top:${ly * k}px;transform:translate(${shift})`,
          text: p.name,
        });
      }));
    };
    resizeHandler = place;
    place();
  }

  // ---------------------------------------------------------------- the council
  // The hall is a little stage. Everyone breathes and shifts; the speaker
  // gestures under a bouncing arrow; some lines play a scene (`action` in data.js).
  const HALL_SPOTS = [
    { who: 'bishop', x: 6, y: 68 }, { who: 'bishop', x: 24, y: 68 },
    { who: 'vitus', x: 152, y: 68 }, { who: 'vincentius', x: 170, y: 68 },
    { who: 'emperor', x: 87, y: 48 },
    { who: 'athanasius', x: 40, y: 62 }, { who: 'alexander', x: 58, y: 58 },
    { who: 'arius', x: 118, y: 58 }, { who: 'nicholas', x: 136, y: 62 },
  ];
  const FRONT = { x: 88, y: 76 };     // on the carpet, before the throne
  let hall = null;                    // the live hall: { ctx, actors, frame, ... }

  // `decided`: the debate is over, so the Emperor is on his throne and Arius at the front.
  function makeActors(decided) {
    const [hero, friend] = state.party;
    const spots = HALL_SPOTS.filter(s => s.who !== hero.art && s.who !== friend.art)
      .concat([{ who: hero.art, x: 62, y: 80 }, { who: friend.art, x: 110, y: 80 }]);
    return spots.map((s, i) => {
      const atFront = decided && s.who === 'arius';
      const x = atFront ? FRONT.x : s.x, y = atFront ? FRONT.y : s.y;
      return { who: s.who, i, homeX: s.x, homeY: s.y, x, y, tx: x, ty: y,
        hidden: s.who === 'emperor' && !decided, hop: 0, cheer: 0, shake: 0 };
    });
  }

  function hallScene(lines, done, decided) {
    stopTravel();
    const canvas = el('canvas', { class: 'px', width: 192, height: 108, role: 'img', 'aria-label': 'The council hall at Nicaea' });
    let i = 0;
    const speech = speechBox(4, () => {
      i++;
      if (i < lines.length) showLine(lines[i]); else { hall = null; done(); }
    });
    setScreen(el('section', { class: 'screen' }, el('div', { class: 'scene-wrap' }, canvas), speech.box));
    hall = { ctx: canvas.getContext('2d'), actors: makeActors(decided), frame: 0, speaking: null, after: [], burst: 0 };
    hall.ctx.imageSmoothingEnabled = false;
    resizeHandler = () => sizeCanvas(canvas, 0.58);
    resizeHandler();
    const showLine = line => {
      speech.show(line);
      hall.speaking = line.who === 'narrator' ? null : artKey(person(line.who).art);
      act(line.action);
    };
    showLine(lines[0]);
    // Step the scene by elapsed time (60 steps a second), whatever the screen's refresh rate.
    let last = null;
    const tick = now => {
      if (!hall || !canvas.isConnected) return;
      if (last === null) last = now;
      const steps = Math.max(0, Math.min(30, Math.floor((now - last) / 16.7)));
      last += steps * 16.7;
      for (let n = 0; n < steps; n++) stepHall();
      drawHall();
      requestAnimationFrame(tick);
    };
    drawHall();
    requestAnimationFrame(tick);
  }

  function startCouncil() {
    state.stage = 'council';
    save();
    Sound.play('council');
    hallScene(CH.council, () => showQuiz(0), false);
  }

  const actor = who => hall.actors.find(a => a.who === who);
  const arrived = a => Math.abs(a.x - a.tx) < 0.5 && Math.abs(a.y - a.ty) < 0.5;

  // Run a line's scene. Steps that wait for someone to arrive go in `hall.after`.
  function act(action) {
    if (!action) return;
    const [kind, who] = action.split(':');
    const bishops = hall.actors.filter(a => a.who !== 'emperor' && a.who !== 'arius');
    if (kind === 'enter') {
      const e = actor('emperor');
      e.hidden = false;
      e.y = 110;
      e.ty = e.homeY;
      bishops.forEach(a => { a.cheer = 70; });
    } else if (kind === 'forward') {
      const a = actor(who);
      a.tx = FRONT.x;
      a.ty = FRONT.y;
    } else if (kind === 'slap') {
      const n = actor('nicholas'), r = actor('arius');
      n.tx = r.tx + 15;
      n.ty = r.ty;
      hall.after.push({
        ready: () => arrived(n),
        run: () => {
          r.shake = 30;
          hall.burst = 30;
          Sound.play('bad');
          hall.after.push({ wait: 70, run: () => { n.tx = n.homeX; n.ty = n.homeY; } });
        },
      });
    } else if (kind === 'cheer') {
      bishops.forEach(a => { a.cheer = 150; });
      Sound.play('good');
    } else if (kind === 'exit') {
      const a = actor(who);
      a.tx = FRONT.x;
      a.ty = 112;
      hall.after.push({ ready: () => arrived(a), run: () => { a.hidden = true; } });
    }
  }

  function stepHall() {
    hall.frame++;
    for (const a of hall.actors) {
      a.x += clamp(a.tx - a.x, -0.6, 0.6);
      a.y += clamp(a.ty - a.y, -0.6, 0.6);
      if (a.hop > 0) a.hop--;
      if (a.shake > 0) a.shake--;
      if (a.cheer > 0 && --a.cheer % 18 === 0) a.hop = 10;
      if (a.who === hall.speaking && a.hop === 0 && hall.frame % 40 === 0) a.hop = 10;   // gesture
    }
    if (hall.burst > 0) hall.burst--;
    hall.after = hall.after.filter(step => {
      if (step.wait != null ? --step.wait > 0 : !step.ready()) return true;
      step.run();
      return false;
    });
  }

  // Bigger arrow with a dark outline, so it shows against the gold and marble.
  const ARROW = ['KKKKKKKKK', 'KWGGGGGGK', '.KGGGGGK.', '..KGGGK..', '...KGK...', '....K....'];
  const ARROW_COLORS = { K: '#1a1a1a', G: '#e8b830', W: '#fff4c8' };
  const BURST = ['...W...', '.W.G.W.', '..GGG..', 'WGGWGGW', '..GGG..', '.W.G.W.', '...W...'];

  function drawHall() {
    const ctx = hall.ctx;
    const pixels = (rows, x0, y0, colors) => rows.forEach((row, y) => [...row].forEach((c, x) => {
      if (colors[c]) { ctx.fillStyle = colors[c]; ctx.fillRect(x0 + x, y0 + y, 1, 1); }
    }));
    ctx.drawImage(IMG.hall, 0, 0);
    const visible = hall.actors.filter(a => !a.hidden).sort((a, b) => a.y - b.y);
    for (const a of visible) {
      const walking = !arrived(a);
      let dy = Math.round(-2.5 * Math.sin(Math.PI * a.hop / 10));
      if (walking) dy -= (hall.frame >> 3) % 2;
      else if (!a.hop && (hall.frame + a.i * 23) % 120 < 60) dy += 1;         // breathing
      const dx = a.shake ? (a.shake % 4 < 2 ? -2 : 2) : 0;
      a.drawX = Math.round(a.x) + dx;
      a.drawY = Math.round(a.y) + dy;
      ctx.drawImage(IMG[a.who], a.drawX, a.drawY);
    }
    const r = actor('arius');
    if (hall.burst > 0 && r) pixels(BURST, r.drawX - 3, r.drawY + 4, { W: '#ffffff', G: '#e8b830' });
    const s = hall.speaking && visible.find(a => a.who === hall.speaking);
    if (s) {
      const cx = s.drawX + Math.floor(IMG[s.who].naturalWidth / 2);
      pixels(ARROW, cx - 4, s.drawY - 9 - ((hall.frame >> 4) % 2), ARROW_COLORS);
    }
  }

  function shuffled(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function showQuiz(n) {
    const item = CH.quiz[n];
    const last = n === CH.quiz.length - 1;
    let tries = 0;
    let solved = false;
    const feedback = el('p', { class: 'feedback' });
    const next = button(last ? 'See what the council decides ▸' : 'Next question ▸',
      () => (last ? showOutcome() : showQuiz(n + 1)));
    next.hidden = true;
    const options = shuffled(item.options).map(o => {
      const b = button(o.text, () => {
        if (solved || b.disabled) return;
        tries++;
        if (o.correct) {
          solved = true;
          if (tries === 1) state.firstTry++;
          save();
          Sound.play('good');
          b.classList.add('right');
          options.forEach(x => { if (x !== b) x.disabled = true; });
          feedback.className = 'feedback good';
          feedback.textContent = 'Yes! ' + item.why;
          next.hidden = false;
          next.focus({ preventScroll: true });
        } else {
          Sound.play('bad');
          b.classList.add('wrong');
          b.disabled = true;
          feedback.className = 'feedback bad';
          feedback.textContent = 'Not quite. Think about what this would mean for Jesus, and try again.';
        }
      }, 'wide');
      return b;
    });
    setScreen(el('section', { class: 'screen' },
      el('div', { class: 'panel quiz' },
        el('div', { class: 'muted', text: `The bishops decide: question ${n + 1} of ${CH.quiz.length}` }),
        el('p', { class: 'q', text: item.q }),
        options,
        feedback,
        el('div', { class: 'row' }, next))));
  }

  function showOutcome() {
    hallScene(CH.outcome, showEnd, true);
  }

  function showEnd() {
    const late = state.day - deadline();
    const key = 'consubstantial with the Father';
    const creedLine = line => {
      const at = line.indexOf(key);
      return at < 0 ? el('p', { text: line })
        : el('p', {}, line.slice(0, at), el('em', { text: key }), line.slice(at + key.length));
    };
    const stat = (label, value) => el('div', {}, el('b', { text: String(value) }), label);
    clearSave();
    Sound.play('good');
    setScreen(el('section', { class: 'screen' },
      el('div', { class: 'end' },
        el('h2', { text: 'The Council of Nicaea, A.D. 325' }),
        el('div', { class: 'panel' },
          el('p', { text: 'Today, at Sunday Mass, Catholics all over the world still pray the Creed that began at Nicaea:' }),
          el('div', { class: 'creed' }, CH.creed.map(creedLine)),
          el('div', { class: 'summary' },
            stat(`days from ${PLACES[see().start].name}`, state.day),
            stat('arrival', late <= 0 ? 'On time' : `${late} days late`),
            stat('km travelled', state.km),
            stat('right first time', `${state.firstTry} of ${CH.quiz.length}`))),
        el('p', { class: 'muted', text: 'Next: Chapter II, Constantinople, A.D. 381 (coming soon). Try the journey again from another city!' }),
        el('div', { class: 'row' }, button('Play again', showTitle)))));
  }

  // ---------------------------------------------------------------- start
  // Testing shortcut: index.html?screen=travel&see=rome&at=thessalonica jumps
  // straight to a screen. Screens: sees, choose, intro, shop, travel, map, fork,
  // place, event&id=, hall&line=&steps=, quiz&n=, outcome&line=&steps=, end. Add &leg=<next place>&km= to be
  // part-way along a leg, and &storm=1 for a storm at sea.
  function debugJump(screen, q) {
    state = newState(q.get('see') || 'alexandria');
    state.food = 40;
    state.coins = 60;
    const at = q.get('at');
    if (at && PLACES[at]) { state.at = at; state.visited.push(at); state.day = 20; state.post = true; }
    const legTo = q.get('leg');
    const leg = legTo && legsFrom(state.at).find(l => l.to === legTo);
    if (leg) {
      state.leg = legIndex(leg);
      state.legKm = Number(q.get('km') || leg.km / 2);
      state.atStop = false;
    }
    if (q.get('storm')) state.storm = 5;
    const id = q.get('id');
    switch (screen) {
      case 'sees': return showSees();
      case 'choose': return showChoose();
      case 'intro': return talk(see().intro, showStartShop);
      case 'shop': return showStartShop();
      case 'travel': return showTravel();
      case 'map': return showMap();
      case 'fork': showTravel(); return showFork();
      case 'place': showTravel(); return openPlace(state.at);
      case 'event':
        showTravel();
        return showEvent(CH.events[id] || CH.randomEvents.find(e => e.id === id) || CH.randomEvents[0]);
      case 'hall':
      case 'outcome': {
        if (screen === 'hall') startCouncil(); else showOutcome();
        const next = () => document.querySelector('.speech-box .btn').click();
        for (let n = Number(q.get('line') || 0); n > 0; n--) next();
        for (let n = Number(q.get('steps') || 0); n > 0; n--) stepHall();   // fast-forward the scene
        drawHall();
        return;
      }
      case 'quiz': return showQuiz(Number(q.get('n') || 0));
      case 'end': return showEnd();
      default: return showTitle();
    }
  }

  loadArt().then(() => {
    const q = new URLSearchParams(location.search);
    if (q.get('screen')) debugJump(q.get('screen'), q);
    else showTitle();
  }).catch(err => {
    app.replaceChildren(el('p', { text: err.message }));
  });
})();
