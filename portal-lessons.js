/* Al-Furqan Academie – lesson of the week, Quran player and celebrations (used by portal.html) */
(function () {
  var QTEXT = 'https://api.alquran.cloud/v1/surah/';
  var RECITERS = [
    { id: 'ar.husary', ar: 'الحصري', nl: 'Al-Husary' },
    { id: 'ar.alafasy', ar: 'العفاسي', nl: 'Alafasy' },
    { id: 'ar.minshawi', ar: 'المنشاوي', nl: 'Al-Minshawi' }
  ];
  var KIDS_SURAH = 'https://cdn.islamic.network/quran/audio-surah/128/ar.alhusaynialazazichildren/';

  var W = {
    ar: { week: 'درس هذا الأسبوع', hi: 'مرحباً ', surah: 'السورة المطلوبة', ayat: 'الآيات ', to: ' إلى ', listen: '▶ استمع للآيات',
      stop: '■ إيقاف', repeat: 'التكرار', times: ' مرات', once: 'مرة واحدة', reciter: 'القارئ', kids: '🎧 السورة كاملة مع الأطفال',
      tap: 'اضغط على أي آية لسماعها.', hw: 'الواجب', topic: 'موضوع الأسبوع', video: '▶ شاهد الفيديو', done: '✅ أنجزتُ الواجب',
      doneOk: '✓ تم إنجاز الواجب — أحسنت!', undo: 'تراجع', prev: 'الدروس السابقة', noLesson: 'لا يوجد درس مسجّل بعد. سيظهر هنا درس الأسبوع وواجبه.',
      bravo: 'أحسنت يا ', partyText: 'بارك الله فيك! استمر هكذا 🌟', loading: 'جارٍ التحميل…', qErr: 'تعذّر تحميل الآيات. حاول مرة أخرى.',
      doneShort: '✓ أُنجز', notDone: 'لم يُنجز', allGroups: 'كل المجموعات', grp: 'المجموعة ',
      pr: 'تدريب هذا الأسبوع', min: ' دقيقة', of: ' من ', days: 'أيام التدريب: ', last: 'آخر تدريب: ', never: 'لم يبدأ التدريب بعد', today: 'اليوم', yest: 'أمس',
      goalHit: 'حققتَ هدف الأسبوع! 🎯', goalText: 'استمعتَ للتلاوة وتدربتَ كل هذا الوقت. ما شاء الله!', listenHint: 'استمع للتلاوة وكرّر الآيات لتملأ الدائرة 🎧' },
    nl: { week: 'Les van deze week', hi: 'Hallo ', surah: 'Soera om te leren', ayat: 'Verzen ', to: ' t/m ', listen: '▶ Luister',
      stop: '■ Stop', repeat: 'Herhalen', times: 'x', once: '1x', reciter: 'Recitator', kids: '🎧 Hele soera met kinderen',
      tap: 'Tik op een vers om het te horen.', hw: 'Huiswerk', topic: 'Onderwerp van de week', video: '▶ Bekijk de video', done: '✅ Huiswerk af!',
      doneOk: '✓ Huiswerk gedaan — goed zo!', undo: 'ongedaan maken', prev: 'Vorige lessen', noLesson: 'Nog geen les ingevoerd. Hier verschijnt de les en het huiswerk van de week.',
      bravo: 'Goed gedaan, ', partyText: 'Ga zo door! 🌟', loading: 'Laden…', qErr: 'Verzen konden niet worden geladen. Probeer opnieuw.',
      doneShort: '✓ gedaan', notDone: 'niet gedaan', allGroups: 'alle groepen', grp: 'Groep ',
      pr: 'Oefenen deze week', min: ' min', of: ' van ', days: 'Oefendagen: ', last: 'Laatst geoefend: ', never: 'Nog niet geoefend', today: 'vandaag', yest: 'gisteren',
      goalHit: 'Weekdoel gehaald! 🎯', goalText: 'Je hebt deze week flink geluisterd en geoefend. Knap gedaan!', listenHint: 'Luister naar de recitatie en herhaal de verzen om de cirkel te vullen 🎧' }
  };
  function w() { return W[lang] || W.ar; }
  function surahName(n) { return lang === 'nl' ? (SURAHS_NL[n - 1] || '') : (SURAHS[n - 1] || ''); }
  function first(name) { return String(name || '').split(/\s+/)[0]; }
  function tr(l, f) { return lang === 'nl' && l[f + 'Nl'] ? l[f + 'Nl'] : (l[f] || ''); }
  (function () {
    var st = document.createElement('style');
    st.textContent = '.quran.nlm{text-align:right}.ayrow{padding:6px 0;border-bottom:1px dashed #e7dfcc}.ayrow:last-child{border-bottom:0}' +
      '.nltr{direction:ltr;text-align:left;font-family:Inter,system-ui,sans-serif;font-size:.95rem;line-height:1.6;color:#3d4b47;margin:2px 0 4px}' +
      '.nltr b{color:#8a6510;margin-right:6px}.trsrc{font-size:.75rem;color:#8a9692;margin-top:6px;direction:ltr;text-align:left}' +
      '.prac{display:flex;align-items:center;gap:14px;margin-top:12px;background:#fff;border:1px solid #e7dfcc;border-radius:14px;padding:10px 14px}' +
      '.prac svg{width:64px;height:64px;flex:0 0 64px}.prac .rv{transition:stroke-dashoffset .6s ease}.prac b{color:#0f4d3c}.prac .muted{font-size:.85rem}';
    document.head.appendChild(st);
  })();
  function fmtDate(d) { var p = String(d).split('-'); return p.length === 3 ? p[2] + '/' + p[1] : d; }

  /* ---------- cartoon owl (original drawing) ---------- */
  window.owlSvg = function (cls) {
    return '<svg class="owl ' + (cls || '') + '" viewBox="0 0 120 120" aria-hidden="true">' +
      '<ellipse cx="60" cy="112" rx="30" ry="5" fill="rgba(0,0,0,.08)"/>' +
      '<path class="wing l" d="M30 62 C14 70 14 92 28 100 C32 88 34 76 30 62Z" fill="#0b3b2e"/>' +
      '<path class="wing r" d="M90 62 C106 70 106 92 92 100 C88 88 86 76 90 62Z" fill="#0b3b2e"/>' +
      '<ellipse cx="60" cy="72" rx="32" ry="36" fill="#14654f"/>' +
      '<ellipse cx="60" cy="84" rx="20" ry="22" fill="#f3e7c6"/>' +
      '<path d="M50 80 q5 4 10 0 q5 4 10 0 M48 90 q6 4 12 0 q6 4 12 0" stroke="#d9c38e" stroke-width="2" fill="none"/>' +
      '<path d="M34 40 L40 22 L50 36Z M86 40 L80 22 L70 36Z" fill="#14654f"/>' +
      '<circle cx="46" cy="56" r="13" fill="#fff"/><circle cx="74" cy="56" r="13" fill="#fff"/>' +
      '<circle cx="47" cy="57" r="6.5" fill="#1d2a26"/><circle cx="73" cy="57" r="6.5" fill="#1d2a26"/>' +
      '<circle cx="49" cy="54.5" r="2.2" fill="#fff"/><circle cx="75" cy="54.5" r="2.2" fill="#fff"/>' +
      '<ellipse class="lid" cx="46" cy="56" rx="13.5" ry="13.5" fill="#14654f"/><ellipse class="lid" cx="74" cy="56" rx="13.5" ry="13.5" fill="#14654f"/>' +
      '<path d="M55 66 L60 74 L65 66Z" fill="#c9a24a"/>' +
      '<circle cx="36" cy="68" r="4" fill="#f4a3a3" opacity=".55"/><circle cx="84" cy="68" r="4" fill="#f4a3a3" opacity=".55"/>' +
      '<path d="M50 106 v6 M56 106 v6 M64 106 v6 M70 106 v6" stroke="#c9a24a" stroke-width="3" stroke-linecap="round"/>' +
      '<g transform="translate(60 20)"><path d="M-22 4 L0 -6 L22 4 L0 13Z" fill="#1d2a26"/><rect x="-11" y="6" width="22" height="7" rx="2" fill="#1d2a26"/>' +
      '<path d="M18 6 v12" stroke="#c9a24a" stroke-width="2"/><circle cx="18" cy="19" r="2.6" fill="#c9a24a"/></g>' +
      '</svg>';
  };

  /* ---------- weekly practice ring ---------- */
  var liveSecs = {};
  function todayStr() { var d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function weekStr() { var d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); }
  function lastTxt(d) {
    var L = w(); if (!d) return L.never;
    var t = todayStr(), y = new Date(Date.now() - 864e5); y.setMinutes(y.getMinutes() - y.getTimezoneOffset());
    return L.last + (d === t ? L.today : d === y.toISOString().slice(0, 10) ? L.yest : fmtDate(d));
  }
  function pracHtml(k) {
    var p = k.practice || { weekSecs: 0, goalSecs: 1200, weekDays: 0, last: '' }, L = w();
    return '<div class="prac" id="pr_' + k.num + '" data-base="' + (p.weekSecs || 0) + '" data-goal="' + (p.goalSecs || 1200) + '" data-name="' + esc(first(k.name)) + '">' +
      '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="#eee6d2" stroke-width="7"/>' +
      '<circle class="rv" cx="32" cy="32" r="26" fill="none" stroke="#2bb673" stroke-width="7" stroke-linecap="round" transform="rotate(-90 32 32)" stroke-dasharray="163.4" stroke-dashoffset="163.4"/>' +
      '<text x="32" y="37" text-anchor="middle" font-size="15" font-weight="700" fill="#0f4d3c" font-family="Inter,sans-serif">0%</text></svg>' +
      '<div><b>🎧 ' + esc(L.pr) + '</b><div class="pv"></div><div class="muted">' + esc(L.days) + '<bdi>' + (p.weekDays || 0) + '</bdi> · ' + esc(lastTxt(p.last)) + '</div></div></div>';
  }
  function updateRing(num) {
    var el = document.getElementById('pr_' + num); if (!el) return;
    var L = w(), goal = +el.dataset.goal, secs = +el.dataset.base + (liveSecs[num] || 0);
    var pct = Math.min(1, secs / goal), mins = Math.floor(secs / 60);
    el.querySelector('.rv').setAttribute('stroke-dashoffset', (163.4 * (1 - pct)).toFixed(1));
    el.querySelector('text').textContent = Math.round(pct * 100) + '%';
    el.querySelector('.pv').innerHTML = '<bdi>' + mins + '</bdi>' + esc(L.of) + '<bdi>' + Math.round(goal / 60) + '</bdi>' + esc(L.min) +
      (secs < 60 ? ' · <span class="muted">' + esc(L.listenHint) + '</span>' : '');
    var key = 'goal_' + num + '_' + weekStr();
    if (secs >= goal && +el.dataset.base < goal) {
      var seen = null; try { seen = localStorage.getItem(key); } catch (e) {}
      if (!seen) { try { localStorage.setItem(key, '1'); } catch (e) {} party(el.dataset.name, L.goalHit, L.goalText); }
    }
  }

  /* ---------- activity reporting (opened lesson, listening seconds, ayah repeats) ---------- */
  var pend = {};
  function addAct(key, secs, reps) {
    if (!key) return;
    var o = pend[key] = pend[key] || { secs: 0, reps: 0 };
    o.secs += secs || 0; o.reps += reps || 0;
    var num = key.split('_')[0];
    if (secs) { liveSecs[num] = (liveSecs[num] || 0) + secs; updateRing(num); }
  }
  function post(body) {
    if (!window.authBody || !authBody(body)) return;
    try { fetch(API_URL, { method: 'POST', body: JSON.stringify(body), keepalive: true }).catch(function () {}); } catch (e) {}
  }
  function flush() {
    Object.keys(pend).forEach(function (key) {
      var o = pend[key], secs = Math.floor(o.secs);
      if (secs < 1 && !o.reps) return;
      var p = key.split('_');
      post({ action: 'activity', num: p[0], lesson: p[1], secs: secs, reps: o.reps });
      o.secs -= secs; o.reps = 0;
    });
  }
  setInterval(flush, 30000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(); });
  window.addEventListener('pagehide', flush);
  function markOpened(kids) {
    var d = todayStr();
    (kids || []).forEach(function (k) {
      var l = (k.lessons || [])[0]; if (!l) return;
      var key = 'op_' + k.num + '_' + l.id + '_' + d, seen = null;
      try { seen = localStorage.getItem(key); } catch (e) {}
      if (seen) return;
      try { localStorage.setItem(key, '1'); } catch (e) {}
      post({ action: 'activity', num: k.num, lesson: l.id, open: true });
    });
  }

  function ytId(u) {
    var m = String(u || '').match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
    return m ? m[1] : '';
  }

  /* ---------- lesson html for one child ---------- */
  window.lessonHtml = function (k) {
    var L = w(), ls = k.lessons || [];
    if (!ls.length) {
      return '<div class="lesson"><div class="lhead">' + owlSvg() + '<div><h3>' + esc(L.week) + '</h3>' +
        '<div class="muted">' + esc(L.noLesson) + '</div></div></div>' + pracHtml(k) + '</div>';
    }
    var l = ls[0], key = k.num + '_' + l.id, h = '';
    h += '<div class="lesson"><div class="lhead">' + owlSvg() + '<div><h3>' + esc(L.week) + '</h3><div class="muted">' +
      esc(L.hi + first(k.name)) + ' 👋 · <bdi>' + esc(fmtDate(l.date)) + '</bdi></div></div></div>' + pracHtml(k);
    if (l.surah) {
      var from = l.from || 1, to = l.to || AYAHS[l.surah - 1];
      h += '<div class="sec"><h4>📖 ' + esc(L.surah) + ': ' + esc((lang === 'nl' ? 'Soera ' : 'سورة ') + surahName(l.surah)) + '</h4>' +
        '<div class="muted">' + esc(L.ayat) + '<bdi>' + from + '</bdi>' + esc(L.to) + '<bdi>' + to + '</bdi></div>' +
        '<div class="ctrl"><button class="sbtn" type="button" data-play="' + key + '">' + esc(L.listen) + '</button>' +
        '<label class="muted" style="margin:0;font-weight:400">' + esc(L.repeat) + ' <select data-rep="' + key + '">' +
        '<option value="1">' + esc(L.once) + '</option><option value="3">3' + esc(L.times) + '</option><option value="5">5' + esc(L.times) + '</option></select></label>' +
        '<label class="muted" style="margin:0;font-weight:400">' + esc(L.reciter) + ' <select data-rec="' + key + '">' +
        RECITERS.map(function (r) { return '<option value="' + r.id + '">' + esc(r[lang] || r.ar) + '</option>'; }).join('') + '</select></label></div>' +
        '<div class="quran" id="q_' + key + '" data-s="' + l.surah + '" data-f="' + from + '" data-t="' + to + '"><span class="muted" style="font-family:inherit;font-size:.9rem">' + esc(L.loading) + '</span></div>' +
        '<div class="muted" style="font-size:.85rem;margin-top:4px">' + esc(L.tap) + '</div>' +
        '<div class="ctrl"><button class="sbtn alt" type="button" data-kids="' + l.surah + '" data-key="' + key + '">' + esc(L.kids) + '</button></div></div>';
    }
    if (l.homework) h += '<div class="sec"><h4>✏️ ' + esc(L.hw) + '</h4><p>' + esc(tr(l, 'homework')) + '</p></div>';
    if (l.topic || l.text || l.video) {
      var id = ytId(l.video);
      h += '<div class="sec"><h4>🕌 ' + esc(L.topic) + (l.topic ? ': ' + esc(tr(l, 'topic')) : '') + '</h4>' + (l.text ? '<p>' + esc(tr(l, 'text')) + '</p>' : '') +
        (id ? '<div class="ctrl"><button class="sbtn gold" type="button" data-yt="' + id + '">' + esc(L.video) + '</button></div><div id="yt_' + key + '"></div>'
            : (l.video ? '<div class="ctrl"><a class="sbtn gold" style="text-decoration:none" href="' + esc(l.video) + '" target="_blank" rel="noopener">' + esc(L.video) + '</a></div>' : '')) +
        '</div>';
    }
    if (l.homework || l.surah) {
      h += l.done
        ? '<div class="done-ok">' + esc(L.doneOk) + '<a data-undo="' + k.num + '|' + l.id + '">' + esc(L.undo) + '</a></div>'
        : '<button class="done-btn" type="button" data-done="' + k.num + '|' + l.id + '" data-name="' + esc(first(k.name)) + '">' + esc(L.done) + '</button>';
    }
    if (ls.length > 1) {
      h += '<details class="prev"><summary>' + esc(L.prev) + '</summary>' + ls.slice(1).map(function (p) {
        var what = [p.surah ? (lang === 'nl' ? 'Soera ' : 'سورة ') + surahName(p.surah) + ' ' + (p.from || 1) + '–' + (p.to || AYAHS[p.surah - 1]) : '', tr(p, 'topic')].filter(Boolean).join(' · ');
        return '<div class="prow"><span><bdi>' + esc(fmtDate(p.date)) + '</bdi> · ' + esc(what || tr(p, 'homework')) + '</span>' +
          (p.done ? '<span style="color:var(--ok);white-space:nowrap">' + esc(L.doneShort) + '</span>'
                  : '<button class="sbtn alt" style="padding:4px 12px;font-size:.85rem" type="button" data-done="' + k.num + '|' + p.id + '" data-name="' + esc(first(k.name)) + '">✅</button>') + '</div>';
      }).join('') + '</details>';
    }
    return h + '</div>';
  };

  /* ---------- Quran text ---------- */
  var qCache = {};
  function loadSurah(n) {
    if (qCache[n]) return qCache[n];
    qCache[n] = fetch(QTEXT + n + '/editions/quran-uthmani,nl.siregar').then(function (r) { return r.json(); }).then(function (d) {
      if (!d || d.code !== 200 || !d.data || !d.data[0]) throw new Error('q');
      var nl = (d.data[1] && d.data[1].ayahs) || [];
      return d.data[0].ayahs.map(function (a, i) { return { n: a.numberInSurah, g: a.number, t: a.text, nl: nl[i] ? nl[i].text : '' }; });
    });
    qCache[n].catch(function () { delete qCache[n]; });
    return qCache[n];
  }
  var BSM = /^(بِسْمِ|بِّسْمِ)\s+\S+\s+\S+\s+\S+\s*/;
  function fillQuran(el) {
    var s = +el.dataset.s, f = +el.dataset.f, to = +el.dataset.t;
    loadSurah(s).then(function (ayahs) {
      var h = '';
      if (f === 1 && s !== 1 && s !== 9) h += '<div class="bsm">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>';
      var nlm = lang === 'nl';
      ayahs.forEach(function (a) {
        if (a.n < f || a.n > to) return;
        var txt = (a.n === 1 && s !== 1 && s !== 9) ? a.t.replace(BSM, '') : a.t;
        var ar = '<span class="ay" data-g="' + a.g + '" data-n="' + a.n + '">' + esc(txt) + '</span><span class="an">' + a.n + '</span> ';
        h += nlm ? '<div class="ayrow">' + ar + (a.nl ? '<div class="nltr"><b>' + a.n + '.</b>' + esc(a.nl) + '</div>' : '') + '</div>' : ar;
      });
      if (nlm) h += '<div class="trsrc">Vertaling: Sofian S. Siregar</div>';
      el.classList.toggle('nlm', nlm);
      el.innerHTML = h;
    }).catch(function () { el.innerHTML = '<span class="muted" style="font-size:.9rem">' + esc(w().qErr) + '</span>'; });
  }

  /* ---------- audio player ---------- */
  var audio = new Audio(), queue = [], qi = 0, curBtn = null, curBox = null, curKey = null, lastT = 0;
  audio.preload = 'auto';
  audio.addEventListener('play', function () { lastT = audio.currentTime; });
  audio.addEventListener('timeupdate', function () {
    var dt = audio.currentTime - lastT; lastT = audio.currentTime;
    if (!audio.paused && curKey && dt > 0 && dt < 2) addAct(curKey, dt, 0);
  });
  function stopAll() {
    audio.pause(); queue = []; qi = 0;
    if (curBtn) curBtn.textContent = w().listen;
    if (curBox) [].forEach.call(curBox.querySelectorAll('.ay.on'), function (x) { x.classList.remove('on'); });
    curBtn = null; curBox = null;
  }
  function playNext() {
    if (qi >= queue.length) { stopAll(); return; }
    var it = queue[qi++];
    [].forEach.call(curBox.querySelectorAll('.ay.on'), function (x) { x.classList.remove('on'); });
    if (it.el) { it.el.classList.add('on'); }
    audio.src = it.url;
    audio.play().catch(function () { stopAll(); });
  }
  audio.addEventListener('ended', function () { if (curKey && queue.length) addAct(curKey, 0, 1); setTimeout(playNext, 350); });
  audio.addEventListener('error', function () { if (queue.length) setTimeout(playNext, 200); });
  function startQueue(key, els, btn) {
    stopAll();
    var box = document.getElementById('q_' + key);
    var rep = +(document.querySelector('[data-rep="' + key + '"]') || {}).value || 1;
    var rec = (document.querySelector('[data-rec="' + key + '"]') || {}).value || 'ar.husary';
    curBox = box; curBtn = btn || null; curKey = key;
    els.forEach(function (el) {
      for (var i = 0; i < rep; i++) queue.push({ el: el, url: 'https://cdn.islamic.network/quran/audio/128/' + rec + '/' + el.dataset.g + '.mp3' });
    });
    if (curBtn) curBtn.textContent = w().stop;
    playNext();
  }

  /* ---------- celebration ---------- */
  function chime() {
    try {
      var C = window.AudioContext || window.webkitAudioContext; if (!C) return;
      var c = new C(), t0 = c.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        var o = c.createOscillator(), g = c.createGain();
        o.type = 'triangle'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + i * 0.12); g.gain.exponentialRampToValueAtTime(0.25, t0 + i * 0.12 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.12 + 0.5);
        o.connect(g); g.connect(c.destination); o.start(t0 + i * 0.12); o.stop(t0 + i * 0.12 + 0.55);
      });
    } catch (e) {}
  }
  var raf = null;
  function confetti() {
    var cv = document.getElementById('confetti'), ctx = cv.getContext('2d');
    var W2 = cv.width = innerWidth, H = cv.height = innerHeight, cols = ['#c9a24a', '#2bb673', '#f25f5c', '#4ea8de', '#ffd23f', '#9b5de5'];
    var ps = [];
    for (var i = 0; i < 160; i++) ps.push({ x: W2 / 2 + (Math.random() - .5) * 80, y: H / 2, vx: (Math.random() - .5) * 14, vy: -Math.random() * 15 - 4,
      r: Math.random() * 6 + 4, c: cols[i % cols.length], a: Math.random() * 6, va: (Math.random() - .5) * .3, star: i % 5 === 0 });
    var t = 0;
    cancelAnimationFrame(raf);
    (function frame() {
      ctx.clearRect(0, 0, W2, H); t++;
      ps.forEach(function (p) {
        p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c;
        if (p.star) { ctx.font = (p.r * 3) + 'px serif'; ctx.fillText('⭐', -p.r, p.r); }
        else ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        ctx.restore();
      });
      if (t < 200) raf = requestAnimationFrame(frame); else ctx.clearRect(0, 0, W2, H);
    })();
  }
  function party(name, title, text) {
    var L = w();
    document.getElementById('partyOwl').innerHTML = owlSvg();
    document.getElementById('partyTitle').textContent = title ? title : L.bravo + name + '!';
    document.getElementById('partyText').textContent = text || L.partyText;
    document.getElementById('party').classList.add('show');
    confetti(); chime();
    if (navigator.vibrate) try { navigator.vibrate([60, 40, 60]); } catch (e) {}
  }
  document.getElementById('partyClose').addEventListener('click', function () { document.getElementById('party').classList.remove('show'); });
  document.getElementById('party').addEventListener('click', function (e) { if (e.target.id === 'party') e.currentTarget.classList.remove('show'); });

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-play],[data-kids],[data-yt],[data-done],[data-undo],.ay');
    if (!b) return;
    if (b.classList.contains('ay')) {
      var box = b.closest('.quran'), key = box.id.slice(2);
      startQueue(key, [b], null); return;
    }
    if (b.dataset.play) {
      var k2 = b.dataset.play;
      if (curBtn === b) { stopAll(); return; }
      var els = [].slice.call(document.querySelectorAll('#q_' + k2 + ' .ay'));
      if (els.length) startQueue(k2, els, b); return;
    }
    if (b.dataset.kids) {
      stopAll();
      if (b.dataset.on) { delete b.dataset.on; b.textContent = w().kids; return; }
      b.dataset.on = '1'; b.textContent = w().stop; curKey = b.dataset.key;
      audio.src = KIDS_SURAH + b.dataset.kids + '.mp3'; audio.play().catch(function () {});
      audio.onended = function () { delete b.dataset.on; b.textContent = w().kids; audio.onended = null; };
      return;
    }
    if (b.dataset.yt) {
      var holder = b.parentNode.nextElementSibling;
      holder.innerHTML = '<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/' + b.dataset.yt +
        '?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>';
      b.parentNode.remove(); return;
    }
    if (b.dataset.done || b.dataset.undo) {
      var undo = !!b.dataset.undo, p = (b.dataset.done || b.dataset.undo).split('|'), nm = b.dataset.name || '';
      b.disabled = true; b.style.opacity = .6;
      api({ action: 'homework', num: p[0], lesson: p[1], undo: undo }).then(function (d) {
        if (d.ok) { stopAll(); render(d); if (!undo) party(nm); }
        else { b.disabled = false; b.style.opacity = 1; showError(d.error); }
      });
    }
  });

  window.afterRender = function (kids) {
    stopAll(); flush(); liveSecs = {};
    [].forEach.call(document.querySelectorAll('.quran[data-s]'), fillQuran);
    (kids || []).forEach(function (k) { updateRing(k.num); });
    markOpened(kids);
  };
  if (window.lastData) render(lastData);
})();
