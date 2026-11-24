/* Al-Furqan Academie – lesson of the week, Quran player and celebrations (used by portal.html) */
(function () {
  var QTEXT = 'https://api.alquran.cloud/v1/surah/';
  /* Uthmani text from Quran.com, written for the King Fahd Complex (Madinah Mushaf) Hafs font */
  var QC = 'https://api.quran.com/api/v4/quran/verses/uthmani?chapter_number=';
  var HAFS_FONT = 'https://cdn.jsdelivr.net/gh/mustafa0x/qpc-fonts@f93bf5f3/various-woff2/UthmanicHafs1%20Ver09.woff2';
  var BSM_HAFS = '\u0628\u0650\u0633\u0652\u0645\u0650 \u0671\u0644\u0644\u0651\u064e\u0647\u0650 \u0671\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0640\u0670\u0646\u0650 \u0671\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650';
  function arNum(n) { return String(n).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }); }
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
      qur: 'قرآن', arb: 'عربي', mn: ' د', pr: 'تدريب هذا الأسبوع', min: ' دقيقة', of: ' من ', days: 'أيام التدريب: ', last: 'آخر تدريب: ', never: 'لم يبدأ التدريب بعد', today: 'اليوم', yest: 'أمس',
      games: 'ألعاب المراجعة', gMem: 'لعبة الذاكرة', gSp: 'تحدي ٦٠ ثانية',
      arabic: 'اللغة العربية', book: 'الكتاب ص ', langGo: '▶ ابدأ تمارين اللغة', langAgain: '🔁 أعد التمارين', langDone: 'أنهيتَ التمارين', print: 'ورقة للطباعة',
      libLessons: 'الدروس السابقة', libSurahs: 'السور المحفوظة', libHint: 'اضغط على السورة لتسمعها وتراجعها. وقت المراجعة يُحسب في تدريب الأسبوع 🎧', noOld: 'لا توجد دروس سابقة بعد.', ayatN: ' آيات', fullSurah: 'السورة كاملة',
      goalHit: 'حققتَ هدف الأسبوع! 🎯', goalText: 'استمعتَ للتلاوة وتدربتَ كل هذا الوقت. ما شاء الله!', listenHint: 'استمع للتلاوة وكرّر الآيات لتملأ الدائرة 🎧' },
    nl: { week: 'Les van deze week', hi: 'Hallo ', surah: 'Soera om te leren', ayat: 'Verzen ', to: ' t/m ', listen: '▶ Luister',
      stop: '■ Stop', repeat: 'Herhalen', times: 'x', once: '1x', reciter: 'Recitator', kids: '🎧 Hele soera met kinderen',
      tap: 'Tik op een vers om het te horen.', hw: 'Huiswerk', topic: 'Onderwerp van de week', video: '▶ Bekijk de video', done: '✅ Huiswerk af!',
      doneOk: '✓ Huiswerk gedaan — goed zo!', undo: 'ongedaan maken', prev: 'Vorige lessen', noLesson: 'Nog geen les ingevoerd. Hier verschijnt de les en het huiswerk van de week.',
      bravo: 'Goed gedaan, ', partyText: 'Ga zo door! 🌟', loading: 'Laden…', qErr: 'Verzen konden niet worden geladen. Probeer opnieuw.',
      doneShort: '✓ gedaan', notDone: 'niet gedaan', allGroups: 'alle groepen', grp: 'Groep ',
      qur: 'Koran', arb: 'Arabisch', mn: ' min', pr: 'Oefenen deze week', min: ' min', of: ' van ', days: 'Oefendagen: ', last: 'Laatst geoefend: ', never: 'Nog niet geoefend', today: 'vandaag', yest: 'gisteren',
      games: 'Oefenspelletjes', gMem: 'Geheugenspel', gSp: '60 seconden',
      arabic: 'Arabisch', book: 'boek p. ', langGo: '▶ Start de oefeningen', langAgain: '🔁 Opnieuw oefenen', langDone: 'Oefeningen af', print: 'Werkblad printen',
      libLessons: 'Vorige lessen', libSurahs: 'Geleerde soera\'s', libHint: 'Tik op een soera om te luisteren en te herhalen. Herhalen telt mee voor het weekdoel 🎧', noOld: 'Nog geen vorige lessen.', ayatN: ' verzen', fullSurah: 'Hele soera',
      goalHit: 'Weekdoel gehaald! 🎯', goalText: 'Je hebt deze week flink geluisterd en geoefend. Knap gedaan!', listenHint: 'Luister naar de recitatie en herhaal de verzen om de cirkel te vullen 🎧' }
  };
  function w() { return W[lang] || W.ar; }
  function surahName(n) { return lang === 'nl' ? (SURAHS_NL[n - 1] || '') : (SURAHS[n - 1] || ''); }
  function first(name) { return String(name || '').split(/\s+/)[0]; }
  function tr(l, f) { return lang === 'nl' && l[f + 'Nl'] ? l[f + 'Nl'] : (l[f] || ''); }
  (function () {
    var st = document.createElement('style');
    st.textContent = "@font-face{font-family:'UthmanicHafs';src:url('" + HAFS_FONT + "') format('woff2');font-display:swap}" +
      ".quran.hf,.hf .bsm{font-family:'UthmanicHafs','Amiri Quran',serif}.quran.hf{font-size:1.75rem;line-height:2.25}" +
      ".quran.hf .an{border:0;min-width:0;height:auto;margin:0 3px;font:inherit;font-family:'UthmanicHafs',serif;color:#0f4d3c;vertical-align:baseline}" +
      "@media(max-width:600px){.quran.hf{font-size:1.65rem;text-align:justify}}" +
      '.quran.nlm{text-align:right}.ayrow{padding:6px 0;border-bottom:1px dashed #e7dfcc}.ayrow:last-child{border-bottom:0}' +
      '.nltr{direction:ltr;text-align:left;font-family:Inter,system-ui,sans-serif;font-size:.95rem;line-height:1.6;color:#3d4b47;margin:2px 0 4px}' +
      '.nltr b{color:#8a6510;margin-right:6px}.trsrc{font-size:.75rem;color:#8a9692;margin-top:6px;direction:ltr;text-align:left}' +
      '.prac{display:flex;align-items:center;gap:14px;margin-top:12px;background:#fff;border:1px solid #e7dfcc;border-radius:14px;padding:10px 14px}' +
      '.olds{background:#fff;border:1px solid #e7dfcc;border-radius:14px;margin-top:8px;overflow:hidden}.olds>summary{list-style:none;cursor:pointer;padding:12px 14px;display:flex;align-items:center;gap:10px}' +
      '.olds>summary::-webkit-details-marker{display:none}.olds>summary .st{flex:1;min-width:0}.olds>summary b{display:block}.olds>summary .muted{font-size:.82rem}' +
      '.olds>summary:after{content:"▾";color:#0f4d3c;transition:transform .2s}.olds[open]>summary:after{transform:rotate(180deg)}.olds[open]>summary{border-bottom:1px solid #e7dfcc;background:#f7f3e8}' +
      '.olds .obody{padding:0 10px 12px}.olds .sec{margin-top:10px}.libh{font-size:1.05rem;color:#0f4d3c;margin:16px 0 4px;display:flex;align-items:center;gap:8px}.libh .cnt{font:700 .8rem Inter,sans-serif;background:#efe8d6;border-radius:999px;padding:1px 9px;color:#5b6b66}' +
      '.snum{flex:0 0 34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#e3f3ea;color:#1f7a4d;font:700 .85rem Inter,sans-serif}.okd{color:#1f7a4d;font-size:.85rem;white-space:nowrap}' +
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
    return '<div class="prac" id="pr_' + k.num + '" data-base="' + (p.weekSecs || 0) + '" data-goal="' + (p.goalSecs || 1200) + '" data-ba="' + (p.weekArabic || 0) + '" data-name="' + esc(first(k.name)) + '">' +
      '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="none" stroke="#eee6d2" stroke-width="7"/>' +
      '<circle class="rv" cx="32" cy="32" r="26" fill="none" stroke="#2bb673" stroke-width="7" stroke-linecap="round" transform="rotate(-90 32 32)" stroke-dasharray="163.4" stroke-dashoffset="163.4"/>' +
      '<text x="32" y="37" text-anchor="middle" font-size="15" font-weight="700" fill="#0f4d3c" font-family="Inter,sans-serif">0%</text></svg>' +
      '<div><b>🎧 ' + esc(L.pr) + '</b><div class="pv"></div><div class="muted sp" style="font-size:.9rem"></div><div class="muted">' + esc(L.days) + '<bdi>' + (p.weekDays || 0) + '</bdi> · ' + esc(lastTxt(p.last)) + '</div></div></div>';
  }
  function updateRing(num) {
    var el = document.getElementById('pr_' + num); if (!el) return;
    var L = w(), goal = +el.dataset.goal, secs = +el.dataset.base + (liveSecs[num] || 0);
    var pct = Math.min(1, secs / goal), mins = Math.floor(secs / 60);
    el.querySelector('.rv').setAttribute('stroke-dashoffset', (163.4 * (1 - pct)).toFixed(1));
    el.querySelector('text').textContent = Math.round(pct * 100) + '%';
    el.querySelector('.pv').innerHTML = '<bdi>' + mins + '</bdi>' + esc(L.of) + '<bdi>' + Math.round(goal / 60) + '</bdi>' + esc(L.min) +
      (secs < 60 ? ' · <span class="muted">' + esc(L.listenHint) + '</span>' : '');
    var sp = el.querySelector('.sp');
    if (sp) { var ar = +(el.dataset.ba || 0) + (liveAr[num] || 0), qu = Math.max(0, secs - ar);
      sp.innerHTML = '📖 ' + esc(L.qur) + ' <bdi>' + Math.floor(qu / 60) + '</bdi>' + esc(L.mn) + ' · ✏️ ' + esc(L.arb) + ' <bdi>' + Math.floor(ar / 60) + '</bdi>' + esc(L.mn); }
    var key = 'goal_' + num + '_' + weekStr();
    if (secs >= goal && +el.dataset.base < goal) {
      var seen = null; try { seen = localStorage.getItem(key); } catch (e) {}
      if (!seen) { try { localStorage.setItem(key, '1'); } catch (e) {} party(el.dataset.name, L.goalHit, L.goalText); }
    }
  }

  /* ---------- activity reporting (opened lesson, listening seconds, ayah repeats) ---------- */
  var pend = {}, liveAr = {};
  function isAr(key) { var l = String(key).split('_')[1] || ''; return l === 'GAME' || l.indexOf('U-') === 0; }
  function addAct(key, secs, reps) {
    if (!key) return;
    var o = pend[key] = pend[key] || { secs: 0, reps: 0 };
    o.secs += secs || 0; o.reps += reps || 0;
    var num = key.split('_')[0];
    if (secs) { liveSecs[num] = (liveSecs[num] || 0) + secs; if (isAr(key)) liveAr[num] = (liveAr[num] || 0) + secs; updateRing(num); }
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

  /* ---------- building blocks ---------- */
  function surahSec(key, surah, from, to, title) {
    var L = w();
    return '<div class="sec"><h4>📖 ' + esc(title || L.surah) + ': ' + esc((lang === 'nl' ? 'Soera ' : 'سورة ') + surahName(surah)) + '</h4>' +
      '<div class="muted">' + esc(L.ayat) + '<bdi>' + from + '</bdi>' + esc(L.to) + '<bdi>' + to + '</bdi></div>' +
      '<div class="ctrl"><button class="sbtn" type="button" data-play="' + key + '">' + esc(L.listen) + '</button>' +
      '<label class="muted" style="margin:0;font-weight:400">' + esc(L.repeat) + ' <select data-rep="' + key + '">' +
      '<option value="1">' + esc(L.once) + '</option><option value="3">3' + esc(L.times) + '</option><option value="5">5' + esc(L.times) + '</option></select></label>' +
      '<label class="muted" style="margin:0;font-weight:400">' + esc(L.reciter) + ' <select data-rec="' + key + '">' +
      RECITERS.map(function (r) { return '<option value="' + r.id + '">' + esc(r[lang] || r.ar) + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="quran" id="q_' + key + '" data-s="' + surah + '" data-f="' + from + '" data-t="' + to + '"><span class="muted" style="font-family:inherit;font-size:.9rem">' + esc(L.loading) + '</span></div>' +
      '<div class="muted" style="font-size:.85rem;margin-top:4px">' + esc(L.tap) + '</div>' +
      '<div class="ctrl"><button class="sbtn alt" type="button" data-kids="' + surah + '" data-key="' + key + '">' + esc(L.kids) + '</button></div></div>';
  }
  function langSec(k, l, key) {
    var u = LangRun.units[l.lang], L = w(), d = 0;
    try { d = +localStorage.getItem('lx_' + k.num + '_' + l.lang) || 0; } catch (e) {}
    return '<div class="sec"><h4>🔤 ' + esc(L.arabic) + ': ' + esc(u.title) + '</h4><div class="muted">' + (lang === 'nl' ? esc(u.nl) + ' · ' : '') + '📕 ' + esc(L.book + (lang === 'nl' ? u.pages : arNum(u.pages))) + '</div>' +
      (d ? '<div class="done-ok" style="margin-top:8px">' + '⭐'.repeat(d) + ' ' + esc(L.langDone) + '</div>' : '') +
      '<div class="ctrl"><button class="sbtn gold" type="button" data-langgo="' + esc(l.lang) + '" data-key="' + key + '" data-num="' + k.num + '">' + esc(d ? L.langAgain : L.langGo) + '</button>' +
      '<a class="sbtn alt" style="text-decoration:none" href="/lang.html?u=' + encodeURIComponent(l.lang) + '&print=1" target="_blank" rel="noopener">🖨️ ' + esc(L.print) + '</a></div></div>';
  }
  document.addEventListener('click', function (e) {
    var gm = e.target.closest('[data-game]');
    if (gm && window.LangRun) {
      stopAll(); var gn = gm.dataset.num;
      LangRun.game(gm.dataset.game, gm.dataset.units.split(','), { onTime: function (s) { addAct(gn + '_GAME', s, 0); } });
      return;
    }
    var b = e.target.closest('[data-langgo]'); if (!b || !window.LangRun) return;
    stopAll();
    var num = b.dataset.num, key = b.dataset.key, unit = b.dataset.langgo;
    LangRun.open(unit, {
      onTime: function (s) { addAct(num + '_U-' + unit, s, 0); },
      onDone: function (ok, tot, stars) {
        try { var prev = +localStorage.getItem('lx_' + num + '_' + unit) || 0; if (stars > prev) localStorage.setItem('lx_' + num + '_' + unit, stars); } catch (e) {}
        post({ action: 'activity', num: num, lesson: 'U-' + unit, reps: ok }); flush();
      }
    });
  });
  function lessonBody(k, l) {
    var L = w(), key = k.num + '_' + l.id, h = '';
    if (l.surah) h += surahSec(key, l.surah, l.from || 1, l.to || AYAHS[l.surah - 1]);
    if (l.lang && window.LangRun && LangRun.units[l.lang]) h += langSec(k, l, key);
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
    return h;
  }

  /* ---------- lesson of the week (newest lesson only) ---------- */
  window.lessonHtml = function (k) {
    var L = w(), ls = k.lessons || [];
    if (!ls.length) {
      return '<div class="lesson"><div class="lhead">' + owlSvg() + '<div><h3>' + esc(L.week) + '</h3>' +
        '<div class="muted">' + esc(L.noLesson) + '</div></div></div>' + pracHtml(k) + '</div>';
    }
    var l = ls[0];
    return '<div class="lesson"><div class="lhead">' + owlSvg() + '<div><h3>' + esc(L.week) + '</h3><div class="muted">' +
      esc(L.hi + first(k.name)) + ' 👋 · <bdi>' + esc(fmtDate(l.date)) + '</bdi></div></div></div>' + pracHtml(k) + lessonBody(k, l) + '</div>';
  };

  /* ---------- library: all older lessons + every surah learned so far ---------- */
  function learnedSurahs(k) {
    var ls = k.lessons || [], cur = ls[0] && ls[0].surah, set = {};
    if (cur) for (var n = cur + 1; n <= 114; n++) set[n] = 1;   // the class learns from An-Nas upwards
    ls.slice(1).forEach(function (l) { if (l.surah && l.surah !== cur) set[l.surah] = 1; });
    return Object.keys(set).map(Number).sort(function (a, b) { return Math.abs(a - (cur || 115)) - Math.abs(b - (cur || 115)); });
  }
  window.libraryHtml = function (k) {
    var L = w(), ls = (k.lessons || []).slice(1), sur = learnedSurahs(k), h = '<div class="panel">';
    var units = []; (k.lessons || []).forEach(function (l) { if (l.lang && window.LangRun && LangRun.units[l.lang] && units.indexOf(l.lang) < 0) units.push(l.lang); });
    if (units.length && LangRun.pool(units).length >= 4) {
      h += '<h3 class="libh">🎮 ' + esc(L.games) + '</h3><div class="ctrl" style="margin-top:0">' +
        '<button class="sbtn gold" type="button" data-game="mem" data-units="' + esc(units.join(',')) + '" data-num="' + k.num + '">🧠 ' + esc(L.gMem) + '</button>' +
        '<button class="sbtn gold" type="button" data-game="sp" data-units="' + esc(units.join(',')) + '" data-num="' + k.num + '">⏱️ ' + esc(L.gSp) + '</button></div>';
    }
    h += '<h3 class="libh">🗂️ ' + esc(L.libLessons) + ' <span class="cnt">' + ls.length + '</span></h3>';
    if (!ls.length) h += '<p class="muted" style="margin:4px 0 0">' + esc(L.noOld) + '</p>';
    ls.forEach(function (l) {
      var what = [l.surah ? (lang === 'nl' ? 'Soera ' : 'سورة ') + surahName(l.surah) : '', tr(l, 'topic')].filter(Boolean).join(' · ');
      h += '<details class="olds"><summary><span class="st"><b>' + esc(what || tr(l, 'homework')) + '</b><span class="muted"><bdi>' + esc(fmtDate(l.date)) + '</bdi></span></span>' +
        ((l.homework || l.surah) ? (l.done ? '<span class="okd">' + esc(L.doneShort) + '</span>' : '<span class="muted" style="font-size:.8rem">' + esc(L.notDone) + '</span>') : '') +
        '</summary><div class="obody">' + lessonBody(k, l) + '</div></details>';
    });
    if (sur.length) {
      h += '<h3 class="libh">📖 ' + esc(L.libSurahs) + ' <span class="cnt">' + sur.length + '</span></h3><p class="muted" style="margin:0 0 4px;font-size:.85rem">' + esc(L.libHint) + '</p>';
      sur.forEach(function (n) {
        h += '<details class="olds"><summary><span class="snum">' + (lang === 'nl' ? n : arNum(n)) + '</span><span class="st"><b>' + esc((lang === 'nl' ? 'Soera ' : 'سورة ') + surahName(n)) + '</b>' +
          '<span class="muted"><bdi>' + (lang === 'nl' ? AYAHS[n - 1] : arNum(AYAHS[n - 1])) + '</bdi>' + esc(L.ayatN) + '</span></span></summary><div class="obody">' +
          surahSec(k.num + '_S' + n, n, 1, AYAHS[n - 1], L.fullSurah) + '</div></details>';
      });
    }
    return h + '</div>';
  };
  /* fill Quran text only when a library item is opened */
  document.addEventListener('toggle', function (e) {
    var d = e.target;
    if (!d.classList || !d.classList.contains('olds')) return;
    if (!d.open) { if (curBox && d.contains(curBox)) stopAll(); return; }
    [].forEach.call(d.querySelectorAll('.quran[data-s]:not([data-filled])'), fillQuran);
  }, true);

  /* ---------- Quran text ---------- */
  var qCache = {};
  function loadSurah(n) {
    if (qCache[n]) return qCache[n];
    var tz = fetch(QTEXT + n + '/editions/quran-uthmani,nl.siregar').then(function (r) { return r.json(); });
    var qc = fetch(QC + n).then(function (r) { return r.json(); }).catch(function () { return null; });
    qCache[n] = Promise.all([tz, qc]).then(function (res) {
      var d = res[0], q = res[1];
      if (!d || d.code !== 200 || !d.data || !d.data[0]) throw new Error('q');
      var nl = (d.data[1] && d.data[1].ayahs) || [], ar = d.data[0].ayahs;
      var hv = q && q.verses && q.verses.length === ar.length ? q.verses : null;
      var list = ar.map(function (a, i) { return { n: a.numberInSurah, g: a.number, t: hv ? hv[i].text_uthmani : a.text, nl: nl[i] ? nl[i].text : '' }; });
      list.hafs = !!hv;
      return list;
    });
    qCache[n].catch(function () { delete qCache[n]; });
    return qCache[n];
  }
  var BSM = /^(بِسْمِ|بِّسْمِ)\s+\S+\s+\S+\s+\S+\s*/;
  function fillQuran(el) {
    var s = +el.dataset.s, f = +el.dataset.f, to = +el.dataset.t;
    el.setAttribute('data-filled', '1');
    loadSurah(s).then(function (ayahs) {
      var h = '';
      var hf = !!ayahs.hafs;
      if (f === 1 && s !== 1 && s !== 9) h += '<div class="bsm">' + (hf ? BSM_HAFS : 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ') + '</div>';
      var nlm = lang === 'nl';
      ayahs.forEach(function (a) {
        if (a.n < f || a.n > to) return;
        var txt = (!hf && a.n === 1 && s !== 1 && s !== 9) ? a.t.replace(BSM, '') : a.t;
        var ar = '<span class="ay" data-g="' + a.g + '" data-n="' + a.n + '">' + esc(txt) + '</span><span class="an">' + (hf ? arNum(a.n) : a.n) + '</span> ';
        h += nlm ? '<div class="ayrow">' + ar + (a.nl ? '<div class="nltr"><b>' + a.n + '.</b>' + esc(a.nl) + '</div>' : '') + '</div>' : ar;
      });
      if (nlm) h += '<div class="trsrc">Vertaling: Sofian S. Siregar</div>';
      el.classList.toggle('nlm', nlm); el.classList.toggle('hf', hf);
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
  window.confettiBurst = function () { confetti(); chime(); };
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
    [].forEach.call(document.querySelectorAll('.quran[data-s]'), function (el) { if (!el.closest('details:not([open])')) fillQuran(el); });
    (kids || []).forEach(function (k) { updateRing(k.num); });
    markOpened(kids);
  };
  if (window.lastData) render(lastData);
})();
