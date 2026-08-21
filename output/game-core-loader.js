(function(){
const SRC='https://raw.githubusercontent.com/hkrgb/island-journey-visual-novel/main/output/game-core.js';
fetch(SRC+'?t='+Date.now()).then(function(r){
  if(!r.ok)throw new Error('HTTP '+r.status);
  return r.text();
}).then(function(code){
  var s=document.createElement('script');
  s.textContent=code;
  document.body.appendChild(s);
  console.log('game-core loaded');
}).catch(function(e){console.error('game-core load failed',e)});
})();
