(function () {
  var LEX = window.LEX || [];
  var ICONS = {
    scale: '<path d="M2 8h20v8H2z"/><path d="M7 8v3M12 8v4M17 8v3"/>',
    pen: '<path d="M4 20h4L20 8l-4-4L4 16v4Z"/><path d="M14 6l4 4"/>',
    box: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18M10 9v11"/>',
    term: '<rect x="2.5" y="4.5" width="19" height="15" rx="1"/><path d="m6.5 9.5 3 2.5-3 2.5M12.5 15h5"/>',
    star: '<path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 17.9l-1.7-5.5L4.8 10.7 10.3 9 12 3.5Z"/>',
    plug: '<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0V8ZM12 17v4"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 6.2a3 3 0 0 1 0 5.6M17.5 20a5.6 5.6 0 0 0-2-4.3"/>',
    layer: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3.5 12.5 8.5 4.7 8.5-4.7"/>',
    ruler: '<rect x="2" y="8" width="20" height="8" rx="1"/><path d="M7 8v3M12 8v4M17 8v3"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/>',
    doc: '<path d="M6 3h8l4 4v14H6V3Z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v10M14.6 9.4c-.7-.7-1.7-1-2.6-1-1.3 0-2.4.7-2.4 1.9 0 2.6 5 1.4 5 4 0 1.3-1.2 2-2.6 2-1 0-2-.3-2.7-1.1"/>'
  };
  var LABEL = { haiku: 'Haiku', sonnet: 'Sonnet', opus: 'Opus', fable: 'Fable', none: 'keins' };

  var secWrap = document.getElementById('sections');
  var azWrap = document.getElementById('az');
  var q = document.getElementById('q');
  var countEl = document.getElementById('count');
  var clearEl = document.getElementById('clear');
  var noresult = document.getElementById('noresult');
  var azbtn = document.getElementById('azbtn');
  var fbtns = [].slice.call(document.querySelectorAll('.bar-inner button[data-f]'));
  var model = 'all';

  if (window.LOGO) {
    document.getElementById('logo-top').innerHTML = window.LOGO;
    document.getElementById('logo-foot').innerHTML = window.LOGO;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var allGroups = [];

  function setGroup(g, open) {
    g.classList.toggle('collapsed', !open);
    g.querySelector('.ghead').setAttribute('aria-expanded', String(open));
  }

  function setEntry(el, open) {
    el.classList.toggle('open', open);
    el.querySelector('.e-top').setAttribute('aria-expanded', String(open));
  }

  /* Aufbau */
  var items = [];
  var azItems = [];
  var total = 0;

  LEX.forEach(function (ch) {
    var sec = document.createElement('section');
    sec.className = 'collapsed';
    var head = document.createElement('div');
    head.className = 'shead';
    head.innerHTML =
      '<span class="marker">§ ' + esc(ch.n) + '</span>' +
      '<h2><svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[ch.i] || ICONS.box) + '</svg>' +
      esc(ch.t) + '<span class="n">' + ch.e.length + '</span></h2>' +
      '<span class="chev" aria-hidden="true"></span>';
    sec.appendChild(head);

    if (ch.l) {
      var lede = document.createElement('p');
      lede.className = 'lede';
      lede.textContent = ch.l;
      sec.appendChild(lede);
    }

    var groups = [];
    var list = null, gEl = null, gTitle = null;

    function newGroup(name) {
      var box = document.createElement('div');
      box.className = 'g collapsed';
      var gh = document.createElement('div');
      gh.className = 'ghead';
      gh.setAttribute('role', 'button');
      gh.setAttribute('tabindex', '0');
      gh.setAttribute('aria-expanded', 'false');
      gh.innerHTML = '<span class="gt">' + esc(name) + '</span><span class="gn"></span>' +
        '<span class="gchev" aria-hidden="true"></span>';
      box.appendChild(gh);
      var rows = document.createElement('div');
      rows.className = 'entries';
      box.appendChild(rows);
      gh.addEventListener('click', function () { setGroup(box, box.classList.contains('collapsed')); });
      gh.addEventListener('keydown', function (ev) {
        if (ev.key === ' ' || ev.key === 'Enter') {
          ev.preventDefault();
          setGroup(box, box.classList.contains('collapsed'));
        }
      });
      groups.push(box);
      body.appendChild(box);
      gEl = box;
      gTitle = name;
      list = rows;
    }

    var body = document.createElement('div');
    body.className = 'cbody';

    ch.e.forEach(function (en) {
      if (en.g) { newGroup(en.g); return; }
      if (!list) newGroup(ch.t);
      total++;
      var el = document.createElement('article');
      el.className = 'e';
      if (en.m) el.setAttribute('data-m', en.m);
      var tag = en.m ? '<span class="tag m-' + en.m + '">' + LABEL[en.m] + '</span>' : '';
      el.innerHTML =
        '<div class="e-top" role="button" tabindex="0" aria-expanded="false">' +
        '<h3>' + esc(en.t) + '</h3>' + tag + '<span class="e-plus" aria-hidden="true"></span></div>' +
        '<div class="e-body"><p class="def">' + esc(en.d) + '</p>' +
        (en.p ? '<p class="prax"><b>&rarr;</b><span>' + esc(en.p) + '</span></p>' : '') + '</div>';
      el.__html = el.innerHTML;
      el.__text = (en.t + ' ' + en.d + ' ' + (en.p || '') + ' ' + ch.t + ' ' + (gTitle || '')).toLowerCase();
      el.__group = gEl;
      var top = el.querySelector('.e-top');
      function toggle() { setEntry(el, !el.classList.contains('open')); }
      top.addEventListener('click', toggle);
      top.addEventListener('keydown', function (ev) {
        if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); toggle(); }
      });
      list.appendChild(el);
      items.push(el);

      var ai = document.createElement('div');
      ai.className = 'az-item';
      ai.innerHTML = '<span class="t">' + esc(en.t) + '</span><span class="src">§ ' + esc(ch.n) + '</span>';
      ai.__html = ai.innerHTML;
      ai.__text = el.__text;
      ai.__key = en.t.replace(/^[^A-Za-zÄÖÜäöü0-9]+/, '').charAt(0).toUpperCase();
      if (en.m) ai.setAttribute('data-m', en.m);
      azItems.push(ai);
    });

    groups.forEach(function (g) {
      g.querySelector('.gn').textContent = g.querySelectorAll('.e').length;
      allGroups.push(g);
    });

    var tools = document.createElement('div');
    tools.className = 'etools';
    var allBtn = document.createElement('button');
    allBtn.type = 'button';
    allBtn.textContent = 'ALLES AUFKLAPPEN';
    allBtn.addEventListener('click', function () {
      var vis = [].slice.call(body.querySelectorAll('.e:not(.dim)'));
      var open = vis.some(function (x) { return !x.classList.contains('open'); });
      groups.forEach(function (g) { if (!g.classList.contains('empty')) setGroup(g, open); });
      vis.forEach(function (x) { setEntry(x, open); });
      allBtn.textContent = open ? 'ALLES ZUKLAPPEN' : 'ALLES AUFKLAPPEN';
    });
    var cnt = document.createElement('span');
    cnt.textContent = groups.length + ' RUBRIKEN · ' + body.querySelectorAll('.e').length + ' EINTRÄGE';
    tools.appendChild(allBtn);
    tools.appendChild(cnt);
    sec.appendChild(tools);
    sec.appendChild(body);
    secWrap.appendChild(sec);
  });

  /* A–Z */
  var letters = {};
  azItems.slice().sort(function (a, b) {
    return a.__text.localeCompare(b.__text, 'de');
  }).forEach(function (ai) {
    var k = /[A-Z]/.test(ai.__key) ? ai.__key : (/[ÄÖÜ]/.test(ai.__key) ? ai.__key : '#');
    (letters[k] = letters[k] || []).push(ai);
  });
  Object.keys(letters).sort(function (a, b) { return a.localeCompare(b, 'de'); }).forEach(function (k) {
    var g = document.createElement('div');
    g.className = 'az-group';
    var h = document.createElement('h3');
    h.textContent = k;
    g.appendChild(h);
    letters[k].forEach(function (ai) { g.appendChild(ai); });
    azWrap.appendChild(g);
  });
  var azGroups = [].slice.call(azWrap.querySelectorAll('.az-group'));
  var secs = [].slice.call(secWrap.querySelectorAll('section'));

  document.getElementById('st-e').textContent = total;
  document.getElementById('st-c').textContent = LEX.length;

  /* Suche */
  function rx(s) { return new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'); }
  function highlight(el, term) {
    var re = rx(term);
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      var t = node.nodeValue;
      re.lastIndex = 0;
      if (!re.test(t)) return;
      re.lastIndex = 0;
      var frag = document.createDocumentFragment(), last = 0, m;
      while ((m = re.exec(t)) !== null) {
        if (m.index > last) frag.appendChild(document.createTextNode(t.slice(last, m.index)));
        var mk = document.createElement('mark');
        mk.textContent = m[0];
        frag.appendChild(mk);
        last = m.index + m[0].length;
        if (m[0].length === 0) re.lastIndex++;
      }
      if (last < t.length) frag.appendChild(document.createTextNode(t.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  function setOpen(sec, open) {
    sec.classList.toggle('collapsed', !open);
    sec.querySelector('.shead').setAttribute('aria-expanded', String(open));
  }

  function render() {
    var term = (q.value || '').trim();
    var searching = term.length > 0;
    var needle = term.toLowerCase();
    document.body.classList.toggle('searching', searching);
    clearEl.hidden = !searching;

    var hits = 0;
    function pass(el) {
      if (searching) return el.__text.indexOf(needle) !== -1;
      return model === 'all' || el.getAttribute('data-m') === model;
    }

    items.forEach(function (el) {
      var vis = pass(el);
      el.classList.toggle('dim', !vis);
      if (el.innerHTML !== el.__html) el.innerHTML = el.__html;
      setEntry(el, searching && vis);
      if (vis) { hits++; if (searching) highlight(el, term); }
    });
    azItems.forEach(function (ai) {
      var vis = pass(ai);
      ai.classList.toggle('dim', !vis);
      if (ai.innerHTML !== ai.__html) ai.innerHTML = ai.__html;
      if (vis && searching) highlight(ai, term);
    });
    allGroups.forEach(function (g) {
      var any = g.querySelectorAll('.e:not(.dim)').length > 0;
      g.classList.toggle('empty', !any);
      g.querySelector('.gn').textContent = g.querySelectorAll('.e:not(.dim)').length;
      if (searching) setGroup(g, any); else setGroup(g, false);
    });
    azGroups.forEach(function (g) {
      g.classList.toggle('empty', g.querySelectorAll('.az-item:not(.dim)').length === 0);
    });
    secs.forEach(function (s) {
      var any = s.querySelectorAll('.e:not(.dim)').length > 0;
      s.classList.toggle('section-empty', !any);
      setOpen(s, searching ? any : false);
    });

    countEl.textContent = searching ? (hits === 1 ? '1 Treffer' : hits + ' Treffer') : '';
    noresult.classList.toggle('on', searching && hits === 0);
    fbtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-f') === model)); });
  }

  fbtns.forEach(function (b) {
    b.addEventListener('click', function () {
      model = b.getAttribute('data-f');
      render();
      if (model !== 'all') secs.forEach(function (s) { setOpen(s, !s.classList.contains('section-empty')); });
    });
  });
  azbtn.addEventListener('click', function () {
    var on = document.body.classList.toggle('az-mode');
    azbtn.setAttribute('aria-pressed', String(on));
  });
  q.addEventListener('input', render);
  q.addEventListener('keydown', function (e) { if (e.key === 'Escape') { q.value = ''; render(); } });
  clearEl.addEventListener('click', function () { q.value = ''; render(); q.focus(); });

  secs.forEach(function (s) {
    var h = s.querySelector('.shead');
    h.setAttribute('role', 'button');
    h.setAttribute('tabindex', '0');
    h.addEventListener('click', function () { setOpen(s, s.classList.contains('collapsed')); });
    h.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setOpen(s, s.classList.contains('collapsed')); }
    });
  });

  var toTop = document.getElementById('totop');
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    q.focus({ preventScroll: true });
  });
  window.addEventListener('scroll', function () {
    toTop.classList.toggle('on', window.scrollY > 900);
  }, { passive: true });

  render();

  /* Claude bei null Treffern */
  (function () {
    var go = document.getElementById('askgo');
    var stop = document.getElementById('askstop');
    var body = document.getElementById('askbody');
    var termEl = document.getElementById('askterm');
    var ask = go.closest('.ask');
    var sample = null, ctl = null, lastTerm = '';
    var COPY = {
      not_granted: 'Zugriff auf Claude wurde für diese Seite nicht erlaubt.',
      sampling_disabled: 'Claude steht für dieses Konto hier nicht zur Verfügung.',
      rate_limited: 'Zu viele Anfragen. Gleich nochmal versuchen.',
      session_expired: 'Bitte neu bei Claude anmelden.',
      refused: 'Claude hat diese Anfrage abgelehnt. Anders formulieren.',
      empty_completion: 'Keine Antwort. Frage etwas konkreter stellen.'
    };
    if (!window.claude || !claude.use) { ask.hidden = true; return; }
    claude.use('sample').then(function (fn) { sample = fn; if (!fn) ask.hidden = true; })
      .catch(function () { ask.hidden = true; });

    q.addEventListener('input', function () {
      var t = (q.value || '').trim();
      termEl.textContent = t ? '„' + t + '"' : '';
      if (t !== lastTerm) {
        if (ctl) ctl.abort();
        body.textContent = ''; go.disabled = false; go.textContent = 'Nachschlagen'; stop.hidden = true;
      }
    });

    go.addEventListener('click', function () {
      if (!sample) return;
      var t = (q.value || '').trim();
      if (!t) return;
      lastTerm = t;
      ctl = new AbortController();
      go.disabled = true; stop.hidden = false;
      body.textContent = 'Denkt nach …';
      var prompt =
        'Du beantwortest eine Frage in einem deutschsprachigen Nachschlagewerk zur Arbeit mit Claude und Claude Code.\n' +
        'Suchbegriff des Nutzers: "' + t + '"\n\n' +
        'Erkläre knapp, was in Claudes Best Practices dazu gilt: welches Modell oder welches Vorgehen passt und worauf zu achten ist. ' +
        'Wenn der Begriff nichts mit Claude, Modellwahl, Prompting, Token-Verbrauch, Skills, MCP oder Coding-Workflows zu tun hat, sage das in einem Satz.\n\n' +
        'Format: reiner Fließtext auf Deutsch, höchstens 120 Wörter, keine Markdown-Zeichen, keine Überschriften, keine Aufzählungszeichen. ' +
        'Sachlich und direkt, kein Vorspann.';
      sample(prompt, {
        modelTier: 'default',
        signal: ctl.signal,
        cache: { gcTime: 3600000 },
        onText: function (u) { body.textContent = u.text; }
      }).then(function (r) {
        body.textContent = r.text + (r.truncated ? ' […]' : '');
      }).catch(function (e) {
        if (e && e.code === 'cancelled') { body.textContent = e.text || ''; return; }
        body.textContent = (e && COPY[e.code]) || 'Das hat gerade nicht geklappt. Später nochmal versuchen.';
      }).then(function () {
        go.disabled = false; go.textContent = 'Neu fragen'; stop.hidden = true; ctl = null;
      });
    });
    stop.addEventListener('click', function () { if (ctl) ctl.abort(); });
  })();

  /* Modellvergleich (Overlay aus dem Kopf-Stat) */
  (function () {
    var openBtn = document.getElementById('mdiag-open');
    var mdiag = document.getElementById('mdiag');
    if (!openBtn || !mdiag) return;
    var track = document.getElementById('mdiag-track');
    var CMP = [
      { m: 'haiku', d: 'Schnell & günstig. Für alles mit genau einer richtigen Antwort — Routine, Aufräumen, Formate.' },
      { m: 'sonnet', d: 'Das Arbeitspferd. Umsetzung, Iteration und Bugfixes mit klarer Ursache.' },
      { m: 'opus', d: 'Bestes Urteilsvermögen. Konzept, Architektur, visuelle Richtung, unklare Fehlerbilder.' },
      { m: 'fable', d: 'Spezialist für Grenzfälle — erst wenn Opus zweimal an derselben Aufgabe gescheitert ist.' }
    ];
    CMP.forEach(function (row) {
      var n = document.createElement('div');
      n.className = 'mdiag-node';
      n.setAttribute('data-m', row.m);
      n.innerHTML = '<span class="mdiag-dot" aria-hidden="true"></span>' +
        '<span class="mdiag-name">' + esc(LABEL[row.m]) + '</span>' +
        '<span class="mdiag-use">' + esc(row.d) + '</span>';
      track.appendChild(n);
    });

    var lastFocus = null;
    function show() {
      lastFocus = document.activeElement;
      mdiag.hidden = false;
      document.body.style.overflow = 'hidden';
      mdiag.querySelector('.mdiag-x').focus();
    }
    function hide() {
      mdiag.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    openBtn.addEventListener('click', show);
    mdiag.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) hide();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mdiag.hidden) hide();
    });
  })();
})();
