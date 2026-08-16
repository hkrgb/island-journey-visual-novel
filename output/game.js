(async()=>{
 try{
  const preview=localStorage.getItem('islandAdminPreview');
  if(preview&&new URLSearchParams(location.search).has('preview')){
   const p=JSON.parse(preview);window.STORY=p.story;window.CHAPTERS=p.chapters||window.CHAPTERS;
  }else{
   const r=await fetch('https://firestore.googleapis.com/v1/projects/island-journey-rgb/databases/(default)/documents/content/published');
   if(r.ok){const d=await r.json(),raw=d.fields?.payload?.stringValue;if(raw){const p=JSON.parse(raw);window.STORY=p.story;window.CHAPTERS=p.chapters||window.CHAPTERS}}
  }
 }catch(e){console.warn('Using bundled story',e)}
 finally{const s=document.createElement('script');s.src='game-core.js';document.body.appendChild(s)}
})();
