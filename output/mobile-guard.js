(function(){
  function isTouchMobile(){
    return (navigator.maxTouchPoints>0 || 'ontouchstart' in window) &&
      Math.min(screen.width, screen.height) <= 920;
  }
  function isPortrait(){
    try{
      if(window.matchMedia){
        if(window.matchMedia('(orientation: portrait)').matches) return true;
        if(window.matchMedia('(orientation: landscape)').matches) return false;
      }
    }catch(e){}
    return window.innerHeight >= window.innerWidth;
  }
  function apply(){
    var lock=document.getElementById('orientation-lock');
    var fs=document.getElementById('mobile-fullscreen');
    if(!lock && !fs) return;
    var mobile=isTouchMobile();
    var portrait=isPortrait();

    if(lock){
      if(mobile && portrait){
        lock.style.display='grid';
        lock.setAttribute('data-active','1');
      }else{
        lock.style.display='none';
        lock.removeAttribute('data-active');
      }
    }
    if(fs){
      if(mobile && !portrait && !fs.classList.contains('entered')){
        fs.style.display='grid';
        fs.setAttribute('data-active','1');
      }else if(fs.classList.contains('entered') || !mobile || portrait){
        if(portrait || !mobile || fs.classList.contains('entered')){
          fs.style.display='none';
          fs.removeAttribute('data-active');
        }
      }
    }
  }

  function wireBtn(){
    var btn=document.getElementById('mobileFullscreenBtn');
    if(!btn || btn.__wired) return;
    btn.__wired=true;
    btn.addEventListener('click', async function(){
      var fs=document.getElementById('mobile-fullscreen');
      try{
        if(!document.fullscreenElement && document.documentElement.requestFullscreen){
          await document.documentElement.requestFullscreen();
        }
        if(screen.orientation && screen.orientation.lock){
          await screen.orientation.lock('landscape').catch(function(){});
        }
      }catch(e){ console.warn('Mobile fullscreen unavailable', e); }
      finally{
        if(fs){ fs.classList.add('entered'); fs.style.display='none'; }
      }
    });
  }

  function boot(){
    wireBtn();
    apply();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.addEventListener('resize', apply);
  window.addEventListener('orientationchange', function(){ setTimeout(apply, 100); setTimeout(apply, 400); });
  if(window.matchMedia){
    try{
      window.matchMedia('(orientation: portrait)').addEventListener('change', apply);
    }catch(e){
      try{ window.matchMedia('(orientation: portrait)').addListener(apply); }catch(e2){}
    }
  }
  setTimeout(apply, 200);
  setTimeout(apply, 800);
})();
