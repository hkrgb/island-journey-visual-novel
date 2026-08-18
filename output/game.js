(async()=>{
 try{
  let p=null;
  const gameId=new URLSearchParams(location.search).get('game')||'island-journey';window.GAME_ID=gameId;
  const preview=localStorage.getItem('islandAdminPreview');
  if(preview&&new URLSearchParams(location.search).has('preview')) p=JSON.parse(preview);
  else if(gameId==='media-demo'){
   p=structuredClone(window.MEDIA_DEMO);
   const response=await fetch('https://firestore.googleapis.com/v1/projects/island-journey-rgb/databases/(default)/documents/content/published');
   if(response.ok){const data=await response.json(),raw=data.fields?.payload?.stringValue;if(raw)p.settings.mapsApiKey=JSON.parse(raw).settings?.mapsApiKey||''}
  }
  else{
   const path=gameId==='island-journey'?'content/published':`projects/${encodeURIComponent(gameId)}/content/published`;
   const response=await fetch('https://firestore.googleapis.com/v1/projects/island-journey-rgb/databases/(default)/documents/'+path);
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
   window.GAME_CHARACTERS=p.characters||[];
   window.GAME_ASSETS={bg:Object.fromEntries(Object.entries(p.assets?.bg||{}).map(([k,v])=>[k,resolve(v)])),sprite:Object.fromEntries(Object.entries(p.assets?.sprite||{}).map(([k,v])=>[k,resolve(v)]))};
   if(window.GAME_SETTINGS.coverImage)window.GAME_SETTINGS.coverImage=resolve(window.GAME_SETTINGS.coverImage);
   if(window.GAME_SETTINGS.logoImage)window.GAME_SETTINGS.logoImage=resolve(window.GAME_SETTINGS.logoImage);
  }
 }catch(e){console.warn('Using bundled story',e)}
 finally{const script=document.createElement('script');script.src='game-core.js?v=21';script.onload=function(){var p=document.createElement('script');p.src='stats-overlay.js?v=1';document.body.appendChild(p)};document.body.appendChild(script)}
})();
