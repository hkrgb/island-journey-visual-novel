(function(){
  function apply(){
    if(typeof setSprite!=='function')return false;
    if(setSprite.layoutControls)return true;
    const original=setSprite;
    window.setSprite=function(scene){
      original(scene);
      const scale=Math.max(10,Math.min(250,Number(scene.spriteScale??100)))/100;
      const x=Math.max(-100,Math.min(100,Number(scene.spriteX??0)));
      const y=Math.max(-100,Math.min(100,Number(scene.spriteY??0)));
      document.querySelectorAll('#spriteL,#spriteR').forEach(el=>{
        if(scene.side==='center'){el.style.left='24%';el.style.right='auto'}
        else{el.style.left='';el.style.right=''}
        const stage=document.getElementById('app');
        el.style.translate=(x*stage.clientWidth/100)+'px '+(-y*stage.clientHeight/100)+'px';
        el.style.scale=String(scale);
        el.style.transformOrigin='center bottom';
      });
    };
    window.setSprite.layoutControls=true;
    return true;
  }
  let attempts=0;function wait(){if(!apply()&&++attempts<200)setTimeout(wait,100)}wait();
})();
