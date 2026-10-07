/* Only the fishing embed opts in; standalone visual novels keep their UI. */
(()=>{
 const q=new URLSearchParams(location.search),origin=q.get('parentOrigin'),session=q.get('session'),game=q.get('game');
 if(q.get('fishing')!=='1'||parent===window||!['https://play.rgb-workshop.com','https://hkrgb.github.io','https://appassets.androidplatform.net'].includes(origin)||!session||game!=='拋海星的人-musby6ef')return;
 document.documentElement.classList.add('fishingEmbed');
 const send=type=>parent.postMessage({channel:'island-theatre',type,game,session},origin);
 const style=document.createElement('style');style.textContent='.fishingEmbed .topbar,.fishingEmbed #mobile-fullscreen,.fishingEmbed #orientation-lock,.fishingEmbed #game-menu,.fishingEmbed #title{display:none!important}.fishingEmbed #app{width:100vw!important;height:100vh!important;max-width:none!important;max-height:none!important;aspect-ratio:auto!important}.fishingEmbed .sprite{max-height:82vh}.fishingEmbed .textbox{bottom:14px}';document.head.append(style);
 const fontKey='island-theatre-font-size',sizes={small:22,medium:28,large:34};let fontSize='small';
 try{const saved=localStorage.getItem(fontKey);if(saved in sizes)fontSize=saved;}catch{}
 style.textContent+='.fishingEmbed #dialogue{font-size:var(--theatre-font-size,22px)!important;line-height:1.65!important}.fishingEmbed .textbox{max-height:55vh;overflow-y:auto}.theatreFontControls{position:fixed;top:10px;right:14px;z-index:999;display:flex;gap:6px;padding:6px;background:#082b3ddd;border-radius:12px;color:white;align-items:center;font:16px sans-serif}.theatreFontControls button{min-width:42px;min-height:38px;border:1px solid #adcbd6;border-radius:7px;background:#fff;color:#13485c;font:18px sans-serif}.theatreFontControls button[aria-pressed=true]{background:#ffe29c;border-color:#ffcd57}';
 const controls=document.createElement('div');controls.className='theatreFontControls';controls.setAttribute('role','group');controls.setAttribute('aria-label','小劇場文字大小');controls.innerHTML='<span>文字</span>';
 function setFont(size){fontSize=size;document.documentElement.dataset.theatreFontSize=size;window.dispatchEvent(new Event('resize'));document.documentElement.style.setProperty('--theatre-font-size',sizes[size]+'px');controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.size===size)));try{localStorage.setItem(fontKey,size);}catch{}}
 for(const [size,label] of [['small','小'],['medium','中'],['large','大']]){const b=document.createElement('button');b.textContent=label;b.dataset.size=size;b.setAttribute('aria-label','文字大小：'+label);b.onclick=e=>{e.stopPropagation();setFont(size);};controls.append(b);}
 controls.addEventListener('pointerdown',e=>e.stopPropagation());document.body.append(controls);setFont(fontSize);
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
