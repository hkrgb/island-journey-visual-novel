const SRC='https://raw.githubusercontent.com/hkrgb/island-journey-visual-novel/c5fceb05455bae9a3d049ccf5b46260c33ef23c3/output/admin/admin.js';
const REPLACEMENTS=[
  ["selectedFolder='characters',autoSaveTimer=null;","selectedFolder='characters',autoSaveTimer=null,expandedChar=-1;"],
];

fetch(SRC+'?t='+Date.now())
  .then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text()})
  .then(async code=>{
    // Load patches from companion file to keep this loader small
    const patchUrl='admin-patches.js?v=1';
    try {
      const p = await fetch(patchUrl).then(r=>r.ok?r.text():null);
      if(p){
        const patches = (new Function(p+';\nreturn PATCHES;'))();
        for(const [old,neu] of patches){
          if(code.indexOf(old)<0){console.warn('patch miss', old.slice(0,50));continue}
          code=code.replace(old,neu);
        }
      }
    } catch(e){console.warn('patches optional', e)}
    for(const [old,neu] of REPLACEMENTS){
      if(code.indexOf(old)<0)continue;
      code=code.replace(old,neu);
    }
    const blob=new Blob([code],{type:'text/javascript'});
    return import(URL.createObjectURL(blob));
  })
  .catch(e=>{
    console.error(e);
    const m=document.getElementById('loginMsg');
    if(m)m.textContent='載入後台失敗：'+e.message;
  });
