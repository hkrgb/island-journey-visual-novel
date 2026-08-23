(async()=>{
  const a=await(await fetch('admin-p0.js?v=1')).text();
  const b=await(await fetch('admin-p1.js?v=1')).text();
  await import(URL.createObjectURL(new Blob([a+b],{type:'text/javascript'})));
})().catch(e=>{console.error(e);const m=document.getElementById('loginMsg');if(m)m.textContent='Load failed: '+e.message});
