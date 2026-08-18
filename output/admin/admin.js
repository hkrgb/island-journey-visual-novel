const SRC='https://raw.githubusercontent.com/hkrgb/island-journey-visual-novel/c5fceb05455bae9a3d049ccf5b46260c33ef23c3/output/admin/admin.js';
fetch(SRC+'?t='+Date.now())
  .then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text()})
  .then(code=>{
    const blob=new Blob([code],{type:'text/javascript'});
    return import(URL.createObjectURL(blob));
  })
  .catch(e=>{
    console.error(e);
    const m=document.getElementById('loginMsg');
    if(m)m.textContent='載入後台失敗：'+e.message;
  });
