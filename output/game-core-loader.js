(function(){
function loadCore(code){
  var s=document.createElement('script');
  s.textContent=code;
  document.body.appendChild(s);
  console.log('game-core loaded', code.length);
}
var base='https://raw.githubusercontent.com/hkrgb/island-journey-visual-novel/main/output/';
Promise.all([
  fetch(base+'game-core.b64.1?t='+Date.now()).then(function(r){return r.text()}),
  fetch(base+'game-core.b64.2?t='+Date.now()).then(function(r){return r.text()})
]).then(function(parts){
  try{
    var bin=atob(parts[0]+parts[1]);
    var bytes=new Uint8Array(bin.length);
    for(var i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
    var code=new TextDecoder('utf-8').decode(bytes);
    loadCore(code);
  }catch(e){console.error('game-core decode failed',e)}
}).catch(function(e){console.error('game-core load failed',e)});
})();
