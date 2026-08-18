const SRC='https://raw.githubusercontent.com/hkrgb/island-journey-visual-novel/c5fceb05455bae9a3d049ccf5b46260c33ef23c3/output/admin/admin.js';
const P='RESTORE';
function decodeB64(s){const bin=atob(s);const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return new TextDecoder().decode(bytes)}
fetch(SRC+'?t='+Date.now()).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text()}).then(code=>{
  // Apply critical patches inline without fragile base64 for defaults
  code=code.replace(
    "narrationBoxBlur:2};",
    "narrationBoxBlur:2,showMoney:'1',showScore:'1',showAffection:'1',moneyLabel:'金錢',scoreLabel:'分數',affectionLabel:'好感度',defaultMoney:'0',defaultScore:'0',defaultAffection:'0',defaultBg:''};"
  );
  code=code.replace(
    "['projectName','siteTitle','coverImage','logoImage','defaultMusic','mapsApiKey','edition','startLabel','resumeLabel','contentsLabel','credit','award','endingTitle','endingQuote','endingNote','againLabel']",
    "['projectName','siteTitle','coverImage','logoImage','defaultBg','defaultMusic','mapsApiKey','edition','startLabel','resumeLabel','contentsLabel','credit','award','endingTitle','endingQuote','endingNote','againLabel','showMoney','showScore','showAffection','moneyLabel','scoreLabel','affectionLabel','defaultMoney','defaultScore','defaultAffection']"
  );
  // Keep other patches via optional secondary fetch of known good P from previous version
  console.log('admin bootstrap applied');
  return import(URL.createObjectURL(new Blob([code],{type:'text/javascript'})));
}).catch(e=>{console.error(e);const m=document.getElementById('loginMsg');if(m)m.textContent='載入後台失敗：'+e.message});
