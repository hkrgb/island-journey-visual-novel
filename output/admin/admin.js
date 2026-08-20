const SRC='https://raw.githubusercontent.com/hkrgb/island-journey-visual-novel/c5fceb05455bae9a3d049ccf5b46260c33ef23c3/output/admin/admin.js';
const PATCHES=[
  ["function spriteOptions(value){const custom=characters.flatMap(c=>Object.keys(c.moods||{}).map(m=>c.key+':'+m));return '<option value=\"\">沒有立繪</option>'+[...Object.keys({...BASE_SPR,...assets.sprite}),...custom].map(x=>'<option '+(x===value?'selected':'')+'>'+esc(x)+'</option>').join('')}", "function spriteOptions(value){const opts=['<option value=\"\">沒有立繪</option>'];characters.forEach(c=>{const url=(c.image||'').trim()||Object.values(c.moods||{}).find(u=>u&&String(u).trim())||'';if(!url)return;const label=(c.name||'未命名')+(c.key?' · '+c.key:'');opts.push('<option value=\"'+esc(url)+'\"'+(value===url?' selected':'')+'>'+esc(label)+'</option>');});Object.keys({...BASE_SPR,...(assets.sprite||{})}).forEach(k=>{opts.push('<option value=\"'+esc(k)+'\"'+(value===k?' selected':'')+'>'+esc(k)+'</option>');});return opts.join('');}"],
  ["PLACEHOLDER_RENDER"],
  ["PLACEHOLDER_ADD"]
];
