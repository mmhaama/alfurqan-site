/* Al-Furqan Academie – interactive Arabic exercises (used by portal.html and lang.html).
   Unit data lives in /lang-data.js. Everything here is generated from that data. */
(function () {
  var U = window.LANG_UNITS || {};
  var HAR = /[ً-ْٰـ]/g;               // harakat, shadda, sukun, tatweel
  function bare(s) { return String(s || '').replace(HAR, ''); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function nl() { return window.lang === 'nl'; }
  function ar(s) { return String(s).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }   // Arabic-Indic digits for the children
  function pic(e) { return /^[\u0660-\u0669]+$/.test(e) ? '<span class="lx-num">' + e + '</span>' : e; }

  /* ---------- speech (browser voice) ---------- */
  var voice = null;
  function pickVoice() {
    if (!window.speechSynthesis) return;
    var v = speechSynthesis.getVoices().filter(function (x) { return /^ar/i.test(x.lang); });
    voice = v.find(function (x) { return /google/i.test(x.name); }) || v[0] || null;
  }
  if (window.speechSynthesis) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function say(t) {
    if (!window.speechSynthesis || !t) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(t); u.lang = 'ar-SA'; if (voice) u.voice = voice; u.rate = 0.8;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function spk(t) { return '<button class="lx-say" type="button" data-say="' + esc(t) + '" aria-label="listen">🔊</button>'; }

  /* ---------- styles ---------- */
  (function () {
    var st = document.createElement('style');
    st.textContent =
      '#lxOv{position:fixed;inset:0;z-index:60;background:#fbf8f1;display:none;flex-direction:column;direction:rtl}#lxOv.show{display:flex}' +
      '.lx-top{display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid #e7dfcc;background:#fff}' +
      '.lx-top b{flex:1;color:#0f4d3c;font-size:1.05rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.lx-x{border:0;background:#f1ece0;border-radius:50%;width:38px;height:38px;font-size:1.2rem;cursor:pointer}' +
      '.lx-bar{height:8px;background:#eee6d2}.lx-bar i{display:block;height:100%;background:linear-gradient(90deg,#2bb673,#c9a24a);transition:width .3s}' +
      '.lx-body{flex:1;overflow:auto;padding:14px 12px 30px;max-width:720px;width:100%;margin:0 auto}' +
      '.lx-q{font-weight:700;color:#0f4d3c;font-size:1.08rem;margin:4px 0 12px}' +
      '.lx-pic{font-size:4.2rem;text-align:center;line-height:1.2;margin:6px 0}' +
      '.lx-word{font-family:"Amiri","Noto Naskh Arabic",serif;font-size:2.3rem;text-align:center;margin:4px 0 14px;color:#1d2a26}' +
      '.lx-word .gap{display:inline-block;min-width:1.2em;border-bottom:3px dashed #c9a24a;color:#c9a24a}' +
      '.lx-opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}' +
      '.lx-opt{border:2px solid #e7dfcc;background:#fff;border-radius:16px;padding:14px 8px;font-family:"Amiri","Noto Naskh Arabic",serif;font-size:1.7rem;cursor:pointer;transition:transform .1s}' +
      '.lx-opt.sm{font-family:"Noto Naskh Arabic",sans-serif;font-size:1.15rem}' +
      '.lx-opt:active{transform:scale(.96)}.lx-opt.ok{border-color:#2bb673;background:#e3f3ea}.lx-opt.no{border-color:#d9534f;background:#fbe3e1;animation:lxShake .35s}' +
      '@keyframes lxShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}' +
      '.lx-say{border:0;background:#0f4d3c;color:#fff;border-radius:999px;width:44px;height:44px;font-size:1.2rem;cursor:pointer;vertical-align:middle;margin:0 6px}' +
      '.lx-next{display:block;width:100%;margin-top:16px;border:0;border-radius:16px;padding:14px;font:700 1.15rem inherit;font-family:inherit;cursor:pointer;background:linear-gradient(135deg,#2bb673,#1f8f5a);color:#fff;box-shadow:0 5px 0 #17714a}' +
      '.lx-next:disabled{opacity:.4;box-shadow:none}' +
      '.lx-forms{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:6px 0 14px}' +
      '.lx-forms span{background:#fff;border:2px solid #e7dfcc;border-radius:14px;min-width:70px;padding:6px 10px;text-align:center;font-family:"Amiri",serif;font-size:2.6rem;line-height:1.3}' +
      '.lx-forms small{display:block;font-family:"Noto Naskh Arabic",sans-serif;font-size:.75rem;color:#5b6b66}' +
      '.lx-row{background:#fff;border:1px solid #e7dfcc;border-radius:14px;padding:8px 10px;margin:8px 0}' +
      '.lx-row h5{margin:0 0 6px;font-size:1rem;color:#0f4d3c;display:flex;align-items:center;gap:8px}.lx-row h5 .mk{font-family:"Amiri",serif;font-size:1.8rem;color:#c08a00}' +
      '.lx-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px}' +
      '.lx-card{border:0;background:#f7f3e8;border-radius:12px;padding:6px 4px;cursor:pointer;text-align:center;font-family:inherit}' +
      '.lx-card .e{font-size:2rem;display:block}.lx-card .w{font-family:"Amiri",serif;font-size:1.35rem;display:block}.lx-card .n{font-size:.72rem;color:#5b6b66;direction:ltr;display:block}' +
      '.lx-bub{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:420px;margin:0 auto}' +
      '.lx-bub button{aspect-ratio:1;border-radius:50%;border:2px solid #cfe5d8;background:radial-gradient(circle at 30% 30%,#fff,#e6f4ec);font-family:"Amiri",serif;font-size:2rem;cursor:pointer}' +
      '.lx-bub button.ok{background:#2bb673;color:#fff;border-color:#2bb673}.lx-bub button.no{animation:lxShake .35s;border-color:#d9534f}' +
      '.lx-slots{min-height:64px;border:2px dashed #c9a24a;border-radius:14px;padding:8px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center;margin-bottom:12px;font-family:"Amiri",serif;font-size:2rem}' +
      '.lx-toks{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}' +
      '.lx-tok{border:2px solid #e7dfcc;background:#fff;border-radius:12px;padding:6px 14px;font-family:"Amiri",serif;font-size:1.8rem;cursor:pointer}.lx-tok.used{visibility:hidden}' +
      '.lx-sortw{text-align:center;margin:8px 0}.lx-cats{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
      '.lx-rule{background:#fff;border:1px solid #e7dfcc;border-radius:14px;padding:10px 12px;margin:8px 0}.lx-rule b{font-family:"Amiri",serif;font-size:1.7rem;color:#0f4d3c;margin-inline-end:8px}' +
      '.lx-rule .nl{direction:ltr;text-align:left;color:#5b6b66;font-size:.85rem}.lx-tip{background:#fff6dc;border-radius:12px;padding:8px 12px;margin:8px 0;font-size:.95rem}' +
      '.lx-read{background:#fff;border:1px solid #e7dfcc;border-radius:14px;padding:12px;font-family:"Amiri",serif;font-size:1.6rem;line-height:2}' +
      '.lx-fb{text-align:center;font-weight:700;margin-top:10px;min-height:1.6em}.lx-fb.ok{color:#1f7a4d}.lx-fb.no{color:#b23b2e}' +
      '.lx-end{text-align:center;padding-top:20px}.lx-end .st{font-size:3rem;letter-spacing:6px}.lx-end h3{color:#0f4d3c;font-size:1.5rem;margin:8px 0}' +
      '.lx-num{display:inline-flex;align-items:center;justify-content:center;min-width:1.3em;height:1.3em;padding:0 .1em;border-radius:.2em;background:#0f4d3c;color:#fff;font-family:"Amiri",serif;font-weight:700;line-height:1}' +
      '.lx-chant{text-align:center;font-family:"Amiri",serif;font-size:1.4rem;color:#0f4d3c;background:#e9f4ee;border-radius:12px;padding:8px}';
    document.head.appendChild(st);
  })();

  /* ---------- screens ---------- */
  var POS = ['فِي أَوَّلِ الكَلِمَةِ', 'فِي وَسَطِ الكَلِمَةِ', 'فِي آخِرِ الكَلِمَةِ'];
  var MK_NAME = ['بِالفَتْحِ', 'بِالضَّمِّ', 'بِالكَسْرِ', 'بِالسُّكُونِ'];
  var GROUPS = ['fatha', 'damma', 'kasra', 'sukun'];
  function letterScreens(u) {
    var L = u.letter, s = [{ t: 'introL' }], all = [];
    GROUPS.forEach(function (g, gi) { (u.words[g] || []).forEach(function (w) { all.push({ w: w[0], e: w[1], n: w[2], g: gi }); }); });
    /* 1. listen & choose the mark (the letter with its haraka is hidden) */
    shuffle(all).slice(0, 6).forEach(function (x) {
      var p = x.w.indexOf(L), j = p + 1;                // hide the first target letter with its marks
      while (j < x.w.length && /[\u064B-\u0652]/.test(x.w[j])) j++;
      var shown = esc(x.w.slice(0, p)) + '<span class="gap">?</span>' + esc(x.w.slice(j));
      s.push({ t: 'mcq', q: 'اسْتَمِعْ، ثُمَّ اخْتَرْ صَوْتَ حَرْفِ (' + L + ') المُنَاسِبَ:', e: x.e, html: shown, say: x.w, opts: u.marks, a: x.g, big: true });
    });
    /* 2. where is the letter? */
    var posW = all.concat((u.extra || []).map(function (w) { return { w: w[0], e: w[1] }; })).filter(function (x) { return bare(x.w).split(L).length === 2; });
    var byPos = [[], [], []];
    posW.forEach(function (x) { var b = bare(x.w), i = b.indexOf(L); byPos[i === 0 ? 0 : i === b.length - 1 ? 2 : 1].push(x); });
    [0, 1, 2, 0, 2].forEach(function (p) {
      var x = shuffle(byPos[p])[0]; if (!x) return; byPos[p] = byPos[p].filter(function (y) { return y !== x; });
      s.push({ t: 'mcq', q: 'أَيْنَ حَرْفُ (' + L + ') فِي الكَلِمَةِ؟', e: x.e, html: esc(x.w), say: x.w, opts: POS, a: p, small: true });
    });
    /* 3. do you hear the letter? */
    var yn = shuffle(all).slice(0, 3).map(function (x) { return { w: x.w, e: x.e, a: 0 }; })
      .concat(shuffle(u.others || []).slice(0, 3).map(function (w) { return { w: w[0], e: w[1], a: 1 }; }));
    shuffle(yn).forEach(function (x) {
      s.push({ t: 'mcq', q: 'هَلْ فِي الكَلِمَةِ صَوْتُ حَرْفِ (' + L + ')؟', e: x.e, html: esc(x.w), say: x.w, opts: ['نَعَمْ ✓', 'لَا ✗'], a: x.a, small: true });
    });
    /* 4. bubbles */
    var pool = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.replace(L, '').split('');
    var bub = shuffle(u.marks.concat([u.forms[1].replace('ـ', ''), L])).concat(shuffle(pool).slice(0, 6));
    s.push({ t: 'bub', q: 'اضْغَطْ عَلَى كُلِّ فُقَاعَةٍ فِيهَا حَرْفُ (' + L + '):', L: L, items: shuffle(bub) });
    /* 5. build the word from its syllables */
    (u.split || []).slice(0, 3).forEach(function (x) {
      s.push({ t: 'order', q: 'رَتِّبِ المَقَاطِعَ لِتُكَوِّنَ الكَلِمَةَ:', e: x[1], say: x[0], toks: x[2], join: '' });
    });
    s.push({ t: 'end' });
    return s;
  }
  function grammarScreens(u) {
    var s = [{ t: 'introG' }];
    u.ex.forEach(function (x) {
      if (x.t === 'choose') x.items.forEach(function (it) {
        var html = it[0].indexOf('_') >= 0 ? esc(it[0]).replace('_', '<span class="gap">?</span>') : '<span class="gap">?</span> ' + esc(it[0]);
        s.push({ t: 'mcq', q: x.q, e: it[1], html: html, say: it[3] || '', opts: x.opts, a: it[2], big: x.opts[0].length < 3, small: x.opts[0].length > 3 });
      });
      if (x.t === 'pick') x.items.forEach(function (it) { s.push({ t: 'mcq', q: x.q, e: it[0], html: '', opts: it[1], a: it[2], small: true, sayOpts: true }); });
      if (x.t === 'sort') shuffle(x.items).forEach(function (it) { s.push({ t: 'mcq', q: x.q, e: it[1], html: esc(it[0]), say: it[0], opts: x.cats, a: it[2], small: true }); });
      if (x.t === 'order') x.items.forEach(function (it) { s.push({ t: 'order', q: x.q, e: it[0], say: it[1].join(x.join == null ? ' ' : x.join), toks: it[1], join: x.join == null ? ' ' : x.join }); });
      if (x.t === 'read') s.push({ t: 'read', q: x.q, e: x.e, text: x.text, ask: x.ask, opts: x.opts, a: x.a });
    });
    s.push({ t: 'end' });
    return s;
  }

  /* ---------- runner ---------- */
  var ov, cur = null;
  function ensure() {
    if (ov) return;
    ov = document.createElement('div'); ov.id = 'lxOv';
    ov.innerHTML = '<div class="lx-top"><button class="lx-x" type="button" data-lx="close">✕</button><b id="lxT"></b><span id="lxN" style="font:700 .85rem Inter,sans-serif;color:#5b6b66"></span></div>' +
      '<div class="lx-bar"><i id="lxBar" style="width:0"></i></div><div class="lx-body" id="lxB"></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', onClick);
  }
  function open(id, opts) {
    var u = U[id]; if (!u) return;
    ensure();
    cur = { id: id, u: u, opts: opts || {}, s: u.level === 1 ? letterScreens(u) : grammarScreens(u), i: 0, ok: 0, tot: 0, tried: false, t0: Date.now(), tick: Date.now() };
    cur.s.forEach(function (x) { if (x.t === 'mcq' || x.t === 'order' || x.t === 'read' || x.t === 'bub') cur.tot++; });
    document.getElementById('lxT').textContent = '🔤 ' + u.title;
    ov.classList.add('show'); document.body.style.overflow = 'hidden';
    show();
  }
  function close() {
    if (!cur) return;
    report(); ov.classList.remove('show'); document.body.style.overflow = '';
    try { speechSynthesis.cancel(); } catch (e) {}
    cur = null;
  }
  function report() {   // practice seconds since the last report
    if (!cur || !cur.opts.onTime) return;
    var secs = Math.round((Date.now() - cur.tick) / 1000); cur.tick = Date.now();
    if (secs > 0) cur.opts.onTime(Math.min(secs, 900));
  }
  setInterval(function () { if (cur && document.visibilityState === 'visible') report(); }, 20000);

  function show() {
    var x = cur.s[cur.i], u = cur.u, h = '';
    cur.tried = false; cur.sel = [];
    document.getElementById('lxBar').style.width = Math.round(cur.i * 100 / (cur.s.length - 1)) + '%';
    document.getElementById('lxN').textContent = (x.t === 'end' || /^intro/.test(x.t)) ? '' : ar(cur.i + ' / ' + (cur.s.length - 2));
    if (x.t === 'introL') {
      h += '<div class="lx-q">تَعَرَّفْ عَلَى ' + esc(u.title) + ' <span class="muted" style="font-weight:400">· 📕 ص ' + ar(esc(u.pages)) + '</span></div>';
      h += '<div class="lx-forms">' + u.forms.map(function (f, i) { return '<span>' + esc(f) + '<small>' + ['مُنْفَصِل', 'أَوَّل', 'وَسَط', 'آخِر'][i] + '</small></span>'; }).join('') + '</div>';
      GROUPS.forEach(function (g, gi) {
        h += '<div class="lx-row"><h5><span class="mk">' + esc(u.marks[gi]) + '</span> ' + esc(u.letter) + ' ' + MK_NAME[gi] + '</h5><div class="lx-cards">' +
          u.words[g].map(function (w) { return '<button class="lx-card" type="button" data-say="' + esc(w[0]) + '"><span class="e">' + pic(w[1]) + '</span><span class="w">' + esc(w[0]) + '</span><span class="n">' + esc(w[2]) + '</span></button>'; }).join('') + '</div></div>';
      });
      if (u.chant) h += '<div class="lx-chant">🎵 ' + esc(u.chant) + ' ' + spk(u.chant.replace(/\.\.\./g, '،')) + '</div>';
      h += '<p class="muted" style="font-size:.85rem">' + (nl() ? 'Tik op een woord om het te horen.' : 'اضْغَطْ عَلَى أَيِّ كَلِمَةٍ لِتَسْمَعَهَا.') + '</p>';
      h += '<button class="lx-next" type="button" data-lx="next">' + (nl() ? 'Start de oefeningen ▶' : 'ابْدَأِ التَّمَارِينَ ▶') + '</button>';
    } else if (x.t === 'introG') {
      h += '<div class="lx-q">' + esc(u.title) + ' <span class="muted" style="font-weight:400">· 📕 ص ' + ar(esc(u.pages)) + '</span></div>';
      u.rule.forEach(function (r) { h += '<div class="lx-rule"><b>' + esc(r[0]) + '</b>' + esc(r[1]) + (r[2] ? '<div class="nl">' + esc(r[2]) + '</div>' : '') + '</div>'; });
      if (u.tip) h += '<div class="lx-tip">💡 ' + esc(u.tip) + '</div>';
      h += '<div class="lx-cards">' + u.examples.map(function (e) { return '<button class="lx-card" type="button" data-say="' + esc(e[0]) + '"><span class="e">' + pic(e[1]) + '</span><span class="w">' + esc(e[0]) + '</span></button>'; }).join('') + '</div>';
      h += '<button class="lx-next" type="button" data-lx="next">' + (nl() ? 'Start de oefeningen ▶' : 'ابْدَأِ التَّمَارِينَ ▶') + '</button>';
    } else if (x.t === 'mcq') {
      h += '<div class="lx-q">' + esc(x.q) + '</div><div class="lx-pic">' + pic(x.e) + '</div>';
      if (x.html) h += '<div class="lx-word">' + x.html + (x.say ? spk(x.say) : '') + '</div>';
      h += '<div class="lx-opts">' + x.opts.map(function (o, i) { return '<button class="lx-opt' + (x.small ? ' sm' : '') + '" type="button" data-opt="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div>';
      h += '<div class="lx-fb" id="lxFb"></div><button class="lx-next" type="button" data-lx="next" disabled>' + (nl() ? 'Volgende ◀' : 'التَّالِي ◀') + '</button>';
    } else if (x.t === 'read') {
      h += '<div class="lx-q">' + esc(x.q) + '</div><div class="lx-pic">' + x.e + '</div><div class="lx-read">' + esc(x.text) + ' ' + spk(x.text) + '</div>';
      h += '<div class="lx-q" style="margin-top:14px">' + esc(x.ask) + '</div><div class="lx-opts">' + x.opts.map(function (o, i) { return '<button class="lx-opt sm" type="button" data-opt="' + i + '">' + esc(o) + '</button>'; }).join('') + '</div>';
      h += '<div class="lx-fb" id="lxFb"></div><button class="lx-next" type="button" data-lx="next" disabled>' + (nl() ? 'Volgende ◀' : 'التَّالِي ◀') + '</button>';
    } else if (x.t === 'order') {
      x.sh = shuffle(x.toks.map(function (t, i) { return i; }));
      if (x.sh.join() === x.toks.map(function (t, i) { return i; }).join() && x.toks.length > 1) x.sh.reverse();
      h += '<div class="lx-q">' + esc(x.q) + '</div><div class="lx-pic">' + pic(x.e) + ' ' + spk(x.say) + '</div><div class="lx-slots" id="lxSl"></div>';
      h += '<div class="lx-toks">' + x.sh.map(function (ti, k) { return '<button class="lx-tok" type="button" data-tok="' + k + '">' + esc(x.toks[ti]) + '</button>'; }).join('') + '</div>';
      h += '<div class="lx-fb" id="lxFb"></div><button class="lx-next" type="button" data-lx="next" disabled>' + (nl() ? 'Volgende ◀' : 'التَّالِي ◀') + '</button>';
    } else if (x.t === 'bub') {
      x.need = x.items.filter(function (b) { return bare(b) === x.L; }).length; x.got = 0;
      h += '<div class="lx-q">' + esc(x.q) + '</div><div class="lx-bub">' + x.items.map(function (b, i) { return '<button type="button" data-bub="' + i + '">' + esc(b) + '</button>'; }).join('') + '</div>';
      h += '<div class="lx-fb" id="lxFb"></div><button class="lx-next" type="button" data-lx="next" disabled>' + (nl() ? 'Volgende ◀' : 'التَّالِي ◀') + '</button>';
    } else if (x.t === 'end') {
      var pct = cur.tot ? cur.ok / cur.tot : 1, stars = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : 1;
      cur.stars = stars;
      h += '<div class="lx-end"><div class="st">' + '⭐'.repeat(stars) + '<span style="opacity:.25">' + '⭐'.repeat(3 - stars) + '</span></div>' +
        '<h3>' + (stars === 3 ? 'مُمْتَاز! أَحْسَنْتَ 🎉' : stars === 2 ? 'جَيِّدٌ جِدًّا! 👏' : 'أَحْسَنْتَ المُحَاوَلَةَ 💪') + '</h3>' +
        '<p>' + (nl() ? 'Goede antwoorden: ' : 'الإِجَابَاتُ الصَّحِيحَةُ مِنَ المَرَّةِ الأُولَى: ') + '<b>' + ar(cur.ok) + '</b> / ' + ar(cur.tot) + '</p>' +
        '<button class="lx-next" type="button" data-lx="again" style="background:#fff;color:#0f4d3c;border:2px solid #0f4d3c;box-shadow:none">' + (nl() ? 'Opnieuw 🔁' : 'أَعِدِ التَّمَارِينَ 🔁') + '</button>' +
        '<button class="lx-next" type="button" data-lx="close">' + (nl() ? 'Klaar ✓' : 'إِنْهَاء ✓') + '</button></div>';
      if (cur.opts.onDone) cur.opts.onDone(cur.ok, cur.tot, stars);
      if (stars === 3 && window.confettiBurst) window.confettiBurst();
    }
    document.getElementById('lxB').innerHTML = h;
    document.getElementById('lxB').scrollTop = 0;
    if (x.t === 'mcq' && x.say && x.big) setTimeout(function () { say(x.say); }, 300);
  }
  function chime(ok) {
    try {
      var C = window.AudioContext || window.webkitAudioContext; if (!C) return;
      var c = new C(), t0 = c.currentTime;
      (ok ? [659.25, 987.77] : [220, 180]).forEach(function (f, i) {
        var o = c.createOscillator(), g = c.createGain(); o.type = ok ? 'triangle' : 'sawtooth'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + i * 0.1); g.gain.exponentialRampToValueAtTime(ok ? 0.2 : 0.06, t0 + i * 0.1 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.1 + 0.3);
        o.connect(g); g.connect(c.destination); o.start(t0 + i * 0.1); o.stop(t0 + i * 0.1 + 0.32);
      });
    } catch (e) {}
  }
  function fb(ok, txt) { var f = document.getElementById('lxFb'); f.className = 'lx-fb ' + (ok ? 'ok' : 'no'); f.textContent = txt; }
  function onClick(e) {
    var b = e.target.closest('[data-lx],[data-opt],[data-tok],[data-bub],[data-say]'); if (!b || !cur) return;
    if (b.dataset.say != null && !b.dataset.opt) { say(b.dataset.say); return; }
    var x = cur.s[cur.i];
    if (b.dataset.lx === 'close') { close(); return; }
    if (b.dataset.lx === 'again') { var id = cur.id, o = cur.opts; report(); cur = null; open(id, o); return; }
    if (b.dataset.lx === 'next') { if (cur.i < cur.s.length - 1) { cur.i++; show(); } return; }
    if (b.dataset.opt != null) {
      if (b.disabled) return;
      var i = +b.dataset.opt, ok = i === x.a;
      if (x.sayOpts) say(x.opts[i]);
      if (ok) {
        if (!cur.tried) cur.ok++;
        b.classList.add('ok'); fb(true, ['أَحْسَنْتَ! ✓', 'مُمْتَاز! ✓', 'رَائِع! ✓'][Math.floor(Math.random() * 3)]); chime(true);
        [].forEach.call(document.querySelectorAll('[data-opt]'), function (y) { y.disabled = true; });
        document.querySelector('[data-lx="next"]').disabled = false;
        if (x.say && !x.big && !x.sayOpts) say(x.say);
      } else {
        cur.tried = true; b.classList.add('no'); b.disabled = true; fb(false, 'حَاوِلْ مَرَّةً أُخْرَى'); chime(false);
      }
      return;
    }
    if (b.dataset.tok != null) {
      var k = +b.dataset.tok, need = cur.sel.length, want = x.toks[need];
      if (x.toks[x.sh[k]] === want) {
        cur.sel.push(want); b.classList.add('used');
        document.getElementById('lxSl').textContent = cur.sel.join(x.join);
        if (cur.sel.length === x.toks.length) {
          if (!cur.tried) cur.ok++;
          fb(true, 'أَحْسَنْتَ! ✓'); chime(true); say(x.say); document.querySelector('[data-lx="next"]').disabled = false;
        }
      } else { cur.tried = true; b.classList.add('no'); fb(false, 'لَيْسَ هَذَا، جَرِّبْ غَيْرَهُ'); chime(false); setTimeout(function () { b.classList.remove('no'); }, 400); }
      return;
    }
    if (b.dataset.bub != null) {
      if (b.classList.contains('ok')) return;
      var v = x.items[+b.dataset.bub];
      if (bare(v) === x.L) {
        b.classList.add('ok'); x.got++; chime(true); say(v);
        if (x.got === x.need) { if (!cur.tried) cur.ok++; fb(true, 'وَجَدْتَهَا كُلَّهَا! ✓'); document.querySelector('[data-lx="next"]').disabled = false; }
      } else { cur.tried = true; b.classList.add('no'); chime(false); setTimeout(function () { b.classList.remove('no'); }, 400); }
    }
  }

  /* ---------- printable worksheet ---------- */
  function printSheet(id) {
    var u = U[id]; if (!u) return '';
    var css = '<style>body{font-family:"Noto Naskh Arabic","Amiri",serif;direction:rtl;margin:18mm 14mm;color:#1d2a26}h1{font-family:Amiri,serif;color:#0f4d3c;margin:0}' +
      '.sub{color:#5b6b66;margin:0 0 10px}.tr{display:flex;justify-content:space-around;margin:14px 0}.tr span{font-family:Amiri,serif;font-size:72pt;color:#fff;-webkit-text-stroke:1.5px #9aa;line-height:1.3}' +
      '.ln{border-bottom:2px dotted #bbb;height:16mm;margin:4mm 0;display:flex;align-items:flex-end;gap:12mm;font-family:Amiri,serif;font-size:26pt}.ln .g{color:#fff;-webkit-text-stroke:1px #9aa}' +
      'h2{font-size:14pt;color:#0f4d3c;margin:16px 0 4px}.foot{margin-top:14px;font-size:9pt;color:#888;text-align:center}@media print{button{display:none}}</style>';
    var h = '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>' + esc(u.title) + '</title>' +
      '<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&display=swap" rel="stylesheet">' + css + '</head><body>' +
      '<button onclick="print()" style="float:left;padding:8px 16px">🖨️ طباعة</button><h1>' + esc(u.title) + '</h1><p class="sub">أكاديمية الفرقان · ورقة عمل · الاسم: ........................</p>';
    if (u.level === 1) {
      h += '<h2>١. تَتَبَّعْ أَشْكَالَ الحَرْفِ:</h2><div class="tr">' + u.forms.map(function (f) { return '<span>' + esc(f) + '</span>'; }).join('') + '</div>';
      h += '<h2>٢. تَتَبَّعْ ثُمَّ اكْتُبْ:</h2>' + u.marks.map(function (m) { return '<div class="ln"><span class="g">' + esc(m) + '</span><span class="g">' + esc(m) + '</span><span class="g">' + esc(m) + '</span></div>'; }).join('');
      h += '<h2>٣. انْسَخِ الكَلِمَاتِ:</h2>' + GROUPS.map(function (g) { var w = u.words[g][0]; return '<div class="ln"><span>' + (/^[\u0660-\u0669]+$/.test(w[1]) ? '' : w[1] + ' ') + esc(w[0]) + '</span></div>'; }).join('');
    } else {
      h += u.rule.map(function (r) { return '<p><b style="font-family:Amiri;font-size:18pt;color:#0f4d3c">' + esc(r[0]) + '</b> ' + esc(r[1]) + '</p>'; }).join('');
      h += '<h2>انْسَخِ الجُمَلَ بِخَطٍّ جَمِيلٍ:</h2>' + u.examples.map(function (e) { return '<div class="ln"><span>' + e[1] + ' ' + esc(e[0]) + '</span></div><div class="ln"></div>'; }).join('');
    }
    return h + '<p class="foot">alfurqanacademie.nl</p></body></html>';
  }

  window.LangRun = { open: open, close: close, units: U, printSheet: printSheet, say: say,
    screens: function (id) { var u = U[id]; return u ? (u.level === 1 ? letterScreens(u) : grammarScreens(u)) : []; } };
})();
