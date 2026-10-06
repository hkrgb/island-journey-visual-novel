/* Only the fishing embed opts in; standalone visual novels keep their UI. */
(()=>{
 const q=new URLSearchParams(location.search),origin=q.get('parentOrigin'),session=q.get('session'),game=q.get('game');
 if(q.get('fishing')!=='1'||parent===window||!['https://play.rgb-workshop.com','https://hkrgb.github.io','https://appassets.androidplatform.net'].includes(origin)||!session||game!=='拋海星的人-musby6ef')return;
 document.documentElement.classList.add('fishingEmbed');
 const send=type=>parent.postMessage({channel:'island-theatre',type,game,session},origin);
 const style=document.createElement('style');style.textContent='.fishingEmbed .topbar,.fishingEmbed #mobile-fullscreen,.fishingEmbed #orientation-lock,.fishingEmbed #game-menu,.fishingEmbed #title{display:none!important}.fishingEmbed #app{width:100vw!important;height:100vh!important;max-width:none!important;max-height:none!important;aspect-ratio:auto!important}.fishingEmbed .sprite{max-height:82vh}.fishingEmbed .textbox{bottom:14px}';document.head.append(style);
 let started=false,completed=false,tries=0;
 const timer=setInterval(()=>{
  if(window.FISHING_CONTENT_FAILED){clearInterval(timer);send('error');return;}
  if(!window.FISHING_CONTENT_READY||typeof window.start!=='function'||!window.start.__preloadWrapped){if(++tries>180){clearInterval(timer);send('error');}return;}
  clearInterval(timer);started=true;send('ready');window.start(true,0);
 },200);
 const observer=new MutationObserver(()=>{if(started&&!completed&&document.querySelector('#ending.active')){completed=true;send('complete');}});
 observer.observe(document.getElementById('ending'),{attributes:true,attributeFilter:['class']});
})();
