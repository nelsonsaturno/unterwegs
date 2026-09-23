/* Unterwegs – Deutsch A2·B1 (offline). Vanilla JS, no dependencies. */
(function () {
  'use strict';
  var C = window.COURSE;
  var main = document.getElementById('main');
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function md(s) {
    var h = esc(s);
    h = h.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
    h = h.replace(/==(.+?)==/g, '<mark>$1</mark>');
    h = h.replace(/(^|[\s(„>])\*(\S(?:[^*]*?\S)?)\*(?=[\s).,:;!?<]|$)/g, '$1<i>$2</i>');
    return h;
  }
  function mdBlock(s) {
    return String(s).split(/\n{2,}/).map(function (p) { return '<p>' + md(p.trim()).replace(/\n/g, '<br>') + '</p>'; }).join('');
  }
  function norm(s) {
    return String(s).toLowerCase().replace(/ß/g, 'ss').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
      .replace(/[.,!?;:„“"'«»()–—\-…]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function shuffle(arr, seed) {
    var a = arr.slice(), s = seed || 1;
    for (var i = a.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      var j = Math.floor((s / 233280) * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function toast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }
  function unitById(id) { for (var i = 0; i < C.units.length; i++) if (C.units[i].id === id) return C.units[i]; return null; }

  /* ---------------- icons ---------------- */
  var I = {
    play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none"/>',
    stop: '<rect x="6.5" y="6.5" width="11" height="11" rx="2" fill="currentColor" stroke="none"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    left: '<path d="M15 5l-7 7 7 7"/>',
    right: '<path d="M9 5l7 7-7 7"/>',
    sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    cards: '<rect x="3" y="7" width="13" height="13" rx="2.5"/><path d="M7.5 4h10A2.5 2.5 0 0 1 20 6.5v10"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4.5 6h.01M4.5 12h.01M4.5 18h.01" stroke-width="3"/>',
    book: '<path d="M5 4.5h10.5a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h10.5"/>',
    head: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.5"/>',
    pen: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    words: '<path d="M3.5 18l4.5-12 4.5 12M5.2 14h5.6"/><circle cx="17" cy="14.5" r="3"/><path d="M20 11v7"/>',
    puzzle: '<rect x="3.5" y="4" width="6" height="6" rx="1.5"/><path d="M13 7h7.5M13 17h7.5"/><rect x="3.5" y="14" width="6" height="6" rx="1.5"/>',
    read: '<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5v13"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12h.01" stroke-width="3"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 20h14"/>',
    upload: '<path d="M12 20V9M7 13.5l5-5 5 5M5 4h14"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4.5V11h-6.5"/>',
    plane: '<path d="M21 3L3 10.5l7 2.5 2.5 7z"/><path d="M21 3L10 13"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6 7l1 13h10l1-13"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    timer: '<circle cx="12" cy="13" r="7.5"/><path d="M12 9.5V13l2.5 2M9.5 2.5h5"/>',
    home: '<path d="M4 11l8-7 8 7v9h-5.5v-6h-5v6H4z"/>'
  };
  function icon(n, cls) {
    return '<svg class="i ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[n] + '</svg>';
  }
  var CH_FLAG = '<span class="flag" aria-hidden="true"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M10 5h4v5h5v4h-5v5h-4v-5H5v-4h5z" fill="#fff"/></svg></span>';

  /* ---------------- state ---------------- */
  var KEY = 'uw-progress-v1';
  var DEFAULT_SETTINGS = { theme: 'auto', rate: 1, en: true, dmode: 'de-en', dir: 'de-en' };
  var S = load();
  function load() {
    var d = {};
    try { d = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { d = {}; }
    return {
      done: d.done || {}, scores: d.scores || {}, srs: d.srs || {}, writing: d.writing || {}, last: d.last || null,
      answers: d.answers || {}, stats: d.stats || { reviews: 0 },
      settings: Object.assign({}, DEFAULT_SETTINGS, d.settings || {})
    };
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ } }

  var SECS = [
    { id: 'ueberblick', label: 'Überblick', icon: 'target', count: false },
    { id: 'woerter', label: 'Wörter', icon: 'words' },
    { id: 'hoeren', label: 'Hören', icon: 'head' },
    { id: 'grammatik', label: 'Grammatik', icon: 'book' },
    { id: 'ueben', label: 'Üben', icon: 'puzzle' },
    { id: 'lesen', label: 'Lesen', icon: 'read' },
    { id: 'schreiben', label: 'Schreiben', icon: 'pen' },
    { id: 'sprechen', label: 'Sprechen', icon: 'mic' }
  ];
  var COUNTED = SECS.filter(function (s) { return s.count !== false; }).map(function (s) { return s.id; });
  function secById(id) { for (var i = 0; i < SECS.length; i++) if (SECS[i].id === id) return SECS[i]; return SECS[0]; }
  function isDone(u, s) { return !!(S.done[u] && S.done[u][s]); }
  function setDone(u, s, v) {
    S.done[u] = S.done[u] || {};
    var was = !!S.done[u][s];
    S.done[u][s] = v === undefined ? true : v;
    save();
    if (!was && S.done[u][s]) {
      var tab = $('.tab[data-s="' + s + '"]');
      if (tab && !$('.ok', tab)) tab.insertAdjacentHTML('beforeend', icon('check', 's ok'));
    }
  }
  function unitDone(u) { return COUNTED.filter(function (s) { return isDone(u, s); }).length; }

  /* ---------------- theme ---------------- */
  function applyTheme() {
    var t = S.settings.theme;
    if (t === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  }
  applyTheme();

  /* ---------------- audio player ---------------- */
  var Player = (function () {
    var a = new Audio();
    a.preload = 'auto';
    var token = 0, curBtn = null, onEnd = null;
    function setBtn(btn, on) {
      if (!btn) return;
      btn.classList.toggle('on', on);
      var svg = btn.querySelector('svg');
      if (svg) {
        var small = svg.classList.contains('s');
        svg.outerHTML = icon(on ? 'stop' : 'play', small ? 's' : '');
      }
      if (btn.classList.contains('play')) btn.setAttribute('aria-label', on ? 'Stopp' : (btn.dataset.label || 'Abspielen'));
    }
    function stop() {
      token++;
      a.pause();
      setBtn(curBtn, false); curBtn = null;
      var cb = onEnd; onEnd = null;
      if (cb) cb(true);
    }
    function playList(ids, opts) {
      opts = opts || {};
      stop();
      var my = ++token, i = 0;
      curBtn = opts.btn || null; onEnd = opts.onEnd || null;
      setBtn(curBtn, true);
      function finish() {
        if (my !== token) return;
        setBtn(curBtn, false); curBtn = null;
        var cb = onEnd; onEnd = null;
        if (cb) cb(false);
      }
      function next() {
        if (my !== token) return;
        if (i >= ids.length) { finish(); return; }
        var id = ids[i];
        if (opts.onItem) opts.onItem(i);
        i++;
        if (!id) { next(); return; }
        a.src = 'audio/' + id + '.mp3';
        a.defaultPlaybackRate = S.settings.rate; a.playbackRate = S.settings.rate;
        try { a.preservesPitch = true; a.webkitPreservesPitch = true; } catch (e) {}
        a.onended = function () { if (my === token) setTimeout(next, opts.gap == null ? 350 : opts.gap); };
        a.onerror = function () { if (my === token) { toast('Audio nicht gefunden – bitte einmal online öffnen'); stop(); } };
        var p = a.play();
        if (p && p.catch) p.catch(function (err) { if (my === token && err && err.name !== 'AbortError') { toast('Audio konnte nicht abgespielt werden'); stop(); } });
      }
      next();
    }
    function toggle(btn, ids, opts) {
      if (curBtn === btn) { stop(); return; }
      opts = opts || {}; opts.btn = btn;
      playList(ids, opts);
    }
    return { playList: playList, toggle: toggle, stop: stop, isCurrent: function (b) { return curBtn === b; } };
  })();

  function hl(prefix, i) {
    $$('[id^="' + prefix + '"]').forEach(function (el) { el.classList.remove('cur'); });
    if (i < 0) return;
    var el = document.getElementById(prefix + i);
    if (el) {
      el.classList.add('cur');
      var r = el.getBoundingClientRect();
      if (r.top < 120 || r.bottom > window.innerHeight - 40) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }
  function playBtn(ids, label, cls) {
    ids = [].concat(ids).filter(Boolean);
    if (!ids.length) return '';
    return '<button class="play ' + (cls || '') + '" data-play="' + ids.join(',') + '" data-label="' + esc(label || 'Abspielen') + '" aria-label="' + esc(label || 'Abspielen') + '">' + icon('play') + '</button>';
  }

  /* ---------------- top bar ---------------- */
  function topbar(kind, title) {
    var nav = '<nav class="nav-links" aria-label="Werkzeuge">' +
      '<a href="#/karten" class="' + (kind === 'karten' ? 'on' : '') + '" title="Karteikarten">' + icon('cards') + '<span class="lbl">Karten</span></a>' +
      '<a href="#/woerter" class="' + (kind === 'woerter' ? 'on' : '') + '" title="Wortliste">' + icon('list') + '<span class="lbl">Wörter</span></a>' +
      '<a href="#/grammatik" class="' + (kind === 'grammatik' ? 'on' : '') + '" title="Grammatik">' + icon('book') + '<span class="lbl">Grammatik</span></a>' +
      '<a href="#/einstellungen" class="' + (kind === 'einstellungen' ? 'on' : '') + '" title="Einstellungen" aria-label="Einstellungen">' + icon('sliders') + '</a>' +
      '</nav>';
    var left = kind === 'home'
      ? '<a class="brand" href="#/"><span class="brand-mark">' + icon('plane') + '</span><span><span class="brand-name">Unterwegs</span> <span class="brand-sub">Deutsch A2 → B1</span></span></a>'
      : '<a class="icon-btn" href="#/" aria-label="Zur Übersicht">' + icon('left') + '</a><span class="title">' + esc(title || '') + '</span>';
    document.getElementById('topbar').innerHTML = '<div class="topbar-in">' + left + '<span class="spacer"></span>' + nav + '</div>';
  }

  /* ---------------- home ---------------- */
  function greeting() {
    var h = new Date().getHours();
    return h < 11 ? 'Guten Morgen!' : h < 18 ? 'Guten Tag!' : 'Guten Abend!';
  }
  function ring(pct) {
    var r = 36, c = 2 * Math.PI * r;
    return '<div class="ring" role="img" aria-label="' + pct + ' Prozent erledigt"><svg viewBox="0 0 84 84"><circle class="ring-track" cx="42" cy="42" r="' + r + '" fill="none" stroke-width="8"/>' +
      '<circle class="ring-fill" cx="42" cy="42" r="' + r + '" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - pct / 100)).toFixed(1) + '"/></svg><span class="v">' + pct + '%</span></div>';
  }
  function nextStep() {
    if (S.last && unitById(S.last.u) && unitDone(S.last.u) < COUNTED.length) {
      var sec = S.last.s;
      if (isDone(S.last.u, sec)) {
        for (var k = 0; k < COUNTED.length; k++) if (!isDone(S.last.u, COUNTED[k])) { sec = COUNTED[k]; break; }
      }
      return { u: S.last.u, s: sec, label: 'Weiter: Lektion ' + S.last.u + ' · ' + secById(sec).label };
    }
    for (var i = 0; i < C.units.length; i++) {
      var u = C.units[i];
      for (var j = 0; j < COUNTED.length; j++) {
        if (!isDone(u.id, COUNTED[j])) {
          var first = unitDone(u.id) === 0;
          return { u: u.id, s: first ? 'ueberblick' : COUNTED[j], label: (first ? 'Starten: Lektion ' : 'Weiter: Lektion ') + u.id + (first ? '' : ' · ' + secById(COUNTED[j]).label) };
        }
      }
    }
    return { u: 1, s: 'ueberblick', label: 'Alles erledigt – wiederholen' };
  }
  function unitCard(u) {
    var d = unitDone(u.id), p = d / COUNTED.length;
    return '<a class="card unit-card ' + (p === 1 ? 'done' : '') + '" href="#/u/' + u.id + '">' +
      '<div class="unit-num">' + (p === 1 ? icon('check') : u.id) + '</div>' +
      '<div><h3>' + esc(u.title) + '</h3><div class="sub">' + esc(u.subtitle) + '</div>' +
      '<div class="meta"><span class="chip lvl">' + esc(u.level) + '</span><span class="chip">' + esc(u.theme) + '</span></div>' +
      '<div class="small muted" style="margin-top:6px">' + esc(u.focus) + '</div>' +
      '<div class="bar" aria-label="' + d + ' von ' + COUNTED.length + ' Abschnitten"><i style="width:' + (p * 100) + '%"></i></div></div>' +
      '<span class="go muted">' + icon('right') + '</span></a>';
  }
  function renderHome() {
    topbar('home');
    var total = C.units.length * COUNTED.length;
    var done = C.units.reduce(function (n, u) { return n + unitDone(u.id); }, 0);
    var pct = Math.round((done / total) * 100);
    var due = dueCards().length;
    var learned = Object.keys(S.srs).filter(function (k) { return S.srs[k].box >= 3; }).length;
    var sc = Object.keys(S.scores).map(function (k) { return S.scores[k]; });
    var t = sc.reduce(function (a, b) { return a + b.t; }, 0), c = sc.reduce(function (a, b) { return a + b.c; }, 0);
    var acc = t ? Math.round((100 * c) / t) + '%' : '–';
    var nx = nextStep();
    main.innerHTML =
      '<section class="card hero"><div><p class="muted small" style="margin:0">' + greeting() + '</p><h1>Deutsch A2 → B1</h1>' +
      '<p class="muted" style="margin-top:0">' + C.units.length + ' Lektionen · Schweizer Alltag · fide-Themen · komplett offline</p>' +
      '<div class="row" style="margin-top:14px"><a class="btn primary" href="#/u/' + nx.u + '/' + nx.s + '">' + icon('play', 's') + ' ' + esc(nx.label) + '</a>' +
      '<a class="btn" href="#/karten">' + icon('cards', 's') + ' Karteikarten' + (due ? ' <span class="chip lvl">' + due + ' fällig</span>' : '') + '</a></div></div>' +
      ring(pct) + '</section>' +
      '<div class="stats"><div class="stat"><b>' + done + '/' + total + '</b><span>Abschnitte erledigt</span></div>' +
      '<div class="stat"><b>' + learned + '/' + allVocab().length + '</b><span>Wörter sicher</span></div>' +
      '<div class="stat"><b>' + acc + '</b><span>Übungen richtig</span></div></div>' +
      '<h2>Lektionen</h2><div class="units">' + C.units.map(unitCard).join('') + '</div>' +
      '<h2>Werkzeuge</h2><div class="tools">' +
      '<a class="card tool" href="#/karten"><span class="ic">' + icon('cards') + '</span><div><b>Karteikarten</b><span>Alle ' + allVocab().length + ' Wörter mit Wiederholungssystem</span></div></a>' +
      '<a class="card tool" href="#/woerter"><span class="ic">' + icon('search') + '</span><div><b>Wortliste</b><span>Suchen, anhören, nachschlagen</span></div></a>' +
      '<a class="card tool" href="#/grammatik"><span class="ic">' + icon('book') + '</span><div><b>Grammatik</b><span>Alle Themen auf einen Blick</span></div></a>' +
      '</div>' +
      '<p class="muted small center" style="margin-top:36px">Alle Texte, Dialoge und Übungen sind Originalmaterial für diesen Kurs.<br>Audio mit synthetischen Stimmen erzeugt (Piper TTS). Schweizer Schreibweise: ss statt ß.</p>';
  }

  /* ---------------- unit ---------------- */
  function renderUnit(uid, sec) {
    var u = unitById(uid);
    if (!u) { renderHome(); return; }
    if (!SECS.some(function (s) { return s.id === sec; })) sec = 'ueberblick';
    S.last = { u: uid, s: sec }; save();
    topbar('unit', 'Lektion ' + u.id);
    var tabs = SECS.map(function (s) {
      return '<a class="tab ' + (s.id === sec ? 'on' : '') + '" data-s="' + s.id + '" href="#/u/' + uid + '/' + s.id + '"' + (s.id === sec ? ' aria-current="page"' : '') + '>' +
        esc(s.label) + (isDone(uid, s.id) ? icon('check', 's ok') : '') + '</a>';
    }).join('');
    main.innerHTML = '<div class="unit-head"><div class="row"><span class="chip">Lektion ' + u.id + '</span><span class="chip lvl">' + esc(u.level) + '</span><span class="chip">' + esc(u.theme) + '</span></div>' +
      '<h1>' + esc(u.title) + '</h1><p class="muted" style="margin:0">' + esc(u.subtitle) + '</p></div>' +
      '<nav class="tabs" aria-label="Abschnitte">' + tabs + '</nav><div id="sec"></div>';
    var el = document.getElementById('sec');
    var fn = { ueberblick: secOverview, woerter: secVocab, hoeren: secDialogue, grammatik: secGrammar, ueben: secExercises, lesen: secReading, schreiben: secWriting, sprechen: secSpeaking }[sec];
    fn(u, el);
    el.insertAdjacentHTML('beforeend', secFooter(u, sec));
    var on = $('.tab.on');
    if (on && on.scrollIntoView) { var tb = on.parentNode; tb.scrollLeft = on.offsetLeft - tb.clientWidth / 2 + on.clientWidth / 2; }
  }
  function secFooter(u, sec) {
    var i = SECS.findIndex(function (s) { return s.id === sec; });
    var nxt = SECS[i + 1], nu = unitById(u.id + 1);
    var href = nxt ? '#/u/' + u.id + '/' + nxt.id : nu ? '#/u/' + nu.id : '#/';
    var label = nxt ? nxt.label : nu ? 'Lektion ' + nu.id : 'Zur Übersicht';
    var counted = COUNTED.indexOf(sec) >= 0;
    var doneBtn = counted
      ? '<button class="btn ' + (isDone(u.id, sec) ? '' : 'primary') + '" data-act="done" data-u="' + u.id + '" data-s="' + sec + '">' + (isDone(u.id, sec) ? icon('check', 's') + ' Erledigt' : 'Als erledigt markieren') + '</button>'
      : '<span></span>';
    return '<div class="sec-foot">' + doneBtn + '<a class="btn" href="' + href + '" data-next="' + u.id + ':' + sec + '">Weiter: ' + esc(label) + ' ' + icon('right', 's') + '</a></div>';
  }

  function secOverview(u, el) {
    var swiss = u.swiss.length ? '<section class="card swiss" style="margin-top:14px"><h3 style="margin-top:0">' + CH_FLAG + 'Typisch Schweiz</h3><table><tbody>' +
      u.swiss.map(function (s) { return '<tr><td>' + esc(s.ch) + '</td><td class="muted">' + (s.std && s.std !== '–' ? 'DE: ' + esc(s.std) : '') + '</td><td>' + esc(s.en) + '</td></tr>'; }).join('') +
      '</tbody></table></section>' : '';
    el.innerHTML =
      '<section class="card"><h3 style="margin-top:0">In dieser Lektion lernen Sie …</h3><ul class="goals">' +
      u.goals.map(function (g) { return '<li>' + esc(g.de) + '<span class="en">' + esc(g.en) + '</span></li>'; }).join('') + '</ul>' +
      '<p class="small" style="margin-bottom:0"><b>Grammatik:</b> ' + esc(u.focus) + '</p></section>' + swiss +
      '<section class="card" style="margin-top:14px"><ul class="sec-list">' +
      SECS.slice(1).map(function (s) {
        var extra = { woerter: u.vocab.length + ' Wörter mit Audio', hoeren: u.dialogue.lines.length + ' Sätze · ' + u.dialogue.questions.length + ' Fragen', grammatik: u.grammar.title,
          ueben: u.exercises.length + ' Übungen · ' + u.exercises.reduce(function (n, e) { return n + e.items.length; }, 0) + ' Aufgaben', lesen: u.reading.title,
          schreiben: 'Aufgabe mit Musterlösung', sprechen: u.speaking.prompts.length + ' Fragen mit Beispielantworten' }[s.id];
        return '<li class="' + (isDone(u.id, s.id) ? 'done' : '') + '"><a href="#/u/' + u.id + '/' + s.id + '"><span class="ic">' + icon(isDone(u.id, s.id) ? 'check' : s.icon) + '</span><span style="flex:1"><b>' + esc(s.label) + '</b><br><span class="small muted">' + esc(extra) + '</span></span>' + icon('right', 's') + '</a></li>';
      }).join('') + '</ul></section>';
  }

  /* ----- vocab ----- */
  function wordHtml(w) {
    var m = /^(der|die|das) (.+)$/.exec(w);
    return m ? '<span class="art-' + m[1] + '">' + m[1] + '</span> ' + esc(m[2]) : esc(w);
  }
  function formsHtml(v) {
    if (!v.forms || v.forms === '–') return '';
    if (/^(der|die|das) /.test(v.de)) return v.forms === '(Pl.)' ? ' (Pl.)' : ', ' + esc(v.forms);
    return ' · ' + esc(v.forms);
  }
  function vcard(v) {
    return '<div class="card vcard">' + playBtn(v.aw, 'Wort anhören') +
      '<div><div><span class="vword">' + wordHtml(v.de) + '</span><span class="vforms">' + formsHtml(v) + '</span></div>' +
      '<div class="ven">' + esc(v.en) + '</div>' +
      '<div class="vex">' + playBtn(v.ae, 'Beispiel anhören', 'sm') + '<div>' + esc(v.ex) + '<span class="en">' + esc(v.exEn) + '</span></div></div></div></div>';
  }
  function enSeg() {
    return '<div class="seg" role="group" aria-label="Übersetzung"><button data-act="en" data-v="1" class="' + (S.settings.en ? 'on' : '') + '">EN zeigen</button><button data-act="en" data-v="0" class="' + (!S.settings.en ? 'on' : '') + '">EN verstecken</button></div>';
  }
  function secVocab(u, el) {
    var words = u.vocab.map(function (v) { return v.aw; });
    var both = []; u.vocab.forEach(function (v) { both.push(v.aw, v.ae); });
    el.innerHTML = '<div class="toolbar"><div class="row">' +
      '<button class="btn sm" data-play="' + words.join(',') + '" data-hl="vc" data-gap="700">' + icon('play', 's') + ' Alle Wörter</button>' +
      '<button class="btn sm" data-play="' + both.join(',') + '" data-gap="500" data-hl2="vc">' + icon('play', 's') + ' Mit Beispielen</button></div>' + enSeg() + '</div>' +
      '<div class="vocab ' + (S.settings.en ? '' : 'hide-en') + '" id="vlist">' + u.vocab.map(function (v, i) { return vcard(v).replace('class="card vcard"', 'class="card vcard" id="vc' + i + '"'); }).join('') + '</div>' +
      '<div class="card" style="margin-top:16px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap"><div><b>Karteikarten</b><div class="small muted">Die ' + u.vocab.length + ' Wörter dieser Lektion mit dem Wiederholungssystem lernen</div></div>' +
      '<a class="btn primary" href="#/karten/' + u.id + '">' + icon('cards', 's') + ' Wörter üben</a></div>';
  }

  /* ----- dialogue ----- */
  function secDialogue(u, el) {
    var d = u.dialogue, mode = S.settings.dmode;
    el.innerHTML = '<section class="card"><h2 style="margin-top:0">' + esc(d.title) + '</h2><p class="muted">' + esc(d.intro) + '</p>' +
      '<div class="speakers">' + Object.keys(d.speakers).map(function (k) { return '<span><i class="spk-dot bg-' + k + '"></i>' + esc(d.speakers[k]) + '</span>'; }).join('') + '</div>' +
      '<div class="toolbar" style="margin:14px 0 0"><button class="btn primary" data-play="' + d.lines.map(function (l) { return l.audio; }).join(',') + '" data-hl="ln" data-gap="450">' + icon('play', 's') + ' Ganzen Dialog hören</button>' +
      '<div class="seg" role="group" aria-label="Textanzeige">' + [['listen', 'Nur hören'], ['de', 'Deutsch'], ['de-en', '+ Englisch']].map(function (m) {
        return '<button data-act="dmode" data-v="' + m[0] + '" class="' + (mode === m[0] ? 'on' : '') + '">' + m[1] + '</button>';
      }).join('') + '</div></div>' +
      '<p class="small muted" style="margin:10px 0 0">Tipp: Hören Sie zuerst ohne Text („Nur hören"), beantworten Sie die Fragen und lesen Sie dann mit.</p></section>' +
      '<div class="dlg mode-' + mode + '" id="dlg" style="margin-top:14px">' + d.lines.map(function (l, i) {
        return '<div class="line ' + l.s + '" id="ln' + i + '">' + playBtn(l.audio, 'Satz anhören', 'sm') + '<div><div class="who c-' + l.s + '">' + esc(d.speakers[l.s]) + '</div><div class="de">' + md(l.de) + '</div><div class="en-t">' + esc(l.en) + '</div></div></div>';
      }).join('') + '</div>' +
      '<h2>Haben Sie alles verstanden?</h2><section class="card" id="dq"></section>';
    renderQuestions(document.getElementById('dq'), d.questions, u.id + '-hq', function () { setDone(u.id, 'hoeren'); });
  }

  /* ----- comprehension questions ----- */
  function renderQuestions(box, qs, key, onChecked) {
    var sel = qs.map(function () { return null; });
    function draw() {
      box.innerHTML = qs.map(function (q, i) {
        var opts = q.type === 'tf' ? ['Richtig', 'Falsch'] : q.options;
        return '<div class="q"><div class="qt"><span class="qn">' + (i + 1) + '.</span><span>' + md(q.q) + '</span></div><div class="opts">' +
          opts.map(function (o, j) { return '<button class="opt" data-i="' + i + '" data-j="' + j + '">' + esc(o) + '</button>'; }).join('') +
          '</div><div class="fb" hidden></div></div>';
      }).join('') + '<div class="ex-foot"><span class="score"></span><div class="row"><button class="btn" data-reset>' + icon('refresh', 's') + ' Nochmal</button><button class="btn primary" data-check>Prüfen</button></div></div>';
      sel = qs.map(function () { return null; });
    }
    draw();
    box.onclick = function (e) {
      var o = e.target.closest('.opt');
      if (o && !box.classList.contains('checked')) {
        var i = +o.dataset.i;
        sel[i] = +o.dataset.j;
        $$('.opt[data-i="' + i + '"]', box).forEach(function (b) { b.classList.toggle('sel', b === o); });
        return;
      }
      if (e.target.closest('[data-reset]')) { box.classList.remove('checked'); draw(); return; }
      if (e.target.closest('[data-check]')) {
        var c = 0;
        qs.forEach(function (q, i) {
          var right = q.type === 'tf' ? (q.a ? 0 : 1) : q.a;
          var ok = sel[i] === right;
          if (ok) c++;
          $$('.opt[data-i="' + i + '"]', box).forEach(function (b) {
            var j = +b.dataset.j;
            b.classList.remove('sel');
            if (j === right) b.classList.add(ok ? 'good' : 'miss');
            if (j === sel[i] && !ok) b.classList.add('bad');
          });
          var fb = box.querySelectorAll('.fb')[i];
          fb.hidden = false;
          fb.className = 'fb ' + (ok ? 'good' : 'bad');
          fb.innerHTML = (ok ? icon('check', 's') + ' Richtig!' : icon('x', 's') + (sel[i] == null ? ' Keine Antwort.' : ' Leider falsch.')) + (q.why ? ' <span class="sol">' + esc(q.why) + '</span>' : '');
        });
        box.classList.add('checked');
        var sc = $('.score', box);
        sc.textContent = c + ' / ' + qs.length + ' richtig';
        sc.className = 'score' + (c === qs.length ? ' good' : '');
        S.scores[key] = { c: c, t: qs.length }; save();
        if (onChecked) onChecked(c, qs.length);
      }
    };
  }

  /* ----- grammar ----- */
  function tableHtml(rows) {
    return '<div class="tbl-wrap"><table class="tbl"><thead><tr>' + rows[0].map(function (c) { return '<th>' + md(c) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.slice(1).map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + md(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  }
  function examplesHtml(exs) {
    return '<div class="examples">' + exs.map(function (x) {
      return '<div class="ex">' + playBtn(x.audio, 'Beispiel anhören', 'sm') + '<div><div>' + md(x.de) + '</div>' + (x.en ? '<div class="en-t">' + esc(x.en) + '</div>' : '') + '</div></div>';
    }).join('') + '</div>';
  }
  function grammarHtml(g) {
    return '<section class="card gtext"><h2 style="margin-top:0">' + esc(g.title) + '</h2>' + (g.summary ? '<p class="muted">' + md(g.summary) + '</p>' : '') + '</section>' +
      g.sections.map(function (s) {
        return '<section class="card gtext" style="margin-top:14px"><h3 style="margin-top:0">' + esc(s.h) + '</h3>' +
          (s.text ? mdBlock(s.text) : '') + (s.table ? tableHtml(s.table) : '') + (s.examples ? examplesHtml(s.examples) : '') + (s.text2 ? mdBlock(s.text2) : '') + '</section>';
      }).join('') +
      (g.tip ? '<div class="tip">' + icon('bulb') + '<div><b>Tipp</b>' + mdBlock(g.tip) + '</div></div>' : '');
  }
  function secGrammar(u, el) {
    el.innerHTML = grammarHtml(u.grammar) +
      '<div class="card" style="margin-top:16px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap"><div><b>Jetzt üben</b><div class="small muted">' + u.exercises.length + ' Übungen zu diesem Thema</div></div><a class="btn primary" href="#/u/' + u.id + '/ueben">' + icon('puzzle', 's') + ' Zu den Übungen</a></div>';
  }

  /* ----- exercises ----- */
  var KIND = { choice: 'Auswahl', gap: 'Lücken', order: 'Satzbau', match: 'Zuordnen', dictation: 'Diktat' };
  function secExercises(u, el) {
    el.innerHTML = '<p class="muted" style="margin-top:0">Antworten Sie zuerst alle Aufgaben einer Übung und drücken Sie dann auf <b>Prüfen</b>. Nach dem Prüfen können Sie die richtigen Sätze anhören.</p>' +
      u.exercises.map(function (ex, i) {
        var sc = S.scores[u.id + '-ex' + i];
        return '<section class="card ex-card" id="ex' + i + '"><h3><span class="kind">' + (KIND[ex.type] || '') + '</span>' + (sc ? '<span class="chip ' + (sc.c === sc.t ? 'lvl' : '') + '">zuletzt ' + sc.c + '/' + sc.t + '</span>' : '') + '</h3><p style="margin:-4px 0 10px;font-weight:650">' + esc(ex.title) + '</p><div class="ex-body"></div></section>';
      }).join('');
    u.exercises.forEach(function (ex, i) {
      var card = document.getElementById('ex' + i);
      var key = u.id + '-ex' + i;
      var done = function (c, t) {
        S.scores[key] = { c: c, t: t }; save();
        var chip = $('h3 .chip', card);
        var html = '<span class="chip ' + (c === t ? 'lvl' : '') + '">zuletzt ' + c + '/' + t + '</span>';
        if (chip) chip.outerHTML = html; else $('h3', card).insertAdjacentHTML('beforeend', html);
        if (u.exercises.every(function (_, k) { return S.scores[u.id + '-ex' + k]; })) setDone(u.id, 'ueben');
      };
      ({ choice: exChoice, gap: exGap, order: exOrder, match: exMatch, dictation: exDictation })[ex.type](ex, $('.ex-body', card), done, i + u.id * 17);
    });
  }
  function exFoot() {
    return '<div class="ex-foot"><span class="score"></span><div class="row"><button class="btn" data-reset>' + icon('refresh', 's') + ' Nochmal</button><button class="btn primary" data-check>Prüfen</button></div></div>';
  }
  function setScore(body, c, t) {
    var sc = $('.score', body);
    sc.textContent = c + ' / ' + t + ' richtig' + (c === t ? ' – super!' : '');
    sc.className = 'score' + (c === t ? ' good' : '');
  }
  function fbHtml(ok, full, audioId, extra) {
    return (ok ? '<span>' + icon('check', 's') + ' Richtig!</span>' : '<span>' + icon('x', 's') + ' Richtig ist:</span> <span class="sol">' + md(full) + '</span>') +
      (extra || '') + (audioId ? ' ' + playBtn(audioId, 'Richtigen Satz anhören', 'sm') : '');
  }
  function blanksHtml(q) {
    var n = 0;
    return esc(q).replace(/___/g, function () { return '<span class="blank" data-b="' + (n++) + '">&nbsp;…&nbsp;</span>'; });
  }

  function exChoice(ex, body, done) {
    var sel;
    function draw() {
      sel = ex.items.map(function () { return null; });
      body.classList.remove('checked');
      body.innerHTML = ex.items.map(function (it, i) {
        return '<div class="q" data-q="' + i + '"><div class="qt"><span class="qn">' + (i + 1) + '.</span><span class="sent">' + blanksHtml(it.q) + '</span></div><div class="opts">' +
          it.options.map(function (o, j) { return '<button class="opt" data-i="' + i + '" data-j="' + j + '">' + esc(o) + '</button>'; }).join('') + '</div><div class="fb" hidden></div></div>';
      }).join('') + exFoot();
    }
    draw();
    body.onclick = function (e) {
      var o = e.target.closest('.opt');
      if (o && !body.classList.contains('checked')) {
        var i = +o.dataset.i, j = +o.dataset.j;
        sel[i] = j;
        var q = $('[data-q="' + i + '"]', body);
        $$('.opt', q).forEach(function (b) { b.classList.toggle('sel', b === o); });
        var parts = ex.items[i].options[j].split(' … ');
        $$('.blank', q).forEach(function (b, k) { b.textContent = parts[k] || parts[0]; });
        return;
      }
      if (e.target.closest('[data-reset]')) { draw(); return; }
      if (e.target.closest('[data-check]')) {
        var c = 0;
        ex.items.forEach(function (it, i) {
          var ok = sel[i] === it.a; if (ok) c++;
          var q = $('[data-q="' + i + '"]', body);
          $$('.opt', q).forEach(function (b) {
            var j = +b.dataset.j; b.classList.remove('sel');
            if (j === it.a) b.classList.add(ok ? 'good' : 'miss');
            if (j === sel[i] && !ok) b.classList.add('bad');
          });
          $$('.blank', q).forEach(function (b) { b.classList.add(ok ? 'good' : 'bad'); });
          var fb = $('.fb', q); fb.hidden = false; fb.className = 'fb ' + (ok ? 'good' : 'bad');
          fb.innerHTML = fbHtml(ok, it.full, it.audio);
        });
        body.classList.add('checked');
        setScore(body, c, ex.items.length);
        done(c, ex.items.length);
      }
    };
  }

  var lastInput = null;
  function umlautBar() {
    return '<div class="umlauts" aria-label="Sonderzeichen">' + ['ä', 'ö', 'ü', 'Ä', 'Ö', 'Ü'].map(function (ch) { return '<button type="button" data-ch="' + ch + '">' + ch + '</button>'; }).join('') + '</div>';
  }
  function insertChar(ch) {
    var inp = lastInput;
    if (!inp || !document.body.contains(inp)) return;
    var s = inp.selectionStart == null ? inp.value.length : inp.selectionStart, e = inp.selectionEnd == null ? s : inp.selectionEnd;
    inp.value = inp.value.slice(0, s) + ch + inp.value.slice(e);
    inp.focus(); inp.setSelectionRange(s + 1, s + 1);
  }
  function exGap(ex, body, done) {
    function draw() {
      body.classList.remove('checked');
      body.innerHTML = ex.items.map(function (it, i) {
        var w = Math.max(6, Math.max.apply(null, it.a.map(function (a) { return a.length; })) + 2);
        var html = esc(it.q).replace('___', '<input class="gap-in" data-i="' + i + '" style="width:' + w + 'ch" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Lücke ' + (i + 1) + '">');
        return '<div class="q" data-q="' + i + '"><div class="qt"><span class="qn">' + (i + 1) + '.</span><span class="sent">' + html + '</span></div><div class="fb" hidden></div></div>';
      }).join('') + umlautBar() + exFoot();
    }
    draw();
    body.addEventListener('focusin', function (e) { if (e.target.matches('input')) lastInput = e.target; });
    body.onkeydown = function (e) {
      if (e.key === 'Enter' && e.target.matches('.gap-in')) {
        e.preventDefault();
        var ins = $$('.gap-in', body), k = ins.indexOf(e.target);
        if (k < ins.length - 1) ins[k + 1].focus(); else $('[data-check]', body).click();
      }
    };
    body.onclick = function (e) {
      var chb = e.target.closest('[data-ch]');
      if (chb) { insertChar(chb.dataset.ch); return; }
      if (e.target.closest('[data-reset]')) { draw(); return; }
      if (e.target.closest('[data-check]')) {
        var c = 0;
        ex.items.forEach(function (it, i) {
          var inp = $('.gap-in[data-i="' + i + '"]', body);
          var ok = it.a.some(function (a) { return norm(a) === norm(inp.value); });
          if (ok) c++;
          inp.classList.remove('good', 'bad'); inp.classList.add(ok ? 'good' : 'bad');
          var fb = $('[data-q="' + i + '"] .fb', body); fb.hidden = false; fb.className = 'fb ' + (ok ? 'good' : 'bad');
          fb.innerHTML = fbHtml(ok, it.full, it.audio);
        });
        body.classList.add('checked');
        setScore(body, c, ex.items.length);
        done(c, ex.items.length);
      }
    };
  }

  function exOrder(ex, body, done, seed) {
    var picked;
    function pool(it, i) {
      var idx = it.tokens.map(function (_, k) { return k; });
      var sh = shuffle(idx, seed * 31 + i + 7);
      if (sh.join() === idx.join()) sh = idx.slice().reverse();
      return sh;
    }
    function drawItem(i) {
      var it = ex.items[i], q = $('[data-q="' + i + '"]', body);
      $('.answer', q).innerHTML = picked[i].map(function (k, pos) { return '<button class="tile" data-i="' + i + '" data-pos="' + pos + '">' + esc(it.tokens[k]) + '</button>'; }).join('');
      $$('.pool .tile', q).forEach(function (t) { t.classList.toggle('used', picked[i].indexOf(+t.dataset.k) >= 0); });
    }
    function draw() {
      picked = ex.items.map(function () { return []; });
      body.classList.remove('checked');
      body.innerHTML = ex.items.map(function (it, i) {
        return '<div class="q" data-q="' + i + '"><div class="qt"><span class="qn">' + (i + 1) + '.</span><span class="muted small">Tippen Sie die Wörter in der richtigen Reihenfolge an.</span></div>' +
          '<div class="tiles answer" aria-label="Ihr Satz"></div><div class="tiles pool">' +
          pool(it, i).map(function (k) { return '<button class="tile" data-i="' + i + '" data-k="' + k + '">' + esc(it.tokens[k]) + '</button>'; }).join('') +
          '</div><div class="fb" hidden></div></div>';
      }).join('') + exFoot();
    }
    draw();
    body.onclick = function (e) {
      var t = e.target.closest('.tile');
      if (t && !body.classList.contains('checked')) {
        var i = +t.dataset.i;
        if (t.dataset.k != null) { var k = +t.dataset.k; if (picked[i].indexOf(k) < 0) picked[i].push(k); }
        else picked[i].splice(+t.dataset.pos, 1);
        drawItem(i);
        return;
      }
      if (e.target.closest('[data-reset]')) { draw(); return; }
      if (e.target.closest('[data-check]')) {
        var c = 0;
        ex.items.forEach(function (it, i) {
          var said = picked[i].map(function (k) { return it.tokens[k]; }).join(' ');
          var ok = picked[i].length === it.tokens.length && it.a.some(function (a) { return norm(a) === norm(said); });
          if (ok) c++;
          var q = $('[data-q="' + i + '"]', body);
          var ans = $('.answer', q); ans.classList.remove('good', 'bad'); ans.classList.add(ok ? 'good' : 'bad');
          var fb = $('.fb', q); fb.hidden = false; fb.className = 'fb ' + (ok ? 'good' : 'bad');
          fb.innerHTML = fbHtml(ok, it.a[0], it.audio, (!ok && it.a.length > 1) ? ' <span class="small muted">(auch möglich: ' + esc(it.a.slice(1).join(' / ')) + ')</span>' : '');
        });
        body.classList.add('checked');
        setScore(body, c, ex.items.length);
        done(c, ex.items.length);
      }
    };
  }

  var PAIR_COLORS = ['#2C6FB7', '#C0508A', '#1E7A45', '#B7791F', '#6B4FBB', '#0E7C86', '#B4442D', '#5C6B2E'];
  function exMatch(ex, body, done, seed) {
    var pairs, selL, order = shuffle(ex.items.map(function (_, i) { return i; }), seed * 13 + 5);
    function draw() {
      pairs = {}; selL = null;
      body.classList.remove('checked');
      body.innerHTML = '<p class="small muted" style="margin-top:0">Tippen Sie links und dann rechts. Nochmal tippen hebt die Verbindung auf.</p><div class="match"><div class="col left">' +
        ex.items.map(function (it, i) { return '<button class="mitem" data-l="' + i + '"><span class="badge" style="background:var(--line)">' + (i + 1) + '</span><span>' + esc(it.l) + '</span></button>'; }).join('') +
        '</div><div class="col right">' + order.map(function (r) { return '<button class="mitem" data-r="' + r + '"><span class="badge" style="background:transparent"></span><span>' + esc(ex.items[r].r) + '</span></button>'; }).join('') +
        '</div></div><div class="fb" hidden></div>' + exFoot();
    }
    function paint() {
      $$('[data-l]', body).forEach(function (b) {
        var i = +b.dataset.l, has = pairs[i] != null;
        b.classList.toggle('sel', selL === i);
        $('.badge', b).style.background = has ? PAIR_COLORS[i % PAIR_COLORS.length] : 'var(--line)';
      });
      $$('[data-r]', body).forEach(function (b) {
        var r = +b.dataset.r, owner = null;
        Object.keys(pairs).forEach(function (k) { if (pairs[k] === r) owner = +k; });
        var bd = $('.badge', b);
        bd.style.background = owner != null ? PAIR_COLORS[owner % PAIR_COLORS.length] : 'transparent';
        bd.textContent = owner != null ? owner + 1 : '';
      });
    }
    draw();
    body.onclick = function (e) {
      if (!body.classList.contains('checked')) {
        var l = e.target.closest('[data-l]'), r = e.target.closest('[data-r]');
        if (l) { var i = +l.dataset.l; if (pairs[i] != null) delete pairs[i]; selL = i; paint(); return; }
        if (r) {
          var ri = +r.dataset.r;
          Object.keys(pairs).forEach(function (k) { if (pairs[k] === ri) delete pairs[k]; });
          if (selL != null) {
            pairs[selL] = ri;
            var nextFree = null;
            for (var k = 0; k < ex.items.length; k++) if (pairs[k] == null) { nextFree = k; break; }
            selL = nextFree;
          }
          paint(); return;
        }
      }
      if (e.target.closest('[data-reset]')) { draw(); return; }
      if (e.target.closest('[data-check]')) {
        var c = 0;
        ex.items.forEach(function (_, i) {
          var ok = pairs[i] === i; if (ok) c++;
          $('[data-l="' + i + '"]', body).classList.add(ok ? 'good' : 'bad');
        });
        var fb = $('.fb', body); fb.hidden = false; fb.className = 'fb ' + (c === ex.items.length ? 'good' : 'bad');
        fb.innerHTML = c === ex.items.length ? icon('check', 's') + ' Alles richtig!' :
          '<div><b>Lösung:</b><br>' + ex.items.map(function (it) { return esc(it.l) + ' → ' + esc(it.r); }).join('<br>') + '</div>';
        body.classList.add('checked');
        setScore(body, c, ex.items.length);
        done(c, ex.items.length);
      }
    };
  }

  function diffHtml(expected, got) {
    var E = expected.split(' '), G = norm(got).split(' ');
    var En = E.map(norm);
    var m = En.length, n = G.length, dp = [];
    for (var i = 0; i <= m; i++) { dp[i] = []; for (var j = 0; j <= n; j++) dp[i][j] = 0; }
    for (i = m - 1; i >= 0; i--) for (j = n - 1; j >= 0; j--) dp[i][j] = En[i] === G[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    var ok = {}; i = 0; j = 0;
    while (i < m && j < n) { if (En[i] === G[j]) { ok[i] = true; i++; j++; } else if (dp[i + 1][j] >= dp[i][j + 1]) i++; else j++; }
    return E.map(function (w, k) { return ok[k] ? esc(w) : '<span class="miss">' + esc(w) + '</span>'; }).join(' ');
  }
  function exDictation(ex, body, done) {
    function draw() {
      body.classList.remove('checked');
      body.innerHTML = ex.items.map(function (it, i) {
        return '<div class="q" data-q="' + i + '"><div class="dict">' + playBtn(it.audio, 'Satz ' + (i + 1) + ' anhören') +
          '<input data-i="' + i + '" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Satz ' + (i + 1) + ' hier schreiben …" aria-label="Diktat Satz ' + (i + 1) + '"></div><div class="fb" hidden></div></div>';
      }).join('') + umlautBar() + '<p class="small muted">Gross-/Kleinschreibung und Satzzeichen werden nicht bewertet.</p>' + exFoot();
    }
    draw();
    body.addEventListener('focusin', function (e) { if (e.target.matches('input')) lastInput = e.target; });
    body.onkeydown = function (e) {
      if (e.key === 'Enter' && e.target.matches('input')) {
        e.preventDefault();
        var ins = $$('input', body), k = ins.indexOf(e.target);
        if (k < ins.length - 1) ins[k + 1].focus(); else $('[data-check]', body).click();
      }
    };
    body.onclick = function (e) {
      var chb = e.target.closest('[data-ch]');
      if (chb) { insertChar(chb.dataset.ch); return; }
      if (e.target.closest('[data-reset]')) { draw(); return; }
      if (e.target.closest('[data-check]')) {
        var c = 0;
        ex.items.forEach(function (it, i) {
          var inp = $('input[data-i="' + i + '"]', body);
          var ok = norm(inp.value) === norm(it.a); if (ok) c++;
          inp.classList.remove('good', 'bad'); inp.classList.add(ok ? 'good' : 'bad');
          var fb = $('[data-q="' + i + '"] .fb', body); fb.hidden = false; fb.className = 'fb ' + (ok ? 'good' : 'bad');
          fb.innerHTML = ok ? icon('check', 's') + ' Richtig!' : !inp.value.trim() ? '<span>' + icon('x', 's') + ' Richtig ist:</span> <span class="sol">' + esc(it.a) + '</span>' : '<span>' + icon('x', 's') + '</span><span class="sol diff">' + diffHtml(it.a, inp.value) + '</span>';
        });
        body.classList.add('checked');
        setScore(body, c, ex.items.length);
        done(c, ex.items.length);
      }
    };
  }

  /* ----- reading ----- */
  function secReading(u, el) {
    var r = u.reading;
    var ids = r.paras.map(function (p) { return p.audio; }).filter(Boolean);
    el.innerHTML = '<section class="card reading"><div class="kind">' + esc(r.kind) + '</div><h2 style="margin:4px 0 12px">' + esc(r.title) + '</h2>' +
      (ids.length ? '<div class="row" style="margin-bottom:12px"><button class="btn sm" data-play="' + r.paras.map(function (p) { return p.audio || ''; }).join(',') + '" data-hl="pa" data-gap="600">' + icon('play', 's') + ' Text vorlesen</button><span class="small muted">oder einen Absatz antippen</span></div>' : '') +
      '<div class="doc">' + r.paras.map(function (p, i) {
        return '<div class="para" id="pa' + i + '"' + (p.audio ? ' data-play="' + p.audio + '" role="button" tabindex="0" aria-label="Absatz vorlesen"' : '') + '>' + md(p.t).replace(/\n/g, '<br>') + '</div>';
      }).join('') + '</div></section>' +
      (r.glossary.length ? '<section class="card" style="margin-top:14px"><h3 style="margin-top:0">Wörter zum Text</h3><div class="gloss">' + r.glossary.map(function (g) { return '<div><b>' + esc(g.de) + '</b> <span>– ' + esc(g.en) + '</span></div>'; }).join('') + '</div></section>' : '') +
      '<h2>Fragen zum Text</h2><section class="card" id="rq"></section>';
    renderQuestions(document.getElementById('rq'), r.questions, u.id + '-rq', function () { setDone(u.id, 'lesen'); });
  }

  /* ----- writing ----- */
  function secWriting(u, el) {
    var w = u.writing, txt = S.writing[u.id] || '';
    el.innerHTML = '<section class="card"><h3 style="margin-top:0">' + icon('pen', 's') + ' Aufgabe</h3><p style="font-weight:600">' + esc(w.task) + '</p><ul class="points">' + w.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></section>' +
      '<section class="card" style="margin-top:14px"><h3 style="margin-top:0">Nützliche Redemittel</h3><div class="phr">' + w.phrases.map(function (p) { return '<div class="p"><div>' + esc(p.de) + '<div class="en-t">' + esc(p.en) + '</div></div></div>'; }).join('') + '</div></section>' +
      '<h2>Ihr Text</h2><textarea class="write" id="wtext" placeholder="Schreiben Sie hier … (wird automatisch gespeichert)" spellcheck="false">' + esc(txt) + '</textarea>' +
      '<div class="row" style="justify-content:space-between;margin-top:8px"><span class="small muted" id="wcount"></span><button class="btn" id="showmodel">' + icon('eye', 's') + ' Musterlösung zeigen</button></div>' +
      '<div id="model" hidden><h2>Musterlösung</h2><div class="row" style="margin-bottom:10px">' + playBtn(w.audio, 'Musterlösung anhören') + '<span class="small muted">Vergleichen Sie: Haben Sie alle Punkte? Stimmt die Wortstellung?</span></div><div class="model">' + esc(w.model) + '</div></div>';
    var ta = document.getElementById('wtext'), wc = document.getElementById('wcount');
    function count() { var n = ta.value.trim() ? ta.value.trim().split(/\s+/).length : 0; wc.textContent = n + ' Wörter'; }
    count();
    var tmr;
    ta.addEventListener('input', function () { count(); clearTimeout(tmr); tmr = setTimeout(function () { S.writing[u.id] = ta.value; save(); }, 400); });
    document.getElementById('showmodel').onclick = function () { var m = document.getElementById('model'); m.hidden = !m.hidden; if (!m.hidden) m.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  }

  /* ----- speaking ----- */
  var rec = { mr: null, stream: null, chunks: [], box: null, timer: null };
  function stopRecording() {
    if (rec.mr && rec.mr.state !== 'inactive') rec.mr.stop();
    if (rec.stream) rec.stream.getTracks().forEach(function (t) { t.stop(); });
    clearInterval(rec.timer); rec.stream = null;
  }
  function secSpeaking(u, el) {
    var sp = u.speaking;
    var canRec = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
    el.innerHTML = '<section class="card"><h3 style="margin-top:0">' + icon('mic', 's') + ' Aufgabe</h3><p style="font-weight:600;margin-bottom:0">' + esc(sp.task) + '</p></section>' +
      '<section class="card" style="margin-top:14px"><h3 style="margin-top:0">Redemittel</h3><div class="phr">' + sp.phrases.map(function (p) { return '<div class="p">' + (p.audio ? playBtn(p.audio, 'Anhören', 'sm') : '<span style="width:32px;flex:none"></span>') + '<div>' + esc(p.de) + '<div class="en-t">' + esc(p.en) + '</div></div></div>'; }).join('') + '</div></section>' +
      '<h2>Üben Sie laut</h2>' +
      sp.prompts.map(function (p, i) {
        return '<section class="card prompt-card" data-p="' + i + '"><div class="small muted">Frage ' + (i + 1) + ' von ' + sp.prompts.length + '</div>' +
          '<div class="step qstep">' + playBtn(p.aq, 'Frage anhören') + '<span class="q-text">' + esc(p.q) + '</span></div>' +
          '<div class="step"><button class="btn sm" data-act="think" data-i="' + i + '">' + icon('timer', 's') + ' 45 Sekunden antworten</button><span class="timer" id="tm' + i + '"></span>' +
          (canRec ? '<button class="btn sm" data-act="rec" data-i="' + i + '">' + icon('mic', 's') + ' Aufnehmen</button>' : '') + '</div><div class="recbox" id="rb' + i + '"></div>' +
          '<button class="btn ghost sm" data-act="model" data-i="' + i + '">' + icon('eye', 's') + ' Beispielantwort</button>' +
          '<div class="model-text" id="md' + i + '" hidden><div class="row" style="align-items:flex-start;flex-wrap:nowrap">' + playBtn(p.am, 'Beispielantwort anhören', 'sm') + '<div>' + esc(p.model) + '</div></div></div></section>';
      }).join('');
    el.onclick = function (e) {
      var b = e.target.closest('[data-act]');
      if (!b) return;
      var i = +b.dataset.i;
      if (b.dataset.act === 'model') { var m = document.getElementById('md' + i); m.hidden = !m.hidden; }
      if (b.dataset.act === 'think') {
        var t = document.getElementById('tm' + i), left = 45;
        clearInterval(b._t);
        t.textContent = left + ' s';
        b._t = setInterval(function () {
          left--; t.textContent = left > 0 ? left + ' s' : 'Zeit!';
          if (left <= 0) { clearInterval(b._t); if (navigator.vibrate) navigator.vibrate(120); }
        }, 1000);
      }
      if (b.dataset.act === 'rec') {
        var box = document.getElementById('rb' + i);
        if (rec.mr && rec.mr.state === 'recording') { stopRecording(); return; }
        navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
          rec.stream = stream; rec.chunks = [];
          var mr = new MediaRecorder(stream); rec.mr = mr;
          mr.ondataavailable = function (ev) { if (ev.data.size) rec.chunks.push(ev.data); };
          mr.onstop = function () {
            var blob = new Blob(rec.chunks, { type: mr.mimeType || 'audio/mp4' });
            box.innerHTML = '<div class="row" style="margin:6px 0 10px"><span class="small muted">Ihre Aufnahme:</span><audio controls src="' + URL.createObjectURL(blob) + '"></audio></div>';
            b.innerHTML = icon('mic', 's') + ' Neu aufnehmen';
          };
          mr.start();
          var sec = 0;
          box.innerHTML = '<div class="row small" style="margin:6px 0 10px"><span class="rec-dot"></span> Aufnahme läuft … <span id="rs' + i + '">0 s</span></div>';
          b.innerHTML = icon('stop', 's') + ' Stopp';
          rec.timer = setInterval(function () { sec++; var s = document.getElementById('rs' + i); if (s) s.textContent = sec + ' s'; if (sec >= 90) stopRecording(); }, 1000);
        }).catch(function () { toast('Mikrofon nicht verfügbar'); });
      }
    };
  }

  /* ---------------- flashcards (Leitner) ---------------- */
  var DAY = 86400000;
  var INTERVAL_DAYS = [0, 0, 1, 3, 7, 16, 35];
  var allVocabCache = null;
  function allVocab() {
    if (!allVocabCache) {
      allVocabCache = [];
      C.units.forEach(function (u) { u.vocab.forEach(function (v) { var o = Object.assign({ u: u.id }, v); allVocabCache.push(o); }); });
    }
    return allVocabCache;
  }
  function dueCards(unit) {
    var now = Date.now();
    return allVocab().filter(function (v) { return (!unit || v.u === unit) && S.srs[v.id] && S.srs[v.id].due <= now; });
  }
  function newCards(unit) {
    return allVocab().filter(function (v) { return (!unit || v.u === unit) && !S.srs[v.id]; });
  }
  var FC = null;
  function buildSession(unit, extraNew) {
    var due = dueCards(unit).sort(function (a, b) { return S.srs[a.id].due - S.srs[b.id].due; });
    var fresh = newCards(unit).slice(0, extraNew || 10);
    return { unit: unit, queue: due.concat(fresh), done: 0, knew: 0, again: 0, flipped: false };
  }
  function grade(v, knew) {
    var st = S.srs[v.id] || { box: 0, due: 0, seen: 0 };
    st.seen = (st.seen || 0) + 1;
    if (knew) { st.box = Math.min(6, (st.box || 0) + 1); st.due = Date.now() + INTERVAL_DAYS[st.box] * DAY; }
    else { st.box = 1; st.due = Date.now() + 60 * 1000; }
    S.srs[v.id] = st; S.stats.reviews = (S.stats.reviews || 0) + 1; save();
  }
  function renderCards(unitArg) {
    topbar('karten', 'Karteikarten');
    var unit = unitArg ? +unitArg : 0;
    if (!FC || FC.unit !== unit) FC = buildSession(unit);
    drawCards();
  }
  function drawCards() {
    var unit = FC.unit;
    var sel = '<select class="select" id="fcunit" aria-label="Lektion wählen"><option value="0">Alle Lektionen</option>' + C.units.map(function (u) { return '<option value="' + u.id + '"' + (u.id === unit ? ' selected' : '') + '>Lektion ' + u.id + ' · ' + esc(u.title) + '</option>'; }).join('') + '</select>';
    var dir = S.settings.dir;
    var head = '<h1>Karteikarten</h1><div class="toolbar">' + sel + '<div class="seg" role="group" aria-label="Richtung"><button data-act="dir" data-v="de-en" class="' + (dir === 'de-en' ? 'on' : '') + '">DE → EN</button><button data-act="dir" data-v="en-de" class="' + (dir === 'en-de' ? 'on' : '') + '">EN → DE</button></div></div>';
    var left = FC.queue.length;
    var total = unit ? unitById(unit).vocab.length : allVocab().length;
    var known = allVocab().filter(function (v) { return (!unit || v.u === unit) && S.srs[v.id] && S.srs[v.id].box >= 3; }).length;
    var stats = '<p class="small muted">Noch ' + left + ' Karten in dieser Runde · ' + known + ' von ' + total + ' Wörtern sicher · Fällig später: ' + Math.max(0, allVocab().filter(function (v) { return (!unit || v.u === unit) && S.srs[v.id]; }).length - dueCards(unit).length) + '</p>';
    if (!left) {
      var more = newCards(unit).length;
      main.innerHTML = '<div class="fc-wrap">' + head + '<section class="card empty"><div style="font-size:40px">🎉</div><h2 style="margin-top:6px">Runde fertig!</h2><p>' +
        (FC.done ? FC.knew + ' gewusst · ' + FC.again + '× nochmal' : 'Gerade ist nichts fällig.') + '</p>' +
        (more ? '<button class="btn primary" data-act="more">' + icon('cards', 's') + ' 10 neue Wörter lernen</button>' : '<p class="small">Alle Wörter sind im System. Kommen Sie später wieder – dann sind Karten fällig.</p>') +
        '<p class="small muted" style="margin-top:14px">' + more + ' neue Wörter übrig</p></section></div>';
      return;
    }
    var v = FC.queue[0], st = S.srs[v.id];
    var front = dir === 'de-en'
      ? '<div class="big">' + wordHtml(v.de) + '</div>'
      : '<div class="big" style="font-size:24px">' + esc(v.en) + '</div>';
    var back = '<div class="back">' + (dir === 'de-en'
      ? '<div class="big" style="font-size:24px">' + esc(v.en) + '</div><div class="muted">' + wordHtml(v.de) + '<span class="vforms">' + formsHtml(v) + '</span></div>'
      : '<div class="big">' + wordHtml(v.de) + '</div><div class="muted">' + esc(v.en) + '<span class="vforms">' + formsHtml(v) + '</span></div>') +
      '<div class="ex-l">' + esc(v.ex) + '</div></div>';
    main.innerHTML = '<div class="fc-wrap">' + head + stats +
      '<section class="card fc" id="fc" tabindex="0" aria-live="polite"><span class="box">' + (st ? 'Box ' + st.box : 'neu') + ' · L' + v.u + '</span>' + front +
      (FC.flipped ? back : '<div class="hint">Tippen zum Umdrehen <span class="kbd">Leertaste</span></div>') + '</section>' +
      '<div class="row" style="justify-content:center;margin-top:12px">' + playBtn(v.aw, 'Wort anhören') + (FC.flipped ? playBtn(v.ae, 'Beispiel anhören') : '') + '</div>' +
      (FC.flipped ? '<div class="fc-actions"><button class="btn again" data-act="again">' + icon('refresh', 's') + ' Nochmal <span class="kbd">1</span></button><button class="btn knew" data-act="knew">' + icon('check', 's') + ' Gewusst <span class="kbd">2</span></button></div>'
        : '<div class="fc-actions" style="grid-template-columns:1fr"><button class="btn primary" data-act="flip">Umdrehen</button></div>') +
      '<p class="small muted center" style="margin-top:18px">Wiederholung nach dem Leitner-System: Gewusste Wörter kommen nach 1, 3, 7, 16 und 35 Tagen wieder.</p></div>';
    document.getElementById('fcunit').onchange = function (e) { location.hash = '#/karten' + (+e.target.value ? '/' + e.target.value : ''); };
    document.getElementById('fc').onclick = function () { flip(); };
    if (dir === 'en-de' && FC.flipped && !FC.autoplayed) { FC.autoplayed = true; var pb = $('.fc-wrap .play'); if (pb) pb.click(); }
  }
  function flip() { if (!FC.flipped) { FC.flipped = true; FC.autoplayed = false; drawCards(); } }
  function answerCard(knew) {
    var v = FC.queue.shift();
    grade(v, knew);
    FC.done++;
    if (knew) FC.knew++; else { FC.again++; FC.queue.splice(Math.min(FC.queue.length, 4), 0, v); }
    FC.flipped = false;
    Player.stop();
    drawCards();
  }
  document.addEventListener('keydown', function (e) {
    if (!/^#\/karten/.test(location.hash) || !FC || e.target.matches('input,textarea,select')) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!FC.flipped) flip(); }
    else if (e.key === '1' && FC.flipped) answerCard(false);
    else if (e.key === '2' && FC.flipped) answerCard(true);
    else if (e.key === 'p' || e.key === 'P') { var pb = $('.fc-wrap .play'); if (pb) pb.click(); }
  });

  /* ---------------- word list ---------------- */
  function renderWordList() {
    topbar('woerter', 'Wortliste');
    main.innerHTML = '<h1>Wortliste</h1><p class="muted">' + allVocab().length + ' Wörter aus allen Lektionen. Suchen Sie auf Deutsch oder Englisch.</p>' +
      '<input class="search" id="q" type="search" placeholder="Suchen … z. B. Wohnung, doctor, umziehen" autocomplete="off" aria-label="Wörter suchen"><div id="wl" style="margin-top:12px"></div>';
    var q = document.getElementById('q'), wl = document.getElementById('wl');
    function draw() {
      var t = norm(q.value);
      var list = allVocab().filter(function (v) { return !t || norm(v.de + ' ' + v.en + ' ' + v.forms).indexOf(t) >= 0; });
      wl.innerHTML = list.length ? '<section class="card" style="padding:4px 16px">' + list.map(function (v) {
        var st = S.srs[v.id];
        return '<div class="wl-row">' + playBtn(v.aw, 'Anhören', 'sm') + '<div><b>' + wordHtml(v.de) + '</b><span class="vforms">' + formsHtml(v) + '</span><div class="small muted">' + esc(v.en) + '</div></div><a class="u" href="#/u/' + v.u + '/woerter">L' + v.u + (st ? ' · Box ' + st.box : '') + '</a></div>';
      }).join('') + '</section>' : '<p class="empty">Nichts gefunden.</p>';
    }
    draw();
    q.addEventListener('input', draw);
  }

  /* ---------------- grammar index ---------------- */
  function renderGrammarIndex() {
    topbar('grammatik', 'Grammatik');
    main.innerHTML = '<h1>Grammatik</h1><p class="muted">Alle Grammatikthemen des Kurses – von A2 bis B1.</p><section class="card"><ul class="sec-list">' +
      C.units.map(function (u) {
        return '<li class="' + (isDone(u.id, 'grammatik') ? 'done' : '') + '"><a href="#/u/' + u.id + '/grammatik"><span class="ic">' + (isDone(u.id, 'grammatik') ? icon('check') : '<b>' + u.id + '</b>') + '</span><span style="flex:1"><b>' + esc(u.grammar.title) + '</b><br><span class="small muted">' + esc(u.grammar.summary) + '</span></span><span class="chip lvl">' + esc(u.level) + '</span></a></li>';
      }).join('') + '</ul></section>';
  }

  /* ---------------- settings ---------------- */
  var OFF = { supported: 'serviceWorker' in navigator && /^https?:$/.test(location.protocol), done: 0, total: 0, complete: false, active: false };
  function offlineHtml() {
    if (!/^https?:$/.test(location.protocol)) return '<b>Lokal geöffnet</b><span>Alle Dateien liegen auf diesem Gerät – der Kurs funktioniert komplett ohne Internet.</span>';
    if (!OFF.supported) return '<b>Offline nicht verfügbar</b><span>Dieser Browser unterstützt keine Offline-Speicherung.</span>';
    if (!OFF.total) return '<b>Offline-Speicher wird vorbereitet …</b><span>Einen Moment, bitte.</span>';
    var p = Math.round((OFF.done / OFF.total) * 100);
    return '<b>' + (OFF.complete ? 'Offline bereit ✓' : 'Audio wird gespeichert … ' + p + '%') + '</b><span>' + OFF.done + ' von ' + OFF.total + ' Audiodateien auf diesem Gerät</span><div class="progress" style="margin-top:8px"><i style="width:' + p + '%"></i></div>';
  }
  function renderSettings() {
    topbar('einstellungen', 'Einstellungen');
    var s = S.settings;
    function seg(act, opts, cur) { return '<div class="seg" role="group">' + opts.map(function (o) { return '<button data-act="' + act + '" data-v="' + o[0] + '" class="' + (String(cur) === String(o[0]) ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') + '</div>'; }
    main.innerHTML = '<h1>Einstellungen</h1><section class="card">' +
      '<div class="set-row"><div class="l"><b>Darstellung</b><span>Hell, dunkel oder wie das System</span></div>' + seg('theme', [['auto', 'Auto'], ['light', 'Hell'], ['dark', 'Dunkel']], s.theme) + '</div>' +
      '<div class="set-row"><div class="l"><b>Audio-Tempo</b><span>Langsamer hilft am Anfang</span></div>' + seg('rate', [[0.75, '0,75×'], [0.9, '0,9×'], [1, '1×']], s.rate) + '</div>' +
      '<div class="set-row"><div class="l"><b>Englische Übersetzungen</b><span>In den Wortlisten</span></div>' + seg('en', [[1, 'Zeigen'], [0, 'Verstecken']], s.en ? 1 : 0) + '</div>' +
      '</section><h2>Offline</h2><section class="card"><div class="set-row"><div class="l" id="offl" style="flex:1">' + offlineHtml() + '</div>' +
      (OFF.supported ? '<button class="btn sm" data-act="precache">' + icon('download', 's') + ' Jetzt laden</button>' : '') + '</div></section>' +
      '<h2>Fortschritt</h2><section class="card">' +
      '<div class="set-row"><div class="l"><b>Sichern</b><span>Fortschritt als Datei speichern (z. B. um ihn auf ein anderes Gerät zu übertragen)</span></div><button class="btn sm" data-act="export">' + icon('download', 's') + ' Exportieren</button></div>' +
      '<div class="set-row"><div class="l"><b>Wiederherstellen</b><span>Eine gesicherte Datei laden</span></div><label class="btn sm">' + icon('upload', 's') + ' Importieren<input type="file" accept="application/json,.json" id="imp" hidden></label></div>' +
      '<div class="set-row"><div class="l"><b>Zurücksetzen</b><span>Löscht allen Fortschritt auf diesem Gerät</span></div><button class="btn sm again" data-act="reset">' + icon('trash', 's') + ' Zurücksetzen</button></div>' +
      '</section><p class="small muted" style="margin-top:24px">Unterwegs · Version ' + esc(C.version) + ' · ' + C.units.length + ' Lektionen · ' + allVocab().length + ' Wörter.<br>Alle Inhalte sind Originalmaterial. Stimmen: Piper TTS (Thorsten, Kerstin, Ramona) – synthetisch erzeugt, daher nicht immer perfekt betont.</p>';
    document.getElementById('imp').onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var d = JSON.parse(r.result);
          if (!d || typeof d !== 'object' || !d.done) throw new Error('bad');
          localStorage.setItem(KEY, JSON.stringify(d)); S = load(); applyTheme(); toast('Fortschritt importiert'); renderSettings();
        } catch (err) { toast('Datei konnte nicht gelesen werden'); }
      };
      r.readAsText(f);
    };
  }
  function updateOfflineUI() {
    var el = document.getElementById('offl');
    if (el) el.innerHTML = offlineHtml();
    var b = document.getElementById('banner');
    if (!OFF.supported || !OFF.total) { b.innerHTML = ''; return; }
    var dismissed = false;
    try { dismissed = sessionStorage.getItem('uw-banner') === OFF.total + ''; } catch (e) {}
    if (OFF.complete && (dismissed || OFF.wasComplete)) { b.innerHTML = ''; return; }
    var p = Math.round((OFF.done / OFF.total) * 100);
    b.innerHTML = '<div class="banner"><div class="card">' + icon(OFF.complete ? 'check' : 'download') + '<div class="grow"><b>' + (OFF.complete ? 'Offline bereit – der ganze Kurs ist auf diesem Gerät.' : 'Audio wird für die Offline-Nutzung gespeichert … ' + p + '%') + '</b>' +
      (OFF.complete ? '' : '<div class="progress" style="margin-top:6px"><i style="width:' + p + '%"></i></div><div class="small muted" style="margin-top:4px">Bitte die App geöffnet lassen, bis 100 % erreicht sind.</div>') + '</div>' +
      (OFF.complete ? '<button class="icon-btn" data-act="closebanner" aria-label="Schliessen">' + icon('x') + '</button>' : '') + '</div></div>';
  }

  /* ---------------- global actions ---------------- */
  document.addEventListener('click', function (e) {
    var p = e.target.closest('[data-play]');
    if (p) {
      e.preventDefault();
      var ids = p.dataset.play.split(',');
      var pre = p.dataset.hl;
      Player.toggle(p, ids, {
        gap: p.dataset.gap ? +p.dataset.gap : 350,
        onItem: pre ? function (i) { hl(pre, i); } : (p.classList.contains('para') ? function () { hl('pa', +p.id.slice(2)); } : null),
        onEnd: pre ? function () { hl(pre, -1); } : (p.classList.contains('para') ? function () { hl('pa', -1); } : null)
      });
      return;
    }
    var n = e.target.closest('[data-next]');
    if (n) { var parts = n.dataset.next.split(':'); if (COUNTED.indexOf(parts[1]) >= 0) setDone(+parts[0], parts[1]); }
    var a = e.target.closest('[data-act]');
    if (!a) return;
    var act = a.dataset.act, v = a.dataset.v;
    if (act === 'done') {
      var u = +a.dataset.u, s = a.dataset.s, now = !isDone(u, s);
      setDone(u, s, now);
      if (!now) { var t = $('.tab[data-s="' + s + '"] .ok'); if (t) t.remove(); }
      a.className = 'btn ' + (now ? '' : 'primary');
      a.innerHTML = now ? icon('check', 's') + ' Erledigt' : 'Als erledigt markieren';
      if (now) toast('Abschnitt erledigt ✓');
    } else if (act === 'en') {
      S.settings.en = v === '1'; save();
      var vl = document.getElementById('vlist'); if (vl) vl.classList.toggle('hide-en', !S.settings.en);
      $$('[data-act="en"]').forEach(function (b) { b.classList.toggle('on', b === a); });
    } else if (act === 'dmode') {
      S.settings.dmode = v; save();
      var dl = document.getElementById('dlg'); if (dl) dl.className = 'dlg mode-' + v;
      $$('[data-act="dmode"]').forEach(function (b) { b.classList.toggle('on', b === a); });
    } else if (act === 'theme') {
      S.settings.theme = v; save(); applyTheme();
      $$('[data-act="theme"]').forEach(function (b) { b.classList.toggle('on', b === a); });
    } else if (act === 'rate') {
      S.settings.rate = +v; save();
      $$('[data-act="rate"]').forEach(function (b) { b.classList.toggle('on', b === a); });
    } else if (act === 'dir') {
      S.settings.dir = v; save(); if (FC) { FC.flipped = false; } drawCards();
    } else if (act === 'flip') { flip(); }
    else if (act === 'again') { answerCard(false); }
    else if (act === 'knew') { answerCard(true); }
    else if (act === 'more') { FC = buildSession(FC.unit, 10); drawCards(); }
    else if (act === 'export') {
      var blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob); link.download = 'unterwegs-fortschritt-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(link); link.click(); link.remove();
    } else if (act === 'reset') {
      if (confirm('Wirklich allen Fortschritt löschen?')) { var keep = S.settings; try { localStorage.removeItem(KEY); } catch (err) {} S = load(); S.settings = keep; save(); FC = null; toast('Fortschritt gelöscht'); renderSettings(); }
    } else if (act === 'precache') {
      if (navigator.serviceWorker && navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage('precache-audio');
      else if (navigator.serviceWorker) navigator.serviceWorker.ready.then(function (r) { r.active.postMessage('precache-audio'); });
      toast('Download gestartet');
    } else if (act === 'closebanner') {
      try { sessionStorage.setItem('uw-banner', OFF.total + ''); } catch (err) {}
      document.getElementById('banner').innerHTML = '';
    }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.para[data-play]')) { e.preventDefault(); e.target.click(); }
  });

  /* ---------------- router ---------------- */
  function route() {
    Player.stop(); stopRecording();
    var h = location.hash.replace(/^#\/?/, '');
    var p = h.split('/').filter(Boolean);
    if (p[0] === 'u') renderUnit(+p[1], p[2] || 'ueberblick');
    else if (p[0] === 'karten') renderCards(p[1]);
    else if (p[0] === 'woerter') renderWordList();
    else if (p[0] === 'grammatik') renderGrammarIndex();
    else if (p[0] === 'einstellungen') renderSettings();
    else renderHome();
    window.scrollTo(0, 0);
    try { main.focus({ preventScroll: true }); } catch (e) {}
  }
  window.addEventListener('hashchange', route);
  route();

  /* ---------------- service worker ---------------- */
  if (OFF.supported) {
    var hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('message', function (e) {
      var m = e.data || {};
      if (m.type === 'progress' || m.type === 'status') {
        if (m.type === 'status' && m.done >= m.total) OFF.wasComplete = true;
        OFF.done = m.done; OFF.total = m.total; OFF.complete = m.done >= m.total;
        updateOfflineUI();
      }
    });
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (hadController) { toast('Neue Version installiert'); setTimeout(function () { location.reload(); }, 800); }
      hadController = true;
    });
    navigator.serviceWorker.register('sw.js').catch(function () { OFF.supported = false; updateOfflineUI(); });
    navigator.serviceWorker.ready.then(function (reg) {
      reg.active.postMessage('status');
      setTimeout(function () { reg.active.postMessage('precache-audio'); }, 400);
    });
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(function () {});
  }
})();
