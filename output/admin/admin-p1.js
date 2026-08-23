  // Wire change handlers for stats fields after main bindings
  code=code.replace(
    "$('#analyseStreetBtn').onclick=analyseStreetUrl;",
    "$('#analyseStreetBtn').onclick=analyseStreetUrl;"+
    "['showMoney','showScore','showAffection','moneyLabel','scoreLabel','affectionLabel','defaultMoney','defaultScore','defaultAffection'].forEach(id=>{const el=$('#'+id);if(el){el.onchange=()=>{syncStatsFields();mark('數值列設定已修改')};el.oninput=()=>{syncStatsFields();mark('數值列設定已修改')}}});"
  );

  // === BGM volume ===
  code=code.replace(
    "['projectName','siteTitle','coverImage','logoImage','defaultMusic','mapsApiKey','edition','startLabel','resumeLabel','contentsLabel','credit','award','endingTitle','endingQuote','endingNote','againLabel']",
    "['projectName','siteTitle','coverImage','logoImage','defaultBg','defaultMusic','mapsApiKey','edition','startLabel','resumeLabel','contentsLabel','credit','award','endingTitle','endingQuote','endingNote','againLabel','bgmVolume']"
  );
  code=code.replace(
    "defaultMusic:'',mapsApiKey:''",
    "defaultMusic:'',bgmVolume:40,mapsApiKey:''"
  );
  code=code.replace(
    "Object.entries(sf).forEach(([k,e])=>{if(e)e.value=settings[k]||''});",
    "Object.entries(sf).forEach(([k,e])=>{if(!e)return;if(k==='bgmVolume'){e.value=settings.bgmVolume!=null?settings.bgmVolume:40;const lb=$('#bgmVolumeLabel');if(lb)lb.textContent=e.value}else e.value=settings[k]||''});"
  );
  code=code.replace(
    "function syncSettings(){Object.entries(sf).forEach(([k,e])=>{if(e)settings[k]=e.value});syncStatsFields();",
    "function syncSettings(){Object.entries(sf).forEach(([k,e])=>{if(!e)return;settings[k]=k==='bgmVolume'?(+e.value||0):e.value});"+
    "const lb=$('#bgmVolumeLabel');if(lb&&sf.bgmVolume)lb.textContent=sf.bgmVolume.value;syncStatsFields();"
  );
  code=code.replace(
    "Object.values(sf).forEach(e=>{if(e)e.oninput=syncSettings})",
    "Object.values(sf).forEach(e=>{if(e)e.oninput=syncSettings});"+
    "(function(){const el=$('#bgmVolume');if(el){el.oninput=()=>{syncSettings();const lb=$('#bgmVolumeLabel');if(lb)lb.textContent=el.value}}})();"
  );

  // === Keep stats hide settings: hydrate form FROM settings after load ===
  code=code.replace(
    "settings={...DEFAULT_SETTINGS,...data.settings};",
    "settings={...DEFAULT_SETTINGS,...data.settings};(function(){try{['showMoney','showScore','showAffection'].forEach(function(k){var el=$('#'+k);if(!el)return;var v=settings[k];el.value=(v===0||v==='0'||v===false||v==='false')?'0':'1'});['moneyLabel','scoreLabel','affectionLabel'].forEach(function(k){var el=$('#'+k);if(el)el.value=settings[k]||el.placeholder||''});['defaultMoney','defaultScore','defaultAffection'].forEach(function(k){var el=$('#'+k);if(el)el.value=settings[k]!=null?settings[k]:0});}catch(e){}})();"
  );

  // Clearer draft vs publish status
  code=code.replace(
    "dirty=false;setStatus(kind==='published'?'已正式發布':'草稿已儲存')}",
    "dirty=false;if(kind==='published'){setStatus('✅ 已正式發布 — 玩家端已更新')}else{setStatus('📝 草稿已儲存（玩家端仍用舊版，請按「發布」才會生效）')}}"
  );
  // Auto-save hint
  code=code.replace(
    "function mark(t='內容已修改'){dirty=true;setStatus(t);if(autoSaveTimer)clearTimeout(autoSaveTimer);autoSaveTimer=setTimeout(()=>{if(dirty)save('draft')},45000)}",
    "function mark(t='內容已修改'){dirty=true;setStatus(t+'（約45秒後自動存草稿）');if(autoSaveTimer)clearTimeout(autoSaveTimer);autoSaveTimer=setTimeout(function(){if(dirty){setStatus('正在自動存草稿…');save('draft')}},45000)}"
  );

  return import(URL.createObjectURL(new Blob([code],{type:'text/javascript'})));
}).catch(e=>{
  console.error(e);
  const m=document.getElementById('loginMsg');
  if(m) m.textContent='Load failed: '+e.message;
});
