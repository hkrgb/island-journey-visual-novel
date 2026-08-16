(async()=>{
 try{
  let p=null;
  const preview=localStorage.getItem('islandAdminPreview');
  if(preview&&new URLSearchParams(location.search).has('preview')) p=JSON.parse(preview);
  else{
   const response=await fetch('https://firestore.googleapis.com/v1/projects/island-journey-rgb/databases/(default)/documents/content/published');
   if(response.ok){const data=await response.json(),raw=data.fields?.payload?.stringValue;if(raw)p=JSON.parse(raw)}
  }
  if(p){
   const refs=[...Object.values(p.assets?.bg||{}),...Object.values(p.assets?.sprite||{}),p.settings?.coverImage,p.settings?.logoImage].filter(v=>v?.startsWith?.('firestore:'));
   const cache={};
   await Promise.all([...new Set(refs)].map(async ref=>{const id=ref.slice(10),response=await fetch(`https://firestore.googleapis.com/v1/projects/island-journey-rgb/databases/(default)/documents/media/${encodeURIComponent(id)}`);if(response.ok){const data=await response.json();cache[ref]=data.fields?.dataUrl?.stringValue||''}}));
   const resolve=value=>cache[value]||value;
   window.STORY=(p.story||[]).flatMap(scene=>Array.isArray(scene.lines)?scene.lines.map((line,index)=>{const item={...scene,...line};delete item.lines;if(index>0){delete item.c;delete item.start;delete item.place}if(index<scene.lines.length-1)delete item.end;return item}):[scene]);
   window.CHAPTERS=p.chapters||window.CHAPTERS;
   window.GAME_SETTINGS=p.settings||{};
   window.GAME_ASSETS={bg:Object.fromEntries(Object.entries(p.assets?.bg||{}).map(([k,v])=>[k,resolve(v)])),sprite:Object.fromEntries(Object.entries(p.assets?.sprite||{}).map(([k,v])=>[k,resolve(v)]))};
   if(window.GAME_SETTINGS.coverImage)window.GAME_SETTINGS.coverImage=resolve(window.GAME_SETTINGS.coverImage);
   if(window.GAME_SETTINGS.logoImage)window.GAME_SETTINGS.logoImage=resolve(window.GAME_SETTINGS.logoImage);
  }
 }catch(e){console.warn('Using bundled story',e)}
 finally{const script=document.createElement('script');script.src='game-core.js?v=11';document.body.appendChild(script)}
})();
