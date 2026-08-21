const SRC='https://raw.githubusercontent.com/hkrgb/island-journey-visual-novel/c5fceb05455bae9a3d049ccf5b46260c33ef23c3/output/admin/admin.js';
fetch(SRC+'?t='+Date.now()).then(r=>{
  if(!r.ok) throw new Error('HTTP '+r.status);
  return r.text();
}).then(code=>{
  // 角色立繪／表情：改成直接輸入圖片 URL（唔再要下拉）
  code=code.replace(
    '<label>角色立繪／表情<select data-field="sprite">\'+spriteOptions(l.sprite)+\'</select></label>',
    '<label>角色立繪 URL<input data-field="sprite" value="\'+esc(l.sprite)+\'" placeholder="https://..."></label>'
  );
  // assetUrl：支援直接用 http(s) URL
  code=code.replace(
    "const assetUrl=(type,key)=>resolveUrl((assets[type]&&assets[type][key])||(type==='bg'?BASE_BGS:BASE_SPR)[key]||'');",
    "const assetUrl=(type,key)=>{if(!key)return'';if(/^https?:\\/\\//i.test(key)||key.startsWith('data:'))return resolveUrl(key);return resolveUrl((assets[type]&&assets[type][key])||(type==='bg'?BASE_BGS:BASE_SPR)[key]||key||'');};"
  );
  // null-safe event bindings
  code=code.replace(
    "].forEach(id=>$('#'+id).oninput=()=>syncDisplay())",
    "].forEach(id=>{const el=$('#'+id);if(el)el.oninput=()=>syncDisplay()})"
  );
  code=code.replace(
    "].forEach(k=>$('#'+k).value=settings[k])",
    "].forEach(k=>{const el=$('#'+k);if(el)el.value=(settings[k]!=null?settings[k]:'')})"
  );
  code=code.replace(
    "['chapterId','chapterNo','chapterName','chapterMusic','chapterIntro','chapterOutro'].forEach(id=>$('#'+id).oninput=syncChapter)",
    "['chapterId','chapterNo','chapterName','chapterMusic','chapterIntro','chapterOutro'].forEach(id=>{const el=$('#'+id);if(el)el.oninput=syncChapter})"
  );
  code=code.replace(
    "['sceneId','sceneName','bg','place','streetUrl','streetLat','streetLng','streetHeading','streetPitch','streetZoom','iframeUrl','requirements','effects','sceneMusic'].forEach(id=>$('#'+id).oninput=syncScene)",
    "['sceneId','sceneName','bg','place','streetUrl','streetLat','streetLng','streetHeading','streetPitch','streetZoom','sceneMedia','iframeUrl','requirements','effects','sceneMusic'].forEach(id=>{const el=$('#'+id);if(el)el.oninput=syncScene})"
  );
  code=code.replace(
    "Object.values(sf).forEach(e=>e.oninput=syncSettings)",
    "Object.values(sf).forEach(e=>{if(e)e.oninput=syncSettings})"
  );
  // selectScene: load media field
  code=code.replace(
    "$('#iframeUrl').value=s.iframeUrl||'';",
    "$('#sceneMedia').value=s.media||'';$('#iframeUrl').value=s.iframeUrl||'';"
  );
  // syncScene: save media field
  code=code.replace(
    "s.iframeUrl=$('#iframeUrl').value;",
    "s.media=($('#sceneMedia')&&$('#sceneMedia').value||'').trim();s.iframeUrl=$('#iframeUrl').value;"
  );

  // === Stats visibility: load into form when opening settings ===
  code=code.replace(
    "Object.entries(sf).forEach(([k,e])=>e.value=settings[k]||'');",
    "Object.entries(sf).forEach(([k,e])=>{if(e)e.value=settings[k]||''});"+
    "['showMoney','showScore','showAffection'].forEach(k=>{const el=$('#'+k);if(el)el.value=(settings[k]===0||settings[k]==='0')?'0':'1'});"+
    "['moneyLabel','scoreLabel','affectionLabel'].forEach(k=>{const el=$('#'+k);if(el)el.value=settings[k]||el.placeholder||''});"+
    "['defaultMoney','defaultScore','defaultAffection'].forEach(k=>{const el=$('#'+k);if(el)el.value=settings[k]!=null?settings[k]:0});"
  );

  // === Stats visibility: save from form into settings ===
  code=code.replace(
    "function syncSettings(){Object.entries(sf).forEach(([k,e])=>settings[k]=e.value);",
    "function syncStatsFields(){"+
    "['showMoney','showScore','showAffection'].forEach(k=>{const el=$('#'+k);if(el)settings[k]=el.value});"+
    "['moneyLabel','scoreLabel','affectionLabel'].forEach(k=>{const el=$('#'+k);if(el)settings[k]=el.value});"+
    "['defaultMoney','defaultScore','defaultAffection'].forEach(k=>{const el=$('#'+k);if(el)settings[k]=+el.value||0});"+
    "}\nfunction syncSettings(){Object.entries(sf).forEach(([k,e])=>{if(e)settings[k]=e.value});syncStatsFields();"
  );

  // Always sync stats on save, even if not currently on settings form
  code=code.replace(
    "async function save(kind='draft'){if(mode==='settings')syncSettings();if(mode==='chapter')syncChapter();if(mode==='scene')syncScene();",
    "async function save(kind='draft'){if(mode==='settings')syncSettings();else if(typeof syncStatsFields==='function')syncStatsFields();if(mode==='chapter')syncChapter();if(mode==='scene')syncScene();"
  );

  // Wire change handlers for stats fields after main bindings
  code=code.replace(
    "$('#analyseStreetBtn').onclick=analyseStreetUrl;",
    "$('#analyseStreetBtn').onclick=analyseStreetUrl;"+
    "['showMoney','showScore','showAffection','moneyLabel','scoreLabel','affectionLabel','defaultMoney','defaultScore','defaultAffection'].forEach(id=>{const el=$('#'+id);if(el){el.onchange=()=>{syncStatsFields();mark('數值列設定已修改')};el.oninput=()=>{syncStatsFields();mark('數值列設定已修改')}}});"
  );

  return import(URL.createObjectURL(new Blob([code],{type:'text/javascript'})));
}).catch(e=>{
  console.error(e);
  const m=document.getElementById('loginMsg');
  if(m) m.textContent='Load failed: '+e.message;
});
