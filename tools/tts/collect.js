// Lists every Arabic text the language exercises can speak (used by the audio workflow).
const { JSDOM } = require('jsdom'); const fs = require('fs'); const path = require('path');
const root = path.join(__dirname, '..', '..');
const dom = new JSDOM('<!doctype html><body></body>', { runScripts: 'outside-only' }); const w = dom.window;
w.Audio = function () { return { play() { return Promise.resolve(); }, pause() {} }; };
w.setInterval = function () { return 0; };
w.eval(fs.readFileSync(path.join(root, 'lang-data.js'), 'utf8'));
w.eval(fs.readFileSync(path.join(root, 'lang.js'), 'utf8'));
const L = w.LangRun, S = new Set(), ar = /[ء-ي]/;
const add = t => { if (typeof t === 'string' && ar.test(t)) S.add(t); };
const walk = v => { if (typeof v === 'string') add(v); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
for (const id of Object.keys(L.units)) {
  const u = L.units[id]; walk(u);
  if (u.chant) add(u.chant.replace(/\.\.\./g, '،'));
  for (let k = 0; k < 80; k++) for (const x of L.screens(id)) {
    walk(x.say); walk(x.text); walk(x.opts); walk(x.items); walk(x.toks);
    if (x.html) (x.html.match(/data-say="([^"]+)"/g) || []).forEach(m => add(m.slice(10, -1)));
  }
  L.pool([id]).forEach(p => add(p.w));
}
fs.writeFileSync(process.argv[2] || 'said.json', JSON.stringify([...S].sort(), null, 1));
console.log(S.size + ' texts');
process.exit(0);
