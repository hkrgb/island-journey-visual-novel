/* Only the fishing embed opts in; standalone visual novels keep their UI. */
(()=>{
 const q=new URLSearchParams(location.search),origin=q.get('parentOrigin'),session=q.get('session'),game=q.get('game');
 if(q.get('fishing')!=='1'||parent===window||!['https://play.rgb-workshop.com','https://hkrgb.github.io','https://appassets.androidplatform.net'].includes(origin)||!session||!['拋海星的人-musby6ef','給爸爸的生日禮物-mv1wlsxc'].includes(game))return;
 document.documentElement.classList.add('fishingEmbed');
 const send=type=>parent.postMessage({channel:'island-theatre',type,game,session},origin);
 const style=document.createElement('style');style.textContent='.fishingEmbed .topbar,.fishingEmbed #mobile-fullscreen,.fishingEmbed #orientation-lock,.fishingEmbed #game-menu,.fishingEmbed #title{display:none!important}.fishingEmbed #app{width:100vw!important;height:100vh!important;max-width:none!important;max-height:none!important;aspect-ratio:auto!important}.fishingEmbed .sprite{max-height:82vh}.fishingEmbed .textbox{bottom:14px}';document.head.append(style);
 const fontKey='island-theatre-font-size',sizes={small:22,medium:28,large:34};let fontSize='small';
 try{const saved=localStorage.getItem(fontKey);if(saved in sizes)fontSize=saved;}catch{}
 style.textContent+='.fishingEmbed .textbox{max-height:none;overflow:visible!important}.fishingEmbed #dialogue{line-height:1.65!important;max-height:32vh;overflow-y:auto;overscroll-behavior:contain;padding-right:8px}.fishingEmbed .nameplate{max-width:90%;overflow:visible}';
 function setFont(size){if(!(size in sizes))return;fontSize=size;document.documentElement.dataset.theatreFontSize=size;window.dispatchEvent(new Event('resize'));try{localStorage.setItem(fontKey,size);}catch{}}
 addEventListener('message',event=>{const d=event.data;if(event.source===parent&&event.origin===origin&&d?.channel==='island-theatre'&&d.game===game&&d.session===session&&d.type==='font-size')setFont(d.size);});setFont(fontSize);
 let started=false,completed=false,tries=0;
 const timer=setInterval(()=>{
  if(window.FISHING_CONTENT_FAILED){clearInterval(timer);send('error');return;}
  if(!window.FISHING_CONTENT_READY||typeof window.start!=='function'||!window.start.__preloadWrapped){if(++tries>180){clearInterval(timer);send('error');}return;}
  // The legacy core asks for the next chapter even after the final line.
  // Clamp that lookup so next() can reach render() and finish() normally.
  const chapterLookup=window.chapterOf;
  if(typeof chapterLookup==='function')window.chapterOf=index=>chapterLookup(Math.max(0,Math.min(index,window.STORY.length-1)));
  clearInterval(timer);started=true;send('ready');window.start(true,0);
 },200);
 const observer=new MutationObserver(()=>{if(started&&!completed&&document.querySelector('#ending.active')){completed=true;send('complete');}});
 observer.observe(document.getElementById('ending'),{attributes:true,attributeFilter:['class']});
})();
