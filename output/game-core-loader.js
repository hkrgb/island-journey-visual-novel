(function(){
const SRC='https://raw.githubusercontent.com/hkrgb/island-journey-visual-novel/9704ab0555720fcf106334e6ff98b974e69bd225/output/game-core.js';
fetch(SRC+'?t='+Date.now()).then(function(r){
  if(!r.ok)throw new Error('HTTP '+r.status);
  return r.text();
}).then(function(code){
  var s=document.createElement('script');
  s.textContent=code;
  document.body.appendChild(s);
  console.log('game-core loaded from 9704ab');
  var p=document.createElement('script');
  p.src='game-preload.js?v=2';
  document.body.appendChild(p);
}).catch(function(e){console.error('game-core load failed',e)});
})();
